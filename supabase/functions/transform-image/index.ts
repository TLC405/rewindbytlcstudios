import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { imageBase64, scenarioId, userId, transformationId } = await req.json();

    if (!imageBase64 || !scenarioId || !userId) {
      throw new Error('Missing required fields: imageBase64, scenarioId, userId');
    }

    console.log(`Starting transformation for user ${userId}, scenario ${scenarioId}`);

    // Get the scenario details
    const { data: scenario, error: scenarioError } = await supabase
      .from('scenarios')
      .select('*')
      .eq('id', scenarioId)
      .single();

    if (scenarioError || !scenario) {
      throw new Error('Scenario not found');
    }

    console.log(`Using scenario: ${scenario.title}`);

    // Build the atomic identity transformation prompt
    const atomicPrompt = buildAtomicPrompt(scenario.prompt_template);

    console.log('Calling Lovable AI for image generation...');

    // Call Lovable AI with image editing capability
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: atomicPrompt
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        modalities: ["image", "text"]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (response.status === 402) {
        throw new Error('Payment required. Please add credits to continue.');
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');

    const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!generatedImageUrl) {
      throw new Error('No image generated from AI');
    }

    // Upload the generated image to storage
    const imageData = generatedImageUrl.split(',')[1];
    const imageBuffer = Uint8Array.from(atob(imageData), c => c.charCodeAt(0));
    const fileName = `${userId}/${transformationId || Date.now()}_transformed.png`;

    const { error: uploadError } = await supabase.storage
      .from('transformations')
      .upload(fileName, imageBuffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error('Failed to upload transformed image');
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('transformations')
      .getPublicUrl(fileName);

    const transformedImageUrl = urlData.publicUrl;

    // Update transformation record if ID provided
    if (transformationId) {
      await supabase
        .from('transformations')
        .update({
          transformed_image_url: transformedImageUrl,
          status: 'completed',
          prompt_used: atomicPrompt
        })
        .eq('id', transformationId);
    }

    // Deduct credit from user
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('user_id', userId)
      .single();
    
    if (profile && profile.credits > 0) {
      await supabase
        .from('profiles')
        .update({ credits: profile.credits - 1 })
        .eq('user_id', userId);
    }

    console.log('Transformation completed successfully');

    return new Response(JSON.stringify({ 
      success: true,
      transformedImageUrl,
      message: data.choices?.[0]?.message?.content || 'Transformation complete!'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Transform error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function buildAtomicPrompt(scenarioTemplate: string): string {
  return `ATOMIC IDENTITY & ERA TRANSFORMATION PROTOCOL

CRITICAL DIRECTIVE - HYPER-ACCURATE FACIAL INTEGRITY:
You MUST treat the face in the provided image as the "Reference Person".
Preserve ALL facial features with PIXEL-PERFECT accuracy:
- Exact eye shape, color, spacing
- Precise nose structure and proportions
- Accurate lip shape and fullness
- Faithful skin texture and complexion
- Any facial hair (beard, mustache) preserved exactly
- Ear shape if visible
The face is SACRED and IMMUTABLE. No stylization, no aging, no modification.

ZERO-TOLERANCE BODY & ATTIRE OVERRIDE:
STRICTLY FORBIDDEN: Do NOT transfer ANY clothing, accessories, hairstyle, or body type from the original photo.
The body and outfit MUST be generated from scratch according to the scenario.
The ONLY element from the original photo is the face.

LEGENDARY SCENARIO:
${scenarioTemplate}

EXECUTION:
1. Extract the Reference Person's face with surgical precision
2. Generate an entirely new body, outfit, and pose matching the scenario
3. Seamlessly composite the preserved face onto the new body
4. Apply era-appropriate lighting, color grading, and atmosphere
5. Ensure photorealistic quality with cinematic composition

Generate this legendary transformation now.`;
}
