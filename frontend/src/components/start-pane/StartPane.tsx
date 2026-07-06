import React, { Suspense, lazy } from "react";
import { DesignSystem, Settings } from "../../types";
import { Stack } from "../../lib/stacks";
import AccountPanel from "../account/AccountPanel";
import { IS_RUNNING_ON_CLOUD } from "../../config";
import {
  FaDiscord,
  FaGithub,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import {
  SiAndroid,
  SiBootstrap,
  SiFlutter,
  SiHtml5,
  SiNextdotjs,
  SiNuxtdotjs,
  SiReact,
  SiSwift,
  SiTailwindcss,
  SiVuedotjs,
} from "react-icons/si";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  LuArrowRight,
  LuChevronRight,
  LuCode2,
  LuComponent,
  LuFigma,
  LuFileText,
  LuGem,
  LuGlobe2,
  LuImage,
  LuLayers,
  LuLayoutGrid,
  LuMonitorSmartphone,
  LuPenTool,
  LuPlay,
  LuScan,
  LuType,
  LuVideo,
  LuWind,
} from "react-icons/lu";

const UnifiedInputPane = lazy(() => import("../unified-input/UnifiedInputPane"));

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

const inputItems = [
  {
    title: "Screenshot",
    subtitle: "PNG, JPG, WEBP",
    accent: "bg-sky-500",
    icon: LuImage,
  },
  {
    title: "Figma File",
    subtitle: ".fig, .figma",
    accent: "bg-pink-500",
    icon: LuFigma,
  },
  {
    title: "Website URL",
    subtitle: "Any public URL",
    accent: "bg-cyan-500",
    icon: LuGlobe2,
  },
  {
    title: "Mockup",
    subtitle: "PNG, JPG, PSD",
    accent: "bg-emerald-500",
    icon: LuLayers,
  },
  {
    title: "Wireframe",
    subtitle: "PNG, JPG, SVG",
    accent: "bg-indigo-500",
    icon: LuPenTool,
  },
  {
    title: "Sketch File",
    subtitle: ".sketch",
    accent: "bg-amber-500",
    icon: LuGem,
  },
  {
    title: "PDF Document",
    subtitle: ".pdf",
    accent: "bg-rose-500",
    icon: LuFileText,
  },
  {
    title: "Video Recording",
    subtitle: "MP4, MOV, WEBM",
    accent: "bg-violet-500",
    icon: LuVideo,
  },
] as const;

const pipelineItems = [
  {
    title: "Vision Parsing",
    description: "Understanding the visual content",
    icon: LuScan,
  },
  {
    title: "Layout Detection",
    description: "Detecting structure and spacing",
    icon: LuLayoutGrid,
  },
  {
    title: "Component Recognition",
    description: "Identifying UI components",
    icon: LuComponent,
  },
  {
    title: "Typography Analysis",
    description: "Extracting fonts, sizes and styles",
    icon: LuType,
  },
  {
    title: "Responsive Layout",
    description: "Building responsive grid system",
    icon: LuMonitorSmartphone,
  },
  {
    title: "Semantic HTML",
    description: "Generating clean HTML structure",
    icon: LuCode2,
  },
  {
    title: "Tailwind Optimization",
    description: "Utility-first CSS generation",
    icon: LuWind,
  },
  {
    title: "Code Generation",
    description: "Production-ready code output",
    icon: LuCode2,
  },
] as const;

const stackItems = [
  { label: "React", icon: SiReact },
  { label: "Next.js", icon: SiNextdotjs },
  { label: "Vue", icon: SiVuedotjs },
  { label: "Nuxt", icon: SiNuxtdotjs },
  { label: "Tailwind CSS", icon: SiTailwindcss },
  { label: "HTML", icon: SiHtml5 },
  { label: "Bootstrap", icon: SiBootstrap },
  { label: "Flutter", icon: SiFlutter },
  { label: "SwiftUI", icon: SiSwift },
  { label: "Jetpack Compose", icon: SiAndroid },
] as const;

const workflowItems = [
  "Upload",
  "Analyze",
  "Understand",
  "Generate",
  "Preview",
  "Edit",
  "Deploy",
] as const;

