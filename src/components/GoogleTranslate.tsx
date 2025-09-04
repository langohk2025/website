'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: {
          new (options: {
            pageLanguage: string
            includedLanguages: string
            layout: number
            autoDisplay: boolean
          }, elementId: string): void
          InlineLayout: {
            SIMPLE: number
          }
        }
      }
    }
    googleTranslateElementInit: () => void
  }
}

export default function GoogleTranslate() {
  useEffect(() => {
    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,zh-CN,zh-TW,ja,ko,es,fr,de,it,pt,ru,ar,hi,th,vi',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      )
    }

    // Load Google Translate script
    const script = document.createElement('script')
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src*="translate.google.com"]')
      if (existingScript) {
        document.body.removeChild(existingScript)
      }
    }
  }, [])

  return (
    <div className="google-translate-container">
      <div id="google_translate_element"></div>
      <style jsx global>{`
        .goog-te-banner-frame.skiptranslate {
          display: none !important;
        }
        
        body {
          top: 0px !important;
        }
        
        .goog-te-gadget {
          font-family: inherit !important;
        }
        
        .goog-te-gadget .goog-te-combo {
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          padding: 0.5rem;
          font-size: 0.875rem;
          color: #374151;
          outline: none;
          transition: border-color 0.15s ease-in-out;
        }
        
        .goog-te-gadget .goog-te-combo:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }
        
        .goog-te-gadget-simple {
          background-color: transparent !important;
          border: none !important;
          font-size: 0.875rem !important;
        }
        
        .goog-te-gadget-simple .goog-te-menu-value {
          color: #374151 !important;
        }
        
        .goog-te-gadget-simple .goog-te-menu-value:hover {
          text-decoration: none !important;
        }
        
        .goog-te-gadget-icon {
          display: none !important;
        }
        
        .goog-te-menu-frame {
          max-height: 300px !important;
          overflow-y: auto !important;
        }
      `}</style>
    </div>
  )
}