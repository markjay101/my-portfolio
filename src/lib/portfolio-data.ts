import { promises as fs } from "fs";
import path from "path";
import type { Experience, PortfolioData, Skill } from "./portfolio-types";

const DATA_FILE = path.join(process.cwd(), "data", "portfolio.json");

function serialize(data: PortfolioData): string {
  return `${JSON.stringify(data, null, 2)}\n`;
}

export async function readPortfolio(): Promise<PortfolioData> {
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  const data = JSON.parse(raw) as PortfolioData;
  if (!data.tools) data.tools = [];
  return data;
}

export async function writePortfolio(data: PortfolioData): Promise<void> {
  await fs.writeFile(DATA_FILE, serialize(data), "utf-8");
}

export async function addExperience(exp: Experience): Promise<PortfolioData> {
  const data = await readPortfolio();
  data.experiences.push(exp);
  await writePortfolio(data);
  return data;
}

export async function updateExperience(
  id: string,
  patch: Partial<Omit<Experience, "id">>,
): Promise<PortfolioData> {
  const data = await readPortfolio();
  const i = data.experiences.findIndex((e) => e.id === id);
  if (i === -1) throw new Error("Experience not found");
  data.experiences[i] = { ...data.experiences[i], ...patch, id };
  await writePortfolio(data);
  return data;
}

export async function deleteExperience(id: string): Promise<PortfolioData> {
  const data = await readPortfolio();
  data.experiences = data.experiences.filter((e) => e.id !== id);
  await writePortfolio(data);
  return data;
}

export async function addSkill(skill: Skill): Promise<PortfolioData> {
  const data = await readPortfolio();
  data.skills.push(skill);
  await writePortfolio(data);
  return data;
}

export async function updateSkill(
  id: string,
  patch: Partial<Omit<Skill, "id">>,
): Promise<PortfolioData> {
  const data = await readPortfolio();
  const i = data.skills.findIndex((s) => s.id === id);
  if (i === -1) throw new Error("Skill not found");
  data.skills[i] = { ...data.skills[i], ...patch, id };
  await writePortfolio(data);
  return data;
}

export async function deleteSkill(id: string): Promise<PortfolioData> {
  const data = await readPortfolio();
  data.skills = data.skills.filter((s) => s.id !== id);
  await writePortfolio(data);
  return data;
}

export async function addTool(tool: Skill): Promise<PortfolioData> {
  const data = await readPortfolio();
  data.tools.push(tool);
  await writePortfolio(data);
  return data;
}

export async function updateTool(
  id: string,
  patch: Partial<Omit<Skill, "id">>,
): Promise<PortfolioData> {
  const data = await readPortfolio();
  const i = data.tools.findIndex((t) => t.id === id);
  if (i === -1) throw new Error("Tool not found");
  data.tools[i] = { ...data.tools[i], ...patch, id };
  await writePortfolio(data);
  return data;
}

export async function deleteTool(id: string): Promise<PortfolioData> {
  const data = await readPortfolio();
  data.tools = data.tools.filter((t) => t.id !== id);
  await writePortfolio(data);
  return data;
}
