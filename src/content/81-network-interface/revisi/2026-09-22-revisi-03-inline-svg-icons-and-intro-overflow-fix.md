# Plan Revisi 03 — Sourcing Inline SVG Icons & Fix Intro Title Overflow in Content 81

**Tanggal:** 2026-09-22  
**Target Content:** `81-network-interface`  
**Status:** ✅ Diimplementasikan + divalidasi lewat screenshot nyata (Puppeteer, bukan cuma compile-check)  
**Dieksekusi:** 2026-09-22 (lanjutan sesi setelah revisi-02)

---

## 1. Latar Belakang & Masalah (Problem Statement)

1. **Masalah Intro Title Terpotong di Sisi Kanan:**
   - Pada `IntroHeaderMorphV1`, judul `NETWORK INTERFACE` (terutama `INTRO_TITLE_B: ' INTERFACE'`) terpotong di tepi kanan canvas akibat ukuran font / spacing yang terlalu lebar pada viewport 820px.
   - Perlu penyesuaian font scaling / spacing agar kata `INTERFACE` muat penuh tanpa terpotong.

2. **Kurangnya SVG Icons Visual pada Kartu & Stasiun Interface:**
   - Saat ini komponen `ConceptCard` dan `AnchorIcon` hanya berupa kotak netral dengan teks tanpa icon visual penjelas.
   - Audiens memerlukan icon visual yang jelas untuk setiap konsep jaringan:
     - **Wired / Ethernet Icon (`IconEthernet`)**: Port RJ45 / kabel ethernet.
     - **Wi-Fi Icon (`IconWifi`)**: Sinyal nirkabel / gelombang radio.
     - **Loopback Icon (`IconLoopback`)**: Panah melingkar / self-reference (`127.0.0.1`).
     - **MAC Address Icon (`IconMac`)**: Chip hardware / NIC card.
     - **IP Address Icon (`IconIp`)**: Node alamat IP / jaringan.
     - **DHCP / Static Icon (`IconConfig`)**: Server DHCP / gear setting manual.
     - **Gateway / Route Icon (`IconRoute`)**: Router / junction cabang jalan.
     - **DNS Icon (`IconDns`)**: Buku alamat / server pemeta domain.
     - **Virtual Interface Icons (`IconVirtual`)**: Tunnel / bridge / veth container.

---

## 2. Rencana Perubahan Detail (Detailed Plan)

### A. Perbaikan Title Intro Sisi Kanan Terpotong (`data.js` & `Animation.jsx`)

1. **Restrukturisasi Prop Judul (`data.js`):**
   - Menyesuaikan pembagian kata intro title:
     - `INTRO_TITLE_A`: `'NETWORK '`
     - `INTRO_TITLE_B`: `'INTERFACE'`
2. **Adjustment Scaling & Font Size (`Animation.jsx`):**
   - Menyesuaikan scaling font pada `IntroHeaderMorphV1` (misalnya mengatur max `fontSize: 28px - 32px` atau menambah padding container aman) sehingga kata `INTERFACE` tercetak utuh tanpa terpotong di tepi kanan margin.

---

### B. Penambahan Inline SVG Icons Helper (`acts/common.jsx`)

Membuat komponen helper Inline SVG Icons yang bersih dan berskala tepat:

```jsx
// 1. Ethernet (Wired) Icon
export function IconEthernet({ size = 20, color = COLORS.WIRED }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M6 2h12v6H6zM4 8h16v14H4zM9 14h2v4H9zM13 14h2v4h-2z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// 2. Wi-Fi Icon
export function IconWifi({ size = 20, color = COLORS.WIFI }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M5 12.55a11 11 0 0114 0M8.5 16.05a7 7 0 017 0M12 20h.01" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// 3. Loopback Icon
export function IconLoopback({ size = 20, color = COLORS.LOOPBACK }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M4 12a8 8 0 1116 0 8 8 0 01-16 0zM12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// 4. Hardware MAC Icon
export function IconMac({ size = 20, color = COLORS.MAC }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="2" y="6" width="20" height="12" rx="2"/>
      <path d="M6 12h4M14 12h4" strokeLinecap="round"/>
    </svg>
  )
}

// 5. Router / Gateway Icon
export function IconRoute({ size = 20, color = COLORS.ROUTE }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="6" cy="19" r="3"/>
      <path d="M9 19h6a3 3 0 003-3V7"/>
      <polyline points="15 9 18 6 21 9"/>
    </svg>
  )
}
```

---

### C. Integrasi ke Komponen Presentational (`acts/common.jsx` & Files `Act1` s/d `Act6`):

1. **`ConceptCard` Enhancement:**
   - Memasukkan prop `iconId` / `icon` pada `ConceptCard` untuk merender icon SVG di sebelah/atas label teks.
2. **`AnchorIcon` Enhancement:**
   - Menambahkan visualisasi port kabel `IconEthernet` di tengah stasiun `eth0`.
3. **Pembaruan Scene Per Act:**
   - **Act 1:** Memasang `IconEthernet`, `IconWifi`, `IconLoopback` pada 3 stasiun interface.
   - **Act 2:** Memasang `IconLink`, `IconMac`, `IconIp` pada tumpukan layer identitas.
   - **Act 3:** Memasang `IconConfig` (DHCP/Static) dan icon IP/Route/DNS pada hasil rincian.
   - **Act 4:** Memasang `IconIp` (Subnet Lokal) dan `IconRoute` (Default Gateway).
   - **Act 5:** Memasang `IconDns` pada proses penerjemahan nama ke alamat IP.
   - **Act 6:** Memasang icon tunnel/virtual pada 5 jenis virtual interfaces (Loopback, Bridge, VLAN, VPN, Container).

