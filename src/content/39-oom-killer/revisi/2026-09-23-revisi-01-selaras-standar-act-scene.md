# Revisi 01 — Selaras Standar Act-Scene (1 Act = 1 File) + UPDATE 5/6 IntroHeaderMorphV1

| Item | Nilai |
|---|---|
| Content | 39 — OOM Killer |
| Diminta oleh | User |
| Tanggal | 2026-09-23 |
| Status | 📝 PLAN ONLY — siap dieksekusi ke refactor `acts/` |
| Referensi | `docs/standardizations/07-act-scene-pattern.md`, `src/shared/scene-ui/v1/IntroHeaderMorphV1.jsx` UPDATE 5/6 |

## Ringkasan Permintaan

Menyelaraskan content 39 (`39-oom-killer`) dengan standar arsitektur baru:
1. **Refactor ke 1 Act = 1 File**: Memecah monolith rendering di `Animation.jsx` ke dalam folder `acts/` (`Act1Pressure.jsx`, `Act2Alarm.jsx`, `Act3Score.jsx`, `Act4Kill.jsx`, `common.jsx`, dan `index.js`).
2. **Intro Background Mode Summary (`bg`/`bgScenes`)**: Menambahkan prop `bg={1}` dan `bgScenes={ACT_SCENES}` ke `IntroHeaderMorphV1` serta melepas wrapping opacity `headerOpacity`.
3. **Pemanfaatan Auto-Wrap & Auto Glow**: Memastikan intro title `OOM KILLER` memanfaatkan glow bawaan & auto-layout `IntroHeaderMorphV1`.

## 1. Audit Status Saat Ini

| Aspek | Fakta saat ini |
|---|---|
| Arsitektur Render | Masih monolith di dalam `Animation.jsx` (411 baris). Belum ada folder `acts/`. |
| Header Gating | Menggunakan wrapper `{headerOpacity > 0 && <g opacity={headerOpacity}>` di sekeliling `<IntroHeaderMorphV1>`. |
| Background Intro | Belum ada `bgScenes` / `bg` pada `IntroHeaderMorphV1`. |
| PHASES | 4 Act (`act1-pressure`, `act2-alarm`, `act3-score`, `act4-kill`). |

## 2. Rencana Perubahan

### 2.1 Buat Folder `acts/` (Pola 07-act-scene-pattern)

Struktur file baru di `src/content/39-oom-killer/acts/`:
* `common.jsx` — helper komponen lokal (misal `Meter`, `AppCard`, `AlarmCard`, `ProcessCard`, `LogCard`).
* `Act1Pressure.jsx` — Visual RAM + Swap meter 99.9% & AppCard rakus memori.
* `Act2Alarm.jsx` — Visual Alarm Kernel darurat out of memory.
* `Act3Score.jsx` — Visual kalkulasi `oom_score` (Process DB, Daemon, dan Worker leak).
* `Act4Kill.jsx` — Visual eksekusi SIGKILL (9) dan logging `dmesg`.
* `index.js` — Mengekspor `export const ACT_SCENES = [Act1Pressure, Act2Alarm, Act3Score, Act4Kill]`.

### 2.2 Refactor `Animation.jsx`

* Import `ACT_SCENES` dari `./acts`.
* Hapus pembungkus `{headerOpacity > 0 && ...}` pada `IntroHeaderMorphV1`.
* Berikan prop `bg={1}` dan `bgScenes={ACT_SCENES}` pada `IntroHeaderMorphV1`.
* Ganti render body monolith dengan:
  ```jsx
  {contentStarted && (
    <ContentBodyV1 debugName="oom-killer-body">
      <g opacity={bodyOpacity}>
        {(() => {
          const Act = ACT_SCENES[phaseIdx]
          return <Act state={{ ... }} />
        })()}
      </g>
    </ContentBodyV1>
  )}
  ```

## 3. Checklist Implementasi

- [ ] Buat folder `src/content/39-oom-killer/acts/` dan komponen `Act1` s/d `Act4`.
- [ ] Buat `acts/index.js` dengan `ACT_SCENES`.
- [ ] Refactor `Animation.jsx` menggunakan `ACT_SCENES` & `bgScenes`.
- [ ] Verifikasi `esbuild` kompilasi 0 error.
