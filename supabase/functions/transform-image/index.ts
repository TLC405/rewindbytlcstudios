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

    const { imageBase64, scenarioId, userId, transformationId, isPreview } = await req.json();

    // userId is optional for preview/anonymous mode
    if (!imageBase64 || !scenarioId) {
      throw new Error('Missing required fields: imageBase64, scenarioId');
    }

    const isAnonymous = !userId;
    console.log(`Starting transformation for ${isAnonymous ? 'anonymous user' : `user ${userId}`}, scenario ${scenarioId}`);

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

    // Build the ULTRA face-lock prompt
    const ultraPrompt = buildUltraFaceLockPrompt(scenario);

    console.log('Calling Lovable AI for ULTRA transformation...');
    console.log('Prompt preview:', ultraPrompt.substring(0, 500));

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
                text: ultraPrompt
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
      console.error('No image in response:', JSON.stringify(data).substring(0, 500));
      throw new Error('No image generated from AI');
    }

    // Upload the generated image to storage
    const imageData = generatedImageUrl.split(',')[1];
    const imageBuffer = Uint8Array.from(atob(imageData), c => c.charCodeAt(0));
    // Use anonymous folder for preview mode
    const storagePath = isAnonymous ? 'anonymous' : userId;
    const fileName = `${storagePath}/${transformationId || Date.now()}_transformed.png`;

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
          prompt_used: ultraPrompt.substring(0, 5000)
        })
        .eq('id', transformationId);
    }

    // Deduct credit from user (skip for anonymous/preview mode)
    if (!isAnonymous && userId) {
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
    }

    console.log('ULTRA transformation completed successfully');

    return new Response(JSON.stringify({ 
      success: true,
      transformedImageUrl,
      message: data.choices?.[0]?.message?.content || 'Legendary transformation complete!'
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

function buildUltraFaceLockPrompt(scenario: { title: string; era: string; prompt_template: string }): string {
  return `
═══════════════════════════════════════════════════════════════════════════════
⚡ ATOMIC IDENTITY LOCK PROTOCOL - ABSOLUTE NON-NEGOTIABLE RULES ⚡
═══════════════════════════════════════════════════════════════════════════════

RULE 0: GENDER IS SACRED - ABSOLUTE LOCK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Detect the EXACT gender/sex from the input photo FIRST
• Male in photo → Male in output (100% identical)
• Female in photo → Female in output (100% identical)
• NEVER EVER change, swap, or alter gender under ANY circumstance
• This rule OVERRIDES all scene descriptions and prompts
• If scene mentions opposite gender → IGNORE and use input gender

RULE 1: FACE IS SACRED - PIXEL-LEVEL LOCK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• The face from input = the ONLY face for the time traveler subject
• Copy EVERY feature: exact eye shape, exact eye color, exact eye spacing
• Copy EXACTLY: nose bridge, nose tip, nostril shape, nose width
• Copy EXACTLY: lip shape, lip thickness, lip color, mouth width
• Copy EXACTLY: jawline angle, chin shape, cheekbone height
• Copy EXACTLY: skin tone, skin texture, every freckle/mole/mark
• Copy EXACTLY: forehead shape, hairline pattern, ear shape
• If beard/stubble in input → beard/stubble in output
• If clean-shaven in input → clean-shaven in output
• The output person MUST be immediately recognizable as input person

RULE 2: BODY TYPE IS SACRED
━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Preserve approximate body build from input photo
• Do NOT make thinner, fatter, taller, or shorter
• Age should match input unless scene explicitly requires aging
• If input shows broad shoulders → output has broad shoulders
• If input shows slim build → output has slim build

RULE 3: ANTI-GENDER-SWAP VERIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Before generating, VERIFY:
□ Input gender detected correctly
□ Output gender will match input exactly
□ No feminine features added to male input
□ No masculine features added to female input
□ Facial hair status preserved from input

═══════════════════════════════════════════════════════════════════════════════
🎬 THE LEGENDARY SCENE: ${scenario.title}
⏰ ERA: ${scenario.era}
═══════════════════════════════════════════════════════════════════════════════

${scenario.prompt_template}

═══════════════════════════════════════════════════════════════════════════════
📸 OUTPUT REQUIREMENTS - CINEMATIC FILM QUALITY
═══════════════════════════════════════════════════════════════════════════════

PHOTOGRAPHY STYLE:
• Matte, filmic color palette - ABSOLUTELY NO NEON or oversaturated colors
• Authentic ${scenario.era} era photography aesthetic
• Natural film grain appropriate to the decade
• Warm, organic tones - nothing digital or modern looking
• Period-correct lighting and shadows

COMPOSITION:
• The time traveler (input person) is THE STAR, prominently placed
• Celebrities around them with their UNIQUE famous likenesses
• Candid, natural moment - NOT stiff posed studio shot
• Dynamic energy - people caught in motion/action

CELEBRITY REQUIREMENTS:
• Each celebrity MUST have their historically accurate face
• NO cloning - each person is distinctly unique
• Famous features preserved: Ali's jaw, MJ's nose, Elvis's hair, etc.

═══════════════════════════════════════════════════════════════════════════════
🔍 FINAL VERIFICATION BEFORE OUTPUT
═══════════════════════════════════════════════════════════════════════════════

□ Time traveler GENDER matches input photo EXACTLY
□ Time traveler FACE is 100% recognizable as input person
□ Time traveler BODY TYPE matches input photo
□ Time traveler FACIAL HAIR matches input photo
□ All celebrities are UNIQUE and RECOGNIZABLE
□ Scene feels authentic to ${scenario.era}
□ Matte, filmic look - NO neon, NO oversaturation
□ Natural candid energy - NOT stiff or posed

GENERATE THIS LEGENDARY MOMENT NOW.
`;
}
