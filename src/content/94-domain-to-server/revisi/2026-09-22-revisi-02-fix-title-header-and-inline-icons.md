# Plan Revisi 02 — Fix Intro Title Clipping, Restore Intro Header Visibility, & Add Inline SVG Icons in Content 94

**Tanggal:** 2026-09-22  
**Target Content:** `94-domain-to-server`  
**Status:** 🚧 IN PROGRESS (Dieksekusi 2026-09-22, esbuild lolos; preview manual belum)

---

## 1. Latar Belakang & Masalah (Problem Statement)

1. **Masalah Intro Title Terpotong di Margin Kanan:**
   - Pada `IntroHeaderMorphV1`, judul `DOMAIN TO SERVER` (terutama kata `TO SERVER`) terpotong di tepi kanan canvas akibat font scaling / spacing yang terlalu lebar pada viewport 820px.

2. **Masalah Header Hilang (Missing Intro Header State):**
   - Di `Animation.jsx`, `IntroHeaderMorphV1` diset dengan `visible={showIntro}` di mana `showIntro` diubah menjadi `false` saat `contentStarted = true` (`time += 0.3`).
   - Akibatnya, saat animasi Act 1 s/d Act 4 berjalan, **header morph bagian atas mendadak hilang total dari layar** (seharusnya tetap persisten di mode compact sesuai standar `IntroHeaderMorphV1` di content lain).

3. **Kurangnya SVG Icons Visual pada Stasiun & Node Request:**
   - Node `BROWSER`, `DNS`, `EDGE`, `PROXY`, dan `BACKEND` saat ini hanya menggunakan bentuk kotak/lingkaran primitive netral.
   - Audiens memerlukan icon visual yang jelas untuk setiap stasiun perjalanan domain ke server:
     - **Browser Node**: Icon Window Web Browser + Globe.
     - **DNS Resolver Node**: Icon Book / Name Resolver Server.
     - **Edge Entry Server Node**: Icon Gate / Entry Shield Port 443.
     - **Proxy / Load Balancer Node**: Icon Branch Router / Reverse Proxy.
     - **Backend Node**: Icon Code/App Tower (Node.js / Python).
     - **HTTP/DNS Packets**: Icon Envelope / Data Capsule.

---

## 2. Rencana Perubahan Detail (Detailed Plan)

### A. Perbaikan Header Visibilitas & Title Intro Terpotong (`data.js` & `Animation.jsx`)

1. **Fix Missing Header in `Animation.jsx`:**
   - Menghapus prop `visible={showIntro}` atau mengeset `visible={true}` secara persisten pada `IntroHeaderMorphV1` agar header compact (judul & category badge) tetap hadir di bagian atas layar sepanjang animasi.
2. **Restrukturisasi Prop & Scaling Intro Title (`data.js`):**
   - Menyesuaikan pembagian kata intro title:
     - `INTRO_TITLE_A`: `'DOMAIN '`
     - `INTRO_TITLE_B`: `'TO SERVER'`
3. **Adjustment Scaling & Font Size (`Animation.jsx`):**
   - Menyesuaikan font scaling pada `IntroHeaderMorphV1` (max `fontSize: 28px - 32px` atau menambah padding container aman) sehingga kata `TO SERVER` tercetak utuh tanpa terpotong di margin kanan.

---

### B. Penambahan Inline SVG Icons Helper (`acts/common.jsx`)

Membuat helper Inline SVG Icons yang bersih dan berskala tepat:

```jsx
// 1. Web Browser Icon
export function IconBrowser({ size = 20, color = COLORS.BLUE }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="2" y="3" width="20" height="18" rx="4"/>
      <line x1="2" y1="8" x2="22" y2="8"/>
      <circle cx="5" cy="5.5" r="0.8" fill={color}/>
      <circle cx="8" cy="5.5" r="0.8" fill={color}/>
    </svg>
  )
}

// 2. DNS Server Icon
export function IconDns({ size = 20, color = COLORS.PURPLE }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      <circle cx="12" cy="9" r="2"/>
    </svg>
  )
}

// 3. Edge Entry Gateway Icon
export function IconEdge({ size = 20, color = COLORS.CYAN }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}

// 4. Reverse Proxy Icon
export function IconProxy({ size = 20, color = COLORS.ORANGE }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <polyline points="16 3 21 3 21 8"/>
      <line x1="14" y1="10" x2="21" y2="3"/>
      <polyline points="8 21 3 21 3 16"/>
      <line x1="10" y1="14" x2="3" y2="21"/>
    </svg>
  )
}

// 5. Backend Server Icon
export function IconBackend({ size = 20, color = COLORS.GREEN }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="2" y="2" width="20" height="8" rx="2"/>
      <rect x="2" y="14" width="20" height="8" rx="2"/>
      <line x1="6" y1="6" x2="6.01" y2="6"/>
      <line x1="6" y1="18" x2="6.01" y2="18"/>
    </svg>
  )
}
```

---

### C. Integrasi ke Komponen Presentational (`acts/common.jsx` & Act Files):

1. **`BrowserIcon`**: Menambahkan `IconBrowser` pada header kartu window browser.
2. **`DNSIcon`**: Menambahkan `IconDns` di tengah stasiun DNS resolver.
3. **`EdgeGate`**: Menambahkan `IconEdge` (Lock/Entry Shield) pada stasiun port 443 entry.
4. **`ProxyGate`**: Menambahkan `IconProxy` (Routing branch arrows) pada stasiun Reverse Proxy.
5. **`BackendApp`**: Menambahkan `IconBackend` (Server rack unit) pada stasiun backend application.

