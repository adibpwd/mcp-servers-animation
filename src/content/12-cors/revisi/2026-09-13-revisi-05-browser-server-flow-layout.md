# Revisi-05 — CORS Check: Browser di Atas, Server di Bawah

| Item | Nilai |
|---|---|
| Content | 24 — CORS Check |
| Tanggal | 2026-09-13 |
| Status | 📝 PLAN ONLY — belum ada perubahan `Animation.jsx`, `data.js`, atau SFX schedule |
| Fokus | Memisahkan peran browser/server secara visual, menghapus collision/overlay, dan membuat alur CORS dapat dibaca seperti benang perjalanan. |

## Masalah yang ditangani

Rebuild saat ini sudah menggunakan jalur vertikal, tetapi pembagian peran
masih belum cukup eksplisit: `APP.EXAMPLE` berada di atas, `BROWSER GATE` di
tengah, lalu `API.EXAMPLE` dan policy shelf berada di bawah. Karena semua
kartu dan tiket juga memakai sumbu tengah yang sama, penonton dapat kehilangan
jawaban atas pertanyaan paling penting: **siapa melakukan apa?**

Potensi benturan yang harus diatasi saat eksekusi:

- kartu data payoff bisa masuk area catatan app;
- tiket request/response melintas tepat di atas gate, API, atau policy shelf;
- kartu preflight berada di dalam node API dan bersaing dengan label API;
- guardrail di bawah policy shelf dapat bertabrakan dengan ticket response dan
  catatan lokal;
- satu caption aktif dapat muncul di area yang juga sedang dilewati tiket.

## Prinsip layout baru

1. **Browser selalu di atas.** Browser bukan hanya gate kecil: ia menjadi
   panel besar di zona atas, berisi web app dan area pemeriksaan CORS.
2. **Server selalu di bawah.** API dan policy server menjadi satu kelompok
   server di zona bawah. Policy bukan actor ketiga yang setara browser; ia
   adalah bagian dari server.
3. **Benang perjalanan berada di sisi kanan.** Request turun di lane kanan,
   response naik di lane kiri. Keduanya tidak memakai area kartu konten.
4. **Satu beat, satu kartu fokus.** Preflight, policy, guardrail, dan data
   result tidak boleh terlihat penuh sekaligus kecuali hubungan antar-kartu
   memang sedang dibandingkan.
5. **Caption punya safe slot.** Caption hanya boleh muncul di strip kecil
   milik zona actor yang sedang dibahas, bukan di tengah jalur packet.

## Wireframe target

Koordinat adalah local coordinate `ContentBodyV1`; angka final divalidasi saat
preview, tetapi pembagian zonanya harus dipertahankan.

```text
┌──────────────────────────── BROWSER / CLIENT ───────────────────────────┐
│  APP.EXAMPLE                         CORS CHECK                         │
│  fetch('https://api.example/data')   origin berbeda → cek izin           │
│                                                                          │
│  [web app] ──────► [browser gate]                                       │
│                        │                                                 │
│                 caption slot browser                                     │
└────────────────────────┼────────────────────────────────────────────────┘
                         │  request turun (lane kanan) ↓
                         │  response naik  (lane kiri)  ↑
                   ╭─────┴─────────────────────────────╮
                   │         BENANG PERJALANAN          │
                   │    1 OPTIONS ↓   2 Allow ↑         │
                   │    3 POST    ↓   4 Data  ↑         │
                   ╰─────┬─────────────────────────────╯
                         │
┌────────────────────────┼── SERVER / API ────────────────────────────────┐
│                        ▼                                                  │
│  API.EXAMPLE  ──►  policy config                                          │
│  POST /data          allow origin · method · header                       │
│                                                                          │
│  [API endpoint]     [response headers]                                   │
│                 caption slot server                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

## Flow chart “benang”

Flow ini harus muncul sebagai garis kontinu dengan node bernomor. Hanya node
aktif yang menyala kuat; node sebelumnya meredup tetapi tetap terlihat sebagai
jejak perjalanan. Panah tidak boleh teleport atau menghilang di tengah jalan.

```text
Browser (atas)                                           Server (bawah)

[1] Web app membuat fetch
     │
     ├── origin berbeda ──► [2] Browser tahan request asli
     │                                │
     │                                └── OPTIONS + Origin/Method/Headers ──► [3] API menerima preflight
     │                                                                            │
     │  Allow-Origin/Methods/Headers ◄───────────────────────────────────────────┘
     ▼
[4] Browser cocokkan izin
     │
     └── POST + Authorization ────────────────────────────────────────────► [5] API proses request
                                                                               │
     data response ◄────────────────────────────────────────────────────────┘
     ▼
