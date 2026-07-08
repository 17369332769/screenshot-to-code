/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getStoredLanguage,
  Language,
  LANGUAGE_STORAGE_KEY,
  translate,
  TranslationKey,
} from "./i18n-utils";

interface I18nContextValue {
  language: Language;
  setLanguage: Dispatch<SetStateAction<Language>>;
  t: (
    key: TranslationKey,
    variables?: Record<string, number | string>
  ) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => getStoredLanguage());

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, JSON.stringify(language));
  }, [language]);

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key, variables) => translate(language, key, variables),
    }),
    [language, setLanguage]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export { getStoredLanguage } from "./i18n-utils";
export type { Language, TranslationKey } from "./i18n-utils";
export { translate, translateCurrent } from "./i18n-utils";
