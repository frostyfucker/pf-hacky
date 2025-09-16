
import { Project, Task, Status } from './types';

export const KANBAN_STATUSES: Status[] = ['To Do', 'In Progress', 'Done'];

export const INITIAL_PROJECTS: Project[] = [
  { id: 'proj-1', name: 'pf' },
  { id: 'proj-2', name: 'pf-fullstack' },
  { id: 'proj-3', name: 'pf-react' },
  { id: 'proj-4', name: 'gh-repo-name' },
];

const getRelativeDate = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
};

export const INITIAL_TASKS: Task[] = [
  { id: 'task-1', projectId: 'proj-1', title: 'Setup project structure', description: 'Initialize repository and basic file structure.', status: 'Done', order: 0 },
  { id: 'task-2', projectId: 'proj-1', title: 'Design UI mockups', description: 'Create wireframes and mockups in Figma.', status: 'In Progress', order: 0, dueDate: getRelativeDate(-5) },
  { id: 'task-3', projectId: 'proj-1', title: 'Develop Kanban board component', description: 'Build the core drag-and-drop feature.', status: 'In Progress', order: 1, dueDate: getRelativeDate(-2) },
  { id: 'task-4', projectId: 'proj-1', title: 'Implement AI reporting', description: 'Integrate with Gemini API.', status: 'To Do', order: 0, dueDate: getRelativeDate(10) },
  { id: 'task-5', projectId: 'proj-2', title: 'Define database schema', description: 'Plan the tables for projects, tasks, and users.', status: 'Done', order: 0 },
  { id: 'task-6', projectId: 'proj-2', title: 'Build REST API endpoints', status: 'In Progress', order: 0 },
  { id: 'task-7', projectId: 'proj-2', title: 'Setup user authentication', status: 'To Do', order: 0, dueDate: getRelativeDate(20) },
  { id: 'task-8', projectId: 'proj-3', title: 'Component library selection', status: 'Done', order: 0 },
  { id: 'task-9', projectId: 'proj-3', title: 'State management with Context', description: 'Implement global state for projects.', status: 'Done', order: 1 },
  { id: 'task-10', projectId: 'proj-4', title: 'Write project README', status: 'To Do', order: 0 },
];