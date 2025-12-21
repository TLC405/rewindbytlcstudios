-- Delete all existing scenarios and insert ultra-detailed versions
DELETE FROM scenarios;

-- Insert 15 ultra-detailed museum-quality scenarios with comprehensive hair/facial hair/wardrobe instructions
INSERT INTO scenarios (title, era, description, prompt_template, icon, gradient, accent, is_active) VALUES

('Beatles Stage Break Talk', '1965', 'Backstage at Shea Stadium with John, Paul, George & Ringo during their iconic tour', 
'THE SCENE: Backstage at Shea Stadium, August 1965. Wood-paneled dressing room with vintage mirrors, Vox amplifiers stacked in corners, cigarette smoke curling in tungsten light.

THE TIME TRAVELER (person from input photo) stands CENTER among the Fab Four:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FACE: Use EXACT face geometry from input (eyes, nose, lips, jaw, skin tone, every freckle/mole)
GENDER: Match input EXACTLY - male stays male, female stays female
BODY: Match approximate build from input

HAIR (CREATE NEW - REMOVE ANY HAT):
• IF MALE: 1965 mop-top with forward fringe, clean tapered sides, Beatles-inspired mod cut
• IF FEMALE: 1965 bouffant or sleek flip with volume at crown, era-appropriate styling
• Hair color can match input or be natural 1960s shade

FACIAL HAIR (CREATE - IGNORE INPUT):
• IF MALE: CLEAN-SHAVEN - smooth face, no stubble (1965 British Invasion clean-cut)
• IF FEMALE: None

WARDROBE (CREATE NEW):
• IF MALE: Slim collarless Pierre Cardin suit, skinny dark tie, white shirt, Chelsea boots
• IF FEMALE: A-line mod dress or elegant blouse with slim trousers, kitten heels
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

JOHN LENNON (left): Wire-rim glasses, mop-top, sardonic grin, holding cigarette, that distinctive Lennon nose and jawline
PAUL MCCARTNEY (right of time traveler): Baby-faced, doe eyes, left-handed bass guitar nearby, charming smile
GEORGE HARRISON (seated): Quiet intensity, prominent eyebrows, Gretsch guitar on lap
RINGO STARR (standing back): Big nose, sad eyes, drumsticks in hand, rings on fingers

PROPS: Coca-Cola bottles, ashtrays, Rickenbacker guitars, leather guitar cases, tour schedules
LIGHTING: Warm tungsten bulbs, mirror lights creating halos, smoke diffusion
CAMERA: 35mm Leica, f/2.8, Kodak Tri-X film grain, candid photojournalistic style
MOOD: Intimate chaos, pre-show energy, genuine laughter mid-conversation',
'music', 'from-amber-500/20 to-amber-900/20', 'text-amber-400', true),

('Muhammad Ali Light Sparring', '1964', 'Training at the 5th Street Gym Miami with the Greatest', 
'THE SCENE: 5th Street Gym, Miami Beach, February 1964. Sweat-stained canvas ring, speed bags, heavy bags, vintage fight posters peeling from concrete walls.

THE TIME TRAVELER (person from input photo) in the ring with THE GREATEST:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FACE: EXACT face geometry from input - every feature pixel-perfect
GENDER: Input gender LOCKED - never change
BODY: Match input build

HAIR (CREATE NEW - REMOVE HAT):
• IF MALE: 1964 short cropped athletic cut, tight fade or natural textured top
• IF FEMALE: 1964 short natural or pulled back athletic style, headband optional
• Sweaty, workout-ready appearance

FACIAL HAIR (CREATE):
• IF MALE: Clean-shaven OR light stubble (athletic 1960s look)
• IF FEMALE: None

WARDROBE (CREATE):
• IF MALE: White tank top or bare chest, vintage boxing shorts, Everlast gloves, hand wraps
• IF FEMALE: Vintage athletic wear, modest 1960s workout attire, wrapped hands
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MUHAMMAD ALI (22 years old, pre-Liston fight): 
• That unmistakable face - wide-set eyes, broad nose, full lips, proud jawline
• Glistening with sweat, muscles defined but lean heavyweight build
• Playful expression, maybe throwing a slow-motion jab at the time traveler
• Dancing on his toes, float like a butterfly stance

BACKGROUND: Angelo Dundee shouting from corner, other boxers on heavy bags, vintage Everlast equipment
LIGHTING: Harsh overhead gymnasium fluorescents mixed with window light, sweat catching light
CAMERA: 50mm lens, f/2, high-contrast black and white with deep shadows, Sports Illustrated documentary style
MOOD: Playful intensity, mentor teaching a lesson, pre-greatness electricity',
'dumbbell', 'from-red-500/20 to-red-900/20', 'text-red-400', true),

