# PLAN-18 — Konsolidasi Reusable Scene Components ke V1

Tanggal: 2026-09-14

Status: SELESAI DIEKSEKUSI (2026-09-14) — file legacy sudah dipindah ke backup, dan audit consumer `src/content` sudah dituntaskan (hasil: bersih, tidak ada import yang perlu diganti).

## Tujuan

Menetapkan `src/shared/scene-ui/v1/` sebagai satu-satunya rumah komponen reusable untuk chrome dan layout scene animasi baru. Component scene lama di `src/components/` tidak lagi menjadi pilihan untuk content baru; file-nya akan diarsipkan ke folder backup agar sejarah implementasi tetap tersedia.

Plan ini sengaja tidak mencari siapa yang masih mengimpor file lama di `src/content`. Audit pemakaian serta penggantian path pada tiap content adalah tugas migrasi terpisah untuk agent lain. Fokus dokumen ini hanya inventaris canonical: apa yang tetap aktif, apa yang masuk backup, dan batas scope-nya.

## Keputusan struktur akhir

```text
src/shared/scene-ui/
├── README.md
└── v1/                         ← canonical reusable scene API
    ├── PortraitSceneLayoutV1.js
    ├── IntroHeaderMorphV1.jsx
    ├── ActBadgeNavigatorV1.jsx
    ├── ContentBodyV1.jsx
    ├── SceneChromeV1.jsx
    ├── SceneSafeAreaDebugV1.jsx
    └── index.js

backup/scene-components-legacy/  ← arsip, bukan source aktif
└── ...component scene lama...
```

Aturan untuk content baru: import hanya dari `src/shared/scene-ui/v1` (lebih baik lewat `index.js`). Jangan membuat component generic scene baru di `src/components/`.

## Component yang dipertahankan aktif

| File | Status | Tanggung jawab canonical |
|---|---|---|
| `src/shared/scene-ui/v1/PortraitSceneLayoutV1.js` | Tetap aktif | Token canvas portrait, safe zone, dan helper layout murni. |
| `src/shared/scene-ui/v1/IntroHeaderMorphV1.jsx` | Tetap aktif | Intro hero menjadi compact header melalui `progress` dari topic. |
| `src/shared/scene-ui/v1/ActBadgeNavigatorV1.jsx` | Tetap aktif | Badge Act dan dot navigator. |
| `src/shared/scene-ui/v1/ContentBodyV1.jsx` | Tetap aktif | Boundary/body origin lokal di bawah header/navigator. |
| `src/shared/scene-ui/v1/SceneChromeV1.jsx` | Tetap aktif | Composer ringan untuk intro, navigator, dan content slot. |
| `src/shared/scene-ui/v1/SceneSafeAreaDebugV1.jsx` | Tetap aktif, dev-only | Overlay pengecekan safe area; tidak aktif saat export. |
| `src/shared/scene-ui/v1/index.js` | Tetap aktif | Satu public import surface V1. |
| `src/shared/scene-ui/v1/__fixtures__/SceneUiFixtureV1.jsx` | Tetap aktif, fixture | Contoh/regression fixture V1; bukan dependency content. |
| `src/shared/scene-ui/README.md` | Tetap aktif | Contract, quick start, batas V1, dan kebijakan versioning. |

V1 tetap pure presentation. Ia menerima progress/state dari topic, tetapi tidak memiliki GSAP timeline, SFX, atau cerita sendiri. Perubahan breaking tidak masuk V1; buat folder `v2/` bila nanti diperlukan.

## Component scene lama yang direncanakan masuk backup

Target di bawah adalah component visual/animasi generasi lama di `src/components/` yang bukan API V1 dan tidak boleh dipilih untuk content baru. Saat eksekusi, pindahkan file dengan riwayat yang jelas, misalnya: `backup/scene-components-legacy/2026-09-14/`.

| File saat ini | Keputusan | Alasan |
|---|---|---|
| `src/components/AnimatedCounter.jsx` | Pindah ke backup | Component animasi DOM dengan GSAP internal; bukan primitive portrait/pure-presentation V1. |
| `src/components/LineTracer.jsx` | Pindah ke backup | Memiliki lifecycle GSAP internal dan contract link khusus; bukan chrome/layout scene. |
| `src/components/MCPAnimation.jsx` | Pindah ke backup | Scene MCP penuh dan domain-specific, bukan reusable foundation lintas topic. |
| `src/components/NetworkDiagram.jsx` | Pindah ke backup | Diagram D3 domain-specific dengan dependency/config sendiri; bukan primitive V1. |
| `src/components/NodeGlow.jsx` | Pindah ke backup | Efek GSAP internal legacy; tidak sesuai kontrak V1 yang dikendalikan topic. |

`backup/` adalah arsip sumber, bukan alias import baru. Content lama yang masih bergantung pada file tersebut nantinya harus diarahkan ulang oleh plan migrasi khusus—bukan dibiarkan mengimpor dari backup secara permanen.

## File yang bukan kandidat konsolidasi scene

