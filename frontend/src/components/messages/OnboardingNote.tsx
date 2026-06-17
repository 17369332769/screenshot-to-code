import { useI18n } from "../../i18n";

export function OnboardingNote() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col space-y-4 bg-green-700 p-2 rounded text-stone-200 text-sm">
      <span>
        {t("onboardingNote").split(t("onboardingBuyCredits"))[0]}
        <a
          className="inline underline hover:opacity-70"
          href="https://buy.stripe.com/8wM6sre70gBW1nqaEE"
          target="_blank"
        >
          {t("onboardingBuyCredits")}
        </a>{" "}
        {t("onboardingNote")
          .split(t("onboardingBuyCredits"))[1]
          ?.split(t("onboardingFollowInstructions"))[0]}
        <a
          href="https://github.com/abi/screenshot-to-code/blob/main/Troubleshooting.md"
          className="inline underline hover:opacity-70"
          target="_blank"
        >
          {t("onboardingFollowInstructions")}
        </a>{" "}
        {t("onboardingNote").split(t("onboardingFollowInstructions"))[1]}
      </span>
    </div>
  );
}
