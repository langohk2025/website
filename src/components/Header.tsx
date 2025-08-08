'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from "next/image"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-32 h-16 rounded-lg flex items-center justify-center">
                <Image src="/Lango_Logo.svg" alt="Lango"
                    width={200}
                    height={200}
                    priority/>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#home" className="text-gray-700 hover:text-purple-600 transition-colors">
              Home
            </Link>
            <Link href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-700 hover:text-purple-600 transition-colors">
              Pricing
            </Link>
            <Link href="#news" className="text-gray-700 hover:text-purple-600 transition-colors">
              News
            </Link>
            <Link href="#contact" className="text-gray-700 hover:text-purple-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="https://linktr.ee/lango_ai"
                target="_blank"
                rel="noopener noreferrer">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                <Download className="w-4 h-4 mr-2" />
                Download App
                </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              <Link href="#home" className="text-gray-700 hover:text-purple-600 transition-colors">
                Home
              </Link>
              <Link href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-700 hover:text-purple-600 transition-colors">
                Pricing
              </Link>
              <Link href="#news" className="text-gray-700 hover:text-purple-600 transition-colors">
                News
              </Link>
              <Link href="#contact" className="text-gray-700 hover:text-purple-600 transition-colors">
                Contact
              </Link>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white w-full">
                <Download className="w-4 h-4 mr-2" />
                Download App
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
