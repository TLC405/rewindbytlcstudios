
-- Complete Scene Overhaul: Delete all existing scenarios and create 22 unique scenes
-- No celebrity appears more than once across the entire app

-- First, clear all existing scenarios
DELETE FROM public.scenarios;

-- INSERT 22 UNIQUE SCENES

-- ============================================
-- INTIMATE "LIFE MOMENTS" (No Celebrities)
-- ============================================

INSERT INTO public.scenarios (title, era, description, prompt_template, icon, gradient, accent, is_active) VALUES
(
  'Living Room Movie Night',
  '1950s',
  'Cozy evening cuddled on the sofa watching TV with loved ones',
  'Ultra realistic candid photograph inside a warm 1950s family living room at night. YOUR SUBJECT (Reference Person) is the MAIN FOCUS sitting on a vintage floral-patterned sofa, cuddled close with a loved one under a hand-knitted blanket. The warm glow of a wood-cabinet Philco television illuminates their faces, showing a black-and-white variety show. On the mahogany coffee table: warm milk in glass bottles, homemade chocolate chip cookies on a ceramic plate, TV Guide magazine. Wallpaper with subtle rose patterns, family photographs in brass frames on the fireplace mantle, ceramic lamp casting amber light. Shag carpet underfoot. NO CELEBRITIES - just an intimate family moment frozen in time. Shot on medium format Kodak Portra, warm golden tungsten glow, nostalgic and tender atmosphere. Shallow depth of field focusing on the couple.',
  'home',
  'from-amber-500/20 to-orange-900/20',
  'text-amber-400',
  true
),
(
  'Sunday Morning Coffee',
  '1970s',
  'Peaceful kitchen moment with morning light and loved ones',
  'Ultra realistic candid photograph of a cozy 1970s kitchen bathed in golden morning sunlight streaming through gingham curtains. YOUR SUBJECT (Reference Person) is the MAIN FOCUS sitting at a Formica table with chrome legs, holding a ceramic coffee mug, sharing a quiet moment with family. Newspaper spread on table, steam rising from cups. Avocado green appliances, wood-paneled walls, macramé plant hangers with spider plants, orange and brown geometric wallpaper. Breakfast plates with eggs and toast. Peaceful Sunday morning energy - no rush, just connection. NO CELEBRITIES - pure intimate family moment. Shot on Kodak Gold 200, warm diffused light, nostalgic 70s color palette with slight grain.',
  'coffee',
  'from-orange-500/20 to-yellow-900/20',
  'text-orange-400',
  true
),
(
  'Rooftop Sunset Hangout',
  '1990s',
  'Summer evening with friends overlooking the city skyline',
  'Ultra realistic candid photograph on a New York City rooftop at golden hour, summer 1995. YOUR SUBJECT (Reference Person) is the MAIN FOCUS leaning against the brick ledge, laughing with close friends. Boombox playing nearby, cooler with drinks, lawn chairs set up. City skyline silhouetted against orange and pink sunset. Everyone in vintage 90s fashion - baggy jeans, oversized band tees, bucket hats. String lights beginning to glow. Pigeons on nearby water tower. NO CELEBRITIES - just authentic friendship moment. Shot on Fuji Superia 400, warm sunset tones, candid documentary style with slight motion blur capturing genuine laughter.',
  'sunset',
  'from-pink-500/20 to-purple-900/20',
  'text-pink-400',
  true
);

-- ============================================
-- PRESIDENTS & WORLD LEADERS
-- ============================================

