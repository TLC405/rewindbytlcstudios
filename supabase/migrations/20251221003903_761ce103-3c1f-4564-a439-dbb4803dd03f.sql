-- Delete all existing scenarios
DELETE FROM public.scenarios;

-- Insert the 15 museum-quality scenarios with atomic face-lock prompts
INSERT INTO public.scenarios (title, era, description, prompt_template, icon, gradient, accent, is_active) VALUES

-- 1. Beatles Stage Break Talk
('Beatles Stage Break Talk', '1960s', 'Backstage at Shea Stadium with the Fab Four during a water break between sets', 
'SCENE: Backstage at Shea Stadium, August 1965. The roar of 55,000 fans echoes in the distance.

THE MOMENT: The Beatles are taking a quick water break between sets. John Lennon is mid-joke, gesturing wildly with a towel around his neck. Paul McCartney is laughing, bass still strapped on. George Harrison is tuning his Gretsch guitar. Ringo is tapping drumsticks on a roadie case.

THE TIME TRAVELER stands CENTER among them, caught in the laughter, like an old friend from Liverpool.

CELEBRITIES - EACH WITH UNIQUE FAMOUS LIKENESSES:
• John Lennon: round glasses, sharp wit in his eyes, tousled mop-top
• Paul McCartney: boyish charm, left-handed bass visible
• George Harrison: quiet intensity, fingers on guitar strings
• Ringo Starr: big grin, drumsticks in motion

CAMERA: 35mm Kodak Tri-X, black and white with rich grays
LIGHTING: Harsh backstage tungsten bulbs, sweat glistening
PROPS: Marshall amps, flight cases, paper cups, towels
STYLE: Matte, filmic, documentary feel - NO NEON',
'music', 'from-amber-500/20 to-orange-900/20', 'text-amber-400', true),

-- 2. Muhammad Ali Light Sparring
('Muhammad Ali Light Sparring', '1960s', 'Inside the 5th Street Gym Miami with The Greatest during training', 
'SCENE: 5th Street Gym, Miami Beach, 1964. Sweat and leather fill the air. The heavy bag swings.

THE MOMENT: Muhammad Ali (then Cassius Clay) is showing off footwork, throwing playful jabs at the air. His cornermen Drew Bundini Brown shouts encouragement. Angelo Dundee holds the speed bag steady.

THE TIME TRAVELER is in the ring with Ali, gloves up in sparring stance, as Ali grins and dances around them.

CELEBRITIES - EACH WITH UNIQUE FAMOUS LIKENESSES:
• Muhammad Ali: young, unmarked face, dancing eyes, supreme confidence, 22 years old
• Drew Bundini Brown: animated expression, shouting from corner
• Angelo Dundee: focused trainer''s stare, stopwatch in hand

CAMERA: 50mm lens, Kodak Plus-X black and white
LIGHTING: Gym fluorescents mixed with window light, high contrast
PROPS: Boxing ring ropes, speed bag, heavy bag, spit bucket, boxing gloves
STYLE: Matte, gritty documentary realism - NO NEON',
'boxing-glove', 'from-red-500/20 to-red-900/20', 'text-red-400', true),

-- 3. Michael Jackson Moonwalk Rehearsal
('Michael Jackson Moonwalk Rehearsal', '1980s', 'Inside the dance studio as MJ perfects the legendary moonwalk', 
'SCENE: Los Angeles dance studio, early 1983. Mirrors line the walls. A boombox plays Billie Jean.

THE MOMENT: Michael Jackson is teaching the moonwalk in a private rehearsal. He''s in casual rehearsal clothes - white tank top, black pants, white socks. His brothers Jackie and Marlon watch from folding chairs.

THE TIME TRAVELER stands next to Michael, attempting the slide, as MJ guides their feet positioning with his famous perfectionist attention.

CELEBRITIES - EACH WITH UNIQUE FAMOUS LIKENESSES:
• Michael Jackson: 1983 Thriller-era face, jheri curl, slim build, intense focus, gentle smile
• Jackie Jackson: older brother energy, supportive stance
• Marlon Jackson: impressed expression, leaning forward

CAMERA: 35mm Kodak Portra, warm color tones
LIGHTING: Dance studio fluorescents reflected in mirrors
PROPS: Boombox, folding chairs, water bottles, mirrors, dance floor
STYLE: Matte, warm 80s film stock - NO NEON, NO GLITTER',
'music', 'from-purple-500/20 to-purple-900/20', 'text-purple-400', true),

