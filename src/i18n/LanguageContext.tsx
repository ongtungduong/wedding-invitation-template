import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  resolveLocalizedText,
  type Language,
  type LocalizedText,
} from '../config/schema';
import { TRANSLATIONS } from './translations';
import { LanguageContext, type LanguageContextValue } from './useLanguage';

interface LanguageProviderProps {
  defaultLang: Language;
  children: ReactNode;
}

export function LanguageProvider({ defaultLang, children }: LanguageProviderProps) {
  const [lang, setLang] = useState<Language>(defaultLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      toggleLang: () => setLang((prev) => (prev === 'vi' ? 'en' : 'vi')),
      t: TRANSLATIONS[lang],
      pickText: (text: LocalizedText) => resolveLocalizedText(text, lang),
    }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
