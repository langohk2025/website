'use client'

import Link from 'next/link'
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'
import Image from "next/image"
import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ]

  return (
    <footer id="contact" className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
                <div className="w-32 h-16 rounded-lg flex items-center justify-center">
                                <Image src="/Lango_Logo.svg" alt="Lango"
                                    width={200}
                                    height={200}
                                    priority/>
                </div>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">{t('footer.quick_links')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#home" className="text-gray-300 hover:text-white transition-colors duration-300">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-gray-300 hover:text-white transition-colors duration-300">
                  {t('nav.features')}
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors duration-300">
                  {t('nav.pricing')}
                </Link>
              </li>
              <li>
                <Link href="#news" className="text-gray-300 hover:text-white transition-colors duration-300">
                  {t('nav.news')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">{t('nav.contact')}</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone className="w-5 h-5 text-purple-400 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">{t('footer.whatsapp')}</p>
                  <a href="https://wa.me/85293541948" className="text-white hover:text-purple-400 transition-colors duration-300">
                    +852 9354 1948
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <Mail className="w-5 h-5 text-purple-400 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">{t('footer.email')}</p>
                  <a href="mailto:info@lango.ai" className="text-white hover:text-purple-400 transition-colors duration-300">
                    info@lango.ai
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-purple-400 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">{t('footer.address')}</p>
                  <p className="text-white">
                    {t('footer.address_full')}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              {t('footer.copyright')}
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                {t('footer.privacy')}
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                {t('footer.terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