File berikut tidak dipindahkan melalui plan ini, karena merupakan UI aplikasi, utility, audio support, atau concern terpisah—bukan reusable scene chrome yang digantikan V1.

| Kelompok | File/area | Keputusan |
|---|---|---|
| UI aplikasi | `src/components/ContentManagement/**`, `PlayerPage*`, `PlayerShell*`, `ExportHistory*`, `SettingsModal*`, `ProgressIndicator*`, `TimelineProgressBar*` | Tetap di `src/components/`; bukan component scene content. |
| Shared support | `src/shared/audio/sfxLoader.js`, `src/shared/GlowDot.js` | Tetap di `src/shared/`; evaluasi terpisah bila kelak perlu standardisasi effect. |
| Styling | CSS/module CSS yang menjadi pasangan UI aplikasi | Tidak dipindahkan dalam konsolidasi scene ini. |

Tidak ada kesimpulan bahwa file-file tersebut pasti aktif atau tidak aktif di content; plan ini hanya mengklasifikasikan scope arsitekturnya.

## Urutan eksekusi nantinya

1. Buat folder arsip bertanggal di `backup/scene-components-legacy/` dan tambahkan README singkat yang menyatakan status legacy serta asal path.
2. Pindahkan lima component scene lama pada tabel sebelumnya beserta file pendukung yang memang eksklusif milik masing-masing component, bila ada.
3. Jangan mengubah atau membuat import path ke backup sebagai solusi akhir.
4. Agent migrasi terpisah mencari seluruh import lama di `src/content`, lalu memutuskan per content: ganti dengan V1, pindahkan implementasi menjadi topic-local, atau hapus jika tidak lagi relevan.
5. Setelah setiap consumer lama dimigrasi dan preview, hapus alias/compatibility shim bila sempat dibuat. Backup tetap dipertahankan sesuai kebijakan repo.

## Guardrail

- Jangan memindahkan component UI aplikasi hanya karena berada di `src/components/`.
- Jangan memaksa `MCPAnimation`, NetworkDiagram, atau storytelling domain lain menjadi API V1; content-specific visual tetap milik folder topic.
- Jangan memasukkan GSAP, timer, audio, atau global window state ke V1 hanya untuk meniru component lama.
- Jangan menjalankan pencarian import di `src/content` sebagai bagian plan ini.
- Jangan menghapus source legacy sebelum agent migrasi menyelesaikan setiap consumer dan preview yang relevan.

## Kriteria selesai untuk eksekusi

- [x] Public reusable scene API baru hanya berada di `src/shared/scene-ui/v1/`.
- [x] Lima component legacy sudah berada di backup bertanggal dan tercatat asal path-nya.
- [x] Component UI aplikasi dan shared audio/util tidak ikut berpindah.
- [x] Tidak ada content baru yang mengambil component scene generic dari `src/components/`.
- [x] Daftar consumer lama serta perubahan import ditangani oleh plan/agent migrasi terpisah, lengkap dengan preview per content.

## Catatan eksekusi (2026-09-14)

**Tahap 1 — konsolidasi & pemindahan ke backup:**

- Path project dikonfirmasi ulang: `/home/adb/Projects/Personal/mcp-servers-animation` (tanpa duplikasi folder).
- `src/shared/scene-ui/v1/` sudah lengkap sesuai spec plan (7 file + fixture + README) — tidak disentuh, sudah canonical.
- Dibuat `backup/scene-components-legacy/2026-09-14/` + README yang mencatat asal path & alasan pindah untuk tiap file, mengikuti pola arsip di `backup/standardizations/`.
- Lima component legacy dipindahkan dari `src/components/`: `AnimatedCounter.jsx`, `LineTracer.jsx`, `MCPAnimation.jsx`, `NetworkDiagram.jsx`, `NodeGlow.jsx`. Tidak ada file pendukung eksklusif (CSS dll) untuk kelimanya.
- `ContentManagement/`, `PlayerPage*`, `PlayerShell*`, `ExportHistory*`, `SettingsModal*`, `ProgressIndicator*`, `TimelineProgressBar*` tidak disentuh — sesuai tabel "bukan kandidat konsolidasi".

**Tahap 2 — audit consumer lama di `src/content` (semula scope terpisah, sudah dituntaskan menyusul):**

- Tidak ada satupun file di `src/content` yang meng-`import` dari kelima component legacy di atas.
- Satu-satunya kemunculan nama "NodeGlow" ada di `14-http-request-response/Animation.jsx` (baris ~1349–1897), tapi itu component/variable lokal buatan sendiri di file itu (`const NodeGlow = ...`, `nodeGlow` sebagai variabel state) — bukan import dari `src/components/NodeGlow.jsx`. Kebetulan nama sama saja, tidak ada dependency.
- Tidak ada match untuk pola `from '...components/<nama>'` maupun `import ... <nama>` di seluruh `src/content`.
- Kesimpulan: tidak ada import yang perlu diganti. Tidak ada perubahan kode di `src/content` yang dilakukan.

PLAN-18 selesai penuh, termasuk audit migrasi yang semula dicadangkan untuk agent terpisah.