-- 4. Elvis Sun Records Jam
('Elvis Sun Records Jam', '1950s', 'Inside Sun Studio Memphis during the Million Dollar Quartet session', 
'SCENE: Sun Studio, 706 Union Avenue, Memphis. December 4, 1956. The Million Dollar Quartet.

THE MOMENT: Elvis is at the piano, Jerry Lee Lewis leans over him fighting for keys. Johnny Cash stands tall with his guitar. Carl Perkins strums along. Sam Phillips watches from the control room.

THE TIME TRAVELER sits on the piano bench next to Elvis, sharing the legendary moment.

CELEBRITIES - EACH WITH UNIQUE FAMOUS LIKENESSES:
• Elvis Presley: 21 years old, pompadour perfect, sideburns, playful smirk, army not yet
• Jerry Lee Lewis: wild blonde hair, manic piano energy
• Johnny Cash: tall and dark, Man in Black before the name
• Carl Perkins: blue suede shoes era, picking guitar

CAMERA: 50mm lens, Kodak Tri-X black and white
LIGHTING: Single overhead bulb, intimate recording studio shadows
PROPS: Upright piano, acoustic guitars, vintage microphones, Coca-Cola bottles
STYLE: Matte, intimate, raw rockabilly energy - NO NEON',
'music', 'from-blue-500/20 to-blue-900/20', 'text-blue-400', true),

-- 5. Aretha Franklin Studio Take
('Aretha Franklin Studio Take', '1960s', 'Inside FAME Studios during the recording of Respect', 
'SCENE: FAME Studios, Muscle Shoals, Alabama, 1967. Soul music history being made.

THE MOMENT: Aretha Franklin is at the piano, mid-take on "Respect." The Muscle Shoals rhythm section grooves behind her. Producer Jerry Wexler watches through the control room glass.

THE TIME TRAVELER stands at a microphone next to Aretha, providing backup vocals in this legendary session.

CELEBRITIES - EACH WITH UNIQUE FAMOUS LIKENESSES:
• Aretha Franklin: young Queen of Soul, powerful presence, eyes closed in emotion, 25 years old
• Jerry Wexler: producer''s intensity, headphones around neck

CAMERA: 35mm Kodak Ektachrome, warm color reversal
LIGHTING: Dim studio red lights, intimate recording atmosphere
PROPS: Grand piano, vintage microphones, music stands, reel-to-reel tape machines
STYLE: Matte, soulful warmth, analog studio glow - NO NEON',
'music', 'from-pink-500/20 to-pink-900/20', 'text-pink-400', true),

-- 6. Freddie Mercury Soundcheck
('Freddie Mercury Soundcheck', '1980s', 'On the Live Aid stage at Wembley during the legendary soundcheck', 
'SCENE: Wembley Stadium, London. July 13, 1985. Hours before the greatest rock performance ever.

THE MOMENT: Freddie Mercury runs through vocal warmups on the empty stage. Brian May adjusts his Red Special guitar. Roger Taylor tweaks his drums. John Deacon checks bass levels.

THE TIME TRAVELER stands at a spare microphone, harmonizing with Freddie during "Bohemian Rhapsody" warmups.

CELEBRITIES - EACH WITH UNIQUE FAMOUS LIKENESSES:
• Freddie Mercury: iconic mustache, white tank top, wristband, theatrical presence
• Brian May: huge curly hair, homemade Red Special guitar
• Roger Taylor: blonde drummer, behind the kit
• John Deacon: quiet bassist, focused on amp settings

CAMERA: 35mm Kodak Gold, natural daylight color
LIGHTING: Afternoon English sun, stadium shadows
PROPS: Vintage microphones, guitar amps, drum risers, monitor wedges
STYLE: Matte, natural daylight, pre-show anticipation - NO NEON',
'music', 'from-yellow-500/20 to-yellow-900/20', 'text-yellow-400', true),

-- 7. James Brown Rehearsal Count-In
('James Brown Rehearsal Count-In', '1960s', 'The Apollo Theatre stage during the Hardest Working Man''s rehearsal', 
'SCENE: Apollo Theatre, Harlem, New York. 1966. The Godfather of Soul demands perfection.

THE MOMENT: James Brown is counting in the band, cape on shoulders, pointing to the horn section. The Famous Flames watch their leader. Maceo Parker has his saxophone ready.

THE TIME TRAVELER is in the band, holding an instrument, receiving instruction from The Godfather himself.

CELEBRITIES - EACH WITH UNIQUE FAMOUS LIKENESSES:
• James Brown: processed hair, intense eyes, cape draped on shoulders, pointing finger
• Maceo Parker: young saxophonist, horn raised

CAMERA: 50mm lens, Kodak Tri-X black and white  
LIGHTING: Stage lights creating dramatic shadows
PROPS: Vintage microphone, cape, brass instruments, organ, guitar
STYLE: Matte, high contrast black and white, raw energy - NO NEON',
'music', 'from-orange-500/20 to-orange-900/20', 'text-orange-400', true),

