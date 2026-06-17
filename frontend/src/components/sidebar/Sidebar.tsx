import { useAppStore } from "../../store/app-store";
import { useProjectStore } from "../../store/project-store";
import { AppState } from "../../types";
import { Button } from "../ui/button";
import { useEffect, useRef, useState, useCallback } from "react";
import { LuMousePointerClick, LuRefreshCw, LuArrowUp, LuX } from "react-icons/lu";
import { toast } from "react-hot-toast";

import Variants from "../variants/Variants";
import UpdateImageUpload, { UpdateImagePreview } from "../UpdateImageUpload";
import AgentActivity from "../agent/AgentActivity";
import WorkingPulse from "../core/WorkingPulse";
import ImageLightbox from "../ImageLightbox";
import { Commit } from "../commits/types";
import { CodeGenerationModel } from "../../lib/models";
import DesignSystemSelector, {
  DesignSystemSelectorProps,
} from "../settings/DesignSystemSelector";
import { useI18n } from "../../i18n";

interface SidebarProps {
  doUpdate: (instruction: string) => void;
  regenerate: () => void;
  cancelCodeGeneration: () => void;
  onOpenVersions: () => void;
  designSystem: DesignSystemSelectorProps;
}

const MAX_UPDATE_IMAGES = 5;

function extractTagName(html: string): string {
  const match = html.match(/^<(\w+)/);
  return match ? match[1].toLowerCase() : "element";
}

function summarizeLatestChange(commit: Commit | null): string | null {
  if (!commit) return null;
  const text = commit.type !== "code_create" ? commit.inputs.text.trim() : "";
  if (text.length > 0) return text;
  return null;
}

function getSelectedElementTag(commit: Commit | null): string | null {
  if (!commit || commit.type === "code_create") return null;
  const html = commit.inputs.selectedElementHtml;
  if (!html) return null;
  return extractTagName(html);
}

function isSlowGeminiModel(model?: string): boolean {
  return (
    model === CodeGenerationModel.GEMINI_3_1_PRO_PREVIEW_HIGH ||
    model === CodeGenerationModel.GEMINI_3_1_PRO_PREVIEW_MEDIUM
  );
}

