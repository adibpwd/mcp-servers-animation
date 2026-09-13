# Revisi-02 — OAuth2 Delegated Login: Provider Nyata, Peran Jelas, Tanpa Overlay

| Item | Nilai |
|---|---|
| Content | 22 — OAuth2 Delegated Login |
| Tanggal | 2026-09-13 |
| Status | 📝 PLAN ONLY — tidak ada perubahan kode, data, asset, atau SFX |
| Fokus | Menjelaskan tombol login Google/GitHub/Microsoft/Apple, menegaskan tugas masing-masing provider, menambah cerita nyata, dan menghilangkan overlay antar-elemen. |

## Masalah yang perlu diselesaikan

Versi sekarang memakai provider generik “Identitas Kampus”. Konsep OAuth2
sudah benar, tetapi audiens belum otomatis menghubungkannya dengan tombol
“Continue with Google”, “Login with GitHub”, “Sign in with Microsoft”, atau
“Sign in with Apple” yang mereka lihat sehari-hari.

Selain itu, beberapa objek berbagi sumbu tengah dan area y yang berdekatan:

- carrier redirect/code/token berada di kanan provider, consent, dan resource;
- consent stamp dapat bertumpuk dengan carrier ketika Act 2 selesai;
- form login menutupi isi provider card;
- caption memakai empat y statis, sehingga bisa bersinggungan dengan card,
  carrier, atau scope lock pada beat lain di Act yang sama;
- closing stamps berada dekat resource shelf dan scope locked cards.

## Pesan utama setelah revisi

Tombol “Login with Google/GitHub/Microsoft/Apple” **bukan** aplikasi tujuan
meminta password provider. Tombol itu mengarahkan pengguna ke provider pilihan
untuk tiga pekerjaan yang berbeda:

1. membuktikan siapa pengguna melalui sesi/login provider;
2. menunjukkan dan mencatat persetujuan scope yang diminta aplikasi;
3. menerbitkan authorization code yang dapat ditukar aplikasi menjadi token
   terbatas untuk API/provider resource yang relevan.

OAuth2 terutama menjelaskan izin akses. Bila aplikasi juga perlu identitas
login standar, label kecil menyebut “biasanya OpenID Connect untuk identitas”,
tanpa mengubah video menjadi tutorial OIDC penuh.

## Provider nyata: apa tugasnya?

Keempat provider ditampilkan sebagai **pilihan provider di layar yang sama**,
bukan empat flow paralel. Masing-masing memakai pola redirect → login/session
→ consent → code → token, tetapi resource dan contoh scope boleh berbeda.

| Provider | Contoh tombol | Tugas provider dalam cerita | Contoh izin kecil | Resource contoh | Catatan copy aman |
|---|---|---|---|---|---|
| Google | `Continue with Google` | Menangani login Google, consent, lalu memberi code/token untuk API Google yang diizinkan. | `openid profile email` atau scope Drive yang sempit | profil dasar / file Drive tertentu | `Google mengelola login dan consent` |
| GitHub | `Continue with GitHub` | Mengautentikasi akun GitHub dan menyetujui scope OAuth App yang diminta. | `read:user` | username dan avatar developer | `GitHub tidak memberi password ke app` |
| Microsoft | `Continue with Microsoft` | Menangani akun kerja/sekolah/personal dan delegated permissions. | `User.Read` | profil Microsoft Graph | `Akses bertindak atas nama user` |
| Apple | `Sign in with Apple` | Menangani autentikasi dan persetujuan Sign in with Apple. | `name email` | identitas dasar aplikasi | `Apple menangani login` |

Nama dan logo provider dipakai hanya sebagai contoh pengenal. Bila logo resmi
belum tersedia atau penggunaannya belum diaudit, gunakan label teks + warna
netral terlebih dahulu; jangan membuat ulang logo yang menyerupai aset resmi.

## Cerita utama yang dipilih

Gunakan **GitHub sebagai kasus utama** karena dekat dengan audiens developer.
Tiga provider lain hanya muncul sebagai pilihan awal dan kartu referensi
ringkas. Ini menjaga satu alur tetap mudah dibaca.

> Rani membuka DevNotes dan memilih **Continue with GitHub**. DevNotes hanya
> meminta `read:user` agar dapat menampilkan username dan avatar pada profil.
> Rani login di GitHub, melihat izin itu, lalu menyetujui. GitHub mengembalikan
> authorization code ke redirect URI DevNotes. DevNotes menukar code dengan
> PKCE dan memakai token berscope `read:user` untuk meminta profil. DevNotes
> tidak pernah menerima password GitHub Rani dan tidak bisa menulis repository.

