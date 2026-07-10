import ParticleField from "@/components/canvas/ParticleNetwork";
import NavBar from "@/components/ui/NavBar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Playground from "@/components/sections/Playground";
import { projects } from "@/lib/data";

export default function Home() {
  return (
    <>
      <ParticleField />
      <NavBar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects projects={projects} />
        <Playground />
      </main>
    </>
  );
}
