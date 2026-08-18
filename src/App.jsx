import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppDataProvider } from './context/AppDataContext';
import { AppLayout } from './components/Layout/AppLayout';
import { ToastHost } from './components/Common/ToastHost';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import TasksPage from './pages/TasksPage';
import AIMentorPage from './pages/AIMentorPage';
import AIHistoryPage from './pages/AIHistoryPage';
import NotFoundPage from './pages/NotFoundPage';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <AppDataProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/ai-mentor" element={<AIMentorPage />} />
            <Route path="/ai-history" element={<AIHistoryPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppLayout>
        <ToastHost />
      </AppDataProvider>
    </BrowserRouter>
  );
}

export default App;
