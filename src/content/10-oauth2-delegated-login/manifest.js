// src/content/22-oauth2-delegated-login/manifest.js
// ─────────────────────────────────────────────────────────────
// Satu sumber kebenaran metadata untuk topic ini. registry.js membaca
// field ini (import + spread) setelah preview manual & export MP4 lolos
// (lihat _docs/OAUTH2_DELEGATED_LOGIN_PLAN.md §7 Checklist Eksekusi item
// terakhir — TIDAK diaktifkan otomatis oleh keberadaan file ini).
// ─────────────────────────────────────────────────────────────

export default {
  schemaVersion: 1,
  id: 'oauth2-delegated-login',
  title: 'OAuth2 Delegated Login',
  subtitle: 'Beri izin, bukan password',
  category: 'Developer Tools',
  tags: ['OAuth2', 'Authorization', 'PKCE', 'Delegated Access', 'Security'],
  color: '#6366F1',
  audioStrategy: 'realtime',
}