const useCaseItems = [
  {
    title: "Clone Landing Page",
    description:
      "Convert any landing page into clean code you can keep editing and shipping.",
    image: "/showcases/landing-page-output.png",
  },
  {
    title: "Convert Figma Design",
    description:
      "Turn Figma design direction into production-ready code with less rebuild work.",
    image: "/showcases/landing-page-sketch.png",
  },
  {
    title: "Build Dashboard",
    description:
      "Recreate complex dashboards and internal tooling layouts in minutes.",
    image: "/showcases/dashboard-output.png",
  },
  {
    title: "Mobile UI to Code",
    description:
      "Convert mobile designs to responsive code that stays easy to refine.",
    image: "/showcases/mobile-app-output.png",
  },
  {
    title: "Marketing Website",
    description:
      "Build marketing sites and launch pages faster from visual references.",
    image: "/showcases/landing-page-output.png",
  },
  {
    title: "Email Templates",
    description:
      "Convert designs into responsive email layouts with a better starting point.",
    image: "/showcases/landing-page-sketch.png",
  },
  {
    title: "Admin Systems",
    description:
      "Generate full admin interfaces with tables, filters, sidebars, and detail views.",
    image: "/showcases/dashboard-output.png",
  },
] as const;

const pricingPlans = [
  {
    name: "Free",
    subtitle: "Try the workflow",
    price: "$0",
    description:
      "Best for validating one real screenshot, testing output quality, and understanding whether the workflow fits your team.",
    features: [
      "A few free generations",
      "Preview and editable output",
      "Core screenshot, URL, and text flow",
    ],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Pro",
    subtitle: "For regular use",
    price: "$29/mo",
    description:
      "A better fit for solo builders and designers who want more iterations, more volume, and faster daily workflow.",
    features: [
      "More monthly generations",
      "Better support for repeated iteration",
      "A stronger fit for shipping side projects and client drafts",
    ],
    cta: "Choose Pro",
    featured: true,
  },
  {
    name: "Team",
    subtitle: "For shared rollout",
    price: "Custom",
    description:
      "Designed for agencies and product teams that need shared usage, higher limits, and a cleaner path into team workflows.",
    features: [
      "Higher-volume collaboration",
      "Better fit for internal product teams",
      "Useful for agencies, redesigns, and client delivery",
    ],
    cta: "Talk to sales",
    featured: false,
  },
] as const;

const footerProductLinks = [
  { href: "#pipeline", label: "Features" },
  { href: "#timeline", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "https://github.com/abi/screenshot-to-code/blob/main/README.md", label: "Changelog" },
] as const;

const footerResourceLinks = [
  { href: "https://github.com/abi/screenshot-to-code/wiki/Screen-Recording-to-Code", label: "Documentation" },
  {
    href: "https://github.com/abi/screenshot-to-code/blob/main/Troubleshooting.md",
    label: "Guides",
  },
  { href: "https://github.com/abi/screenshot-to-code", label: "Blog" },
  { href: "#use-cases", label: "Examples" },
] as const;

const footerCompanyLinks = [
  { href: "#", label: "About Us" },
  { href: "#", label: "Careers" },
  { href: "#", label: "Contact" },
  { href: "/legal/terms-of-service.html", label: "Privacy Policy" },
] as const;