INSERT INTO public.scenarios (title, era, description, prompt_template, icon, gradient, accent, is_active) VALUES
(
  'White House State Dinner',
  '1960s',
  'Elegant evening with JFK, Jackie, and Robert Kennedy',
  'Ultra realistic photograph of an elegant 1962 White House State Dinner in the East Room. YOUR SUBJECT (Reference Person) is the MAIN FOCUS seated at the head table, engaged in charming conversation. PRESIDENT JOHN F. KENNEDY (one appearance only) sits nearby with his signature charismatic smile, gesturing animatedly while telling a story. JACKIE KENNEDY (one appearance only) is the picture of elegance in a pastel Oleg Cassini gown, pearl necklace gleaming, listening with graceful poise. ROBERT KENNEDY (one appearance only) leans in with intense focus, mid-discussion about policy. Crystal chandeliers cast prismatic light, fine china and silver on white tablecloths, fresh flower arrangements, tuxedos and evening gowns everywhere. Shot on Kodachrome, warm tungsten lighting, photojournalistic style capturing historic intimacy.',
  'landmark',
  'from-blue-500/20 to-indigo-900/20',
  'text-blue-400',
  true
),
(
  'Mandela Freedom Celebration',
  '1990s',
  'Historic moment celebrating freedom with Mandela and Tutu',
  'Ultra realistic photograph of the historic 1994 South African freedom celebration in Johannesburg. YOUR SUBJECT (Reference Person) is the MAIN FOCUS standing among the jubilant crowd, tears of joy streaming. NELSON MANDELA (one appearance only) stands on the platform with his fist raised triumphantly in the air, his weathered face beaming with hard-won joy, wearing his iconic Madiba shirt. ARCHBISHOP DESMOND TUTU (one appearance only) is dancing with pure elation beside him, purple vestments flowing, laughter erupting from his soul. MIRIAM MAKEBA (one appearance only) sings into the microphone, her powerful voice carrying across the crowd, traditional African dress radiant. South African flags waving, confetti falling, thousands celebrating. Shot on Kodak Tri-X, documentary photojournalism style, historic gravitas.',
  'flag',
  'from-green-500/20 to-yellow-900/20',
  'text-green-400',
  true
),
(
  'Obama Campaign Rally',
  '2000s',
  'Historic campaign trail moment with the Obamas and Oprah',
  'Ultra realistic photograph of a 2008 presidential campaign rally in Chicago. YOUR SUBJECT (Reference Person) is the MAIN FOCUS in the crowd, hope visible in their eyes. BARACK OBAMA (one appearance only) stands at the podium mid-speech, one hand raised with passionate conviction, his "Hope" poster aesthetic come to life. MICHELLE OBAMA (one appearance only) stands beside him applauding with genuine pride, her presence commanding and warm. OPRAH WINFREY (one appearance only) is in the crowd nearby, hands clasped together in emotional support, tears in her eyes. American flags waving, "Change We Can Believe In" signs, diverse crowd united. Blue and red stage lighting, autumn afternoon. Shot on Canon 5D, photojournalistic style, historic campaign energy.',
  'vote',
  'from-red-500/20 to-blue-900/20',
  'text-red-400',
  true
);

-- ============================================
-- ACTIVISTS & VISIONARIES
-- ============================================

