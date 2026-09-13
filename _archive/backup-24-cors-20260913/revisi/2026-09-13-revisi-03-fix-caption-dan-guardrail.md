# Revisi-03: Fix Caption Mismatch + Guardrail Wildcard — 24-cors

> **Status:** ⚙️ Implemented — build PASS (`vite build` exit 0, 1.82s).
> Menunggu preview manual & export sebelum `ready`.
>
> **Tanggal:** 2026-09-13
>
> Menindaklanjuti temuan `revisi/2026-09-13-revisi-02-audit-plan-vs-eksekusi.md`.
> Revisi ini HANYA mengubah caption text (`CAPTIONS` di `data.js`), menambah
satu caption baru (`WILDCARD_GUARD`) dan satu insersi `say()` di timeline
Act 3 Animation.jsx. State cerita, layout, aset visual, dan struktur Act
tidak berubah.

## 1. Masalah yang Diperbaiki

`revisi-02` menemukan 16 dari 18 pemanggilan `CAPTIONS.*` di `Animation.jsx`
tidak match dengan key di `CAPTIONS` pada `data.js`, sehingga sebagian besar
caption tampil `undefined` saat animasi diputar. Selain itu, guardrail teknis
plan §4 poin 5 (wildcard `Access-Control-Allow-Origin` tidak boleh
dipasangkan dengan `Allow-Credentials: true`) tidak punya representasi visual
sama sekali di animasi.

## 2. Perubahan

### 2.1 `data.js` — rename seluruh key `CAPTIONS`

Key diganti agar **persis** sama dengan yang dipanggil `Animation.jsx`,
teks dipertahankan dari key lama yang paling relevan secara makna:

| Key lama (dead) | Key baru (dipanggil Animation.jsx) | Teks |
|---|---|---|
| `APP_FETCH` | `APP_START` | "App meminta data" |
| `ORIGIN_DIFF` | `ORIGIN_DIFF` (tetap) | "Origin berbeda" |
| `RULE_BEDA` | `TRIP_KNOWN` | "Aturan beda" |
| `GATE_APPEAR` | `GATE_UP` | "Browser menjadi gate" |
| `NEED_IZIN` | `NEED_PERMISSION` | "Request perlu izin" |
| `PREFLIGHT_OFF` | `PREFLIGHT_OFF` (tetap) | "Preflight berangkat" |
| `OPTIONS_HEADER` | `CARRIES` | "OPTIONS + origin" |
| `API_READ` | `API_READS` | "API membaca preflight" |
| `POLICY_TERBUKA` | `POLICY_OPEN` | "Policy izin dibuka" |
| `BANDINGKAN` | `CHECK_METHOD` | "Browser membandingkan" |
| `DENY_TOLAK` | `MISMATCH` | "Tak cocok — tak terbaca" |
| `ALLOW_TERIMA` | `ALLOWED_HEADER` | "Allow cocok" |
| — (baru) | `MATCH_PASS` | "Method & header cocok" |
| — (baru) | `WILDCARD_GUARD` | "Wildcard + credential dilarang" |
| `ACTUAL_LANJUT` | `ACTUAL_OFF` | "Request asli lanjut" |
| `RESPONS_MASUK` | `RESP_IN` | "Respons dibaca" |
| `GATE_TERBUKA` | `GATE_OPEN` | "Gate terbuka untuk JS" |
| — (baru) | `DATA_READY` | "Data siap dibaca" |
| `BUKAN_AUTH` | `CLOSING` | "CORS bukan auth API" |

Key `NON_SIMPLE` (dead, tidak pernah dipanggil di `Animation.jsx`) dihapus
sesuai prinsip cleanup revisi-01 ("mencegah dead config").
### 2.2 `Animation.jsx` — sisip caption guardrail di Act 3

Ditambahkan satu baris `say(t, CAPTIONS.WILDCARD_GUARD)` setelah beat
`ALLOWED_HEADER` dan sebelum `MATCH_PASS`, tanpa state React atau elemen SVG
baru — memakai caption box yang sudah ada. Menambah ±1.3 detik ke Act 3.

### 2.3 `data.js` — sinkronisasi durasi

`PHASES[2].duration` (act3-policy) diupdate dari `12.0` menjadi `13.3` agar
metadata durasi tetap akurat terhadap timeline aktual.

### 2.4 `_docs/CORS_PLAN.md` — update status & checklist

Header status diganti dari "PLAN ONLY / Draft" menjadi "Implemented (first
pass)". Checklist §5: 4 dari 6 item ditandai `[x]` sesuai kondisi nyata
(lihat `revisi-02` §2 untuk rincian per item), 2 sisanya (`audit visual
asset` dan `preview/export`) tetap `[ ]` karena memang belum dikerjakan.

## 3. Validasi

- `npm run build` (vite build) — **PASS**, exit 0, 271 modul, 1.82s, tidak ada
  error/warning terkait perubahan.
- Tidak ada perubahan pada state React, struktur SVG, SFX_MAP, atau layout
  koordinat — risiko regresi rendah.

## 4. Yang Masih Belum Selesai (di luar scope revisi ini)

- [ ] Preview manual `npm run dev` satu loop penuh (visual + audio) — perlu
  mata/telinga manusia, tidak bisa divalidasi lewat build otomatis.
- [ ] Export audio final / export MP4.
- [ ] Audit visual formal untuk no-teleport, collision, dead field (baru
  audit SFX yang formal, lihat revisi-01).
- [ ] Approval eksplisit dari pemilik project atas scope & guardrail plan
  (saat ini implisit lewat eksekusi, bukan sign-off formal).

Item-item ini butuh keterlibatan manusia langsung (menonton animasi di
browser, mendengarkan audio, menjalankan export) sehingga tidak dieksekusi
otomatis dalam revisi ini.
