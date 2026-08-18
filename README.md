# AI Project Mentor

A beginner-friendly full-stack training application where users can manage software projects, development tasks, and ask an AI mentor to break requirements into development tasks.

## Application objective

AI Project Mentor helps learners practise full-stack development by organising projects and tasks, tracking progress on a dashboard, and using an AI mentor to generate structured recommendations. The current package is a **frontend-only** application that runs with realistic mock data. It is prepared for a future Python/FastAPI backend.

## Technology stack

- HTML5, CSS3, JavaScript ES6+
- React.js (functional components and hooks)
- Vite as the React build tool
- React Router DOM for navigation
- Axios for future backend API communication

No TypeScript. No Next.js. No Supabase. No serverless functions.

## Current frontend features

- Dashboard with summary cards, project progress, recent tasks, and an AI recommended next task.
- Projects page with create, edit, delete, and search.
- Project details page with task list and quick actions.
- Tasks page with filters, search, inline status change, create, edit, and delete.
- AI Mentor page that generates a structured mock recommendation.
- AI History page with filters and full response viewer.
- Responsive sidebar (collapsible on mobile), top header, badges, modals, loading indicators, success/error messages, and confirmation dialogs.

## Planned backend technologies

- Python
- FastAPI REST APIs
- SQL Server database
- Ollama Cloud API using a GPT-OSS model

The AI API key will live only in the Python backend and is never placed in the frontend.

## Installation

```bash
npm install
```

## Development command

```bash
npm run dev
```

## Build command

```bash
npm run build
```

## Folder structure

```
src/
  components/
    Layout/        AppLayout, Sidebar, Header
    Dashboard/     (dashboard uses shared components)
    Projects/      (project forms use the shared Modal)
    Tasks/         TaskForm
    AI/            AIResponseView, parseAIResponse
    Common/        Icons, Modal, ConfirmDialog, LoadingSpinner, ErrorMessage, SuccessMessage, EmptyState, ToastHost
  pages/
    DashboardPage.jsx
    ProjectsPage.jsx
    ProjectDetailsPage.jsx
    TasksPage.jsx
    AIMentorPage.jsx
    AIHistoryPage.jsx
    NotFoundPage.jsx
  services/
    api.js         Axios service with mock-data fallback
  data/
    mockData.js    Seed projects, tasks, AI interactions
  context/
    AppDataContext.jsx
  utils/
    helpers.js     Badge classes, date format, progress calc
  styles/
    global.css
  App.jsx
  main.jsx
```

## Environment variables

Copy `.env.example` to `.env` and adjust if needed:

```
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_USE_MOCK_DATA=true
```

- `VITE_API_BASE_URL`: base URL of the future FastAPI backend.
- `VITE_USE_MOCK_DATA`: when `true` (default) the app uses mock data. Set to `false` once the FastAPI backend is running.

The frontend never stores `OLLAMA_API_KEY`, database credentials, or SQL Server connection strings. Those belong only in the Python backend.

## Future FastAPI integration plan

The frontend is already prepared to call these endpoints once the backend is ready:

- `GET /api/health`
- `GET /api/dashboard`
- `GET /api/projects` · `POST /api/projects` · `GET /api/projects/{id}` · `PUT /api/projects/{id}` · `DELETE /api/projects/{id}`
- `GET /api/tasks` · `POST /api/tasks` · `GET /api/tasks/{id}` · `PUT /api/tasks/{id}` · `PATCH /api/tasks/{id}/status` · `DELETE /api/tasks/{id}`
- `POST /api/ai/plan` · `POST /api/ai/next-task` · `GET /api/ai/history/{project_id}`

To switch from mock data to the real backend:

1. Start the FastAPI server at `VITE_API_BASE_URL`.
2. Set `VITE_USE_MOCK_DATA=false` in `.env`.
3. The functions in `src/services/api.js` already match the endpoint shapes, so page components do not need to change.
