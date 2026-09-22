# 🚀 Plan: Multiprocess Export

## Arsitektur

```
User klik Export
      ↓
export-server.mjs (coordinator)
      ↓
┌─────────────────────────────────┐
│  Step 1: Detect Duration        │
│  (1 Chrome, baca timeline.dur)  │
└─────────────┬───────────────────┘
              ↓
┌─────────────────────────────────┐
│  Step 2: PASS 1 — Audio Capture │
│  (1 Chrome, real-time playback) │
│  → topicId-audio.webm           │
└─────────────┬───────────────────┘
              ↓
┌─────────────────────────────────────────────────────┐
│  Step 3: PASS 2 — Frame Capture (PARALLEL)          │
│                                                     │
│  Worker 0 │ Worker 1 │ Worker 2 │ Worker 3          │
│  frame    │ frame    │ frame    │ frame              │
│  0–427    │ 428–855  │ 856–1283 │ 1284–1710          │
│  Chrome 1 │ Chrome 2 │ Chrome 3 │ Chrome 4           │
│                                                     │
│  Tiap worker: seek per frame → screenshot → png     │
└─────────────┬───────────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│  Step 4: Merge Frames           │
│  seg0/ + seg1/ + seg2/ + seg3/  │
│  → tmp-frames/topicId/          │
└─────────────┬───────────────────┘
              ↓
┌─────────────────────────────────┐
│  Step 5: ffmpeg Encode          │
│  frames + audio.webm → .mp4     │
└─────────────┬───────────────────┘
              ↓
         dist/videos/topicId.mp4
```

---

## File yang Perlu Dibuat/Diubah

| File | Action | Detail |
|------|--------|--------|
| `scripts/export-parallel.mjs` | **CREATE** | Core logic multiprocess |
| `scripts/export-server.mjs` | **MODIFY** | Tambah endpoint `/api/export-parallel/:topicId` + progress tracking per worker |
| `src/components/PlayerShell.jsx` | **MODIFY** | UI pilihan mode export (single vs parallel) + jumlah workers |

---

## Detail Script `export-parallel.mjs`

```
Functions:

1. detectDuration(topicId, baseUrl)
   → Launch 1 Chrome, baca window.__animationTimeline.duration()
   → Return: animDuration (detik)

2. captureAudio(topicId, baseUrl, outDir)
   → PASS 1 existing: real-time playback, rekam audio
   → Return: audioPath

3. captureSegment({ workerId, startFrame, endFrame, totalFrames, animDuration, segDir, baseUrl })
   → Launch 1 Chrome
   → Navigate ke /preview/topicId
   → Wait for timeline
   → Seek setiap frame: tl.seek(t) → screenshot → save frame_NNNNN.png
   → Return: void (files saved ke segDir)

4. mergeSegments(workerDirs, framesDir)
   → fs.renameSync semua file dari seg0/, seg1/, ... ke framesDir/
   → Verify frame count = totalFrames

5. encodeVideo({ framesDir, audioPath, outputPath, fps, duration })
   → ffmpeg: frames + audio → .mp4

6. exportParallel(topicId, { workers=4, baseUrl, outDir, onProgress, onLog })
   → Orchestrate semua step di atas
   → Report progress per step
```

---

## Progress Tracking (per worker)

```json
{
  "status": "running",
  "progress": 45,
  "phase": "Capturing frames (parallel)",
  "workers": [
    { "id": 0, "frames": 427, "done": 427, "status": "done" },
    { "id": 1, "frames": 427, "done": 312, "status": "running" },
    { "id": 2, "frames": 427, "done": 298, "status": "running" },
    { "id": 3, "frames": 429, "done": 0,   "status": "running" }
  ]
}
```

---

## Estimasi Waktu

| Animasi | Single Process | 2 Workers | 4 Workers | 8 Workers |
|---------|---------------|-----------|-----------|-----------|
| 57s @ 30fps = 1710 frames | ~25 menit | ~13 menit | ~7 menit | ~4 menit |
| Overhead (audio + ffmpeg) | ~2 menit | ~2 menit | ~2 menit | ~2 menit |
| **TOTAL** | **~27 menit** | **~15 menit** | **~9 menit** | **~6 menit** |

> Catatan: 8 workers hanya worth kalau CPU cores ≥ 8. Lebih dari CPU cores = diminishing returns karena context switching.

---

## Constraint & Risk

| Issue | Mitigation |
|-------|------------|
| Chrome memory (tiap instance ~300MB) | Default 4 workers → ~1.2GB RAM. Bisa dikurangi via `--workers 2` |
| Frame ordering salah setelah merge | Nama file `frame_NNNNN.png` pakai global index (bukan per-segment), jadi merge tinggal sort by filename |
| React state tidak sync saat seek | Pakai `flushSync` yang sudah ada di PASS 2 existing — sama persis tinggal di-apply ke tiap worker |
| Worker crash → video corrupt | Tiap worker wrap di try/catch, kalau ada yang fail → abort semua, cleanup tmp |
| PASS 1 audio masih single process | Audio capture memang harus real-time (tidak bisa di-parallelize), tapi ini cuma ~1x durasi animasi = 57 detik fixed |

---

## Urutan Implementasi

1. **`export-parallel.mjs`** — core logic (1-2 jam)
2. **Endpoint baru di `export-server.mjs`** — `/api/export-parallel/:topicId` (30 menit)
3. **UI di `PlayerShell.jsx`** — toggle single/parallel + worker count slider (30 menit)
4. **Test** dengan `linux-vs-unix` (30 menit)

**Total estimasi implementasi**: ~3 jam

---

## Status Export Bug Fix (sudah done)

- ✅ `export-server.mjs` line 246: URL difix dari `http://100.78.186.122:5173` → `http://localhost:8081`
- ✅ `export-lib.js` default baseUrl: difix ke `http://localhost:8081`
- ✅ Vite preview running di port 8081
- ✅ Export server lama (PID 579381/579439) di-kill, server baru jalan
- ⚠️ Perlu test ulang export dari UI setelah job lama timeout (~60 detik)
