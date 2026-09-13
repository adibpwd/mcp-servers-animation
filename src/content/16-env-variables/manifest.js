// src/content/env-variables/manifest.js
// ─────────────────────────────────────────────────────────────
// Satu sumber kebenaran metadata untuk topic ini.
// registry.js membaca field ini (import + spread), sesuai kontrak
// docs/standardizations/02-topic-contract-scene-shell.md bagian 5.
// ─────────────────────────────────────────────────────────────

export default {
  schemaVersion: 1,
  id: 'env-variables',
  title: 'Environment Variables & .env',
  subtitle: 'Same code, different config per machine',
  category: 'Developer Tools',
  tags: ['Environment Variables', '.env', 'Config', 'DevOps', 'Security'],
  color: '#EAB308',
  audioStrategy: 'realtime',
}