### Kartu “provider lain”

Muncul hanya di Act 1 selama ±1,5 detik sebagai pilihan tombol:

```text
┌──────────────────── DevNotes ────────────────────┐
│  Pilih cara masuk                                 │
│  [ G  Continue with Google ]                      │
│  [ <> Continue with GitHub ]  ← kasus utama       │
│  [ M  Continue with Microsoft ]                   │
│  [   Sign in with Apple ]                        │
└──────────────────────────────────────────────────┘
```

Setelah GitHub dipilih, tiga pilihan lain berubah menjadi chip kecil redup
“provider alternatif”, lalu tidak ikut bergerak atau muncul di jalur code.

## Alur visual dan pembagian peran

```text
Rani + DevNotes (client)                 GitHub (provider)              GitHub API
         │                                      │                            │
1. pilih Continue with GitHub                   │                            │
         │── redirect + state + PKCE ──────────►│                            │
         │                                      │                            │
         │                          2. login/session GitHub                 │
         │                          3. tampilkan scope read:user             │
         │                                      │                            │
         │◄── 4. redirect URI + authorization code ─┤                        │
         │                                      │                            │
5. tukar code + verifier ke token endpoint ────►│                            │
         │◄── access token (read:user) ─────────┤                            │
         │──────────────────── token ──────────────────────────────────────►│
         │◄──────────────── username + avatar ──────────────────────────────┤
```

Benang utama harus bernomor 1–6. Kode dan token memiliki bentuk dan lane
berbeda: code hanya pulang lewat redirect browser; token hanya menuju API
setelah pertukaran aman. Tidak ada password yang bergerak dari provider ke
DevNotes.

## Storyboard revisi — tetap empat Act

| Act | Cerita | Provider yang terlihat | Peran yang harus dipahami | Payoff |
|---|---|---|---|---|
| 1 — Pilih provider, bukan password | DevNotes memperlihatkan Google/GitHub/Microsoft/Apple, lalu Rani memilih GitHub. | Semua provider sebagai tombol; GitHub fokus. | Aplikasi mengarahkan ke provider; aplikasi tidak meminta password. | Redirect membawa state + PKCE challenge ke GitHub. |
| 2 — GitHub autentikasi dan minta consent | Rani login/sesi di GitHub; GitHub menunjukkan `read:user`. | GitHub panel penuh; provider lain chip kecil redup. | Provider memverifikasi login; user menyetujui izin spesifik. | Consent membuat authorization code untuk redirect URI. |
| 3 — Code ditukar, bukan dibaca sebagai token | Code kembali ke DevNotes; DevNotes mengirim code + verifier ke token endpoint GitHub. | GitHub authorization/token endpoint dan DevNotes. | Code sementara/sekali pakai; PKCE memeriksa pasangan; provider menerbitkan token. | Token hanya membawa `read:user`. |
| 4 — API cek scope | DevNotes memakai token untuk meminta profil GitHub. | GitHub API; kartu provider lain tidak tampil lagi. | Resource API memeriksa scope token, bukan memberi semua akses akun. | Username/avatar kembali; `repo`/write access tetap terkunci. |

## Rencana layout anti-overlay

Gunakan tiga lane tetap di dalam `ContentBodyV1`.

```text
┌───────────────────────────────────────────────────────────┐
│ Lane kiri       Lane tengah                    Lane kanan  │
│ User + client   Browser flow / carrier         Provider/API │
│                                                               │
│ DevNotes        redirect/code/token →          GitHub        │
│ provider chips  caption browser slot           login/consent  │
│                                                               │
│                  exchange lane                 token endpoint │
│                                                               │
│                  return lane                   GitHub API     │
└───────────────────────────────────────────────────────────┘
```

| Elemen | Posisi rencana | Aturan anti-overlay |
|---|---|---|
| Daftar empat tombol provider | Kartu DevNotes bagian atas | Hanya Act 1; setelah pilihan, susut menjadi satu chip ringkas. |
| Provider GitHub | Kanan tengah | Login form menggantikan isi body card, bukan dilayer di atas label/header. |
| Consent card | Kanan, di bawah provider header | Consent stamp berada di luar kanan-atas card; carrier berhenti di lane tengah. |
| Carrier redirect/code/token | Lane tengah | Selalu punya jalur sendiri; tidak boleh lewat di depan teks card. |
| PKCE lock | Tengah bawah, sisi kiri lane carrier | Code berhenti sebelum lock; check mark tampil setelah carrier lewat. |
| Resource/API | Kanan bawah | Token datang dari lane tengah; data respons kembali pada lane kiri. |
| Caption | Slot bawah setiap panel aktif | Satu caption aktif; hide/fade saat packet melintas pada y yang sama. |
| Closing | Satu takeaway band paling bawah | Menggantikan resource/scope cards sebelum muncul; tidak ditumpuk di atasnya. |

