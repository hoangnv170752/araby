import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import TryIt from "./components/TryIt";
import Features from "./components/Features";
import OrnamentDivider from "./components/OrnamentDivider";
import Monetization from "./components/Monetization";
import Market from "./components/Market";
import Roadmap from "./components/Roadmap";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--night)]">
      <Nav />
      <Hero />
      <Stats />
      <TryIt />
      <Features />
      <OrnamentDivider />
      <Monetization />
      <Market />
      <OrnamentDivider />
      <Roadmap />
      <CTA />
      <Footer />
    </main>
  );
}
