export type Experience = {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type Skill = {
  id: string;
  name: string;
  level: string;
  icon: string;
};

export type Project = {
  id: string;
  name: string;
  url: string | null;
  company: string;
  startDate: string;
  endDate: string;
  image: string | null;
  description: string;
  skills: string[];
  tools: string[];
};

export type PortfolioData = {
  experiences: Experience[];
  skills: Skill[];
  tools: Skill[];
  projects: Project[];
};

export type SkillResource = "skills" | "tools";
