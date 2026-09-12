// src/content/17-rest-api/manifest.js
// ─────────────────────────────────────────────────────────────
// Satu sumber kebenaran metadata untuk topic ini.
// registry.js membaca field ini (import + spread), sesuai kontrak
// docs/standardizations/02-standar-konten.md bagian 5.
// ─────────────────────────────────────────────────────────────

export default {
  schemaVersion: 1,
  id: 'rest-api',
  title: 'REST API',
  subtitle: 'Client, request, endpoint, server, response',
  category: 'Developer Tools',
  tags: ['REST', 'API', 'HTTP', 'Client-Server', 'Backend'],
  color: '#22D3EE',
  audioStrategy: 'realtime',
}
