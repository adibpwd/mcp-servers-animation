// src/content/container-docker/manifest.js
// ─────────────────────────────────────────────────────────────
// Satu sumber kebenaran metadata untuk topic ini.
// registry.js membaca field ini (import + spread), sesuai kontrak
// docs/standardizations/02-standar-konten.md bagian 5.
// ─────────────────────────────────────────────────────────────

export default {
  schemaVersion: 1,
  id: 'container-docker',
  title: 'Docker Container vs Virtual Machine',
  subtitle: 'Why containers are not just "tiny VMs"',
  category: 'Linux Deep Dive',
  tags: ['Docker', 'Container', 'VM', 'Namespaces', 'Virtualization'],
  color: '#2496ED',
  audioStrategy: 'realtime',
}
