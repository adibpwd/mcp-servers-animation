// src/content/rest-api/manifest.js
// ─────────────────────────────────────────────────────────────
// Satu sumber kebenaran metadata untuk topic ini.
// registry.js membaca field ini (import + spread) alih-alih
// hardcode object literal, sesuai kontrak di
// docs/standardizations/02-standar-konten.md (bagian 5).
// ─────────────────────────────────────────────────────────────

export default {
  schemaVersion: 1,
  id: 'rest-api',
  title: 'REST API',
  subtitle: 'Aturan standar di balik "istirahat" yang sibuk',
  category: 'Networking',
  tags: ['REST', 'API', 'CRUD', 'HTTP Methods', 'JSON', 'Statelessness'],
  color: '#A78BFA',
  audioStrategy: 'realtime',
}
