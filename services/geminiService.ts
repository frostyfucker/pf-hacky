
import { GoogleGenAI } from "@google/genai";
import { Project, Task } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateProjectReport = async (project: Project, tasks: Task[], refinePrompt?: string): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("Error: API_KEY is not configured. Please set the API_KEY environment variable.");
  }
  
  const tasksToDo = tasks.filter(t => t.status === 'To Do').map(t => `- ${t.title}`).join('\n');
  const tasksInProgress = tasks.filter(t => t.status === 'In Progress').map(t => `- ${t.title}`).join('\n');
  const tasksDone = tasks.filter(t => t.status === 'Done').map(t => `- ${t.title}`).join('\n');

  const prompt = `
    Analyze the following project status and generate a concise report in Markdown format.
    The report should include:
    1. A brief "Project Status Summary".
    2. A list of "Next Priority Actions" based on the tasks in the "To Do" and "In Progress" columns.

    Project Name: ${project.name}

    Tasks To Do:
    ${tasksToDo || 'None'}

    Tasks In Progress:
    ${tasksInProgress || 'None'}

    Tasks Done:
    ${tasksDone || 'None'}

    ${refinePrompt ? `User Refinement: ${refinePrompt}` : ''}
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Error generating AI report:", error);
    return "An error occurred while generating the report. Please check the console for details.";
  }
};
