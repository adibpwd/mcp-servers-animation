# Revisi-01: Audio Lebih Playful dan Bervariasi — 24-cors

> **Status:** ⚙️ Implemented — build PASS, menunggu preview manual & export audio sebelum `ready`
>
> **Tanggal:** 2026-09-13
>
> Revisi ini hanya mengubah audio. State cerita, layout, aset visual, durasi
> Act, registry, dan metadata topic tidak berubah.

## 1. Tujuan

CORS memerlukan ritme browser yang aktif dan lucu: ticket OPTIONS harus terasa ingin tahu, policy shelf terasa seperti pemeriksaan stiker, lalu gate membuka dengan payoff yang jelas.

Targetnya bukan membuat setiap frame berbunyi. Setiap Act perlu pola yang mudah
diingat: satu cue pembuka, satu cue aksi/gerak, satu cue emosi atau payoff.
Jeda baca tetap sengaja tenang. Batas default: maksimal dua SFX foreground
dalam 0,35 detik; cue ketiga digeser, dipelankan, atau dihilangkan.

## 2. Audit Source Saat Ini

**Temuan blocker:** sfxQueue menerima string seperti whoosh, lock, ding, dan alert tetapi selalu memanggil sfxLoader.play('ui', name). Akibatnya cue yang file-nya berada di transitions, impacts, success, atau warnings berpotensi silent/mismatch. SFX_MAP juga tidak dipakai sebagai source category. Intro tidak mempunyai cue; popOut tidak menerima SFX. Ini harus diperbaiki sebelum penambahan coverage lain.

| Prioritas | Cue / motion | Rencana audio |
|---|---|---|
| P0 | helper sfxQueue seluruh Act | ubah menerima entry SFX_MAP atau category+name; jangan hardcode ui |
| P1 | intro morph, API/gate muncul | slide-in/materialize + pop/plink bervariasi |
| P1 | actualHeld dan gateUp | lock saat gate menahan; whoosh pada gate naik via kategori transitions benar |
| P1 | OPTIONS pergi, API membaca, policy kembali | light-swoosh-quick pergi, scan policy, slide-in pulang |
| P1 | mismatch/match/actual request/response | error-beep untuk mismatch, chime untuk allowed headers, confirm/shimmer untuk response readable |
| P2 | gateOpen dan jsRead | unlock + relief-settle; bubble-pop baru bersama untuk kartu data siap |
| P3 | popOut preflightWait | popOut opsional memakai soft fade/tick agar cleanup terasa sengaja |

## 3. Palet Audio Playful

- **UI ringan:** plink, pop, pop-2, tick, chime; dipakai untuk kartu kecil,
  input, dan detail yang terasa ramah.
- **Gerak:** light-swoosh-quick, slide-in, swoosh; dipakai sekali pada travel
  yang menjadi fokus, bukan setiap perpindahan kecil.
- **Keamanan:** lock, connector-snap, critical-alert, alert-pulse; dipakai
  hemat hanya untuk block, expiry, atau penolakan yang penting.
- **Payoff:** shimmer, ding, confirm, relief-settle; shimmer/chime cocok untuk
  rasa magis yang ramah anak tanpa memberi kesan bahaya.
- **Ambient:** tidak memakai loop audio kontinu. Ambient visual tetap hidup,
  tetapi audio diam di sela caption agar dialog mental penonton tidak lelah.

## 4. Perubahan Data dan Timeline yang Direncanakan

Tambahkan hanya key SFX yang benar-benar dipanggil; hapus atau wire key lama
yang terbukti dead. Semua panggilan menggunakan kategori dari SFX_MAP, bukan
string nama file lepas. Cek level audio dengan ffprobe/ffmpeg volumedetect
sebelum memilih asset: cue foreground jangan memakai file terlalu pelan hanya
karena namanya cocok.

Key kandidat:

`MATERIALIZE` success/shimmer (gunakan key semantik, bukan file pelan); `LIGHT_SWOOSH` transitions/light-swoosh-quick; `POLICY_SCAN` sfx/scan; `ERROR_BEEP` warnings/error-beep; `ALLOW_CHIME` ui/chime; `UNLOCK` impacts/unlock; `RELIEF` success/relief-settle. Kandidat baru bersama: bubble-pop. Perbaikan helper: sfxQueue(entry, at) memanggil entry.category dan entry.name.

Setiap cue dipicu melalui sfxOn atau opsi popIn/popOut pada waktu perubahan
state yang sama. Tidak ada setTimeout, audio loop baru, atau perubahan state
React. Bila helper popOut belum menerima category/name/volumeMult, upgrade
lokal dibuat backward-compatible dengan default silent.

## 5. Validasi Audio

