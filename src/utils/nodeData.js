export const NODES = [
  { id: 'claude', label: 'CLAUDE', type: 'ai-model', size: 60 },
  { id: 'cursor', label: 'CURSOR', type: 'ai-model', size: 60 },
  { id: 'chatgpt', label: 'CHATGPT', type: 'ai-model', size: 60 },
  { id: 'github', label: 'GITHUB', type: 'tool', size: 40 },
  { id: 'postgres', label: 'POSTGRES', type: 'tool', size: 40 },
  { id: 'slack', label: 'SLACK', type: 'tool', size: 40 },
  { id: 'gmail', label: 'GMAIL', type: 'tool', size: 40 }
]

export const LINKS = [
  { source: 'claude', target: 'github', color: 'cyan' },
  { source: 'cursor', target: 'postgres', color: 'pink' },
  { source: 'chatgpt', target: 'slack', color: 'gold' }
]