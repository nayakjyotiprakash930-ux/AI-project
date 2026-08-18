import { useParsedResponse } from './parseAIResponse';

const sectionColors = {
  'Requirement Understanding': { bg: 'var(--color-primary-soft)', color: 'var(--color-primary)' },
  'Frontend Tasks': { bg: 'var(--color-cyan-soft)', color: 'var(--color-cyan)' },
  'Backend Tasks': { bg: 'var(--color-indigo-soft)', color: 'var(--color-indigo)' },
  'Database Tasks': { bg: 'var(--color-success-soft)', color: 'var(--color-success)' },
  'Testing Steps': { bg: 'var(--color-warning-soft)', color: 'var(--color-warning)' },
  'Possible Blockers': { bg: 'var(--color-error-soft)', color: 'var(--color-error)' },
  'Recommended Next Action': { bg: 'var(--color-primary-soft)', color: 'var(--color-primary-strong)' },
};

export function AIResponseView({ response }) {
  const sections = useParsedResponse(response);
  if (!sections.length) return null;
  return (
    <div className="page-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
      {sections.map((s, idx) => {
        const c = sectionColors[s.label] || { bg: '#f1f5f9', color: 'var(--color-text)' };
        return (
          <div key={idx} className="ai-section" style={{ background: c.bg, borderColor: c.bg }}>
            <h4 style={{ color: c.color }}>{s.label}</h4>
            <p>{s.body}</p>
          </div>
        );
      })}
    </div>
  );
}
