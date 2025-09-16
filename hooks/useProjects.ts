import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Project, Task, Status } from '../types';
import { INITIAL_PROJECTS, INITIAL_TASKS } from '../constants';

interface ProjectsContextData {
  projects: Project[];
  tasks: Task[];
  getTasksByProjectId: (projectId: string) => Task[];
  addProject: (name: string) => void;
  deleteProject: (projectId: string) => void;
  addTask: (taskData: Omit<Task, 'id' | 'order'>) => void;
  updateTask: (taskId: string, updates: Partial<Omit<Task, 'id'>>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, newStatus: Status, newOrder: number) => void;
  getProjectById: (projectId: string) => Project | undefined;
}

const ProjectsContext = createContext<ProjectsContextData | undefined>(undefined);

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

export const ProjectsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  const getTasksByProjectId = useCallback((projectId: string) => {
    return tasks.filter(task => task.projectId === projectId).sort((a, b) => a.order - b.order);
  }, [tasks]);

  const getProjectById = useCallback((projectId: string) => {
    return projects.find(p => p.id === projectId);
  }, [projects]);

  const addProject = (nameOrUrl: string) => {
    let projectName = nameOrUrl.trim();
    if (!projectName) return;

    // Regex to match GitHub URLs and capture the repository name.
    const githubUrlRegex = /^(?:https?:\/\/)?(?:www\.)?github\.com\/[^\/]+\/([^\/?#]+)/;
    const match = projectName.match(githubUrlRegex);

    if (match && match[1]) {
      projectName = match[1].replace(/\.git$/, ''); // Remove .git suffix if present
    }
    
    const newProject: Project = { id: generateId(), name: projectName };
    setProjects(prev => [...prev, newProject]);
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setTasks(prev => prev.filter(t => t.projectId !== projectId));
  };

  const addTask = (taskData: Omit<Task, 'id' | 'order'>) => {
    const tasksInColumn = tasks.filter(t => t.projectId === taskData.projectId && t.status === taskData.status);
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      order: tasksInColumn.length,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (taskId: string, updates: Partial<Omit<Task, 'id'>>) => {
    setTasks(prev => prev.map(task => task.id === taskId ? { ...task, ...updates } : task));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const moveTask = (taskId: string, newStatus: Status, newOrder: number) => {
    setTasks(prevTasks => {
      const taskToMove = prevTasks.find(t => t.id === taskId);
      if (!taskToMove) return prevTasks;
  
      const oldStatus = taskToMove.status;
      const projectId = taskToMove.projectId;
  
      // Create a new array to avoid direct mutation
      let updatedTasks = [...prevTasks];
  
      // Update the moved task's status and temporarily a high order
      updatedTasks = updatedTasks.map(t =>
        t.id === taskId ? { ...t, status: newStatus, order: Infinity } : t
      );
  
      // Re-order tasks in the old column
      const oldColumnTasks = updatedTasks
        .filter(t => t.projectId === projectId && t.status === oldStatus)
        .sort((a, b) => a.order - b.order);
      
      oldColumnTasks.forEach((t, index) => {
        const originalTaskIndex = updatedTasks.findIndex(ot => ot.id === t.id);
        if (originalTaskIndex !== -1) {
            updatedTasks[originalTaskIndex].order = index;
        }
      });
  
      // Re-order tasks in the new column
      const newColumnTasks = updatedTasks
        .filter(t => t.projectId === projectId && t.status === newStatus)
        .sort((a, b) => a.order - b.order);
      
      // Splice the moved task into its new position
      const taskIndexInNewColumn = newColumnTasks.findIndex(t => t.id === taskId);
      if (taskIndexInNewColumn !== -1) {
        newColumnTasks.splice(taskIndexInNewColumn, 1); // remove from current position
      }
      newColumnTasks.splice(newOrder, 0, taskToMove); // add to new position
  
      newColumnTasks.forEach((t, index) => {
        const originalTaskIndex = updatedTasks.findIndex(ot => ot.id === t.id);
        if(originalTaskIndex !== -1) {
            updatedTasks[originalTaskIndex].order = index;
            if(t.id === taskId) {
              updatedTasks[originalTaskIndex].status = newStatus;
            }
        }
      });
  
      return updatedTasks;
    });
  };

  // FIX: Replaced JSX with React.createElement to be compatible with a .ts file extension.
  // Using JSX in a .ts file causes parsing errors. This change makes the code valid TypeScript.
  return React.createElement(ProjectsContext.Provider, {
    value: { projects, tasks, getTasksByProjectId, addProject, deleteProject, addTask, updateTask, deleteTask, moveTask, getProjectById }
  }, children);
};

export const useProjects = (): ProjectsContextData => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};