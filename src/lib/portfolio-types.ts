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

export type PortfolioData = {
  experiences: Experience[];
  skills: Skill[];
  tools: Skill[];
};
