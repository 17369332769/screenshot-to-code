import { SeoLandingPageData } from "../../lib/seo-pages";

function SeoLandingPage({ page }: { page: SeoLandingPageData }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#faf7f2_0%,#f4efe6_45%,#ffffff_100%)] text-slate-950 dark:bg-[linear-gradient(180deg,#09090b_0%,#111827_45%,#09090b_100%)] dark:text-white">
      <div className="landing-orb landing-orb-left" />
      <div className="landing-orb landing-orb-right" />
      <div className="landing-grid" />

      <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-white/85 backdrop-blur dark:border-zinc-800 dark:bg-black/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="/" className="text-sm font-semibold tracking-[0.22em] text-stone-600 dark:text-zinc-300">
            IMAGETOCODE
          </a>
          <div className="flex items-center gap-3">
            <a
              href="/#generator"
              className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Open generator
            </a>
            <a
              href="/"
              className="rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-stone-950"
            >
              Back to homepage
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-stone-300/70 bg-white/85 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-stone-700 shadow-sm backdrop-blur dark:border-stone-700 dark:bg-zinc-900/70 dark:text-stone-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {page.eyebrow}
            </div>

            <h1 className="mt-6 max-w-4xl font-['Space_Grotesk'] text-5xl font-bold leading-[0.94] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              {page.headline}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-600 dark:text-zinc-300 sm:text-lg">
              {page.intro}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={page.primaryCta.href}
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
              >
                {page.primaryCta.label}
              </a>
              <a
                href={page.secondaryCta.href}
                className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white/80 px-6 py-3 text-sm font-semibold text-stone-800 transition-colors hover:bg-stone-100 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-white dark:hover:bg-zinc-800"
              >
                {page.secondaryCta.label}
              </a>
            </div>
          </div>

          <div className="studio-panel overflow-hidden rounded-[2rem] p-5 sm:p-6">
            <div className="rounded-[1.8rem] border border-slate-800/90 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.18),transparent_32%),linear-gradient(180deg,#0f172a,#111827)] p-5 text-stone-50 dark:border-zinc-800">
              <div className="text-xs uppercase tracking-[0.22em] text-stone-400">
                Why this page matters
              </div>
              <div className="mt-4 grid gap-3">
                {page.highlights.map((item) => (
                  <div
                    key={`${page.path}-${item.label}`}
                    className="rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-4"
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
                      {item.label}
                    </div>
                    <div className="mt-2 text-sm leading-6 text-stone-100">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-divider mt-14 grid gap-4 lg:grid-cols-3">
          {page.sections.map((section) => (
            <article
              key={`${page.path}-${section.title}`}
              className="studio-panel rounded-[1.8rem] p-6"
            >
              <h2 className="font-['Space_Grotesk'] text-2xl font-semibold tracking-[-0.04em] text-stone-950 dark:text-white">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-stone-600 dark:text-zinc-300">
                {section.body}
              </p>
            </article>
          ))}
        </section>

        <section className="section-divider mt-14 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="studio-panel rounded-[1.95rem] p-6 lg:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500 dark:text-zinc-400">
              Workflow
            </p>
            <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-semibold tracking-[-0.04em] text-stone-950 dark:text-white">
              Start from a visual reference, then keep iterating.
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <StepCard
                step="01"
                title="Add the reference"
                description="Use screenshots, mockups, URLs, or a set of related reference screens."
              />
              <StepCard
                step="02"
                title="Generate a draft"
                description="Create a front-end first pass that is easier to inspect than a blank file."
              />
              <StepCard
                step="03"
                title="Refine and export"
                description="Compare the result, adjust it with follow-up edits, and keep moving toward delivery."
              />
            </div>
          </div>

          <div className="rounded-[1.95rem] border border-stone-200/80 bg-stone-950 p-6 text-white shadow-sm dark:border-zinc-800 lg:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
              Related searches
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">
              Explore adjacent image-to-code use cases.
            </h2>
            <div className="mt-6 flex flex-col gap-3">
              {page.relatedLinks.map((link) => (
                <a
                  key={`${page.path}-${link.href}`}
                  href={link.href}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-stone-200 transition-colors hover:bg-white/10"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section-divider mt-14">
          <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500 dark:text-zinc-400">
                FAQ
              </p>
              <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-semibold tracking-[-0.04em] text-stone-950 dark:text-white">
                Questions people ask before trying this workflow.
              </h2>
            </div>
            <div className="grid gap-3">
              {page.faqs.map((item) => (
                <article
                  key={`${page.path}-${item.question}`}
                  className="studio-panel rounded-[1.6rem] p-5"
                >
                  <h3 className="text-lg font-semibold text-stone-950 dark:text-white">
                    {item.question}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-stone-600 dark:text-zinc-300">
                    {item.answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.4rem] border border-stone-200/80 bg-white/80 px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900/70">
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500 dark:text-zinc-400">
        {step}
      </div>
      <div className="mt-2 text-base font-semibold text-stone-950 dark:text-white">
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-zinc-300">
        {description}
      </p>
    </div>
  );
}

export default SeoLandingPage;
