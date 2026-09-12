// src/content/23-https-tls/manifest.js
// ─────────────────────────────────────────────────────────────
// Satu sumber kebenaran metadata untuk topic ini.
// registry.js membaca field ini (import + spread) setelah preview
// manual & export lolos (lihat _docs/HTTPS_TLS_PLAN.md Checklist
// Eksekusi — TIDAK diaktifkan otomatis oleh keberadaan file ini).
// ─────────────────────────────────────────────────────────────

export default {
  schemaVersion: 1,
  id: 'https-tls',
  title: 'HTTPS & TLS',
  subtitle: 'HTTP dalam terowongan terkunci',
  category: 'Networking',
  tags: ['HTTPS', 'TLS', 'Encryption', 'Certificate', 'Security', 'Web'],
  color: '#34D399',
  audioStrategy: 'realtime',
}