import SpiralSection from "@/components/spiral/SpiralSection";
import { site } from "@/content/site";
import SceneLoader from "@/three/SceneLoader";

// Provisional page (etapa 02): spiral section with the hero scrolling away over it,
// then one tall empty section to test the spiral exit.
export default function Home() {
  return (
    <>
      <SceneLoader />

      <div className="relative z-[var(--z-ui)]">
        <header className="absolute inset-x-0 top-0 z-10 flex h-16 items-center px-gutter">
          <span className="text-h3 font-bold tracking-tight">
            {site.wordmark}
            <span className="text-signal">■</span>
          </span>
        </header>

        <main>
          <SpiralSection>
            <div className="absolute inset-x-0 top-0 flex h-svh flex-col justify-center gap-6 px-gutter">
              <p className="label text-ink-2">{site.hero.eyebrow}</p>
              <h1 className="max-w-[14ch] text-display">{site.hero.h1}</h1>
              <p className="max-w-[48ch] text-ink-2">{site.hero.sub}</p>
              <p className="label">{site.hero.cta}</p>
            </div>
          </SpiralSection>

          <section className="h-[150svh] border-t border-line" />
        </main>
      </div>
    </>
  );
}
