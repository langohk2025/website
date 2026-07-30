'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { languages, LanguageCode } from '@/lib/languages'
import { cn } from '@/lib/utils'

type LanguageSelectorProps = {
  variant?: 'default' | 'compact' | 'nav' | 'menu'
}

export default function LanguageSelector({ variant = 'default' }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { currentLanguage, setLanguage, t } = useLanguage()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLanguageSelect = (languageCode: LanguageCode) => {
    setLanguage(languageCode)
    setIsOpen(false)
  }

  const currentLang = languages[currentLanguage]
  const showLabel = variant === 'default' || variant === 'menu' || variant === 'nav'
  const showGlobe = variant !== 'nav'

  return (
    <div className={cn('relative', variant === 'menu' && 'w-full')} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'btn-ghost inline-flex shrink-0 items-center whitespace-nowrap rounded-full font-inter text-sm text-font-500',
          variant === 'nav' && 'gap-1.5 px-3 py-2',
          variant === 'compact' && 'gap-1.5 px-2.5 py-2',
          variant === 'menu' && 'w-full justify-between gap-2 px-3 py-2.5',
          variant === 'default' && 'gap-1.5 px-3 py-2 sm:gap-2'
        )}
        aria-label={t('language.select')}
        aria-expanded={isOpen}
      >
        <span className="inline-flex items-center gap-1.5">
          {showGlobe && <Globe className="h-4 w-4 shrink-0" />}
          <span className="shrink-0">{currentLang.flag}</span>
          {showLabel && (
            <span className="font-medium">{currentLang.nativeName}</span>
          )}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            'glass absolute z-[60] mt-2 w-64 overflow-hidden rounded-2xl border border-[rgba(199,126,185,0.22)] py-2 shadow-[0px_8px_32px_rgba(104,50,102,0.12)]',
            variant === 'menu' ? 'left-0 right-0 w-auto' : 'right-0'
          )}
        >
          <div className="border-b border-font-200/60 px-4 py-2 font-inter text-xs font-semibold uppercase tracking-wide text-font-400">
            {t('language.select')}
          </div>
          {Object.entries(languages).map(([code, lang]) => (
            <button
              key={code}
              type="button"
              onClick={() => handleLanguageSelect(code as LanguageCode)}
              className={cn(
                'flex w-full items-center gap-3 px-4 py-2.5 text-left font-inter transition-colors duration-200',
                currentLanguage === code
                  ? 'bg-brand-300/30 text-brand-500'
                  : 'text-font-500 hover:bg-bg-400'
              )}
            >
              <span className="text-lg">{lang.flag}</span>
              <div className="flex-1">
                <div className="text-sm font-medium">{lang.nativeName}</div>
                <div className="text-xs text-font-400">{lang.name}</div>
              </div>
              {currentLanguage === code && (
                <div className="h-2 w-2 shrink-0 rounded-full bg-brand-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
