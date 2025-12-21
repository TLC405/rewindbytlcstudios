export const GLOBAL_STYLE = `
SINGULARITY PROTOCOL – LEGACY EDITION
- Render as high-end cinematic illustration / painted concept art / graphic-novel cover. NOT a photograph.
- The user has MAXIMUM face lock: exact nose shape, eye shape, jawline, skin texture, hair, and vibe from the reference photo.
- All celebrities and historical figures must look 100% like themselves in their most iconic era (correct hair, clothing, accessories, posture, energy).
- No face-swapping, no deepfakes, no photorealism.
- Scene must feel like a legendary movie poster or album cover where the user is the mythic central figure.
- Subtle TLC easter eggs hidden in-world (signs, lights, props, clothing labels).
- Mood: epic, respectful, larger-than-life.
`;

export interface EraConfig {
  id: string;
  name: string;
  year: string;
  shortTagline: string;
  prompt: string;
  badgeClass: string;
  icon: string;
}

export const eraOrder: string[] = [
  '1900s',
  '1950s',
  '1960s',
  '1970s',
  '1980s',
  '1990s',
  '2000s',
  'dayone',
  'homeless',
];

export const eraConfig: Record<string, EraConfig> = {
  '1900s': {
    id: '1900s',
    name: 'Council of Genius',
    year: '1905',
    shortTagline: 'Invent the Future',
    badgeClass: 'era-badge-1900s',
    icon: '⚡',
    prompt: `High-end painted 1905 laboratory scene like a vintage movie poster. The user stands center in elegant Victorian tweed suit and slicked side-part hair, exact face lock, holding a glowing invention. Nikola Tesla (real face, wild hair, intense eyes) leans in from left. Albert Einstein (real face, messy hair, mustache) from right. Marie Curie, Thomas Edison, Alexander Graham Bell in background, all looking at user with awe. Brass coils, electric arcs, chalkboards. TLC engraved on brass desk plate and chalkboard corner.`,
  },
  '1950s': {
    id: '1950s',
    name: 'Hollywood With Marilyn',
    year: '1955',
    shortTagline: 'Dine With Legends',
    badgeClass: 'era-badge-1950s',
    icon: '💋',
    prompt: `Cinematic painted 1955 supper club scene like a classic film poster. The user sits at candlelit table in sharp suit and greaser pompadour, exact face lock. Marilyn Monroe (real platinum waves, red lips, white dress) gazes lovingly at user. Frank Sinatra raises glass, Dean Martin laughs, Sammy Davis Jr. snaps photo, Audrey Hepburn smiles from edge. Soft spotlight, cigarette smoke. TLC in tiny bulbs on club marquee and matchbook.`,
  },
  '1960s': {
    id: '1960s',
    name: 'Civil Rights & Beatlemania',
    year: '1967',
    shortTagline: 'Lead the Movement',
    badgeClass: 'era-badge-1960s',
    icon: '✊',
    prompt: `Epic painted 1967 strategy room like a political graphic-novel cover. The user stands at podium in 1960s suit and neat afro or mod cut, exact face lock. Martin Luther King Jr., Malcolm X, Muhammad Ali, Bob Dylan, and all four Beatles (real faces, real hair) surround user, listening intently. Kodachrome colors, dramatic overhead light. TLC hidden on microphones and protest signs.`,
  },
  '1970s': {
    id: '1970s',
    name: 'Studio 54 Legends',
    year: '1977',
    shortTagline: 'Rule the Disco',
    badgeClass: 'era-badge-1970s',
    icon: '🕺',
    prompt: `Explosive painted 1977 disco scene like a legendary album gatefold. The user center stage under spotlight, open shirt and afro, exact face lock. Cher singing beside, Elton John at white piano, Mick Jagger dancing, Bob Marley and Jimi Hendrix guitar duel, James Brown and Grace Jones in crowd. Neon-colored stage lights, glitter, mirrorballs. TLC as disco ball pattern and subtle wall sign.`,
  },
  '1980s': {
    id: '1980s',
    name: 'Arcade & Time Machine',
    year: '1985',
    shortTagline: 'Rewrite History',
    badgeClass: 'era-badge-1980s',
    icon: '🕹️',
    prompt: `Wild painted 1985 Hill Valley clock tower scene like a retro movie poster. The user in leather jacket and 80s hair, exact face lock, standing between Doc Brown and Marty McFly. Michael Jackson in Thriller jacket, Michael Jordan mid-dunk, Eddie Murphy laughing. Lightning strikes the clock tower, the DeLorean parked nearby, neon arcade umbrellas in background. TLC glowing on arcade cabinets and DeLorean license plate.`,
  },
  '1990s': {
    id: '1990s',
    name: 'Rap Studio Truce',
    year: '1996',
    shortTagline: 'Unite Hip-Hop',
    badgeClass: 'era-badge-1990s',
    icon: '🎤',
    prompt: `Gritty painted 1996 studio control room like a classic rap album cover. The user on the mixing desk, mic in hand, baggy jeans and bandana, exact face lock. Tupac, Biggie, Snoop, Dr. Dre, Nas, JAY-Z all nodding to user's verse, each in their iconic 90s looks. Platinum plaques, smoke, glowing VU meters. TLC ROW RECORDS plaques on wall.`,
  },
  '2000s': {
    id: '2000s',
    name: 'Red Carpet Takeover',
    year: '2005',
    shortTagline: 'Own the Spotlight',
    badgeClass: 'era-badge-2000s',
    icon: '📸',
    prompt: `Stylized painted 2005 VMAs red carpet like a fashion editorial poster. The user center in velour tracksuit and diamond chain, exact face lock. Beyoncé, Britney Spears, Eminem, Kanye West, Rihanna, Justin Timberlake stand around the user, each in their 2000s red-carpet outfits. Paparazzi flashes as painted starbursts. TLC stitched on tracksuit and repeated in step-and-repeat backdrop.`,
  },
  dayone: {
    id: 'dayone',
    name: 'Dawn Of Man',
    year: '10,000 BC',
    shortTagline: 'Discover Fire',
    badgeClass: 'era-badge-dayone',
    icon: '🔥',
    prompt: `Mythic painted prehistoric scene like National Geographic fantasy art. The user crouches by first fire at the mouth of a cave, long primal hair and furs, exact face lock. Saber-tooth tiger sits calmly beside. Cavemen watch in awe from shadows. Volcano erupting in distance, rain and smoke. TLC carved into cave wall with ochre.`,
  },
  homeless: {
    id: 'homeless',
    name: 'Will Work For Love',
    year: 'Present',
    shortTagline: 'Stay Humble',
    badgeClass: 'era-badge-homeless',
    icon: '❤️',
    prompt: `Respectful painted modern OKC intersection like a documentary poster. The user on a milk crate with 'WILL WORK FOR LOVE' cardboard sign, exact face lock. Loyal stray dog at feet. Paycom Center and Skydance Bridge behind, wet pavement reflecting car lights. Tiny TLC tag on hoodie and a passing bus ad.`,
  },
};

export const getFullPrompt = (eraId: string): string => {
  const era = eraConfig[eraId];
  if (!era) return '';
  return `${GLOBAL_STYLE}\n\n${era.prompt}`;
};

export const getEraList = (): EraConfig[] => {
  return eraOrder.map((id) => eraConfig[id]);
};
