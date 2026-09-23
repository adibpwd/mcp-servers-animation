// src/content/35-cron-job/manifest.js
// ─────────────────────────────────────────────────────────────
// Satu sumber kebenaran metadata untuk topic ini. resolveTopic.js
// membaca metadata.json untuk discovery; manifest.js dipertahankan
// sebagai kontrak deskriptif topic (docs/standardizations/
// 02-topic-contract-scene-shell.md bagian 5 & 10) dan WAJIB selaras
// dengan metadata.json (title/subtitle/category/color/tags).
// ─────────────────────────────────────────────────────────────

export default {
  schemaVersion: 1,
  id: 'cron-job',
  title: 'Cron Job',
  subtitle: 'Robot penjadwal otomatis di Linux',
  category: 'Linux Fundamentals',
  tags: ['Linux', 'Cron', 'Automation', 'Crontab', 'DevOps', 'CLI'],
  color: '#38BDF8',
  audioStrategy: 'realtime',
}
