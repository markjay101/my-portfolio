import type { Skill } from "@/lib/portfolio-types";

export function ToolsSection({ items }: { items: Skill[] }) {
  return (
    <section className="py-12 sm:py-16">
      <h2 className="mb-8 text-lg font-semibold text-foreground">Tools</h2>
      <ul className="flex flex-wrap gap-4">
        {items.map((tool) => (
          <li
            key={tool.id}
            className="flex items-center gap-3 rounded border border-border bg-surface px-4 py-3"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tool.icon}
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 shrink-0 opacity-90"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-foreground">
                {tool.name}
              </p>
              <p className="text-xs text-muted">{tool.level}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
