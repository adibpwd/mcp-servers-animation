# Plan Revisi 03 — Color Standard Sync & Inline SVG Icons for Network Ports in Content 84

**Tanggal:** 2026-09-22  
**Target Content:** `84-network-ports`  
**Status:** DIIMPLEMENTASIKAN (belum preview manual) — lihat §4 untuk detail eksekusi.

---

## 1. Latar Belakang & Masalah (Problem Statement)

1. **Warna Title Intro Tidak Sesuai Standar (Bukan Ungu):**
   - Saat ini `INTRO_TITLE_B: 'PORTS'` atau perpaduan `INTRO_TITLE_A` dan `INTRO_TITLE_B` menggunakan warna unstandardized (ungu/violet atau tidak selaras dengan skema warna primer topik).
   - Berdasarkan standar visualisasi scene-ui (seperti di `44-ssh`, `81-network-interface`, `92-web-server`), segmen warna title intro **harus selaras dengan warna identitas primer topik**:
     - `INTRO_TITLE_A` (`NETWORK `): `COLORS.IP` (Sky `#38BDF8`) atau `COLORS.MUTED`.
     - `INTRO_TITLE_B` (`PORTS`): `COLORS.LISTENER` (Emerald `#34D399`) atau `COLORS.TCP` (`#38BDF8`).

2. **Teks Title Intro Terpotong di Margin Kanan:**
   - Pada `IntroHeaderMorphV1`, judul `NETWORK PORTS` (terutama kata `PORTS` / `NETWORK`) terpotong di tepi kanan margin canvas akibat scaling font / padding yang terlalu sempit.

3. **Kurangnya SVG Icons Visual pada Stasiun & Node Port Lanes:**
   - Komponen persisten `Spine` dan `PORT_LANES` (22, 80, 443, 3306, 5432) saat ini hanya berupa kotak/teks angka netral tanpa icon visual yang memperjelas fungsi masing-masing service:
     - **Port 22 (SSH)**: Icon Terminal / Secure Shell Key.
     - **Port 80 (HTTP)**: Icon Globe / Unencrypted Web.
     - **Port 443 (HTTPS)**: Icon Lock / Encrypted Web Shield.
     - **Port 3306 / 5432 (MySQL / Postgres)**: Icon Database Stack / Table.
     - **Client Node**: Icon Laptop / Client App.
     - **Listener Node**: Icon Ear / Socket Service Receiver.
     - **Firewall Gate**: Icon Shield / Security Policy Gate.
     - **Edge / NAT / Backend Nodes (Act 6)**: Icon Router / Proxy / Server Tower.

---

## 2. Rencana Perubahan Detail (Detailed Plan)

### A. Perbaikan Standar Warna & Fix Title Intro Terpotong (`data.js` & `Animation.jsx`)

1. **Pembaruan Warna Segmen Intro Title (`Animation.jsx`):**
   ```jsx
   titleSegments={[
     { label: INTRO_TITLE_A, color: COLORS.IP },      // Sky #38BDF8
     { label: INTRO_TITLE_B, color: COLORS.LISTENER },// Emerald #34D399 (Bukan Ungu!)
   ]}
   ```

2. **Restrukturisasi Prop & Scaling Intro Title (`data.js` & `Animation.jsx`):**
   - `INTRO_TITLE_A`: `'NETWORK '`
   - `INTRO_TITLE_B`: `'PORTS'`
   - Menyesuaikan `fontSize` max (misalnya `28px - 32px`) dan font scaling pada `IntroHeaderMorphV1` agar kata `PORTS` muat utuh di margin kanan canvas 820px.

---

### B. Penambahan Custom Inline SVG Icons Helper (`acts/common.jsx`)

Membuat helper Inline SVG Icons yang bersih dan ringan:

```jsx
// 1. Icon Client App / Laptop
export function IconClient({ size = 18, color = COLORS.PACKET_MAIN }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="2" y="4" width="20" height="12" rx="2"/>
      <path d="M2 20h20"/>
    </svg>
  )
}

// 2. Icon Lock (HTTPS Port 443)
export function IconLock({ size = 16, color = COLORS.ALLOW }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  )
}

// 3. Icon Database (MySQL / Postgres)
export function IconDatabase({ size = 16, color = COLORS.PORT }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <ellipse cx="12" cy="5" rx="9" ry="3"/>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    </svg>
  )
}

// 4. Icon Terminal (SSH Port 22)
export function IconSsh({ size = 16, color = COLORS.PORT }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <polyline points="4 17 10 11 4 5"/>
      <line x1="12" y1="19" x2="20" y2="19"/>
    </svg>
  )
}

// 5. Icon Firewall Shield
export function IconShield({ size = 18, color = COLORS.FIREWALL }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )
}
```

