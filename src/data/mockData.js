// Mock data for the AI Project Mentor frontend.
// This file is the single source of mock data used while the
// Python/FastAPI backend is not yet connected. When the backend is
// ready, replace the mock data access in src/services/api.js with
// real Axios calls and set VITE_USE_MOCK_DATA=false.

let nextProjectId = 4;
let nextTaskId = 11;
let nextInteractionId = 5;

const seedProjects = [
  {
    id: 1,
    name: 'Student Placement Portal',
    description:
      'A portal where students can view placement drives, apply to companies, and track their application status. Admins can manage companies and drives.',
    stack: 'React, FastAPI, SQL Server, Ollama',
    createdAt: '2026-07-04',
  },
  {
    id: 2,
    name: 'Hospital Appointment System',
    description:
      'A booking system that lets patients book appointments with doctors by department and time slot, with email reminders and admin management.',
    stack: 'React, FastAPI, SQL Server',
    createdAt: '2026-07-18',
  },
  {
    id: 3,
    name: 'AI Resume Mentor',
    description:
      'An AI-powered resume review tool that scores resumes, suggests improvements, and generates tailored summaries using a GPT-OSS model.',
    stack: 'React, FastAPI, SQL Server, GPT-OSS',
    createdAt: '2026-08-01',
  },
];

const seedTasks = [
  {
    id: 1,
    projectId: 1,
    title: 'Design login and signup screens',
    description: 'Create responsive auth screens with form validation.',
    priority: 'High',
    status: 'Completed',
    aiGenerated: false,
    createdAt: '2026-07-05',
    updatedAt: '2026-07-09',
  },
  {
    id: 2,
    projectId: 1,
    title: 'Build student profile API',
    description: 'CRUD endpoints for student profile data in FastAPI.',
    priority: 'High',
    status: 'In Progress',
    aiGenerated: false,
    createdAt: '2026-07-06',
    updatedAt: '2026-08-10',
  },
  {
    id: 3,
    projectId: 1,
    title: 'Create companies table in SQL Server',
    description: 'Define schema for companies, drives, and applications.',
    priority: 'Medium',
    status: 'Completed',
    aiGenerated: false,
    createdAt: '2026-07-07',
    updatedAt: '2026-07-12',
  },
  {
    id: 4,
    projectId: 1,
    title: 'Apply to drive flow',
    description: 'Frontend flow for students to apply to a placement drive.',
    priority: 'Medium',
    status: 'Pending',
    aiGenerated: false,
    createdAt: '2026-07-20',
    updatedAt: '2026-07-20',
  },
  {
    id: 5,
    projectId: 2,
    title: 'Doctor availability calendar',
    description: 'Calendar component showing doctor slots by day.',
    priority: 'High',
    status: 'In Progress',
    aiGenerated: false,
    createdAt: '2026-07-19',
    updatedAt: '2026-08-12',
  },
  {
    id: 6,
    projectId: 2,
    title: 'Appointment booking API',
    description: 'POST/GET endpoints for appointments with conflict checks.',
    priority: 'High',
    status: 'Pending',
    aiGenerated: false,
    createdAt: '2026-07-22',
    updatedAt: '2026-07-22',
  },
  {
    id: 7,
    projectId: 2,
    title: 'Patient registration form',
    description: 'Frontend form with validation and accessibility labels.',
    priority: 'Low',
    status: 'Completed',
    aiGenerated: false,
    createdAt: '2026-07-25',
    updatedAt: '2026-07-30',
  },
  {
    id: 8,
    projectId: 3,
    title: 'Resume upload and parser',
    description: 'Upload PDF/DOCX and extract text sections for analysis.',
    priority: 'High',
    status: 'In Progress',
    aiGenerated: false,
    createdAt: '2026-08-02',
    updatedAt: '2026-08-15',
  },
  {
    id: 9,
    projectId: 3,
    title: 'AI resume scoring endpoint',
    description: 'FastAPI endpoint that calls GPT-OSS to score resume sections.',
    priority: 'Medium',
    status: 'Pending',
    aiGenerated: true,
    createdAt: '2026-08-05',
    updatedAt: '2026-08-05',
  },
  {
    id: 10,
    projectId: 3,
    title: 'Suggestions dashboard',
    description: 'Display AI suggestions grouped by resume section.',
    priority: 'Low',
    status: 'Pending',
    aiGenerated: true,
    createdAt: '2026-08-08',
    updatedAt: '2026-08-08',
  },
];

