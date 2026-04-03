import { ExperiencesSection } from "@/components/portfolio/experiences";
import { Hero } from "@/components/portfolio/hero";
import { SkillsSection } from "@/components/portfolio/skills";
import { ToolsSection } from "@/components/portfolio/tools";
import { readPortfolio } from "@/lib/portfolio-data";
import { SiteFooter } from "@/components/site-footer";
import { ProjectsSection } from "@/components/portfolio/projects";
import { PublicSiteShell } from "@/components/public-site-shell";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await readPortfolio();

  return (
    <PublicSiteShell>
      <main className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <Hero />
        <ProjectsSection
          projects={data.projects}
          skills={data.skills}
          tools={data.tools}
        />
        <ExperiencesSection items={data.experiences} />
        <SkillsSection items={data.skills} />
        <ToolsSection items={data.tools} />
      </main>
      <SiteFooter />
    </PublicSiteShell>
  );
}
