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

    // Build the LEGENDARY face-lock prompt
    const legendaryPrompt = buildLegendaryPrompt(scenario);

    console.log('Calling Lovable AI for LEGENDARY transformation...');
    console.log('Prompt preview:', legendaryPrompt.substring(0, 500));

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
                text: legendaryPrompt
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
          prompt_used: legendaryPrompt.substring(0, 5000)
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

    console.log('LEGENDARY transformation completed successfully');

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

function buildLegendaryPrompt(scenario: { title: string; era: string; prompt_template: string }): string {
  const expressions = [
    "genuine warm smile with eyes crinkled in joy",
    "confident knowing smirk with relaxed gaze",
    "mid-laugh captured in a candid moment",
    "cool collected expression radiating charisma",
    "excited bright-eyed look of amazement",
    "peaceful content smile among legends"
  ];
  
  const poses = [
    "standing center with confident presence",
    "leaning in like sharing a secret with friends",
    "arm casually around a celebrity's shoulder",
    "seated in prime position among the icons",
    "caught mid-gesture in animated conversation",
    "positioned prominently as the guest of honor"
  ];

  const eraHairstyles: Record<string, string[]> = {
    '1950s': ['slicked-back pompadour', 'neat side-parted style', 'classic rockabilly quiff', 'vintage finger waves'],
    '1960s': ['natural afro', 'mod bowl cut', 'bouffant style', 'sleek Jackie Kennedy-inspired'],
    '1970s': ['feathered Farrah Fawcett style', 'full disco afro', 'shaggy layers', 'center-parted flowing'],
    '1980s': ['big voluminous hair', 'crimped and teased style', 'mullet', 'asymmetric new wave cut'],
    '1990s': ['fresh fade', 'Rachel haircut layers', 'box braids', 'curtain bangs'],
    '2000s': ['sleek straightened', 'frosted tips', 'chunky highlights', 'emo side-swept fringe'],
    '2010s': ['modern undercut', 'beachy waves', 'top knot', 'natural textured curls']
  };

  const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
  const randomPose = poses[Math.floor(Math.random() * poses.length)];
  const eraStyles = eraHairstyles[scenario.era] || eraHairstyles['1980s'];
  const randomHairstyle = eraStyles[Math.floor(Math.random() * eraStyles.length)];

  return `⚡ LEGENDARY TIME-TRAVEL TRANSFORMATION ⚡

════════════════════════════════════════════════════════════════
🔒 RULE #1: FACE-LOCK PROTOCOL (ABSOLUTELY NON-NEGOTIABLE)
════════════════════════════════════════════════════════════════

Analyze the uploaded photo. This person is YOUR SUBJECT - the time traveler.

PRESERVE WITH 100% PIXEL-PERFECT ACCURACY:
✓ Exact eye shape, color, spacing, lid structure
✓ Precise nose - bridge, tip, nostrils, all proportions
✓ Exact lip shape, thickness, natural color
✓ Jawline, chin, cheekbones - every contour
✓ Skin tone, texture, pores, any marks/moles/freckles
✓ Facial hair if present - exact pattern and density
✓ Ears, forehead shape, face proportions

This face is SACRED. Do not modify ANY facial feature.

════════════════════════════════════════════════════════════════
🚫 RULE #2: MANDATORY REMOVAL (STRIP FROM ORIGINAL PHOTO)
════════════════════════════════════════════════════════════════

REMOVE AND REPLACE - DO NOT TRANSFER FROM ORIGINAL:

❌ HAT/CAP/HEADWEAR → REMOVE 100%. Show full head with new hair.
❌ CURRENT HAIRSTYLE → REMOVE. Generate ${randomHairstyle} for ${scenario.era}
❌ GLASSES/SUNGLASSES → REMOVE (unless vintage style fits scene)
❌ ALL CLOTHING → REMOVE. Generate fresh ${scenario.era} fashion
❌ BODY SHAPE → GENERATE new natural body for scene
❌ ACCESSORIES → REMOVE. Generate era-appropriate items only
❌ BACKGROUND → REMOVE. Use scene setting only
❌ POSE/POSTURE → GENERATE fresh natural pose

YOU KEEP ONLY THE FACE. Everything else is freshly generated for ${scenario.era}.

════════════════════════════════════════════════════════════════
🌟 THE LEGENDARY MOMENT: ${scenario.title}
🕐 ERA: ${scenario.era}
════════════════════════════════════════════════════════════════

${scenario.prompt_template}

════════════════════════════════════════════════════════════════
✨ YOUR SUBJECT IN THIS SCENE
════════════════════════════════════════════════════════════════

HAIRSTYLE: ${randomHairstyle} (authentic ${scenario.era} style)
EXPRESSION: ${randomExpression}
POSE: ${randomPose}
OUTFIT: Authentic ${scenario.era} fashion fitting the scene perfectly
POSITION: YOUR SUBJECT is the STAR - center of attention, main focus

════════════════════════════════════════════════════════════════
👥 CELEBRITY GROUP COMPOSITION RULES
════════════════════════════════════════════════════════════════

⚠️ EVERY celebrity is UNIQUE - NO DUPLICATES EVER
⚠️ Each celebrity has DISTINCT pose, action, expression
⚠️ YOUR SUBJECT is THE MAIN CHARACTER - celebrities surround them
⚠️ All figures share IDENTICAL lighting, film grain, atmosphere
⚠️ Natural group dynamics - like real friends, not staged
⚠️ Each person clearly distinguishable as individual

════════════════════════════════════════════════════════════════
📸 FINAL OUTPUT: ULTRA-REALISTIC VINTAGE PHOTOGRAPH
════════════════════════════════════════════════════════════════

• Shot on authentic ${scenario.era} film camera
• Period-correct color grading and lighting
• Natural film grain and texture
• Photorealistic - should look like REAL archival photo
• YOUR SUBJECT's face is 100% recognizable from input
• Composition: YOUR SUBJECT prominently featured as the time traveler among legends

CREATE THIS LEGENDARY MOMENT. Face is LOCKED. Hair, clothes, body = FRESH for ${scenario.era}.`;
}