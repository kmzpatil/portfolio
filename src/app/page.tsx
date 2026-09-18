import ParticleField from "@/components/canvas/ParticleNetwork";
import NavBar from "@/components/ui/NavBar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Playground from "@/components/sections/Playground";
import Skills from "@/components/sections/Skills";
import Achievements from "@/components/sections/Achievements";
import Contact from "@/components/sections/Contact";
import { projects } from "@/lib/data";
import SmoothScroll from "@/components/SmoothScroll";
import SectionScroller from "@/components/SectionScroller";
import CtfConsoleEasterEgg from "@/components/CtfConsoleEasterEgg";

export default function Home() {
  return (
    <>
      <CtfConsoleEasterEgg />
      <ParticleField />
      <NavBar />
      <SectionScroller />
      <SmoothScroll>
        <main>
          <Hero />
          <About />
          <Experience />
          <Projects projects={projects} />
          <Playground />
          <Skills />
          <Achievements />
          <Contact />
        </main>
      </SmoothScroll>
    </>
  );
}
