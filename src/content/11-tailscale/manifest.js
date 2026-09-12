// src/content/tailscale/manifest.js
// ─────────────────────────────────────────────────────────────
// Satu sumber kebenaran metadata untuk topic ini.
// registry.js membaca field ini (import + spread), sesuai kontrak
// docs/standardizations/02-standar-konten.md bagian 5.
// ─────────────────────────────────────────────────────────────

export default {
  schemaVersion: 1,
  id: 'tailscale',
  title: 'How Tailscale Works',
  subtitle: 'From blocked NAT to a private mesh network',
  category: 'Networking',
  tags: ['Tailscale', 'VPN', 'WireGuard', 'Mesh Network', 'NAT Traversal'],
  color: '#6366F1',
  audioStrategy: 'realtime',
}
