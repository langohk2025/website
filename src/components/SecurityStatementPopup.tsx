'use client'

import { useEffect, useState } from 'react'
import { ShieldAlert, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const STORAGE_KEY = 'lango-security-statement-2026-06-29-dismissed'

const statementSections = [
  ['statement.section1.title', 'statement.section1.body'],
  ['statement.section2.title', 'statement.section2.body'],
  ['statement.section3.title', 'statement.section3.body'],
  ['statement.section4.title', 'statement.section4.body'],
]

export default function SecurityStatementPopup() {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) !== 'true') {
      setIsVisible(true)
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isVisible])

  const closePopup = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 px-4 py-6 backdrop-blur-sm">
      <section
        aria-labelledby="security-statement-title"
        aria-modal="true"
        role="dialog"
        className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl"
      >
        <button
          type="button"
          aria-label={t('statement.close')}
          onClick={closePopup}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5 pr-16 sm:px-8">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-700">
            <ShieldAlert className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-700">
            {t('statement.badge')}
          </p>
          <h2
            id="security-statement-title"
            className="mt-2 text-2xl font-bold leading-tight text-slate-950 sm:text-3xl"
          >
            {t('statement.title')}
          </h2>
        </div>

        <div className="space-y-5 overflow-y-auto px-6 py-6 text-sm leading-7 text-slate-700 sm:px-8 sm:text-base">
          <p>{t('statement.greeting')}</p>
          <p>{t('statement.intro')}</p>

          {statementSections.map(([titleKey, bodyKey]) => (
            <section key={titleKey} className="space-y-2">
              <h3 className="text-base font-bold text-slate-950">{t(titleKey)}</h3>
              <p>{t(bodyKey)}</p>
            </section>
          ))}

          <p>{t('statement.contact')}</p>
          <div className="space-y-1 pt-1 text-slate-900">
            <p>{t('statement.signoff')}</p>
            <p className="font-semibold">{t('statement.company')}</p>
            <p>{t('statement.date')}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-sm text-slate-500">{t('statement.footer')}</p>
          <button
            type="button"
            onClick={closePopup}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            {t('statement.acknowledge')}
          </button>
        </div>
      </section>
    </div>
  )
}
