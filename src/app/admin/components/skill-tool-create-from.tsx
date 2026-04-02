import { PortfolioData, Skill, SkillResource } from "@/lib/portfolio-types";
import { useState } from "react";

export function SkillToolCreateForm({
  resource,
  addLabel,
  idPlaceholder,
  disabled,
  onCreated,
}: {
  resource: SkillResource;
  addLabel: string;
  idPlaceholder: string;
  disabled: boolean;
  onCreated: (d: PortfolioData) => void;
}) {
  const empty: Skill = { id: "", name: "", level: "", icon: "" };
  const [fields, setFields] = useState(empty);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!fields.id.trim()) {
      alert(`ID is required (e.g. ${idPlaceholder})`);
      return;
    }
    const res = await fetch(`/api/${resource}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      alert(j.error || "Create failed");
      return;
    }
    onCreated(await res.json());
    setFields(empty);
  }

  return (
    <form
      onSubmit={(e) => void submit(e)}
      className="space-y-2 rounded border border-dashed border-border p-4"
    >
      <p className="text-sm font-medium text-foreground">{addLabel}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-xs">
          <span className="text-muted">ID</span>
          <input
            value={fields.id}
            onChange={(e) => setFields({ ...fields, id: e.target.value })}
            placeholder={idPlaceholder}
            className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1"
            required
          />
        </label>
        <label className="text-xs">
          <span className="text-muted">Name</span>
          <input
            value={fields.name}
            onChange={(e) => setFields({ ...fields, name: e.target.value })}
            className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1"
            required
          />
        </label>
        <label className="text-xs">
          <span className="text-muted">Level</span>
          <input
            value={fields.level}
            onChange={(e) => setFields({ ...fields, level: e.target.value })}
            className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1"
            required
          />
        </label>
        <label className="text-xs sm:col-span-2">
          <span className="text-muted">Icon URL</span>
          <input
            value={fields.icon}
            onChange={(e) => setFields({ ...fields, icon: e.target.value })}
            className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1"
            required
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={disabled}
        className="rounded border border-accent bg-accent px-3 py-1.5 text-xs text-accent-fg"
      >
        {addLabel}
      </button>
    </form>
  );
}
