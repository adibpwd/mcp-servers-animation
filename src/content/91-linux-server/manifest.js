// src/content/91-linux-server/manifest.js
// ─────────────────────────────────────────────────────────────
// CATATAN: registry.js sudah dihapus dari project — resolveTopic.js
// membaca metadata.json langsung sebagai satu-satunya sumber metadata
// yang dipakai UI. File ini dipertahankan untuk konsistensi historis
// dengan topic lain; update keduanya (manifest.js & metadata.json)
// kalau field berubah.
// ─────────────────────────────────────────────────────────────

export default {
  schemaVersion: 1,
  id: 'linux-server',
  title: 'Linux Server',
  subtitle: 'Sistem yang menyediakan layanan',
  category: 'Linux Fundamentals',
  tags: ['Server', 'Service', 'Network', 'Identity', 'Observability', 'Operations'],
  color: '#F472B6',
  audioStrategy: 'realtime',
}
