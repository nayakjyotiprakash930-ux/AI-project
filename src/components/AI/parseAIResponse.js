import { useMemo } from 'react';

// Parses a mock AI response string (see services/api.js) into labeled
// sections so the AI Mentor page can render them as cards.
const sectionLabels = [
  'Requirement Understanding',
  'Frontend Tasks',
  'Backend Tasks',
  'Database Tasks',
  'Testing Steps',
  'Possible Blockers',
  'Recommended Next Action',
];

export function parseAIResponse(response) {
  const lines = response.split('\n').map((l) => l.trim()).filter(Boolean);
  const sections = [];
  let current = null;

  for (const line of lines) {
    const match = sectionLabels.find((label) => line.startsWith(`${label}:`));
    if (match) {
      current = { label: match, body: line.slice(match.length + 1).trim() };
      sections.push(current);
    } else if (current) {
      current.body = `${current.body} ${line}`.trim();
    } else {
      // Intro line that has no label becomes its own block.
      current = { label: 'Requirement Understanding', body: line };
      sections.push(current);
    }
  }
  return sections;
}

export function useParsedResponse(response) {
  return useMemo(() => (response ? parseAIResponse(response) : []), [response]);
}
