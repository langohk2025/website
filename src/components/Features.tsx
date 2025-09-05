'use client'

import { motion } from 'framer-motion'
import { Bot, MessageCircle, Trophy, BarChart3, Target, Users, Smartphone, BookOpen } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAppStore, faGooglePlay } from '@fortawesome/free-brands-svg-icons';
import { useLanguage } from '@/contexts/LanguageContext';


export default function Features() {
  const { t } = useLanguage()
  
  const features = [
    {
      icon: Bot,
      title: t('features.speak_robot'),
      description: t('features.speak_robot_desc'),
    },
    {
      icon: MessageCircle,
      title: t('features.roleplay'),
      description: t('features.roleplay_desc'),
    },
    {
      icon: Trophy,
      title: t('features.grading'),
      description: t('features.grading_desc'),
    },
    {
      icon: Target,
      title: t('features.improve'),
      description: t('features.improve_desc'),
    },
    {
      icon: BarChart3,
      title: t('features.motivated'),
      description: t('features.motivated_desc'),
    },
    {
      icon: Users,
      title: t('features.progress'),
      description: t('features.progress_desc'),
    },
  ]

  const appFeatures = [
    {
      icon: BookOpen,
      title: t('features.gamified_exp'),
      description: t('features.gamified_exp_desc'),
    },
    {
      icon: MessageCircle,
      title: t('features.roleplay_immersive'),
      description: t('features.roleplay_immersive_desc'),
    },
    {
      icon: Smartphone,
      title: t('features.confident'),
      description: t('features.confident_desc'),
    },
  ]

  const scenarios = [
    { title: t('features.at_home'), emoji: '🏠' },
    { title: t('features.at_park'), emoji: '🌳' },
    { title: t('features.at_bigben'), emoji: '🏛️' },
    { title: t('features.at_museum'), emoji: '🔬' },
    { title: t('features.at_christmas'), emoji: '🎄' },
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
          <h2 className="text-4xl font-bold text-gray-800 mb-4">{t('features.awesome_title')}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('features.awesome_subtitle')}
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
          <h2 className="text-4xl font-bold text-gray-800 mb-4">{t('features.how_works')}</h2>
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
                {t('features.app_store')}
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
                {t('features.google_play')}
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
          <h2 className="text-4xl font-bold mb-6">{t('features.speak_ai')}</h2>
          <p className="text-xl mb-4 max-w-2xl mx-auto">
            {t('features.speak_ai_subtitle')}
          </p>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            {t('features.speak_ai_desc')}
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
          <h2 className="text-4xl font-bold text-gray-800 mb-6">{t('features.learning_fun')}</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            {t('features.learning_fun_desc')}
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

