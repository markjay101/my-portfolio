import type { Experience } from "@/lib/portfolio-types";
import { ExperienceDescription } from "./experience-description";

export function ExperiencesSection({ items }: { items: Experience[] }) {
  return (
    <section className="border-b border-border py-12 sm:py-16">
      <h2 className="mb-8 text-lg font-semibold text-foreground">
        Experiences
      </h2>
      <ul className="space-y-8">
        {items.map((exp) => (
          <li key={exp.id} className="border-l-2 border-border pl-4">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="font-medium text-foreground">{exp.title}</span>
              <span className="text-muted">·</span>
              <span className="text-muted">{exp.company}</span>
            </div>
            <p className="mt-1 text-xs text-muted">
              {exp.startDate} — {exp.endDate}
            </p>
            <ExperienceDescription text={exp.description} />
          </li>
        ))}
      </ul>
    </section>
  );
}