('Michael Jackson Moonwalk Rehearsal', '1983', 'Private rehearsal studio as MJ perfects the legendary move', 
'THE SCENE: Private rehearsal studio, Los Angeles, early 1983. Mirrored walls floor to ceiling, sprung wood dance floor, portable boombox playing demos.

THE TIME TRAVELER (person from input photo) learning the moonwalk from the KING OF POP:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FACE: EXACT face from input - pixel-perfect transfer of every feature
GENDER: Strictly match input gender
BODY: Match input build

HAIR (CREATE - REMOVE ANY HAT):
• IF MALE: 1983 jheri curl or sculpted waves, era-appropriate styling
• IF FEMALE: 1983 big permed curls, volume and bounce, era-authentic
• Slightly sweaty from dancing

FACIAL HAIR (CREATE):
• IF MALE: Clean-shaven or very light stubble (early 80s style)
• IF FEMALE: None

WARDROBE (CREATE):
• IF MALE: Dance rehearsal wear - tank top or open button shirt, high-waist pleated pants, white socks, black loafers
• IF FEMALE: 1983 dance attire - leotard with leg warmers, or oversized sweatshirt off-shoulder
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MICHAEL JACKSON (Thriller-era, age 24):
• That iconic face - high cheekbones, distinctive nose (1983 version), deep brown eyes
• Jheri curl perfectly defined, single curl on forehead
• Wearing rehearsal clothes - simple white t-shirt, black high-waist pants, white socks, black penny loafers
• Mid-moonwalk position, one foot sliding back, demonstrating to time traveler
• Intense concentration mixed with infectious joy

SETTING: Wall of mirrors reflecting infinite Michaels, boom box on floor, water bottles, towels
LIGHTING: Bright rehearsal studio fluorescents, mirrors creating complex reflections
CAMERA: 35mm, f/2.8, slight motion blur on sliding foot, documentary candid style
MOOD: Creative magic being born, intimate teaching moment, genius at work',
'music', 'from-purple-500/20 to-purple-900/20', 'text-purple-400', true),

('Elvis Sun Records Jam', '1956', 'Memphis recording session where rock and roll was born', 
'THE SCENE: Sun Studio, 706 Union Avenue, Memphis, 1956. Acoustic tile walls, single RCA microphone, analog mixing board, coffee cups everywhere.

THE TIME TRAVELER (person from input photo) jamming with THE KING:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FACE: EXACT face geometry from input photo - unmistakably the same person
GENDER: Match input gender absolutely
BODY: Match input build

HAIR (CREATE - REMOVE HAT):
• IF MALE: 1956 pompadour with ducktail back, slicked with Brylcreem, sides combed back
• IF FEMALE: 1956 pin curls or victory rolls, elegant vintage styling
• Perfectly styled, studio-ready

FACIAL HAIR (CREATE):
• IF MALE: CLEAN-SHAVEN - immaculate 1950s grooming, smooth chin
• IF FEMALE: None

WARDROBE (CREATE):
• IF MALE: 1956 two-tone shirt or sport coat, high-waist pleated trousers, white buck shoes
• IF FEMALE: Full-skirted dress with petticoat, pearls, saddle shoes or kitten heels
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ELVIS PRESLEY (21 years old, pre-Army):
• That legendary face - hooded bedroom eyes, full sensual lips, strong jaw, sideburns
• Iconic jet-black pompadour with ducktail, perfectly greased
• Wearing pink sport coat with black collar, or two-tone shirt unbuttoned at neck
• Acoustic guitar in hands, leaning toward microphone, that famous sneer/smile
• Leg mid-shake, capturing that dangerous hip energy

SAM PHILLIPS in control room behind glass, Scotty Moore on guitar nearby
PROPS: Vintage microphones, guitars, coffee cups, ashtrays, reel-to-reel tape machines
LIGHTING: Warm overhead studio lights, intimate recording session glow
CAMERA: 85mm portrait lens, f/2, rich Kodachrome warmth, album cover quality
MOOD: Birth of rock and roll, raw energy, history being recorded',
'music', 'from-pink-500/20 to-pink-900/20', 'text-pink-400', true),

