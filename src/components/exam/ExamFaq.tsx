'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { Label3, P3 } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

type FaqItem = {
  question: string
  answer: string
}

type ExamFaqProps = {
  items: readonly FaqItem[]
}

export default function ExamFaq({ items }: ExamFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="flex w-full flex-col gap-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index

        return (
          <GlassCard key={item.question} hover={false} className="overflow-hidden p-0">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left lg:px-8"
              aria-expanded={isOpen}
            >
              <Label3 as="span" className="text-font-600">
                {item.question}
              </Label3>
              <ChevronDown
                className={cn(
                  'size-5 shrink-0 text-brand-500 transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                >
                  <div className="border-t border-font-200/40 px-6 pb-5 pt-4 lg:px-8">
                    <P3 className="text-font-500">{item.answer}</P3>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        )
      })}
    </div>
  )
}
