'use client'

import { motion } from 'framer-motion'
import { Bot, MessageCircle, Trophy, BarChart3, Target, Users, Smartphone, BookOpen } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAppStore, faGooglePlay } from '@fortawesome/free-brands-svg-icons';


export default function Features() {
  const features = [
    {
      icon: Bot,
      title: 'Speak with Robot',
      description: 'Practice English speaking with our AI robot.',
    },
    {
      icon: MessageCircle,
      title: 'Role-play Exercise',
      description: 'To provide an immersive conversational experience in various scenarios',
    },
    {
      icon: Trophy,
      title: 'Immediate Grading',
      description: 'After each exercise user will receive immediate grading',
    },
    {
      icon: Target,
      title: 'To Improve',
      description: 'A list of poorly pronounced words will be recorded for improvement purpose',
    },
    {
      icon: BarChart3,
      title: 'Stay Motivated',
      description: 'Gamified experience to encourage students to participate.',
    },
    {
      icon: Users,
      title: 'Progress Tracking',
      description: 'Teachers will be able to view progress of all students.',
    },
  ]

  const appFeatures = [
    {
      icon: BookOpen,
      title: 'Gamified Experience',
      description: 'Learning should be fun. Our team of experts blends education with game design to make it engaging.',
    },
    {
      icon: MessageCircle,
      title: 'Role-play Immersive Speaking Experience',
      description: 'Experience real-life scenarios that help you build the speaking skills you\'ll actually use.',
    },
    {
      icon: Smartphone,
      title: 'Be Confident at Speaking',
      description: 'Gain confidence by having successful conversations with our AI — a key step to speaking any new language fluently.',
    },
  ]

  const scenarios = [
    { title: 'At home', emoji: '🏠' },
    { title: 'At the park', emoji: '🌳' },
    { title: 'At the Big Ben in London', emoji: '🏛️' },
    { title: 'At the Science Museum', emoji: '🔬' },
    { title: 'At Christmas dinner', emoji: '🎄' },
  ]

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Main Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Awesome Apps Features</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learning with Lango is fun and interactive. Check out what makes our app awesome:
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300"
            >
              <feature.icon className="feature-icon" />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* How App Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">How does this App Work?</h2>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-20">
            <motion.div className="col-span-full flex justify-center items-center p-8">
                <Image className="text-center" src="/how-does-this-app-work.png" width={305} height={655} alt={'App Features'} />
            </motion.div>
          {appFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl"
            >
              <feature.icon className="w-16 h-16 mx-auto mb-6 p-4 bg-white rounded-full text-purple-600 shadow-lg" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
          <div className="p-6" id="downloadApp"></div>
        </div>
        {/* App Store Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
        >
            <a href="https://apps.apple.com/hk/app/lango-school/id1597890437"
                target="_blank"
                rel="noopener noreferrer">
            <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg">
                <FontAwesomeIcon icon={faAppStore} />
                Available on App Store
            </Button>
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.lango.schoolapp"
                target="_blank"
                rel="noopener noreferrer">
            <Button 
                size="lg" 
                variant="outline" 
                className="border-purple-300 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg">
                <FontAwesomeIcon icon={faGooglePlay} />
                Available on Google Play
            </Button>
            </a>
        </motion.div>

        {/* AI Robot Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-12 rounded-3xl"
        >
          <h2 className="text-4xl font-bold mb-6">Speak to Our AI Robot</h2>
          <p className="text-xl mb-4 max-w-2xl mx-auto">
            The best way to learn a language is to actually speak it.
          </p>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Chat with our AI robot for free! With every session, you will feel more confident, positive and uplifted. 
            And soon you will be able to speak fluent English without hesitation.
          </p>
        </motion.div>

        {/* Learning Scenarios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Learning English doesn`&apos;`t have to be boring</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            We provide fun, gamified speaking activities that encourage your English communication skills
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {scenarios.map((scenario, index) => (
              <motion.div
                key={scenario.title}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              >
                <div className="text-4xl mb-4">{scenario.emoji}</div>
                <p className="text-sm font-medium text-gray-800">{scenario.title}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