('Aretha Franklin Studio Take', '1968', 'FAME Studios Muscle Shoals recording session', 
'THE SCENE: FAME Studios, Muscle Shoals, Alabama, 1968. Wood-paneled walls, analog equipment, session musicians in the zone.

THE TIME TRAVELER (person from input photo) witnessing the QUEEN OF SOUL:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FACE: EXACT face from input - every feature preserved
GENDER: Match input exactly
BODY: Match input build

HAIR (CREATE - NO HAT):
• IF MALE: 1968 natural afro or processed style, soul-era appropriate
• IF FEMALE: 1968 bouffant or natural style, elegant soul-era hair
• Studio-ready, polished

FACIAL HAIR (CREATE):
• IF MALE: Clean-shaven or neat mustache (1968 soul style)
• IF FEMALE: None

WARDROBE (CREATE):
• IF MALE: 1968 sharp suit or turtleneck with sport coat, dress shoes
• IF FEMALE: Elegant 1968 dress or sophisticated blouse and skirt, pearls possible
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ARETHA FRANKLIN (26 years old, peak powers):
• That unmistakable face - soulful eyes, beautiful smile, regal bearing
• Hair styled in 1968 bouffant or elegant updo
• Seated at piano or standing at microphone, eyes closed in passion
• Wearing elegant dress appropriate for studio session
• Mid-note, mouth open, channeling that supernatural voice

THE SWAMPERS (Muscle Shoals rhythm section) visible in background with instruments
PROPS: Grand piano, vintage microphones, music stands, coffee cups, cigarette smoke
LIGHTING: Warm studio lights, intimate recording atmosphere
CAMERA: 50mm, f/2.8, documentary style, soul music photography aesthetic
MOOD: Sacred musical moment, gospel power, genius in flow',
'music', 'from-yellow-500/20 to-yellow-900/20', 'text-yellow-400', true),

('Freddie Mercury Soundcheck', '1985', 'Wembley Stadium pre-Live Aid soundcheck', 
'THE SCENE: Wembley Stadium stage, July 13, 1985, afternoon soundcheck before Live Aid. Empty 72,000 seats, massive PA system, legendary stage.

THE TIME TRAVELER (person from input photo) with the GREATEST FRONTMAN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FACE: EXACT face from input - pixel-perfect preservation
GENDER: Match input exactly
BODY: Match input build

HAIR (CREATE - NO HAT):
• IF MALE: 1985 short cropped or styled mullet, rock star ready
• IF FEMALE: 1985 big hair with volume, teased or permed, rock era style
• Stage-ready styling

FACIAL HAIR (CREATE):
• IF MALE: THICK MUSTACHE (1985 Freddie style) OR clean-shaven
• IF FEMALE: None

WARDROBE (CREATE):
• IF MALE: 1985 rock attire - tank top, tight jeans, studded belt, wristbands
• IF FEMALE: 1985 rock style - band tee, leather jacket, big earrings
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FREDDIE MERCURY:
• That iconic face - prominent teeth, dark eyes, strong bone structure
• Famous thick black mustache, short dark hair
• Wearing Live Aid outfit - white tank top showing chest hair, light blue jeans, white Adidas sneakers
• Holding mic stand in that commanding pose, or pointing to crowd seats
• Radiating charisma even in empty stadium

BRIAN MAY with Red Special guitar visible in background, Roger Taylor at drums
PROPS: Vintage microphones, monitors, stage equipment, piano visible
LIGHTING: Afternoon daylight on outdoor stage, dramatic shadows
CAMERA: 35mm, f/4, concert photography style, rock documentary aesthetic
MOOD: Calm before the storm, legendary performance hours away',
'mic', 'from-red-500/20 to-orange-900/20', 'text-orange-400', true),