Aturan tambahan:

- minimal 24 px jarak antar-card dan 36 px antara carrier dengan tepi card;
- tidak ada elemen persistent yang memakai `AXIS_X + 150` tanpa lane khusus;
- consent stamp dan check login tidak boleh berbagi bounding box dengan carrier;
- scope terkunci di Act 4 tampil sebagai aside satu baris, lalu memudar sebelum
  kartu hasil profil/closing hadir;
- `CAPTION_Y` statis diganti menjadi anchor per beat atau slot yang ditentukan
  layout agar tidak bertabrakan dengan objek aktif.

## Copy yang direncanakan

| Beat | Copy in-video |
|---|---|
| Daftar tombol | `Pilih provider identitas` |
| GitHub dipilih | `GitHub menangani login` |
| Password | `Password tetap di GitHub` |
| Consent | `DevNotes minta read:user` |
| Code | `Code kembali ke redirect URI` |
| PKCE | `Code dan verifier cocok` |
| Token | `Token hanya read:user` |
| API | `GitHub API cek scope` |
| Batas akses | `Akses repo tetap terkunci` |
| Takeaway | `Izin diberikan, password tidak` |

## Guardrail teknis yang wajib tetap benar

1. Contoh login sosial yang butuh identitas pengguna diberi catatan kecil:
   “OIDC biasanya memberi identitas; OAuth2 memberi delegasi akses.”
2. Provider mengelola autentikasi, sesi, consent, serta penerbitan code/token;
   aplikasi tujuan tidak menerima password provider.
3. `read:user` adalah contoh scope GitHub yang sempit; jangan menggambar
   akses repository atau write permission sebagai efek otomatis login.
4. Authorization code tetap singkat dan sekali pakai; token tidak muncul di
   URL/redirect ticket.
5. PKCE, `state`, dan exact redirect URI tetap terlihat dalam flow; provider
   examples tidak boleh menyederhanakan ketiganya sampai hilang.
6. Contoh Google/Microsoft/Apple bukan janji bahwa semua provider memakai
   scope/endpoint yang identik; mereka adalah variasi dari pola delegated
   authorization yang sama.

## File yang akan berubah bila rencana dieksekusi

Plan ini tidak mengubah file produksi. Eksekusi berikutnya diperkirakan
menyentuh:

- `src/content/22-oauth2-delegated-login/data.js` — provider cards, case
  GitHub, lane layout, scope/resource, dan anchor caption;
- `src/content/22-oauth2-delegated-login/Animation.jsx` — flow berlane,
  pergantian provider button → GitHub focus, consent/header replacement,
  visibility contract, dan closing sequence;
- `src/content/22-oauth2-delegated-login/caption.md` — cerita DevNotes/Rani
  dan peran provider;
- `scripts/export-lib.js` — hanya bila waktu beat berubah;
- `src/content/22-oauth2-delegated-login/_docs/OAUTH2_DELEGATED_LOGIN_PLAN.md`
  — sinkronisasi setelah visual lulus preview.

## Checklist penerimaan eksekusi

- [ ] Google, GitHub, Microsoft, dan Apple terlihat sebagai contoh pilihan
      provider tanpa membuat empat perjalanan paralel.
- [ ] GitHub dipakai konsisten sebagai satu cerita utama dari redirect sampai
      data profil kembali.
- [ ] Penonton dapat menyebut tugas provider: login/session, consent, dan
      code/token; bukan menyerahkan password ke aplikasi.
- [ ] Alur bernomor 1–6 terlihat tanpa teleport dan memisahkan code dari token.
- [ ] Login form, consent stamp, carrier, caption, locked scope, dan closing
      tidak tumpang tindih pada setiap beat.
- [ ] Resource contoh hanya mengembalikan username/avatar; akses `repo` atau
      write scope tetap tidak tersedia.
- [ ] Preview portrait mencakup seluruh empat Act, perpindahan Act 2→3,
      Act 3→4, serta minimal dua loop penuh.

## Referensi saat eksekusi

- Google: [OAuth 2.0 untuk Google APIs](https://developers.google.com/identity/protocols/oauth2)
- GitHub: [Authorizing OAuth Apps](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
- Microsoft: [Authorization code flow](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow)
- Apple: [Sign in with Apple](https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple/)
