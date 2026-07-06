import { useState } from "react";
import { HTTP_BACKEND_URL } from "../../../config";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { toast } from "react-hot-toast";
import OutputSettingsSection from "../../settings/OutputSettingsSection";
import { DesignSystemSelectorProps } from "../../settings/DesignSystemSelector";
import { Stack } from "../../../lib/stacks";
import { useI18n } from "../../../i18n";

interface Props {
  screenshotOneApiKey: string | null;
  doCreate: (
    urls: string[],
    inputMode: "image" | "video",
    textPrompt?: string,
  ) => void;
  stack: Stack;
  setStack: (stack: Stack) => void;
  designSystem: DesignSystemSelectorProps;
}

function isFigmaUrl(url: string): boolean {
  return /^https?:\/\/([\w.-]*\.)?figma\.com\//i.test(url.trim());
}

function UrlTab({
  doCreate,
  screenshotOneApiKey,
  stack,
  setStack,
  designSystem,
}: Props) {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [referenceUrl, setReferenceUrl] = useState("");

  async function takeScreenshot() {
    const trimmedReferenceUrl = referenceUrl.trim();

    if (!screenshotOneApiKey) {
      toast.error(t("screenshotApiKeyMissing"), { duration: 6000 });
      return;
    }

    if (!trimmedReferenceUrl) {
      toast.error(t("enterUrl"));
      return;
    }

    if (trimmedReferenceUrl.toLowerCase().startsWith("file://")) {
      toast.error(t("fileUrlNotSupported"));
      return;
    }

    if (isFigmaUrl(trimmedReferenceUrl)) {
      toast.error(t("figmaNotSupported"), { duration: 6000 });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${HTTP_BACKEND_URL}/api/screenshot`, {
        method: "POST",
        body: JSON.stringify({
          url: trimmedReferenceUrl,
          apiKey: screenshotOneApiKey,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to capture screenshot");
      }

      const res = await response.json();
      doCreate([res.url], "image");
    } catch (error) {
      console.error(error);
      toast.error(t("captureScreenshotFailed"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full max-w-3xl">
        <div className="flex flex-col gap-6 rounded-xl border border-stone-200/80 bg-white/75 p-5 dark:border-zinc-800 dark:bg-zinc-950/70 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-stone-50 text-stone-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-current"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] text-xl font-semibold tracking-normal text-stone-900 dark:text-white">
                {t("urlTitle")}
              </h3>
              <p className="mt-1 text-sm text-stone-500 dark:text-zinc-400">
                Capture a public page and use it as the visual reference.
              </p>
            </div>
          </div>

          <div className="w-full space-y-3">
            <Input
              placeholder="https://"
              onChange={(e) => setReferenceUrl(e.target.value)}
              value={referenceUrl}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading) {
                  takeScreenshot();
                }
              }}
              className="h-11 rounded-lg border-stone-200 bg-white text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              data-testid="url-input"
            />
            {isFigmaUrl(referenceUrl) && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                {t("figmaHint")}
              </p>
            )}
            <OutputSettingsSection
              stack={stack}
              setStack={setStack}
              designSystem={designSystem}
            />

            <Button
              onClick={takeScreenshot}
              disabled={isLoading}
              className="w-full rounded-lg"
              size="lg"
              data-testid="url-capture"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {t("capturing")}
                </span>
              ) : (
                t("captureAndGenerate")
              )}
            </Button>
          </div>

          <p className="text-center text-xs text-stone-400 dark:text-zinc-500">
            {t("requiresScreenshotOneKey")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default UrlTab;
