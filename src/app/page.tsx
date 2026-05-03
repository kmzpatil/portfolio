import ParticleField from "@/components/canvas/ParticleNetwork";
import NavBar from "@/components/ui/NavBar";
import Hero from "@/components/sections/Hero";

export default function Home() {
  return (
    <>
      <ParticleField />
      <NavBar />
      <main>
        <Hero />
      </main>
    </>
  );
}
