# OAuth2 Delegated Login — Rencana Cerita Animasi

> **Status:** 📝 PLAN ONLY / Draft
>
> **Terakhir diperbarui:** 2026-09-12
>
> Tidak ada implementasi, registry entry, OAuth client, redirect URI, atau aset
> yang dibuat oleh plan ini.

## 1. Pesan Utama

**Login sekali, lembaga ketiga memberi izin — bukan memberi password.**

Adib ingin memakai Aplikasi Catatan untuk membaca profil dasar dari Identitas
Kampus. Adib tidak pernah memberikan password Kampus kepada Aplikasi Catatan.
Sebaliknya, Adib login pada Kampus, melihat izin yang diminta, menyetujui scope
terbatas, lalu aplikasi menerima bukti izin yang dapat ditukar menjadi token.

**Janji audiens:** OAuth2 adalah delegasi izin, bukan “login lewat tombol
Google” secara ajaib, bukan berbagi password, dan bukan izin tanpa batas.

| Keputusan | Nilai |
|---|---|
| Topic ID / folder | oauth2-delegated-login / src/content/22-oauth2-delegated-login/ |
| Format | portrait 820 × 1340, scene-ui V1 |
| Durasi | ±48 detik: intro + 4 Act |
| Kategori | Developer Tools |
| Warna rencana | #6366F1 — delegated authority |
| Model | Authorization Code + PKCE, public/browser client |
| Prasyarat | Authentication: Adib dapat login di pihak identitas |
| Closing | aplikasi menerima profile.read, bukan password |

## 2. Peran dan Batas Konsep

OAuth2 menjawab pertanyaan “bagaimana aplikasi lain memperoleh izin terbatas
tanpa memegang password pengguna?” Login Adib di provider adalah momen
authentication; persetujuan scope adalah authorization. Bila menyebut identitas
login untuk aplikasi, label kecil dapat mengatakan “OpenID Connect di atas
OAuth2”, tetapi video tidak mengubah OAuth2 menjadi protokol password.

Yang tidak dibahas: implicit grant, password grant, device flow, refresh-token
rotation detail, konfigurasi provider, maupun kode SDK.

## 3. Content State Contract

| State | Terlihat | Belum boleh terlihat | Pemicu | Hasil |
|---|---|---|---|---|
| S0 | Adib, Aplikasi Catatan, Identitas Kampus redup | password Kampus di aplikasi, token | tekan Login Kampus | redirect dimulai |
| S1 | browser berpindah ke domain Kampus, PKCE challenge | consent/token | Adib login di Kampus | session provider valid |
| S2 | layar consent dengan profile.read | token penuh/akses tanpa setuju | Adib approve | authorization code terbit |
| S3 | code + redirect URI + PKCE verifier menuju aplikasi | akses resource | aplikasi menukar code | token scope terbatas |
| S4 | Aplikasi Catatan meminta profil dasar | password/izin lain | resource server cek token | profil dasar tampil |

## 4. Objek, Aksi, dan Continuity

| Aksi | Benda | Asal → tujuan | Akibat fisik |
|---|---|---|---|
| Mulai delegasi | tiket redirect + state + code challenge | aplikasi → browser → Kampus | aplikasi tidak menerima password |
| Authentication | kredensial Adib | Adib → halaman Kampus | hanya Kampus memverifikasi login |
| Consent | kartu scope profile.read | Kampus → Adib | pilihan approve/deny terlihat |
| Handoff | authorization code | Kampus → redirect URI aplikasi | code pendek, bukan access token |
| Tukar code | code + code verifier | aplikasi → token endpoint | token scope terbatas diterbitkan |
| Akses API | access token | aplikasi → profil API | hanya data sesuai scope kembali |

Aktor persistent: Adib, aplikasi, gedung Kampus, browser corridor, tiket
redirect/code, dan kartu scope. Tiket berubah menjadi code lalu token melalui
overlap visual; tidak boleh pop-out di provider lalu muncul mendadak di aplikasi.

## 5. Storyboard — Empat Act

### Act 1 — Aplikasi Tidak Meminta Password (±10 dtk)

| Beat | Teks lokal | Visual/motion |
|---|---|---|
| Setup | Catatan butuh profil dasar | Aplikasi menampilkan kartu profile.read |
| Tegangan | Password bukan milik aplikasi | kotak password ditolak dari aplikasi |
| Titik balik | Kampus menangani login | redirect ticket berangkat ke domain Kampus |
| Payoff | Password tetap di Kampus | Adib tiba di halaman Kampus |

