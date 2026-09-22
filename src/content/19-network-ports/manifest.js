// src/content/84-network-ports/manifest.js
// ─────────────────────────────────────────────────────────────
// CATATAN: resolveTopic.js membaca metadata.json langsung sebagai satu-
// satunya sumber metadata UI. File ini dipertahankan untuk konsistensi
// historis dengan topic lain (44-ssh, 17-rest-api) — update keduanya
// kalau field berubah.
// ─────────────────────────────────────────────────────────────

export default {
  schemaVersion: 1,
  id: 'network-ports',
  title: 'Network Ports',
  subtitle: 'Pintu layanan, bukan pintu mesin',
  category: 'Linux Fundamentals',
  tags: ['Networking', 'TCP', 'UDP', 'Firewall', 'Socket', 'NAT'],
  color: '#A78BFA',
  audioStrategy: 'realtime',
}
