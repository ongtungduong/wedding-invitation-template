import { createContext, useContext } from 'react';
import type { Language, LocalizedText } from '../config/schema';
import type { UiDictionary } from './translations';

export interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: UiDictionary;
  pickText: (value: LocalizedText) => string;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
