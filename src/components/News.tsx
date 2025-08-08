'use client'

import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function News() {
  const newsItems = [
    {
      id: 1,
      title: 'ABGPS Cup 2025 - Hong Kong Kindergarten Online English Conversation Competition Concludes Successfully',
      excerpt: 'The ABGPS Cup 2025 Hong Kong Kindergarten Online English Conversation Competition has successfully concluded! The competition offered young learners...',
      date: 'December 7, 2024',
      author: 'nexsoftech',
      category: 'Competition',
      imgsrc:'/news-1.jpg'
    },
    {
      id: 2,
      title: 'Lango Presents at Ricoh: Exploring Global Opportunities',
      excerpt: 'We are excited to share that Lango was recently invited to present at Ricoh, a global leader known for its innovative solutions...',
      date: 'May 15, 2025',
      author: 'nexsoftech',
      category: 'Partnership',
      imgsrc:'/news-2.jpg'
    },
    {
      id: 3,
      title: 'Lango Takes a Bold Step in the Middle East',
      excerpt: 'The Dubai Assembly for AI 2025 was an incredible experience that opened new doors for "Langoverse". During the event, multiple countries...',
      date: 'April 25, 2025',
      author: 'nexsoftech',
      category: 'Expansion',
      imgsrc:'/news-3.jpg'
    },
    {
      id: 4,
      title: 'Lango School: Bringing Native-Like English Learning to ABGPS',
      excerpt: 'Aldrich Bay Government Primary School (ABGPS) is taking English learning to the next level with Lango School! Featured in Sing Tao Headline...',
      date: 'April 3, 2025',
      author: 'nexsoftech',
      category: 'Education',
      imgsrc:'/news-4.jpg'
    },
    {
      id: 5,
      title: 'LTE HK Dec 2024',
      excerpt: 'The LTE HK in December 2024 is poised to be a premier event focusing on the latest advancements in telecommunications and mobile technology...',
      date: 'December 20, 2024',
      author: 'nexsoftech',
      category: 'Event',
      imgsrc:'/news-5.jpg'
    },
    {
      id: 6,
      title: 'Dubai Expo Apr 2025',
      excerpt: 'Lango Takes a Bold Step in the Middle East The Dubai Assembly for AI 2025 was an incredible experience that opened new doors for our platform...',
      date: 'April 15, 2025',
      author: 'nexsoftech',
      category: 'Exhibition',
      imgsrc:'/news-6.jpg'
    },
  ]

  return (
    <section id="news" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Latest News</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Check out our latest news or media coverage
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
            >
              {/* News Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-purple-400 to-blue-500 relative overflow-hidden"
                style={{
                    backgroundImage: `url('${item.imgsrc}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                    {item.category}
                  </span>
                  {/* <div className="relative w-full h-96">
                  <Image src={item.imgsrc} width={1000} height={500}/>
                  </div> */}
                </div>
              </div>

              {/* News Content */}
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{item.date}</span>
                  <span className="mx-2">•</span>
                  <User className="w-4 h-4 mr-2" />
                  <span>{item.author}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors duration-300 line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {item.excerpt}
                </p>

                <Button 
                  variant="ghost" 
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-0 h-auto group/btn"
                >
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Load More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button 
            size="lg"
            variant="outline"
            className="border-purple-300 text-purple-600 hover:bg-purple-50 px-8 py-4"
          >
            Load More News
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

