# 06 — Icon Generation Guide

> Alur baca lengkap: `01-architecture` → `02-standar-konten` → `03-tutorial-buat-topic-baru` → `04-referensi-gsap` → `05-svg-text-guide` → **`06-icon-generation`**

Acuan arsitektur sistem pembuatan aset icon berbasis AI (ChatGPT/DALL-E 3)
dan auto-crop backend untuk topic baru.

## 1. Prinsip Utama & Batasan Grid

1. **Resolusi DALL-E 3** ~1024×1024 atau ~1792×1024px. Maksimal grid per
   prompt: **4×4** (16 slot). Rekomendasi terbaik (tajam ~500px/icon):
   **2×4** (8 slot) atau **3×3** (9 slot).
2. **Aturan slot kosong `[EMPTY]`:** tiap prompt grid wajib sisakan 1 slot
   terakhir sebagai separator visual, supaya AI tidak memadatkan gambar ke
   sudut. Grid 2×4 = 7 icon nyata + 1 slot kosong. Grid 4×4 = 15 icon + 1 kosong.
3. **Jangan pakai grid 1-dimensi** (`1x4`, `4x1`, `1x7`) — AI hasilkan
   gambar pipih/terdistorsi karena rasio aspek terlalu ekstrem. Minimal `2x2`, `2x3`, `2x4`.

## 2. Aturan Multi-Batch (Icon > 7 atau > 15)

Jangan bikin grid raksasa (`5x5`, `6x6`) — bagi jadi beberapa Batch.

```
14 Icon → Batch 1 (2x4): 7 icon + 1 empty   |  Batch 2 (2x4): 7 icon + 1 empty
20 Icon → Batch 1 (4x4): 15 icon + 1 empty  |  Batch 2 (2x3/2x4): 5 icon + sisa empty
```

## 3. Skema File `icons.json`

Tiap topic simpan konfigurasi di `src/content/<topic-id>/icons/icons.json`.

### Format A — Multi-Batch (topik sedang-besar)

```json
{
  "name": "topic-id",
  "description": "Deskripsi singkat topik",
  "batches": [
    {
      "batch_id": "batch-1",
      "name": "Core Components (Batch 1/2)",
      "rows": 2, "cols": 4,
      "icons": [
        { "id": "icon-1", "name": "Icon 1", "label": "Short Label", "description": "Deskripsi visual untuk ChatGPT" }
      ],
      "prompt": "Generate a 2x4 grid of 8 minimalist grayscale monochrome icons on transparent background (PNG)...\n8. [EMPTY - leave this slot blank/transparent]\n\nStyle: flat design, black/gray colors only, transparent background, grid 2 rows x 4 columns."
    }
  ],
  "generation": {
    "api_endpoint": "http://localhost:3373/api/icons/generate",
    "output_path": "src/content/topic-id/icons"
  }
}
```

### Format B — Single-Batch (topik kecil ≤ 7 icon)

```json
{
  "name": "topic-id",
  "description": "Deskripsi topik",
  "icons": [{ "id": "icon-1", "name": "Icon 1", "label": "Label 1", "description": "Desc 1" }],
  "generation": {
    "rows": 2, "cols": 4,
    "prompt": "Full ChatGPT Prompt...",
    "api_endpoint": "http://localhost:3373/api/icons/generate",
    "output_path": "src/content/topic-id/icons"
  }
}
```

## 4. API Endpoints Backend (Port Standar: 3373)

| Endpoint | Method | Keterangan |
|---|---|---|
| `GET /api/icons/topics` | GET | Auto-scan semua folder `src/content/*/icons/icons.json`, rekap info batch & icon |
| `GET /api/icons/metadata?topicId=X&batchId=Y` | GET | Ambil detail metadata konfigurasi per topik/batch |
| `POST /api/icons/generate` | POST (multipart/form-data) | Terima PNG hasil generate ChatGPT, crop tajam via `sharp`, simpan sebagai `<icon-id>.png` di `output_path` |

## 5. Cara Menggunakan Chrome Extension

1. Pastikan docker stack jalan: `docker compose up -d` (Unified server aktif di `http://localhost:3373`).
2. Buka `chrome://extensions`, aktifkan **Developer mode**, klik **Load
   unpacked**, pilih folder `src/extensions/vm-icon-generator`.
3. Buka tab **https://chatgpt.com**.
4. Klik icon ekstensi **Content Icon Generator**:
   - Pilih topik di dropdown (misal: `linux-vs-unix`)
   - Kalau ada beberapa batch, pilih `All Batches (Sequential)` atau batch tertentu
   - Klik **Generate Icons from ChatGPT**