INSERT INTO public.scenarios (title, era, description, prompt_template, icon, gradient, accent, is_active) VALUES
(
  'Peace March at Dawn',
  '1940s',
  'Walking alongside Gandhi, Einstein, and Eleanor Roosevelt',
  'Ultra realistic photograph of a peaceful dawn march for human rights, 1947. YOUR SUBJECT (Reference Person) is the MAIN FOCUS walking in the front line of marchers. MAHATMA GANDHI (one appearance only) walks beside them with his wooden walking staff, wearing his simple white dhoti, face serene with unwavering determination. ALBERT EINSTEIN (one appearance only) walks thoughtfully nearby, wild white hair catching the morning light, eyes deep with contemplation about humanity. ELEANOR ROOSEVELT (one appearance only) links arms with fellow marchers, her dignified bearing radiating strength and compassion. Golden sunrise breaking through morning mist, peaceful protesters carrying signs of unity, dew on grass. Shot on large format Speed Graphic, sepia-toned silver gelatin, historic gravitas.',
  'heart',
  'from-amber-500/20 to-stone-900/20',
  'text-amber-300',
  true
),
(
  'March on Washington',
  '1960s',
  'Standing at the historic 1963 civil rights demonstration',
  'Ultra realistic photograph at the historic March on Washington, August 28, 1963. YOUR SUBJECT (Reference Person) is the MAIN FOCUS standing near the Lincoln Memorial reflecting pool. DR. MARTIN LUTHER KING JR. (one appearance only) is at the podium mid-speech, arm raised powerfully, his voice echoing across 250,000 souls with the words that changed history. ROSA PARKS (one appearance only) stands proudly in the crowd nearby, quiet dignity radiating from her presence, wearing her Sunday best. MALCOLM X (one appearance only) observes from a distance with his intense, penetrating gaze, arms crossed, wearing his signature glasses. Reflecting pool stretching toward Washington Monument, sea of people, American flags and protest signs. Shot on Hasselblad, black and white Tri-X film, documentary photography.',
  'users',
  'from-slate-500/20 to-slate-900/20',
  'text-slate-300',
  true
),
(
  'Farmworker Unity Rally',
  '1970s',
  'Standing with Cesar Chavez and Dolores Huerta for justice',
  'Ultra realistic photograph of a United Farm Workers rally in California grape fields, 1970. YOUR SUBJECT (Reference Person) is the MAIN FOCUS marching alongside the workers. CESAR CHAVEZ (one appearance only) leads the march with quiet determination, holding the UFW eagle flag high, sweat on his brow from the dusty walk. DOLORES HUERTA (one appearance only) walks beside him with fierce passion, shouting "Sí se puede!" with her fist raised, hair blowing in the wind. JOAN BAEZ (one appearance only) strums her acoustic guitar while walking, singing protest songs that carry across the vineyards. Dusty California fields at sunset, workers in straw hats, red and black UFW flags. Shot on Kodak Plus-X, documentary style, golden hour agricultural light.',
  'leaf',
  'from-lime-500/20 to-green-900/20',
  'text-lime-400',
  true
);

-- ============================================
-- SPORTS LEGENDS
-- ============================================

