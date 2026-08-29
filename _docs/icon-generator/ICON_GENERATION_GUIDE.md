# Panduan Standar Icon Generator & Multi-Batch untuk AI Agent & Pengembang

Dokumen ini adalah acuan resmi arsitektur sistem pembuatan aset icon berbasis AI (ChatGPT/DALL-E 3) dan auto-crop backend untuk animasi edukasi di repositori `mcp-servers-animation`.

---

## 📌 1. Prinsip Utama & Batasan Grid

1. **Resolusi DALL-E 3**:
   - ChatGPT menghasilkan gambar dalam resolusi standar ~1024×1024 atau ~1792×1024 piksel.
   - **Maksimal ukuran grid per prompt**: **`4 × 4`** (16 slot).
   - **Rekomendasi terbaik (resolusi tajam ~500px/icon)**: **`2 × 4`** (8 slot) atau **`3 × 3`** (9 slot).
2. **Aturan Slot Kosong (`[EMPTY]`)**:
   - Setiap prompt grid wajib menyisakan 1 slot terakhir (`[EMPTY]`) sebagai separator visual agar AI tidak memadatkan gambar ke sudut.
   - Contoh: Grid `2x4` = 7 icon nyata + 1 slot kosong. Grid `4x4` = 15 icon nyata + 1 slot kosong.
3. **Jangan Gunakan Grid 1-Dimensi (`1x4`, `4x1`, `1x7`)**:
   - AI akan menghasilkan gambar pipih/terdistorsi karena rasio aspek terlalu ekstrem. Gunakan minimal `2x2`, `2x3`, atau `2x4`.

---

## 🗂️ 2. Aturan Multi-Batch (Jika Icon > 7 atau > 15)

Jika suatu topik animasi membutuhkan banyak icon (misalnya 14 icon atau 20 icon), **JANGAN** membuat grid raksasa seperti `5x5` atau `6x6`. Bagi menjadi beberapa **Batch**.

### Contoh Strategi Pembagian Batch:
- **14 Icon**:
  - `Batch 1` (`2x4`): 7 Icon + 1 empty
  - `Batch 2` (`2x4`): 7 Icon + 1 empty
- **20 Icon**:
  - `Batch 1` (`4x4`): 15 Icon + 1 empty
  - `Batch 2` (`2x3` atau `2x4`): 5 Icon + sisa empty

---

## ⚙️ 3. Skema File `icons.json`

Setiap topik animasi menyimpan konfigurasinya di:  
`src/content/<topic-id>/icons/icons.json`

### Format A: Multi-Batch (Direkomendasikan untuk Topik Sedang–Besar)

```json
{
  "name": "topic-id",
  "description": "Deskripsi singkat topik",
  "batches": [
    {
      "batch_id": "batch-1",
      "name": "Core Components (Batch 1/2)",
      "rows": 2,
      "cols": 4,
      "icons": [
        {
          "id": "icon-1",
          "name": "Icon 1",
          "label": "Short Label",
          "description": "Deskripsi visual untuk ChatGPT"
        }
      ],
      "prompt": "Generate a 2x4 grid of 8 minimalist grayscale monochrome icons on transparent background (PNG). Icons are numbered top-left to bottom-right:\n\n1. Deskripsi icon 1\n...\n8. [EMPTY - leave this slot blank/transparent]\n\nStyle requirements:\n- Flat design, minimalist\n- Black/gray colors only (grayscale/monochrome)\n- Each icon same size and clearly distinct\n- High contrast for visibility\n- Transparent background (PNG)\n- Grid layout: 2 rows × 4 columns\n- Each icon should be recognizable and simple"
    },
    {
      "batch_id": "batch-2",
      "name": "Ecosystem & Tools (Batch 2/2)",
      "rows": 2,
      "cols": 4,
      "icons": [
        {
          "id": "icon-8",
          "name": "Icon 8",
          "label": "Short Label",
          "description": "Deskripsi visual untuk ChatGPT"
        }
      ],
      "prompt": "Generate a 2x4 grid of 8 minimalist grayscale monochrome icons... [1 to 7 icons, 8 is EMPTY]..."
    }
  ],
  "generation": {
    "api_endpoint": "http://localhost:3300/api/icons/generate",
    "output_path": "src/content/topic-id/icons"
  }
}
```

### Format B: Single-Batch (Untuk Topik Kecil ≤ 7 icon)

```json
{
  "name": "topic-id",
  "description": "Deskripsi topik",
  "icons": [
    { "id": "icon-1", "name": "Icon 1", "label": "Label 1", "description": "Desc 1" }
  ],
  "generation": {
    "rows": 2,
    "cols": 4,
    "prompt": "Full ChatGPT Prompt...",
    "api_endpoint": "http://localhost:3300/api/icons/generate",
    "output_path": "src/content/topic-id/icons"
  }
}
```

---

## 🔌 4. API Endpoints Backend (Port Standar: 3300)

| Endpoint | Method | Keterangan |
|---|---|---|
| `GET /api/icons/topics` | GET | Auto-scan semua folder `src/content/*/icons/icons.json` dan memberikan rekap info batch & icon. |
| `GET /api/icons/metadata?topicId=X&batchId=Y` | GET | Mengambil detail metadata konfigurasi per topik atau per batch. |
| `POST /api/icons/generate` | POST (multipart/form-data) | Menerima file gambar PNG hasil generate ChatGPT, melakukan cropping tajam via `sharp`, dan menyimpannya sebagai `<icon-id>.png` di folder `output_path`. |

---

## 🚀 5. Cara Menggunakan Chrome Extension

1. Pastikan docker stack berjalan: `docker compose up -d` (Export server aktif di `http://localhost:3300`).
2. Buka `chrome://extensions` di Google Chrome:
   - Aktifkan **Developer mode** (kanan atas).
   - Klik **Load unpacked** dan pilih folder: `src/extensions/vm-icon-generator`.
3. Buka tab **https://chatgpt.com**.
4. Klik icon ekstensi **Content Icon Generator**:
   - Pilih topik di dropdown (misal: `linux-vs-unix`).
   - Jika topik memiliki beberapa batch, pilih `All Batches (Sequential)` atau batch tertentu.
   - Klik **Generate Icons from ChatGPT**.
5. Ekstensi akan otomatis mengetikkan prompt ke ChatGPT, mendownload gambar hasil generate, lalu mengirimkannya ke server local untuk di-crop menjadi PNG individual secara otomatis!
