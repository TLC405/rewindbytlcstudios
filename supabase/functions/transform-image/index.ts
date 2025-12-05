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
  // Random expression and pose for variety
  const expressions = [
    "genuine warm smile, eyes slightly crinkled with joy",
    "confident slight smirk, one eyebrow slightly raised",
    "relaxed natural expression, soft friendly gaze", 
    "excited wide smile showing teeth, eyes bright",
    "cool confident look, subtle knowing smile",
    "laughing mid-moment, pure genuine happiness"
  ];
  
  const poses = [
    "standing confidently with relaxed posture",
    "leaning casually like hanging with friends",
    "turned slightly with natural body language",
    "positioned prominently in the center",
    "posed naturally as if caught in a candid moment",
    "standing proud with open welcoming stance"
  ];

  const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
  const randomPose = poses[Math.floor(Math.random() * poses.length)];

  return `🔒 FACE-LOCK LEGENDARY TRANSFORMATION 🔒

═══════════════════════════════════════════════
ABSOLUTE RULE #1: FACE PRESERVATION IS SACRED
═══════════════════════════════════════════════

Study the face in this photo with EXTREME precision. This is YOUR SUBJECT.
You MUST preserve with 100% accuracy:
✓ EXACT eye shape, eye color, eye spacing, eye size
✓ PRECISE nose structure - bridge, tip, nostrils, proportions  
✓ ACCURATE mouth shape - lip thickness, cupid's bow, width
✓ FAITHFUL jawline, chin shape, cheekbone structure
✓ EXACT skin tone, skin texture, any visible marks/features
✓ Any facial hair (beard/mustache) - preserve EXACTLY as shown
✓ Face shape and proportions - DO NOT alter

The face you see is the ONLY face that matters. Lock it in your memory.

═══════════════════════════════════════════════
ABSOLUTE RULE #2: REMOVE EVERYTHING ELSE
═══════════════════════════════════════════════

🚫 COMPLETELY IGNORE from the original photo:
- Any hat, cap, headwear - REMOVE IT
- Any glasses or sunglasses - REMOVE THEM (unless period-appropriate)
- Current hairstyle - REPLACE with era-appropriate style
- Current clothing - REPLACE completely
- Body shape/build - GENERATE new body for the scene
- Background - REPLACE completely
- Accessories, jewelry - REPLACE with era-appropriate items

YOU ARE ONLY KEEPING THE FACE. Everything else is generated fresh.

═══════════════════════════════════════════════
THE LEGENDARY SCENE: ${scenario.title}
ERA: ${scenario.era}
═══════════════════════════════════════════════

${scenario.prompt_template}

═══════════════════════════════════════════════
YOUR SUBJECT'S APPEARANCE IN THIS SCENE
═══════════════════════════════════════════════

Expression: ${randomExpression}
Pose: ${randomPose}
Hair: Give them a natural ${scenario.era} era-appropriate hairstyle
Outfit: Dress them in authentic ${scenario.era} fashion that fits the scene
Body: Generate an appropriate body naturally integrated into the scene

═══════════════════════════════════════════════
CELEBRITY POSITIONING RULES
═══════════════════════════════════════════════

⚠️ CRITICAL: Each celebrity appears ONLY ONCE
⚠️ Each celebrity has their OWN UNIQUE pose and position
⚠️ Your subject is THE MAIN FOCUS - position them prominently
⚠️ Celebrities are SUPPORTING characters around your subject
⚠️ Make sure every person looks like a DISTINCT individual

═══════════════════════════════════════════════
FINAL OUTPUT REQUIREMENTS
═══════════════════════════════════════════════

• Ultra-photorealistic quality - this should look like a REAL vintage photo
• Shot on period-appropriate film camera
• Natural ${scenario.era} era lighting and color grading
• Cinematic composition with your subject as the star
• The face MUST be recognizably the same person from the input photo
• Everyone in the scene looks like real humans in the same space

CREATE THIS LEGENDARY MOMENT NOW. The subject's face is LOCKED. Generate everything else fresh for ${scenario.era}.`;
}