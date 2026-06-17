import React from "react";
import { AppTheme, EditorTheme, Settings } from "../../types";
import { capitalize } from "../../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../ui/select";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { IS_RUNNING_ON_CLOUD } from "../../config";
import { useI18n } from "../../i18n";

interface Props {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  appTheme: AppTheme;
  setAppTheme: React.Dispatch<React.SetStateAction<AppTheme>>;
}

function SettingsTab({ settings, setSettings, appTheme, setAppTheme }: Props) {
  const { t } = useI18n();

  const handleThemeChange = (theme: EditorTheme) => {
    setSettings((s) => ({
      ...s,
      editorTheme: theme,
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8 lg:py-8">
        <div className="mb-8">
          <p className="editorial-kicker">{t("settings")}</p>
          <h1 className="mt-2 font-['Space_Grotesk'] text-3xl font-semibold tracking-[-0.04em] text-gray-900 dark:text-white">
            Workspace controls, providers, and output defaults
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600 dark:text-zinc-300">
            Configure how the app looks, which model providers it can use, and
            how generated code should be shaped before it reaches the canvas.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-6">
            <div className="studio-panel p-6">
              <p className="editorial-kicker">Workspace</p>
              <h2 className="mt-2 font-['Space_Grotesk'] text-xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white">
                Personalize the control room
              </h2>
              <p className="mt-3 text-sm leading-7 text-stone-600 dark:text-zinc-300">
                Tune the interface for focus, choose a code editor theme, and
                decide which services power generation.
              </p>
            </div>

            <div className="studio-panel p-6">
              <p className="editorial-kicker">Current defaults</p>
              <div className="mt-4 space-y-3 text-sm text-stone-700 dark:text-zinc-300">
                <div className="studio-surface px-4 py-3">
                  App theme: <span className="font-medium">{capitalize(appTheme)}</span>
                </div>
                <div className="studio-surface px-4 py-3">
                  Editor theme: <span className="font-medium notranslate" translate="no">{capitalize(settings.editorTheme)}</span>
                </div>
                <div className="studio-surface px-4 py-3">
                  Image generation: <span className="font-medium">{settings.isImageGenerationEnabled ? "Enabled" : "Disabled"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
          {/* Theme */}
          <div className="studio-panel overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-4 dark:border-zinc-700">
              <h2 className="font-['Space_Grotesk'] text-lg font-semibold text-gray-900 dark:text-white">
                {t("theme")}
              </h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-zinc-700">
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <span className="text-sm text-gray-700 dark:text-zinc-300">
                    {t("appTheme")}
                  </span>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-zinc-400">
                    {t("appThemeDescription")}
                  </p>
                </div>
                <Select
                  name="app-theme"
                  value={appTheme}
                  onValueChange={(value) => setAppTheme(value as AppTheme)}
                >
                  <SelectTrigger className="w-[160px] rounded-full">
                    {capitalize(appTheme)}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AppTheme.SYSTEM}>{t("system")}</SelectItem>
                    <SelectItem value={AppTheme.LIGHT}>{t("light")}</SelectItem>
                    <SelectItem value={AppTheme.DARK}>{t("dark")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <span className="text-sm text-gray-700 dark:text-zinc-300">
                    {t("codeEditorTheme")}
                  </span>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-zinc-400">
                    {t("codeEditorThemeDescription")}
                  </p>
                </div>
                <Select
                  name="editor-theme"
                  value={settings.editorTheme}
                  onValueChange={(value) =>
                    handleThemeChange(value as EditorTheme)
                  }
                >
                  <SelectTrigger className="w-[160px] rounded-full">
                    <span className="notranslate" translate="no">
                      {capitalize(settings.editorTheme)}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cobalt">
                      <span className="notranslate" translate="no">Cobalt</span>
                    </SelectItem>
                    <SelectItem value="espresso">
                      <span className="notranslate" translate="no">Espresso</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* API Keys */}
          <div className="studio-panel overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-4 dark:border-zinc-700">
              <h2 className="font-['Space_Grotesk'] text-lg font-semibold text-gray-900 dark:text-white">
                {t("apiKeys")}
              </h2>
            </div>
            <div className="space-y-5 p-5">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                  {t("openAiApiKey")}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
                  {t("browserStorageDescription")}
                </p>
                <Input
                  id="openai-api-key"
                  className="mt-2 rounded-[1rem]"
                  placeholder={t("openAiApiKey")}
                  value={settings.openAiApiKey || ""}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      openAiApiKey: e.target.value,
                    }))
                  }
                />
              </div>

              {!IS_RUNNING_ON_CLOUD && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                    {t("openAiBaseUrlOptional")}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
                    {t("openAiBaseUrlDescription")}
                  </p>
                  <Input
                    id="openai-base-url"
                    className="mt-2 rounded-[1rem]"
                    placeholder={t("openAiBaseUrlOptional")}
                    value={settings.openAiBaseURL || ""}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        openAiBaseURL: e.target.value,
                      }))
                    }
                  />
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                  {t("anthropicApiKey")}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
                  {t("browserStorageDescription")}
                </p>
                <Input
                  id="anthropic-api-key"
                  className="mt-2 rounded-[1rem]"
                  placeholder={t("anthropicApiKey")}
                  value={settings.anthropicApiKey || ""}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      anthropicApiKey: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                  {t("geminiApiKey")}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
                  {t("browserStorageDescription")}
                </p>
                <Input
                  id="gemini-api-key"
                  className="mt-2 rounded-[1rem]"
                  placeholder={t("geminiApiKey")}
                  value={settings.geminiApiKey || ""}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      geminiApiKey: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Image Generation */}
          <div className="studio-panel overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-4 dark:border-zinc-700">
              <h2 className="font-['Space_Grotesk'] text-lg font-semibold text-gray-900 dark:text-white">
                {t("imageGeneration")}
              </h2>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-zinc-300">
                    {t("placeholderImages")}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
                    {t("placeholderImagesDescription")}
                  </p>
                </div>
                <Switch
                  id="image-generation"
                  checked={settings.isImageGenerationEnabled}
                  onCheckedChange={() =>
                    setSettings((s) => ({
                      ...s,
                      isImageGenerationEnabled: !s.isImageGenerationEnabled,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Screenshot by URL */}
          <div className="studio-panel overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-4 dark:border-zinc-700">
              <h2 className="font-['Space_Grotesk'] text-lg font-semibold text-gray-900 dark:text-white">
                {t("screenshotByUrl")}
              </h2>
            </div>
            <div className="p-5">
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                {t("screenshotByUrlDescription")}{" "}
                <a
                  href="https://screenshotone.com?via=screenshot-to-code"
                  className="text-cyan-700 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300"
                  target="_blank"
                >
                  {t("getFreeScreenshots")}
                </a>
              </p>
              <Input
                id="screenshot-one-api-key"
                className="mt-3 rounded-[1rem]"
                placeholder={t("screenshotOneApiKey")}
                value={settings.screenshotOneApiKey || ""}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    screenshotOneApiKey: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsTab;
