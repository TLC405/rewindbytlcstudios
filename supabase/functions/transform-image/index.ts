import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_FREE_TRANSFORMS = 1;
const RATE_LIMIT_WINDOW_HOURS = 24;

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

    const { imageBase64, scenarioId, userId, transformationId, isPreview, isFreeShowcase, fingerprintHash } = await req.json();

    if (!imageBase64) {
      throw new Error('Missing required field: imageBase64');
    }

    const isAnonymous = !userId;
    console.log(`Starting transformation for ${isAnonymous ? 'anonymous user' : `user ${userId}`}, isPreview: ${isPreview}, isFreeShowcase: ${isFreeShowcase}`);

    // SERVER-SIDE RATE LIMITING FOR ANONYMOUS USERS
    if (isAnonymous && (isPreview || isFreeShowcase)) {
      // Get client IP from headers
      const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                       req.headers.get('x-real-ip') || 
                       'unknown';
      
      console.log(`Checking rate limit for IP: ${clientIp}, fingerprint: ${fingerprintHash || 'none'}`);
      
      // Check IP-based rate limit using service role (bypasses RLS)
      const { data: ipData, error: ipError } = await supabase
        .from('ip_usage')
        .select('id, transformation_count, last_used_at')
        .eq('ip_address', clientIp)
        .maybeSingle();

      if (ipError) {
        console.error('Error checking IP rate limit:', ipError);
      }

      // Check if rate limited
      if (ipData && ipData.transformation_count >= MAX_FREE_TRANSFORMS) {
        const lastUsed = new Date(ipData.last_used_at);
        const hoursSince = (Date.now() - lastUsed.getTime()) / (1000 * 60 * 60);
        
        if (hoursSince < RATE_LIMIT_WINDOW_HOURS) {
          console.log(`Rate limit exceeded for IP ${clientIp}: ${ipData.transformation_count} transforms`);
          return new Response(
            JSON.stringify({ 
              error: 'Free preview limit reached. Sign up for unlimited transformations!',
              code: 'RATE_LIMITED'
            }), 
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }

      // Also check fingerprint-based rate limit if provided
      if (fingerprintHash) {
        const { data: fpData, error: fpError } = await supabase
          .from('device_fingerprints')
          .select('id, transformation_count, is_blocked, block_reason')
          .eq('fingerprint_hash', fingerprintHash)
          .maybeSingle();

        if (fpError) {
          console.error('Error checking fingerprint rate limit:', fpError);
        }

        // Check if device is blocked
        if (fpData?.is_blocked) {
          console.log(`Blocked device: ${fingerprintHash}, reason: ${fpData.block_reason}`);
          return new Response(
            JSON.stringify({ 
              error: 'Access denied. Please sign up to continue.',
              code: 'BLOCKED'
            }), 
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Check fingerprint rate limit
        if (fpData && fpData.transformation_count >= MAX_FREE_TRANSFORMS) {
          console.log(`Rate limit exceeded for fingerprint ${fingerprintHash}: ${fpData.transformation_count} transforms`);
          return new Response(
            JSON.stringify({ 
              error: 'Free preview limit reached. Sign up for unlimited transformations!',
              code: 'RATE_LIMITED'
            }), 
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }

      // Update rate limit counters BEFORE processing (to prevent race conditions)
      if (ipData) {
        await supabase
          .from('ip_usage')
          .update({ 
            transformation_count: ipData.transformation_count + 1,
            last_used_at: new Date().toISOString()
          })
          .eq('id', ipData.id);
      } else {
        await supabase
          .from('ip_usage')
          .insert({ 
            ip_address: clientIp, 
            transformation_count: 1 
          });
      }

      if (fingerprintHash) {
        const { data: existingFp } = await supabase
          .from('device_fingerprints')
          .select('id, transformation_count')
          .eq('fingerprint_hash', fingerprintHash)
          .maybeSingle();

        if (existingFp) {
          await supabase
            .from('device_fingerprints')
            .update({ 
              transformation_count: existingFp.transformation_count + 1,
              last_seen_at: new Date().toISOString()
            })
            .eq('id', existingFp.id);
        } else {
          await supabase
            .from('device_fingerprints')
            .insert({ 
              fingerprint_hash: fingerprintHash, 
              transformation_count: 1 
            });
        }
      }

      console.log('Rate limit check passed, proceeding with transformation');
    }

    // For authenticated users, verify credits
    if (!isAnonymous && userId && !isPreview && !isFreeShowcase) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('user_id', userId)
        .single();
      
      if (!profile || profile.credits <= 0) {
        return new Response(
          JSON.stringify({ error: 'Insufficient credits. Please add more credits to continue.' }), 
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    let ultraPrompt: string;

    // For free showcase, use the special creative prompt
    if (isFreeShowcase || isPreview) {
      console.log('Using FREE SHOWCASE creative prompt - legends from all decades');
      ultraPrompt = buildFreeShowcasePrompt();
    } else {
      // Regular scenario-based transformation
      if (!scenarioId) {
        throw new Error('Missing required field: scenarioId');
      }

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
      ultraPrompt = buildAtomicFaceLockPrompt(scenario);
    }

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
    if (!isAnonymous && userId && !isPreview && !isFreeShowcase) {
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
• All celebrities must be IMMEDIATELY RECOGNIZABLE - their iconic looks
• Natural poses and interactions - not stiff or artificial
• Cinematic framing with depth and atmosphere
• Hidden TLC easter eggs in the environment (as described in scene)

🎨 OUTPUT REQUIREMENTS:
• High-resolution cinematic portrait
• Rich detail in clothing, hair, environment
• Film-era color grading matching the decade
• Natural skin tones, no plastic or AI artifacts
• The scene should feel like a rediscovered photograph from that era
`;
}

function buildFreeShowcasePrompt(): string {
  return `
╔═══════════════════════════════════════════════════════════════════════════════╗
║  ⚡ ULTIMATE FREE SHOWCASE - STUDIO 54 LEGENDS GATHERING ⚡                   ║
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
✓ BODY TYPE: Approximate build from input

THE OUTPUT FACE MUST BE IMMEDIATELY RECOGNIZABLE AS THE INPUT PERSON.

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  SECTION B: CREATE NEW - 1970s DISCO ERA STYLING                             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🎨 HAIR - CREATE NEW 1970s DISCO HAIRSTYLE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IF MALE: Generate 1970s shaggy feathered layers, disco-era blow-dried volume, 
         or afro with pick, long sideburns, center part with flow
IF FEMALE: Generate 1970s Farrah Fawcett feathered wings, glamorous long waves,
           afro, or sleek center-part disco queen hair

🧔 FACIAL HAIR - 1970s STYLE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IF MALE: 1970s thick mustache, or full beard, or clean with dramatic sideburns
IF FEMALE: No facial hair

👔 WARDROBE - 1970s STUDIO 54 GLAMOUR:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IF MALE: Open silk disco shirt showing chest, gold chains, bell-bottoms, 
         platform shoes, or sleek white suit John Travolta style
IF FEMALE: Halter top with sequins, flowing palazzo pants, platform heels,
           or glamorous wrap dress, statement jewelry

╔═══════════════════════════════════════════════════════════════════════════════╗
║  🎬 THE SCENE: STUDIO 54 - 1977 - THE GREATEST PARTY EVER                     ║
╚═══════════════════════════════════════════════════════════════════════════════╝

Create an explosive painted 1977 disco scene at Studio 54 like a legendary album gatefold.

THE TIME TRAVELER (user from input photo) stands CENTER STAGE under the iconic 
man-in-the-moon spoon spotlight, commanding the dance floor with star energy.

SURROUNDING LEGENDS (all with EXACT real faces and iconic looks):
• Muhammad Ali - powerful stance, in evening wear, the champ at the party
• Diana Ross - glamorous in sequins, that legendary smile and hair
• Andy Warhol - platinum wig, round glasses, watching with knowing eyes
• Donna Summer - the disco queen herself, mid-dance move
• Stevie Wonder - at piano or standing nearby, that joyful expression
• Grace Jones - fierce androgynous look, flat-top hair, dramatic pose

ENVIRONMENT:
• Iconic Studio 54 interior with famous moon and spoon sculpture
• Glittering disco balls casting rainbow reflections
• Dramatic club lighting - purple, gold, white spotlights
• Velvet ropes and glamorous crowd in background
• Champagne and celebration everywhere
• Hidden "TLC" in neon sign on wall and on VIP area sign

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  PHOTOGRAPHY & OUTPUT REQUIREMENTS                                           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📷 1970s PHOTOGRAPHY AESTHETIC:
• Rich, warm Kodachrome color palette with disco lighting accents
• Slight film grain for authentic 70s feel
• Dynamic club lighting with dramatic shadows and highlights
• Glamorous but not garish - Studio 54 was sophisticated chaos

🎭 CRITICAL CELEBRITY REQUIREMENTS:
• Each celebrity MUST be immediately recognizable
• Use their ICONIC 1977 looks - real hairstyles, real fashion, real faces
• Muhammad Ali - unmistakable powerful presence
• Diana Ross - that huge beautiful afro and megawatt smile
• Andy Warhol - platinum silver wig, pale skin, glasses
• Donna Summer - the Last Dance era glamour
• Stevie Wonder - braids/afro, sunglasses, joyful presence
• Grace Jones - angular features, dramatic androgynous style

The TIME TRAVELER is THE STAR - center of attention, belonging there naturally.
`;
}
