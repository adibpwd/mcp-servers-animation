# Kandidat Topic Baru — Audience-Friendly (Awam & Anak IT)

> **Status**: Diskusi/brainstorm, BELUM ada keputusan final topic mana
> yang dieksekusi. File ini murni menyimpan hasil sesi 2026-09-06 supaya
> tidak hilang, dan jadi starting point kalau mau lanjut planning detail.

## 1. Latar Belakang

`docs/plan/cpu-animation-roadmap.md` isinya ~35-40 topic CPU internals
(pipelining, cache coherence, Spectre/Meltdown, dst). Setelah direview,
bahasanya dinilai **terlalu dalam untuk audiens umum** — bahkan Tier 1
roadmap itu sendiri ("What is a CPU") masih cepat masuk ke konsep abstrak
(clock cycle, FDE, registers) yang buat orang awam tetap terasa berat.

Tujuan file ini: kumpulkan topic alternatif yang levelnya lebih pas,
dipisah 2 kelompok audiens berbeda.

## 2. Kelompok A — Orang Awam Umum (Non-IT)

Pola yang sudah terbukti jalan di `registry.js` kategori
"Tier 1 — Orang Awam Friendly" (`desktop-environment`, `linux-vs-windows`,
`file-permission`): **hal yang dipakai tiap hari tapi tidak pernah tahu
cara kerjanya**, analogi kuat, zero prerequisite.

### A.1 — Cara Kerja WiFi & Kenapa Sinyal Lemot
- Analogi: WiFi = teriakan di ruangan ramai, makin banyak yang teriak makin susah didengar
- Hook: "kenapa WiFi kamar lo lemot tapi di ruang tamu kenceng?"
- Zero prerequisite, durasi 30-40s

### A.2 — Kemana Perginya Foto/Chat yang Dihapus?
- Analogi: hapus buku dari daftar isi ≠ buku fisiknya hilang dari rak
- Bikin paham kenapa recovery tool kadang bisa balikin file terhapus
- Sedikit menyentuh konsep storage tapi 100% bahasa awam

### A.3 — Cara Kerja Password & Kenapa "password123" Bahaya
- Analogi: hash = blender buah — gampang bikin jus, mustahil balikin jadi buah utuh
- Actionable takeaway: kenapa harus pakai password manager / 2FA
- Bisa nyambung ke topic `file-permission` yang sudah ada

### A.4 — QR Code — Kotak Hitam-Putih Itu Nyimpen Apa?
- Visual sangat kuat & "satisfying" — cocok short-form/reels
- Analogi: QR = braille untuk kamera HP
- Durasi pendek, produksi murah (pola grid statis + reveal animasi)

### A.5 — Kenapa HP Panas Saat Main Game / Ngecas?
- Terhubung tipis ke CPU (bisa jadi "gerbang" sebelum topic CPU yang lebih dalam nanti)
- Analogi: HP = orang lari sprint, ngos-ngosan (throttle) biar gak kolaps
- Actionable: kenapa performa game turun pas lama main

### A.6 — Cara Kerja GPS — HP Tahu Lokasi Lo Darimana?
- Meluruskan miskonsepsi umum (GPS tidak butuh internet buat dapet posisi)
- Analogi: tebak posisi dari jarak ke 3-4 menara yang lokasinya diketahui
- Visual satelit + garis triangulasi sangat sinematik

## 3. Kelompok B — Anak IT / Junior Dev

Audiens mahasiswa/junior dev yang sudah paham dasar, tapi mental model-nya
sering cuma hafalan command tanpa ngerti apa yang terjadi di baliknya.
Boleh sedikit lebih teknis dari Kelompok A, tapi tetap dari sudut pandang
keseharian ngoding/deploy, bukan langsung ke internal hardware.

### B.1 — HTTP Request-Response Flow (Client-Server)
- Analogi: request/response = kirim surat + amplop balesan
- Visual browser → server → database yang familiar
- Fondasi buat topic lanjutan: REST API, WebSocket, dst

### B.2 — Cara Kerja DNS — Domain Jadi IP Address
- Analogi: DNS = buku telepon internet
- Hook: "kenapa ganti DNS bisa benerin internet lemot?"
- Nyambung natural ke arah networking yang sudah ada (`tailscale`)

### B.3 — Git Branching & Merging (Visual Timeline) ⭐
- Analogi: commit = save point game, branch = timeline paralel
- Actionable: kenapa "merge conflict" terjadi & cara mikirinnya
- **Sudah ada placeholder** `git-version-control` di `registry.js`
  (commented out, arah ke `./git/Animation` yang belum dibuat)

### B.4 — Docker Container vs Virtual Machine ⭐
- Analogi: image = resep masakan, container = masakan jadi yang portable
- Meluruskan miskonsepsi umum "container = VM versi ringan" (beda konsep)
- **Sudah ada placeholder** `container-docker` di `registry.js`
  (commented out di Tier 4)

### B.5 — Environment Variables & Kenapa .env Penting
- Analogi: env var = sticky note config yang beda-beda per lokasi (laptop vs server)
- Actionable: kenapa `.env` jangan di-commit ke git
- Topic pendek & gampang, cocok jadi quick-win produksi

### B.6 — Async/Await & Event Loop (Kenapa Kode "Loncat")
- Analogi: async = pesen makanan online, gak nunggu di depan kasir sampai matang
- Common bug: kenapa data `undefined` padahal udah di-fetch
- Cocok audiens JS/web dev spesifik, engagement tinggi

## 4. Cross-Reference ke `registry.js`

Dua kandidat di Kelompok B (**B.3 Git**, **B.4 Docker vs VM**) sudah punya
jejak di `src/content/registry.js` sebagai entry yang di-comment out —
paling murah untuk dieksekusi duluan karena metadata (title, subtitle,
tags, color) sudah ada tinggal diverifikasi ulang & folder-nya dibuat.

```js
// git-version-control → arah ke ./git/Animation (folder belum ada)
// container-docker     → arah ke ./container-docker/Animation (folder belum ada)
```

## 5. Next Step (Belum Dikerjakan)

- [ ] User pilih 1-2 topic prioritas dari Kelompok A dan/atau B
- [ ] Buat roadmap plan detail (format mirip `cpu-animation-roadmap.md`,
      tapi versi ringkas — tidak perlu 35+ sub-topic, cukup 1 topic utuh
      dipecah per Act/scene) untuk topic yang dipilih
- [ ] Assign ke Tier yang sesuai di `registry.js` (uncomment jika sudah
      ada placeholder, atau tambah entry baru)
- [ ] Ikuti standar pembuatan topic di `docs/03-tutorial-buat-topic-baru.md`
