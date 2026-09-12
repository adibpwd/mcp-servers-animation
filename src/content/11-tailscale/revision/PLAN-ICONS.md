# Plan — Icon Generation untuk Topic `tailscale`

**Status**: PLANNING ONLY — belum ada `icons.json` yang dibuat, belum ada icon yang di-generate.
**Date**: 2026-09-05
**Terkait**: `docs/plan/` (Phase D unified single-port service) — investigasi kenapa topic
`tailscale` tidak muncul di dropdown extension `vm-icon-generator`.

---

## 1. Temuan Analisa

- Extension `vm-icon-generator` (`GET /api/icons/topics`) cuma nge-list topic yang punya
  file `src/content/<topic>/icons/icons.json`. Topic `tailscale` **tidak punya folder
  `icons/` sama sekali** — itu sebabnya dia tidak muncul di dropdown.
- Sudah dicek isi `src/content/tailscale/Animation.jsx` baris ke baris: seluruh visual
  digambar manual pakai shape SVG primitif via komponen JSX — `Laptop`, `HouseFrame`,
  `BuildingFrame`, `CloudShape`, `FirewallWall`, `KeyToken`, `ServerBox`, `Badge`,
  `SpeechBubble`, `FaceReact`. **Tidak ada satupun `<image href=...>` atau `getIcon()`**
  di file ini — beda dengan `virtual-memory/Animation.jsx` yang jelas pakai
  `import { getIcon } from './icons/loader'` lalu `<image href={getIcon('storage')} />`.
- Elemen `installIconHome` / `installIconOffice` yang sekilas kelihatan seperti "icon
  Tailscale" ternyata cuma lingkaran + huruf "T" hasil gambar SVG manual, bukan icon
  hasil generate dari extension.
- **Kesimpulan**: topic `tailscale` secara teknis **tidak butuh** `icons.json` untuk bisa
  jalan — dia tidak punya dependency ke sistem icon generator ini sama sekali. Ini bukan
  bug/icon hilang, memang belum pernah dipakai.


## 2. Tujuan Revisi

Kalau mau upgrade visual (opsional, bukan wajib), sebagian elemen konseptual bisa
diganti dari "shape geometris manual" menjadi "icon PNG hasil generate ChatGPT" —
persis pola yang dipakai `virtual-memory` untuk icon app generik (browser, game,
editor, dst). Elemen struktural (Laptop, House/Building frame, Cloud, Firewall wall,
Badge, SpeechBubble, FaceReact) **tetap vector**, karena sudah bagus, gampang di-tint
warna per-Act, dan tidak butuh detail visual tinggi.

## 3. Rencana Isi `icons.json`

Rencana: **1 batch, grid 2x4** (6 icon dipakai + 2 slot kosong) — mengikuti standar
`_template-icons.json` § sizing rules (rekomendasi 2x4 untuk ketajaman 512px terbaik).

| No | `id` | Label | Deskripsi untuk prompt ChatGPT | Menggantikan elemen di `Animation.jsx` |
|----|------|-------|-------------------------------|------------------------------------------|
| 1 | `wireguard-key` | WireGuard Key | Kunci kriptografi modern (bukan gembok biasa) | `KeyToken` — dipakai 4x: `pubKeyHome`, `privKeyHome`, `pubKeyOffice`, `privKeyOffice` (Act 2) |
| 2 | `coordination-server` | Coordination Server | Server rack / cloud dengan aksen "address book" | `ServerBox` label "COORDINATION SERVER" (Act 3) |
| 3 | `derp-relay` | DERP Relay | Relay tower / signal repeater — harus beda jelas dari coordination-server | `ServerBox` label "DERP RELAY SERVER" (Act 4) |
| 4 | `mesh-network` | Mesh Network | Node-node saling terhubung (network graph) | Elemen baru/opsional, aksen di payoff mesh (Act 5) |
| 5 | `tailscale-logo` | Tailscale Logo | Logo simplified monokrom flat (bukan trademark asli) | `installIconHome` / `installIconOffice` — lingkaran+huruf "T" manual (Act 2) |
| 6 | `mobile-phone` | Mobile Phone | Smartphone sederhana | Rect manual untuk device HP di mesh payoff (Act 5) |

- Slot 7 & 8 di grid: **[EMPTY]** — tidak dipakai.
- Style icon mengikuti konvensi topic lain: flat, minimalist, grayscale/monokrom,
  transparent background (PNG), high contrast, ukuran seragam.

## 4. Draft Prompt Generation (referensi, belum final)

```
Generate a 2x4 grid of 8 minimalist grayscale monochrome icons on transparent
background (PNG). Icons are numbered top-left to bottom-right:

1. WireGuard cryptographic key (modern key icon, not a padlock)
2. Coordination server (server rack with a small "address book" accent)
3. DERP relay tower (signal repeater / relay tower, visually distinct from #2)
4. Mesh network (small interconnected nodes / network graph)
5. Simplified generic mesh-VPN app logo (flat, monochrome, NOT the real
   Tailscale trademark — an original abstract mark)
6. Mobile phone (simple smartphone icon)
7. [EMPTY - leave this slot blank/transparent]
8. [EMPTY - leave this slot blank/transparent]

Style requirements:
- Flat design, minimalist
- Black/gray colors only (grayscale/monochrome)
- Each icon same size and clearly distinct
- High contrast for visibility
- Transparent background (PNG)
- Grid layout: 2 rows × 4 columns
- Recommended total size: 4096x2048 pixels (512x512 per icon)
- Each icon should be recognizable and simple
```

**Catatan penting**: icon #5 sengaja diarahkan jadi "abstract mark", bukan minta
logo Tailscale asli — untuk menghindari isu trademark/copyright saat generate via
ChatGPT.

## 5. Belum Dikerjakan (Next Steps)

- [ ] Review & approve daftar 6 icon di atas (atau revisi kalau ada yang kurang pas)
- [ ] Buat `src/content/tailscale/icons/icons.json` sesuai rencana di § 3 (format
      mengikuti `_template-icons.json` / contoh nyata `virtual-memory/icons/icons.json`)
- [ ] Set `generation.api_endpoint` ke `http://localhost:3373/api/icons/generate`
      (port unified, bukan `3300` lama)
- [ ] Restart/refresh extension → topic "Tailscale" harus muncul di dropdown
- [ ] Generate icon via extension (klik "Generate Icons from ChatGPT")
- [ ] Kalau hasil generate oke → update `Animation.jsx`: tambah
      `import { getIcon } from './icons/loader'` + folder `icons/loader.js` (contoh
      dari `virtual-memory`), lalu ganti elemen terkait di § 3 dari shape manual ke
      `<image href={getIcon('id')} .../>`

**Belum ada eksekusi apapun di atas — dokumen ini murni planning.**
