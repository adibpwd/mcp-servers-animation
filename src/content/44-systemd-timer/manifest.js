// src/content/44-systemd-timer/manifest.js
// ─────────────────────────────────────────────────────────────
// Satu sumber kebenaran metadata untuk topic ini. resolveTopic.js
// membaca metadata.json untuk discovery; manifest.js dipertahankan
// sebagai kontrak deskriptif topic (docs/standardizations/
// 02-topic-contract-scene-shell.md bagian 5 & 10) dan WAJIB selaras
// dengan metadata.json (title/subtitle/category/color/tags).
// ─────────────────────────────────────────────────────────────

export default {
  schemaVersion: 1,
  id: 'systemd-timer',
  title: 'Systemd Timer',
  subtitle: 'Pengganti modern cron job',
  category: 'Linux Fundamentals',
  tags: ['Linux', 'systemd', 'Timer', 'Automation', 'Journald', 'DevOps'],
  color: '#38BDF8',
  audioStrategy: 'realtime',
}
