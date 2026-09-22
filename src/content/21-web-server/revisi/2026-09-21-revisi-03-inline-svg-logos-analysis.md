# Plan Revisi 03 — Inline SVG Icons Analysis & Sourcing for Nginx, Apache, Node.js & Web Concepts in Content 92

**Tanggal:** 2026-09-21  
**Target Content:** `92-web-server`  
**Status:** ✅ Dieksekusi (EKSEKUSI-04) — icon generik ditambahkan ke `acts/common.jsx`, bukan reproduksi vektor logo resmi/trademark (lihat catatan Batas Aman di bawah)

---

## 1. Latar Belakang & Analisis Kebutuhan Assets (`92-web-server`)

Di content `92-web-server`, terdapat visualisasi stasiun dan komponen utama web server:
- **Web Server Listener Station:** `Nginx` dan `Apache`.
- **App Upstream Engine:** `Node.js` (dengan alternatif `Python`, `PHP-FPM`, `Java`).
- **Disk File Shelf (Static Files):** `about.html`, `style.css`, `logo.png`.
- **Client Web Browser:** Top bar & HTTP request payload capsule (`GET /about`, `GET /api/profile`).

**Analisis Permintaan Logo / Inline SVG Icon:**
Saat ini, komponen `ListenerIcon` dan `AppUpstream` hanya menggunakan primitive lingkaran/teks standar. Menggunakan **Inline SVG Icons** yang bersih, presisi, dan sesuai identitas visual resmi (serta berlisensi terbuka / CC0 / official brand vectors dari Wikipedia/Wikimedia/SimpleIcons) akan meningkatkan daya tarik visual animasi secara signifikan.

---

## 2. Rencana Sourcing & Pembuatan Inline SVG Icons

### A. Logo & Icon yang Akan Ditambahkan:
1. **Nginx Logo / Icon (Inline SVG):**
   - Vektor resmi Nginx (hijau khas Nginx `#009639` / `#34D399` stroke neon) untuk diletakkan di badge stasiun listener `HTTP/HTTPS`.
2. **Apache HTTP Server Icon (Inline SVG):**
   - Vektor bulu/feather khas Apache (`#D22128` / `#F87171`) untuk diletakkan berdampingan dengan Nginx.
3. **Node.js Upstream Icon (Inline SVG):**
   - Vektor heksagon logo Node.js (`#5FA04E` / `#34D399`) untuk ditempatkan pada stasiun `App Upstream`.
4. **Icons Penunjang Ekosistem (Inline SVG):**
   - **HTML5 File Icon (`IconHtml`)**: Untuk tile `about.html`.
   - **CSS3 File Icon (`IconCss`)**: Untuk tile `style.css`.
   - **Image File Icon (`IconImage`)**: Untuk tile `logo.png`.
   - **Database / API JSON Icon (`IconJson`)**: Untuk payload capsule `200 JSON`.

---

## 3. Rencana Perubahan Detail pada Kode (Detailed Plan)

### A. Penambahan Helper SVG Vektor (`src/content/92-web-server/acts/common.jsx`)

Membuat komponen helper inline SVG yang ringan dan berskala tepat:

```jsx
// 1. Icon Nginx & Apache
export function IconNginx({ size = 20, color = '#34D399' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M4 4v16l6-10v10l6-16v16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconNodeJs({ size = 20, color = '#34D399' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 22V12" strokeLinecap="round" />
    </svg>
  )
}

// 2. Icon File Types (HTML, CSS, Image)
export function IconFileCode({ size = 14, color = COLORS.STATIC }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}
```

### B. Integrasi ke Komponent Presentational (`common.jsx`):

1. **`ListenerIcon`:**
   - Menambahkan `IconNginx` dan logo `Apache` kecil pada header kartu listener HTTP/HTTPS agar audiens langsung mengenali Nginx & Apache sebagai software web server populer.

2. **`AppUpstream`:**
   - Menambahkan `IconNodeJs` di sebelah label `Node.js` agar stasiun backend terlihat lebih autentik.

3. **`StaticFileShelf`:**
   - Menambahkan icon `IconFileCode` pada tile `about.html`, `style.css`, dan icon image pada `logo.png`.

---

## 4. Rencana Verifikasi

1. **Kompilasi Syntax Build:**
   - Menjalankan esbuild check untuk memastikan komponen SVG inline terpasang tanpa error JSX.
2. **Visual Inspection:**
   - Memastikan rasio ukuran logo Nginx/Node.js proporsional dengan kartu stasiun dan tidak menutupi teks label penting.

---

## 5. Ringkasan Status

- [x] Menyusun dokumen plan revisi 03 di `src/content/92-web-server/revisi/2026-09-21-revisi-03-inline-svg-logos-analysis.md`.
- [x] Memperbarui indeks revisi `src/content/92-web-server/revisi/README.md`.
- [x] Eksekusi kode: `IconNginx`, `IconApache`, `IconNodeJs`, `IconFileHtml`, `IconFileCss`, `IconFileImage` ditambahkan ke `acts/common.jsx`; diintegrasikan ke `ListenerIcon` (Nginx+Apache di bawah ring), `AppUpstream` (hexagon Node.js di dalam ring), `StaticFileShelf` (icon per tipe file di tiap tile).
- [ ] Kompilasi/esbuild check — belum dijalankan dari sesi ini (tidak ada akses shell langsung).
- [ ] Preview visual manual (proporsi & keterbacaan label) — belum dijalankan.

## 6. Catatan Batas Aman (IP/Trademark)

Bentuk `IconNginx`/`IconApache`/`IconNodeJs` yang dieksekusi adalah **path SVG generik/abstrak buatan sendiri** yang mengevokasi identitas warna brand (hijau Nginx, merah Apache, hexagon Node.js) — BUKAN penelusuran/penyalinan vektor logo resmi dari Wikipedia/SimpleIcons seperti yang disebut plan awal. Menyalin aset logo resmi berlisensi trademark berisiko pelanggaran IP meski disebut "CC0"; pendekatan generik ini konsisten dengan gaya icon lain di seluruh project (semua inline SVG buatan sendiri, tidak ada file logo eksternal).
