
export type TaskCategory = 'sale' | 'social' | 'admin' | 'prod' | 'biz';

export interface Task {
  id: number;
  title: string;
  date: string;
  cat: TaskCategory;
  xp: number;
  completed: boolean;
  value?: number;
  projectId?: number;
  projectTitle?: string;
  deadline?: string;
  order?: number;
  completedAt?: string;
  isBossTask?: boolean; // New for Boss Battles
}

export interface SocialGoal {
  current: number;
  target: number;
  platform: 'Instagram' | 'LinkedIn' | 'Behance';
  isAchieved: boolean;
}

export interface ArchivedProject {
  id: number;
  title: string;
  grade: 'S' | 'A' | 'B' | 'C';
  completedDate: string;
  totalValue: number;
  type: string;
}

export interface GameState {
  xpFreelance: number;
  xpReligion: number;
  xp: number;
  money: number;
  streak: number;
  prestige: number; // New: Boss Battle wins
  lastLoginDate: string;
  tasks: Task[];
  archivedProjects: ArchivedProject[]; // New: Hall of Fame
  startDate: string | null;
  projectAdjustments: Record<number, number>;
  currentGrowthGoal?: string;
  socialGoal: SocialGoal;
  roadmapStage?: number;
}

export interface ProjectSummary {
  projectId: number;
  title: string;
  startDate: string;
  deadline: string;
  totalXp: number;
  totalValue: number;
  totalSteps: number;
  doneSteps: number;
  basePercent: number;
  extraPercent: number;
  progressPercent: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type Priority = 'Low' | 'Medium' | 'High';

export type TabView = 'today' | 'calendar' | 'generator' | 'tasks_plus' | 'stats' | 'profile' | 'add';

export interface HeaderProps {
  xp: number;
  money: number;
  streak: number;
  currentGoal?: string;
  socialGoal?: SocialGoal;
}