Validasi khusus: log/spy loader memastikan setiap category benar. Preview harus membedakan preflight request, policy response, actual request, dan data readable; jangan membuat OPTIONS serta actual request berbunyi sama.

- Ikuti docs/standardizations/06-audio-sfx.md §2, §3, §7, dan §8.
- Preview satu loop penuh dengan volume normal, lalu export audio. Catat cue
  terlalu pelan, bertumpuk, terlambat, atau terasa mengganggu di revisi ini.
- Tidak ada asset baru yang di-download pada revisi topic ini; kandidat aset
  baru bersama ada di docs/plan/PLAN-SHARED-PLAYFUL-AUDIO-PACK.md.

## 6. Checklist

- [x] Audit setiap motion signifikan terhadap cue dalam radius 0,3 detik.
- [x] Wire SFX_MAP tanpa dead config dan dengan kategori benar — 13/13 key terpakai (`SFX_MAP.ALLOW_CHIME/DING/ERROR_BEEP/LIGHT_SWOOSH/LOCK/MATERIALIZE/POLICY_SCAN/POP/POP2/RELIEF/SLIDE_IN/TICK/UNLOCK`), build PASS (exit 0).
- [x] Ukur loudness asset yang dipilih; ganti asset jika terlalu pelan — via `ffmpeg -af volumedetect`. Hasil: `transitions/whoosh.wav` (-39.9dB mean) diganti `LIGHT_SWOOSH` = `transitions/light-swoosh-quick.wav` (-15.2dB); `sfx/materialize.wav` (-32.0dB) diganti `MATERIALIZE` = `success/shimmer.wav` (-21.1dB) sesuai plan; `sfx/scan.wav` (-30.8dB) — sama pelan seperti materialize — diganti `POLICY_SCAN` = `ui/tick.wav` (-21.1dB), deviasi dari kandidat awal di §4 karena alasan loudness yang sama persis dengan alasan plan menolak materialize.wav; `warnings/alert-pulse.wav` (-31.9dB) diganti `ERROR_BEEP` = `warnings/error-beep.wav` (-22.7dB) untuk mismatch.
- [ ] Preview manual `npm run dev` satu loop penuh — **belum dilakukan** (hanya validasi build + cross-check statis, konsisten dengan status 21/22 sebelumnya).
- [ ] Export audio final — **belum dilakukan**.
- [x] Update README revisi dengan hasil actual setelah implementasi (lihat catatan di bawah).

### Catatan implementasi (hasil actual)

- P0 diperbaiki: `sfxQueue(entry, at)` dan `popOut(time, id, entry)` sekarang menerima entry `{category, name}` dari SFX_MAP, bukan string lepas yang selalu dipaksa kategori `'ui'`. Sebelumnya `whoosh`, `lock`, `alert`, `ding` silent/salah source karena file-nya tidak ada di folder `ui/`.
- Intro sekarang punya cue (`MATERIALIZE`) tepat saat header selesai morph, sebelum Act 1.
- `popIn` menerima parameter `entry` opsional untuk variasi (mis. `apiCard` pakai `POP2`, `policyCard` pakai `SLIDE_IN` — "policy kembali").
- `popOut('preflightWait', ...)` sekarang membawa cue `POLICY_SCAN` (P1 "API membaca" + P3 upgrade popOut sekaligus, tidak perlu dua panggilan terpisah).
- `jsRead` (data siap dibaca JS) sebelumnya tanpa cue — ditambah `RELIEF` sebagai payoff.
- Key `WHOOSH` (transitions/whoosh, lama) dan `DENY` (warnings/alert-pulse, lama) dihapus dari SFX_MAP karena sudah tergantikan penuh oleh `LIGHT_SWOOSH` dan `ERROR_BEEP` — mencegah dead config.
- **Bug non-audio ditemukan, tidak diperbaiki (di luar scope):** hampir semua caption yang dipanggil `Animation.jsx` (`CAPTIONS.APP_START`, `GATE_UP`, `TRIP_KNOWN`, `NEED_PERMISSION`, `PREFLIGHT_OFF`, `CARRIES`, `API_READS`, `POLICY_OPEN`, `CHECK_METHOD`, `MISMATCH`, `ALLOWED_HEADER`, `MATCH_PASS`, `ACTUAL_OFF`, `RESP_IN`, `GATE_OPEN`, `DATA_READY`, `CLOSING`) **tidak ada** di objek `CAPTIONS` pada `data.js` (isinya key berbeda seperti `APP_FETCH`, `ORIGIN_DIFF`, dst). Ini akan render `undefined` di caption saat runtime — mirip pola bug `CAPTIONS.TOKEN_DEPARTS` di topic 21. Perlu di-flag terpisah untuk sinkronisasi ulang `CAPTIONS` vs pemanggilnya (bukan masalah audio, di luar scope revisi ini).
