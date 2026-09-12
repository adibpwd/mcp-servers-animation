// src/content/mcp-servers/data.js
// Semua konstanta & data untuk animasi MCP Servers

export const VW = 820
export const VH = 1340

export const AI_BOX_W = 218
export const AI_BOX_H = 100
export const TOOL_SZ  = 54
export const MCP_Y    = 830

export const AI = [
  { id: 'claude',  label: 'CLAUDE',  x: 190, y: 490 },
  { id: 'cursor',  label: 'CURSOR',  x: 410, y: 490 },
  { id: 'chatgpt', label: 'CHATGPT', x: 630, y: 490 },
]

export const TOOLS = [
  { id: 'github',   label: 'GITHUB',   x: 155, y: 1080, color: '#F59E0B' },
  { id: 'postgres', label: 'POSTGRES', x: 330, y: 1080, color: '#3B82F6' },
  { id: 'slack',    label: 'SLACK',    x: 500, y: 1080, color: '#8B5CF6' },
  { id: 'gmail',    label: 'GMAIL',    x: 665, y: 1080, color: '#EF4444' },
]

// Semua 12 koneksi N×M [aiIndex, toolIndex]
export const CONNS = []
for (let a = 0; a < AI.length; a++)
  for (let t = 0; t < TOOLS.length; t++)
    CONNS.push([a, t])

export const PHASES = [
  {
    badge:        'CUSTOM GLUE · N×M',
    badgeColor:   '#FF3B8C',
    integrations: 12,
    caption:      'Every AI needs custom code for every tool.',
    showMcp:      false,
    showTooltip:  false,
    showFooter:   false,
    counterEnd:   20,
    duration:     5,
  },
  {
    badge:        'ONE SERVER PER TOOL',
    badgeColor:   '#4ADE80',
    integrations: 8,
    caption:      'MCP puts one standard server on each tool.',
    showMcp:      true,
    showTooltip:  false,
    showFooter:   false,
    counterEnd:   24,
    duration:     5,
  },
  {
    badge:        'tools/list · tools/call',
    badgeColor:   '#00D9FF',
    integrations: 7,
    caption:      'Any AI can list its tools, then call them.',
    showMcp:      true,
    showTooltip:  true,
    showFooter:   false,
    counterEnd:   27,
    duration:     4,
  },
  {
    badge:        'WRITE ONCE · USE ANYWHERE',
    badgeColor:   '#FFD60A',
    integrations: 7,
    caption:      'Build it once. Every AI connects.',
    showMcp:      true,
    showTooltip:  false,
    showFooter:   true,
    counterEnd:   29,
    duration:     3,
  },
]

export const COUNTER_START = 14
