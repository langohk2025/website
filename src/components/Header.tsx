'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import LanguageSelector from '@/components/LanguageSelector'
import { useLanguage } from '@/contexts/LanguageContext'
import { PageContainer } from '@/components/ui/section'
import { PressableButton, PressableLink } from '@/components/ui/motion'
import { Label2 } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/#about', labelKey: 'nav.about' },
  { href: '/product', labelKey: 'nav.product' },
  { href: '/exam/spm', labelKey: 'nav.spm_exam' },
  { href: '/storyworld', labelKey: 'nav.storyworld' },
  { href: '/news', labelKey: 'nav.news' },
  { href: '/#contact', labelKey: 'nav.contact' },
]

export default function Header() {
  const { t } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-font-100 pt-4 transition-[box-shadow,background] duration-300 lg:bg-bg-500/80 lg:pt-10',
        scrolled ? 'glass-nav shadow-[0_1px_0_rgba(199,126,185,0.12)]' : ''
      )}
    >
      <PageContainer>
        <div className="flex items-center justify-between gap-4 2xl:grid 2xl:grid-cols-[minmax(max-content,1fr)_auto_minmax(max-content,1fr)] 2xl:items-center 2xl:gap-6">
          <Link href="/" className="pressable flex shrink-0 items-center justify-self-start rounded-xl">
            <Image src="/Lango_Logo.svg" alt="Lango" width={131} height={51} priority />
          </Link>

          <nav className="hidden justify-self-center 2xl:flex">
            <div className="glass flex items-center rounded-full border-[3px] border-[rgba(199,126,185,0.22)] px-5 py-3 shadow-[0px_4px_24px_rgba(104,50,102,0.08)]">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="btn-ghost shrink-0 whitespace-nowrap px-4 py-2 font-inter text-sm text-font-400"
                >
                  {t(link.labelKey)}
                </Link>
              ))}
              <div className="ml-1 shrink-0 border-l border-font-200/60 pl-1">
                <LanguageSelector variant="nav" />
              </div>
            </div>
          </nav>

          <div className="flex min-w-0 shrink-0 items-center justify-end gap-2 sm:gap-3">
            <PressableLink
              href="/#contact"
              variant="primary"
              className="hidden shrink-0 whitespace-nowrap px-6 py-3 lg:inline-flex xl:px-8 2xl:px-[38px]"
            >
              <Label2 className="whitespace-nowrap text-base text-bg-100">{t('nav.book_demo')}</Label2>
            </PressableLink>

            <PressableButton
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="shrink-0 rounded-xl p-2 text-font-500 2xl:hidden"
              aria-label={t('nav.toggle_menu')}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </PressableButton>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden bg-font-100 2xl:hidden"
            >
              <div className="flex flex-col gap-4 border-t border-font-200/60 py-4">
                <div className="px-3 py-2 2xl:hidden">
                  <LanguageSelector variant="menu" />
                </div>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="pressable rounded-xl px-3 py-2.5 font-inter text-base text-font-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t(link.labelKey)}
                  </Link>
                ))}
                <PressableLink
                  href="/#contact"
                  variant="primary"
                  className="mt-3 px-8 py-3 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Label2 className="text-bg-100">{t('nav.book_demo')}</Label2>
                </PressableLink>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </PageContainer>
    </header>
  )
}
