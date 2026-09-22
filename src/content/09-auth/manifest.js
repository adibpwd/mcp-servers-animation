// src/content/18-auth/manifest.js
// ─────────────────────────────────────────────────────────────
// Satu sumber kebenaran metadata untuk topic ini.
// registry.js membaca field ini (import + spread) setelah preview
// manual & export lolos (lihat _docs/AUTH_PLAN.md §13 Checklist Eksekusi
// item terakhir — TIDAK diaktifkan otomatis oleh keberadaan file ini).
// ─────────────────────────────────────────────────────────────

export default {
  schemaVersion: 1,
  id: 'auth',
  title: 'Authentication',
  subtitle: 'Membuktikan siapa, mengatur akses',
  category: 'Developer Tools',
  tags: ['Auth', 'Authentication', 'Authorization', 'Security', 'Session', 'JWT'],
  color: '#34D399',
  audioStrategy: 'realtime',
}
