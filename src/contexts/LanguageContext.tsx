'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { LanguageCode, languages } from '@/lib/languages';
import en from '@/translations/en.json';
import zhTW from '@/translations/zh-TW.json';
import zhCN from '@/translations/zh-CN.json';
import ja from '@/translations/ja.json';
import ms from '@/translations/ms.json';
import id from '@/translations/id.json';
import my from '@/translations/my.json';

const translationMap: Record<LanguageCode, Record<string, string>> = {
  en,
  'zh-TW': zhTW,
  'zh-CN': zhCN,
  ja,
  ms,
  id,
  my,
};

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const translations = translationMap[currentLanguage] ?? translationMap.en;

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language') as LanguageCode;
    if (savedLanguage && languages[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const setLanguage = useCallback((language: LanguageCode) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferred-language', language);
    document.documentElement.lang = language;
  }, []);

  const t = useCallback((key: string): string => {
    return translations[key] || key;
  }, [translations]);

  const value = useMemo(
    () => ({ currentLanguage, setLanguage, t }),
    [currentLanguage, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}