export const FRAME_SEQUENCE = [
  { frameNumber: 1, duration: 1.0, counter: 14, activeLinks: [], description: 'Title intro frame' },
  {
    frameNumber: 2,
    duration: 1.0,
    counter: 15,
    activeLinks: [{ source: 'claude', target: 'github', color: 'cyan', delay: 0.0, duration: 1.2 }],
    description: 'First line animation'
  },
  {
    frameNumber: 3,
    duration: 1.0,
    counter: 16,
    activeLinks: [
      { source: 'claude', target: 'github', color: 'cyan', delay: 0.0, duration: 1.2 },
      { source: 'chatgpt', target: 'slack', color: 'gold', delay: 0.15, duration: 1.2 }
    ],
    description: 'Second line animation'
  },
  {
    frameNumber: 4,
    duration: 1.0,
    counter: 17,
    activeLinks: [
      { source: 'claude', target: 'github', color: 'cyan', delay: 0.0, duration: 1.2 },
      { source: 'chatgpt', target: 'slack', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'cursor', target: 'postgres', color: 'pink', delay: 0.15, duration: 1.2 }
    ],
    description: 'Third line animation'
  },
  {
    frameNumber: 5,
    duration: 1.0,
    counter: 18,
    activeLinks: [
      { source: 'claude', target: 'github', color: 'cyan', delay: 0.0, duration: 1.2 },
      { source: 'chatgpt', target: 'slack', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'cursor', target: 'postgres', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'claude', target: 'cursor', color: 'cyan', delay: 0.15, duration: 1.2 }
    ],
    description: 'Nodes connect'
  },
  {
    frameNumber: 6,
    duration: 1.0,
    counter: 19,
    activeLinks: [
      { source: 'claude', target: 'github', color: 'cyan', delay: 0.0, duration: 1.2 },
      { source: 'chatgpt', target: 'slack', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'cursor', target: 'postgres', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'claude', target: 'cursor', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'chatgpt', target: 'claude', color: 'gold', delay: 0.15, duration: 1.2 }
    ],
    description: 'Full AI connections'
  },
  {
    frameNumber: 7,
    duration: 1.0,
    counter: 20,
    activeLinks: [
      { source: 'claude', target: 'github', color: 'cyan', delay: 0.0, duration: 1.2 },
      { source: 'chatgpt', target: 'slack', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'cursor', target: 'postgres', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'claude', target: 'cursor', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'chatgpt', target: 'claude', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'cursor', target: 'slack', color: 'pink', delay: 0.15, duration: 1.2 }
    ],
    description: 'Tool connections expand'
  },
  {
    frameNumber: 8,
    duration: 1.0,
    counter: 21,
    activeLinks: [
      { source: 'claude', target: 'github', color: 'cyan', delay: 0.0, duration: 1.2 },
      { source: 'chatgpt', target: 'slack', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'cursor', target: 'postgres', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'claude', target: 'cursor', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'chatgpt', target: 'claude', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'cursor', target: 'slack', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'chatgpt', target: 'gmail', color: 'gold', delay: 0.15, duration: 1.2 }
    ],
    description: 'Gmail added'
  },
  {
    frameNumber: 9,
    duration: 1.0,
    counter: 22,
    activeLinks: [
      { source: 'claude', target: 'github', color: 'cyan', delay: 0.0, duration: 1.2 },
      { source: 'chatgpt', target: 'slack', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'cursor', target: 'postgres', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'claude', target: 'cursor', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'chatgpt', target: 'claude', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'cursor', target: 'slack', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'chatgpt', target: 'gmail', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'github', target: 'postgres', color: 'cyan', delay: 0.15, duration: 1.2 }
    ],
    description: 'GitHub to Postgres'
  },
  {
    frameNumber: 10,
    duration: 1.0,
    counter: 23,
    activeLinks: [
      { source: 'claude', target: 'github', color: 'cyan', delay: 0.0, duration: 1.2 },
      { source: 'chatgpt', target: 'slack', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'cursor', target: 'postgres', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'claude', target: 'cursor', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'chatgpt', target: 'claude', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'cursor', target: 'slack', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'chatgpt', target: 'gmail', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'github', target: 'postgres', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'claude', target: 'gmail', color: 'cyan', delay: 0.15, duration: 1.2 }
    ],
    description: 'Claude to Gmail'
  },
  {
    frameNumber: 11,
    duration: 1.0,
    counter: 24,
    activeLinks: [
      { source: 'claude', target: 'github', color: 'cyan', delay: 0.0, duration: 1.2 },
      { source: 'chatgpt', target: 'slack', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'cursor', target: 'postgres', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'claude', target: 'cursor', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'chatgpt', target: 'claude', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'cursor', target: 'slack', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'chatgpt', target: 'gmail', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'github', target: 'postgres', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'claude', target: 'gmail', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'github', target: 'slack', color: 'cyan', delay: 0.15, duration: 1.2 }
    ],
    description: 'GitHub to Slack'
  },
  {
    frameNumber: 12,
    duration: 1.0,
    counter: 25,
    activeLinks: [
      { source: 'claude', target: 'github', color: 'cyan', delay: 0.0, duration: 1.2 },
      { source: 'chatgpt', target: 'slack', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'cursor', target: 'postgres', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'claude', target: 'cursor', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'chatgpt', target: 'claude', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'cursor', target: 'slack', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'chatgpt', target: 'gmail', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'github', target: 'postgres', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'claude', target: 'gmail', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'github', target: 'slack', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'postgres', target: 'slack', color: 'pink', delay: 0.15, duration: 1.2 }
    ],
    description: 'Postgres to Slack'
  },
  {
    frameNumber: 13,
    duration: 1.0,
    counter: 26,
    activeLinks: [
      { source: 'claude', target: 'github', color: 'cyan', delay: 0.0, duration: 1.2 },
      { source: 'chatgpt', target: 'slack', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'cursor', target: 'postgres', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'claude', target: 'cursor', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'chatgpt', target: 'claude', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'cursor', target: 'slack', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'chatgpt', target: 'gmail', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'github', target: 'postgres', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'claude', target: 'gmail', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'github', target: 'slack', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'postgres', target: 'slack', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'gmail', target: 'slack', color: 'gold', delay: 0.15, duration: 1.2 }
    ],
    description: 'Gmail to Slack'
  },
  {
    frameNumber: 14,
    duration: 1.0,
    counter: 27,
    activeLinks: [
      { source: 'claude', target: 'github', color: 'cyan', delay: 0.0, duration: 1.2 },
      { source: 'chatgpt', target: 'slack', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'cursor', target: 'postgres', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'claude', target: 'cursor', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'chatgpt', target: 'claude', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'cursor', target: 'slack', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'chatgpt', target: 'gmail', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'github', target: 'postgres', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'claude', target: 'gmail', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'github', target: 'slack', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'postgres', target: 'slack', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'gmail', target: 'slack', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'claude', target: 'chatgpt', color: 'cyan', delay: 0.15, duration: 1.2 }
    ],
    description: 'All AI + Gmail connected'
  },
  {
    frameNumber: 15,
    duration: 1.25,
    counter: 28,
    activeLinks: [
      { source: 'claude', target: 'github', color: 'cyan', delay: 0.0, duration: 1.2 },
      { source: 'chatgpt', target: 'slack', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'cursor', target: 'postgres', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'claude', target: 'cursor', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'chatgpt', target: 'claude', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'cursor', target: 'slack', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'chatgpt', target: 'gmail', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'github', target: 'postgres', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'claude', target: 'gmail', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'github', target: 'slack', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'postgres', target: 'slack', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'gmail', target: 'slack', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'claude', target: 'chatgpt', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'cursor', target: 'github', color: 'pink', delay: 0.15, duration: 1.2 }
    ],
    description: 'Cursor to GitHub'
  },
  {
    frameNumber: 16,
    duration: 1.5,
    counter: 29,
    activeLinks: [
      { source: 'claude', target: 'github', color: 'cyan', delay: 0.0, duration: 1.2 },
      { source: 'chatgpt', target: 'slack', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'cursor', target: 'postgres', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'claude', target: 'cursor', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'chatgpt', target: 'claude', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'cursor', target: 'slack', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'chatgpt', target: 'gmail', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'github', target: 'postgres', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'claude', target: 'gmail', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'github', target: 'slack', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'postgres', target: 'slack', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'gmail', target: 'slack', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'claude', target: 'chatgpt', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'cursor', target: 'github', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'gmail', target: 'github', color: 'gold', delay: 0.15, duration: 1.2 }
    ],
    description: 'Gmail to GitHub'
  },
  {
    frameNumber: 17,
    duration: 1.5,
    counter: 29,
    activeLinks: [
      { source: 'claude', target: 'github', color: 'cyan', delay: 0.0, duration: 1.2 },
      { source: 'chatgpt', target: 'slack', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'cursor', target: 'postgres', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'claude', target: 'cursor', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'chatgpt', target: 'claude', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'cursor', target: 'slack', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'chatgpt', target: 'gmail', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'github', target: 'postgres', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'claude', target: 'gmail', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'github', target: 'slack', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'postgres', target: 'slack', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'gmail', target: 'slack', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'claude', target: 'chatgpt', color: 'cyan', delay: 0.15, duration: 1.2 },
      { source: 'cursor', target: 'github', color: 'pink', delay: 0.15, duration: 1.2 },
      { source: 'gmail', target: 'github', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'chatgpt', target: 'postgres', color: 'gold', delay: 0.15, duration: 1.2 },
      { source: 'github', target: 'postgres', color: 'cyan', delay: 0.6, duration: 1.2 }
    ],
    description: 'Full network complete'
  },
  {
    frameNumber: 18,
    duration: 1.5,
    counter: 29,
    activeLinks: [],
    description: 'Final frame'
  }
]

export const TOTAL_DURATION = FRAME_SEQUENCE.reduce((sum, f) => sum + f.duration, 0)