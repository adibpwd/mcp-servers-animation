// src/content/24-cors/manifest.js
// ─────────────────────────────────────────────────────────────
// Satu sumber kebenaran metadata topic ini. registry.js membaca field
// ini (import + spread) setelah preview manual & export MP4 lolos
// (lihat _docs/CORS_PLAN.md § Checklist — tidak diaktifkan otomatis).
// ─────────────────────────────────────────────────────────────

export default {
  schemaVersion: 1,
  id:        'cors',
  title:     'CORS Explained',
  subtitle:  'Browser sebagai penjaga izin lintas origin',
  category:  'Developer Tools',
  tags:      ['CORS', 'Browser', 'Security', 'HTTP', 'Preflight'],
  color:     '#FB923C',
  audioStrategy: 'realtime',
}
