import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Loader from "@/components/layout/Loader";
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

export const metadata: Metadata = { alternates: { canonical: "/" } };

const isLink = (href: string) => !href.startsWith("TODO");

// schema.org Person. `<` escaped: a "</script>" in some text could never close the tag early.
const personLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: `https://${site.domain}`,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: site.seo.locality.city,
    addressRegion: site.seo.locality.region,
    addressCountry: site.seo.locality.country,
  },
  sameAs: site.about.people[0].links.map((link) => link.href).filter(isLink),
}).replace(/</g, "\\u003c");

// Layers: canvas (fixed) < grain < UI. The page, top to bottom: the spiral (and its exit, which
// ends in the line of <Reach>), the sections, the footer.
export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personLd }} />
      <Loader />
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
