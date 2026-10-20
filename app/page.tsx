import Nav from "./components/Nav";
import Hero from "./components/Hero";
import BelowFold from "./components/BelowFold";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--night)]">
      <Nav />
      <Hero />
      <BelowFold />
    </main>
  );
}