INSERT INTO public.scenarios (title, era, description, prompt_template, icon, gradient, accent, is_active) VALUES
(
  'Boxing Gym Training',
  '1960s',
  'Training alongside Muhammad Ali and Joe Frazier',
  'Ultra realistic photograph inside a gritty 1966 boxing gym in Louisville, Kentucky. YOUR SUBJECT (Reference Person) is the MAIN FOCUS wrapping their hands with tape, focused intensity. MUHAMMAD ALI (one appearance only) is mid-jab on the heavy bag, sweat flying from his face, every muscle defined, poetry in motion with his famous shuffle footwork. JOE FRAZIER (one appearance only) pounds the speed bag nearby with devastating rhythm, his powerful shoulders glistening, focused grimace on his face. HOWARD COSELL (one appearance only) stands ringside with notepad in hand, scribbling observations, microphone ready. Dusty sunbeams through grimy windows, worn leather equipment, motivational posters on brick walls. Shot on Tri-X pushed to 1600, high contrast black and white, sweat and determination.',
  'dumbbell',
  'from-red-600/20 to-red-900/20',
  'text-red-500',
  true
),
(
  'Lakers Showtime Game',
  '1980s',
  'Courtside at the Forum with Magic and Kareem',
  'Ultra realistic photograph courtside at the LA Forum during a 1987 Lakers Showtime game. YOUR SUBJECT (Reference Person) is the MAIN FOCUS sitting courtside, caught in the excitement. MAGIC JOHNSON (one appearance only) is mid-no-look pass, ball leaving his fingertips with impossible spin, his megawatt smile beaming, gold chain bouncing. KAREEM ABDUL-JABBAR (one appearance only) is releasing his unstoppable skyhook, arm fully extended, goggles gleaming under arena lights. JACK NICHOLSON (one appearance only) is jumping out of his courtside seat in celebration, sunglasses askew, pure Hollywood excitement. Purple and gold everywhere, championship banners hanging, camera flashes popping. Shot on Kodak VR 1000, action sports photography, frozen motion blur.',
  'trophy',
  'from-purple-500/20 to-yellow-900/20',
  'text-purple-400',
  true
),
(
  'World Cup Glory',
  '1970s',
  'On the pitch with Pelé and the beautiful game legends',
  'Ultra realistic photograph on the pitch at the 1970 World Cup Final at Estadio Azteca, Mexico City. YOUR SUBJECT (Reference Person) is the MAIN FOCUS celebrating on the field. PELÉ (one appearance only) leaps in his famous bicycle kick pose, yellow Brazil jersey #10 iconic, pure athletic poetry suspended in air. FRANZ BECKENBAUER (one appearance only) watches from nearby, arms raised in admiration, West German captain acknowledging greatness. JOHAN CRUYFF (one appearance only) performs his signature Cruyff turn in the background, orange Netherlands jersey flowing. 107,000 fans roaring, confetti falling, Mexican sun blazing. Shot on medium format Hasselblad, vivid Ektachrome colors, sports photography golden age.',
  'goal',
  'from-yellow-500/20 to-green-900/20',
  'text-yellow-400',
  true
),
(
  'Bulls Dynasty Celebration',
  '1990s',
  'Champagne celebration with Jordan, Pippen, and Rodman',
  'Ultra realistic photograph in the Chicago Bulls locker room after winning the 1998 NBA Championship. YOUR SUBJECT (Reference Person) is the MAIN FOCUS holding the Larry O Brien trophy, champagne dripping. MICHAEL JORDAN (one appearance only) is mid-champagne spray, tongue out in his signature expression, six championship rings glinting, GOAT energy radiating. SCOTTIE PIPPEN (one appearance only) has his arm around teammates, huge smile breaking through his usually stoic demeanor, cigar in hand. DENNIS RODMAN (one appearance only) has championship confetti stuck in his neon green hair, tattoos glistening with champagne, whooping with wild celebration. Red Bulls jerseys, championship hats, pure euphoria. Shot on Nikon F5, sports photojournalism, flash-lit celebration chaos.',
  'medal',
  'from-red-500/20 to-black/20',
  'text-red-400',
  true
);

-- ============================================
-- MUSIC LEGENDS
-- ============================================

