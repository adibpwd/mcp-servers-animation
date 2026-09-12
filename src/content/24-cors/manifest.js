// src/content/24-cors/manifest.js (repo dobel — hidup)
// ─────────────────────────────────────────────────────────────
// Satu sumber kebenaran metadata topic CORS. registry.js membaca via
// import + spread. Tidak diaktifkan otomatis — lolos preview manual &
// export MP4 dulu (lihat 24-cors/_docs/CORS_PLAN.md § Checklist).
// ─────────────────────────────────────────────────────────────

export default {
  schemaVersion: 1,
  id: 'cors',
  title: 'CORS Explained',
  subtitle: 'Browser penjaga izin lintas origin',
  category: 'Developer Tools',
  tags: ['CORS', 'Browser', 'Preflight', 'Security', 'HTTP'],
  color: '#FB923C',
  audioStrategy: 'realtime',
}
