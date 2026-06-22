export interface SeoFaqItem {
  question: string;
  answer: string;
}

export interface SeoLandingPageSection {
  title: string;
  body: string;
}

export interface SeoLandingPageHighlight {
  label: string;
  value: string;
}

export interface SeoLandingPageLink {
  href: string;
  label: string;
}

export interface SeoLandingPageData {
  path: string;
  title: string;
  description: string;
  eyebrow: string;
  headline: string;
  intro: string;
  highlights: SeoLandingPageHighlight[];
  sections: SeoLandingPageSection[];
  faqs: SeoFaqItem[];
  primaryCta: SeoLandingPageLink;
  secondaryCta: SeoLandingPageLink;
  relatedLinks: SeoLandingPageLink[];
}

export const seoLandingPages: SeoLandingPageData[] = [
  {
    path: "/screenshot-to-react",
    title: "Screenshot to React | Convert UI screenshots into editable React code",
    description:
      "Turn screenshots, mockups, and reference UIs into editable React front-end code with live preview, iteration, and export-ready structure.",
    eyebrow: "React workflow",
    headline: "Convert screenshots into React code your team can keep editing.",
    intro:
      "This page is built for teams who want more than a one-shot demo. Start with a UI screenshot, generate a React front-end draft, then keep refining the result until it is useful for review, prototyping, or product delivery.",
    highlights: [
      { label: "Best input", value: "Product screenshots and polished UI references" },
      { label: "Best output", value: "Editable React front-end structure" },
      { label: "Ideal for", value: "MVPs, redesigns, and component-first teams" },
    ],
    sections: [
      {
        title: "Why this workflow fits React teams",
        body:
          "React projects benefit when the first generated pass already feels modular and easy to revise. Instead of recreating layouts by hand, teams can move from screenshots into a live front-end draft and then iterate with prompts, edits, and previews.",
      },
      {
        title: "What works best as input",
        body:
          "Clear landing page references, dashboard screenshots, mobile screens, and UI mockups work especially well. The stronger the visual hierarchy in the input, the easier it is to get a React output that is ready for cleanup and extension.",
      },
      {
        title: "Where this helps most",
        body:
          "Use it for startup MVPs, internal prototypes, marketing page rebuilds, competitor teardowns, and design-to-code handoff when speed matters more than building the first layout from scratch.",
      },
    ],
    faqs: [
      {
        question: "Can I keep editing the generated React output?",
        answer:
          "Yes. The generated result is meant to be revised, previewed, and iterated on instead of treated like a final frozen export.",
      },
      {
        question: "Does this work for component-heavy UI?",
        answer:
          "It works best when the source layout has clear sections, cards, navigation, forms, or repeated UI patterns that can be translated into a stronger front-end structure.",
      },
      {
        question: "Is this only for polished screenshots?",
        answer:
          "No. It also works for rough mockups, wireframes, and mixed references, though higher-quality screenshots usually produce a better first pass.",
      },
    ],
    primaryCta: { href: "/#generator", label: "Launch the generator" },
    secondaryCta: { href: "/#cases", label: "See example outputs" },
    relatedLinks: [
      { href: "/website-screenshot-to-html", label: "Website Screenshot to HTML" },
      { href: "/figma-screenshot-to-code", label: "Figma Screenshot to Code" },
      { href: "/", label: "Image to Code homepage" },
    ],
  },
  {
    path: "/website-screenshot-to-html",
    title: "Website Screenshot to HTML | Turn website references into editable HTML",
    description:
      "Convert website screenshots and landing page references into editable HTML front-end drafts you can preview, refine, and ship faster.",
    eyebrow: "HTML workflow",
    headline: "Turn website screenshots into HTML you can quickly revise and ship.",
    intro:
      "When you need a fast first pass from a website reference, the value is not just getting HTML once. It is being able to preview the result, compare it against the source, and keep refining the structure until it is presentable and useful.",
    highlights: [
      { label: "Best input", value: "Landing pages, marketing sites, and wireframes" },
      { label: "Best output", value: "Editable HTML front-end drafts" },
      { label: "Ideal for", value: "Campaign pages, clones, and quick rebuilds" },
    ],
    sections: [
      {
        title: "Why screenshot-to-HTML is useful",
        body:
          "HTML-first output is helpful when you want simple delivery, straightforward inspection, or a draft that can later move into another stack. This is especially useful for landing page experiments, static page rebuilds, and fast turnaround client work.",
      },
      {
        title: "The strongest use cases",
        body:
          "Use this when you want to recreate layout hierarchy from a website screenshot, generate a first-pass clone for teardown work, or produce editable markup that can be shared quickly with a designer, stakeholder, or client.",
      },
      {
        title: "How to get better results",
        body:
          "Start with a clean source image, add context about spacing or behavior when needed, and keep iterating after the first output. The best results usually come from treating the generated HTML as a fast draft, not the final endpoint.",
      },
    ],
    faqs: [
      {
        question: "Can this help recreate a marketing page from a screenshot?",
        answer:
          "Yes. It is a strong fit for hero sections, feature blocks, pricing layouts, testimonials, and other structured website sections.",
      },
      {
        question: "Does it only work for full websites?",
        answer:
          "No. It also works well for single sections, isolated UI blocks, and page fragments when you only need part of a design recreated quickly.",
      },
      {
        question: "Can I refine the HTML after generation?",
        answer:
          "Yes. The product is designed around previewing, editing, and improving the output after the first draft appears.",
      },
    ],
    primaryCta: { href: "/#generator", label: "Start from a website screenshot" },
    secondaryCta: { href: "/#how-it-works", label: "How the workflow works" },
    relatedLinks: [
      { href: "/screenshot-to-react", label: "Screenshot to React" },
      { href: "/figma-screenshot-to-code", label: "Figma Screenshot to Code" },
      { href: "/", label: "Image to Code homepage" },
    ],
  },
  {
    path: "/figma-screenshot-to-code",
    title: "Figma Screenshot to Code | Move from Figma screens to editable code",
    description:
      "Start from Figma-exported screenshots or reference screens and turn them into editable front-end code with live preview and follow-up iteration.",
    eyebrow: "Design handoff",
    headline: "Use Figma screenshots as the starting point for editable front-end code.",
    intro:
      "If your design work already lives in Figma, screenshots are often the fastest bridge into code generation. Export the relevant frames, use them as visual references, and move into a front-end draft that is easier to review and keep shaping.",
    highlights: [
      { label: "Best input", value: "Figma frames, flows, and exported artboards" },
      { label: "Best output", value: "Editable front-end drafts for iteration" },
      { label: "Ideal for", value: "Design handoff, rapid prototypes, and review loops" },
    ],
    sections: [
      {
        title: "Why this works well for Figma teams",
        body:
          "Design teams often need a faster bridge from mockups into something that can be previewed and critiqued like a real front-end. Starting from screenshots preserves the visual reference while reducing the time spent manually translating every layout decision.",
      },
      {
        title: "When to use screenshots instead of direct import",
        body:
          "Screenshots are especially practical when you want a quick workflow, when the design is already visually stable, or when the immediate goal is to generate an editable draft rather than preserve every source-layer detail from the design tool.",
      },
      {
        title: "How to structure a better handoff",
        body:
          "Export the most important frames, include context for responsive behavior or interactions, and compare the generated result against the original design. That review loop is where the workflow becomes most useful for design handoff.",
      },
    ],
    faqs: [
      {
        question: "Do I need a direct Figma integration to use this?",
        answer:
          "No. Exporting the relevant Figma frames as screenshots is enough to create a useful starting point.",
      },
      {
        question: "Is this helpful for design handoff?",
        answer:
          "Yes. It can help design and product teams create a code draft that is easier to review with engineers and stakeholders.",
      },
      {
        question: "Can I use multiple Figma screens together?",
        answer:
          "Yes. Using multiple related reference screenshots can improve context when a flow spans several screens or sections.",
      },
    ],
    primaryCta: { href: "/#generator", label: "Start from Figma screenshots" },
    secondaryCta: { href: "/#faq", label: "Read the main FAQ" },
    relatedLinks: [
      { href: "/screenshot-to-react", label: "Screenshot to React" },
      { href: "/website-screenshot-to-html", label: "Website Screenshot to HTML" },
      { href: "/", label: "Image to Code homepage" },
    ],
  },
];

export const seoLandingPagesByPath = Object.fromEntries(
  seoLandingPages.map((page) => [page.path, page])
) as Record<string, SeoLandingPageData>;