-- 8. Bruce Lee Dojo Drills
('Bruce Lee Dojo Drills', '1970s', 'Inside Bruce Lee''s Los Angeles kwoon during Jeet Kune Do training', 
'SCENE: Bruce Lee''s Los Angeles garage kwoon, 1972. Wooden dummy in the corner. Philosophy on the walls.

THE MOMENT: Bruce Lee demonstrates a technique in slow motion, explaining the flow of energy. Chuck Norris observes from the side. Kareem Abdul-Jabbar stretches in the background.

THE TIME TRAVELER faces Bruce in sparring stance, receiving direct instruction from the master.

CELEBRITIES - EACH WITH UNIQUE FAMOUS LIKENESSES:
• Bruce Lee: shirtless, iconic physique, intense focus, demonstrating form, 31 years old
• Chuck Norris: karate stance, observing carefully
• Kareem Abdul-Jabbar: towering height, stretching

CAMERA: 35mm Kodak Ektachrome, warm 70s color
LIGHTING: Garage window light, afternoon sun streaks
PROPS: Wooden dummy, punching bags, martial arts scrolls, training mats
STYLE: Matte, documentary intimacy, golden hour warmth - NO NEON',
'dumbbell', 'from-green-500/20 to-green-900/20', 'text-green-400', true),

-- 9. Princess Diana Charity Ward
('Princess Diana Charity Ward', '1990s', 'London children''s hospital during Diana''s legendary visit', 
'SCENE: Great Ormond Street Hospital, London, 1992. Diana brings warmth to sick children.

THE MOMENT: Princess Diana sits on a child''s hospital bed, holding their hand with genuine compassion. Photographers capture from a respectful distance. Nurses watch in admiration.

THE TIME TRAVELER is a volunteer beside Diana, helping comfort the young patients.

CELEBRITIES - EACH WITH UNIQUE FAMOUS LIKENESSES:
• Princess Diana: iconic short blonde hair, compassionate blue eyes, warm smile, elegant but approachable

CAMERA: 35mm Canon, documentary news style
LIGHTING: Soft hospital fluorescents, natural window light
PROPS: Hospital bed, flowers, stuffed animals, children''s drawings
STYLE: Matte, warm documentary, genuine emotion - NO NEON',
'heart', 'from-pink-500/20 to-rose-900/20', 'text-pink-400', true),

-- 10. Beatles Abbey Road Crosswalk
('Beatles Abbey Road Crosswalk', '1960s', 'The iconic Abbey Road zebra crossing photo session', 
'SCENE: Abbey Road zebra crossing, London. August 8, 1969, 11:35 AM. The most famous crosswalk in history.

THE MOMENT: The Beatles walk single file across the zebra crossing. John in white, Ringo in black suit, Paul barefoot, George in denim. Photographer Iain Macmillan shoots from a ladder.

THE TIME TRAVELER walks in the line with the Fab Four, becoming part of music history.

CELEBRITIES - EACH WITH UNIQUE FAMOUS LIKENESSES:
• John Lennon: all white suit, beard, walking with purpose
• Paul McCartney: barefoot, out of step, cigarette in hand
• George Harrison: denim jacket, long hair, stepping forward
• Ringo Starr: black suit, in stride

CAMERA: Hasselblad medium format, Kodak film
LIGHTING: Late morning London sun, soft shadows
PROPS: White Volkswagen Beetle, zebra crossing stripes, Abbey Road Studios in background
STYLE: Matte, iconic, album cover perfection - NO NEON',
'music', 'from-cyan-500/20 to-cyan-900/20', 'text-cyan-400', true),

-- 11. Nelson Mandela Victory Celebration  
('Mandela World Cup Locker Room', '1990s', 'South African rugby locker room during the historic 1995 World Cup', 
'SCENE: Ellis Park Stadium locker room, Johannesburg. June 24, 1995. The Rainbow Nation celebrates.

THE MOMENT: Nelson Mandela, wearing Francois Pienaar''s #6 Springbok jersey, embraces the captain after victory. Players celebrate around them. The trophy gleams.

THE TIME TRAVELER is among the players, part of this historic moment of reconciliation.

CELEBRITIES - EACH WITH UNIQUE FAMOUS LIKENESSES:
• Nelson Mandela: 77 years old, iconic smile, Springbok jersey, radiating joy
• Francois Pienaar: blonde captain, muddy jersey, emotional embrace

CAMERA: 35mm Nikon, sports documentary style
LIGHTING: Harsh locker room lights, sweat and tears glistening
PROPS: Webb Ellis Cup trophy, rugby jerseys, champagne bottles, South African flags
STYLE: Matte, documentary emotion, historic significance - NO NEON',
'trophy', 'from-emerald-500/20 to-emerald-900/20', 'text-emerald-400', true),

