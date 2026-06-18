// Single source of truth for module and task hierarchy.
// When adding new tasks: add a TaskConfig entry here with its own moduleAttempted key,
// then create matching persona and rubric files in lib/prompts/.

export interface TaskConfig {
  id: string;
  title: string;
  description: string;
  moduleAttempted: string; // value stored in DB consultation_history.module_attempted
  status: 'active' | 'coming_soon';
  type?: 'consultation' | 'quiz' | 'playbook'; // defaults to 'consultation' when absent
}

export interface ModuleConfig {
  id: string;
  title: string;
  description: string;
  tasks: TaskConfig[];
  adminOnly?: boolean; // when true, only admins can see and access this module
}

// Total max marks per task (sum of that task's rubric section max_scores).
// Tasks have different totals, so any cross-task average must be normalised first.
export const MODULE_MAX_SCORE: Record<string, number> = {
  module_1_seepage: 45,
  module_1_task2: 50,
  module_1_task3: 45,
  module_2_task1: 30,
  module_2_task2: 20,
  module_3_task1: 10,
  module_3_task2: 10,
  module_3_task3: 10,
  module_4_task1: 30,
  module_5_task1: 20,
  module_5_task2: 15,
};

// Common scale all scores are normalised onto for cross-task averaging.
export const NORMALISED_MAX = 50;

// Rescale a raw task score onto NORMALISED_MAX (e.g. 5/10 → 25/50).
// Unknown tasks are left untouched so we never silently divide by an undefined max.
export function normaliseScore(score: number, moduleAttempted: string): number {
  const max = MODULE_MAX_SCORE[moduleAttempted];
  if (!max || max <= 0) return score;
  return (score / max) * NORMALISED_MAX;
}

// Per-scenario session time limit in minutes, keyed by `${moduleId}/${taskId}`.
// Anything not listed uses DEFAULT_SESSION_MINUTES. The on-screen "1 minute left"
// warning fires 1 minute before the limit, and the session auto-ends at the limit.
export const DEFAULT_SESSION_MINUTES = 8;
export const SESSION_MINUTES: Record<string, number> = {
  'module_4/task_1': 12,
};
export function getSessionMinutes(moduleId: string, taskId: string): number {
  return SESSION_MINUTES[`${moduleId}/${taskId}`] ?? DEFAULT_SESSION_MINUTES;
}

