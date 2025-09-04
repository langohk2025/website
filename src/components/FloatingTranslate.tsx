'use client'

import { useState } from 'react'
import { Globe, X } from 'lucide-react'
import GoogleTranslate from './GoogleTranslate'

export default function FloatingTranslate() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Open translator"
        >
          <Globe className="w-6 h-6" />
        </button>
      </div>

      {/* Floating Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50">
          <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-4 min-w-[250px] max-w-[300px]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">Translate Page</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close translator"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <GoogleTranslate />
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/10" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}