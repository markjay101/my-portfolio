"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Experience, PortfolioData, Skill } from "@/lib/portfolio-types";

async function fetchPortfolio(): Promise<PortfolioData> {
  const res = await fetch("/api/portfolio", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load portfolio");
  return res.json();
}

export function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loadError, setLoadError] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    setLoadError("");
    try {
      setData(await fetchPortfolio());
    } catch {
      setLoadError("Could not load data.");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function delExperience(id: string) {
    if (!confirm("Delete this experience?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/experiences/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        alert(j.error || "Delete failed");
        return;
      }
      setData(await res.json());
    } finally {
      setBusy(false);
    }
  }

  async function delSkill(id: string) {
    if (!confirm("Delete this skill?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/skills/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        alert(j.error || "Delete failed");
        return;
      }
      setData(await res.json());
    } finally {
      setBusy(false);
    }
  }

  if (!data && !loadError) {
    return (
      <p className="p-8 text-center text-sm text-muted">Loading…</p>
    );
  }

  if (loadError || !data) {
    return (
      <p className="p-8 text-center text-sm text-red-500">{loadError}</p>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Admin</h1>
          <p className="text-sm text-muted">Manage experiences and skills</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            className="rounded border border-border px-3 py-1.5 text-sm text-foreground transition hover:border-accent"
          >
            View site
          </Link>
          <button
            type="button"
            onClick={() => void logout()}
            className="rounded border border-border px-3 py-1.5 text-sm text-muted transition hover:border-accent"
          >
            Log out
          </button>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="mb-4 text-base font-semibold text-foreground">
          Experiences
        </h2>
        <ul className="mb-6 space-y-4">
          {data.experiences.map((exp) => (
            <li
              key={exp.id}
              className="rounded border border-border bg-surface p-4 text-sm"
            >
              <ExperienceRow
                exp={exp}
                disabled={busy}
                onSaved={setData}
                onDelete={() => void delExperience(exp.id)}
              />
            </li>
          ))}
        </ul>
        <ExperienceCreateForm
          disabled={busy}
          onCreated={setData}
        />
      </section>

      <section>
        <h2 className="mb-4 text-base font-semibold text-foreground">Skills</h2>
        <ul className="mb-6 space-y-4">
          {data.skills.map((skill) => (
            <li
              key={skill.id}
              className="rounded border border-border bg-surface p-4 text-sm"
            >
              <SkillRow
                skill={skill}
                disabled={busy}
                onSaved={setData}
                onDelete={() => void delSkill(skill.id)}
              />
            </li>
          ))}
        </ul>
        <SkillCreateForm disabled={busy} onCreated={setData} />
      </section>
    </div>
  );
}

function ExperienceRow({
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
          <p className="mt-2 text-muted">{exp.description}</p>
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

function ExperienceCreateForm({
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

function SkillRow({
  skill,
  disabled,
  onSaved,
  onDelete,
}: {
  skill: Skill;
  disabled: boolean;
  onSaved: (d: PortfolioData) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(skill.name);
  const [level, setLevel] = useState(skill.level);
  const [icon, setIcon] = useState(skill.icon);

  async function save() {
    const res = await fetch(`/api/skills/${encodeURIComponent(skill.id)}`, {
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
        <div>
          <p className="font-medium text-foreground">{skill.name}</p>
          <p className="text-xs text-muted">{skill.level}</p>
          <p className="mt-1 truncate text-xs text-muted">{skill.icon}</p>
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
            setName(skill.name);
            setLevel(skill.level);
            setIcon(skill.icon);
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

function SkillCreateForm({
  disabled,
  onCreated,
}: {
  disabled: boolean;
  onCreated: (d: PortfolioData) => void;
}) {
  const empty: Skill = { id: "", name: "", level: "", icon: "" };
  const [fields, setFields] = useState(empty);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!fields.id.trim()) {
      alert("ID is required (e.g. skill-3)");
      return;
    }
    const res = await fetch("/api/skills", {
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
      <p className="text-sm font-medium text-foreground">Add skill</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-xs">
          <span className="text-muted">ID</span>
          <input
            value={fields.id}
            onChange={(e) => setFields({ ...fields, id: e.target.value })}
            placeholder="skill-3"
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
        Add skill
      </button>
    </form>
  );
}
