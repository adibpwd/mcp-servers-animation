// src/content/81-network-interface/manifest.js
// ─────────────────────────────────────────────────────────────
// Satu sumber kebenaran metadata untuk topic ini.
// resolveTopic.js membaca metadata.json untuk discovery; manifest.js
// ini dipertahankan sebagai kontrak deskriptif topic (lihat
// docs/standardizations/02-topic-contract-scene-shell.md bagian 5 &
// 10) dan WAJIB selaras dengan metadata.json (title/subtitle/category/
// color/tags) — lihat bagian 10 "Verifikasi metadata".
// ─────────────────────────────────────────────────────────────

export default {
  schemaVersion: 1,
  id: 'network-interface',
  title: 'Network Interface',
  subtitle: 'Titik koneksi OS ke jaringan',
  category: 'Linux Fundamentals',
  tags: ['Network Interface', 'Link', 'MAC', 'IP', 'DHCP', 'Route', 'DNS', 'Networking'],
  color: '#38BDF8',
  audioStrategy: 'realtime',
}
