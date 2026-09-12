// src/content/async-event-loop/manifest.js
// ─────────────────────────────────────────────────────────────
// Satu sumber kebenaran metadata untuk topic ini.
// registry.js membaca field ini (import + spread) alih-alih
// hardcode object literal, sesuai kontrak baru di
// docs/standardizations/02-standar-konten.md (bagian 5).
// ─────────────────────────────────────────────────────────────

export default {
  schemaVersion: 1,
  id: 'async-event-loop',
  title: 'Async/Await & Event Loop',
  subtitle: 'Kenapa kode JavaScript kelihatan "loncat"',
  category: 'Programming Concepts',
  tags: ['JavaScript', 'Async', 'Event Loop', 'Call Stack', 'Web Dev'],
  color: '#A78BFA',
  audioStrategy: 'realtime',
}
