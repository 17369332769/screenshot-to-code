/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { usePersistedState } from "./hooks/usePersistedState";
import {
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
  const [language, setLanguage] = usePersistedState<Language>(
    "en",
    LANGUAGE_STORAGE_KEY
  );

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
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