export const MODULE_CONFIG: Record<string, ModuleConfig> = {
  module_2: {
    id: 'module_2',
    title: 'Design Finalisation — Objection Handling',
    description: 'Guide confused customers to a confident design decision using empathy, discovery and expert recommendation',
    tasks: [
      {
        id: 'task_1',
        title: 'Task 1 of Module 2',
        description: 'Customer has seen 3 wall panel designs and is confused which to choose. Guide them to a final decision without pressure.',
        moduleAttempted: 'module_2_task1', // ← persona: module2-task1-persona.ts | rubric: module2-task1-rubric.ts
        status: 'active',
      },
      {
        id: 'task_2',
        title: 'Task 2 of Module 2',
        description: 'Design is finalised and price is settled — but the customer is anxious about whether the real installed wall will match the image. Your job is to build genuine confidence.',
        moduleAttempted: 'module_2_task2',
        status: 'active',
      },
      { id: 'task_3', title: 'Coming Soon', description: '', moduleAttempted: '', status: 'coming_soon' },
    ],
  },
  module_3: {
    id: 'module_3',
    title: 'Levers Used',
    description: 'The introduction and full consultation are done and the design is finalised — only the booking decision is pending',
    adminOnly: true, // live for admins only for now
    tasks: [
      {
        id: 'task_1',
        title: 'Task 1 of Module 3',
        description: 'The full process is almost done and the customer likes the design — only the booking decision is pending.',
        moduleAttempted: 'module_3_task1', // ← persona: module3-task1-persona.ts | rubric: module3-task1-rubric.ts
        status: 'active',
      },
      {
        id: 'task_2',
        title: 'Task 2 of Module 3',
        description: 'The full process is almost done and the customer is satisfied with the design — only the booking decision is pending.',
        moduleAttempted: 'module_3_task2', // ← persona: module3-task2-persona.ts | rubric: module3-task2-rubric.ts
        status: 'active',
      },
      {
        id: 'task_3',
        title: 'Task 3 of Module 3',
        description: 'The full process is almost done and the customer likes the design — only the booking decision is pending.',
        moduleAttempted: 'module_3_task3', // ← persona: module3-task3-persona.ts | rubric: module3-task3-rubric.ts
        status: 'active',
      },
    ],
  },
  module_4: {
    id: 'module_4',
    title: 'Market Comparison',
    description: 'The design is selected, but the customer thinks the market is much cheaper and wants to know why you cost more',
    adminOnly: true, // live for admins only for now
    tasks: [
      {
        id: 'task_1',
        title: 'Task 1 of Module 4',
        description: 'The design is selected, but the customer believes similar panels are far cheaper in the market and keeps asking why your solution costs more. Address this and win their confidence to move ahead.',
        moduleAttempted: 'module_4_task1', // ← persona: module4-task1-persona.ts | rubric: module4-task1-rubric.ts
        status: 'active',
      },
      { id: 'task_2', title: 'Coming Soon', description: '', moduleAttempted: '', status: 'coming_soon' },
    ],
  },
  module_5: {
    id: 'module_5',
    title: 'NIO Premium Panels',
    description: 'The quality you always wanted at the price you never expected',
    adminOnly: true,
    tasks: [
      {
        id: 'task_1',
        title: 'NIO Product Knowledge Quiz',
        description: 'Test your NIO panel knowledge — pricing strategy, technical specs, objection handling, and sales positioning. 15 questions, instant feedback.',
        moduleAttempted: 'module_5_task2',
        type: 'quiz',
        status: 'active',
      },
      {
        id: 'task_2',
        title: 'Task 2 of Module 5',
        description: 'Introduce NIO panels to a curious, price-conscious homeowner comparing NIO panels.',
        moduleAttempted: 'module_5_task1',
        status: 'active',
      },
      {
        id: 'task_3',
        title: 'NIO Pitch Playbook',
        description: 'The complete guide to selling NIO panels like a world-class RM — customer psychology, ideal Hinglish responses, emotional levers, and the winning path.',
        moduleAttempted: '',
        type: 'playbook',
        status: 'active',
      },
    ],
  },
  module_1: {
    id: 'module_1',
    title: 'Know the Budget of Your Customer',
    description: 'Master budget discovery across different customer and wall scenarios',
    tasks: [
      {
        id: 'task_1',
        title: 'Task 1 of Module 1',
        description:
          'Conduct a home visit, understand the customer\'s problem and requirements, and discover their budget through natural conversation',
        moduleAttempted: 'module_1_seepage', // ← persona: module1-task1-persona.ts | rubric: module1-task1-rubric.ts
        status: 'active',
      },
      {
        id: 'task_2',
        title: 'Task 2 of Module 1',
        description: 'Conduct a home visit for a newly constructed flat, understand aesthetic requirements, handle market comparisons, and discover budget',
        moduleAttempted: 'module_1_task2',
        status: 'active',
      },
      {
        id: 'task_3',
        title: 'Task 3 of Module 1',
        description: 'Conduct a home visit for a value-focused customer with a seepage wall, handle budget resistance, and discover their spending range through logic and analogies',
        moduleAttempted: 'module_1_task3', // ← persona: module1-task3-persona.ts | rubric: module1-task3-rubric.ts
        status: 'active',
      },
      { id: 'task_4', title: 'Coming Soon', description: '', moduleAttempted: '', status: 'coming_soon' },
      { id: 'task_5', title: 'Coming Soon', description: '', moduleAttempted: '', status: 'coming_soon' },
    ],
  },
};

export function getModuleConfig(moduleId: string): ModuleConfig | null {
  return MODULE_CONFIG[moduleId] ?? null;
}

export function getTaskConfig(moduleId: string, taskId: string): TaskConfig | null {
  return MODULE_CONFIG[moduleId]?.tasks.find(t => t.id === taskId) ?? null;
}

// Reverse-lookup: given a DB module_attempted value, return the module/task URL path.
export function resolveTaskPath(moduleAttempted: string): { moduleId: string; taskId: string } | null {
  for (const [moduleId, mod] of Object.entries(MODULE_CONFIG)) {
    for (const task of mod.tasks) {
      if (task.moduleAttempted === moduleAttempted) {
        return { moduleId, taskId: task.id };
      }
    }
  }
  return null;
}
