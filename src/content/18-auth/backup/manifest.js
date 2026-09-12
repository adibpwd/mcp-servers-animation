// src/content/18-auth/manifest.js
// ─────────────────────────────────────────────────────────────
// Satu sumber kebenaran metadata untuk topic ini.
// registry.js membaca field ini (import + spread) alih-alih
// hardcode object literal, sesuai kontrak di
// docs/standardizations/02-standar-konten.md (bagian 5).
// ─────────────────────────────────────────────────────────────

export default {
  schemaVersion: 1,
  id: 'auth',
  title: 'Authentication',
  subtitle: 'Siapa boleh masuk, siapa boleh buka apa',
  category: 'Networking',
  tags: ['Authentication', 'Authorization', 'Hashing', 'Session', 'JWT', 'Security'],
  color: '#34D399',
  audioStrategy: 'realtime',
}
