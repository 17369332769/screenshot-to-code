import { LuClock, LuCode, LuSettings, LuPlus } from "react-icons/lu";
import LanguageToggle from "../core/LanguageToggle";
import { useI18n } from "../../i18n";

interface IconStripProps {
  isHistoryOpen: boolean;
  isEditorOpen: boolean;
  isSettingsOpen: boolean;
  showHistory: boolean;
  showEditor: boolean;
  onToggleHistory: () => void;
  onToggleEditor: () => void;
  onLogoClick: () => void;
  onNewProject: () => void;
  onOpenSettings: () => void;
}

function IconStrip({
  isHistoryOpen,
  isEditorOpen,
  isSettingsOpen,
  showHistory,
  showEditor,
  onToggleHistory,
  onToggleEditor,
  onLogoClick,
  onNewProject,
  onOpenSettings,
}: IconStripProps) {
  const { t } = useI18n();

  return (
    <div className="flex w-full items-center justify-between border-b border-stone-200/80 bg-white/80 px-2 py-2 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/88 lg:h-full lg:w-[4.5rem] lg:flex-col lg:items-center lg:gap-y-3 lg:border-b-0 lg:border-r lg:px-0 lg:py-4">
      {/* Logo */}
      <button
        onClick={onLogoClick}
        className="rounded-2xl p-2 transition-colors hover:bg-stone-200/70 dark:hover:bg-zinc-800 lg:mb-2 lg:p-1.5"
      >
        <img
          src="/favicon/main.png"
          alt="Logo"
          className="w-5 h-5 dark:invert"
        />
      </button>

      <div className="flex items-center gap-1 lg:flex-col lg:gap-0 lg:contents">
        {/* Editor */}
        {showEditor && (
          <button
            onClick={onToggleEditor}
            className={`flex items-center justify-center rounded-2xl p-2 transition-colors lg:flex-col lg:gap-1 lg:px-2 lg:py-2 ${
              isEditorOpen
                ? "bg-stone-900 text-white dark:bg-white dark:text-stone-950"
                : "text-gray-400 hover:bg-stone-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-zinc-800 dark:hover:text-gray-300"
            }`}
            title={t("editor")}
          >
            <LuCode className="w-[18px] h-[18px]" />
            <span className="hidden text-[10px] leading-none lg:block">{t("editor")}</span>
          </button>
        )}

        {/* Versions */}
        {showHistory && (
          <button
            onClick={onToggleHistory}
            className={`flex items-center justify-center rounded-2xl p-2 transition-colors lg:flex-col lg:gap-1 lg:px-2 lg:py-2 ${
              isHistoryOpen
                ? "bg-stone-900 text-white dark:bg-white dark:text-stone-950"
                : "text-gray-400 hover:bg-stone-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-zinc-800 dark:hover:text-gray-300"
            }`}
            title={t("versions")}
          >
            <LuClock className="w-[18px] h-[18px]" />
            <span className="hidden text-[10px] leading-none lg:block">{t("versions")}</span>
          </button>
        )}

        <button
          onClick={onNewProject}
          className="flex items-center justify-center rounded-2xl bg-amber-100 p-2 text-amber-800 transition-colors hover:bg-amber-200 lg:flex-col lg:gap-1 lg:px-2 lg:py-2 dark:bg-amber-500/15 dark:text-amber-200 dark:hover:bg-amber-500/25"
          title={t("startNewProject")}
        >
          <LuPlus className="w-[18px] h-[18px]" />
          <span className="hidden text-[10px] leading-none lg:block font-medium">{t("newProject")}</span>
        </button>
      </div>

      {/* Spacer pushes settings to bottom */}
      <div className="hidden flex-1 lg:block" />

      <div className="hidden lg:block">
        <LanguageToggle compact />
      </div>

      {/* Settings */}
      <button
        onClick={onOpenSettings}
        className={`flex items-center justify-center rounded-2xl p-2 transition-colors lg:flex-col lg:gap-1 lg:px-2 lg:py-2 ${
          isSettingsOpen
            ? "bg-stone-900 text-white dark:bg-white dark:text-stone-950"
            : "text-gray-400 hover:bg-stone-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-zinc-800 dark:hover:text-gray-300"
        }`}
        title={t("settings")}
      >
        <LuSettings className="w-[18px] h-[18px]" />
        <span className="hidden text-[10px] leading-none lg:block">{t("settings")}</span>
      </button>
    </div>
  );
}

export default IconStrip;
