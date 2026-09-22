// src/content/20-email-verification/manifest.js
// ─────────────────────────────────────────────────────────────
// Satu sumber kebenaran metadata topic ini. registry.js membaca field
// ini (import + spread) setelah preview manual & export MP4 lolos
// (lihat _docs/EMAIL_VERIFICATION_PLAN.md §4 - tidak diaktifkan otomatis).
// ─────────────────────────────────────────────────────────────

export default {
  schemaVersion: 1,
  id: 'email-verification',
  title: 'Email Verification',
  subtitle: 'Buktikan alamat, bukan identitas',
  category: 'Developer Tools',
  tags: ['Email', 'Verification', 'Token', 'Security', 'Account'],
  color: '#22D3EE',
  audioStrategy: 'realtime',
}