// src/content/21-forgot-password/manifest.js
// ─────────────────────────────────────────────────────────────
// Satu sumber kebenaran metadata topic ini. registry.js membaca field
// ini (import + spread) setelah preview manual & export MP4 lolos
// (lihat src/content/21-forgot-password/_docs/FORGOT_PASSWORD_PLAN.md
// § Checklist — tidak diaktifkan otomatis).
// ─────────────────────────────────────────────────────────────

export default {
  schemaVersion: 1,
  id: 'forgot-password',
  title: 'Forgot Password',
  subtitle: 'Pemulihan tanpa membocorkan yang lama',
  category: 'Developer Tools',
  tags: ['ForgotPassword', 'Recovery', 'Token', 'Hash', 'Security', 'Email'],
  color: '#FBBF24',
  audioStrategy: 'realtime',
}