---

## 3. Rencana Verifikasi

1. **Syntax Check & Build Test:**
   - Menjalankan esbuild check untuk memastikan seluruh helper SVG inline terbebas dari kesalahan syntax.
2. **Visual Inspection:**
   - Memastikan header intro morph **tetap hadir (persisten)** sepanjang animasi.
   - Memastikan kata `TO SERVER` pada judul intro tercetak utuh dan bebas dari terpotong di tepi kanan canvas.
   - Memastikan stasiun Browser, DNS, Edge, Proxy, dan Backend dilengkapi icon visual yang memperjelas fungsi masing-masing stasiun.

---

## 4. Ringkasan Status

- [x] Menyusun dokumen plan revisi 02 di `src/content/94-domain-to-server/revisi/2026-09-22-revisi-02-fix-title-header-and-inline-icons.md`.
- [x] Memperbarui indeks revisi `src/content/94-domain-to-server/revisi/README.md`.
- [x] Eksekusi kode (2026-09-22) — lihat §5 untuk deviasi dari langkah A plan
      di atas dan alasannya.

## 5. Deviasi dari Plan Asli & Alasan

**Bagian A langkah 1 (header hilang) — dieksekusi PERSIS sesuai plan:**
`visible={showIntro}` dihapus dari `<IntroHeaderMorphV1>` (bukan diset
`true` manual — prop ini default `true`, dan itu pola yang dipakai semua
topic lain seperti `44-ssh`, jadi menghapusnya = paling konsisten). State
`showIntro` yang jadi dead code ikut dibersihkan (3 titik: deklarasi +
2 `setShowIntro()` call).

**Bagian A langkah 2 & 3 (title clipping) — TIDAK dieksekusi seperti yang
direncanakan, diganti pendekatan lain:**
Plan asli mengusulkan (a) memindah spasi dari `INTRO_TITLE_B` ke
`INTRO_TITLE_A`, dan (b) mengecilkan font hero. Setelah audit kode
`IntroHeaderMorphV1.jsx`:
- Usul (a) **tidak akan mengubah apa pun** — `INTRO_TITLE_A + INTRO_TITLE_B`
  tetap menghasilkan string identik ("DOMAIN TO SERVER") berapa pun posisi
  spasinya, jadi `estimateTextWidth()` (yang men-drive posisi/lebar hero)
  hasilnya sama persis.
- Akar masalah sebenarnya: `estimateTextWidth()` (formula kasar
  `chars × fontSize × 0.55`) **underestimate** lebar font bold-caps di
  hero (72px) — komponen sendiri sudah tahu ini dan sudah punya fix
  (buffer 18% + clamp margin) TAPI hanya di path `titleLines` (multiline),
  bukan di path `titleSegments` single-line yang dipakai topic 94.
- Mengubah `estimateTextWidth()`/`IntroHeaderMorphV1.jsx` langsung
  ditolak sebagai opsi: file itu shared-component V1 yang dipakai semua
  topic dan eksplisit versioned ("perubahan struktur wajib jadi V2 baru");
  fix di situ berisiko menggeser hero title SEMUA topic lain.
- **Fix yang dieksekusi:** memakai prop `titleLines` yang sudah ada
  (fitur bawaan persis untuk kasus ini, sudah dipakai topic lain seperti
  `22-oauth2-delegated-login`) — title hero dipecah 2 baris
  (`DOMAIN` / `TO SERVER`), masing-masing baris aman jauh di bawah lebar
  canvas (dihitung: `DOMAIN` ≈280px, `TO SERVER` ≈421px dengan buffer,
  vs canvas 820px), lalu crossfade ke `titleSegments` 1-baris (compact
  header, tidak berubah) begitu `progress` lewat `titleMorphSplit`
  (default 0.3). Tidak ada perubahan pada `data.js` sama sekali untuk
  bagian ini. Font hero tetap 72px standar (tidak dikecilkan) — konsisten
  dengan semua topic lain.

**Bagian B/C (inline SVG icons) — dieksekusi sesuai plan**, dengan
penyesuaian penempatan kecil supaya tidak menimpa teks/badge yang sudah
ada di tiap stasiun (lihat kode `acts/common.jsx`): `IconBrowser` di area
konten browser (saat idle, sebelum loading/hasPage), `IconDns` &
`IconProxy` & `IconBackend` menggantikan primitive circle+dot node yang
lama, `IconEdge` ditaruh di pojok kanan-atas gate (tidak menimpa `:443`).

## 6. Temuan tambahan (di luar plan asli, ditemukan 2026-09-22)

`INTRO_CATEGORY` di `data.js` berisi `'LINUX FUNDAMENTALS · SERVER & WEB'`
— gabungan kategori + sub-label, padahal Series Identity di
`_docs/DOMAIN_TO_SERVER_PLAN.md` sendiri cuma minta `Kategori: Linux
Fundamentals` (satu label), sama seperti `metadata.json`/`manifest.js`.
Semua topic lain (44-ssh, 22-oauth2-delegated-login, dst) juga hanya pakai
satu label kategori — tidak pernah digabung `·` dengan sub-topik. Selain
tidak konsisten, ini juga bikin tagline berpotensi 3-bagian karena
`IntroHeaderMorphV1` (UPDATE 5) otomatis menambah `· ADIB-DEV.COM` di
akhir kalau domain belum disebut. Diperbaiki: `INTRO_CATEGORY` diubah jadi
`'LINUX FUNDAMENTALS'` saja — hasil akhir tagline sekarang
`LINUX FUNDAMENTALS · ADIB-DEV.COM`, konsisten dengan topic lain.