('James Brown Rehearsal Count-In', '1966', 'Apollo Theater rehearsal with the Hardest Working Man in Show Business', 
'THE SCENE: Apollo Theater stage, Harlem, 1966. Velvet curtains, brass footlights, legendary hardwood stage.

THE TIME TRAVELER (person from input photo) in formation with THE GODFATHER OF SOUL:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FACE: EXACT face from input - identical features
GENDER: Match input exactly
BODY: Match input build

HAIR (CREATE - NO HAT):
• IF MALE: 1966 processed pompadour or natural style, immaculately groomed
• IF FEMALE: 1966 bouffant or elegant updo, performance-ready
• Perfect, not a hair out of place (James demanded perfection)

FACIAL HAIR (CREATE):
• IF MALE: Clean-shaven OR thin mustache (1966 R&B style)
• IF FEMALE: None

WARDROBE (CREATE):
• IF MALE: Sharp matching suit with the Famous Flames, polished shoes, thin tie
• IF FEMALE: 1966 elegant performance dress, heels, coordinated with act
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

JAMES BROWN (33 years old, peak energy):
• That intense face - sharp features, determination in eyes, trademark expressions
• Processed pompadour hair, perfectly styled, glistening
• Wearing sharp suit (likely cape nearby for the act)
• Mid-count, finger pointed, drilling the band on timing
• Sweat already forming from intensity of rehearsal

THE FAMOUS FLAMES in matching suits, positioned in formation
PROPS: Vintage microphones, music stands, James''s cape on chair
LIGHTING: Theatrical stage lighting, footlights creating drama
CAMERA: 50mm, f/2.8, high contrast black and white, soul music documentary style
MOOD: Perfectionism, precision, the funk being born',
'music', 'from-orange-500/20 to-red-900/20', 'text-red-400', true),

('Bruce Lee Dojo Drills', '1972', 'Private training session with the Dragon himself', 
'THE SCENE: Jun Fan Gung Fu Institute, Los Angeles, 1972. Mirrors, heavy bags, wooden dummies, Chinese calligraphy on walls.

THE TIME TRAVELER (person from input photo) training with THE DRAGON:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FACE: EXACT face from input - every feature preserved
GENDER: Match input exactly
BODY: Match input build (athletic posture regardless)

HAIR (CREATE - NO HAT):
• IF MALE: 1972 martial arts style - neat and practical, not in the way of fighting
• IF FEMALE: 1972 pulled back for training, practical athletic style
• Slightly sweaty from training

FACIAL HAIR (CREATE):
• IF MALE: Clean-shaven (martial arts discipline)
• IF FEMALE: None

WARDROBE (CREATE):
• IF MALE: Traditional kung fu uniform or simple tank top with loose training pants
• IF FEMALE: 1972 appropriate martial arts training wear
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BRUCE LEE:
• That legendary face - intense piercing eyes, defined cheekbones, strong jaw
• Lean, incredibly defined musculature, every muscle visible
• Shirtless or in simple tank, black pants, barefoot
• Mid-technique demonstrating to time traveler, or in iconic stance
• That famous focused expression, coiled energy

SETTING: Wing Chun wooden dummy in background, speed bags, mirrors reflecting the action
PROPS: Nunchaku on wall, training pads, Chinese scrolls
LIGHTING: Natural daylight from high windows, gymnasium atmosphere
CAMERA: 35mm, f/2.8, action photography style, martial arts documentary
MOOD: Discipline, intensity, master teaching student',
'zap', 'from-yellow-500/20 to-orange-900/20', 'text-yellow-400', true),