INSERT INTO public.scenarios (title, era, description, prompt_template, icon, gradient, accent, is_active) VALUES
(
  'Drive-In Movie Date',
  '1950s',
  'Classic cars and crooners at the drive-in theater',
  'Ultra realistic photograph at a 1957 California drive-in movie theater at dusk. YOUR SUBJECT (Reference Person) is the MAIN FOCUS leaning against a cherry red 57 Chevy Bel Air, soda pop in hand. NAT KING COLE (one appearance only) serenades from a nearby convertible, his velvet voice carrying through the summer air, immaculate in his suit, signature warm smile. SAMMY DAVIS JR. (one appearance only) is dancing on the hood of a Cadillac, tap shoes clicking, entertaining the crowd with effortless cool. LITTLE RICHARD (one appearance only) is at the concession stand piano, pounding keys wildly, pompadour perfect, whooping with energy. Giant movie screen glowing, teens in poodle skirts, carhops on roller skates. Shot on Kodachrome, warm California sunset, American Graffiti nostalgia.',
  'car',
  'from-cyan-500/20 to-blue-900/20',
  'text-cyan-400',
  true
),
(
  'Woodstock Festival',
  '1960s',
  'Peace, love, and legendary performances at the historic festival',
  'Ultra realistic photograph at Woodstock Music Festival, August 1969, Bethel, New York. YOUR SUBJECT (Reference Person) is the MAIN FOCUS in the legendary crowd, flower crown on head, peace sign fingers raised. JIMI HENDRIX (one appearance only) is on stage mid-guitar solo, Purple Haze flames seeming to leap from his Stratocaster, headband flowing, lost in transcendent musical ecstasy. JANIS JOPLIN (one appearance only) is belting into the microphone with raw soul-shaking power nearby, feather boa and beads swaying, Southern Comfort bottle in hand. CARLOS SANTANA (one appearance only) has his eyes closed in spiritual connection with his guitar, fingers dancing through "Soul Sacrifice." Mud, tie-dye everywhere, half million people, rain-soaked peace. Shot on Kodak Tri-X, concert photography, historic counterculture moment.',
  'music',
  'from-purple-500/20 to-pink-900/20',
  'text-purple-400',
  true
),
(
  'Soul Train Dance Floor',
  '1970s',
  'Grooving under the disco lights with soul legends',
  'Ultra realistic photograph on the iconic Soul Train television set, 1975. YOUR SUBJECT (Reference Person) is the MAIN FOCUS striking a disco pose on the famous dance floor, bell-bottoms flowing. DONNA SUMMER (one appearance only) is hitting her signature disco queen pose nearby, sequined dress catching every light, "Love to Love You Baby" energy radiating. MARVIN GAYE (one appearance only) is crooning smoothly in his open silk shirt, eyes closed in musical passion, smooth as the groove itself. STEVIE WONDER (one appearance only) is swaying behind his keyboards with pure joy, head moving to the rhythm, braids swinging. Iconic "SOUL" letters behind them, disco ball spinning, platform shoes everywhere. Shot on 35mm Ektachrome, 70s TV broadcast lighting, funk and soul aesthetic.',
  'disc',
  'from-orange-500/20 to-pink-900/20',
  'text-orange-400',
  true
),
(
  'MTV Video Premiere',
  '1980s',
  'Behind the scenes of an iconic music video shoot',
  'Ultra realistic photograph on an MTV music video set, 1984. YOUR SUBJECT (Reference Person) is the MAIN FOCUS standing in the director''s chair area, watching magic unfold. PRINCE (one appearance only) executes a legendary split jump mid-air in his purple crushed velvet suit, guitar screaming, Purple Rain energy unleashed. MADONNA (one appearance only) is voguing dramatically nearby in her lace gloves and crucifix jewelry, "Like a Virgin" wedding dress era, commanding every camera. WHITNEY HOUSTON (one appearance only) is belting an impossibly high note, eyes closed in vocal transcendence, power ballad perfection. Smoke machines, dramatic lighting rigs, video monitors everywhere. Shot on 35mm Kodak 5247, music video production aesthetic, peak MTV era.',
  'video',
  'from-fuchsia-500/20 to-purple-900/20',
  'text-fuchsia-400',
  true
),
(
  'Late Night Studio Session',
  '1990s',
  'Creating history in the recording booth with hip-hop legends',
  'Ultra realistic photograph inside a legendary New York recording studio, 2 AM, 1996. YOUR SUBJECT (Reference Person) is the MAIN FOCUS sitting at the mixing console, headphones around neck. TUPAC SHAKUR (one appearance only) is writing intensely in his notebook nearby, bandana on, Thug Life tattoo visible, pen moving with urgent poetry. THE NOTORIOUS B.I.G. (one appearance only) has headphones on in the vocal booth, eyes closed, one hand raised, spitting bars with effortless flow. AALIYAH (one appearance only) is on the studio couch reviewing lyrics, her signature style - sunglasses, baggy Tommy Hilfiger - timeless. Low red studio lighting, gold records on walls, Neve console glowing. Shot on Contax G2, low light film photography, hip-hop golden era intimacy.',
  'mic',
  'from-red-500/20 to-amber-900/20',
  'text-red-400',
  true
),
(
  'Award Show Backstage',
  '2000s',
  'VIP access with Beyoncé, Kanye, and Pharrell before the show',
  'Ultra realistic photograph backstage at the 2004 MTV Video Music Awards. YOUR SUBJECT (Reference Person) is the MAIN FOCUS in the green room, champagne flute in hand. BEYONCÉ (one appearance only) is mid-hair-flip doing a final rehearsal, Destiny''s Child era serving pure star power, every sequin catching light. KANYE WEST (one appearance only) gestures animatedly explaining his next artistic vision, pink polo era, genius energy radiating, passion in every hand movement. PHARRELL WILLIAMS (one appearance only) tips his signature Vivienne Westwood hat with a cool nod, "Frontin" era smooth, Neptunes production god. Makeup stations, wardrobe racks, show countdown on monitors. Shot on Canon 1D Mark II, celebrity event photography, flash and glamour.',
  'award',
  'from-gold-500/20 to-amber-900/20',
  'text-yellow-400',
  true
),
(
  'Festival Sunset Headline',
  '2010s',
  'Main stage magic with Kendrick, Frank Ocean, and SZA',
  'Ultra realistic photograph at Coachella main stage during golden hour, 2017. YOUR SUBJECT (Reference Person) is the MAIN FOCUS in the VIP section, arms raised to the sunset. KENDRICK LAMAR (one appearance only) commands the massive stage, DAMN era, every word hitting like gospel, crowd of 100,000 hanging on each syllable, fist raised. FRANK OCEAN (one appearance only) is bathed in ethereal golden light on a secondary stage, Blonde era angelic, voice floating over the desert. SZA (one appearance only) harmonizes dreamily from the wings, flower crown and CTRL era beauty, voice like honey. Ferris wheel silhouette, palm trees, California desert sunset explosion of color. Shot on Sony A7R III, festival photography, magic hour spectacle.',
  'sun',
  'from-orange-500/20 to-rose-900/20',
  'text-orange-400',
  true
);

