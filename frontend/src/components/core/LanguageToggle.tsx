import { useI18n } from "../../i18n";

interface LanguageToggleProps {
  compact?: boolean;
}

function LanguageToggle({ compact = false }: LanguageToggleProps) {
  const { language, setLanguage, t } = useI18n();

  return (
    <div
      className={`inline-flex items-center rounded-full border border-stone-300 bg-white/90 p-1 dark:border-zinc-700 dark:bg-zinc-900/90 ${
        compact ? "gap-0.5" : "gap-1"
      }`}
      aria-label={t("language")}
      title={t("language")}
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
          language === "en"
            ? "bg-stone-950 text-white dark:bg-white dark:text-stone-950"
            : "text-stone-600 hover:text-stone-900 dark:text-zinc-300 dark:hover:text-white"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("zh")}
        className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
          language === "zh"
            ? "bg-stone-950 text-white dark:bg-white dark:text-stone-950"
            : "text-stone-600 hover:text-stone-900 dark:text-zinc-300 dark:hover:text-white"
        }`}
      >
        中文
      </button>
    </div>
  );
}

export default LanguageToggle;
