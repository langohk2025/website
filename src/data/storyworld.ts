export type StoryworldCharacter = {
  id: string
  name: string
  bio: string
  imageSrc: string
  imageWidth: number
  imageHeight: number
}

export const storyworldCharacters: StoryworldCharacter[] = [
  {
    id: 'dan',
    name: 'Dan',
    bio: "Chris's long-time best friend, easily spotted by his chubby build, overalls, and warm smile. Despite struggling in school, he is remarkably cheerful and always tries to cheer Chris up when he feels down.",
    imageSrc: '/figma/storyworld/character-1.png?v=2',
    imageWidth: 138,
    imageHeight: 313,
  },
  {
    id: 'chris-wong',
    name: 'Chris Wong',
    bio: 'The tech-savvy main character who is passionate, curious, and a bit mischievous. Accompanied by his talking pet parrot who helps him learn English, his goal is to visit Jessica during the summer holiday.',
    imageSrc: '/figma/storyworld/character-2.png?v=2',
    imageWidth: 139,
    imageHeight: 301,
  },
  {
    id: 'uncle-tommy',
    name: 'Uncle Tommy',
    bio: "Chris's fun-loving English teacher and class teacher who loves joking with his students and acting as their hero in tough times. Though a bit stingy, unlucky, and easily annoyed, Chris trusts him deeply.",
    imageSrc: '/figma/storyworld/character-3.png?v=2',
    imageWidth: 183,
    imageHeight: 381,
  },
  {
    id: 'jessica',
    name: 'Jessica',
    bio: "Chris's foreign friend and exchange student, recognizable by her pink curly hair, green eyes, and bright personality. As a top student who loves reading and cultures, she helps Chris practice his English.",
    imageSrc: '/figma/storyworld/character-4.png?v=2',
    imageWidth: 147,
    imageHeight: 312,
  },
  {
    id: 'ryan',
    name: 'Ryan',
    bio: 'A tall, athletic classmate whose intense competitiveness and jealousy over Jessica spark frequent rivalries with Chris. Deep down, he has a softer side with close friends and eventually learns the value of teamwork.',
    imageSrc: '/figma/storyworld/character-5.png?v=2',
    imageWidth: 140,
    imageHeight: 290,
  },
]

export const defaultCharacterId = 'uncle-tommy'

export const storyworldStoryline = {
  title: 'Storyline',
  description:
    'Follow connected story arcs across missions, chapters, and character meet-ups. Each storyline weaves vocabulary, dialogue, and real-world themes into adventures learners want to finish.',
  youtubeId: '6w0B_wbKNp0',
  width: 592,
  height: 443,
}
