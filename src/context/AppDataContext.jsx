import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as api from '../services/api';

// AppDataContext holds the shared lists used across pages while the
// app runs on mock data. It also exposes a `notify` helper that pages
// use to show short success/error messages.

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message, id: Date.now() });
  };

  const refreshProjects = async () => {
    const data = await api.getProjects();
    setProjects(data);
    return data;
  };

  const refreshTasks = async () => {
    const data = await api.getTasks();
    setTasks(data);
    return data;
  };

  const refreshInteractions = async (projectId) => {
    const data = await api.getAIHistory(projectId);
    setInteractions(data);
    return data;
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const [p, t, i] = await Promise.all([
          api.getProjects(),
          api.getTasks(),
          api.getAIHistory(),
        ]);
        if (!mounted) return;
        setProjects(p);
        setTasks(t);
        setInteractions(i);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Auto-dismiss toasts after a few seconds.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const value = useMemo(
    () => ({
      projects,
      tasks,
      interactions,
      loading,
      toast,
      showToast,
      refreshProjects,
      refreshTasks,
      refreshInteractions,
    }),
    [projects, tasks, interactions, loading, toast],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
