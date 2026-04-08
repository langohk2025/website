'use client'

import { useEffect } from 'react'

export default function ChatalogWidget() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://widget.chatalog.ai/chatalog-sdk.min.js'
    script.setAttribute('app-id', 'UXNWA50JtarExLdatLNE')
    script.setAttribute('position', 'bottom-right')
    script.setAttribute('lang', 'en')
    script.defer = true
    
    document.body.appendChild(script)
    
    return () => {
      document.body.removeChild(script)
    }
  }, [])
  
  return null
}
