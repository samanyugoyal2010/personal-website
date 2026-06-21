import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Experience } from "@/components/Experience";
import { GitHubActivity } from "@/components/GitHubActivity";
import { About } from "@/components/About";
import { Research } from "@/components/Research";
import { Contact } from "@/components/Contact";
import { ActivityOdds } from "@/components/ActivityOdds";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main id="main" className="mx-auto w-full max-w-5xl px-5 pb-16 sm:px-8">
      <Header />
      <Hero />
      <Experience />
      <GitHubActivity />
      <About />
      <Research />
      <Contact />
      <ActivityOdds />
      <Footer />
    </main>
  );
}
