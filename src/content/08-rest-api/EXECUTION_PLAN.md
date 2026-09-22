# 17-rest-api — Execution Plan (7 Revisions)

**Date:** 2026-09-12  
**Status:** Planning Phase  
**Target:** Execute revisions 06 & 07 to complete REST API topic  

---

## 1. Roadmap Overview

Struktur 7 revisi REST API:

```
Revisi-01/02/03 ← Rencana & Standar (dari TOPIC_PLAN.txt)
        ↓
Revisi-04 ← Lengkapi Method REST & Accelerate (✅ Compile check OK)
        ↓
Revisi-05 ← Profil Visual Adib & API Service Hub (🔧 Rencana saja, partial di codebase)
        ↓
Revisi-06 ← 4 Act Kontinyu, Hapus Act 5 Epilog (🔧 PRIORITY #1)
        ↓
Revisi-07 ← Networking Header, 3 User, Loading State (🔧 PRIORITY #2)
```

---

## 2. Analisis Status Hari Ini

### 2.1 Yang Sudah Selesai

- **Revisi-04 checklist**: Sebagian besar implemented
  - [x] PUT dan PATCH ditambah ke TEASER_VARIANTS
  - [x] Timeline menjadi iterasi seluruh varian
  - [x] Budget PHASES diubah: 10s + 8s + 11s + 9s + 8s
  - [x] Isolated compile check (npx esbuild) lulus
  - [ ] Preview video manual
  - [ ] Export MP4

- **Data & Struktur Kode** (dari Animation.jsx, data.js)
  - ADIB_PROFILE sudah ada: hair, role, age
  - CABINET_SLOTS untuk kartu anggota
  - REQUESTS.GET, .POST, .PUT, .PATCH, .DELETE
  - Hero-to-header morph (partial, seperti Tailscale)
  - API Service Hub muncul redup sejak Act 1

### 2.2 Yang Perlu Dilakukan (Revisi-06 & 07)

**Revisi-06 — 4 Act Kontinyu:**
- [ ] Hapus seluruh timeline Act 5
- [ ] Pecah TEASER_VARIANTS menjadi request operasi yang dipetakan ke Act 3/4
- [ ] Ubah subtitle intro ke "Browser → API Service → Profil"
- [ ] Mulai tiket GET segera setelah dibuat (0,15–0,25s), bukan menunggu phase end
- [ ] API Service Hub tetap visible redup sejak awal Act 1
- [ ] Implement 4 Act timing: 3,5s + 8,5s + 13,5s + 13,5s

