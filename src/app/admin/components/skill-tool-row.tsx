import { PortfolioData, Skill, SkillResource } from "@/lib/portfolio-types";
import { useState } from "react";

export function SkillToolRow({
  item,
  resource,
  disabled,
  onSaved,
  onDelete,
}: {
  item: Skill;
  resource: SkillResource;
  disabled: boolean;
  onSaved: (d: PortfolioData) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [level, setLevel] = useState(item.level);
  const [icon, setIcon] = useState(item.icon);

  async function save() {
    const res = await fetch(`/api/${resource}/${encodeURIComponent(item.id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, level, icon }),
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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground">{item.name}</p>
          <p className="text-xs text-muted">{item.level}</p>
          <p className="mt-1 truncate text-xs text-muted">{item.icon}</p>
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
          <span className="text-muted">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1"
          />
        </label>
        <label className="text-xs">
          <span className="text-muted">Level</span>
          <input
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1"
          />
        </label>
      </div>
      <label className="block text-xs">
        <span className="text-muted">Icon URL</span>
        <input
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
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
            setName(item.name);
            setLevel(item.level);
            setIcon(item.icon);
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
