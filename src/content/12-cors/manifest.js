// src/content/24-cors/manifest.js
// ─────────────────────────────────────────────────────────────
// Satu sumber kebenaran metadata untuk topic ini.
// registry.js membaca field ini (import + spread), sesuai kontrak
// docs/standardizations/02-topic-contract-scene-shell.md bagian 5.
//
// REBUILD 2026-09-13: rebuild dari nol mengikuti _docs/CORS_PLAN.md,
// versi lama (pre-backup) ada di _archive/backup-24-cors-20260913/
// (diabaikan, bukan basis rebuild ini).
// ─────────────────────────────────────────────────────────────

export default {
  schemaVersion: 1,
  id: 'cors',
  title: 'CORS',
  subtitle: 'Origin browser, izin server, jawaban aman',
  category: 'Developer Tools',
  tags: ['CORS', 'Browser', 'Preflight', 'Origin', 'Security'],
  color: '#FB923C',
  audioStrategy: 'realtime',
}