5. Ekstensi otomatis ketik prompt ke ChatGPT, download gambar hasil
   generate, kirim ke server local untuk di-crop jadi PNG individual
   secara otomatis.

## 6. Integrasi Icon ke `Animation.jsx` (Setelah PNG Ter-generate)

Bagian di atas berhenti begitu file PNG sudah ada di folder `icons/`.
Langkah SESUDAHNYA — pasang PNG itu ke JSX — punya beberapa formula yang
tidak intuitif kalau cuma tebak-tebakan, jadi diikuti persis pola di
bawah.

### 6.1 `icons/loader.js`

```js
// src/content/<topic-id>/icons/loader.js
import wireguardKeyIcon from './wireguard-key.png'
import coordinationServerIcon from './coordination-server.png'
// ...import tiap PNG sesuai icons.json

export const ICONS = {
  'wireguard-key': wireguardKeyIcon,
  'coordination-server': coordinationServerIcon,
  // ...
}

export function getIcon(id) {
  return ICONS[id] || null
}
```

Import di `Animation.jsx`: `import { getIcon } from './icons/loader'`.

### 6.2 Formula Centering — Icon Standalone

`<image>` di SVG di-posisikan dari **pojok kiri-atas**, beda dengan
`<circle r=...>` yang dari titik tengah. Kalau icon menggantikan shape
yang posisinya sudah center di suatu titik, wajib offset supaya tetap
center di titik yang sama:

```jsx
// width=32, height=32 → offset x=-16, y=-16 (= -width/2, -height/2)
<image href={getIcon('wireguard-key')} x={-16} y={-16} width={32} height={32} />

// Aspect ratio non-persegi (misal HP portrait 32×56) — formula sama,
// cuma offset y disesuaikan supaya device + label tetap balanced:
<image href={getIcon('mobile-phone')} x={-16} y={-28} width={32} height={56} />
```

**Formula umum:** `x = -width/2`, `y = -height/2` (sesuaikan `y` kalau
ada label teks di bawah icon yang perlu tetap balanced secara visual).

### 6.3 Formula Offset — Icon sebagai Aksen di Dalam Box

Kalau icon ditempel sebagai aksen kecil di pojok komponen box (pola
`ServerBox`), box-nya TETAP jadi frame/label, icon nempel di layer atas:

```jsx
<ServerBox x={0} y={0} label="COORDINATION SERVER" color={COLORS.SERVER} w={260} />
<image href={getIcon('coordination-server')} x={-105} y={4} width={28} height={28} />
```

**Formula:** `x = -(boxWidth / 2) + paddingKiri`. Contoh nyata: `w=260` →
`x = -130 + 25 = -105`; `w=240` (box lebih sempit) → `x = -120 + 25 = -95`.
Sesuaikan `paddingKiri` (di atas: `25`) sesuai selera visual box masing-
masing topic, tapi formula dasarnya sama.

### 6.4 Icon Pengganti vs Icon Baru

- **Icon pengganti** (swap isi child dari shape manual existing ke
  `<image>`) — timeline GSAP (`popIn`, sfx, timing) **tidak perlu
  diubah**, cukup ganti isi child SVG-nya saja.
- **Icon BARU** (belum ada elemen existing yang cocok diganti) — ini
  butuh entry timeline GSAP baru (`popIn()` baru), effort & risknya lebih
  besar (perlu cari titik waktu kosong, cek tidak bikin Act kepenuhan/
  clutter). Sebut ini eksplisit di planning sebelum eksekusi, jangan
  disamakan dengan icon pengganti yang jauh lebih murah.

## 7. Verifikasi Kode Aktual Sebelum Planning Varian Icon

Sebelum menetapkan daftar varian icon (warna/bentuk) yang dibutuhkan dari
komponen SVG existing, **grep dulu tiap komponen** (`grep -n "COLORS\."`
atau baca langsung tiap call-site di `Animation.jsx`) — jangan asumsikan
polanya sama dengan topic lain. Kasus nyata yang pernah terjadi: sebuah
plan varian warna icon mengasumsikan komponen `HouseFrame`/`BuildingFrame`
punya banyak varian warna per-Act, ternyata di kode aktual kedua komponen
itu HARDCODE 1 warna saja (tidak ada prop warna sama sekali) — sebaliknya
komponen `Laptop` justru punya 1 varian warna tambahan yang kelewat di
plan awal (dipakai di 1 Act yang tidak disebut di draft pertama). Salah
asumsi begini bikin rencana generate icon salah hitung — boros generate
varian yang tidak perlu ada, sekaligus kelewat varian yang justru
dibutuhkan.
