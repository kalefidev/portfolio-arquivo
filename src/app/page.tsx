import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Reveals from "@/components/layout/Reveals";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import CourseIndex from "@/components/sections/CourseIndex";
import Process from "@/components/sections/Process";
import Projects from "@/components/sections/Projects";
import Reach from "@/components/sections/Reach";
import Services from "@/components/sections/Services";
import ActivePanel from "@/components/spiral/ActivePanel";
import BottomBar from "@/components/spiral/BottomBar";
import CourseOverlay from "@/components/spiral/CourseOverlay";
import HeroIntro from "@/components/spiral/HeroIntro";
import RightRail from "@/components/spiral/RightRail";
import SpiralSection from "@/components/spiral/SpiralSection";
import { site } from "@/content/site";
import SceneLoader from "@/three/SceneLoader";

// Layers: canvas (fixed) < grain < UI. The page, top to bottom: the spiral (and its exit, which
// ends in the line of <Reach>), the sections, the footer.
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
          <Reach />
          <CourseIndex />
          <Projects />
          <Services />
          <About />
          <Process />
          <Contact />
        </main>

        <Footer />
        <CourseOverlay />
        <Reveals />
      </div>
    </>
  );
}
