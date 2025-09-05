'use client'

import { motion } from 'framer-motion'
import { Check, Users, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Pricing() {
  const { t } = useLanguage()
  
  const personalFeatures = [
    t('pricing.sentence_exercises'),
    t('pricing.roleplay_exercises'),
    t('pricing.pronunciation'),
    t('pricing.translation'),
    t('pricing.voice_selection'),
    t('pricing.unlimited'),
  ]

  const schoolFeatures = [
    t('pricing.admin_portal'),
    t('pricing.open_accounts'),
    t('pricing.custom_background'),
    t('pricing.custom_exercises'),
  ]

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-6">{t('pricing.reasonable_title')}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('pricing.reasonable_desc')}
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="monthly" className="w-full">
            {/* Tab Headers */}
            <TabsList className="grid w-fit mx-auto grid-cols-2 mb-12">
              <TabsTrigger value="monthly" className="px-8 py-3">{t('pricing.monthly')}</TabsTrigger>
              <TabsTrigger value="yearly" className="px-8 py-3">{t('pricing.yearly')}</TabsTrigger>
            </TabsList>

            <TabsContent value="monthly">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Schools/Learning Center Plan */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="relative bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {t('pricing.sales')}
                  </div>
                  
                  <div className="flex items-center mb-6">
                    <Users className="w-8 h-8 text-purple-600 mr-3" />
                    <h3 className="text-2xl font-bold text-gray-800">{t('pricing.schools')}</h3>
                  </div>

                  <div className="mb-8">
                    <p className="text-lg text-gray-600 mb-2">{t('pricing.primary_english')}</p>
                    <div className="text-4xl font-bold text-gray-800 mb-4">{t('pricing.custom_quote')}</div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {schoolFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 text-lg">
                    {t('pricing.get_started')}
                  </Button>
                </motion.div>

                {/* Personal Plan */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-purple-200"
                >
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {t('pricing.popular')}
                  </div>
                  
                  <div className="flex items-center mb-6">
                    <User className="w-8 h-8 text-blue-600 mr-3" />
                    <h3 className="text-2xl font-bold text-gray-800">{t('pricing.personal')}</h3>
                  </div>

                  <div className="mb-8">
                    <p className="text-lg text-gray-600 mb-2">{t('pricing.primary_english')}</p>
                    <div className="flex items-baseline mb-4">
                      <span className="text-4xl font-bold text-gray-800">HKD149</span>
                      <span className="text-lg text-gray-600 ml-2">/month</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {personalFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg">
                    {t('pricing.get_started')}
                  </Button>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="yearly">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Schools/Learning Center Plan - Yearly */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="relative bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Sales
                  </div>
                  
                  <div className="flex items-center mb-6">
                    <Users className="w-8 h-8 text-purple-600 mr-3" />
                    <h3 className="text-2xl font-bold text-gray-800">Schools/Learning Center</h3>
                  </div>

                  <div className="mb-8">
                    <p className="text-lg text-gray-600 mb-2">Primary School English</p>
                    <div className="text-4xl font-bold text-gray-800 mb-4">Custom Quote</div>
                    <p className="text-sm text-green-600 font-medium">{t('pricing.save_annually')}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {schoolFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 text-lg">
                    {t('pricing.get_started')}
                  </Button>
                </motion.div>

                {/* Personal Plan - Yearly */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-purple-200"
                >
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {t('pricing.best_value')}
                  </div>
                  
                  <div className="flex items-center mb-6">
                    <User className="w-8 h-8 text-blue-600 mr-3" />
                    <h3 className="text-2xl font-bold text-gray-800">Personal</h3>
                  </div>

                  <div className="mb-8">
                    <p className="text-lg text-gray-600 mb-2">Primary School English</p>
                    <div className="flex items-baseline mb-2">
                      <span className="text-4xl font-bold text-gray-800">HKD1,899</span>
                      <span className="text-lg text-gray-600 ml-2">/year</span>
                    </div>
                    <p className="text-sm text-green-600 font-medium">{t('pricing.save_amount')}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {personalFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg">
                    {t('pricing.get_started')}
                  </Button>
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}