[6] Browser membuka data untuk JavaScript
```

Makna warna:

| Segmen benang | Warna | Makna |
|---|---|---|
| Fetch/request asli | Biru | Data yang diminta aplikasi. |
| OPTIONS preflight | Oranye | Pertanyaan izin dari browser. |
| Allow-* response | Hijau | Jawaban policy dari server. |
| Data response | Biru-hijau | Respons yang browser boleh buka untuk JavaScript. |
| Cabang gagal (aside) | Merah putus-putus | Contoh izin tidak cocok; bukan jalur utama. |

## Storyboard empat Act setelah revisi

| Act | Browser di atas | Server di bawah | Benang yang aktif | Hasil yang harus terbaca |
|---|---|---|---|---|
| 1 — Origin berbeda | App membuat fetch; gate browser menahan request asli. | API hanya terlihat standby/redup. | Node 1 → 2. | CORS diperiksa oleh browser sebelum JS mendapat hasil. |
| 2 — Preflight | Browser membuat kartu OPTIONS dan melepasnya. | API menerima kartu preflight di endpoint. | Node 2 → 3, lane turun kanan. | OPTIONS membawa origin, method, dan header yang diminta. |
| 3 — Policy | Browser menunggu di gate. | Server menampilkan policy lalu mengirim `Allow-*`. | Node 3 → 4, lane naik kiri. | Server menjawab batas izin; browser yang membandingkan. |
| 4 — Request asli & data | Gate terbuka setelah cocok; app menerima data di panel browser. | API memproses POST dan membalas data. | Node 4 → 5 → 6, turun kanan lalu naik kiri. | API memproses request; browser baru membuka respons ke JS. |

## Kontrak visibilitas dan anti-overlay

| Elemen | Area tetap | Muncul | Wajib disembunyikan/diringkas saat |
|---|---|---|---|
| Browser panel | Atas | Semua Act setelah intro | Tidak pernah berpindah ke zona server. |
| Server panel | Bawah | Semua Act setelah intro, redup di Act 1 | Tidak pernah naik melewati divider. |
| Preflight card | Di dalam lane input server, bukan menutup API title | Act 2 | Act 3 policy mulai penuh. |
| Policy card | Di dalam server panel, sisi kanan endpoint | Act 3 | Act 4 meredup menjadi satu baris header. |
| Guardrail merah | Aside kecil kanan server | Beat perbandingan Act 3 | Response `Allow-*` mulai bergerak. |
| Ticket request | Lane kanan | Saat bepergian saja | Tiba di node tujuan; jangan menutup node. |
| Ticket response | Lane kiri | Saat bepergian saja | Tiba di node tujuan; jangan menutup gate/app. |
| Caption | Slot browser atau slot server | Satu caption per beat | Ticket sedang melintas tepat di slot tersebut. |
| Data result | Di dalam web-app browser | Akhir Act 4 | Tidak boleh muncul di server panel. |

Aturan jarak minimum saat implementasi:

- divider browser/server harus menyisakan minimal 44 px di atas dan bawah;
- lane request dan response berjarak minimal 72 px satu sama lain;
- ticket tidak boleh lebih dari 80% lebar lane agar tidak menyentuh panel;
- node flow memiliki radius/box sendiri; tiket berhenti tepat sebelum node,
  lalu node yang menerima yang menyala;
- caption tidak boleh berada pada y-range ticket yang sedang bergerak.

## Detail copy yang direncanakan

Copy tetap singkat dan deklaratif.

| Lokasi | Copy |
|---|---|
| Browser Act 1 | `Browser cek origin berbeda` |
| Browser Act 2 | `Browser tanya sebelum POST` |
| Server Act 2 | `OPTIONS tiba di API` |
| Server Act 3 | `Server kirim header izin` |
| Browser Act 3 | `Browser cocokkan policy` |
| Browser Act 4 | `Browser buka data untuk JS` |
| Aside merah | `CORS bukan auth API` |

## Perubahan file saat eksekusi nanti

Tidak ada file yang diubah oleh plan ini. Jika dieksekusi pada revisi berikutnya,
perubahan diperkirakan terbatas pada:

- `src/content/24-cors/data.js` — zona browser/server, dua lane benang,
  waypoint, label node flow, dan batas safe slot;
- `src/content/24-cors/Animation.jsx` — layout actor, renderer benang/node,
  aturan pop in/out kartu, dan route travel request/response;
- `scripts/export-lib.js` — hanya jika timing visual akhir berubah;
- `src/content/24-cors/_docs/CORS_PLAN.md` — sinkronisasi storyboard dan
  checklist setelah preview.

## Checklist penerimaan eksekusi

- [ ] Browser terlihat utuh di atas sebelum packet pertama lahir.
- [ ] Server terlihat utuh di bawah dan policy terbaca sebagai bagian server.
- [ ] Request selalu turun di lane kanan; response selalu naik di lane kiri.
- [ ] Node 1–6 menunjukkan perjalanan tanpa teleport.
- [ ] Preflight card, policy card, guardrail, ticket, dan caption tidak saling
      menutup pada setiap beat.
- [ ] Penonton dapat menjawab: browser yang mengecek CORS, server yang
      mengirim header policy.
- [ ] Jalur gagal hanya aside dan tidak mengaburkan happy path.
- [ ] Preview mencakup intro, empat Act, transisi Act 2→3 dan 3→4, serta dua
      loop penuh pada ukuran portrait.