('Princess Diana Charity Ward', '1991', 'Royal visit to AIDS hospice breaking barriers', 
'THE SCENE: London AIDS hospice, 1991. Hospital ward with flowers everywhere, natural light through large windows, intimate setting.

THE TIME TRAVELER (person from input photo) alongside THE PEOPLE''S PRINCESS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FACE: EXACT face from input - unmistakably the same person
GENDER: Match input exactly
BODY: Match input build

HAIR (CREATE - NO HAT):
• IF MALE: Early 1990s professional cut, clean and respectable
• IF FEMALE: 1991 styled hair, Diana-era appropriate, professional
• Camera-ready but approachable

FACIAL HAIR (CREATE):
• IF MALE: Clean-shaven or very neat (royal setting appropriateness)
• IF FEMALE: None

WARDROBE (CREATE):
• IF MALE: 1991 professional attire - suit and tie or smart casual
• IF FEMALE: 1991 elegant but approachable dress or suit, modest and caring
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRINCESS DIANA:
• That beloved face - bright blue eyes, warm smile, aristocratic features, shy glance
• Famous short blonde hair in her signature feathered style
• Wearing elegant but approachable dress/suit (not too formal for hospital)
• Holding hands with or embracing someone (NOT wearing gloves - her famous statement)
• That genuine warmth and compassion radiating from her expression

SETTING: Hospital bed with patient in background (tastefully), flowers, cards
PROPS: Flower arrangements, get-well cards, medical equipment tastefully shown
LIGHTING: Soft natural window light, intimate and warm
CAMERA: 85mm portrait lens, f/2, royal photography style, documentary warmth
MOOD: Compassion, barrier-breaking, genuine human connection',
'heart', 'from-pink-500/20 to-rose-900/20', 'text-pink-400', true),

('Bob Marley Sunset Session', '1977', 'Tuff Gong Studio Kingston during Exodus recording', 
'THE SCENE: Tuff Gong Studio backyard, Kingston Jamaica, 1977. Sunset light, tropical plants, studio building in background.

THE TIME TRAVELER (person from input photo) reasoning with THE LEGEND:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FACE: EXACT face from input - pixel-perfect features
GENDER: Match input exactly
BODY: Match input build

HAIR (CREATE - NO HAT):
• IF MALE: 1977 natural style - locs/dreads if appropriate, or afro/natural
• IF FEMALE: 1977 natural Caribbean styling, locs or natural hair
• Relaxed, authentic to the era

FACIAL HAIR (CREATE):
• IF MALE: Beard acceptable (1977 roots style) or natural stubble
• IF FEMALE: None

WARDROBE (CREATE):
• IF MALE: 1977 roots wear - simple shirt or bare chest, natural fabrics, Ethiopian colors optional
• IF FEMALE: 1977 Caribbean style - natural fabrics, relaxed island wear
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BOB MARLEY:
• That iconic face - deep soulful eyes, distinctive nose, peaceful expression
• Famous dreadlocks in their 1977 glory, some locks falling across face
• Lean, wiry build with that spiritual presence
• Holding acoustic guitar or spliff, mid-conversation
• Wearing simple clothes - denim shirt or Ethiopian colors

SETTING: Tropical garden, setting sun creating golden light, studio building visible
PROPS: Acoustic guitar, Red Stripe bottles, natural surroundings
LIGHTING: Golden hour Caribbean sunset, warm and spiritual
CAMERA: 35mm, f/2, warm Kodachrome tones, intimate documentary style
MOOD: Peaceful reasoning session, one love spirit, wisdom being shared',
'music', 'from-green-500/20 to-yellow-900/20', 'text-green-400', true),

('Tupac Studio Session', '1995', 'Death Row Records studio during All Eyez on Me recording', 
'THE SCENE: Can-Am Studios, Los Angeles, 1995. Red and black Death Row aesthetic, mixing boards, low lighting, intense creative energy.

THE TIME TRAVELER (person from input photo) in the booth with THE LEGEND:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FACE: EXACT face from input - identical features
GENDER: Match input exactly
BODY: Match input build

HAIR (CREATE - NO HAT):
• IF MALE: 1995 hip-hop style - bald head, fresh fade, or bandana-style
• IF FEMALE: 1995 R&B style - sleek or voluminous, era-appropriate
• Studio-fresh, West Coast ready

FACIAL HAIR (CREATE):
• IF MALE: Light goatee OR clean-shaven (1995 hip-hop style)
• IF FEMALE: None

WARDROBE (CREATE):
• IF MALE: 1995 Death Row era - Dickies, flannel over white tee, Timbs or Chucks, bandana
• IF FEMALE: 1995 hip-hop style - oversized jacket, gold hoops, era-authentic
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TUPAC SHAKUR (24 years old):
• That intense face - penetrating eyes full of fire and pain, THUG LIFE visible on stomach
• Bald head or bandana, multiple tattoos visible
• Shirtless showing physique and tattoos, or white tank top
• Standing at microphone or in conversation, that revolutionary energy
• Cross pendant, nose ring, that famous intensity

DEATH ROW AESTHETIC: Red lighting, mixing board, vocal booth visible
PROPS: Vintage microphones, notepads with lyrics, Hennessy bottle, ashtrays
LIGHTING: Moody red and low lighting, studio atmosphere
CAMERA: 35mm, f/2, high contrast, hip-hop photography style
MOOD: Creative fury, legendary session, history being made',
'mic', 'from-red-500/20 to-black/40', 'text-red-400', true),