function Sidebar({
  doUpdate,
  regenerate,
  cancelCodeGeneration,
  onOpenVersions,
  designSystem,
}: SidebarProps) {
  const { t } = useI18n();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const middlePaneRef = useRef<HTMLDivElement>(null);
  const [isErrorExpanded, setIsErrorExpanded] = useState(false);
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  const [isPromptClamped, setIsPromptClamped] = useState(false);
  const promptTextRef = useRef<HTMLParagraphElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const {
    appState,
    updateInstruction,
    setUpdateInstruction,
    updateImages,
    setUpdateImages,
    inSelectAndEditMode,
    toggleInSelectAndEditMode,
    selectedElement,
    setSelectedElement,
  } = useAppStore();

  // Helper function to convert file to data URL
  const fileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files).filter(
        (file) => file.type === "image/png" || file.type === "image/jpeg"
      );

      if (files.length === 0) return;

      try {
        if (updateImages.length >= MAX_UPDATE_IMAGES) {
          toast.error(
            t("referenceImageLimitReached", { count: MAX_UPDATE_IMAGES })
          );
          return;
        }

        const remainingSlots = MAX_UPDATE_IMAGES - updateImages.length;
        let filesToAdd = files;
        if (filesToAdd.length > remainingSlots) {
          toast.error(
            t("referenceOnlySomeAdded", {
              count: remainingSlots,
              max: MAX_UPDATE_IMAGES,
            })
          );
          filesToAdd = filesToAdd.slice(0, remainingSlots);
        }

        const newImagePromises = filesToAdd.map((file) => fileToDataURL(file));
        const newImages = await Promise.all(newImagePromises);
        setUpdateImages([...updateImages, ...newImages]);
      } catch (error) {
        console.error("Error reading files:", error);
      }
    },
    [t, updateImages, setUpdateImages]
  );

  const { head, commits, latestCommitHash, setHead } = useProjectStore();

  const currentCommit = head ? commits[head] : null;
  const latestChangeSummary =
    summarizeLatestChange(currentCommit) ??
    (currentCommit?.type === "code_create"
      ? t("importedExistingCode")
      : currentCommit?.type === "ai_create"
        ? t("createSummary")
        : currentCommit?.inputs.images.length && currentCommit.inputs.images.length > 1
          ? t("updatedWithReferenceImages", {
              count: currentCommit.inputs.images.length,
            })
          : currentCommit?.inputs.images.length === 1
            ? t("updatedWithOneReferenceImage")
            : currentCommit
              ? t("updatedCode")
              : null);
  const selectedElementTag = getSelectedElementTag(currentCommit);
  const latestChangeImages =
    currentCommit && currentCommit.type !== "code_create"
      ? currentCommit.inputs.images
      : [];
  const latestChangeVideos =
    currentCommit && currentCommit.type !== "code_create"
      ? currentCommit.inputs.videos ?? []
      : [];
  const selectedVariantIndex = currentCommit?.selectedVariantIndex ?? 0;
  const selectedVariant = currentCommit?.variants[selectedVariantIndex];
  const selectedVariantEvents = selectedVariant?.agentEvents ?? [];
  const showWorkingIndicator =
    appState === AppState.CODING &&
    selectedVariantEvents.length === 0 &&
    head === latestCommitHash;
  const requestStartMs =
    selectedVariant?.requestStartedAt ??
    (currentCommit?.dateCreated
      ? new Date(currentCommit.dateCreated).getTime()
      : undefined);
  const elapsedSeconds = requestStartMs
    ? Math.max(1, Math.round((nowMs - requestStartMs) / 1000))
    : undefined;

  const isFirstGeneration = currentCommit?.type === "ai_create";
  const isViewingOlderVersion = head !== null && head !== latestCommitHash;

  // Compute version number for the current head
  const currentVersionNumber = (() => {
    if (!head) return null;
    const sorted = Object.values(commits).sort(
      (a, b) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
    );
    const index = sorted.findIndex((c) => c.hash === head);
    return index !== -1 ? index + 1 : null;
  })();

  // Check if the currently selected variant is complete
  const isSelectedVariantComplete =
    head &&
    commits[head] &&
    commits[head].variants[commits[head].selectedVariantIndex].status ===
      "complete";

  // Check if the currently selected variant has an error
  const isSelectedVariantError =
    head &&
    commits[head] &&
    commits[head].variants[commits[head].selectedVariantIndex].status ===
      "error";

  // Get the error message from the selected variant
  const selectedVariantErrorMessage =
    head &&
    commits[head] &&
    commits[head].variants[commits[head].selectedVariantIndex].errorMessage;

  // Auto-resize textarea to fit content
  const autoResize = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, []);

  // Focus on the update instruction textarea when a variant is complete
  useEffect(() => {
    if (
      (appState === AppState.CODE_READY || isSelectedVariantComplete) &&
      textareaRef.current
    ) {
      const el = textareaRef.current;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, [appState, isSelectedVariantComplete]);

  // Focus the textarea when an element is selected in the preview
  useEffect(() => {
    if (selectedElement && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [selectedElement]);

  // Reset textarea height when instruction changes externally (e.g., cleared after submit)
  useEffect(() => {
    autoResize();
  }, [updateInstruction, autoResize]);

  // Reset error expanded state when variant changes
  useEffect(() => {
    setIsErrorExpanded(false);
  }, [head, selectedVariantIndex]);

  // Reset prompt expanded state when commit changes and detect clamping
  useEffect(() => {
    setIsPromptExpanded(false);
  }, [head]);

  useEffect(() => {
    const el = promptTextRef.current;
    if (el) {
      setIsPromptClamped(el.scrollHeight > el.clientHeight);
    } else {
      setIsPromptClamped(false);
    }
  }, [latestChangeSummary, isPromptExpanded]);

  useEffect(() => {
    if (!middlePaneRef.current) return;
    requestAnimationFrame(() => {
      if (!middlePaneRef.current) return;
      middlePaneRef.current.scrollTop = middlePaneRef.current.scrollHeight;
    });
  }, [head, selectedVariantIndex]);

  useEffect(() => {
    if (appState !== AppState.CODING) return;
    const intervalId = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, [appState]);


  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 border-b border-stone-200/80 bg-white/80 px-4 py-2 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/88">
        <Variants />
      </div>

      {/* Scrollable content */}
      <div
        ref={middlePaneRef}
        className="sidebar-scrollbar-stable flex-1 min-h-0 overflow-y-auto px-5 pt-4"
      >
        {latestChangeSummary && (
          <div className="mb-4 flex flex-col items-end">
            <div className="studio-panel inline-block max-w-[90%] rounded-[1.35rem] px-4 py-3">
              <p
                ref={promptTextRef}
                className={`break-words whitespace-pre-wrap text-[13px] text-stone-800 dark:text-zinc-100 ${
                  !isPromptExpanded ? "line-clamp-[10]" : ""
                }`}
              >
                {latestChangeSummary}
              </p>
              {selectedElementTag && (
                <div className="mt-1.5 flex items-center gap-1.5">
                  <LuMousePointerClick className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-[11px] text-cyan-700 dark:text-cyan-300">
                    {t("selected")} <code className="rounded bg-cyan-100 px-1 py-0.5 font-mono text-[10px] dark:bg-cyan-900/40">&lt;{selectedElementTag}&gt;</code>
                  </span>
                </div>
              )}
              {(isPromptClamped || isPromptExpanded) && (
                <div className="flex justify-end mt-1.5">
                  <button
                    onClick={() => setIsPromptExpanded(!isPromptExpanded)}
                    className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 shadow-sm transition-colors hover:bg-white dark:bg-zinc-800/70 dark:text-gray-300 dark:hover:bg-zinc-800"
                  >
                    {isPromptExpanded ? t("less") : t("more")}
                  </button>
                </div>
              )}
            </div>
              {latestChangeImages.length > 0 && (
                <div className="mt-2 flex gap-2 flex-wrap justify-end">
                  {latestChangeImages.map((image, index) => (
                    <button
                      key={`${image.slice(0, 40)}-${index}`}
                      onClick={() => setLightboxImage(image)}
                      className="shrink-0 cursor-zoom-in rounded-xl border border-stone-200 bg-white p-1 transition-colors hover:border-cyan-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-cyan-500"
                    >
                      <img
                        src={image}
                        alt={t("referenceImage", { count: index + 1 })}
                        className="h-24 w-24 object-contain"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
              {latestChangeVideos.length > 0 && (
                <div className="mt-2 space-y-2">
                  {latestChangeVideos.map((video, index) => (
                    <video
                      key={`${video.slice(0, 40)}-${index}`}
                      src={video}
                      className="w-full rounded-lg border border-gray-200 dark:border-zinc-700"
                      controls
                      preload="metadata"
                    />
                  ))}
                </div>
              )}
          </div>
        )}

        {showWorkingIndicator && (
          <div className="working-indicator-bg mb-3 rounded-[1.2rem] border border-cyan-200 px-3 py-2 transition-all duration-500 dark:border-cyan-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <WorkingPulse />
                <span>{t("working")}</span>
              </div>
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                {t("timeSoFar", {
                  time: elapsedSeconds ? `${elapsedSeconds}s` : "--",
                })}
              </div>
            </div>
          </div>
        )}

        {currentCommit?.type === "ai_create" &&
          appState === AppState.CODING &&
          head === latestCommitHash &&
          !isSelectedVariantComplete &&
          !isSelectedVariantError &&
          isSlowGeminiModel(selectedVariant?.model) && (
          <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
            {t("slowGeminiNotice")}
          </div>
        )}

        {isViewingOlderVersion && currentVersionNumber !== null ? (
          <div className="mb-4 flex flex-col items-center py-6">
            <p className="text-2xl font-semibold text-gray-900 dark:text-zinc-100">
              {t("versionNumber", { count: currentVersionNumber })}
            </p>
            <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
              {t("viewingOlderVersion")}
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={onOpenVersions}
                className="rounded-lg border border-gray-300 dark:border-zinc-600 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              >
                {t("allVersions")}
              </button>
              <button
                onClick={() => latestCommitHash && setHead(latestCommitHash)}
                className="rounded-lg bg-gray-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-black hover:bg-black dark:hover:bg-gray-200 transition-colors"
              >
                {t("viewLatest")}
              </button>
            </div>
          </div>
        ) : (
          <AgentActivity />
        )}

        {/* Regenerate button for first generation.
            Scenarios:
            1) `appState === CODE_READY`: request fully ended and user can retry.
            2) `isSelectedVariantComplete`: selected option completed even if app state
               has not yet fully transitioned.
            3) `isSelectedVariantError`: selected option failed; keep retry visible so
               users can rerun create without losing uploaded inputs. */}
        {isFirstGeneration &&
          head === latestCommitHash &&
          (appState === AppState.CODE_READY ||
            isSelectedVariantComplete ||
            isSelectedVariantError) && (
          <div className="flex justify-end mb-3">
            <button
              onClick={regenerate}
              className="flex items-center gap-1.5 rounded-full border border-stone-300 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-stone-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-zinc-800"
            >
              <LuRefreshCw className="w-3.5 h-3.5" />
              {t("retry")}
            </button>
          </div>
        )}

        {/* Show cancel button when coding */}
        {appState === AppState.CODING && !isSelectedVariantComplete && (
          <div className="flex w-full">
            <Button
              onClick={cancelCodeGeneration}
              className="w-full dark:text-white dark:bg-gray-700"
            >
              {t("cancelAllGenerations")}
            </Button>
          </div>
        )}

        {/* Show error message when selected option has an error */}
        {isSelectedVariantError && (
          <div className="mb-2 rounded-[1.1rem] border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/30">
            <div className="text-red-800 dark:text-red-200 text-sm">
                <div className="font-medium mb-1">
                {t("optionFailedBecause")}
              </div>
              {selectedVariantErrorMessage && (
                <div className="mb-2">
                  <div className="text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700 rounded px-2 py-1 text-xs font-mono break-words">
                    {selectedVariantErrorMessage.length > 200 && !isErrorExpanded
                      ? `${selectedVariantErrorMessage.slice(0, 200)}...`
                      : selectedVariantErrorMessage}
                  </div>
                  {selectedVariantErrorMessage.length > 200 && (
                    <button
                      onClick={() => setIsErrorExpanded(!isErrorExpanded)}
                      className="text-red-600 dark:text-red-400 text-xs underline mt-1 hover:text-red-800 dark:hover:text-red-300"
                    >
                      {isErrorExpanded ? t("showLess") : t("showMore")}
                    </button>
                  )}
                </div>
              )}
              <div>
                {isFirstGeneration
                  ? t("retryCreateRequest")
                  : t("switchOptionForUpdates")}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pinned bottom: prompt box + option selector */}
      {(appState === AppState.CODE_READY || isSelectedVariantComplete) &&
        !isSelectedVariantError && (
          <div
            className="shrink-0 border-t border-stone-200/80 bg-white/80 px-4 py-4 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/88"
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setIsDragging(false);
              }
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {/* Select and edit indicator */}
            {inSelectAndEditMode && (
              <div className="mb-2">
                {selectedElement ? (
                  <div className="flex items-center justify-between rounded-[1rem] border border-cyan-300 bg-cyan-50 px-3 py-2 dark:border-cyan-600 dark:bg-cyan-950/20">
                    <div className="flex items-center gap-2 min-w-0">
                      <LuMousePointerClick className="h-3.5 w-3.5 shrink-0 text-cyan-600 dark:text-cyan-400" />
                      <span className="truncate text-sm text-cyan-700 dark:text-cyan-300">
                        {t("selected")} <code className="rounded bg-cyan-100 px-1.5 py-0.5 font-mono text-xs dark:bg-cyan-800/50">&lt;{selectedElement.tagName.toLowerCase()}&gt;</code>
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedElement(null)}
                      className="shrink-0 ml-3 p-0.5 text-violet-400 hover:text-violet-700 dark:hover:text-violet-200 transition-colors"
                      title={t("exit")}
                    >
                      <LuX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between rounded-[1rem] border border-cyan-200 bg-cyan-50 px-3 py-2 dark:border-cyan-700 dark:bg-cyan-950/20">
                    <div className="flex items-center gap-2">
                      <LuMousePointerClick className="h-3.5 w-3.5 shrink-0 text-cyan-500 dark:text-cyan-400" />
                      <span className="text-sm font-medium text-cyan-700 dark:text-cyan-300">{t("clickElementToEditIt")}</span>
                    </div>
                    <button
                      onClick={toggleInSelectAndEditMode}
                      className="shrink-0 ml-3 text-sm text-violet-500 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-200 transition-colors"
                    >
                      {t("exit")}
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className="relative w-full overflow-hidden rounded-[1.5rem] border-2 border-stone-200 bg-white/95 transition-all focus-within:border-cyan-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus-within:border-cyan-500">
              <UpdateImagePreview
                updateImages={updateImages}
                setUpdateImages={setUpdateImages}
              />
              <textarea
                ref={textareaRef}
                placeholder={
                  inSelectAndEditMode && selectedElement
                    ? t("updatePromptForElement", {
                        tag: selectedElement.tagName.toLowerCase(),
                      })
                    : t("tellAiWhatToChange")
                }
                onChange={(e) => {
                  setUpdateInstruction(e.target.value);
                  autoResize();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    doUpdate(updateInstruction);
                  }
                }}
                value={updateInstruction}
                data-testid="update-input"
                rows={1}
                className="max-h-40 w-full resize-none border-0 bg-transparent px-4 pb-6 pt-4 text-[15px] leading-6 text-gray-800 placeholder:text-gray-400 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500"
              />
              <div className="flex items-center justify-between px-3 pb-3">
                <div className="flex items-center gap-1">
                  <UpdateImageUpload
                    updateImages={updateImages}
                    setUpdateImages={setUpdateImages}
                  />
                  <button
                    onClick={toggleInSelectAndEditMode}
                    data-testid="select-edit-toggle-prompt"
                    className={`rounded-lg p-2 transition-colors ${
                      inSelectAndEditMode
                        ? "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400"
                        : "text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                    }`}
                    title={inSelectAndEditMode ? t("exitSelectionMode") : t("selectElementToTarget")}
                  >
                    <LuMousePointerClick className="w-[18px] h-[18px]" />
                  </button>
                  <DesignSystemSelector {...designSystem} compact />
                </div>
                <button
                  onClick={() => doUpdate(updateInstruction)}
                  disabled={!updateInstruction.trim()}
                  className={`rounded-xl p-2 transition-colors update-btn ${
                    updateInstruction.trim()
                      ? "bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-stone-200"
                      : "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-zinc-700 dark:text-zinc-500"
                  }`}
                  title={t("send")}
                >
                  <LuArrowUp className="w-[18px] h-[18px]" strokeWidth={2.5} />
                </button>
              </div>

              {isDragging && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[1.5rem] border-2 border-dashed border-cyan-400 bg-cyan-50/90 pointer-events-none dark:border-cyan-600 dark:bg-gray-800/90">
                  <p className="font-medium text-cyan-600 dark:text-cyan-400">{t("dropImagesHere")}</p>
                </div>
              )}
            </div>
          </div>
        )}

      <ImageLightbox
        image={lightboxImage}
        onClose={() => setLightboxImage(null)}
      />
    </div>
  );
}

export default Sidebar;
