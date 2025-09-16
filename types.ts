
export type Status = 'To Do' | 'In Progress' | 'Done';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: Status;
  imageUrl?: string; // base64 string
  order: number;
  dueDate?: string; // YYYY-MM-DD format
}

export interface Project {
  id: string;
  name: string;
}