const seedInteractions = [
  {
    id: 1,
    projectId: 1,
    taskType: 'Break Requirement into Tasks',
    prompt: 'Break the student application flow into development tasks.',
    response:
      'Requirement Understanding: Students should browse drives and apply.\nFrontend Tasks: Drive list page, application form, status page.\nBackend Tasks: Applications API, eligibility check.\nDatabase Tasks: Applications table, status history.\nTesting Steps: Apply flow test, duplicate application test.\nPossible Blockers: Eligibility rules may vary by drive.\nRecommended Next Action: Build the applications table first.',
    modelName: 'gpt-oss:20b',
    createdAt: '2026-07-21',
  },
  {
    id: 2,
    projectId: 2,
    taskType: 'Identify Project Blockers',
    prompt: 'What could block the hospital appointment booking release?',
    response:
      'Requirement Understanding: Identify release risks for appointment booking.\nFrontend Tasks: Slot conflict UI warnings.\nBackend Tasks: Concurrency-safe booking endpoint.\nDatabase Tasks: Unique constraint on slot per doctor.\nTesting Steps: Concurrent booking test.\nPossible Blockers: Double-booking race conditions.\nRecommended Next Action: Add a unique constraint on (doctor_id, slot).',
    modelName: 'gpt-oss:20b',
    createdAt: '2026-08-01',
  },
  {
    id: 3,
    projectId: 3,
    taskType: 'Generate Project Plan',
    prompt: 'Create a project plan for the AI Resume Mentor.',
    response:
      'Requirement Understanding: End-to-end resume review tool.\nFrontend Tasks: Upload page, dashboard, suggestions view.\nBackend Tasks: Upload endpoint, scoring endpoint, history endpoint.\nDatabase Tasks: Resumes, scores, suggestions tables.\nTesting Steps: Upload parse test, scoring accuracy test.\nPossible Blockers: Large file parsing may be slow.\nRecommended Next Action: Start with the upload and parser module.',
    modelName: 'gpt-oss:20b',
    createdAt: '2026-08-06',
  },
  {
    id: 4,
    projectId: 1,
    taskType: 'Recommend Next Task',
    prompt: 'What should I work on next for the placement portal?',
    response:
      'Requirement Understanding: Pick the highest-value next task.\nFrontend Tasks: Apply to drive flow.\nBackend Tasks: Applications API.\nDatabase Tasks: Applications table already done.\nTesting Steps: End-to-end apply flow test.\nPossible Blockers: Eligibility rules need confirmation.\nRecommended Next Action: Implement the Apply to drive flow.',
    modelName: 'gpt-oss:20b',
    createdAt: '2026-08-14',
  },
];

// Exported through getters so the mock API can safely mutate copies.
export const mockProjects = () => seedProjects.map((p) => ({ ...p }));
export const mockTasks = () => seedTasks.map((t) => ({ ...t }));
export const mockInteractions = () => seedInteractions.map((i) => ({ ...i }));

export const nextIds = {
  project: () => nextProjectId++,
  task: () => nextTaskId++,
  interaction: () => nextInteractionId++,
};

export const taskTypes = [
  'Generate Project Plan',
  'Break Requirement into Tasks',
  'Recommend Next Task',
  'Identify Project Blockers',
  'Explain Implementation',
  'Generate Testing Checklist',
];
