'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { PageContainer } from '@/components/ui/section'
import { Label2, P3 } from '@/components/ui/typography'

const socialLinks = [
  { href: 'https://www.instagram.com/lango_learning/', label: 'Instagram', icon: Instagram },
  { href: 'https://www.facebook.com/LangoEnglish/', label: 'Facebook', icon: Facebook },
  { href: 'https://www.youtube.com/@langohk', label: 'YouTube', icon: Youtube },
  { href: 'https://hk.linkedin.com/company/lango-language', label: 'LinkedIn', icon: Linkedin },
]

const quickLinks = [
  { href: '/#about', labelKey: 'nav.about' },
  { href: '/product', labelKey: 'nav.product_short' },
  { href: '/exam/spm', labelKey: 'nav.spm_exam' },
  { href: '/storyworld', labelKey: 'nav.storyworld' },
  { href: '/news', labelKey: 'nav.news' },
  { href: '/#contact', labelKey: 'nav.contact_us' },
]

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-[#3c073b] pt-12 pb-8 lg:pt-20 lg:pb-10">
      <PageContainer>
        <div className="flex flex-col gap-10 lg:gap-12">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-[188px]">
            <div className="flex-1">
              <Link href="/" className="mb-5 inline-block">
                <Image
                  src="/Lango_Logo.svg"
                  alt="Lango"
                  width={131}
                  height={51}
                />
              </Link>
              <P3 className="mb-5 max-w-md text-font-100">{t('home.hero.subtitle')}</P3>
              <div className="flex gap-4">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-10 items-center justify-center rounded-[13px] bg-bg-500 text-font-500 transition-opacity hover:opacity-80"
                  >
                    <Icon className="size-5" strokeWidth={2} aria-hidden />
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-8 sm:flex-row sm:gap-[26px]">
              <div className="flex-1">
                <Label2 className="mb-5 block text-bg-100">{t('home.footer.quick_link')}</Label2>
                <ul className="flex flex-col gap-3">
                  {quickLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="font-inter text-base text-font-100 transition-colors hover:text-white"
                      >
                        {t(link.labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex-1">
                <Label2 className="mb-5 block text-bg-100">{t('footer.contact')}</Label2>
                <ul className="flex flex-col gap-3 font-inter text-base text-font-100">
                  <li>
                    <p>{t('footer.whatsapp')}</p>
                    <a href="https://wa.me/85293541948" className="hover:text-white">
                      +852 9354 1948
                    </a>
                  </li>
                  <li>
                    <p>{t('footer.email')}</p>
                    <a href="mailto:info@lango.ai" className="hover:text-white">
                      info@lango.ai
                    </a>
                  </li>
                  <li>
                    <p>{t('footer.address')}</p>
                    <p>{t('footer.address_full')}</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <P3 className="text-center text-font-100 lg:text-left">{t('home.footer.copyright')}</P3>
          </div>
        </div>
      </PageContainer>
    </footer>
  )
}
