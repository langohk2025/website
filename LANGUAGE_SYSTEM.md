# Language Selection System

This document explains how to use the multi-language system implemented for the Lango website.

## Supported Languages

- **English** (en) - Default language
- **Traditional Chinese** (zh-TW) - 繁體中文
- **Simplified Chinese** (zh-CN) - 简体中文
- **Malay** (ms) - Bahasa Melayu
- **Indonesian** (id) - Bahasa Indonesia
- **Japanese** (ja) - 日本語
- **Myanmar** (my) - မြန်မာ

## How It Works

### 1. Language Context Provider
The `LanguageProvider` component wraps the entire application and provides:
- Current language state
- Language switching functionality
- Translation function (`t()`)
- Automatic persistence to localStorage

### 2. Language Selector Component
The `LanguageSelector` component provides:
- Dropdown menu with all available languages
- Flag icons and native language names
- Responsive design (shows flag only on mobile)
- Click-outside-to-close functionality

### 3. Translation Files
Translation files are located in `src/translations/` directory:
- `en.json` - English (default)
- `zh-TW.json` - Traditional Chinese
- `zh-CN.json` - Simplified Chinese
- `ms.json` - Malay
- `id.json` - Indonesian
- `ja.json` - Japanese
- `my.json` - Myanmar

## Usage in Components

### 1. Import the hook
```tsx
import { useLanguage } from '@/contexts/LanguageContext'
```

### 2. Use the translation function
```tsx
export default function MyComponent() {
  const { t } = useLanguage()
  
  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.subtitle')}</p>
    </div>
  )
}
```

### 3. Access current language
```tsx
export default function MyComponent() {
  const { currentLanguage, setLanguage } = useLanguage()
  
  return (
    <div>
      <p>Current language: {currentLanguage}</p>
      <button onClick={() => setLanguage('zh-TW')}>
        Switch to Traditional Chinese
      </button>
    </div>
  )
}
```

## Adding New Translations

### 1. Add to existing translation files
Add new translation keys to all language files:

```json
{
  "existing.key": "Existing translation",
  "new.key": "New translation"
}
```

### 2. Add new language support
1. Add language definition to `src/lib/languages.ts`
2. Create new translation file in `src/translations/`
3. The system will automatically detect and use the new language

## Features

- **Automatic Persistence**: Selected language is saved to localStorage
- **Fallback System**: Falls back to English if translation is missing
- **Dynamic Loading**: Translation files are loaded dynamically
- **Type Safety**: Full TypeScript support with proper typing
- **Responsive Design**: Language selector adapts to screen size
- **Accessibility**: Proper ARIA labels and keyboard navigation

## File Structure

```
src/
├── contexts/
│   └── LanguageContext.tsx     # Language context provider
├── components/
│   └── LanguageSelector.tsx    # Language dropdown component
├── lib/
│   └── languages.ts           # Language definitions
└── translations/
    ├── en.json               # English translations
    ├── zh-TW.json           # Traditional Chinese
    ├── zh-CN.json           # Simplified Chinese
    ├── ms.json              # Malay
    ├── id.json              # Indonesian
    ├── ja.json              # Japanese
    └── my.json              # Myanmar
```

## Integration Points

The language system is integrated into:
- **Layout**: `LanguageProvider` wraps the entire app
- **Header**: Language selector is displayed in the navigation
- **Components**: Hero component demonstrates translation usage

## Next Steps

To fully implement the language system across the website:

1. **Add translations to all components**: Update remaining components (Features, Pricing, News, Footer) to use the `t()` function
2. **Add more translation keys**: Expand translation files with all text content
3. **SEO optimization**: Consider implementing Next.js internationalization for better SEO
4. **RTL support**: Add right-to-left text support for languages that require it
5. **Date/number formatting**: Implement locale-specific formatting for dates and numbers

## Testing

To test the language system:
1. Start the development server: `npm run dev`
2. Click the language selector in the header
3. Select different languages to see translations change
4. Refresh the page to verify language persistence
5. Check browser localStorage for the saved preference