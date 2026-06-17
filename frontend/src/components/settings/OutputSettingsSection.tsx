import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Stack } from "../../lib/stacks";
import StackLabel from "../core/StackLabel";
import DesignSystemSelector, {
  DesignSystemSelectorProps,
} from "./DesignSystemSelector";
import { useI18n } from "../../i18n";

interface Props {
  stack: Stack | undefined;
  setStack: (config: Stack) => void;
  label?: string;
  shouldDisableUpdates?: boolean;
  designSystem?: DesignSystemSelectorProps;
}

function OutputSettingsSection({
  stack,
  setStack,
  label,
  shouldDisableUpdates = false,
  designSystem,
}: Props) {
  const { t } = useI18n();
  const resolvedLabel = label ?? t("outputStack");

  return (
    <div className="flex flex-col gap-y-3 justify-between text-sm">
      <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-3 sm:gap-4">
        <span className="font-medium text-stone-700 dark:text-zinc-300">
          {resolvedLabel}
        </span>
        <Select
          value={stack ?? ""}
          onValueChange={(value: string) => setStack(value as Stack)}
          disabled={shouldDisableUpdates}
        >
          <SelectTrigger
            className="col-span-2"
            id="output-settings-js"
            data-testid="stack-select"
          >
            <SelectValue placeholder={t("selectStack")} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.values(Stack).map((stack) => (
                <SelectItem key={stack} value={stack}>
                  <div className="flex items-center">
                    <StackLabel stack={stack} />
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {designSystem && (
        <DesignSystemSelector {...designSystem} />
      )}
    </div>
  );
}

export default OutputSettingsSection;
