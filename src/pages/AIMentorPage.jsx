import { useEffect, useMemo, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import * as api from '../services/api';
import { taskTypes } from '../data/mockData';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';
import { EmptyState } from '../components/Common/EmptyState';
import { AIResponseView } from '../components/AI/AIResponseView';
import { IconSparkles, IconCheck, IconInbox } from '../components/Common/Icons';

export default function AIMentorPage() {
  const { projects, refreshInteractions, refreshTasks, showToast } = useAppData();
  const location = useLocation();
  const passedProjectId = location.state?.projectId;

  const [projectId, setProjectId] = useState(passedProjectId || projects[0]?.id || '');
  const [prompt, setPrompt] = useState('');
  const [taskType, setTaskType] = useState(taskTypes[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (passedProjectId) setProjectId(passedProjectId);
    else if (!projectId && projects[0]) setProjectId(projects[0]?.id);
  }, [passedProjectId, projects, projectId]);

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === Number(projectId)),
    [projects, projectId],
  );

  function validate() {
    if (!projectId) return 'Please select a project.';
    if (!prompt.trim()) return 'Please describe a requirement or question.';
    return '';
  }

  async function handleGenerate() {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const data = await api.generateAIPlan({
        projectId: Number(projectId),
        prompt: prompt.trim(),
        taskType,
      });
      setResult(data);
      await refreshInteractions();
      showToast('success', 'AI recommendation generated.');
    } catch {
      setError('AI Mentor is temporarily unavailable. Please try again.');
      showToast('error', 'AI Mentor is temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  }

  // Convert the current recommendation into a pending AI-generated task.
  async function handleCreateTasks() {
    if (!result) return;
    try {
      await api.createTask({
        projectId: result.projectId,
        title: `AI: ${result.taskType}`,
        description: result.prompt,
        priority: 'Medium',
        status: 'Pending',
        aiGenerated: true,
      });
      await refreshTasks();
      showToast('success', 'Task created from recommendation.');
    } catch {
      showToast('error', 'Unable to create task from recommendation.');
    }
  }

  async function handleSaveRecommendation() {
    if (!result) return;
    // The mock generate call already stored the interaction; just confirm.
    showToast('success', 'Recommendation saved to AI History.');
  }

  function handleClear() {
    setResult(null);
    setPrompt('');
    setError('');
  }

  return (
    <div className="stack gap-2">
      <section className="card card-pad stack gap-2">
        <div className="row gap-1">
          <span className="badge badge-ai"><IconSparkles size={14} /> AI Mentor</span>
          <span className="text-sm muted">
            The AI mentor breaks requirements into development tasks. No API keys live in the frontend.
          </span>
        </div>
        <div className="form-grid">
          <div className="form-row">
            <div>
              <label htmlFor="ai-project">Select Project</label>
              <select id="ai-project" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                <option value="">— Choose a project —</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="ai-task-type">AI Task Type</label>
              <select id="ai-task-type" value={taskType} onChange={(e) => setTaskType(e.target.value)}>
                {taskTypes.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="ai-prompt">Requirement or Question</label>
            <textarea
              id="ai-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Break the appointment booking flow into development tasks"
            />
          </div>
        </div>
        {error && <div className="field-error">{error}</div>}
        <div className="row gap-1">
          <button className="btn" onClick={handleGenerate} disabled={loading}>
            {loading ? <span className="spinner" /> : <IconSparkles size={16} />} Generate AI Recommendation
          </button>
        </div>
      </section>

      {loading && (
        <div className="card card-pad center" style={{ flexDirection: 'column', gap: '0.75rem' }}>
          <LoadingSpinner />
          <div className="muted">AI Mentor is analysing your project…</div>
        </div>
      )}

      {error && !loading && (
        <div className="card card-pad" style={{ background: 'var(--color-error-soft)', borderColor: 'var(--color-error)', color: 'var(--color-error)' }}>
          {error}
        </div>
      )}

      {result && !loading && (
        <section className="card card-pad stack gap-2">
          <div className="row between wrap">
            <div>
              <h3 className="section-title">AI Recommendation</h3>
              <div className="text-sm muted">
                {selectedProject?.name} · {result.taskType} · {result.modelName}
              </div>
            </div>
            <div className="row gap-1">
              <button className="btn btn-secondary btn-sm" onClick={handleSaveRecommendation}>
                <IconCheck size={14} /> Save Recommendation
              </button>
              <button className="btn btn-secondary btn-sm" onClick={handleCreateTasks}>
                Create Tasks from Recommendation
              </button>
              <button className="btn btn-ghost btn-sm" onClick={handleClear}>Clear Response</button>
            </div>
          </div>
          <AIResponseView response={result.response} />
        </section>
      )}

      {!result && !loading && !error && (
        <EmptyState
          title="Ask the AI Mentor"
          message="Select a project, describe a requirement, and generate a structured plan."
          action={<Link to="/ai-history" className="btn btn-secondary btn-sm"><IconInbox size={14} /> View AI History</Link>}
        />
      )}
    </div>
  );
}
