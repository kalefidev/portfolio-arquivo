import Header from "@/components/layout/Header";
import ActivePanel from "@/components/spiral/ActivePanel";
import BottomBar from "@/components/spiral/BottomBar";
import CourseOverlay from "@/components/spiral/CourseOverlay";
import HeroIntro from "@/components/spiral/HeroIntro";
import RightRail from "@/components/spiral/RightRail";
import SpiralSection from "@/components/spiral/SpiralSection";
import { site } from "@/content/site";
import SceneLoader from "@/three/SceneLoader";

// Layers: canvas (fixed) < grain < UI. Provisional below the spiral: one tall empty section to
// test the exit (the real sections come in etapa 07) — for now it is also where the skip link
// lands (`#indice`: the real CourseIndex takes the id over).
export default function Home() {
  return (
    <>
      <SceneLoader />

      <div id="topo" className="relative z-[var(--z-ui)]">
        <a
          href="#indice"
          className="label fixed top-3 left-3 z-20 -translate-y-24 bg-ink px-4 py-3 text-paper focus:translate-y-0"
        >
          {site.skipLink}
        </a>
        <Header />

        <main>
          <SpiralSection hero={<HeroIntro />}>
            <ActivePanel />
            <RightRail />
            <BottomBar />
          </SpiralSection>

          <section id="indice" tabIndex={-1} className="h-[150svh] border-t border-line outline-none" />
        </main>

        <CourseOverlay />
      </div>
    </>
  );
}