-- 12. Black Panther Community Breakfast
('Black Panther Community Breakfast', '1960s', 'Oakland community center during the Free Breakfast Program', 
'SCENE: Oakland community center, 1969. The Black Panther Party''s Free Breakfast for Children Program.

THE MOMENT: Bobby Seale and Huey Newton help serve breakfast to neighborhood children. Community members gather in solidarity. The Ten-Point Program hangs on the wall.

THE TIME TRAVELER helps serve food alongside the Panthers, participating in community action.

CELEBRITIES - EACH WITH UNIQUE FAMOUS LIKENESSES:
• Bobby Seale: black beret, determined expression, serving children
• Huey Newton: leather jacket, thoughtful gaze, engaging with community

CAMERA: 35mm Kodak Tri-X, documentary photojournalism
LIGHTING: Morning light through community center windows
PROPS: Breakfast plates, orange juice, folding tables, Ten-Point Program poster
STYLE: Matte, documentary realism, community warmth - NO NEON',
'users', 'from-stone-500/20 to-stone-900/20', 'text-stone-400', true),

-- 13. Tupac Studio Session
('Tupac Studio Session', '1990s', 'Death Row Studios during a legendary late-night recording session', 
'SCENE: Death Row Studios, Los Angeles, 1995. The most prolific rapper ever at work.

THE MOMENT: Tupac is in the booth, headphones on, pages of lyrics scattered. Dr. Dre works the mixing board. Snoop Dogg vibes on the couch. Suge Knight watches from the shadows.

THE TIME TRAVELER is in the studio, observing genius at work, as Tupac records between takes.

CELEBRITIES - EACH WITH UNIQUE FAMOUS LIKENESSES:
• Tupac Shakur: bandana, nose ring, intense eyes, Thug Life tattoo visible, 24 years old
• Dr. Dre: calm producer focus, headphones, at the board
• Snoop Dogg: braids, laid-back posture, on the couch

CAMERA: 35mm, low light documentary
LIGHTING: Dim studio mood lighting, vocal booth glow
PROPS: Microphone, mixing board, lyric notebooks, Hennessy bottle
STYLE: Matte, moody, intimate studio session - NO NEON',
'music', 'from-red-600/20 to-black/40', 'text-red-500', true),

-- 14. Marilyn Monroe Film Set
('Marilyn Monroe Film Set', '1950s', 'On the set of Some Like It Hot during a scene break', 
'SCENE: Hollywood soundstage, 1958. Billy Wilder''s masterpiece in production.

THE MOMENT: Marilyn Monroe sits in a director''s chair, script in hand, between takes. Tony Curtis and Jack Lemmon in drag costumes joke nearby. Billy Wilder reviews camera angles.

THE TIME TRAVELER sits in an adjacent chair, chatting with Marilyn during the break.

CELEBRITIES - EACH WITH UNIQUE FAMOUS LIKENESSES:
• Marilyn Monroe: platinum blonde waves, red lips, beauty mark, iconic vulnerability
• Tony Curtis: 1920s drag costume, handsome features showing through
• Jack Lemmon: similar drag costume, comedic expression

CAMERA: 35mm Kodak, Hollywood glamour style
LIGHTING: Classic studio three-point lighting
PROPS: Director''s chairs, film cameras, clapboard, script pages
STYLE: Matte, golden age Hollywood glamour - NO NEON',
'star', 'from-rose-500/20 to-rose-900/20', 'text-rose-400', true),

-- 15. Bob Marley Backstage Kingston
('Bob Marley Backstage Kingston', '1970s', 'Backstage at the One Love Peace Concert in Kingston', 
'SCENE: National Stadium, Kingston, Jamaica. April 22, 1978. The One Love Peace Concert.

THE MOMENT: Bob Marley is backstage, dreadlocks flowing, sharing a moment before the historic performance. Peter Tosh tunes his guitar. Bunny Wailer meditates in the corner.

THE TIME TRAVELER shares this sacred pre-show moment with the reggae legends.

CELEBRITIES - EACH WITH UNIQUE FAMOUS LIKENESSES:
• Bob Marley: iconic dreadlocks, penetrating eyes, slim build, spiritual presence
• Peter Tosh: tall and proud, guitar in hands
• Bunny Wailer: peaceful expression, eyes closed

CAMERA: 35mm Kodak Gold, warm Caribbean tones
LIGHTING: Jamaican sunset through backstage curtains
PROPS: Guitars, amplifiers, incense, Jamaican flags
STYLE: Matte, warm golden hour, spiritual energy - NO NEON',
'music', 'from-green-600/20 to-yellow-900/20', 'text-green-400', true);
