import { Experience, PortfolioData } from "@/lib/portfolio-types";
import { useState } from "react";

export function ExperienceCreateForm({
  disabled,
  onCreated,
}: {
  disabled: boolean;
  onCreated: (d: PortfolioData) => void;
}) {
  const empty: Experience = {
    id: "",
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
  };
  const [fields, setFields] = useState(empty);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!fields.id.trim()) {
      alert("ID is required (e.g. exp-2)");
      return;
    }
    const res = await fetch("/api/experiences", {
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
      <p className="text-sm font-medium text-foreground">Add experience</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-xs">
          <span className="text-muted">ID</span>
          <input
            value={fields.id}
            onChange={(e) => setFields({ ...fields, id: e.target.value })}
            placeholder="exp-2"
            className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1"
            required
          />
        </label>
        <label className="text-xs">
          <span className="text-muted">Title</span>
          <input
            value={fields.title}
            onChange={(e) => setFields({ ...fields, title: e.target.value })}
            className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1"
            required
          />
        </label>
        <label className="text-xs">
          <span className="text-muted">Company</span>
          <input
            value={fields.company}
            onChange={(e) => setFields({ ...fields, company: e.target.value })}
            className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1"
            required
          />
        </label>
        <label className="text-xs">
          <span className="text-muted">Start</span>
          <input
            value={fields.startDate}
            onChange={(e) =>
              setFields({ ...fields, startDate: e.target.value })
            }
            placeholder="2024-01"
            className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1"
            required
          />
        </label>
        <label className="text-xs">
          <span className="text-muted">End</span>
          <input
            value={fields.endDate}
            onChange={(e) => setFields({ ...fields, endDate: e.target.value })}
            className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1"
            required
          />
        </label>
      </div>
      <label className="block text-xs">
        <span className="text-muted">Description</span>
        <textarea
          value={fields.description}
          onChange={(e) =>
            setFields({ ...fields, description: e.target.value })
          }
          rows={2}
          className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1"
          required
        />
      </label>
      <button
        type="submit"
        disabled={disabled}
        className="rounded border border-accent bg-accent px-3 py-1.5 text-xs text-accent-fg"
      >
        Add experience
      </button>
    </form>
  );
}
