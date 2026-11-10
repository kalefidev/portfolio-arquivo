import Header from "@/components/layout/Header";
import ActivePanel from "@/components/spiral/ActivePanel";
import BottomBar from "@/components/spiral/BottomBar";
import HeroIntro from "@/components/spiral/HeroIntro";
import RightRail from "@/components/spiral/RightRail";
import SpiralSection from "@/components/spiral/SpiralSection";
import SceneLoader from "@/three/SceneLoader";

// Layers: canvas (fixed) < grain < UI. Provisional below the spiral: one tall empty section to
// test the exit (the real sections come in etapa 07).
export default function Home() {
  return (
    <>
      <SceneLoader />

      <div id="topo" className="relative z-[var(--z-ui)]">
        <Header />

        <main>
          <SpiralSection>
            <HeroIntro />
            <ActivePanel />
            <RightRail />
            <BottomBar />
          </SpiralSection>

          <section className="h-[150svh] border-t border-line" />
        </main>
      </div>
    </>
  );
}
