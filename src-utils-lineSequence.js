// src/utils/lineSequence.js
// Complete 18-frame animation sequence with ALL line animations

export const LINE_SEQUENCE = [
  // ==================== FRAME 1 ====================
  {
    frameNumber: 1,
    duration: 1.0,
    counter: 14,
    description: "Intro - Network setup, no animations",
    animatedLines: []
  },

  // ==================== FRAME 2 ====================
  {
    frameNumber: 2,
    duration: 1.0,
    counter: 15,
    description: "First line animation starts",
    animatedLines: [
      {
        id: 'line-1',
        source: 'claude',
        target: 'github',
        color: '#FF006E',
        duration: 1.2,
        delay: 0,
        startFrame: 2
      }
    ]
  },

  // ==================== FRAME 3 ====================
  {
    frameNumber: 3,
    duration: 1.0,
    counter: 17,
    description: "Second line animation (staggered)",
    animatedLines: [
      {
        id: 'line-1',
        source: 'claude',
        target: 'github',
        color: '#FF006E',
        duration: 1.2,
        delay: 0,
        startFrame: 2
      },
      {
        id: 'line-2',
        source: 'cursor',
        target: 'postgres',
        color: '#FF006E',
        duration: 1.2,
        delay: 0.15,
        startFrame: 3
      }
    ]
  },

  // ==================== FRAME 4 ====================
  {
    frameNumber: 4,
    duration: 1.0,
    counter: 18,
    description: "Third line animation",
    animatedLines: [
      {
        id: 'line-1',
        source: 'claude',
        target: 'github',
        color: '#FF006E',
        duration: 1.2,
        delay: 0,
        startFrame: 2
      },
      {
        id: 'line-2',
        source: 'cursor',
        target: 'postgres',
        color: '#FF006E',
        duration: 1.2,
        delay: 0.15,
        startFrame: 3
      },
      {
        id: 'line-3',
        source: 'chatgpt',
        target: 'slack',
        color: '#FF006E',
        duration: 1.2,
        delay: 0.3,
        startFrame: 4
      }
    ]
  },

  // ==================== FRAME 5 ====================
  {
    frameNumber: 5,
    duration: 1.0,
    counter: 20,
    description: "Fourth line animation",
    animatedLines: [
      {
        id: 'line-1',
        source: 'claude',
        target: 'github',
        color: '#FF006E',
        duration: 1.2,
        delay: 0,
        startFrame: 2
      },
      {
        id: 'line-2',
        source: 'cursor',
        target: 'postgres',
        color: '#FF006E',
        duration: 1.2,
        delay: 0.15,
        startFrame: 3
      },
      {
        id: 'line-3',
        source: 'chatgpt',
        target: 'slack',
        color: '#FF006E',
        duration: 1.2,
        delay: 0.3,
        startFrame: 4
      },
      {
        id: 'line-4',
        source: 'claude',
        target: 'postgres',
        color: '#FF006E',
        duration: 1.2,
        delay: 0.45,
        startFrame: 5
      }
    ]
  },

  // ==================== FRAME 6 ====================
  {
    frameNumber: 6,
    duration: 1.0,
    counter: 21,
    description: "Fifth line animation",
    animatedLines: [
      {
        id: 'line-1',
        source: 'claude',
        target: 'github',
        color: '#FF006E',
        duration: 1.2,
        delay: 0,
        startFrame: 2
      },
      {
        id: 'line-2',
        source: 'cursor',
        target: 'postgres',
        color: '#FF006E',
        duration: 1.2,
        delay: 0.15,
        startFrame: 3
      },
      {
        id: 'line-3',
        source: 'chatgpt',
        target: 'slack',
        color: '#FF006E',
        duration: 1.2,
        delay: 0.3,
        startFrame: 4
      },
      {
        id: 'line-4',
        source: 'claude',
        target: 'postgres',
        color: '#FF006E',
        duration: 1.2,
        delay: 0.45,
        startFrame: 5
      },
      {
        id: 'line-5',
        source: 'cursor',
        target: 'slack',
        color: '#FF006E',
        duration: 1.2,
        delay: 0.6,
        startFrame: 6
      }
    ]
  },

  // ==================== FRAME 7 ====================
  {
    frameNumber: 7,
    duration: 1.0,
    counter: 22,
    description: "Sixth line animation",
    animatedLines: [
      { id: 'line-1', source: 'claude', target: 'github', color: '#FF006E', duration: 1.2, delay: 0, startFrame: 2 },
      { id: 'line-2', source: 'cursor', target: 'postgres', color: '#FF006E', duration: 1.2, delay: 0.15, startFrame: 3 },
      { id: 'line-3', source: 'chatgpt', target: 'slack', color: '#FF006E', duration: 1.2, delay: 0.3, startFrame: 4 },
      { id: 'line-4', source: 'claude', target: 'postgres', color: '#FF006E', duration: 1.2, delay: 0.45, startFrame: 5 },
      { id: 'line-5', source: 'cursor', target: 'slack', color: '#FF006E', duration: 1.2, delay: 0.6, startFrame: 6 },
      { id: 'line-6', source: 'chatgpt', target: 'postgres', color: '#FF006E', duration: 1.2, delay: 0.75, startFrame: 7 }
    ]
  },

  // ==================== FRAME 8 ====================
  {
    frameNumber: 8,
    duration: 1.0,
    counter: 23,
    description: "Seventh line animation",
    animatedLines: [
      { id: 'line-1', source: 'claude', target: 'github', color: '#FF006E', duration: 1.2, delay: 0, startFrame: 2 },
      { id: 'line-2', source: 'cursor', target: 'postgres', color: '#FF006E', duration: 1.2, delay: 0.15, startFrame: 3 },
      { id: 'line-3', source: 'chatgpt', target: 'slack', color: '#FF006E', duration: 1.2, delay: 0.3, startFrame: 4 },
      { id: 'line-4', source: 'claude', target: 'postgres', color: '#FF006E', duration: 1.2, delay: 0.45, startFrame: 5 },
      { id: 'line-5', source: 'cursor', target: 'slack', color: '#FF006E', duration: 1.2, delay: 0.6, startFrame: 6 },
      { id: 'line-6', source: 'chatgpt', target: 'postgres', color: '#FF006E', duration: 1.2, delay: 0.75, startFrame: 7 },
      { id: 'line-7', source: 'claude', target: 'slack', color: '#FF006E', duration: 1.2, delay: 0.9, startFrame: 8 }
    ]
  },

  // ==================== FRAME 9 ====================
  {
    frameNumber: 9,
    duration: 1.0,
    counter: 24,
    description: "Eighth line animation",
    animatedLines: [
      { id: 'line-1', source: 'claude', target: 'github', color: '#FF006E', duration: 1.2, delay: 0, startFrame: 2 },
      { id: 'line-2', source: 'cursor', target: 'postgres', color: '#FF006E', duration: 1.2, delay: 0.15, startFrame: 3 },
      { id: 'line-3', source: 'chatgpt', target: 'slack', color: '#FF006E', duration: 1.2, delay: 0.3, startFrame: 4 },
      { id: 'line-4', source: 'claude', target: 'postgres', color: '#FF006E', duration: 1.2, delay: 0.45, startFrame: 5 },
      { id: 'line-5', source: 'cursor', target: 'slack', color: '#FF006E', duration: 1.2, delay: 0.6, startFrame: 6 },
      { id: 'line-6', source: 'chatgpt', target: 'postgres', color: '#FF006E', duration: 1.2, delay: 0.75, startFrame: 7 },
      { id: 'line-7', source: 'claude', target: 'slack', color: '#FF006E', duration: 1.2, delay: 0.9, startFrame: 8 },
      { id: 'line-8', source: 'cursor', target: 'github', color: '#FF006E', duration: 1.2, delay: 1.05, startFrame: 9 }
    ]
  },

  // ==================== FRAME 10 ====================
  {
    frameNumber: 10,
    duration: 1.0,
    counter: 24,
    description: "Ninth line animation",
    animatedLines: [
      { id: 'line-1', source: 'claude', target: 'github', color: '#FF006E', duration: 1.2, delay: 0, startFrame: 2 },
      { id: 'line-2', source: 'cursor', target: 'postgres', color: '#FF006E', duration: 1.2, delay: 0.15, startFrame: 3 },
      { id: 'line-3', source: 'chatgpt', target: 'slack', color: '#FF006E', duration: 1.2, delay: 0.3, startFrame: 4 },
      { id: 'line-4', source: 'claude', target: 'postgres', color: '#FF006E', duration: 1.2, delay: 0.45, startFrame: 5 },
      { id: 'line-5', source: 'cursor', target: 'slack', color: '#FF006E', duration: 1.2, delay: 0.6, startFrame: 6 },
      { id: 'line-6', source: 'chatgpt', target: 'postgres', color: '#FF006E', duration: 1.2, delay: 0.75, startFrame: 7 },
      { id: 'line-7', source: 'claude', target: 'slack', color: '#FF006E', duration: 1.2, delay: 0.9, startFrame: 8 },
      { id: 'line-8', source: 'cursor', target: 'github', color: '#FF006E', duration: 1.2, delay: 1.05, startFrame: 9 },
      { id: 'line-9', source: 'chatgpt', target: 'github', color: '#FF006E', duration: 1.2, delay: 1.2, startFrame: 10 }
    ]
  },

  // ==================== FRAME 11 ====================
  {
    frameNumber: 11,
    duration: 1.0,
    counter: 25,
    description: "Tenth line animation",
    animatedLines: [
      { id: 'line-1', source: 'claude', target: 'github', color: '#FF006E', duration: 1.2, delay: 0, startFrame: 2 },
      { id: 'line-2', source: 'cursor', target: 'postgres', color: '#FF006E', duration: 1.2, delay: 0.15, startFrame: 3 },
      { id: 'line-3', source: 'chatgpt', target: 'slack', color: '#FF006E', duration: 1.2, delay: 0.3, startFrame: 4 },
      { id: 'line-4', source: 'claude', target: 'postgres', color: '#FF006E', duration: 1.2, delay: 0.45, startFrame: 5 },
      { id: 'line-5', source: 'cursor', target: 'slack', color: '#FF006E', duration: 1.2, delay: 0.6, startFrame: 6 },
      { id: 'line-6', source: 'chatgpt', target: 'postgres', color: '#FF006E', duration: 1.2, delay: 0.75, startFrame: 7 },
      { id: 'line-7', source: 'claude', target: 'slack', color: '#FF006E', duration: 1.2, delay: 0.9, startFrame: 8 },
      { id: 'line-8', source: 'cursor', target: 'github', color: '#FF006E', duration: 1.2, delay: 1.05, startFrame: 9 },
      { id: 'line-9', source: 'chatgpt', target: 'github', color: '#FF006E', duration: 1.2, delay: 1.2, startFrame: 10 },
      { id: 'line-10', source: 'claude', target: 'gmail', color: '#FF006E', duration: 1.2, delay: 1.35, startFrame: 11 }
    ]
  },

  // ==================== FRAME 12 ====================
  {
    frameNumber: 12,
    duration: 1.0,
    counter: 26,
    description: "Eleventh line animation",
    animatedLines: [
      { id: 'line-1', source: 'claude', target: 'github', color: '#FF006E', duration: 1.2, delay: 0, startFrame: 2 },
      { id: 'line-2', source: 'cursor', target: 'postgres', color: '#FF006E', duration: 1.2, delay: 0.15, startFrame: 3 },
      { id: 'line-3', source: 'chatgpt', target: 'slack', color: '#FF006E', duration: 1.2, delay: 0.3, startFrame: 4 },
      { id: 'line-4', source: 'claude', target: 'postgres', color: '#FF006E', duration: 1.2, delay: 0.45, startFrame: 5 },
      { id: 'line-5', source: 'cursor', target: 'slack', color: '#FF006E', duration: 1.2, delay: 0.6, startFrame: 6 },
      { id: 'line-6', source: 'chatgpt', target: 'postgres', color: '#FF006E', duration: 1.2, delay: 0.75, startFrame: 7 },
      { id: 'line-7', source: 'claude', target: 'slack', color: '#FF006E', duration: 1.2, delay: 0.9, startFrame: 8 },
      { id: 'line-8', source: 'cursor', target: 'github', color: '#FF006E', duration: 1.2, delay: 1.05, startFrame: 9 },
      { id: 'line-9', source: 'chatgpt', target: 'github', color: '#FF006E', duration: 1.2, delay: 1.2, startFrame: 10 },
      { id: 'line-10', source: 'claude', target: 'gmail', color: '#FF006E', duration: 1.2, delay: 1.35, startFrame: 11 },
      { id: 'line-11', source: 'cursor', target: 'gmail', color: '#FF006E', duration: 1.2, delay: 1.5, startFrame: 12 }
    ]
  },

  // ==================== FRAME 13 ====================
  {
    frameNumber: 13,
    duration: 1.0,
    counter: 27,
    description: "Twelfth line animation",
    animatedLines: [
      { id: 'line-1', source: 'claude', target: 'github', color: '#FF006E', duration: 1.2, delay: 0, startFrame: 2 },
      { id: 'line-2', source: 'cursor', target: 'postgres', color: '#FF006E', duration: 1.2, delay: 0.15, startFrame: 3 },
      { id: 'line-3', source: 'chatgpt', target: 'slack', color: '#FF006E', duration: 1.2, delay: 0.3, startFrame: 4 },
      { id: 'line-4', source: 'claude', target: 'postgres', color: '#FF006E', duration: 1.2, delay: 0.45, startFrame: 5 },
      { id: 'line-5', source: 'cursor', target: 'slack', color: '#FF006E', duration: 1.2, delay: 0.6, startFrame: 6 },
      { id: 'line-6', source: 'chatgpt', target: 'postgres', color: '#FF006E', duration: 1.2, delay: 0.75, startFrame: 7 },
      { id: 'line-7', source: 'claude', target: 'slack', color: '#FF006E', duration: 1.2, delay: 0.9, startFrame: 8 },
      { id: 'line-8', source: 'cursor', target: 'github', color: '#FF006E', duration: 1.2, delay: 1.05, startFrame: 9 },
      { id: 'line-9', source: 'chatgpt', target: 'github', color: '#FF006E', duration: 1.2, delay: 1.2, startFrame: 10 },
      { id: 'line-10', source: 'claude', target: 'gmail', color: '#FF006E', duration: 1.2, delay: 1.35, startFrame: 11 },
      { id: 'line-11', source: 'cursor', target: 'gmail', color: '#FF006E', duration: 1.2, delay: 1.5, startFrame: 12 },
      { id: 'line-12', source: 'chatgpt', target: 'gmail', color: '#FF006E', duration: 1.2, delay: 1.65, startFrame: 13 }
    ]
  },

  // ==================== FRAME 14 ====================
  {
    frameNumber: 14,
    duration: 1.0,
    counter: 28,
    description: "Network nearly complete",
    animatedLines: [
      { id: 'line-1', source: 'claude', target: 'github', color: '#FF006E', duration: 1.2, delay: 0, startFrame: 2 },
      { id: 'line-2', source: 'cursor', target: 'postgres', color: '#FF006E', duration: 1.2, delay: 0.15, startFrame: 3 },
      { id: 'line-3', source: 'chatgpt', target: 'slack', color: '#FF006E', duration: 1.2, delay: 0.3, startFrame: 4 },
      { id: 'line-4', source: 'claude', target: 'postgres', color: '#FF006E', duration: 1.2, delay: 0.45, startFrame: 5 },
      { id: 'line-5', source: 'cursor', target: 'slack', color: '#FF006E', duration: 1.2, delay: 0.6, startFrame: 6 },
      { id: 'line-6', source: 'chatgpt', target: 'postgres', color: '#FF006E', duration: 1.2, delay: 0.75, startFrame: 7 },
      { id: 'line-7', source: 'claude', target: 'slack', color: '#FF006E', duration: 1.2, delay: 0.9, startFrame: 8 },
      { id: 'line-8', source: 'cursor', target: 'github', color: '#FF006E', duration: 1.2, delay: 1.05, startFrame: 9 },
      { id: 'line-9', source: 'chatgpt', target: 'github', color: '#FF006E', duration: 1.2, delay: 1.2, startFrame: 10 },
      { id: 'line-10', source: 'claude', target: 'gmail', color: '#FF006E', duration: 1.2, delay: 1.35, startFrame: 11 },
      { id: 'line-11', source: 'cursor', target: 'gmail', color: '#FF006E', duration: 1.2, delay: 1.5, startFrame: 12 },
      { id: 'line-12', source: 'chatgpt', target: 'gmail', color: '#FF006E', duration: 1.2, delay: 1.65, startFrame: 13 }
    ]
  },

  // ==================== FRAME 15-18 ====================
  {
    frameNumber: 15,
    duration: 1.0,
    counter: 28,
    description: "Final animations settling",
    animatedLines: []
  },

  {
    frameNumber: 16,
    duration: 1.0,
    counter: 29,
    description: "Complete network",
    animatedLines: []
  },

  {
    frameNumber: 17,
    duration: 1.0,
    counter: 29,
    description: "Steady state",
    animatedLines: []
  },

  {
    frameNumber: 18,
    duration: 1.5,
    counter: 29,
    description: "Final frame - All animations complete",
    animatedLines: []
  }
]

export const TOTAL_DURATION = LINE_SEQUENCE.reduce((sum, f) => sum + f.duration, 0)
export const TOTAL_FRAMES = LINE_SEQUENCE.length

// Helper function to get all unique line connections
export const getAllConnections = () => {
  const connections = new Set()
  LINE_SEQUENCE.forEach(frame => {
    frame.animatedLines.forEach(line => {
      connections.add(`${line.source}-${line.target}`)
    })
  })
  return Array.from(connections)
}

// Helper: Get lines active in specific frame
export const getLinesForFrame = (frameNum) => {
  const frame = LINE_SEQUENCE[frameNum - 1]
  return frame ? frame.animatedLines : []
}

// Helper: Get counter value for frame
export const getCounterForFrame = (frameNum) => {
  const frame = LINE_SEQUENCE[frameNum - 1]
  return frame ? frame.counter : 0
}
