// src/content/92-web-server/manifest.js
// ─────────────────────────────────────────────────────────────
// CATATAN: resolveTopic.js membaca metadata.json langsung sebagai satu-
// satunya sumber metadata UI. File ini dipertahankan untuk konsistensi
// historis dengan topic lain (81-network-interface, 84-network-ports) —
// update keduanya kalau field berubah.
// ─────────────────────────────────────────────────────────────

export default {
  schemaVersion: 1,
  id: 'web-server',
  title: 'Web Server',
  subtitle: 'Penerima request pertama',
  category: 'Linux Fundamentals',
  tags: ['Web Server', 'HTTP', 'Listener', 'Static', 'Upstream', 'Response'],
  color: '#38BDF8',
  audioStrategy: 'realtime',
}