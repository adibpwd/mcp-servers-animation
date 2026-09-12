# Revisi-02: Wiring Shared Playful Audio Pack — paper-send

> **Status:** ✅ Dieksekusi (2026-09-13). `vite build --logLevel warn` PASS
> (exit 0). Preview manual `npm run dev` masih pending.
>
> **Tanggal:** 2026-09-13
>
> Lanjutan revisi-01. Hanya menambah 1 SFX_MAP entry baru dari shared pack
> yang baru selesai fase implementasi
> (`docs/plan/PLAN-SHARED-PLAYFUL-AUDIO-PACK.md`). Tidak ada perubahan
> state, layout, atau timing.

## 1. Konteks

Revisi-01 mencatat kandidat `paper-send`/`approval-stamp` dari shared pack
belum dipakai karena file belum ada (pack masih draft). Pack sudah lolos
sourcing (Mixkit, lisensi Mixkit License) + loudness (-18.0dB mean, sejajar
baseline -18.1dB) — lihat `docs/audio/shared-playful-audio-pack.md`.

## 2. Perubahan

Scope pack §2 menyatakan `paper-send` dipakai untuk topic 19/20/21 pada
momen "email/token mulai jalan". Di 19-register, momen yang paling pas
adalah amplop verifikasi berangkat dari record menuju inbox (Act 4) —
sebelumnya memakai `SWOOSH` generik (sama dipakai topic lain untuk banyak
motion berbeda, tidak punya karakter khusus "kertas").

`approval-stamp` **tidak dipakai** di topic ini — scope §2 pack
menempatkannya untuk topic 20/22, bukan 19.

### data.js

```js
PAPER_SEND: { category: 'transitions', name: 'paper-send' },
```

`SWOOSH` **dihapus** dari SFX_MAP (bukan cuma diganti pemanggilannya) —
setelah PAPER_SEND menggantikan satu-satunya pemanggilan SWOOSH di topic
ini, SWOOSH jadi dead config. Sesuai guardrail §6 plan ("tidak ada
SFX_MAP entry tanpa pemanggilan nyata").

### Animation.jsx

Baris pemicu travel amplop (record → inbox), sebelumnya:

```js
sfxOn(tl, act3End + 0.4, () => sfxLoader.transition(SFX_MAP.SWOOSH.name, ...))
```

Menjadi:

```js
sfxOn(tl, act3End + 0.4, () => sfxLoader.transition(SFX_MAP.PAPER_SEND.name, ...))
```

## 3. Validasi

- `grep SFX_MAP.SWOOSH` di seluruh folder topic — 0 hasil, aman dihapus.
- `vite build --logLevel warn` — exit 0, dua kali (sebelum & sesudah hapus
  SWOOSH), tanpa error/warning.
- File `public/audio/transitions/paper-send.wav` terverifikasi ter-copy ke
  `dist/audio/transitions/paper-send.wav`.
- **`npm run dev` preview manual — BELUM DILAKUKAN**, sama seperti
  revisi-01, butuh telinga manusia untuk validasi rasa/kepadatan.

## 4. Checklist

- [x] Cek scope pack (§2) memang menyasar topic ini untuk paper-send.
- [x] Tambah SFX_MAP entry dengan kategori benar.
- [x] Wire ke motion yang tepat (amplop berangkat, bukan asal tempel).
- [x] Hapus dead config (SWOOSH) setelah pemanggilan lama dipindah.
- [x] `vite build` PASS.
- [ ] Preview manual `npm run dev` — dengarkan apakah paper-send terasa
      pas dibanding SWOOSH lama, dan tidak bentrok dengan DING di
      envArrived (jarak 1.4s, aman dari batas 0,35s §6 plan).
- [ ] Export audio dan cek sinkronisasi final.
