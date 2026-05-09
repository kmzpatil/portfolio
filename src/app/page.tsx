import ParticleField from "@/components/canvas/ParticleNetwork";
import NavBar from "@/components/ui/NavBar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";

export default function Home() {
  return (
    <>
      <ParticleField />
      <NavBar />
      <main>
        <Hero />
        <About />
      </main>
    </>
  );
}
