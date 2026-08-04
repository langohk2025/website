'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { GlassCard } from '@/components/ui/GlassCard'
import { Label3, P3 } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

type FaqItem = {
  questionKey: string
  answerKey: string
}

type ExamFaqProps = {
  items: readonly FaqItem[]
}

export default function ExamFaq({ items }: ExamFaqProps) {
  const { t } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="flex w-full flex-col gap-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        const question = t(item.questionKey)

        return (
          <GlassCard key={item.questionKey} hover={false} className="overflow-hidden p-0">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left lg:px-8"
              aria-expanded={isOpen}
            >
              <Label3 as="span" className="text-font-600">
                {question}
              </Label3>
              <ChevronDown
                className={cn(
                  'size-5 shrink-0 text-brand-500 transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
              />
            </button>
            {/* Keep all answers in the DOM so crawlers / GEO can read every FAQ. */}
            <motion.div
              initial={false}
              animate={{
                height: isOpen ? 'auto' : 0,
                opacity: isOpen ? 1 : 0,
              }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden"
              aria-hidden={!isOpen}
            >
              <div className="border-t border-font-200/40 px-6 pb-5 pt-4 lg:px-8">
                <P3 className="text-font-500">{t(item.answerKey)}</P3>
              </div>
            </motion.div>
          </GlassCard>
        )
      })}
    </div>
  )
}
