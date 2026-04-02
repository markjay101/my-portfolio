import { promises as fs } from "fs";
import path from "path";
import type { PortfolioData } from "./portfolio-types";

const DATA_FILE = path.join(process.cwd(), "data", "portfolio.json");

export async function readPortfolio(): Promise<PortfolioData> {
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as PortfolioData;
}
