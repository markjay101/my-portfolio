import { Experience, PortfolioData } from "@/lib/portfolio-types";
import { useState } from "react";

export function ExperienceRow({
  exp,
  disabled,
  onSaved,
  onDelete,
}: {
  exp: Experience;
  disabled: boolean;
  onSaved: (d: PortfolioData) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(exp.title);
  const [company, setCompany] = useState(exp.company);
  const [startDate, setStartDate] = useState(exp.startDate);
  const [endDate, setEndDate] = useState(exp.endDate);
  const [description, setDescription] = useState(exp.description);

  async function save() {
    const res = await fetch(`/api/experiences/${encodeURIComponent(exp.id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        company,
        startDate,
        endDate,
        description,
      }),
    });
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      alert(j.error || "Update failed");
      return;
    }
    onSaved(await res.json());
    setEditing(false);
  }

  if (!editing) {
    return (
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-medium text-foreground">
            {exp.title} · {exp.company}
          </p>
          <p className="text-xs text-muted">
            {exp.startDate} — {exp.endDate}
          </p>
          <p className="mt-2 text-muted line-clamp-2">{exp.description}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setEditing(true)}
            className="rounded border border-border px-2 py-1 text-xs hover:border-accent"
          >
            Edit
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={onDelete}
            className="rounded border border-border px-2 py-1 text-xs text-red-500 hover:border-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-xs">
          <span className="text-muted">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1"
          />
        </label>
        <label className="text-xs">
          <span className="text-muted">Company</span>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1"
          />
        </label>
        <label className="text-xs">
          <span className="text-muted">Start</span>
          <input
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1"
          />
        </label>
        <label className="text-xs">
          <span className="text-muted">End</span>
          <input
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1"
          />
        </label>
      </div>
      <label className="block text-xs">
        <span className="text-muted">Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1"
        />
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => void save()}
          className="rounded border border-accent bg-accent px-2 py-1 text-xs text-accent-fg"
        >
          Save
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            setTitle(exp.title);
            setCompany(exp.company);
            setStartDate(exp.startDate);
            setEndDate(exp.endDate);
            setDescription(exp.description);
            setEditing(false);
          }}
          className="rounded border border-border px-2 py-1 text-xs"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
