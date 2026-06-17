import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  FaDesktop,
  FaMobile,
  FaCode,
} from "react-icons/fa";
import {
  LuChevronLeft,
  LuChevronRight,
  LuExternalLink,
  LuRefreshCw,
  LuDownload,
} from "react-icons/lu";
import { useMemo, useState } from "react";
import { AppState, Settings } from "../../types";
import CodeTab from "./CodeTab";
import { Button } from "../ui/button";
import { useAppStore } from "../../store/app-store";
import { useProjectStore } from "../../store/project-store";
import { extractHtml } from "./extractHtml";
import PreviewComponent from "./PreviewComponent";
import { downloadCode } from "./download";
import { SelectAndEditToolbarButton } from "../select-and-edit/SelectAndEditControls";
import { useI18n } from "../../i18n";

function openInNewTab(code: string) {
  const newWindow = window.open("", "_blank");
  if (newWindow) {
    newWindow.document.open();
    newWindow.document.write(code);
    newWindow.document.close();
  }
}

interface Props {
  settings: Settings;
  onOpenVersions: () => void;
}

function PreviewPane({ settings, onOpenVersions }: Props) {
  const { t } = useI18n();
  const { appState } = useAppStore();
  const { inputMode, head, commits, setHead } = useProjectStore();
  const [activeTab, setActiveTab] = useState("desktop");
  const [desktopScale, setDesktopScale] = useState(1);
  const [desktopViewMode, setDesktopViewMode] = useState<"fit" | "actual">("fit");

  // Sorted commit list for version navigation
  const sortedCommits = useMemo(() =>
    Object.values(commits).sort(
      (a, b) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
    ), [commits]);

  const currentVersionIndex = sortedCommits.findIndex(c => c.hash === head);
  const totalVersions = sortedCommits.length;
  const canGoPrev = currentVersionIndex > 0;
  const canGoNext = currentVersionIndex < totalVersions - 1;

  const currentCommit = head && commits[head] ? commits[head] : "";
  const currentCode = currentCommit
    ? currentCommit.variants[currentCommit.selectedVariantIndex].code
    : "";

  const isSelectedVariantComplete =
    head &&
    commits[head] &&
    commits[head].variants[commits[head].selectedVariantIndex].status ===
      "complete";

  const previewCode =
    inputMode === "video" && appState === AppState.CODING
      ? extractHtml(currentCode)
      : currentCode;

  const canSelectAndEdit =
    appState === AppState.CODE_READY || !!isSelectedVariantComplete;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col min-h-0"
      >
        <div className="relative flex items-center justify-between border-b border-stone-200/80 bg-white/80 px-4 py-2 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/88 shrink-0">
          <div className="flex items-center gap-2">
            <TabsList>
              <TabsTrigger value="desktop" title={t("desktop")} data-testid="tab-desktop">
                <FaDesktop />
              </TabsTrigger>
              <TabsTrigger value="mobile" title={t("mobile")} data-testid="tab-mobile">
                <FaMobile />
              </TabsTrigger>
              <TabsTrigger value="code" title={t("code")} data-testid="tab-code" className="gap-2">
                <FaCode />
                {t("code")}
              </TabsTrigger>
            </TabsList>
            {(activeTab === "desktop" || activeTab === "mobile") && (
              <div className="hidden sm:inline-flex items-center gap-2">
                {activeTab === "desktop" && (
                  <div className="inline-flex items-center rounded-xl border border-stone-200 bg-stone-100/80 p-1 dark:border-zinc-700 dark:bg-zinc-800">
                    <button
                      type="button"
                      onClick={() => setDesktopViewMode("fit")}
                      title={t("scaleDownToFit")}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                        desktopViewMode === "fit"
                          ? "bg-stone-950 text-white shadow-sm dark:bg-white dark:text-stone-950"
                          : "text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                      }`}
                    >
                      Scale
                      {desktopScale < 1 && (
                        <span className="ml-1 text-violet-600 dark:text-violet-300 font-bold">
                          ({Math.round(desktopScale * 100)}%)
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDesktopViewMode("actual")}
                      title={t("originalSize")}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                        desktopViewMode === "actual"
                          ? "bg-stone-950 text-white shadow-sm dark:bg-white dark:text-stone-950"
                          : "text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                      }`}
                    >
                      100%
                    </button>
                  </div>
                )}
                <Button
                  onClick={() => openInNewTab(previewCode)}
                  variant="ghost"
                  size="icon"
                  title={t("openInNewTab")}
                  className="h-8 w-8"
                >
                  <LuExternalLink />
                </Button>
              </div>
            )}
          </div>

          {/* Version navigation */}
          {totalVersions > 0 && (
            <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1 rounded-full border border-stone-200/70 bg-white/70 p-1 backdrop-blur-sm dark:border-zinc-700/50 dark:bg-zinc-800/50 md:flex">
              <Button
                onClick={() => canGoPrev && setHead(sortedCommits[currentVersionIndex - 1].hash)}
                variant="ghost"
                size="icon"
                title={t("previousVersion")}
                className={`h-6 w-6 rounded-full hover:bg-stone-950 hover:text-white dark:hover:bg-white dark:hover:text-stone-950 ${!canGoPrev ? "opacity-30 cursor-not-allowed" : ""}`}
                disabled={!canGoPrev}
              >
                <LuChevronLeft className="w-3.5 h-3.5" />
              </Button>
              <div
                onClick={onOpenVersions}
                className="flex items-center justify-center gap-2 px-1 cursor-pointer hover:opacity-70 transition-opacity w-32"
                title={t("viewAllVersions")}
              >
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 leading-none">
                  {t("versionNumber", { count: currentVersionIndex + 1 })}
                </span>
                {currentVersionIndex === totalVersions - 1 && (
                  <span className="flex h-4 items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium leading-none text-amber-800 dark:bg-amber-500/15 dark:text-amber-200">
                    {t("latest")}
                  </span>
                )}
              </div>
              <Button
                onClick={() => canGoNext && setHead(sortedCommits[currentVersionIndex + 1].hash)}
                variant="ghost"
                size="icon"
                title={t("nextVersion")}
                className={`h-6 w-6 rounded-full hover:bg-stone-950 hover:text-white dark:hover:bg-white dark:hover:text-stone-950 ${!canGoNext ? "opacity-30 cursor-not-allowed" : ""}`}
                disabled={!canGoNext}
              >
                <LuChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}

          <div className="flex items-center gap-1">
            {canSelectAndEdit &&
              (activeTab === "desktop" || activeTab === "mobile") && (
                <SelectAndEditToolbarButton />
              )}
            {(appState === AppState.CODE_READY || isSelectedVariantComplete) && (
              <Button
                onClick={() => downloadCode(previewCode)}
                variant="ghost"
                size="icon"
                title={t("downloadCode")}
                className="h-9 w-9"
                data-testid="download-code"
              >
                <LuDownload />
              </Button>
            )}
            <Button
              onClick={() => {
                const iframes = document.querySelectorAll("iframe");
                iframes.forEach((iframe) => {
                  if (iframe.srcdoc) {
                    const content = iframe.srcdoc;
                    iframe.srcdoc = "";
                    iframe.srcdoc = content;
                  }
                });
              }}
              variant="ghost"
              size="icon"
              title={t("refreshPreview")}
              className="h-9 w-9"
            >
              <LuRefreshCw />
            </Button>
          </div>
        </div>
        <TabsContent value="desktop" className="flex-1 min-h-0 mt-0 data-[state=active]:flex data-[state=active]:flex-col">
          <PreviewComponent
            code={previewCode}
            device="desktop"
            onScaleChange={setDesktopScale}
            viewMode={desktopViewMode}
          />
        </TabsContent>
        <TabsContent value="mobile" className="flex-1 min-h-0 mt-0 data-[state=active]:flex data-[state=active]:flex-col">
          <PreviewComponent
            code={previewCode}
            device="mobile"
            viewMode="actual"
          />
        </TabsContent>
        <TabsContent value="code" className="flex-1 min-h-0 mt-0 overflow-auto">
          <CodeTab
            code={previewCode}
            setCode={() => {}}
            settings={settings}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PreviewPane;
