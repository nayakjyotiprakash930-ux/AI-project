// Axios-based API service for AI Project Mentor.
//
// This file is the single place where the React frontend talks to the
// (future) Python/FastAPI backend. While the backend is not ready, we
// keep using mock data by setting VITE_USE_MOCK_DATA=true.
//
// To switch to the real backend:
//   1. Start the FastAPI server (see README for the planned endpoints).
//   2. Set VITE_USE_MOCK_DATA=false in your .env file.
// All functions below already match the planned endpoint shapes, so
// page components do not need to change.

import axios from 'axios';
import {
  mockProjects,
  mockTasks,
  mockInteractions,
  nextIds,
} from '../data/mockData';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
const useMock =
  (import.meta.env.VITE_USE_MOCK_DATA ?? 'true').toString() !== 'false';

export const api = axios.create({
  baseURL: `${baseURL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// In-memory stores used only while running on mock data.
const store = {
  projects: mockProjects(),
  tasks: mockTasks(),
  interactions: mockInteractions(),
};

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

// ---- Projects ---------------------------------------------------------------

export async function getProjects() {
  if (useMock) {
    await delay();
    return store.projects.map((p) => ({ ...p }));
  }
  return (await api.get('/projects')).data;
}

export async function getProjectById(projectId) {
  if (useMock) {
    await delay();
    const p = store.projects.find((x) => x.id === Number(projectId));
    if (!p) throw new Error('Project could not be found.');
    return { ...p };
  }
  return (await api.get(`/projects/${projectId}`)).data;
}

export async function createProject(projectData) {
  if (useMock) {
    await delay();
    const project = { ...projectData, id: nextIds.project() };
    store.projects.push(project);
    return { ...project };
  }
  return (await api.post('/projects', projectData)).data;
}

export async function updateProject(projectId, projectData) {
  if (useMock) {
    await delay();
    const idx = store.projects.findIndex((p) => p.id === Number(projectId));
    if (idx === -1) throw new Error('Project could not be found.');
    store.projects[idx] = { ...store.projects[idx], ...projectData };
    return { ...store.projects[idx] };
  }
  return (await api.put(`/projects/${projectId}`, projectData)).data;
}

export async function deleteProject(projectId) {
  if (useMock) {
    await delay();
    store.projects = store.projects.filter((p) => p.id !== Number(projectId));
    store.tasks = store.tasks.filter((t) => t.projectId !== Number(projectId));
    return { success: true };
  }
  return (await api.delete(`/projects/${projectId}`)).data;
}

// ---- Tasks ------------------------------------------------------------------

export async function getTasks() {
  if (useMock) {
    await delay();
    return store.tasks.map((t) => ({ ...t }));
  }
  return (await api.get('/tasks')).data;
}

export async function createTask(taskData) {
  if (useMock) {
    await delay();
    const task = {
      ...taskData,
      id: nextIds.task(),
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    store.tasks.push(task);
    return { ...task };
  }
  return (await api.post('/tasks', taskData)).data;
}

export async function updateTask(taskId, taskData) {
  if (useMock) {
    await delay();
    const idx = store.tasks.findIndex((t) => t.id === Number(taskId));
    if (idx === -1) throw new Error('Task could not be found.');
    store.tasks[idx] = {
      ...store.tasks[idx],
      ...taskData,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    return { ...store.tasks[idx] };
  }
  return (await api.put(`/tasks/${taskId}`, taskData)).data;
}

export async function updateTaskStatus(taskId, status) {
  if (useMock) {
    await delay();
    const idx = store.tasks.findIndex((t) => t.id === Number(taskId));
    if (idx === -1) throw new Error('Task could not be found.');
    store.tasks[idx] = {
      ...store.tasks[idx],
      status,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    return { ...store.tasks[idx] };
  }
  return (await api.patch(`/tasks/${taskId}/status`, { status })).data;
}

export async function deleteTask(taskId) {
  if (useMock) {
    await delay();
    store.tasks = store.tasks.filter((t) => t.id !== Number(taskId));
    return { success: true };
  }
  return (await api.delete(`/tasks/${taskId}`)).data;
}

// ---- AI ---------------------------------------------------------------------

export async function generateAIPlan(requestData) {
  if (useMock) {
    await delay(700);
    const project = store.projects.find((p) => p.id === Number(requestData.projectId));
    const interaction = {
      id: nextIds.interaction(),
      projectId: Number(requestData.projectId),
      taskType: requestData.taskType,
      prompt: requestData.prompt,
      response: buildMockAIResponse(requestData, project?.name || 'the project'),
      modelName: 'gpt-oss:20b',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    store.interactions.push(interaction);
    return { ...interaction };
  }
  return (await api.post('/ai/plan', requestData)).data;
}

export async function getAIHistory(projectId) {
  if (useMock) {
    await delay();
    const all = store.interactions.map((i) => ({ ...i }));
    if (projectId === undefined || projectId === null || projectId === '') {
      return all;
    }
    return all.filter((i) => i.projectId === Number(projectId));
  }
  return (await api.get(`/ai/history/${projectId ?? ''}`)).data;
}

export async function deleteAIHistory(interactionId) {
  if (useMock) {
    await delay();
    store.interactions = store.interactions.filter(
      (i) => i.id !== Number(interactionId),
    );
    return { success: true };
  }
  return (await api.delete(`/ai/history/${interactionId}`)).data;
}

// ---- Dashboard / health -----------------------------------------------------

export async function getDashboardStatistics() {
  if (useMock) {
    await delay();
    const projects = store.projects;
    const tasks = store.tasks;
    return {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      pendingTasks: tasks.filter((t) => t.status === 'Pending').length,
      inProgressTasks: tasks.filter((t) => t.status === 'In Progress').length,
      completedTasks: tasks.filter((t) => t.status === 'Completed').length,
    };
  }
  return (await api.get('/dashboard')).data;
}

export async function checkBackendHealth() {
  if (useMock) {
    await delay(100);
    return { status: 'mock', message: 'Running with mock data.' };
  }
  return (await api.get('/health')).data;
}

// ---- Mock AI response builder ----------------------------------------------

function buildMockAIResponse(requestData, projectName) {
  const { taskType, prompt } = requestData;
  const intro = `Requirement Understanding: You asked the AI Mentor to "${taskType}" for ${projectName}. Prompt: "${prompt}".`;

  const sections = {
    'Generate Project Plan': {
      'Frontend Tasks': 'Set up project layout, routing, and shared components.',
      'Backend Tasks': 'Define FastAPI routers and Pydantic models.',
      'Database Tasks': 'Create core tables and seed reference data.',
      'Testing Steps': 'Write unit tests for each API route.',
      'Possible Blockers': 'Unclear requirements for user roles.',
      'Recommended Next Action': 'Start with database schema and core models.',
    },
    'Break Requirement into Tasks': {
      'Frontend Tasks': 'List page, form page, and details page.',
      'Backend Tasks': 'CRUD endpoints with validation.',
      'Database Tasks': 'Main table with indexes on lookup columns.',
      'Testing Steps': 'Test create, update, and delete flows.',
      'Possible Blockers': 'Validation rules may need product input.',
      'Recommended Next Action': 'Implement the database table first.',
    },
    'Recommend Next Task': {
      'Frontend Tasks': 'Continue the highest-priority pending screen.',
      'Backend Tasks': 'Finish the in-progress endpoint.',
      'Database Tasks': 'Add missing indexes.',
      'Testing Steps': 'Add integration tests for the in-progress module.',
      'Possible Blockers': 'Blocked on requirements clarification.',
      'Recommended Next Action': 'Complete the task currently In Progress.',
    },
    'Identify Project Blockers': {
      'Frontend Tasks': 'Improve loading and error states.',
      'Backend Tasks': 'Add error handling and logging.',
      'Database Tasks': 'Review foreign key constraints.',
      'Testing Steps': 'Add negative-path tests.',
      'Possible Blockers': 'Race conditions on concurrent updates.',
      'Recommended Next Action': 'Add constraints to prevent invalid states.',
    },
    'Explain Implementation': {
      'Frontend Tasks': 'Use a controlled form with validation hooks.',
      'Backend Tasks': 'Validate input with Pydantic before processing.',
      'Database Tasks': 'Use a transaction for multi-step writes.',
      'Testing Steps': 'Test the happy path and one error path.',
      'Possible Blockers': 'Edge cases in input formatting.',
      'Recommended Next Action': 'Write the backend endpoint first.',
    },
    'Generate Testing Checklist': {
      'Frontend Tasks': 'Test form validation and empty states.',
      'Backend Tasks': 'Test auth, validation, and error responses.',
      'Database Tasks': 'Test constraints and cascade behavior.',
      'Testing Steps': 'Run unit, integration, and smoke tests.',
      'Possible Blockers': 'Flaky async tests.',
      'Recommended Next Action': 'Add integration tests for the main flow.',
    },
  };

  const picked = sections[taskType] || sections['Break Requirement into Tasks'];
  return [intro, ...Object.entries(picked).map(([k, v]) => `${k}: ${v}`)].join('\n');
}
