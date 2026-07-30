export type ProductFeature = {
  slug: string
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  imageWidth: number
  imageHeight: number
  imageOnLeft: boolean
  href?: string
  imageClassName?: string
}

export const productFeatures: ProductFeature[] = [
  {
    slug: 'lango-school',
    title: 'Lango School',
    description:
      'Core language learning platform for schools — gamified quests, real-time progress tracking, and curriculum-aligned content for classrooms.',
    imageSrc: '/figma/product/lango-school.png',
    imageAlt: 'Lango School mobile app on two phones',
    imageWidth: 490,
    imageHeight: 497,
    imageOnLeft: true,
  },
  {
    slug: 'lango-class',
    title: 'Lango Class',
    description:
      'Interactive classroom teaching solution with AI role-play, instant feedback, and tools built for teachers and students.',
    imageSrc: '/figma/product/lango-class.png',
    imageAlt: 'Lango Class on a tablet showing a game map',
    imageWidth: 470,
    imageHeight: 475,
    imageOnLeft: false,
  },
  {
    slug: 'lango-home',
    title: 'Lango Home',
    description:
      'Home learning companion for vocabulary and pronunciation revision — practise anytime with a 3D wizard guide.',
    imageSrc: '/figma/product/lango-home.png',
    imageAlt: 'Lango Home smart display device',
    imageWidth: 473,
    imageHeight: 473,
    imageOnLeft: true,
  },
  {
    slug: 'lango-pen',
    title: 'Lango Pen',
    description:
      'Smart reading pen with customised printed content — scan, listen, and learn with physical books and worksheets.',
    imageSrc: '/figma/product/lango-pen.png',
    imageAlt: 'Lango Pen with workbook and smart pen',
    imageWidth: 481,
    imageHeight: 450,
    imageOnLeft: false,
  },
  {
    slug: 'exam-preparation',
    title: 'Exam Preparation',
    description:
      'Support for DSE, SPM, IELTS, TOEIC and other assessments — build speaking confidence with AI role-play and instant feedback.',
    imageSrc: '/figma/product/exam-prep.png',
    imageAlt: 'Exam preparation app showing progress charts',
    imageWidth: 571,
    imageHeight: 319,
    imageOnLeft: true,
    href: '/exam',
    imageClassName: 'rounded-[32px]',
  },
  {
    slug: 'vocational-training',
    title: 'Vocational Training',
    description:
      'Scenario-based training for real-world communication — including ICAO pilot use cases and industry-specific role-play.',
    imageSrc: '/figma/product/vocational.png',
    imageAlt: 'Vocational training scene in a harbor setting',
    imageWidth: 571,
    imageHeight: 321,
    imageOnLeft: false,
    imageClassName: 'rounded-[32px]',
  },
]
