import { SiteHeader } from "@/components/site-header";
import { ExperiencesSection } from "@/components/portfolio/experiences";
import { Hero } from "@/components/portfolio/hero";
import { SkillsSection } from "@/components/portfolio/skills";
import { readPortfolio } from "@/lib/portfolio-data";

export default async function Home() {
  const data = await readPortfolio();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <Hero />
        <ExperiencesSection items={data.experiences} />
        <SkillsSection items={data.skills} />
      </main>
    </div>
  );
}
