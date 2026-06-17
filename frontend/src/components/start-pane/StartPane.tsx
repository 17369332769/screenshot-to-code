import React from "react";
import { DesignSystem, Settings } from "../../types";
import { Stack } from "../../lib/stacks";
import UnifiedInputPane from "../unified-input/UnifiedInputPane";
import AccountPanel from "../account/AccountPanel";
import { IS_RUNNING_ON_CLOUD } from "../../config";
import { useI18n } from "../../i18n";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

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

const StartPane: React.FC<Props> = ({
  doCreate,
  doCreateFromText,
  importFromCode,
  settings,
  setSettings,
  designSystems,
  onAddNewDesignSystem,
  onManageDesignSystems,
}) => {
  const { t } = useI18n();
  const startModes = [
    {
      label: t("uploadTab"),
      description: t("startModeUploadDescription"),
      toneClass:
        "from-amber-100 via-white to-stone-100 dark:from-amber-500/10 dark:via-zinc-950 dark:to-zinc-900",
    },
    {
      label: t("urlTab"),
      description: t("startModeUrlDescription"),
      toneClass:
        "from-cyan-100 via-white to-stone-100 dark:from-cyan-500/10 dark:via-zinc-950 dark:to-zinc-900",
    },
    {
      label: t("textTab"),
      description: t("startModeTextDescription"),
      toneClass:
        "from-rose-100 via-white to-stone-100 dark:from-rose-500/10 dark:via-zinc-950 dark:to-zinc-900",
    },
    {
      label: t("importTab"),
      description: t("startModeImportDescription"),
      toneClass:
        "from-emerald-100 via-white to-stone-100 dark:from-emerald-500/10 dark:via-zinc-950 dark:to-zinc-900",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="landing-orb landing-orb-left" />
      <div className="landing-orb landing-orb-right" />

      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-24 lg:pt-12">
        <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
          <div className="max-w-3xl pt-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-stone-300/70 bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-stone-700 shadow-sm backdrop-blur dark:border-stone-700 dark:bg-zinc-900/70 dark:text-stone-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {t("imageToCodeWebsite")}
            </div>

            <h1 className="mt-6 max-w-4xl font-['Space_Grotesk'] text-5xl font-bold leading-[0.92] tracking-[-0.05em] text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
              {t("turnScreenshotsIntoCode")}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-600 dark:text-zinc-300 sm:text-lg">
              {t("heroDescription")}
            </p>

            <div className="mt-7 grid gap-3 text-sm text-stone-700 dark:text-zinc-300 sm:grid-cols-3">
              <SignalPill label={t("multiImageInput")} />
              <SignalPill label={t("livePreview")} />
              <SignalPill label={t("editableOutput")} />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#generator"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
              >
                {t("startConverting")}
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white/75 px-6 py-3 text-sm font-semibold text-stone-800 transition-colors hover:bg-stone-100 dark:border-zinc-700 dark:bg-zinc-900/75 dark:text-white dark:hover:bg-zinc-800"
              >
                {t("seeHowItWorks")}
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <Metric
                label={t("supportedInputs")}
                value={t("supportedInputsValue")}
              />
              <Metric
                label={t("buildTargets")}
                value={t("buildTargetsValue")}
              />
              <Metric label={t("bestFor")} value={t("bestForValue")} />
            </div>
          </div>

          <div className="relative pt-2">
            <div className="absolute inset-x-8 inset-y-10 -z-10 rounded-[2rem] bg-gradient-to-br from-amber-200/35 via-white to-cyan-200/40 blur-3xl dark:from-amber-500/10 dark:via-zinc-950 dark:to-cyan-500/10" />
            <div className="studio-panel p-4">
              <div className="rounded-[1.7rem] border border-slate-800/90 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.18),transparent_32%),linear-gradient(180deg,#0f172a,#111827)] p-5 text-stone-50 dark:border-zinc-800">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-stone-400">
                      {t("coreProduct")}
                    </div>
                    <div className="mt-2 max-w-sm font-['Space_Grotesk'] text-2xl font-semibold tracking-[-0.04em] text-white">
                      {t("imageToCodeReady")}
                    </div>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-cyan-200">
                    {t("liveAi")}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 xl:grid-cols-[1.14fr_0.86fr]">
                  <div className="rounded-[1.55rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      <div className="ml-3 h-6 flex-1 rounded-full border border-white/10 bg-black/20" />
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-[1.04fr_0.96fr]">
                      <div className="rounded-[1.25rem] bg-white p-3 text-slate-900 shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                          {t("beforeReference")}
                        </div>
                        <div className="mt-3 rounded-xl border border-slate-200 bg-[linear-gradient(135deg,#f8fafc,#e2e8f0)] p-3">
                          <div className="h-20 rounded-lg bg-[linear-gradient(135deg,#1e293b,#475569)]" />
                          <div className="mt-3 h-2 w-24 rounded-full bg-slate-300" />
                          <div className="mt-2 h-2 w-32 rounded-full bg-slate-200" />
                        </div>
                      </div>
                      <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-3">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-200">
                          {t("afterOutput")}
                        </div>
                        <div className="mt-3 rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-3">
                          <div className="h-16 rounded-lg bg-[linear-gradient(135deg,rgba(16,185,129,0.95),rgba(6,182,212,0.8))]" />
                          <div className="mt-3 h-2 w-20 rounded-full bg-emerald-100/60" />
                          <div className="mt-2 h-2 w-28 rounded-full bg-white/20" />
                        </div>
                        <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3">
                          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-stone-400">
                            <span>{t("preview")}</span>
                            <span>{t("code")}</span>
                          </div>
                          <div className="mt-3 h-14 rounded-lg bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <PreviewRow
                      step="01"
                      title={t("uploadScreenshot")}
                      description={t("uploadScreenshotDescription")}
                    />
                    <PreviewRow
                      step="02"
                      title={t("chooseOutputStack")}
                      description={t("chooseOutputStackDescription")}
                    />
                    <PreviewRow
                      step="03"
                      title={t("refineUntilItMatches")}
                      description={t("refineUntilItMatchesDescription")}
                    />
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <MiniStatus
                    title={t("multiImageInput")}
                    value={t("supportedInputsValue")}
                  />
                  <MiniStatus
                    title={t("buildTargets")}
                    value={t("buildTargetsValue")}
                  />
                  <MiniStatus
                    title={t("bestFor")}
                    value={t("bestForValue")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-10">
          <div className="studio-panel rounded-[2rem] px-5 py-5 sm:px-6 sm:py-6">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="editorial-kicker">
                  {t("waysToStart")}
                </p>
                <h2 className="mt-2 font-['Space_Grotesk'] text-3xl font-semibold tracking-[-0.04em] text-stone-950 dark:text-white sm:text-4xl">
                  {t("waysToStartTitle")}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600 dark:text-zinc-300 sm:text-base">
                  {t("waysToStartDescription")}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {startModes.map((mode) => (
                  <StartModeCard
                    key={mode.label}
                    label={mode.label}
                    description={mode.description}
                    toneClass={mode.toneClass}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="studio-panel rounded-[1.8rem] px-5 py-5">
            <div className="editorial-kicker text-center">
              {t("socialProofTitle")}
            </div>
            <div className="mt-5 grid grid-cols-2 items-center gap-6 opacity-75 sm:grid-cols-3 lg:grid-cols-6">
              <LogoItem src="/logos/amazon.png" alt="Amazon" />
              <LogoItem src="/logos/microsoft.png" alt="Microsoft" />
              <LogoItem src="/logos/bytedance.png" alt="ByteDance" />
              <LogoItem src="/logos/stanford.png" alt="Stanford" />
              <LogoItem src="/logos/mit.png" alt="MIT" />
              <LogoItem src="/logos/baidu.png" alt="Baidu" />
            </div>
          </div>
        </section>

        <section id="generator" className="mt-14 scroll-mt-28 lg:mt-16">
          <div className="studio-panel mx-auto max-w-6xl rounded-[2.2rem] p-4 sm:p-6 lg:p-8">
            <div className="mb-6 grid gap-5 border-b border-stone-200/80 pb-6 dark:border-zinc-800 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <p className="editorial-kicker">
                  {t("coreProduct")}
                </p>
                <h2 className="mt-2 font-['Space_Grotesk'] text-3xl font-semibold tracking-[-0.04em] text-stone-950 dark:text-white sm:text-4xl">
                  {t("imageToCodeReady")}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600 dark:text-zinc-300">
                  {t("coreProductDescription")}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 dark:text-zinc-400 sm:grid-cols-2">
                <span className="studio-surface px-3 py-2 text-center">
                  {t("multiImageInput")}
                </span>
                <span className="studio-surface px-3 py-2 text-center">
                  {t("livePreview")}
                </span>
                <span className="studio-surface px-3 py-2 text-center">
                  {t("editableOutput")}
                </span>
                <span className="studio-surface px-3 py-2 text-center">
                  {t("exportReady")}
                </span>
              </div>
            </div>

            <UnifiedInputPane
              doCreate={doCreate}
              doCreateFromText={doCreateFromText}
              importFromCode={importFromCode}
              settings={settings}
              setSettings={setSettings}
              designSystems={designSystems}
              onAddNewDesignSystem={onAddNewDesignSystem}
              onManageDesignSystems={onManageDesignSystems}
            />
          </div>
        </section>

        <section
          id="how-it-works"
          className="mt-14 scroll-mt-28 lg:mt-16"
        >
          <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="space-y-4">
              <div className="studio-panel rounded-[1.95rem] p-6 lg:p-7">
                <p className="editorial-kicker">
                  {t("builtForRealWork")}
                </p>
                <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-semibold tracking-[-0.04em] text-stone-950 dark:text-white sm:text-4xl">
                  {t("workflowTitle")}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600 dark:text-zinc-300 sm:text-base">
                  {t("workflowDescription")}
                </p>
              </div>

              <FeatureCard
                title={t("fastFirstDraft")}
                description={t("fastFirstDraftDescription")}
              />
              <FeatureCard
                title={t("builtForIteration")}
                description={t("builtForIterationDescription")}
              />
              <FeatureCard
                title={t("deploymentFriendly")}
                description={t("deploymentFriendlyDescription")}
              />

              {IS_RUNNING_ON_CLOUD ? (
                <AccountPanel enabled={IS_RUNNING_ON_CLOUD} />
              ) : (
                <LocalWorkspaceCard
                  title={t("localWorkspaceTitle")}
                  description={t("localWorkspaceDescription")}
                />
              )}
            </div>

            <div className="studio-panel rounded-[1.95rem] p-5 sm:p-6 lg:p-8">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="editorial-kicker">
                    {t("workflowMapEyebrow")}
                  </p>
                  <h3 className="mt-2 font-['Space_Grotesk'] text-2xl font-semibold tracking-[-0.04em] text-stone-950 dark:text-white sm:text-3xl">
                    {t("workflowMapTitle")}
                  </h3>
                </div>
                <p className="max-w-md text-sm leading-6 text-stone-600 dark:text-zinc-300">
                  {t("workflowMapDescription")}
                </p>
              </div>

              <div className="mt-6 grid gap-4">
                <WorkflowStageCard
                  step="01"
                  title={t("uploadScreenshot")}
                  description={t("uploadScreenshotDescription")}
                />
                <WorkflowStageCard
                  step="02"
                  title={t("chooseOutputStack")}
                  description={t("chooseOutputStackDescription")}
                />
                <WorkflowStageCard
                  step="03"
                  title={t("refineUntilItMatches")}
                  description={t("refineUntilItMatchesDescription")}
                />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <MaturityPoint
                  title={t("multiImageInput")}
                  description={t("startModeUploadDescription")}
                />
                <MaturityPoint
                  title={t("livePreview")}
                  description={t("builtForIterationDescription")}
                />
                <MaturityPoint
                  title={t("editableOutput")}
                  description={t("deploymentFriendlyDescription")}
                />
              </div>
            </div>
          </div>
        </section>

        <section id="cases" className="mt-14 scroll-mt-28 lg:mt-20">
          <div className="flex flex-col gap-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500 dark:text-zinc-400">
              {t("beforeAfter")}
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-stone-950 dark:text-white sm:text-4xl">
              {t("beforeAfterTitle")}
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-6 text-stone-600 dark:text-zinc-300 sm:text-base">
              {t("beforeAfterDescription")}
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <ShowcaseCard
              title={t("showcaseLandingPage")}
              sourceLabel={t("beforeReference")}
              resultLabel={t("afterOutput")}
              sourceDescription={t("showcaseLandingPageSource")}
              resultDescription={t("showcaseLandingPageResult")}
            />
            <ShowcaseCard
              title={t("showcaseDashboard")}
              sourceLabel={t("beforeReference")}
              resultLabel={t("afterOutput")}
              sourceDescription={t("showcaseDashboardSource")}
              resultDescription={t("showcaseDashboardResult")}
            />
            <ShowcaseCard
              title={t("showcaseMobileApp")}
              sourceLabel={t("beforeReference")}
              resultLabel={t("afterOutput")}
              sourceDescription={t("showcaseMobileAppSource")}
              resultDescription={t("showcaseMobileAppResult")}
            />
          </div>
        </section>

        <section className="mt-14 lg:mt-20">
          <div className="flex flex-col gap-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500 dark:text-zinc-400">
              {t("builtForRealWork")}
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-stone-950 dark:text-white sm:text-4xl">
              {t("whoThisIsFor")}
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-6 text-stone-600 dark:text-zinc-300 sm:text-base">
              {t("whoThisIsForDescription")}
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <UseCaseCard
              eyebrow={t("useCaseFounders")}
              title={t("useCaseFoundersTitle")}
              description={t("useCaseFoundersDescription")}
            />
            <UseCaseCard
              eyebrow={t("useCaseDesigners")}
              title={t("useCaseDesignersTitle")}
              description={t("useCaseDesignersDescription")}
            />
            <UseCaseCard
              eyebrow={t("useCaseAgencies")}
              title={t("useCaseAgenciesTitle")}
              description={t("useCaseAgenciesDescription")}
            />
          </div>
        </section>

        <section className="mt-14 lg:mt-20">
          <div className="flex flex-col gap-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500 dark:text-zinc-400">
              {t("testimonials")}
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-stone-950 dark:text-white sm:text-4xl">
              {t("testimonialsTitle")}
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-6 text-stone-600 dark:text-zinc-300 sm:text-base">
              {t("testimonialsDescription")}
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <TestimonialCard
              quote={t("testimonial1Quote")}
              author={t("testimonial1Author")}
              role={t("testimonial1Role")}
            />
            <TestimonialCard
              quote={t("testimonial2Quote")}
              author={t("testimonial2Author")}
              role={t("testimonial2Role")}
            />
            <TestimonialCard
              quote={t("testimonial3Quote")}
              author={t("testimonial3Author")}
              role={t("testimonial3Role")}
            />
          </div>
        </section>

        <section className="mt-14 lg:mt-20">
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-stone-200/80 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/85 lg:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500 dark:text-zinc-400">
                {t("whatYouGet")}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-stone-950 dark:text-white">
                {t("whatYouGetTitle")}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600 dark:text-zinc-300 sm:text-base">
                {t("whatYouGetDescription")}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ResultChip label={t("resultResponsiveLayouts")} />
                <ResultChip label={t("resultComponentStructure")} />
                <ResultChip label={t("resultEditableCode")} />
                <ResultChip label={t("resultFastIteration")} />
                <ResultChip label={t("resultExportableFiles")} />
                <ResultChip label={t("resultStackFlexibility")} />
              </div>
            </div>

            <div className="rounded-[2rem] border border-stone-200/80 bg-stone-950 p-6 text-white shadow-sm dark:border-zinc-800 lg:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
                {t("whyPeopleTrustThis")}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
                {t("whyPeopleTrustThisTitle")}
              </h3>
              <div className="mt-6 space-y-4">
                <TrustRow
                  title={t("trustTransparentInputs")}
                  description={t("trustTransparentInputsDescription")}
                />
                <TrustRow
                  title={t("trustMultipleWaysToStart")}
                  description={t("trustMultipleWaysToStartDescription")}
                />
                <TrustRow
                  title={t("trustKeepEditing")}
                  description={t("trustKeepEditingDescription")}
                />
                <TrustRow
                  title={t("trustShipFaster")}
                  description={t("trustShipFasterDescription")}
                />
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="mt-14 scroll-mt-28 lg:mt-20">
          <div className="flex flex-col gap-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500 dark:text-zinc-400">
              {t("pricing")}
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-stone-950 dark:text-white sm:text-4xl">
              {t("pricingTitle")}
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-6 text-stone-600 dark:text-zinc-300 sm:text-base">
              {t("pricingDescription")}
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <PricingCard
              plan={t("pricingFreePlan")}
              price={t("pricingFreePrice")}
              description={t("pricingFreeDescription")}
              features={[
                t("pricingFreeFeature1"),
                t("pricingFreeFeature2"),
                t("pricingFreeFeature3"),
              ]}
              cta={t("pricingFreeCta")}
              href="#generator"
            />
            <PricingCard
              featured
              plan={t("pricingProPlan")}
              price={t("pricingProPrice")}
              description={t("pricingProDescription")}
              features={[
                t("pricingProFeature1"),
                t("pricingProFeature2"),
                t("pricingProFeature3"),
              ]}
              cta={t("pricingProCta")}
              href="#generator"
            />
            <PricingCard
              plan={t("pricingTeamPlan")}
              price={t("pricingTeamPrice")}
              description={t("pricingTeamDescription")}
              features={[
                t("pricingTeamFeature1"),
                t("pricingTeamFeature2"),
                t("pricingTeamFeature3"),
              ]}
              cta={t("pricingTeamCta")}
              href="#generator"
            />
          </div>
        </section>

        <section id="faq" className="mt-14 scroll-mt-28 lg:mt-20">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500 dark:text-zinc-400">
                {t("faq")}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-stone-950 dark:text-white sm:text-4xl">
                {t("faqTitle")}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600 dark:text-zinc-300 sm:text-base">
                {t("faqDescription")}
              </p>
            </div>

            <div className="rounded-[2rem] border border-stone-200/80 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/85 sm:p-6">
              <Accordion type="single" collapsible className="w-full">
                <FaqItem
                  value="item-1"
                  question={t("faq1Question")}
                  answer={t("faq1Answer")}
                />
                <FaqItem
                  value="item-2"
                  question={t("faq2Question")}
                  answer={t("faq2Answer")}
                />
                <FaqItem
                  value="item-3"
                  question={t("faq3Question")}
                  answer={t("faq3Answer")}
                />
                <FaqItem
                  value="item-4"
                  question={t("faq4Question")}
                  answer={t("faq4Answer")}
                />
              </Accordion>
            </div>
          </div>
        </section>

        <section className="mt-14 lg:mt-20">
          <div className="rounded-[2.2rem] border border-stone-200/80 bg-gradient-to-br from-stone-950 via-stone-900 to-emerald-950 p-8 text-white shadow-[0_24px_80px_rgba(28,25,23,0.2)] lg:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                  {t("finalCtaEyebrow")}
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                  {t("finalCtaTitle")}
                </h2>
                <p className="mt-3 text-sm leading-6 text-stone-300 sm:text-base">
                  {t("finalCtaDescription")}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="#generator"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-stone-950 transition-transform hover:-translate-y-0.5"
                >
                  {t("startConverting")}
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  {t("seeHowItWorks")}
                </a>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-10 border-t border-stone-200/80 pt-8 dark:border-zinc-800">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-md">
              <div className="text-sm font-semibold tracking-[0.18em] text-stone-700 dark:text-zinc-300">
                IMAGETOCODE
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-zinc-400">
                {t("footerDescription")}
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              <FooterColumn
                title={t("footerProduct")}
                links={[
                  { href: "#generator", label: t("navProduct") },
                  { href: "#cases", label: t("navExamples") },
                  { href: "#pricing", label: t("navPricing") },
                ]}
              />
              <FooterColumn
                title={t("footerResources")}
                links={[
                  { href: "#faq", label: t("navFaq") },
                  { href: "#how-it-works", label: t("seeHowItWorks") },
                  { href: "#generator", label: t("launchGenerator") },
                ]}
              />
              <FooterColumn
                title={t("footerCompany")}
                links={[
                  { href: "#generator", label: t("startConverting") },
                  { href: "#pricing", label: t("pricing") },
                  { href: "#cases", label: t("beforeAfter") },
                ]}
              />
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
};

function StartModeCard({
  label,
  description,
  toneClass,
}: {
  label: string;
  description: string;
  toneClass: string;
}) {
  return (
    <div
      className={`rounded-[1.5rem] border border-stone-200/80 bg-gradient-to-br p-4 shadow-sm dark:border-zinc-800 ${toneClass}`}
    >
      <div className="font-['Space_Grotesk'] text-lg font-semibold tracking-[-0.03em] text-stone-950 dark:text-white">
        {label}
      </div>
      <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-zinc-300">
        {description}
      </p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="studio-panel rounded-[1.5rem] px-4 py-4">
      <div className="editorial-kicker">
        {label}
      </div>
      <div className="mt-2 font-['Space_Grotesk'] text-sm font-semibold text-stone-900 dark:text-white">
        {value}
      </div>
    </div>
  );
}

function SignalPill({ label }: { label: string }) {
  return (
    <div className="studio-surface flex items-center gap-2 px-3 py-2">
      <span className="h-2 w-2 rounded-full bg-cyan-500" />
      <span>{label}</span>
    </div>
  );
}

function PreviewRow({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-300">
        {step}
      </div>
      <div className="mt-2 text-base font-semibold text-white">{title}</div>
      <p className="mt-1 text-sm leading-6 text-stone-300">{description}</p>
    </div>
  );
}

function WorkflowStageCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="grid gap-4 rounded-[1.6rem] border border-stone-200/80 bg-stone-50/85 p-4 dark:border-zinc-800 dark:bg-zinc-900/70 sm:grid-cols-[auto_1fr] sm:items-start sm:p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-950 text-sm font-semibold text-white dark:bg-white dark:text-stone-950">
        {step}
      </div>
      <div>
        <div className="font-['Space_Grotesk'] text-lg font-semibold tracking-[-0.03em] text-stone-950 dark:text-white">
          {title}
        </div>
        <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-zinc-300">
          {description}
        </p>
      </div>
    </div>
  );
}

function MiniStatus({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="text-[10px] uppercase tracking-[0.24em] text-stone-400">
        {title}
      </div>
      <div className="mt-2 font-['Space_Grotesk'] text-sm font-semibold text-white">
        {value}
      </div>
    </div>
  );
}

function MaturityPoint({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.35rem] border border-stone-200/80 bg-white/80 p-4 dark:border-zinc-800 dark:bg-zinc-950/70">
      <div className="text-sm font-semibold text-stone-950 dark:text-white">
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-zinc-300">
        {description}
      </p>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="studio-panel rounded-[1.75rem] p-6">
      <h3 className="font-['Space_Grotesk'] text-lg font-semibold tracking-[-0.03em] text-stone-950 dark:text-white">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-zinc-300">
        {description}
      </p>
    </div>
  );
}

function LocalWorkspaceCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const { t } = useI18n();

  return (
    <div className="studio-panel rounded-[1.75rem] p-6">
      <h3 className="font-['Space_Grotesk'] text-lg font-semibold tracking-[-0.03em] text-stone-950 dark:text-white">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-zinc-300">
        {description}
      </p>
      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <ResultChip label={t("multiImageInput")} />
        <ResultChip label={t("editableOutput")} />
        <ResultChip label={t("resultStackFlexibility")} />
      </div>
    </div>
  );
}

function UseCaseCard({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="studio-panel rounded-[1.75rem] p-6">
      <p className="editorial-kicker">
        {eyebrow}
      </p>
      <h3 className="mt-3 font-['Space_Grotesk'] text-xl font-semibold tracking-[-0.03em] text-stone-950 dark:text-white">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-zinc-300">
        {description}
      </p>
    </div>
  );
}

function ShowcaseCard({
  title,
  sourceLabel,
  resultLabel,
  sourceDescription,
  resultDescription,
}: {
  title: string;
  sourceLabel: string;
  resultLabel: string;
  sourceDescription: string;
  resultDescription: string;
}) {
  return (
    <div className="studio-panel rounded-[1.9rem] p-5">
      <h3 className="font-['Space_Grotesk'] text-xl font-semibold tracking-[-0.03em] text-stone-950 dark:text-white">
        {title}
      </h3>
      <div className="mt-5 grid gap-3">
        <div className="studio-surface border-dashed p-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500 dark:text-zinc-500">
            {sourceLabel}
          </div>
          <div className="mt-3 h-28 rounded-xl bg-[linear-gradient(135deg,#f5f5f4,#e7e5e4)] dark:bg-[linear-gradient(135deg,#27272a,#18181b)]" />
          <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-zinc-300">
            {sourceDescription}
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-400">
            {resultLabel}
          </div>
          <div className="mt-3 h-28 rounded-xl bg-[linear-gradient(135deg,#d1fae5,#a7f3d0)] dark:bg-[linear-gradient(135deg,#14532d,#052e16)]" />
          <p className="mt-2 text-sm leading-6 text-stone-700 dark:text-zinc-200">
            {resultDescription}
          </p>
        </div>
      </div>
    </div>
  );
}

function ResultChip({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
      {label}
    </div>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) {
  return (
    <div className="studio-panel rounded-[1.9rem] p-6">
      <div className="text-2xl leading-none text-amber-500">"</div>
      <p className="mt-3 text-sm leading-7 text-stone-700 dark:text-zinc-200">
        {quote}
      </p>
      <div className="mt-5">
        <div className="text-sm font-semibold text-stone-950 dark:text-white">
          {author}
        </div>
        <div className="mt-1 text-xs uppercase tracking-[0.18em] text-stone-500 dark:text-zinc-500">
          {role}
        </div>
      </div>
    </div>
  );
}

function TrustRow({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-sm font-semibold text-white">{title}</div>
      <p className="mt-1 text-sm leading-6 text-stone-300">{description}</p>
    </div>
  );
}

function PricingCard({
  plan,
  price,
  description,
  features,
  cta,
  href,
  featured = false,
}: {
  plan: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-[1.9rem] border p-6 shadow-sm backdrop-blur ${
        featured
          ? "border-stone-900 bg-stone-950 text-white dark:border-white dark:bg-white dark:text-stone-950"
          : "border-stone-200/80 bg-white/82 dark:border-zinc-800 dark:bg-zinc-950/82"
      }`}
    >
      <div className="editorial-kicker">
        {plan}
      </div>
      <div
        className={`mt-4 font-['Space_Grotesk'] text-4xl font-semibold tracking-[-0.04em] ${
          featured ? "text-white dark:text-stone-950" : "text-stone-950 dark:text-white"
        }`}
      >
        {price}
      </div>
      <p
        className={`mt-3 text-sm leading-6 ${
          featured ? "text-stone-300 dark:text-stone-700" : "text-stone-600 dark:text-zinc-300"
        }`}
      >
        {description}
      </p>
      <div className="mt-5 space-y-2">
        {features.map((feature) => (
          <div
            key={feature}
            className={`rounded-xl px-3 py-2 text-sm ${
              featured
                ? "bg-white/10 text-white dark:bg-stone-900/10 dark:text-stone-950"
                : "bg-stone-100 text-stone-700 dark:bg-zinc-900 dark:text-zinc-300"
            }`}
          >
            {feature}
          </div>
        ))}
      </div>
      <a
        href={href}
        className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
          featured
            ? "bg-white text-stone-950 dark:bg-stone-950 dark:text-white"
            : "bg-stone-950 text-white dark:bg-white dark:text-stone-950"
        }`}
      >
        {cta}
      </a>
    </div>
  );
}

function FaqItem({
  value,
  question,
  answer,
}: {
  value: string;
  question: string;
  answer: string;
}) {
  return (
    <AccordionItem value={value} className="border-stone-200 dark:border-zinc-800">
      <AccordionTrigger className="text-left text-base font-semibold text-stone-950 hover:no-underline dark:text-white">
        {question}
      </AccordionTrigger>
      <AccordionContent className="text-sm leading-6 text-stone-600 dark:text-zinc-300">
        {answer}
      </AccordionContent>
    </AccordionItem>
  );
}

function LogoItem({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex items-center justify-center rounded-2xl bg-stone-50 px-4 py-4 dark:bg-zinc-900">
      <img src={src} alt={alt} className="h-8 w-auto object-contain" />
    </div>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500 dark:text-zinc-500">
        {title}
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {links.map((link) => (
          <a
            key={`${title}-${link.label}`}
            href={link.href}
            className="text-sm text-stone-600 hover:text-stone-950 dark:text-zinc-400 dark:hover:text-white"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export default StartPane;