**Revisi-07 — Networking Header & 3 User:**
- [ ] Ubah kategori intro ke NETWORKING (mint green #2CD1A8)
- [ ] Terapkan koordinat header Tailscale (x44, y50/100/130)
- [ ] Browser Act 1 loading state (skeleton, spinner, belum ada data)
- [ ] Tambah Jokowo & Prabowo: dua mini form + dua mini profile
- [ ] POST Jokowo (Act 3), PUT Adib (Act 3), PATCH Jokowo (Act 4), DELETE Prabowo (Act 4)
- [ ] Generate icon batch 1&2

---

## 3. Execution Tasks — Hierarchy Unlimited

### 3.1 Persiapan & Audit Codebase

**3.1.1. Verifikasi struktur file saat ini**
- 3.1.1.1. Baca Animation.jsx (current line: 100 of 505)
- 3.1.1.2. Baca data.js (struktur PHASES, ADIB_PROFILE, REQUESTS)
- 3.1.1.3. Identifikasi mana yang sudah sesuai Revisi-06 vs yang perlu diubah
- 3.1.1.4. List semua state yang perlu dipersisten (Adib hair, role; Nina/Jokowo/Prabowo presence)

**3.1.2. Identifikasi area yang harus dirombak**
- 3.1.2.1. Revisi-04 state yang bertabrakan dengan Revisi-06 (Act 5, TEASER_VARIANTS loop)
- 3.1.2.2. Header/intro code — apakah sudah memakai format Tailscale?
- 3.1.2.3. Browser component — apakah siap untuk loading state?
- 3.1.2.4. API Service Hub rendering — opacity transition dari 0,25 ke aktif

### 3.2 Implementasi Revisi-06 (4 Act Kontinyu)

**3.2.1. Timeline & Phase Structure**

- 3.2.1.1. Ubah PHASES array dari 5 menjadi 4 entry
  - 3.2.1.1.1. Act 1: Adib Kirim GET (3,5s)
  - 3.2.1.1.2. Act 2: API Mengembalikan Profil Adib (8,5s)
  - 3.2.1.1.3. Act 3: Browser Membuat dan Mengganti Data (13,5s)
  - 3.2.1.1.4. Act 4: Browser Mengubah dan Menghapus Data (13,5s)
  - 3.2.1.1.5. Total durasi target: 39 detik

- 3.2.1.2. Hapus seluruh Act 5 code block
  - 3.2.1.2.1. Cari reference ke phaseIdx === 4
  - 3.2.1.2.2. Hapus TEASER_STEP loop
  - 3.2.1.2.3. Ubah closing timeline untuk langsung ke popOut

**3.2.2. Request Flow (Tiket Kontinu)**

- 3.2.2.1. Implementasi helper `travelRequest()`
  - 3.2.2.1.1. Tiket berangkat 0,15–0,2s setelah `pop_in` selesai
  - 3.2.2.1.2. Tiket melaju: P0 (Client) → P1 (Exit) → P2 (Midpoint) → P3 (Gate)
  - 3.2.2.1.3. Durasi travel kurang dari 1,5s (lebih cepat dari Revisi-05)
  - 3.2.2.1.4. Jangan pop-out tiket di batas Act; lanjutkan visual tanpa reset

- 3.2.2.2. GET request path (Act 1–2)
  - 3.2.2.2.1. Tiket lahir dari tombol Lihat Profil setelah 0,5s pada Act 1
  - 3.2.2.2.2. Mulai bergerak 0,15s setelah pop_in
  - 3.2.2.2.3. Masuk Gate pada 1,4s; Act 2 mulai saat tiket ada di Gate (jangan gap)
  - 3.2.2.2.4. Processor ingress maksimal 0,35s, card Adib keluar dari cabinet
  - 3.2.2.2.5. Response 200 kembali ke browser saat 6,45–8,1s

- 3.2.2.3. POST Jokowo & Prabowo (Act 3 Beat A)
  - 3.2.2.3.1. Form Jokowo mengirim tiket POST pertama
  - 3.2.2.3.2. Card Jokowo masuk slot kosong; response 201
  - 3.2.2.3.3. Maksimal 0,35s jeda, form Prabowo kirim POST kedua
  - 3.2.2.3.4. Card Prabowo masuk slot kedua; response 201
  - 3.2.2.3.5. Total durasi Beat A: 6,2s dari awal Act 3

- 3.2.2.4. PUT Adib (Act 3 Beat B)
  - 3.2.2.4.1. Browser masuk mode edit, preview rambut ungu dipilih
  - 3.2.2.4.2. Tiket PUT bergerak dengan mini-card Adib versi lengkap
  - 3.2.2.4.3. Card Adib lama flip/keluar, card baru masuk dengan rambut ungu
  - 3.2.2.4.4. Response 200 Replaced kembali; durasi 7,3s

- 3.2.2.5. PATCH Jokowo (Act 4 Beat A)
  - 3.2.2.5.1. Tiket PATCH hanya membawa badge role change
  - 3.2.2.5.2. Card Jokowo tetap slot, hanya layer outfit/badge berubah
  - 3.2.2.5.3. Response 200 Updated; durasi 6,2s

- 3.2.2.6. DELETE Prabowo (Act 4 Beat B)
  - 3.2.2.6.1. Tiket DELETE + card Prabowo ditarik ke archive tray
  - 3.2.2.6.2. Slot Prabowo kosong; response 204 No Content
  - 3.2.2.6.3. Durasi 7,3s; closing menampilkan Adib & Jokowo, Prabowo hilang

**3.2.3. API Service Hub Visibility**

- 3.2.3.1. Set hubOpacity = 0,25 sejak initialization
  - 3.2.3.1.1. Hub tidak pop-in terlambat; sudah terlihat samar saat Act 1 dimulai
  - 3.2.3.1.2. Opacity naik ke 0,6–0,8 saat tiket masuk Gate/Processor
  - 3.2.3.1.3. Cabinet buka SAAT processor menyala, bukan sebelumnya

- 3.2.3.2. Gate + Processor + Cabinet = 1 visual unit
  - 3.2.3.2.1. Jangan render sebagai 3 elemen terpisah
  - 3.2.3.2.2. Compartment layout: Gate x=250, Processor x=310, Cabinet x=370

**3.2.4. Data State Persistence**

- 3.2.4.1. Implementasi single source of truth untuk kartu
  - 3.2.4.1.1. adibHair: 'black' → 'black' (GET) → 'black' (PUT) → 'purple'
  - 3.2.4.1.2. adibRole: 'Student' → 'Student' (GET/PUT) → 'Worker' (PATCH)
  - 3.2.4.1.3. jokowoPresent: false → true (POST) → true (PATCH) → true
  - 3.2.4.1.4. prabowoPresent: false → true (POST) → false (DELETE)

- 3.2.4.2. Cabinet slot state
  - 3.2.4.2.1. 4 slot total: Adib (index 0, permanent), Jokowo (1), Prabowo (2), empty (3)
  - 3.2.4.2.2. POST mengisi slot kosong; DELETE mengosongkan slot
  - 3.2.4.2.3. Setiap render, looping cabinet terlihat dengan state terkini

**3.2.5. Intro Refinement (Early Steps)**

- 3.2.5.1. Ubah subtitle intro
  - 3.2.5.1.1. Old: "Browser → API Service → Profil" (Revisi-05)
  - 3.2.5.1.2. Keep: Format hero-to-header Tailscale (morph, NO typing)

- 3.2.5.2. Verify header coordinates (akan diperdalam Revisi-07)
  - 3.2.5.2.1. Title dari tengah ke x=44, y=100
  - 3.2.5.2.2. Warna tetap SKY BLUE (Revisi-05 palette)

### 3.3 Implementasi Revisi-07 (Networking Header, 3 User)

**3.3.1. Intro & Header — Kategori Networking**

- 3.3.1.1. Ubah intro metadata
  - 3.3.1.1.1. Category: "NETWORKING · ADIB-DEV.COM"
  - 3.3.1.1.2. Title color: "REST" mint green (#2CD1A8), "API" sky blue (#38BDF8)
  - 3.3.1.1.3. Background: navy #070913

- 3.3.1.2. Apply Tailscale header format secara presisi
  - 3.3.1.2.1. x = 44, y tagline = 50, y title = 100, y subtitle = 130
  - 3.3.1.2.2. Font size: tagline 13px, title 44px, subtitle 15px
  - 3.3.1.2.3. Morph duration: 0,8s power3.inOut, 0,2s settle sebelumnya

- 3.3.1.3. Verify zone layout aman
  - 3.3.1.3.1. Header zone: y 40–140
  - 3.3.1.3.2. Phase badge: y 155–195
  - 3.3.1.3.3. Safe gutter: y 196–234
  - 3.3.1.3.4. Browser zone: y 235–475 (tidak naik ke header)

**3.3.2. Browser UI & Loading State**

- 3.3.2.1. Browser awal (Act 1 start)
  - 3.3.2.1.1. Tampilkan: avatar placeholder, spinner, "Memuat profil..."
  - 3.3.2.1.2. Tombol: "Lihat Profil" yang klik-nya trigger request GET
  - 3.3.2.1.3. Skeleton line dummy (tidak ada nama, usia, role)

- 3.3.2.2. Browser hydrate (Act 2, saat response 200 tiba)
  - 3.3.2.2.1. Spinner fade; skeleton menjadi profile card
  - 3.3.2.2.2. Avatar Adib muncul (usia 12, seragam SD, rambut hitam)
  - 3.3.2.2.3. Nama, usia, role, rambut detail masuk
  - 3.3.2.2.4. Tombol "Ubah Profil" & "Lihat Member" tersedia di akhir Act 2

- 3.3.2.3. Mini form POST (Act 2 akhir, jembatan ke Act 3)
  - 3.3.2.3.1. Dua mini browser: "Form Jokowo" + "Form Prabowo"
  - 3.3.2.3.2. Ukuran: maksimal 150 × 68px masing-masing
  - 3.3.2.3.3. Posisi: y 235–475 atau 475–590 (Transit zone)
  - 3.3.2.3.4. Muncul stagger 0,15–0,2s; tidak overlapping main browser

**3.3.3. Tiga User & State Management**

- 3.3.3.1. Adib (12 → 26 tahun, Student → Professional, seragam SD → jas, rambut hitam → ungu)
  - 3.3.3.1.1. GET: ambil profil awal 12/Student/SD/hitam
  - 3.3.3.1.2. PUT: ganti ke 26/Professional/jas/ungu
  - 3.3.3.1.3. Avatar visual Adib-student vs Adib-professional harus sama framing

- 3.3.3.2. Jokowo (dibuat POST, role berubah PATCH)
  - 3.3.3.2.1. POST: masukkan Jokowo ke slot kosong pertama (status 201)
  - 3.3.3.2.2. PATCH: ubah role Student → Professional (status 200)
  - 3.3.3.2.3. Slot tetap, hanya layer outfit/badge berubah

- 3.3.3.3. Prabowo (dibuat POST, dihapus DELETE)
  - 3.3.3.3.1. POST: masukkan Prabowo ke slot kosong kedua (status 201)
  - 3.3.3.3.2. DELETE: tarik ke archive tray (status 204)
  - 3.3.3.3.3. Slot kosong kembali; Prabowo tidak ada di final state

**3.3.4. Asset & Icon Plan (Batch 1 & 2)**

- 3.3.4.1. Batch 1 — Character & Browser (2 × 4 grid)
  - 3.3.4.1.1. browser-profile-loading: skeleton UI
  - 3.3.4.1.2. adib-student-black-hair: 12 tahun, SD, rambut hitam
  - 3.3.4.1.3. adib-professional-purple-hair: 26 tahun, jas, rambut ungu
  - 3.3.4.1.4. jokowo-student: generik berbeda dari Adib
  - 3.3.4.1.5. jokowo-professional: outfit berubah, pose sama
  - 3.3.4.1.6. prabowo-member: generik ketiga (berbeda siluet)
  - 3.3.4.1.7. api-service-hub-network: gate + processor + cabinet

- 3.3.4.2. Batch 2 — Operasi (2 × 4 grid)
  - 3.3.4.2.1. get-profile-ticket
  - 3.3.4.2.2. post-jokowo-ticket, post-prabowo-ticket
  - 3.3.4.2.3. put-profile-replace (dua kartu penuh, flip)
  - 3.3.4.2.4. patch-role-swap (badge saja, bukan kartu lengkap)
  - 3.3.4.2.5. delete-prabowo-archive

- 3.3.4.3. Palette enforcement
  - 3.3.4.3.1. Mint #2CD1A8 untuk intro
  - 3.3.4.3.2. Sky #38BDF8 untuk request/client
  - 3.3.4.3.3. Amber #FBBF24 untuk API Service processing
  - 3.3.4.3.4. Green #34D399 untuk success/response
  - 3.3.4.3.5. Violet #A78BFA untuk rambut ungu Adib

**3.3.5. Badge & Phase Navigation**

- 3.3.5.1. Badge layout Tailscale
  - 3.3.5.1.1. Position: x 44, y 155, width 500, height 40, radius 20
  - 3.3.5.1.2. Text: monospace 13px bold, letter-spacing 0,5
  - 3.3.5.1.3. Bullet: cx 22, cy 20; warna Act aktif

- 3.3.5.2. Dot group
  - 3.3.5.2.1. Position: x 620, y 167
  - 3.3.5.2.2. 4 dot, gap 24px
  - 3.3.5.2.3. Aktif: radius 7, warna Act, stroke putih 1,5px
  - 3.3.5.2.4. Nonaktif: radius 4, warna BORDER

---

## 4. Validation & Testing Checklist

### 4.1 Revisi-06 Validation

- [ ] Compile check (npx esbuild) lulus tanpa error
- [ ] Timeline total: 39 detik (bukan 46 atau 54)
- [ ] Tiket GET berangkat <0,3s setelah pop_in
- [ ] Hub opacity 0,25 sejak mulai; naik saat tiket masuk
- [ ] Tidak ada tiket yang pop-out di batas Act
- [ ] POST/PUT/PATCH/DELETE masing-masing terlihat sebagai request dari browser
- [ ] PUT mengganti kartu penuh; PATCH hanya badge
- [ ] DELETE menghapus kartu Nina yang sebelumnya dibuat POST
- [ ] Tidak ada Act 5
- [ ] Intro tetap format Tailscale (tanpa typing)

### 4.2 Revisi-07 Validation

- [ ] Intro berwarna mint (REST) & sky (API), kategori NETWORKING
- [ ] 4 dot Act selalu terlihat
- [ ] Data Adib tidak muncul sebelum GET response
- [ ] Browser loading state terlihat jelas
- [ ] Mini form Jokowo & Prabowo tidak overlapping main browser
- [ ] Ketiga user punya operasi visual berbeda
- [ ] Seragam SD/topi vs pakaian profesional terbaca satu pandangan
- [ ] Badge Tailscale x44 y155 tidak menutupi subtitle
- [ ] Icon batch 1&2 preview pada ukuran target

### 4.3 End-to-End Testing

- [ ] Export MP4 full timeline 4 Act
- [ ] Frame-by-frame check transisi Act 1→2, 2→3, 3→4, loop 4→1
- [ ] Tempo 39s terasa kontinyu tanpa blank frame
- [ ] Semua detail kartu terbaca (usia, role, rambut)
- [ ] Status code (200, 201, 204) muncul di waktu yang tepat

---

## 5. File Checklist & References

| File | Status | Action |
|---|---|---|
| Animation.jsx | ⚠️ Partial Rev-06 | Review line 100–505, implementasi full Rev-06 & 07 |
| data.js | ⚠️ Partial Rev-05 | Update PHASES, REQUESTS, USER states |
| icons/icons.json | ❌ Not started | Generate Batch 1&2 |
| icons/loader.js | ❌ Not started | Create loader untuk batch 1&2 |
| manifest.js | ✅ Ready | Update category ke "Networking" |
| revisi/2026-09-12-revisi-06.md | 📋 Reference | Check detail kontinu & timing |
| revisi/2026-09-12-revisi-07.md | 📋 Reference | Check Tailscale format & 3 user |

---

## 6. Success Criteria (Akhir Revisi-07)

✅ **Semua kondisi ini harus terpenuhi:**

1. GET tidak menunggu di browser; tiket berangkat <0,3s
2. API Service terlihat sejak Act 1 (redup) dan naik saat request masuk
3. 4 Act kontinyu, total 39s, tanpa jeda kosong >1s
4. Setiap method (GET/POST/PUT/PATCH/DELETE) adalah request dari browser dengan payload visual
5. Adib berubah 12→26 tahun, Student→Professional, rambut hitam→ungu
6. Jokowo: created (POST) lalu role changed (PATCH)
7. Prabowo: created (POST) lalu deleted (DELETE)
8. Intro mint/sky dengan badge Tailscale x44 y155
9. Browser loading state → hydrate saat GET response
10. Icon batch 1&2 terbaca pada ukuran target
11. Tidak ada JSON, graph legend, atau tabel code di canvas
12. Motion carries meaning; caption minimal

---

**Next Steps:** 
1. Review Animation.jsx current state
2. Mulai implementasi Revisi-06 timeline & request flow
3. Parallel: prepare icon batch 1&2 spec
4. Test & validate setiap milestone
