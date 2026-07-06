import { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import OutputSettingsSection from "../../settings/OutputSettingsSection";
import toast from "react-hot-toast";
import { Stack } from "../../../lib/stacks";
import { useI18n } from "../../../i18n";

interface Props {
  importFromCode: (code: string, stack: Stack) => void;
}

function ImportTab({ importFromCode }: Props) {
  const { t } = useI18n();
  const [code, setCode] = useState("");
  const [stack, setStack] = useState<Stack | undefined>(undefined);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const doImport = () => {
    if (code === "") {
      toast.error(t("pasteSomeCode"));
      return;
    }

    if (stack === undefined) {
      toast.error(t("selectStackError"));
      return;
    }

    importFromCode(code, stack);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      doImport();
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "text/html": [".html", ".htm"],
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
    onDragEnter: () => setIsDraggingFile(true),
    onDragLeave: () => setIsDraggingFile(false),
    onDrop: async (acceptedFiles) => {
      setIsDraggingFile(false);
      const file = acceptedFiles[0];
      if (!file) return;
      const contents = await file.text();
      setCode(contents);
      setTimeout(() => textareaRef.current?.focus(), 50);
    },
  });

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
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>

            <div>
              <h3 className="font-['Space_Grotesk'] text-xl font-semibold tracking-normal text-stone-900 dark:text-white">
                {t("importTitle")}
              </h3>
              <p className="mt-1 text-sm text-stone-500 dark:text-zinc-400">
                Paste HTML or drop a file to continue refining existing code.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div
              {...getRootProps({
                className: `rounded-lg ${
                  isDraggingFile ? "ring-2 ring-cyan-200 dark:ring-cyan-800 ring-offset-2 dark:ring-offset-zinc-900" : ""
                }`,
              })}
            >
              <input {...getInputProps()} />
              <Textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-48 w-full resize-none rounded-lg border-stone-200 bg-white font-mono text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                placeholder={t("pasteHtmlPlaceholder")}
                data-testid="import-input"
              />
            </div>

            <OutputSettingsSection
              stack={stack}
              setStack={(config: Stack) => setStack(config)}
              label={t("stackLabel")}
              shouldDisableUpdates={false}
            />

            <Button
              onClick={doImport}
              className="w-full rounded-lg"
              size="lg"
              data-testid="import-submit"
            >
              {t("importCode")}
            </Button>

            <p className="text-center text-xs text-stone-400 dark:text-zinc-500">
              {t("pressCmdCtrlEnterImport")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImportTab;
