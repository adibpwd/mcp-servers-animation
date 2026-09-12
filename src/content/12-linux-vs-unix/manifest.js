// src/content/linux-vs-unix/manifest.js
// ─────────────────────────────────────────────────────────────
// Satu sumber kebenaran metadata untuk topic ini.
// registry.js membaca field ini (import + spread) alih-alih
// hardcode object literal, sesuai kontrak baru di
// docs/standardizations/02-standar-konten.md (bagian 5).
// ─────────────────────────────────────────────────────────────

export default {
  schemaVersion: 1,
  id: 'linux-vs-unix',
  title: 'Linux vs Unix',
  subtitle: 'From AT&T Bell Labs to modern ecosystems',
  category: 'Operating Systems',
  tags: ['Linux', 'Unix', 'BSD', 'macOS', 'Windows'],
  color: '#06B6D4',
  audioStrategy: 'realtime',
}
