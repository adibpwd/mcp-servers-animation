# Revisi 01 — Selaras Standar Act-Scene (1 Act = 1 File) + UPDATE 5/6 IntroHeaderMorphV1

| Item | Nilai |
|---|---|
| Content | 41 — Exit Code |
| Diminta oleh | User |
| Tanggal | 2026-09-23 |
| Status | 📝 PLAN ONLY — siap dieksekusi ke refactor `acts/` |
| Referensi | `docs/standardizations/07-act-scene-pattern.md`, `src/shared/scene-ui/v1/IntroHeaderMorphV1.jsx` UPDATE 5/6 |

## Ringkasan Permintaan

Menyelaraskan content 41 (`41-exit-code`) dengan standar arsitektur baru:
1. **Refactor ke 1 Act = 1 File**: Memecah monolith rendering di `Animation.jsx` ke dalam folder `acts/` (`Act1Signal.jsx`, `Act2Compare.jsx`, `Act3Chain.jsx`, `Act4Cicd.jsx`, `common.jsx`, dan `index.js`).
2. **Intro Background Mode Summary (`bg`/`bgScenes`)**: Menambahkan prop `bg={1}` dan `bgScenes={ACT_SCENES}` ke `IntroHeaderMorphV1` serta melepas wrapping opacity `headerOpacity`.
3. **Pemanfaatan Auto-Wrap & Auto Glow**: Memastikan intro title `EXIT CODE` memanfaatkan glow bawaan & auto-layout `IntroHeaderMorphV1`.

## 1. Audit Status Saat Ini

| Aspek | Fakta saat ini |
|---|---|
| Arsitektur Render | Masih monolith di dalam `Animation.jsx` (411 baris). Belum ada folder `acts/`. |
| Header Gating | Menggunakan wrapper `{headerOpacity > 0 && <g opacity={headerOpacity}>` di sekeliling `<IntroHeaderMorphV1>`. |
| Background Intro | Belum ada `bgScenes` / `bg` pada `IntroHeaderMorphV1`. |
| PHASES | 4 Act (`act1-signal`, `act2-compare`, `act3-chain`, `act4-cicd`). |

## 2. Rencana Perubahan

### 2.1 Buat Folder `acts/` (Pola 07-act-scene-pattern)

Struktur file baru di `src/content/41-exit-code/acts/`:
* `common.jsx` — helper komponen lokal (kartu terminal `$?`, kartu exit code 0 vs non-zero, panel pipeline CI/CD).
* `Act1Signal.jsx` — Visual sinyal rahasia `$?` melempar exit code ke shell register.
* `Act2Compare.jsx` — Visual perbandingan status sukses 0 vs gagal non-zero.
* `Act3Chain.jsx` — Visual rantai logika operator `&&` (lanjut jika sukses) dan `||` (fallback jika gagal).
* `Act4Cicd.jsx` — Visual pembacaan exit code oleh CI/CD pipeline (status build hijau vs merah).
* `index.js` — Mengekspor `export const ACT_SCENES = [Act1Signal, Act2Compare, Act3Chain, Act4Cicd]`.

### 2.2 Refactor `Animation.jsx`

* Import `ACT_SCENES` dari `./acts`.
* Hapus pembungkus `{headerOpacity > 0 && ...}` pada `IntroHeaderMorphV1`.
* Berikan prop `bg={1}` dan `bgScenes={ACT_SCENES}` pada `IntroHeaderMorphV1`.
* Ganti render body monolith dengan penyajian per Act:
  ```jsx
  {contentStarted && (
    <ContentBodyV1 debugName="exit-code-body">
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

- [ ] Buat folder `src/content/41-exit-code/acts/` dan komponen `Act1` s/d `Act4`.
- [ ] Buat `acts/index.js` dengan `ACT_SCENES`.
- [ ] Refactor `Animation.jsx` menggunakan `ACT_SCENES` & `bgScenes`.
- [ ] Verifikasi `esbuild` kompilasi 0 error.
