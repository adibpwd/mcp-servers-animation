// src/content/44-ssh/manifest.js
// ─────────────────────────────────────────────────────────────
// CATATAN: registry.js (yang dulu membaca file ini) sudah DIHAPUS dari
// project — resolveTopic.js sekarang membaca metadata.json langsung
// sebagai satu-satunya sumber metadata. File ini dipertahankan untuk
// konsistensi historis dengan topic lain, TAPI metadata.json adalah
// yang benar-benar dipakai UI. Update keduanya kalau field berubah.
// ─────────────────────────────────────────────────────────────

export default {
  schemaVersion: 1,
  id: 'ssh',
  title: 'SSH',
  subtitle: 'Terminal aman menuju komputer jauh',
  category: 'Linux Fundamentals',
  tags: ['SSH', 'Remote Access', 'Encryption', 'Authentication', 'Networking', 'Security'],
  color: '#22D3EE',
  audioStrategy: 'realtime',
}
