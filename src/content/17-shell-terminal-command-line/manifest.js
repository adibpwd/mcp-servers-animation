// src/content/48-shell-terminal-command-line/manifest.js
// ─────────────────────────────────────────────────────────────
// CATATAN: resolveTopic.js membaca metadata.json langsung sebagai satu-
// satunya sumber metadata (registry.js sudah dihapus). File ini dipertahankan
// untuk konsistensi historis dengan topic lain — update keduanya kalau field
// berubah (lihat pola 44-ssh/manifest.js).
// ─────────────────────────────────────────────────────────────

export default {
  schemaVersion: 1,
  id: 'shell-terminal-command-line',
  title: 'Shell, Terminal, Command Line',
  subtitle: 'Tiga istilah, tiga peran berbeda',
  category: 'Linux Fundamentals',
  tags: ['Shell', 'Terminal', 'Command Line', 'PTY', 'Bash', 'Scripting'],
  color: '#38BDF8',
  audioStrategy: 'realtime',
}
