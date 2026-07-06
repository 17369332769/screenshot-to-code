import React, { Suspense, lazy, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Stack } from "../../lib/stacks";
import { DesignSystem, Settings } from "../../types";
import UploadTab from "./tabs/UploadTab";
import { DesignSystemSelectorProps } from "../settings/DesignSystemSelector";
import { useI18n } from "../../i18n";

const UrlTab = lazy(() => import("./tabs/UrlTab"));
const TextTab = lazy(() => import("./tabs/TextTab"));
const ImportTab = lazy(() => import("./tabs/ImportTab"));

interface Props {
  doCreate: (
    images: string[],
    inputMode: "image" | "video",
    textPrompt?: string
  ) => void;
  doCreateFromText: (text: string) => void;
  importFromCode: (code: string, stack: Stack) => void;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  designSystems: DesignSystem[];
  onAddNewDesignSystem: () => void;
  onManageDesignSystems: () => void;
}

type InputTab = "upload" | "url" | "text" | "import";

function InputTabFallback({ label }: { label: string }) {
  return (
    <div className="flex min-h-[280px] items-center justify-center rounded-xl border border-stone-200/80 bg-white/75 px-4 text-sm text-stone-500 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-400">
      {label}
    </div>
  );
}

function UnifiedInputPane({
  doCreate,
  doCreateFromText,
  importFromCode,
  settings,
  setSettings,
  designSystems,
  onAddNewDesignSystem,
  onManageDesignSystems,
}: Props) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<InputTab>("upload");

  function setStack(stack: Stack) {
    setSettings((prev: Settings) => ({
      ...prev,
      generatedCodeConfig: stack,
    }));
  }

  function setSelectedDesignSystemId(id: string | null) {
    setSettings((prev: Settings) => ({
      ...prev,
      selectedDesignSystemId: id,
    }));
  }

  const designSystemSelectorProps: DesignSystemSelectorProps = {
    designSystems,
    selectedDesignSystemId: settings.selectedDesignSystemId,
    setSelectedDesignSystemId,
    onAddNew: onAddNewDesignSystem,
    onManage: onManageDesignSystems,
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as InputTab)}
        className="w-full"
      >
        <TabsList className="mb-5 grid h-auto w-full grid-cols-2 gap-1.5 rounded-xl border border-stone-200/80 bg-stone-50/80 p-1.5 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 sm:grid-cols-4">
          <TabsTrigger
            value="upload"
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-lg text-sm font-medium text-stone-500 transition-colors data-[state=active]:bg-stone-950 data-[state=active]:text-white data-[state=active]:shadow-sm dark:text-zinc-400 dark:data-[state=active]:bg-white dark:data-[state=active]:text-stone-950"
            data-testid="tab-upload"
          >
            <UploadIcon />
            <span>{t("uploadTab")}</span>
          </TabsTrigger>
          <TabsTrigger
            value="url"
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-lg text-sm font-medium text-stone-500 transition-colors data-[state=active]:bg-stone-950 data-[state=active]:text-white data-[state=active]:shadow-sm dark:text-zinc-400 dark:data-[state=active]:bg-white dark:data-[state=active]:text-stone-950"
            data-testid="tab-url"
          >
            <UrlIcon />
            <span>{t("urlTab")}</span>
          </TabsTrigger>
          <TabsTrigger
            value="text"
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-lg text-sm font-medium text-stone-500 transition-colors data-[state=active]:bg-stone-950 data-[state=active]:text-white data-[state=active]:shadow-sm dark:text-zinc-400 dark:data-[state=active]:bg-white dark:data-[state=active]:text-stone-950"
            data-testid="tab-text"
          >
            <TextIcon />
            <span>{t("textTab")}</span>
          </TabsTrigger>
          <TabsTrigger
            value="import"
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-lg text-sm font-medium text-stone-500 transition-colors data-[state=active]:bg-stone-950 data-[state=active]:text-white data-[state=active]:shadow-sm dark:text-zinc-400 dark:data-[state=active]:bg-white dark:data-[state=active]:text-stone-950"
            data-testid="tab-import"
          >
            <ImportIcon />
            <span>{t("importTab")}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-0">
          <UploadTab
            doCreate={doCreate}
            stack={settings.generatedCodeConfig}
            setStack={setStack}
            designSystem={designSystemSelectorProps}
          />
        </TabsContent>

        <TabsContent value="url" className="mt-0">
          {activeTab === "url" && (
            <Suspense fallback={<InputTabFallback label="Loading URL tools..." />}>
              <UrlTab
                doCreate={doCreate}
                screenshotOneApiKey={settings.screenshotOneApiKey}
                stack={settings.generatedCodeConfig}
                setStack={setStack}
                designSystem={designSystemSelectorProps}
              />
            </Suspense>
          )}
        </TabsContent>

        <TabsContent value="text" className="mt-0">
          {activeTab === "text" && (
            <Suspense fallback={<InputTabFallback label="Loading text generator..." />}>
              <TextTab
                doCreateFromText={doCreateFromText}
                stack={settings.generatedCodeConfig}
                setStack={setStack}
                designSystem={designSystemSelectorProps}
              />
            </Suspense>
          )}
        </TabsContent>

        <TabsContent value="import" className="mt-0">
          {activeTab === "import" && (
            <Suspense fallback={<InputTabFallback label="Loading import tools..." />}>
              <ImportTab importFromCode={importFromCode} />
            </Suspense>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function UploadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function UrlIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function TextIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 6.1H3" />
      <path d="M21 12.1H3" />
      <path d="M15.1 18H3" />
    </svg>
  );
}

function ImportIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

export default UnifiedInputPane;
