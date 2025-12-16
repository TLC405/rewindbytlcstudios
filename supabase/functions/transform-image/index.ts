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
          prompt_used: ultraPrompt.substring(0, 5000)
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
  // Random expressions for variety
  const expressions = [
    "warm genuine smile showing natural joy",
    "confident knowing smirk with relaxed eyes",
    "candid mid-laugh moment full of life",
    "cool collected gaze radiating charisma",
    "excited bright expression of amazement"
  ];
  
  // Random poses for variety  
  const poses = [
    "standing front-center as the main subject",
    "leaning in casually like sharing secrets with friends",
    "arm around a legend's shoulder like old friends",
    "seated prominently among the icons",
    "caught in animated conversation with legends"
  ];

  // Era-specific hairstyles (NO hats allowed)
  const eraHairstyles: Record<string, string[]> = {
    '1950s': ['slicked pompadour with shine', 'neat side-parted classic cut', 'vintage finger waves', 'rockabilly quiff with volume'],
    '1960s': ['natural textured afro', 'mod bowl cut', 'bouffant volume style', 'sleek Jackie O-inspired'],
    '1970s': ['feathered Farrah layers', 'full round disco afro', 'shaggy rock star layers', 'flowing center-parted mane'],
    '1980s': ['big teased volume hair', 'crimped new wave style', 'power mullet', 'asymmetric punk cut'],
    '1990s': ['fresh high-top fade', 'layered Rachel cut', 'sleek box braids', 'curtain bangs style'],
    '2000s': ['sleek flat-ironed straight', 'frosted spiked tips', 'chunky highlighted layers', 'side-swept emo fringe'],
    '2010s': ['modern textured undercut', 'beachy tousled waves', 'man bun top knot', 'natural coily curls']
  };

  // Era-specific jewelry
  const eraJewelry: Record<string, string[]> = {
    '1950s': ['classic watch', 'pearl earrings', 'simple gold chain'],
    '1960s': ['peace medallion', 'beaded necklace', 'hoop earrings'],
    '1970s': ['gold chains layered', 'big hoop earrings', 'turquoise jewelry'],
    '1980s': ['chunky gold chains', 'statement earrings', 'multiple rings'],
    '1990s': ['rope chains', 'nameplate necklace', 'bamboo earrings'],
    '2000s': ['bling bling chains', 'diamond studs', 'oversized hoops'],
    '2010s': ['minimal gold jewelry', 'layered delicate chains', 'designer watch']
  };

  const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
  const randomPose = poses[Math.floor(Math.random() * poses.length)];
  const eraStyles = eraHairstyles[scenario.era] || eraHairstyles['1990s'];
  const randomHairstyle = eraStyles[Math.floor(Math.random() * eraStyles.length)];
  const jewelry = eraJewelry[scenario.era] || eraJewelry['1990s'];
  const randomJewelry = jewelry[Math.floor(Math.random() * jewelry.length)];

  return `🔒 ULTRA FACE-LOCK TRANSFORMATION PROTOCOL 🔒

═══════════════════════════════════════════════════════════════════
⚡ ABSOLUTE RULE: THE FACE IS SACRED - ZERO MODIFICATIONS ⚡
═══════════════════════════════════════════════════════════════════

Look at the uploaded photo. This person is THE TIME TRAVELER.

FACE FEATURES TO PRESERVE WITH 100% ACCURACY:
• Eye shape, eye color, eye spacing, eyelid structure - EXACT
• Nose shape, bridge, tip, nostrils - EXACT  
• Lip shape, lip thickness, natural lip color - EXACT
• Jawline contours, chin shape, cheekbones - EXACT
• Skin tone, skin texture, any freckles/moles/marks - EXACT
• Facial hair pattern and density (if present) - EXACT
• Forehead shape, ear shape, face proportions - EXACT

THE FACE FROM THE PHOTO MUST BE 100% RECOGNIZABLE IN THE OUTPUT.
Any change to facial features = FAILURE.

═══════════════════════════════════════════════════════════════════
🚫 MANDATORY REMOVAL - STRIP EVERYTHING EXCEPT FACE 🚫
═══════════════════════════════════════════════════════════════════

FROM THE ORIGINAL PHOTO, REMOVE AND REPLACE:

❌ ALL HATS/CAPS/HEADWEAR → Generate full visible head with new hair
❌ CURRENT HAIRSTYLE → Replace with: ${randomHairstyle}
❌ GLASSES/SUNGLASSES → Remove unless scene-appropriate vintage
❌ ALL CURRENT CLOTHING → Generate fresh ${scenario.era} fashion
❌ CURRENT BODY TYPE → Generate natural body fitting the scene
❌ ALL ACCESSORIES → Generate: ${randomJewelry}
❌ BACKGROUND → Use only the legendary scene setting
❌ CURRENT POSE → Generate: ${randomPose}

KEEP ONLY: The exact face. Everything else = newly generated for ${scenario.era}.

═══════════════════════════════════════════════════════════════════
🌟 THE LEGENDARY SCENE: ${scenario.title}
⏰ ERA: ${scenario.era}
═══════════════════════════════════════════════════════════════════

${scenario.prompt_template}

═══════════════════════════════════════════════════════════════════
👤 YOUR SUBJECT (THE TIME TRAVELER) IN THIS SCENE
═══════════════════════════════════════════════════════════════════

• HAIR: ${randomHairstyle} (fresh ${scenario.era} style, NO HATS)
• EXPRESSION: ${randomExpression}
• POSE: ${randomPose}
• JEWELRY: ${randomJewelry}
• OUTFIT: Authentic ${scenario.era} clothing matching the scene
• POSITION: CENTER OF THE PHOTO - THE STAR, THE MAIN CHARACTER

═══════════════════════════════════════════════════════════════════
👥 CELEBRITY COMPOSITION RULES - EACH LEGEND IS UNIQUE
═══════════════════════════════════════════════════════════════════

CRITICAL RULES FOR CELEBRITIES IN THE SCENE:

✓ Each celebrity has their OWN DISTINCT recognizable likeness
✓ Each celebrity has a DIFFERENT pose and action
✓ Each celebrity is clearly distinguishable from others
✓ NO TWO PEOPLE should look similar or like clones
✓ Celebrities SURROUND the time traveler naturally
✓ All figures share IDENTICAL lighting and film grain
✓ Natural group dynamics - like real friends hanging out

THE TIME TRAVELER (from photo) = ONLY PERSON with face-lock
CELEBRITIES = Generate their famous likenesses naturally

═══════════════════════════════════════════════════════════════════
📸 FINAL OUTPUT: AUTHENTIC ${scenario.era} PHOTOGRAPH
═══════════════════════════════════════════════════════════════════

• Shot on authentic ${scenario.era} era camera
• Period-correct color grading and tones
• Natural film grain and texture appropriate to era
• Photorealistic - indistinguishable from real archival photo
• Candid feel - not overly posed or stiff
• Time traveler's face 100% recognizable from input photo
• Hair, clothes, jewelry = ALL FRESH for ${scenario.era}

CREATE THIS LEGENDARY MOMENT NOW.`;
}
