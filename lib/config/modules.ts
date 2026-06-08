// Single source of truth for module and task hierarchy.
// When adding new tasks: add a TaskConfig entry here with its own moduleAttempted key,
// then create matching persona and rubric files in lib/prompts/.

export interface TaskConfig {
  id: string;
  title: string;
  description: string;
  moduleAttempted: string; // value stored in DB consultation_history.module_attempted
  status: 'active' | 'coming_soon';
}

export interface ModuleConfig {
  id: string;
  title: string;
  description: string;
  tasks: TaskConfig[];
}

export const MODULE_CONFIG: Record<string, ModuleConfig> = {
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
      { id: 'task_3', title: 'Coming Soon', description: '', moduleAttempted: '', status: 'coming_soon' },
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
