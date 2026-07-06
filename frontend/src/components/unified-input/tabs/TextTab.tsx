import { useState, useRef, useEffect } from "react";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import toast from "react-hot-toast";
import OutputSettingsSection from "../../settings/OutputSettingsSection";
import { DesignSystemSelectorProps } from "../../settings/DesignSystemSelector";
import { Stack } from "../../../lib/stacks";
import { useI18n } from "../../../i18n";

interface Props {
  doCreateFromText: (text: string) => void;
  stack: Stack;
  setStack: (stack: Stack) => void;
  designSystem: DesignSystemSelectorProps;
}

function TextTab({ doCreateFromText, stack, setStack, designSystem }: Props) {
  const { t } = useI18n();
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const examplePrompts = [
    t("textExample1"),
    t("textExample2"),
    t("textExample3"),
    t("textExample4"),
  ];

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleGenerate = () => {
    if (text.trim() === "") {
      toast.error(t("enterDescription"));
      return;
    }
    doCreateFromText(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleExampleClick = (example: string) => {
    setText(example);
    textareaRef.current?.focus();
  };

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
                <path d="M17 6.1H3" />
                <path d="M21 12.1H3" />
                <path d="M15.1 18H3" />
              </svg>
            </div>

            <div>
              <h3 className="font-['Space_Grotesk'] text-xl font-semibold tracking-normal text-stone-900 dark:text-white">
                {t("textTitle")}
              </h3>
              <p className="mt-1 text-sm text-stone-500 dark:text-zinc-400">
                Describe the screen you want and generate a first draft.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Textarea
              ref={textareaRef}
              rows={4}
              placeholder={t("describeUiPlaceholder")}
              className="w-full resize-none rounded-lg border-stone-200 bg-white text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              data-testid="text-input"
            />

            <div className="flex flex-col gap-2">
              <p className="text-xs text-stone-500 dark:text-zinc-400">{t("tryExample")}</p>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example)}
                    className="max-w-[200px] truncate rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs text-stone-600 transition-colors hover:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    title={example}
                  >
                    {example.length > 30 ? example.slice(0, 30) + "..." : example}
                  </button>
                ))}
              </div>
            </div>

            <OutputSettingsSection
              stack={stack}
              setStack={setStack}
              designSystem={designSystem}
            />

            <Button
              onClick={handleGenerate}
              className="w-full rounded-lg"
              size="lg"
              data-testid="text-generate"
            >
              {t("generate")}
            </Button>

            <p className="text-center text-xs text-stone-400 dark:text-zinc-500">
              {t("pressCmdCtrlEnterGenerate")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TextTab;
