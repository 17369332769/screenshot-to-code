import { LuChevronDown, LuPalette } from "react-icons/lu";
import { DesignSystem } from "../../types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useI18n } from "../../i18n";

const NO_DESIGN_SYSTEM = "__none__";
const ADD_NEW = "__add_new__";
const MANAGE = "__manage__";

export interface DesignSystemSelectorProps {
  designSystems: DesignSystem[];
  selectedDesignSystemId: string | null;
  setSelectedDesignSystemId: (id: string | null) => void;
  onAddNew: () => void;
  onManage: () => void;
  disabled?: boolean;
  compact?: boolean;
}

function DesignSystemSelector({
  designSystems,
  selectedDesignSystemId,
  setSelectedDesignSystemId,
  onAddNew,
  onManage,
  disabled = false,
  compact = false,
}: DesignSystemSelectorProps) {
  const { t } = useI18n();

  const handleValueChange = (value: string) => {
    if (value === ADD_NEW) {
      onAddNew();
      return;
    }
    if (value === MANAGE) {
      onManage();
      return;
    }
    setSelectedDesignSystemId(value === NO_DESIGN_SYSTEM ? null : value);
  };

  const selectedDesignSystem = designSystems.find(
    (item) => item.id === selectedDesignSystemId
  );
  const hasSelection = selectedDesignSystem !== undefined;

  return (
    <Select
      value={selectedDesignSystemId ?? NO_DESIGN_SYSTEM}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      {compact ? (
        <SelectTrigger
          className={
            hasSelection
              ? "flex h-8 w-auto items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-0 text-xs font-medium text-stone-700 shadow-none hover:bg-white focus:ring-0 focus:ring-offset-0 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 [&>svg:last-child]:hidden"
              : "flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-stone-50 p-0 text-gray-400 shadow-none hover:bg-white hover:text-gray-600 focus:ring-0 focus:ring-offset-0 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-500 dark:hover:bg-zinc-700 dark:hover:text-zinc-300 [&>svg:last-child]:hidden"
          }
          data-testid="design-system-select"
          aria-label={
            hasSelection
              ? t("designSystemTitle", { name: selectedDesignSystem.name })
              : t("addDesignSystem")
          }
          title={
            hasSelection
              ? t("designSystemTitle", { name: selectedDesignSystem.name })
              : t("addDesignSystem")
          }
        >
          <LuPalette className="h-3.5 w-3.5 shrink-0" />
          {hasSelection && (
            <>
              <span className="max-w-[120px] truncate">
                {selectedDesignSystem.name}
              </span>
              <LuChevronDown className="h-3 w-3 shrink-0 opacity-60" />
            </>
          )}
        </SelectTrigger>
      ) : hasSelection ? (
        <div className="grid grid-cols-1 items-center gap-2 text-sm sm:grid-cols-[minmax(120px,0.7fr)_minmax(0,2fr)] sm:gap-4">
          <span className="text-sm font-semibold text-stone-700 dark:text-zinc-300">
            {t("designSystem")}
          </span>
          <SelectTrigger
            className="h-11 rounded-lg border-stone-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:col-span-1"
            data-testid="design-system-select"
          >
            <SelectValue placeholder={t("noDesignSystem")} />
          </SelectTrigger>
        </div>
      ) : (
        <div className="flex justify-end text-xs">
          <SelectTrigger
            className="h-auto w-auto justify-start gap-1 rounded-lg border-0 bg-transparent px-0 py-0 text-sm font-medium text-stone-500 shadow-none hover:text-stone-800 focus:ring-0 focus:ring-offset-0 dark:text-zinc-400 dark:hover:text-zinc-200 [&>svg]:hidden"
            data-testid="design-system-select"
          >
            <span>{t("addDesignSystemAction")}</span>
          </SelectTrigger>
        </div>
      )}
      <SelectContent>
        <SelectGroup>
          <SelectItem value={NO_DESIGN_SYSTEM}>{t("noDesignSystem")}</SelectItem>
          {designSystems.map((designSystem) => (
            <SelectItem key={designSystem.id} value={designSystem.id}>
              {designSystem.name}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectItem value={ADD_NEW} data-testid="design-system-add-new">
            {t("newDesignSystem")}
          </SelectItem>
          {designSystems.length > 0 && (
            <SelectItem value={MANAGE} data-testid="design-system-manage">
              {t("manageDesignSystems")}
            </SelectItem>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default DesignSystemSelector;
