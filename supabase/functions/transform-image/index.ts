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

    // Build the ULTRA face-lock prompt with HAIR/FACIAL HAIR CREATION
    const ultraPrompt = buildAtomicFaceLockPrompt(scenario);

    console.log('Calling Lovable AI for ATOMIC transformation...');
    console.log('Prompt preview:', ultraPrompt.substring(0, 800));

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

    console.log('ATOMIC transformation completed successfully');

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

function buildAtomicFaceLockPrompt(scenario: { title: string; era: string; prompt_template: string }): string {
  // Extract the decade from era for hair/facial hair generation
  const era = scenario.era.toLowerCase();
  
  // Determine era-specific hair and facial hair styles
  const getEraHairStyles = () => {
    if (era.includes('1950') || era.includes('50s')) {
      return {
        maleHair: "1950s men's pompadour with slicked-back sides, Brylcreem shine, clean tapered nape, or classic short back and sides with side part",
        femaleHair: "1950s women's victory rolls, pin curls, short elegant waves, or Grace Kelly sophisticated updo with soft curls",
        maleFacialHair: "CLEAN-SHAVEN - smooth face, no beard, no stubble, no mustache (1950s clean-cut standard)",
        maleWardrobe: "1950s tailored suit with narrow lapels, skinny tie, white dress shirt, leather oxford shoes",
        femaleWardrobe: "1950s full-skirted dress with petticoat, pearls, kitten heels, or elegant pencil skirt with fitted blouse"
      };
    }
    if (era.includes('1960') || era.includes('60s')) {
      return {
        maleHair: "1960s men's mop-top Beatles-style fringe, or clean mod cut with forward-swept bangs, or slicked back executive style",
        femaleHair: "1960s women's bouffant with volume at crown, beehive updo, or sleek straight hair with flip ends à la Jackie Kennedy",
        maleFacialHair: "CLEAN-SHAVEN or light sideburns only - no full beard, smooth chin, perhaps thin mustache for late 60s",
        maleWardrobe: "1960s slim-cut collarless suit, skinny tie, Chelsea boots, or turtleneck with sport coat",
        femaleWardrobe: "1960s A-line shift dress, go-go boots, pillbox hat optional, or elegant Chanel-style suit"
      };
    }
    if (era.includes('1970') || era.includes('70s')) {
      return {
        maleHair: "1970s men's shaggy feathered layers, afro, long sideburns, or disco-era blow-dried volume with center part",
        femaleHair: "1970s women's Farrah Fawcett feathered wings, long straight center-part, afro, or bohemian waves",
        maleFacialHair: "1970s THICK MUSTACHE common, or full beard acceptable, mutton chops, or clean with big sideburns",
        maleWardrobe: "1970s wide-collar shirt with chest exposed, bell-bottom trousers, platform shoes, leather jacket",
        femaleWardrobe: "1970s maxi dress, bell-bottoms with crop top, platform shoes, bohemian layers and fringe"
      };
    }
    if (era.includes('1980') || era.includes('80s')) {
      return {
        maleHair: "1980s men's jheri curl, mullet (business front party back), spiky gelled hair, or power-executive side part",
        femaleHair: "1980s women's big permed hair with volume, crimped layers, side ponytail, or teased bangs with hairspray",
        maleFacialHair: "1980s LIGHT STUBBLE acceptable (Miami Vice), clean-shaven common, thin mustache, or soul patch",
        maleWardrobe: "1980s power suit with padded shoulders, skinny tie, Members Only jacket, or athletic wear with high-tops",
        femaleWardrobe: "1980s power suit with shoulder pads, neon colors, leg warmers, or glamorous sequined dress"
      };
    }
    if (era.includes('1990') || era.includes('90s')) {
      return {
        maleHair: "1990s men's curtains parted in middle, fresh fade with flat top, caesar cut, or bleached spiky tips",
        femaleHair: "1990s women's Rachel cut with layers, straight and sleek, crimped sections, or messy updo with face-framing pieces",
        maleFacialHair: "1990s GOATEE popular, soul patch, thin line beard, or clean-shaven with sharp lines",
        maleWardrobe: "1990s baggy jeans, oversized flannel shirt, Timberland boots, or fresh athletic gear with chains",
        femaleWardrobe: "1990s slip dress, choker necklace, platform sneakers, or high-waisted jeans with crop top"
      };
    }
    // Default/generic vintage
    return {
      maleHair: "era-appropriate men's hairstyle matching the scene's time period",
      femaleHair: "era-appropriate women's hairstyle matching the scene's time period",
      maleFacialHair: "era-appropriate facial hair or clean-shaven based on the time period",
      maleWardrobe: "era-appropriate men's clothing matching the scene's time period",
      femaleWardrobe: "era-appropriate women's clothing matching the scene's time period"
    };
  };

  const eraStyles = getEraHairStyles();

  return `
╔═══════════════════════════════════════════════════════════════════════════════╗
║  ⚡ ATOMIC FACE-ONLY LOCK PROTOCOL - WITH HAIR & STYLE CREATION ⚡            ║
╚═══════════════════════════════════════════════════════════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  SECTION A: WHAT TO LOCK FROM INPUT PHOTO (FACE GEOMETRY ONLY)               ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

LOCK THESE EXACTLY - COPY PIXEL-BY-PIXEL FROM INPUT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ GENDER: Detect male/female from input → OUTPUT MUST MATCH 100%
✓ EYE SHAPE: Exact almond/round/hooded shape, exact spacing, exact color
✓ EYEBROWS: Exact arch, thickness, color, spacing from input
✓ NOSE: Exact bridge height, tip shape, nostril width, nose length
✓ LIPS: Exact lip thickness, cupid's bow, lip color, mouth width
✓ JAW: Exact jawline angle, chin shape, chin cleft if present
✓ CHEEKBONES: Exact height and prominence from input
✓ SKIN: Exact skin tone, texture, every freckle, mole, birthmark, scar
✓ EARS: Exact ear shape if visible
✓ FOREHEAD: Exact shape and proportions
✓ BODY TYPE: Approximate build (slim/athletic/heavy) from input
✓ AGE: Approximate age range from input (unless scene specifies aging)

THE OUTPUT FACE MUST BE IMMEDIATELY RECOGNIZABLE AS THE INPUT PERSON.
A family member looking at the output should say "That's definitely them!"

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  SECTION B: WHAT TO CREATE NEW - DO NOT PRESERVE FROM INPUT                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🎨 HAIR - CREATE NEW, DO NOT PRESERVE INPUT HAIR:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• REMOVE any hat, cap, beanie, headwear, hood from input photo - IGNORE IT
• GENERATE completely new era-appropriate hairstyle:
  
  IF MALE DETECTED IN INPUT:
  → Generate: ${eraStyles.maleHair}
  → Hair color: Can match input OR be natural shade appropriate for era
  → Style must look like professional 1960s-90s salon styling
  
  IF FEMALE DETECTED IN INPUT:
  → Generate: ${eraStyles.femaleHair}
  → Hair color: Can match input OR be natural shade appropriate for era
  → Style must look like professional era-appropriate salon styling

🧔 FACIAL HAIR - CREATE ERA-APPROPRIATE, IGNORE INPUT FACIAL HAIR:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• IGNORE any beard, stubble, mustache, goatee from input photo
• GENERATE era-appropriate facial hair:
  
  IF MALE DETECTED IN INPUT:
  → Generate: ${eraStyles.maleFacialHair}
  → This is the ${scenario.era} look - apply it regardless of input
  
  IF FEMALE DETECTED IN INPUT:
  → No facial hair (obviously)

👔 WARDROBE - CREATE ERA-APPROPRIATE CLOTHING:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• REMOVE modern clothing, t-shirts, hoodies, modern accessories
• GENERATE era-authentic wardrobe:
  
  IF MALE DETECTED: ${eraStyles.maleWardrobe}
  IF FEMALE DETECTED: ${eraStyles.femaleWardrobe}

👓 ACCESSORIES - REMOVE MODERN, ADD ERA-APPROPRIATE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• REMOVE: Modern glasses, sunglasses, earbuds, smartwatch, modern jewelry
• ADD: Era-appropriate accessories if the scene requires them

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  SECTION C: GENDER PROTECTION - ABSOLUTE RULE                                ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⚠️ CRITICAL GENDER RULE - THIS OVERRIDES EVERYTHING:
• Step 1: Detect gender from input photo FIRST
• Step 2: Lock that gender for the entire generation
• Male input → Male output with MALE hair and MALE facial hair options
• Female input → Female output with FEMALE hair and no facial hair
• NEVER swap, change, or alter gender under ANY circumstance
• Scene descriptions mentioning opposite gender → IGNORE and use input gender

╔═══════════════════════════════════════════════════════════════════════════════╗
║  🎬 THE LEGENDARY SCENE: ${scenario.title.padEnd(50)}║
║  ⏰ ERA: ${scenario.era.padEnd(60)}║
╚═══════════════════════════════════════════════════════════════════════════════╝

${scenario.prompt_template}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  SECTION D: PHOTOGRAPHY & OUTPUT REQUIREMENTS                                ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📷 PHOTOGRAPHY STYLE:
• Matte, filmic color palette - ABSOLUTELY NO NEON, no oversaturation
• Authentic ${scenario.era} era photography aesthetic and color science
• Natural film grain appropriate to the decade's camera technology
• Warm, organic tones - nothing digital, nothing modern looking
• Period-correct lighting: tungsten warmth, natural window light, stage lighting

🎭 COMPOSITION:
• The TIME TRAVELER (input person) is THE STAR - prominently featured
• Celebrities positioned around them with UNIQUE famous likenesses
• Candid, natural moment - NOT stiff, NOT posed, NOT looking at camera
• Dynamic energy with people caught in genuine motion and interaction
• Proper depth of field and focus on the time traveler

🌟 CELEBRITY REQUIREMENTS:
• Each celebrity MUST have their historically accurate, recognizable face
• NO cloning - every person in the scene is distinctly unique
• Famous features preserved: Ali's powerful jaw, MJ's distinctive nose, Elvis's iconic hair
• Authentic period-correct styling for each celebrity

╔═══════════════════════════════════════════════════════════════════════════════╗
║  🔍 FINAL VERIFICATION CHECKLIST - MUST ALL BE TRUE                          ║
╚═══════════════════════════════════════════════════════════════════════════════╝

Before generating, verify ALL of these:

□ TIME TRAVELER GENDER matches input photo EXACTLY (male→male, female→female)
□ TIME TRAVELER FACE is 100% recognizable as the input person
□ TIME TRAVELER has NEW era-appropriate HAIR (not input hair, no hat)
□ TIME TRAVELER has NEW era-appropriate FACIAL HAIR (if male) or none (if female)
□ TIME TRAVELER has NEW era-appropriate WARDROBE (not input clothes)
□ TIME TRAVELER BODY TYPE matches input photo approximately
□ All CELEBRITIES are UNIQUE and RECOGNIZABLE with famous likenesses
□ Scene feels AUTHENTIC to ${scenario.era} - matte, filmic, organic
□ NO NEON colors, NO oversaturation, NO digital/modern look
□ CANDID natural energy - not stiff, not posed, not looking at camera

═══════════════════════════════════════════════════════════════════════════════
GENERATE THIS LEGENDARY MUSEUM-QUALITY MOMENT NOW.
═══════════════════════════════════════════════════════════════════════════════
`;
}