const footerCommunityLinks = [
  { href: "https://github.com/abi/screenshot-to-code", label: "GitHub" },
  { href: "#", label: "Discord" },
  { href: "https://twitter.com/_abi_", label: "Twitter" },
  { href: "#", label: "YouTube" },
] as const;

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
  return (
    <div className="relative overflow-hidden">
      <div className="landing-orb landing-orb-left" />
      <div className="landing-orb landing-orb-right" />
      <div className="landing-grid" />

      <section className="mx-auto flex w-full max-w-7xl flex-col px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-20 lg:pt-12">
        <section className="relative px-2 pt-4 sm:px-0 lg:pt-6">
          <div className="mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50/90 px-4 py-1.5 text-[11px] font-semibold tracking-[0.02em] text-sky-700 shadow-sm dark:border-sky-900/40 dark:bg-sky-950/30 dark:text-sky-200">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              AI-Powered Visual Development Platform
            </div>

            <h1 className="mx-auto mt-8 max-w-4xl font-['Space_Grotesk'] text-5xl font-bold leading-[0.92] tracking-[-0.07em] text-stone-950 dark:text-white sm:text-6xl lg:text-[5.8rem]">
              Turn Anything
              <br />
              Into Frontend Code.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-stone-600 dark:text-zinc-300 sm:text-lg">
              From screenshots, Figma, URLs, videos and mockups
              <br className="hidden sm:block" />
              to production-ready code in seconds.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#generator"
                className="inline-flex items-center justify-center rounded-2xl bg-stone-950 px-8 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(17,17,17,0.16)] transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-stone-950"
              >
                Start Building
                <LuArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a
                href="#before-after"
                className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-8 py-4 text-sm font-semibold text-stone-800 shadow-sm transition-colors hover:bg-stone-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
              >
                <LuPlay className="mr-2 h-4 w-4" />
                Watch Demo
              </a>
            </div>
          </div>

          <div className="mt-10 rounded-[2rem] border border-stone-200/80 bg-white/92 p-4 shadow-[0_30px_90px_rgba(17,17,17,0.08)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90 sm:p-5 lg:p-6">
            <div className="grid gap-4 xl:grid-cols-[0.86fr_0.92fr_1.52fr_1.12fr]">
              <ReferencePanel
                title="1. Upload"
                children={
                  <div className="space-y-3">
                    {inputItems.slice(0, 7).map((item, index) => (
                      <ReferenceInputRow
                        key={item.title}
                        title={item.title}
                        subtitle={item.subtitle}
                        accent={item.accent}
                        active={index === 0}
                      />
                    ))}
                  </div>
                }
              />

              <ReferencePanel
                title="2. Vision Engine"
                children={
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <ReferenceStatusRow label="Layout Detection" status="Completed" />
                      <ReferenceStatusRow label="Component Recognition" status="Completed" />
                      <ReferenceStatusRow label="Typography Analysis" status="Completed" />
                      <ReferenceStatusRow label="Color Extraction" status="Completed" />
                      <ReferenceStatusRow
                        label="Asset Extraction"
                        status="Processing..."
                        active
                      />
                    </div>
                    <div className="rounded-[1.2rem] bg-stone-50 px-4 py-4 dark:bg-zinc-900">
                      <div className="text-xs text-stone-500 dark:text-zinc-400">
                        AI is understanding your design...
                      </div>
                      <div className="mt-4 h-2.5 rounded-full bg-stone-200 dark:bg-zinc-800">
                        <div className="h-2.5 w-[80%] rounded-full bg-[linear-gradient(90deg,#2563eb,#3b82f6)]" />
                      </div>
                      <div className="mt-2 text-right text-xs font-medium text-stone-500 dark:text-zinc-400">
                        80%
                      </div>
                    </div>
                  </div>
                }
              />

              <ReferencePanel
                title="3. Live Preview"
                children={
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-zinc-300">
                      <span className="h-2 w-2 rounded-full bg-sky-500" />
                      StartupLanding
                    </div>
                    <div className="overflow-hidden rounded-[1.3rem] border border-stone-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                      <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3 text-[11px] text-stone-500 dark:border-zinc-800 dark:text-zinc-400">
                        <span>Product</span>
                        <span>Features</span>
                        <span>Pricing</span>
                        <span>About</span>
                        <span className="rounded-lg bg-stone-950 px-3 py-1 font-semibold text-white dark:bg-white dark:text-stone-950">
                          Get Started
                        </span>
                      </div>
                      <div className="grid gap-4 p-5 lg:grid-cols-[1.12fr_0.88fr]">
                        <div>
                          <div className="max-w-[14rem] text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-stone-950 dark:text-white">
                            Build faster with better code
                          </div>
                          <p className="mt-3 text-sm leading-6 text-stone-500 dark:text-zinc-400">
                            VisualToCode helps you convert any design into
                            clean, production-ready code in seconds.
                          </p>
                          <div className="mt-5 flex gap-3">
                            <span className="rounded-lg bg-stone-950 px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-stone-950">
                              Get Started
                            </span>
                            <span className="rounded-lg border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-700 dark:border-zinc-700 dark:text-zinc-300">
                              View Demo
                            </span>
                          </div>
                        </div>
                        <div className="rounded-[1.2rem] border border-stone-200 bg-stone-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                          <div className="text-xs text-stone-400 dark:text-zinc-500">
                            Total Revenue
                          </div>
                          <div className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-stone-950 dark:text-white">
                            $24,532
                          </div>
                          <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                            +12.5% from last month
                          </div>
                          <div className="mt-6 h-28 rounded-[1rem] bg-[linear-gradient(180deg,#eff6ff,#dbeafe)] dark:bg-[linear-gradient(180deg,#172554,#0f172a)]" />
                        </div>
                      </div>
                      <div className="border-t border-stone-200 px-5 py-4 text-center text-xs text-stone-400 dark:border-zinc-800 dark:text-zinc-500">
                        Trusted by developers at Linear, Vercel, Notion, GitHub, Adobe
                      </div>
                    </div>
                  </div>
                }
              />

              <ReferencePanel
                title="4. Generated Code"
                children={
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 border-b border-stone-200 pb-3 text-xs font-medium text-stone-500 dark:border-zinc-800 dark:text-zinc-400">
                      <span className="text-sky-600 dark:text-sky-400">React</span>
                      <span>Vue</span>
                      <span>HTML</span>
                      <span>Tailwind</span>
                    </div>
                    <div className="rounded-[1.2rem] border border-stone-200 bg-stone-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                      <CodeSnippetMock />
                    </div>
                    <div className="flex gap-3">
                      <button className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
                        Copy Code
                      </button>
                      <button className="rounded-xl bg-stone-950 px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-stone-950">
                        Download
                      </button>
                    </div>
                  </div>
                }
              />
            </div>
          </div>
        </section>

        <section
          id="inputs"
          className="section-divider mt-12 scroll-mt-28 lg:mt-14"
        >
          <div className="text-center">
            <p className="editorial-kicker">Supported Inputs</p>
            <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-semibold text-stone-950 dark:text-white sm:text-4xl">
              Supported Inputs
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-600 dark:text-zinc-300 sm:text-base">
              Upload or connect any visual input. Our AI will handle the rest.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8">
            {inputItems.map((item, index) => (
              <SupportedInputCard
                key={item.title}
                label={item.title}
                subtitle={item.subtitle}
                icon={item.icon}
                tone={index}
                active={index === 0}
              />
            ))}
          </div>
        </section>

        <section
          id="pipeline"
          className="section-divider mt-12 scroll-mt-28 lg:mt-14"
        >
          <div className="studio-panel rounded-[2rem] p-5 sm:p-6 lg:p-8">
            <div className="max-w-3xl">
              <p className="editorial-kicker">How AI Understands UI</p>
              <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-semibold tracking-[-0.04em] text-stone-950 dark:text-white sm:text-4xl">
                How AI Understands UI
              </h2>
              <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-zinc-300 sm:text-base">
                Advanced AI models that understand design like a human
                developer.
              </p>
            </div>

            <div className="mt-8 grid gap-3 lg:grid-cols-8">
              {pipelineItems.map((item, index) => (
                <PipelineStep
                  key={item.title}
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                  active={index === 2 || index === 6}
                  isLast={index === pipelineItems.length - 1}
                />
              ))}
            </div>
          </div>
        </section>

        <section
          id="cases"
          className="section-divider mt-12 scroll-mt-28 lg:mt-14"
        >
          <div
            id="before-after"
            className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-start"
          >
            <div>
              <p className="editorial-kicker">Before / After</p>
              <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-semibold tracking-[-0.04em] text-stone-950 dark:text-white sm:text-4xl">
                Show that the AI understood the interface.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600 dark:text-zinc-300 sm:text-base">
                This comparison frames the product around interface
                reconstruction, not just code generation, which makes the value
                feel more premium and more concrete.
              </p>
            </div>

            <BeforeAfterPanel />
          </div>
        </section>

        <section
          className="section-divider mt-12 scroll-mt-28 lg:mt-14"
        >
          <div className="studio-panel rounded-[2rem] p-5 sm:p-6 lg:p-8">
            <div className="max-w-3xl">
              <p className="editorial-kicker">Pricing</p>
              <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-semibold tracking-[-0.04em] text-stone-950 dark:text-white sm:text-4xl">
                A familiar free-to-paid path.
              </h2>
              <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-zinc-300 sm:text-base">
                Visitors usually want one simple answer before they try a
                product: can I start for free, and when would I pay for more?
              </p>
            </div>

            <div
              id="pricing"
              className="mt-8 grid gap-4 xl:grid-cols-3"
            >
              {pricingPlans.map((plan) => (
                <PricingCard
                  key={plan.name}
                  name={plan.name}
                  subtitle={plan.subtitle}
                  price={plan.price}
                  description={plan.description}
                  features={plan.features}
                  cta={plan.cta}
                  featured={plan.featured}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="stack" className="section-divider mt-12 scroll-mt-28 lg:mt-14">
          <div className="studio-panel rounded-[2rem] p-5 sm:p-6 lg:p-8">
            <div className="text-center">
              <p className="editorial-kicker">Built for Modern Developers</p>
              <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-semibold tracking-[-0.04em] text-stone-950 dark:text-white sm:text-4xl">
                Built for Modern Developers
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-600 dark:text-zinc-300">
                Export to your favorite frameworks and technologies.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {stackItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-center gap-2 rounded-[1.15rem] border border-stone-200/80 bg-white px-4 py-4 text-sm font-medium text-stone-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="timeline"
          className="section-divider mt-12 scroll-mt-28 lg:mt-14"
        >
          <div className="studio-panel rounded-[2rem] p-5 sm:p-6 lg:p-8">
            <div className="text-center">
              <p className="editorial-kicker">From Visual to Code in 7 Steps</p>
              <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-semibold tracking-[-0.04em] text-stone-950 dark:text-white sm:text-4xl">
                From Visual to Code in 7 Steps
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-600 dark:text-zinc-300 sm:text-base">
                Simple workflow. Powerful results.
              </p>
            </div>

            <div className="relative mt-10 grid gap-4 lg:grid-cols-7">
              <div className="absolute left-0 right-0 top-5 hidden border-t border-dashed border-sky-300 lg:block" />
              {workflowItems.map((item, index) => (
                <HorizontalTimelineStep
                  key={item}
                  step={String(index + 1)}
                  title={item}
                  description={
                    [
                      "Upload any visual input",
                      "AI analyzes layout, content, styles",
                      "AI understands UI like a developer",
                      "Generate clean, structured code",
                      "Live preview in real-time",
                      "Fine-tune and customize",
                      "Export and deploy your project",
                    ][index]
                  }
                />
              ))}
            </div>
          </div>
        </section>

        <section
          id="generator"
          className="section-divider mt-12 scroll-mt-28 lg:mt-14"
        >
          <div className="studio-panel mx-auto rounded-[2rem] p-4 sm:p-6 lg:p-8">
            <div className="mb-6 grid gap-5 border-b border-stone-200/80 pb-6 dark:border-zinc-800 lg:grid-cols-[1.12fr_0.88fr] lg:items-end">
              <div>
                <p className="editorial-kicker">Launch Workspace</p>
                <h2 className="mt-2 font-['Space_Grotesk'] text-3xl font-semibold tracking-[-0.04em] text-stone-950 dark:text-white sm:text-4xl">
                  Start from a real visual input.
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600 dark:text-zinc-300">
                  The interactive generator stays on the page as the main call
                  to action, but now it arrives after the product story is
                  already obvious.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 dark:text-zinc-400">
                <span className="studio-surface px-3 py-2 text-center">
                  Screenshot + URL + Text
                </span>
                <span className="studio-surface px-3 py-2 text-center">
                  Preview + Code
                </span>
                <span className="studio-surface px-3 py-2 text-center">
                  Editable output
                </span>
                <span className="studio-surface px-3 py-2 text-center">
                  Multi-stack
                </span>
              </div>
            </div>

            <Suspense fallback={<GeneratorFallback />}>
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
            </Suspense>
          </div>
        </section>

        <section
          id="use-cases"
          className="section-divider mt-12 scroll-mt-28 lg:mt-14"
        >
          <div className="flex flex-col gap-3 text-center">
            <p className="editorial-kicker">Real Use Cases</p>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-stone-950 dark:text-white sm:text-4xl">
              Real Use Cases
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-6 text-stone-600 dark:text-zinc-300 sm:text-base">
              See how developers and teams use VisualToCode.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {useCaseItems.map((item) => (
              <UseCasePreviewCard
                key={item.title}
                title={item.title}
                description={item.description}
                image={item.image}
              />
            ))}
          </div>
        </section>

        <section
          id="faq"
          className="section-divider mt-12 scroll-mt-28 lg:mt-14"
        >
          <div className="text-center">
            <p className="editorial-kicker">Frequently Asked Questions</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-stone-950 dark:text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-stone-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,245,244,0.88))] p-4 shadow-[0_28px_70px_rgba(18,22,33,0.08)] backdrop-blur dark:border-zinc-800 dark:bg-[linear-gradient(180deg,rgba(9,9,11,0.94),rgba(24,24,27,0.84))] sm:p-6">
              <Accordion type="single" collapsible className="w-full">
                <FaqItem
                  value="item-1"
                  question="How accurate is the generated code?"
                  answer="The product is strongest as a fast first draft. Clean visual hierarchy and clearer references usually lead to a better initial result and less cleanup afterward."
                />
                <FaqItem
                  value="item-2"
                  question="Which frameworks are supported?"
                  answer="The current product supports common front-end targets such as React, HTML, Vue, and Tailwind-oriented workflows, with the homepage now positioning the brand for broader stack coverage."
                />
                <FaqItem
                  value="item-3"
                  question="Can I edit generated code?"
                  answer="Yes. The workflow is built around previewing, iterating, and refining the output after generation instead of treating the first result like a frozen export."
                />
              </Accordion>
            </div>

            <div className="rounded-[2rem] border border-stone-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,245,244,0.88))] p-4 shadow-[0_28px_70px_rgba(18,22,33,0.08)] backdrop-blur dark:border-zinc-800 dark:bg-[linear-gradient(180deg,rgba(9,9,11,0.94),rgba(24,24,27,0.84))] sm:p-6">
              <Accordion type="single" collapsible className="w-full">
                <FaqItem
                  value="item-4"
                  question="Does it support responsive layouts?"
                  answer="Responsive structure is part of the generation pipeline, and the new landing page calls that out directly as one of the core stages of understanding UI."
                />
                <FaqItem
                  value="item-5"
                  question="Is Tailwind CSS supported?"
                  answer="Yes. Tailwind remains one of the core output paths and is shown directly in the workspace and code stack sections."
                />
                <FaqItem
                  value="item-6"
                  question="Can I convert existing websites?"
                  answer="Yes. You can start from screenshots or a live website URL, which makes the workflow useful for teardowns, redesigns, and structure cloning."
                />
              </Accordion>
            </div>
          </div>

          {IS_RUNNING_ON_CLOUD ? (
            <div className="mt-6">
              <AccountPanel enabled={IS_RUNNING_ON_CLOUD} />
            </div>
          ) : null}
        </section>

        <footer className="mt-12 rounded-[2rem] bg-stone-950 px-6 py-8 text-white shadow-[0_30px_90px_rgba(17,17,17,0.16)] dark:border dark:border-zinc-800 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_2.7fr_1.2fr]">
            <div className="max-w-md">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <span className="flex h-5 w-5 items-center justify-center rounded-md border border-white/25">
                  <img
                    src="/favicon/log-square.png"
                    alt="VisualToCode"
                    className="h-4 w-4 object-contain"
                  />
                </span>
                <span>VisualToCode</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-300">
                Turn any visual into production-ready code. Built for
                developers, designers, and fast-moving teams.
              </p>
              <div className="mt-5 flex items-center gap-4 text-stone-400">
                <a href="https://github.com/abi/screenshot-to-code" className="transition-colors hover:text-white">
                  <FaGithub className="h-4 w-4" />
                </a>
                <a href="https://twitter.com/_abi_" className="transition-colors hover:text-white">
                  <FaXTwitter className="h-4 w-4" />
                </a>
                <a href="#" className="transition-colors hover:text-white">
                  <FaDiscord className="h-4 w-4" />
                </a>
                <a href="#" className="transition-colors hover:text-white">
                  <FaYoutube className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-4">
              <FooterColumn title="Product" links={footerProductLinks} />
              <FooterColumn title="Resources" links={footerResourceLinks} />
              <FooterColumn title="Company" links={footerCompanyLinks} />
              <FooterColumn title="Community" links={footerCommunityLinks} />
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                Stay Updated
              </div>
              <p className="mt-3 text-sm text-stone-300">
                Get the latest updates and new features.
              </p>
              <div className="mt-4 flex items-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
                <div className="flex-1 px-4 py-3 text-sm text-stone-400">
                  Enter your email
                </div>
                <button className="border-l border-white/10 px-4 py-3 text-sm font-semibold text-white">
                  <LuChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-5 text-xs text-stone-400">
            © 2024 VisualToCode. All rights reserved.
          </div>
        </footer>
      </section>
    </div>
  );
};

function ReferencePanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/70">
      <div className="text-sm font-semibold text-stone-700 dark:text-zinc-200">
        {title}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ReferenceInputRow({
  title,
  subtitle,
  accent,
  active = false,
}: {
  title: string;
  subtitle: string;
  accent: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-[1rem] border px-3 py-3 ${
        active
          ? "border-sky-200 bg-white shadow-sm dark:border-sky-900/50 dark:bg-zinc-950"
          : "border-stone-200 bg-white/85 dark:border-zinc-800 dark:bg-zinc-950/80"
      }`}
    >
      <div className={`h-8 w-8 rounded-lg ${accent}`} />
      <div className="min-w-0">
        <div className="text-sm font-medium text-stone-800 dark:text-zinc-100">
          {title}
        </div>
        <div className="text-xs text-stone-500 dark:text-zinc-400">
          {subtitle}
        </div>
      </div>
    </div>
  );
}

function ReferenceStatusRow({
  label,
  status,
  active = false,
}: {
  label: string;
  status: string;
  active?: boolean;
}) {
  return (
    <div className="rounded-[1rem] border border-stone-200 bg-white px-3 py-3 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-sm font-medium text-stone-800 dark:text-zinc-100">
        {label}
      </div>
      <div
        className={`mt-1 text-xs ${
          active
            ? "text-sky-600 dark:text-sky-400"
            : "text-emerald-600 dark:text-emerald-400"
        }`}
      >
        {status}
      </div>
    </div>
  );
}

function PricingCard({
  name,
  subtitle,
  price,
  description,
  features,
  cta,
  featured = false,
}: {
  name: string;
  subtitle: string;
  price: string;
  description: string;
  features: readonly string[];
  cta: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-[1.8rem] border p-6 shadow-sm transition-transform ${
        featured
          ? "border-stone-900 bg-stone-950 text-white shadow-[0_28px_70px_rgba(17,17,17,0.18)] dark:border-white dark:bg-white dark:text-stone-950"
          : "border-stone-200/80 bg-white/90 text-stone-900 dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div
            className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${
              featured
                ? "text-cyan-200 dark:text-cyan-700"
                : "text-stone-500 dark:text-zinc-400"
            }`}
          >
            {name}
          </div>
          <div
            className={`mt-2 text-sm ${
              featured
                ? "text-stone-300 dark:text-stone-600"
                : "text-stone-500 dark:text-zinc-400"
            }`}
          >
            {subtitle}
          </div>
        </div>
        {featured ? (
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white dark:border-stone-300 dark:bg-stone-100 dark:text-stone-900">
            Popular
          </span>
        ) : null}
      </div>

      <div className="mt-6 text-4xl font-semibold tracking-[-0.04em]">
        {price}
      </div>

      <p
        className={`mt-4 text-sm leading-6 ${
          featured
            ? "text-stone-300 dark:text-stone-600"
            : "text-stone-600 dark:text-zinc-300"
        }`}
      >
        {description}
      </p>

      <div className="mt-6 space-y-3">
        {features.map((feature) => (
          <div
            key={feature}
            className={`rounded-[1rem] px-4 py-3 text-sm ${
              featured
                ? "bg-white/8 text-stone-100 dark:bg-stone-100 dark:text-stone-900"
                : "bg-stone-50 text-stone-700 dark:bg-zinc-900 dark:text-zinc-300"
            }`}
          >
            {feature}
          </div>
        ))}
      </div>

      <a
        href="#generator"
        className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
          featured
            ? "bg-white text-stone-950 dark:bg-stone-950 dark:text-white"
            : "border border-stone-300 bg-white text-stone-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        }`}
      >
        {cta}
      </a>
    </div>
  );
}