('Marilyn Monroe Powder Room', '1959', 'Hollywood studio dressing room between takes', 
'THE SCENE: 20th Century Fox studio dressing room, 1959. Vanity mirrors with bulb lights, vintage cosmetics, glamour everywhere.

THE TIME TRAVELER (person from input photo) with THE ICON:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FACE: EXACT face from input - every feature preserved
GENDER: Match input exactly
BODY: Match input build

HAIR (CREATE - NO HAT):
• IF MALE: 1959 Hollywood executive style - slicked back, Cary Grant sophistication
• IF FEMALE: 1959 glamorous waves, vintage Hollywood styling
• Movie-set perfection

FACIAL HAIR (CREATE):
• IF MALE: Clean-shaven (1950s Hollywood sophistication)
• IF FEMALE: None

WARDROBE (CREATE):
• IF MALE: 1959 Hollywood style - tailored suit, thin tie, pocket square
• IF FEMALE: 1959 elegant dress or sophisticated separates, pearls optional
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MARILYN MONROE:
• That legendary face - beauty mark, full red lips, bedroom eyes, blonde perfection
• Platinum blonde hair in signature waves/curls
• In silk robe between takes, or elegant dress
• Applying lipstick in mirror, or turning with that famous smile
• Vulnerable glamour, the real Norma Jean showing through

SETTING: Vanity mirror with lightbulbs, vintage cosmetics arranged beautifully, costume rack
PROPS: Champagne flutes, roses, vintage Chanel No. 5, movie script
LIGHTING: Warm vanity bulbs creating halo effect, old Hollywood glamour
CAMERA: 85mm, f/2, soft focus glamour photography, Hurrell style
MOOD: Intimate Old Hollywood, behind the curtain moment, legend unguarded',
'star', 'from-pink-500/20 to-rose-900/20', 'text-pink-400', true),

('Martin Luther King Jr. March', '1965', 'Selma to Montgomery march, crossing Edmund Pettus Bridge', 
'THE SCENE: Edmund Pettus Bridge, Selma Alabama, March 1965. Historic stone bridge, hundreds of marchers, American flags visible.

THE TIME TRAVELER (person from input photo) marching alongside THE DREAMER:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FACE: EXACT face from input - every feature preserved
GENDER: Match input exactly
BODY: Match input build

HAIR (CREATE - NO HAT):
• IF MALE: 1965 respectable activist style - clean and professional
• IF FEMALE: 1965 dignified style - modest and movement-appropriate
• Prepared for historic moment

FACIAL HAIR (CREATE):
• IF MALE: Clean-shaven OR neat mustache (1960s civil rights style)
• IF FEMALE: None

WARDROBE (CREATE):
• IF MALE: 1965 march attire - suit and tie, long coat, dress shoes, SNCC button optional
• IF FEMALE: 1965 respectable dress or suit, sensible shoes for marching
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DR. MARTIN LUTHER KING JR. (36 years old):
• That prophetic face - deep soulful eyes, strong jaw, dignified bearing
• Clean-shaven, neatly groomed hair
• Wearing dark suit, long coat appropriate for March weather
• Arm-in-arm with marchers, leading with quiet determination
• That mix of steel resolve and peaceful hope in his expression

CORETTA SCOTT KING may be visible nearby, John Lewis and other leaders in formation
SETTING: Bridge structure, Alabama River below, marchers stretching back
PROPS: American flags, SNCC signs, voter registration signs
LIGHTING: Overcast Southern sky, documentary photography conditions
CAMERA: 35mm, f/4, black and white documentary style, historical photography
MOOD: Courage, determination, history being made with every step',
'flag', 'from-blue-500/20 to-blue-900/20', 'text-blue-400', true),