-- ============================================
-- ARTISTS & INTELLECTUALS
-- ============================================

INSERT INTO public.scenarios (title, era, description, prompt_template, icon, gradient, accent, is_active) VALUES
(
  'NYC Gallery Opening',
  '1980s',
  'Downtown art scene with Basquiat, Haring, and Warhol',
  'Ultra realistic photograph at a SoHo gallery opening, New York City, 1983. YOUR SUBJECT (Reference Person) is the MAIN FOCUS admiring artwork, wine glass in hand, dressed downtown cool. JEAN-MICHEL BASQUIAT (one appearance only) is painting LIVE on a massive canvas, crown motifs emerging, dreadlocks wild, paint-splattered Armani suit, genius at work. KEITH HARING (one appearance only) is sketching his signature dancing figures directly on the gallery wall, chalk flying, radiant baby emerging, pure creative energy. ANDY WARHOL (one appearance only) observes through the lens of his Polaroid camera, silver wig perfect, capturing the moment, Factory mystique intact. Exposed brick, track lighting, beautiful people in black. Shot on Contax T2, art world documentary, downtown NYC cool.',
  'palette',
  'from-pink-500/20 to-violet-900/20',
  'text-pink-400',
  true
),
(
  'Gospel Church Sunday',
  '1960s',
  'Spiritual morning with Aretha, Mahalia Jackson, and Sam Cooke',
  'Ultra realistic photograph inside a historic Black church in Detroit, Sunday morning 1963. YOUR SUBJECT (Reference Person) is the MAIN FOCUS in the congregation, dressed in Sunday best, hands raised in worship. ARETHA FRANKLIN (one appearance only) leads the choir with her impossibly powerful voice, hands raised to heaven, young Queen of Soul in white choir robe, tears of spirit streaming. MAHALIA JACKSON (one appearance only) sways beside her, gospel legend in full flight, moving the congregation to their feet with pure holy fire. SAM COOKE (one appearance only) sings backup with smooth perfection, tambourine in hand, suit immaculate, "A Change Is Gonna Come" energy. Stained glass windows casting colored light, organ pipes gleaming, hats and fans and hallelujahs. Shot on Kodak Tri-X, photojournalism, sacred soul music moment.',
  'church',
  'from-amber-500/20 to-rose-900/20',
  'text-amber-400',
  true
);
