// src/content/http-request-response/manifest.js
// ─────────────────────────────────────────────────────────────
// Satu sumber kebenaran metadata untuk topic ini.
// registry.js membaca field ini (import + spread) alih-alih
// hardcode object literal, sesuai kontrak baru di
// docs/02-standar-konten.md (bagian 5).
// ─────────────────────────────────────────────────────────────

export default {
  schemaVersion: 1,
  id: 'http-request-response',
  title: 'HTTP Request-Response',
  subtitle: 'Ngirim surat, nunggu balasan',
  category: 'Networking',
  tags: ['HTTP', 'Client-Server', 'DNS', 'Status Code', 'Web'],
  color: '#38BDF8',
  audioStrategy: 'realtime',
}
