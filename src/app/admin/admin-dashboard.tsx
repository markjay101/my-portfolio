"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Experience, PortfolioData, Skill } from "@/lib/portfolio-types";
import { ExperienceRow } from "./components/experience-row";
import { ExperienceCreateForm } from "./components/experience-create-form";
import { SkillToolCreateForm } from "./components/skill-tool-create-from";
import { SkillToolRow } from "./components/skill-tool-row";

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

  async function delTool(id: string) {
    if (!confirm("Delete this tool?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/tools/${encodeURIComponent(id)}`, {
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
    return <p className="p-8 text-center text-sm text-muted">Loading…</p>;
  }

  if (loadError || !data) {
    return <p className="p-8 text-center text-sm text-red-500">{loadError}</p>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Admin</h1>
          <p className="text-sm text-muted">
            Manage experiences, skills, and tools
          </p>
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
        <ExperienceCreateForm disabled={busy} onCreated={setData} />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-base font-semibold text-foreground">Skills</h2>
        <ul className="mb-6 space-y-4">
          {data.skills.map((skill) => (
            <li
              key={skill.id}
              className="rounded border border-border bg-surface p-4 text-sm"
            >
              <SkillToolRow
                item={skill}
                resource="skills"
                disabled={busy}
                onSaved={setData}
                onDelete={() => void delSkill(skill.id)}
              />
            </li>
          ))}
        </ul>
        <SkillToolCreateForm
          resource="skills"
          addLabel="Add skill"
          idPlaceholder="skill-3"
          disabled={busy}
          onCreated={setData}
        />
      </section>

      <section>
        <h2 className="mb-4 text-base font-semibold text-foreground">Tools</h2>
        <ul className="mb-6 space-y-4">
          {data.tools.map((tool) => (
            <li
              key={tool.id}
              className="rounded border border-border bg-surface p-4 text-sm"
            >
              <SkillToolRow
                item={tool}
                resource="tools"
                disabled={busy}
                onSaved={setData}
                onDelete={() => void delTool(tool.id)}
              />
            </li>
          ))}
        </ul>
        <SkillToolCreateForm
          resource="tools"
          addLabel="Add tool"
          idPlaceholder="tool-17"
          disabled={busy}
          onCreated={setData}
        />
      </section>
    </div>
  );
}
