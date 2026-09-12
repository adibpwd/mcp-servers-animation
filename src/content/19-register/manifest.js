// src/content/19-register/manifest.js
// ─────────────────────────────────────────────────────────────
// Satu sumber kebenaran metadata topic ini. registry.js membaca field
// ini (import + spread) setelah preview manual & export MP4 lolos
// (lihat _docs/REGISTER_PLAN.md §5 — tidak diaktifkan otomatis).
// ─────────────────────────────────────────────────────────────

export default {
  schemaVersion: 1,
  id: 'register',
  title: 'Register Account',
  subtitle: 'Isi data, buktikan email',
  category: 'Developer Tools',
  tags: ['Register', 'Signup', 'Validation', 'Hashing', 'Email', 'Security'],
  color: '#A78BFA',
  audioStrategy: 'realtime',
}