# Plan Revisi 04 — Dynamic Near-Element Caption Positioning & Complete Icon Audit for Network Ports in Content 84

**Tanggal:** 2026-09-22  
**Target Content:** `84-network-ports`  
**Status:** DIIMPLEMENTASIKAN (belum preview manual) — lihat §4.

---

## 1. Latar Belakang & Masalah (Problem Statement)

1. **Text Box Penjelasan Statis di Atas Canvas (Jauh Dari Animasi):**
   - Saat ini, text box penjelasan (`CaptionBar` / Badges) selalu muncul di bagian paling atas canvas (misalnya di `y: 8` atau `y: 30`).
   - Ketika fokus animasi/packet sedang berada di stasiun bagian bawah (seperti `Listener` di `y: 335`, `Firewall Gate` di `y: 430`, `TCP/UDP` di `y: 600`, atau `Edge to Backend` di `y: 750`), audiens **kesulitan mengikuti visual karena mata harus bolak-balik antara animasi di bawah dan teks di paling atas**.
   - Diperlukan mekanisme **Dynamic Near-Element Caption Positioning** agar posisi text box penjelas bergerak mengikuti stasiun / paket yang sedang aktif dibahas.

2. **Masalah Icon yang Terlewat (Misal Client Node & Miscellaneous):**
   - Meskipun helper icon SVG sudah disiapkan, beberapa stasiun penting seperti **Client Node**, **Client Ephemeral Port Badge**, dan **Host Target** masih belum dihiasi icon yang lengkap atau belum dipasang secara simetris.

---

## 2. Rencana Perubahan Detail (Detailed Plan)

### A. Dynamic Near-Element Caption Positioning (`acts/common.jsx` & `Animation.jsx`)

1. **Mekanisme Anchor Dynamic `CaptionBar`:**
   - Mengubah `CaptionBar` agar menerima prop koordinat `anchorY` dan `anchorX` (atau mengikuti `nearTarget` state).
   - Menghitung koordinat Y caption secara dinamis sesuai Act/Beat yang sedang aktif:
     - **Act 1 (Host vs Service):** Anchor Y di dekat `Host IP` (`y: 155`) dan `Port Lane 443` (`y: 265`).
     - **Act 2 (Listener Menerima):** Anchor Y di dekat `Listener Web Server` (`y: 375`).
     - **Act 3 (TCP & UDP):** Anchor Y di dekat `TCP Handshake Lane` / `UDP Datagram` (`y: 620`).
     - **Act 4 (Endpoints):** Anchor Y di antara `Client Ephemeral Port` (`y: 70`) dan `Destination Port` (`y: 375`).
     - **Act 5 (Scope & Firewall):** Anchor Y di dekat `Firewall Gate` (`y: 475`).
     - **Act 6 (Real Path Edge to Backend):** Anchor Y di dekat `Edge/NAT/Backend` (`y: 720` - `800`).

2. **Smart Clamping Sub-Zone (Anti-Overflow):**
   - Menambahkan clamp `Math.max(40, Math.min(850, anchorY))` agar text box caption dekat elemen tidak pernah terpotong oleh navigator atas atau batas canvas bawah.

---

### B. Pembaruan & Melengkapi Seluruh Icon Visual (`acts/common.jsx` & Files `Act1` s/d `Act6`)

1. **Melengkapi Client Node & Host Icons:**
   - Memastikan `IconClient` (Client Laptop/App) terpasang tegas di stasiun Client (`POS.client.x`, `POS.client.y`).
   - Memastikan `IconServer` (Target Server Rack) terpasang di stasiun Host IP (`POS.host.x`, `POS.host.y`).
2. **Melengkapi Port Lanes & Socket Icons:**
   - Memastikan kelima port lanes (`22`, `80`, `443`, `3306`, `5432`) menampilkan icon khas masing-masing (`IconSsh`, `IconGlobe`, `IconLock`, `IconDatabase`).
3. **Melengkapi Act 3, 5, 6 Specific Icons:**
   - **Act 3:** `IconHandshake` (TCP) dan `IconRocket` (UDP).
   - **Act 5:** `IconShield` (Firewall policy gate).
   - **Act 6:** `IconRouter` (NAT / Load Balancer) & `IconTower` (Backend Server Tower).

---

## 3. Rencana Verifikasi

1. **Kompilasi Syntax Build Check:**
   - Menjalankan esbuild check untuk meyakinkan tidak ada error pada koordinat dynamic anchor & inline SVG.
2. **Visual & Usability Inspection:**
   - Memastikan text box penjelasan **berada dekat dengan lokasi elemen yang sedang dianimasikan** di setiap Act sehingga audiens dapat membaca teks dan melihat motion secara bersamaan tanpa lelah.
   - Memastikan seluruh node (Client, Host, Lanes, Listener, Gate, Backend) dihiasi icon visual yang lengkap.

---

## 4. Ringkasan Status

- [x] Menyusun dokumen plan revisi 04 di `src/content/84-network-ports/revisi/2026-09-22-revisi-04-dynamic-near-element-caption-and-complete-icons.md`.
- [x] Memperbarui indeks revisi `src/content/84-network-ports/revisi/README.md`.
- [x] **Eksekusi kode selesai** (2026-09-22):
  - **Root cause dikonfirmasi**: `badgePos()` di `acts/common.jsx` memang hanya punya 7 entry eksplisit (`hostIp`, `laneApply`, `listenerApply`, `srcPortBadge`, `dstPortBadge`, `gateApply`, `udpApply`). Semua id badge generic yang dipakai timeline (`hostBefore`, `travel1`, `act1After`, `act2Before`, `travel2`, `act2After`, `act3Before`, `tcpApply`, `act3After`, `act4Before`, `act4Apply`, `act4After`, `act5Before`, `extSrcBadge`, `act5After`, `act6Before`, `travel6`, `act6Apply`, `act6After`) jatuh ke fallback `{x:BW/2, y:8}` — persis seperti dugaan plan.
  - Ditambahkan 19 entry eksplisit baru, masing-masing dianchor ke node yang relevan per Act (host/lane untuk Act1, listener untuk Act2, lower-zone TCP/UDP untuk Act3, titik tengah client-listener untuk Act4, gate untuk Act5, lower-zone hop/health untuk Act6) — nilai Y konsisten dengan rentang yang disebut plan (155/265/375/620/222/475/740).
  - Smart clamp `Math.max(40, Math.min(850, p.y))` ditambahkan di `Badges()` sebagai jaring pengaman anti-overflow (poin A.2 plan).
  - Bagian B (icon) **tidak perlu perubahan** — sudah lengkap sejak revisi-03 (`IconClient`/`IconServer` di client/host, kelima lane, `IconEar` listener, `IconShield` gate, `IconHandshake`/`IconRocket` Act3, `IconRouter`/`IconTower` Act6). Diverifikasi ulang lewat pembacaan `acts/common.jsx` — tidak ada icon yang hilang.
- [x] Syntax/build check: `esbuild` untuk `Animation.jsx` dan semua `acts/*.jsx` — lolos tanpa error.
- [ ] Preview manual (`npm run dev` → `/player/network-ports`) — cek posisi badge benar-benar dekat elemen aktif di tiap Act, tidak tumpang tindih dengan spine/navigator.
- [ ] `npm run build` project penuh — belum dijalankan.
