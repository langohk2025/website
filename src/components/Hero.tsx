'use client'

import { motion } from 'framer-motion'
import { Play, Download, Users, Heart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function Hero() {
  const stats = [
    { label: 'Users', value: '30,000', icon: Users },
    { label: 'Downloads', value: '100,000+', icon: Download },
    { label: 'Likes', value: '100,000+', icon: Heart },
    { label: '5 Star Rating', value: '8089', icon: Star },
  ]

  return (
    <section id="home" className="pt-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Lango
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Looking for an efficient way to practice English speaking? You`&apos;`re in the right place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a href="#downloadApp">
                <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
                >
                    <Download className="w-5 h-5 mr-2" />
                    Download App
                </Button>
              </a>

              <a href="#tutorial">
                <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-purple-300 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg"
                >
                    <Play className="w-5 h-5 mr-2" />
                    About Lango
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="w-6 h-6 text-purple-600 mr-2" />
                    <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                  </div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <Image src="/hero1.png" width={986} height={776} alt="Welcome to Lango" />
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* <div className="relative w-full h-96 lg:h-[500px] float-animation">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 rounded-3xl transform rotate-3 opacity-20"></div>
              <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">🤖</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">AI Speaking Robot</h3>
                  <p className="text-gray-600">Practice with our intelligent AI companion</p>
                </div>
              </div>
            </div> */}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

