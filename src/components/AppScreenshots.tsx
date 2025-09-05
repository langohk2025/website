'use client'

import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AppScreenshots() {
  const { t } = useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const screenshots = [
    { id: 1, alt: 'Lango App Screenshot 1' },
    { id: 2, alt: 'Lango App Screenshot 2' },
    { id: 3, alt: 'Lango App Screenshot 3' },
    { id: 4, alt: 'Lango App Screenshot 4' },
    { id: 5, alt: 'Lango App Screenshot 5' },
    { id: 6, alt: 'Lango App Screenshot 1' },
    { id: 7, alt: 'Lango App Screenshot 2' },
    { id: 8, alt: 'Lango App Screenshot 3' },
    { id: 9, alt: 'Lango App Screenshot 4' },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % screenshots.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + screenshots.length) % screenshots.length)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Tutorial Section */}
        <motion.div
          id="tutorial"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-8">{t('tutorial.title')}</h2>
          
          <div className="relative w-full max-w-4xl mx-auto">
            <div
        style={{
          position: "relative",
          paddingBottom: "56.25%", // 16:9 aspect ratio
          height: 0,
          overflow: "hidden",
        }}
      >
        <iframe
          src="https://www.youtube.com/embed/figepYwEvN0"
          title="Lango School Tutorial"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
          </div>
        </motion.div>

        {/* App Screenshots Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-8">{t('screenshots.title')}</h2>
          <p className="text-xl text-gray-600 mb-12">{t('screenshots.subtitle')}</p>

          {/* Screenshot Carousel */}
          <div className="relative max-w-6xl mx-auto">
            <div className="flex items-center justify-center">
              {/* Previous Button */}
              <button
                onClick={prevSlide}
                className="absolute left-0 z-10 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 mr-4"
                aria-label="Previous screenshot"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>

              {/* Screenshot Display */}
              <div className="flex space-x-4 overflow-hidden px-16">
                {screenshots.map((screenshot, index) => (
                  <motion.div
                    key={screenshot.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: index === currentSlide ? 1 : 0.6,
                      scale: index === currentSlide ? 1 : 0.8,
                    }}
                    transition={{ duration: 0.5 }}
                    className={`flex-shrink-0 w-64 h-96 bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl p-6 shadow-lg ${
                      index === currentSlide ? 'ring-4 ring-purple-300' : ''
                    }`}
                  >
                    <div className="w-full h-full bg-white rounded-2xl shadow-inner p-4 flex flex-col items-center justify-center">
                      <div className="flex items-center justify-center">
                        <Image src={`/app-screenshot-${index+1}.png`} alt="App features screenshots"
                            width={300} height={600} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={nextSlide}
                className="absolute right-0 z-10 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 ml-4"
                aria-label="Next screenshot"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {screenshots.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === currentSlide ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* LangoVerse Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-12 rounded-3xl max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">{t('langoverse.title')}</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {t('langoverse.subtitle')}
            </p>
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              {t('langoverse.cta')}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

