import {
  BarChart3,
  BookOpen,
  Bot,
  Clock,
  GraduationCap,
  MessageSquare,
  Mic,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

export const spmUsps = [
  {
    icon: Clock,
    title: '24/7 access',
    description: 'Practise speaking anytime, anywhere — no scheduling required.',
  },
  {
    icon: GraduationCap,
    title: 'SPM syllabus aligned',
    description:
      'Closely aligned with the SPM English syllabus and speaking assessment requirements.',
  },
] as const

export const spmFeatures: {
  icon: LucideIcon
  title: string
  description: string
}[] = [
  {
    icon: Bot,
    title: 'Speak with AI Coach',
    description:
      'Practise SPM English Speaking Part 1–3 anytime with our AI chatbot that simulates real exam conversations and helps students respond more naturally and confidently.',
  },
  {
    icon: MessageSquare,
    title: 'SPM Role-play Practice Scenarios',
    description:
      'Step into exam-style situations designed for SPM Speaking Part 2 & 3, where students learn how to structure answers using useful vocabulary, phrases, and ideas.',
  },
  {
    icon: Mic,
    title: 'Instant Speaking Feedback & Scoring',
    description:
      'Get immediate scores after every speaking practice so students can clearly understand their fluency, pronunciation, and overall performance.',
  },
  {
    icon: BookOpen,
    title: 'Vocabulary Mastery',
    description:
      'Revise essential SPM speaking vocabulary with clear pronunciation practice, definitions, and usage in real-life contexts. Students learn not just what words mean, but how to use them naturally in spoken answers.',
  },
  {
    icon: Sparkles,
    title: 'Structured Exam Practice Experience',
    description:
      'Practise consistently with guided speaking tasks designed specifically for SPM Speaking Parts 1–3. Build confidence through repeated exposure to exam-style questions and structured response practice.',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking Dashboard',
    description:
      'Monitor improvement over time with detailed insights into speaking performance, vocabulary usage, and fluency development across SPM Speaking Parts 1–3.',
  },
]

export const spmSteps = [
  {
    title: 'Practice Regularly',
    description:
      'Engage with SPM role-play scenarios and speaking tasks that mirror actual exam formats. Build familiarity and confidence through consistent exposure.',
  },
  {
    title: 'Get Instant Feedback',
    description:
      'Receive personalised feedback on your pronunciation, fluency, vocabulary usage, and content organisation. Understand areas for improvement immediately.',
  },
  {
    title: 'Track Improvement',
    description:
      'Follow your progress through detailed analytics and watch your confidence and speaking skills grow. Stay motivated by seeing tangible results.',
  },
] as const

export const spmExperts = [
  {
    name: 'LJEC',
    description: 'Learning Journey Education Centre — trusted SPM English resources available in POPULAR bookstores.',
    href: 'https://learningjourneyeducationcentre.my/our-lessons/',
    cta: 'Explore our SPM programme',
  },
  {
    name: 'Lango',
    description:
      'AI-powered speaking practice platform designed to make exam preparation interactive, engaging, and effective.',
  },
] as const

export const LJEC_LESSONS_URL = 'https://learningjourneyeducationcentre.my/our-lessons/'

export const spmBooks = [
  {
    title: 'SPM Speaking Practice & Score — Book 1',
    src: '/exam/spm-book-1.jpeg',
    alt: 'SPM Speaking Practice & Score Book 1 cover by Learning Journey Education Centre',
  },
  {
    title: 'SPM Speaking Practice & Score — Book 2',
    src: '/exam/spm-book-2.jpeg',
    alt: 'SPM Speaking Practice & Score Book 2 cover by Learning Journey Education Centre',
  },
] as const

export const spmFaqs = [
  {
    question: 'What is the SPM English Speaking Success (SPM ESS) App?',
    answer:
      'SPM ESS is an AI-powered speaking practice app designed to help SPM students improve their English speaking skills through real conversations, role-play scenarios, and instant feedback. Learning becomes active, engaging, and enjoyable — just like talking to a real person.',
  },
  {
    question: 'Who is the app designed for?',
    answer:
      'The app is designed for SPM students who want to build confidence in English speaking, improve fluency, and prepare effectively for the SPM English Speaking Test (Parts 1–3).',
  },
  {
    question: 'Is the content aligned with the SPM English curriculum?',
    answer:
      'Yes. The content is closely aligned with the current SPM English curriculum and speaking assessment requirements. Practice tasks are designed to help students develop the communication skills expected in the SPM English Speaking Test.',
  },
  {
    question: 'Can the app help me prepare for Speaking Parts 1, 2, and 3?',
    answer:
      'Yes. Students can practise personal response questions (Part 1), individual long-turn speaking tasks (Part 2), and discussion and opinion-sharing activities (Part 3). The app provides guided practice to help students organise ideas and respond more confidently.',
  },
  {
    question: 'How does the AI Coach work?',
    answer:
      'The AI Coach acts as a speaking partner. Students can respond to questions verbally and engage in conversations similar to real speaking situations. The AI listens, responds, and provides feedback to help improve speaking performance.',
  },
  {
    question: 'Can the app improve my pronunciation?',
    answer:
      'Yes. The app provides pronunciation practice and feedback to help students speak more clearly and accurately. Students can listen, repeat, and practise regularly to improve their spoken English.',
  },
  {
    question: 'Is there a free trial available?',
    answer:
      'Yes. Students can access a FREE trial version to explore selected features before deciding whether to upgrade to the full programme.',
  },
  {
    question: 'How can I get started?',
    answer:
      'Simply register for a free account, download the app, and begin your free trial. Start practising today and take the first step towards becoming a more confident English speaker.',
  },
] as const