function SupportedInputCard({
  label,
  subtitle,
  icon: Icon,
  tone,
  active = false,
}: {
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: number;
  active?: boolean;
}) {
  const tones = [
    "text-sky-600 bg-sky-50 border-sky-100 dark:bg-sky-950/30 dark:border-sky-900/40 dark:text-sky-300",
    "text-pink-600 bg-pink-50 border-pink-100 dark:bg-pink-950/30 dark:border-pink-900/40 dark:text-pink-300",
    "text-cyan-600 bg-cyan-50 border-cyan-100 dark:bg-cyan-950/30 dark:border-cyan-900/40 dark:text-cyan-300",
    "text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/40 dark:text-emerald-300",
    "text-indigo-600 bg-indigo-50 border-indigo-100 dark:bg-indigo-950/30 dark:border-indigo-900/40 dark:text-indigo-300",
    "text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-950/30 dark:border-amber-900/40 dark:text-amber-300",
    "text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-950/30 dark:border-rose-900/40 dark:text-rose-300",
    "text-violet-600 bg-violet-50 border-violet-100 dark:bg-violet-950/30 dark:border-violet-900/40 dark:text-violet-300",
  ];

  return (
    <div
      className={`flex min-h-[8.5rem] flex-col items-center justify-center rounded-[1.15rem] border p-4 text-center transition-transform hover:-translate-y-0.5 ${
        active
          ? "border-sky-200 bg-white shadow-[0_18px_40px_rgba(14,165,233,0.12)] dark:border-sky-900/50 dark:bg-zinc-950"
          : "border-stone-200/80 bg-white/78 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/70"
      }`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full border ${tones[tone % tones.length]}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-3 text-sm font-semibold text-stone-900 dark:text-white">
        {label}
      </div>
      <div className="mt-1 text-xs leading-5 text-stone-500 dark:text-zinc-400">
        {subtitle}
      </div>
    </div>
  );
}

function CodeSnippetMock() {
  const lines = [
    "import React from 'react'",
    "",
    "export default function LandingDemo() {",
    "  return (",
    "    <div className='min-h-screen bg-white'>",
    "      <header className='px-6 py-4'>",
    "        <nav className='flex justify-between'>",
    "          <a href='#' className='font-bold'>",
    "            StartupLanding",
    "          </a>",
    "        </nav>",
    "      </header>",
    "    </div>",
    "  )",
    "}",
  ];

  return (
    <div className="space-y-2 font-mono text-[11px] leading-5 text-sky-700 dark:text-sky-300">
      {lines.map((line, index) => (
        <div key={`${line}-${index}`} className="whitespace-pre">
          <span className="mr-3 inline-block w-4 text-right text-stone-400 dark:text-zinc-500">
            {index + 1}
          </span>
          <span>{line}</span>
        </div>
      ))}
    </div>
  );
}

function PipelineStep({
  title,
  description,
  icon: Icon,
  active = false,
  isLast = false,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  isLast?: boolean;
}) {
  return (
    <div className="relative flex flex-col items-center text-center">
      {!isLast ? (
        <div className="absolute left-[calc(50%+2rem)] top-8 hidden h-px w-[calc(100%-2.25rem)] bg-stone-200 lg:block dark:bg-zinc-800">
          <LuArrowRight className="absolute -right-1.5 -top-2 h-4 w-4 text-sky-500" />
        </div>
      ) : null}
      <div
        className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full border bg-white shadow-sm dark:bg-zinc-950 ${
          active
            ? "border-sky-200 text-sky-600 shadow-[0_0_0_8px_rgba(14,165,233,0.08)] dark:border-sky-900/50 dark:text-sky-300"
            : "border-stone-200 text-sky-500 dark:border-zinc-800 dark:text-sky-300"
        }`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="mt-4 text-sm font-semibold text-stone-950 dark:text-white">
        {title}
      </div>
      <p className="mt-2 max-w-[8.5rem] text-xs leading-5 text-stone-500 dark:text-zinc-400">
        {description}
      </p>
    </div>
  );
}

function BeforeAfterPanel() {
  return (
    <div className="studio-panel overflow-hidden rounded-[2rem] p-5 sm:p-6">
      <div className="relative rounded-[1.6rem] border border-stone-200/80 bg-stone-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="grid gap-3 lg:grid-cols-2">
          <div>
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500 dark:text-zinc-400">
              Before
            </div>
            <div className="overflow-hidden rounded-[1.35rem] border border-stone-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
              <img
                src="/showcases/landing-page-sketch.png"
                alt="Original interface reference"
                width={1024}
                height={1024}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>

          <div>
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">
              After
            </div>
            <div className="overflow-hidden rounded-[1.35rem] border border-emerald-200 bg-white dark:border-emerald-900/40 dark:bg-zinc-950">
              <img
                src="/showcases/landing-page-output.png"
                alt="AI rebuilt interface"
                width={1024}
                height={1024}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>
        </div>

        <div className="before-after-handle" aria-hidden="true" />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <ResultChip label="Layout understood" />
        <ResultChip label="Components reconstructed" />
        <ResultChip label="Code ready to edit" />
      </div>
    </div>
  );
}

function HorizontalTimelineStep({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative rounded-[1rem] border border-stone-200/80 bg-white px-4 pb-5 pt-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="absolute left-1/2 top-0 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-sky-300 bg-white text-[10px] font-semibold text-sky-700 shadow-sm dark:border-sky-900/60 dark:bg-zinc-950 dark:text-sky-300">
        {step}
      </div>
      <div className="text-sm font-semibold text-stone-900 dark:text-white">
        {title}
      </div>
      <div className="mt-2 text-xs leading-5 text-stone-500 dark:text-zinc-400">
        {description}
      </div>
    </div>
  );
}

function UseCasePreviewCard({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) {
  return (
    <div className="rounded-[1.15rem] border border-stone-200/80 bg-white/92 p-2 shadow-sm transition-transform hover:-translate-y-0.5 dark:border-zinc-800 dark:bg-zinc-950/85">
      <div className="overflow-hidden rounded-[0.85rem] border border-stone-200/80 bg-stone-50 dark:border-zinc-800 dark:bg-zinc-900">
        <img
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          className="h-24 w-full object-cover object-top"
        />
      </div>
      <h3 className="mt-3 px-1 text-sm font-semibold text-stone-950 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 px-1 pb-2 text-xs leading-5 text-stone-600 dark:text-zinc-300">
        {description}
      </p>
    </div>
  );
}

function GeneratorFallback() {
  return (
    <div className="rounded-[1.8rem] border border-stone-200/80 bg-white/70 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/70">
      <div className="grid gap-3 sm:grid-cols-4">
        {["Upload", "URL", "Text", "Import"].map((label) => (
          <div
            key={label}
            className="rounded-xl border border-stone-200/80 bg-stone-50/80 px-4 py-4 text-center text-sm font-medium text-stone-500 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-400"
          >
            {label}
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-[1.5rem] border border-dashed border-stone-300/90 bg-stone-50/80 px-6 py-14 text-center dark:border-zinc-700 dark:bg-zinc-900/60">
        <div className="text-sm font-medium text-stone-600 dark:text-zinc-300">
          Loading workspace...
        </div>
        <p className="mt-2 text-sm leading-6 text-stone-500 dark:text-zinc-400">
          The interactive generator loads inside the page so the new landing
          experience can keep the workspace at the center of the story.
        </p>
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
    <AccordionItem
      value={value}
      className="mb-3 overflow-hidden rounded-[1.4rem] border border-stone-200/80 bg-white/80 px-4 dark:border-zinc-800 dark:bg-zinc-900/70"
    >
      <AccordionTrigger className="text-left text-base font-semibold text-stone-950 hover:no-underline dark:text-white">
        {question}
      </AccordionTrigger>
      <AccordionContent className="text-sm leading-6 text-stone-600 dark:text-zinc-300">
        {answer}
      </AccordionContent>
    </AccordionItem>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ href: string; label: string }>;
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400 dark:text-zinc-500">
        {title}
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {links.map((link) => (
          <a
            key={`${title}-${link.label}`}
            href={link.href}
            className="text-sm text-stone-300 hover:text-white dark:text-zinc-400 dark:hover:text-white"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export default StartPane;