### Act 2 — Adib Melihat Izin yang Diminta (±12 dtk)

| Beat | Teks lokal | Visual/motion |
|---|---|---|
| Setup | Login pada pihak tepat | Adib login hanya di gedung Kampus |
| Tegangan | Aplikasi minta scope terbatas | kartu profile.read muncul, bukan semua data |
| Titik balik | Adib memberi persetujuan | tombol Allow menyalakan scope |
| Payoff | Izin tercatat | cap Consent membentuk authorization code |

### Act 3 — Code Bukan Token (±14 dtk)

| Beat | Teks lokal | Visual/motion |
|---|---|---|
| Setup | Code kembali ke aplikasi | code mengikuti redirect URI terdaftar |
| Tegangan | Code perlu bukti pasangan | PKCE verifier mengunci pintu token |
| Titik balik | Challenge dan verifier cocok | jalur code → token endpoint menyala |
| Payoff | Token membawa scope | code morph menjadi token profile.read |

### Act 4 — Hanya Data yang Diizinkan (±12 dtk)

| Beat | Teks lokal | Visual/motion |
|---|---|---|
| Setup | Token menuju Profil API | token membawa scope kecil |
| Tegangan | Data lain tetap terkunci | kartu grades.write dan email.send redup |
| Titik balik | Scope diperiksa | resource server menguji profile.read |
| Payoff | Profil dasar kembali | aplikasi hanya menerima nama/avatar |

## 6. Guardrail Teknis

1. Aplikasi tidak menerima atau menyimpan password provider.
2. Authorization Code dengan PKCE S256 adalah jalur yang direncanakan untuk
   browser/public client; code verifier tidak dikirim pada authorization request.
3. Redirect URI harus terdaftar dan dicocokkan tepat; state mengikat transaksi
   dan membantu mitigasi CSRF/mix-up.
4. Authorization code singkat, sekali pakai, dan tidak digambar sebagai access
   token. Token tidak boleh diletakkan di URL dalam cerita.
5. Scope membatasi izin; consent tidak memberi seluruh akun.
6. OAuth2 menangani authorization. Identitas login biasanya membutuhkan OIDC
   bila aplikasi perlu identitas pengguna terstandar.

## 7. Shell, Aset, dan Checklist

- Wajib scene-ui V1, ContentBodyV1 local coordinate, dan safe-area audit.
- Inline SVG: browser corridor, redirect ticket, code, token, scope card,
  consent stamp, dan resource shelf. Tidak memakai box statis sebagai satu-satunya visual.
- Satu master GSAP time cursor; ambient domain lamps dan motion redirect/code
  di-kill saat Act berubah. Expose timeline + flushSync untuk export seek.
- Copy deklaratif ≤5 kata, dekat objek, tanpa caption bar/pertanyaan/emoji.

- [x] **Draft** — Approve model Code + PKCE, scope, dan guardrail.
- [x] **Draft** — Buat Animation.jsx, data.js, manifest.js.
- [x] **Draft** — Implementasikan intro dan Act 1–4 dengan handoff terlihat.
- [x] **Draft** — Audit redirect URI, state, PKCE, code/token distinction (carrier tunggal ticket→code→token, PKCE lock+match, provider gate terpisah dari app).
- [x] **Draft** — Audit asset/SFX, dead field, collision, no teleport (dead field `CODE_TOKEN_PATH_X_LEFT/RIGHT` & `ADIB/APP_CLIENT/PROVIDER_SERVER` dihapus dari data.js, `AUTH_CODE.singleUse/short` ditandai TODO).
- [ ] **Draft** — Preview manual & export MP4 sebelum registry diaktifkan (`ready`). Sudah didaftarkan di registry.js dengan status `coming-soon`.

**Catatan eksekusi (2026-09-12):** topic ini pure inline SVG (tidak ada
elemen icon PNG statis) — mengikuti pola 17-rest-api/18-auth/23-https-tls,
folder `icons/` sengaja TIDAK dibuat karena semua elemen sudah masuk
kategori inline SVG di audit visual (lihat
`09-standar-pembuatan-konten.md` §1.B).

**Rujukan teknis:** RFC 9700 dan RFC 10017.
