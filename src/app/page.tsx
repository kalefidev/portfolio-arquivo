import { site } from "@/content/site";

// Provisional page (etapa 01): wordmark, hero text and 3 tall empty sections to test scroll.
export default function Home() {
  return (
    <div className="relative z-[var(--z-ui)]">
      <header className="flex h-16 items-center px-gutter">
        <span className="text-h3 font-bold tracking-tight">
          {site.wordmark}
          <span className="text-signal">■</span>
        </span>
      </header>

      <main>
        <section className="flex min-h-[calc(100svh-4rem)] flex-col justify-center gap-6 px-gutter pb-section">
          <p className="label text-ink-2">{site.hero.eyebrow}</p>
          <h1 className="max-w-[14ch] text-display">{site.hero.h1}</h1>
          <p className="max-w-[48ch] text-ink-2">{site.hero.sub}</p>
          <p className="label">{site.hero.cta}</p>
        </section>

        <section className="h-svh border-t border-line" />
        <section className="h-svh border-t border-line" />
        <section className="h-svh border-t border-line" />
      </main>
    </div>
  );
}