---

### C. Integrasi ke Spine Persisten & Act Files (`common.jsx` & `Act1` s/d `Act6`):

1. **`Spine` Enhancement:**
   - Menambahkan icon pada stasiun `CLIENT` (`IconClient`), stasiun `Host IP` (`IconServer`), dan `Firewall Gate` (`IconShield`).
   - Menambahkan icon spesifik pada setiap lane `PORT_LANES`:
     - Lane 22 (SSH) ➔ `IconSsh`
     - Lane 80 (HTTP) ➔ `IconGlobe`
     - Lane 443 (HTTPS) ➔ `IconLock`
     - Lane 3306 / 5432 (DB) ➔ `IconDatabase`
2. **Aktivitas Per Act:**
   - **Act 2 (Listener):** Menampilkan icon receiver/ear di sebelah label `Web Server`.
   - **Act 3 (TCP/UDP):** Icon jabat tangan (handshake icon) untuk TCP & icon rocket/arrow untuk UDP.
   - **Act 5 (Scope/Firewall):** Icon perisai merah (`IconShield`) saat policy menolak/mengizinkan paket.
   - **Act 6 (Real Path):** Icon Proxy/NAT & Backend Server Tower pada jalur Edge ➔ NAT ➔ Backend.

---

## 3. Rencana Verifikasi

1. **Syntax Check & Build Test:**
   - Menjalankan esbuild check untuk memastikan seluruh helper SVG inline terbebas dari kesalahan syntax.
2. **Visual Inspection:**
   - Memastikan warna title intro menggunakan Emerald `#34D399` (bukan Ungu) dan teks `PORTS` tidak terpotong di tepi kanan.
   - Memastikan 5 port lane dan node spine dihiasi icon visual yang memperjelas pemahaman audiens.

---

## 4. Ringkasan Status

- [x] Menyusun dokumen plan revisi 03 di `src/content/84-network-ports/revisi/2026-09-22-revisi-03-title-color-standard-and-inline-icons.md`.
- [x] Memperbarui indeks revisi `src/content/84-network-ports/revisi/README.md`.
- [x] **Eksekusi kode selesai** (2026-09-22):
  - Warna title diganti: `INTRO_TITLE_B` sekarang `COLORS.LISTENER` (Emerald), bukan `COLORS.PORT` (violet).
  - Fix pemotongan judul: root cause bukan cuma font-size, tapi jalur render hero single-line (`titleSegments`) di `IntroHeaderMorphV1.jsx` memang TIDAK punya buffer 18%/clamp kanan (hanya jalur `titleLines` yang punya, lihat UPDATE 2 komponen tsb — kasus identik dengan `22-oauth2-delegated-login`). Fix: tambah prop `titleLines` (baris tunggal, sama isi/warna dengan `titleSegments`) di `intro={{...}}` `SceneChromeV1`, tanpa mengubah shared component sama sekali. Header/compact state tetap 1 baris seperti biasa (tidak terpengaruh).
  - 12 icon SVG inline ditambahkan di `acts/common.jsx`: `IconClient`, `IconServer`, `IconLock`, `IconGlobe`, `IconDatabase`, `IconSsh`, `IconShield`, `IconEar`, `IconHandshake`, `IconRocket`, `IconRouter`, `IconTower`, plus helper `laneIcon(laneId, color)`.
  - Icon diintegrasikan ke: `Spine` (client, host, tiap port lane sesuai service, listener/ear, gate/shield — shield berubah warna merah→hijau mengikuti `glow('gatePolicy')`), `Act3TcpUdp` (handshake untuk TCP, rocket untuk UDP), `Act6RealPath` (globe/router/tower untuk edge/NAT/backend).
- [x] Syntax/build check: `esbuild` per-file untuk `Animation.jsx` dan semua `acts/*.jsx` — lolos tanpa error.
- [x] Static audit: kata ganti orang bersih.
- [ ] Preview manual (`npm run dev` → `/player/network-ports`) — cek visual: warna judul, judul tidak terpotong di kedua state (hero besar & header kecil), semua icon terlihat jelas di ukuran kecil (16-18px) tanpa pecah.
- [ ] `npm run build` project penuh — belum dijalankan.
