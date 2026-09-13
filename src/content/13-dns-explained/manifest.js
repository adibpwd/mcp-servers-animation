// src/content/dns-explained/manifest.js
// ─────────────────────────────────────────────────────────────
// Satu sumber kebenaran metadata untuk topic ini.
// registry.js membaca field ini (import + spread), sesuai kontrak
// docs/standardizations/02-topic-contract-scene-shell.md bagian 5.
// ─────────────────────────────────────────────────────────────

export default {
  schemaVersion: 1,
  id: 'dns-explained',
  title: 'Cara Kerja DNS',
  subtitle: 'Domain jadi IP address — buku telepon internet',
  category: 'Networking',
  tags: ['DNS', 'Resolver', 'Root Server', 'TLD', 'Networking'],
  color: '#06B6D4',
  audioStrategy: 'realtime',
}
