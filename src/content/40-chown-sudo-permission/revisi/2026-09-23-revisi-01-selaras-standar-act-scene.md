# Revisi 01 — Selaras Standar Act-Scene (1 Act = 1 File) + UPDATE 5/6 IntroHeaderMorphV1

| Item | Nilai |
|---|---|
| Content | 40 — Chown, Sudo & Permission |
| Diminta oleh | User |
| Tanggal | 2026-09-23 |
| Status | 📝 PLAN ONLY — siap dieksekusi ke refactor `acts/` |
| Referensi | `docs/standardizations/07-act-scene-pattern.md`, `src/shared/scene-ui/v1/IntroHeaderMorphV1.jsx` UPDATE 5/6 |

## Ringkasan Permintaan

Menyelaraskan content 40 (`40-chown-sudo-permission`) dengan standar arsitektur baru:
1. **Refactor ke 1 Act = 1 File**: Memecah monolith rendering di `Animation.jsx` ke dalam folder `acts/` (`Act1PermissionDenied.jsx`, `Act2Chown.jsx`, `Act3SuVsSudo.jsx`, `Act4SudoersAudit.jsx`, `common.jsx`, dan `index.js`).
2. **Intro Background Mode Summary (`bg`/`bgScenes`)**: Menambahkan prop `bg={1}` dan `bgScenes={ACT_SCENES}` ke `IntroHeaderMorphV1`.
3. **Integrasi Standard UI Components**: Menggunakan `IntroHeaderMorphV1`, `ActBadgeNavigatorV1`, dan `ContentBodyV1` secara penuh tanpa gating terpisah.

## 1. Audit Status Saat Ini

| Aspek | Fakta saat ini |
|---|---|
| Arsitektur Render | Masih monolith di dalam `Animation.jsx` (688 baris). Belum ada folder `acts/`. |
| Gating Component | Gating `contentStarted` masih membungkus `ActBadgeNavigatorV1` & `ContentBodyV1`. |
| Background Intro | Belum ada `bgScenes` / `bg` pada `IntroHeaderMorphV1`. |
| PHASES | 4 Act (`denied`, `chown`, `su_sudo`, `sudoers`). |

## 2. Rencana Perubahan

### 2.1 Buat Folder `acts/` (Pola 07-act-scene-pattern)

Struktur file baru di `src/content/40-chown-sudo-permission/acts/`:
* `common.jsx` — helper komponen bersama (kartu file, server Nginx, badge status).
* `Act1PermissionDenied.jsx` — Visual jebakan permission denied dan jebakan chmod 777.
* `Act2Chown.jsx` — Visual penggunaan `chown` untuk mengubah user & group owner.
* `Act3SuVsSudo.jsx` — Visual perbedaan eksekusi `su` vs `sudo`.
* `Act4SudoersAudit.jsx` — Visual kebijakan `/etc/sudoers` dan audit trail logging di `/var/log/auth.log`.
* `index.js` — Mengekspor `export const ACT_SCENES = [Act1PermissionDenied, Act2Chown, Act3SuVsSudo, Act4SudoersAudit]`.

### 2.2 Refactor `Animation.jsx`

* Import `ACT_SCENES` dari `./acts`.
* Berikan prop `bg={1}` dan `bgScenes={ACT_SCENES}` pada `IntroHeaderMorphV1`.
* Ganti render body monolith dengan penyajian per Act:
  ```jsx
  {contentStarted && (
    <ContentBodyV1 debugName="chown-sudo-permission-body">
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

- [ ] Buat folder `src/content/40-chown-sudo-permission/acts/` dan komponen `Act1` s/d `Act4`.
- [ ] Buat `acts/index.js` dengan `ACT_SCENES`.
- [ ] Refactor `Animation.jsx` menggunakan `ACT_SCENES` & `bgScenes`.
- [ ] Verifikasi `esbuild` kompilasi 0 error.
