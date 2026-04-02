"use client";

import { Project, Skill } from "@/lib/portfolio-types";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export function ProjectsSection({
  projects,
  skills,
  tools,
}: {
  projects: Project[];
  skills: Skill[];
  tools: Skill[];
}) {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 3000, stopOnInteraction: false }),
  ]);

  return (
    <section className="border-b border-border py-12 sm:py-16">
      <h2 className="mb-8 text-lg font-semibold text-foreground">Projects</h2>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6 px-4 sm:px-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="min-w-0 shrink-0 basis-[350px] rounded-lg border border-border bg-background/50 p-4"
            >
              <div className="flex flex-col gap-4">
                <div className="relative h-40 w-full overflow-hidden rounded border border-border">
                  <Image
                    src={project.image ?? ""}
                    alt={project.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="font-medium text-foreground">
                      {project.name}
                    </span>
                    <span className="text-muted">·</span>
                    <span className="text-muted">{project.company}</span>
                  </div>

                  <p className="mt-1 text-xs text-muted">
                    {project.startDate} — {project.endDate}
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                    {project.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.skills?.map((skillId) => {
                      const skill = skills.find((s) => s.id === skillId);
                      if (!skill) return null;

                      return (
                        <img
                          key={skill.id}
                          src={skill.icon}
                          alt={skill.name}
                          className="h-7 w-7"
                        />
                      );
                    })}

                    {project.tools?.map((toolId) => {
                      const tool = tools.find((s) => s.id === toolId);
                      if (!tool) return null;

                      return (
                        <img
                          key={tool.id}
                          src={tool.icon}
                          alt={tool.name}
                          className="h-7 w-7"
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