---

## 3. Rencana Verifikasi

1. **Syntax Check & Build Test:**
   - Menjalankan esbuild check untuk meyakinkan seluruh komponen inline SVG tidak memiliki tag terputus / error syntax.
2. **Visual Inspection:**
   - Memastikan judul `NETWORK INTERFACE` muat utuh di margin kanan.
   - Memastikan seluruh 6 Act memiliki icon visual yang konsisten, jelas, dan memperjelas pesan ke audiens.

---

## 4. Ringkasan Status

- [x] Menyusun dokumen plan revisi 03 di `src/content/81-network-interface/revisi/2026-09-22-revisi-03-inline-svg-icons-and-intro-overflow-fix.md`.
- [x] Memperbarui indeks revisi `src/content/81-network-interface/revisi/README.md`.
- [x] **Eksekusi kode selesai** — lihat §5 di bawah untuk implementasi aktual (berbeda dari rencana awal di beberapa detail, berdasarkan verifikasi empiris).

## 5. Implementasi Aktual (berbeda dari rencana di beberapa detail)

### A. Title overflow — BUKAN direstrukturisasi split kata

Verifikasi empiris (Puppeteer, `getBBox()` pada elemen `<text>` sesungguhnya)
mengonfirmasi klaim: `"NETWORK INTERFACE"` di font hero 72px punya lebar
render **799.85px** — canvas 820px dengan margin 16px kiri-kanan hanya
punya ruang 788px, jadi judul **secara matematis tidak mungkin muat 1 baris**
di ukuran font itu, berapa pun titik potong kata A/B-nya (mengubah
`INTRO_TITLE_A`/`INTRO_TITLE_B` seperti rencana §2.A.1 tidak mengubah
lebar total teks sama sekali — bukan fix yang efektif).

**Fix aktual:** pakai fitur `titleLines` yang sudah ada di
`IntroHeaderMorphV1` (dipakai topic `22-oauth2-delegated-login` untuk kasus
sama persis — judul panjang). Ditambahkan ke `Animation.jsx`:
```jsx
titleLines={[
  [{ label: 'NETWORK', color: COLORS.WIRED }],
  [{ label: 'INTERFACE', color: COLORS.IP }],
]}
```
Hero menampilkan 2 baris terpisah (masing-masing jauh di bawah 788px),
morph ke `titleSegments` 1-baris di header compact (44px, aman, ~488px).
Diverifikasi ulang: `rightEdge` tiap baris ≤618.6px, jauh dari tepi 820px.

### B/C. Inline SVG Icons — sesuai rencana, dengan penyesuaian

14 icon dibuat di `acts/common.jsx` (bukan 9 seperti draft awal — beberapa
konsep butuh icon sendiri untuk kejelasan visual): `IconEthernet`,
`IconWifi`, `IconLoopback`, `IconLink`, `IconMac`, `IconIp`, `IconConfig`,
`IconRoute`, `IconDns`, `IconName`, `IconBridge`, `IconVlan`, `IconVpn`,
`IconContainer`. Semua 24×24 viewBox, stroke-based, terima `{size, color}`.

`ConceptCard` (`acts/common.jsx`) diperluas terima prop `icon` opsional —
kalau ada, layout internal card digeser (icon di atas, label di tengah,
desc di bawah) memakai formula relatif terhadap tinggi card (`h`), teruji
aman di card tersempit (`h=54`, layer stack Act 2). `AnchorIcon` diganti
memakai `IconEthernet` (ganti glyph port manual sebelumnya).

Semua 6 file Act diupdate memetakan `icon` per item:
- Act1: wired→Ethernet, wifi→Wifi, loopback→Loopback
- Act2: link→Link, mac→Mac, ip→Ip
- Act3: dhcp/static→Config (sama), address→Ip, gateway→Route, dns→Dns
- Act4: local→Ip, gateway→Route
- Act5: name→Name, dns→Dns, route→Route, interface→Ethernet
- Act6: loopback→Loopback, bridge→Bridge, vlan→Vlan, vpn→Vpn, container→Container

## 6. Validasi

- esbuild bundle-check isolasi topic 81 (React/gsap external) — lolos, 60.5kb.
- Screenshot nyata (Puppeteer + dev server) tiap Act (1–6) setelah icon
  dipasang — semua icon render jelas, tidak ada overlap, termasuk di card
  tersempit (`h=54`, Act 2) dan card terpadat (5 chip berjajar, Act 6).
- Title hero 2-baris diverifikasi lewat `getBBox()` — tidak overflow.
- Metode pengukuran/screenshot sama seperti revisi-02 (`scripts/preview-frames.mjs`
  + review manual tiap PNG via `Desktop Commander:read_file`).

## 7. Yang tidak diubah / catatan

- Storyboard, teks caption/copy, warna dasar, timing GSAP — tidak berubah.
- `metadata.json`/`manifest.js` — tidak berubah (title/subtitle tetap
  `"Network Interface"` / `"Titik koneksi OS ke jaringan"`, tidak
  terpengaruh oleh `titleLines` yang hanya bagian dari `Animation.jsx`).
- Preview manual detail per-frame lain (mis. transisi morph di antara 2
  state) dan export MP4 penuh masih di luar scope sesi ini.