('Nelson Mandela Stadium Joy', '1995', 'Rugby World Cup Final, Johannesburg, the rainbow nation moment', 
'THE SCENE: Ellis Park Stadium, Johannesburg, June 24, 1995. 62,000 people, green and gold everywhere, a nation united.

THE TIME TRAVELER (person from input photo) in the moment with MADIBA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FACE: EXACT face from input - every feature preserved
GENDER: Match input exactly
BODY: Match input build

HAIR (CREATE - NO HAT):
• IF MALE: 1995 professional or natural style
• IF FEMALE: 1995 styled appropriately for stadium event
• Celebration-ready

FACIAL HAIR (CREATE):
• IF MALE: Any 1990s appropriate style
• IF FEMALE: None

WARDROBE (CREATE):
• IF MALE: Springbok jersey #6 (like Mandela wore) or supporter gear
• IF FEMALE: Springbok supporter wear, green and gold colors
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NELSON MANDELA (77 years old):
• That beloved face - grey hair, lined with wisdom, that radiant smile
• Wearing the Springbok jersey #6 (Francois Pienaar''s number) with cap
• Raising the Webb Ellis trophy or celebrating with pure joy
• That twinkle in his eyes, the prisoner now the president uniting a nation
• Surrounded by celebration, confetti, euphoria

FRANCOIS PIENAAR may be visible nearby in rugby kit
SETTING: Stadium stands packed, confetti falling, South African flags everywhere
PROPS: Webb Ellis trophy, Springbok flags, green and gold everywhere
LIGHTING: Afternoon stadium light, flashbulbs, celebration atmosphere
CAMERA: 35mm, f/4, sports photography style, historic moment capture
MOOD: Joy, unity, redemption, the rainbow nation born',
'trophy', 'from-green-500/20 to-yellow-900/20', 'text-green-400', true),

('Beatles Abbey Road Crosswalk', '1969', 'The most famous pedestrian crossing in music history', 
'THE SCENE: Abbey Road crossing, St John''s Wood, London, August 8, 1969, 11:35 AM. White zebra crossing, trees lining EMI studios.

THE TIME TRAVELER (person from input photo) in the historic crossing:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FACE: EXACT face from input - identical features
GENDER: Match input exactly
BODY: Match input build

HAIR (CREATE - NO HAT):
• IF MALE: 1969 late Beatles-era - longer, more natural than early mop-top
• IF FEMALE: 1969 long and free-flowing or elegant late-60s style
• End-of-era naturalism

FACIAL HAIR (CREATE):
• IF MALE: Acceptable - late 60s beard/mustache OR clean
• IF FEMALE: None

WARDROBE (CREATE):
• IF MALE: 1969 style - white suit like Lennon, or denim, or smart casual late 60s
• IF FEMALE: 1969 flowing dress or maxi skirt, late-60s bohemian or mod
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THE BEATLES in formation:
JOHN LENNON: All white suit, beard, long hair, leading the line
RINGO STARR: Black suit, full beard, second in line
PAUL MCCARTNEY: Blue suit, barefoot (famous detail), out of step
GEORGE HARRISON: Denim, long hair, trailing

TIME TRAVELER positioned as fifth person in the crossing, matching the stride

SETTING: EMI Studios in background, white VW Beetle parked, London trees
PROPS: The exact Abbey Road scene recreation
LIGHTING: Bright August morning London light, slight overcast
CAMERA: Elevated angle (as original was shot from ladder), 50mm, album cover recreation
MOOD: End of an era, four friends walking, music history crystallized',
'footprints', 'from-slate-500/20 to-slate-900/20', 'text-slate-400', true)

ON CONFLICT (id) DO NOTHING;