# REVISI PLAN 01 — 91 Linux Server: Flow Kausal, Icon PNG, dan Detail Kasus

| Item | Keputusan |
|---|---|
| Content | 91 — Linux Server: Sistem yang Menyediakan Layanan |
| Status | PLAN ONLY — jangan dieksekusi sebelum ada persetujuan eksplisit |
| Tanggal | 2026-09-19 |
| Dokumen ini | Revisi terpisah; melengkapi `_docs/LINUX_SERVER_PLAN.md`, tidak mengubah file implementasi |
| Audiens | Pemula/orang awam yang sudah pernah melihat user, process, service, network, SSH, logs |
| Fokus | Setiap visual punya asal-usul, setiap Act berupa kasus nyata, istilah teknis tetap ada tetapi dijelaskan lewat gerak |
| Sumber temuan | Pembacaan `Animation.jsx` (470 baris), `data.js` (195 baris), `_docs/LINUX_SERVER_PLAN.md`; BELUM diverifikasi lewat preview browser |

## 1. Umpan balik yang ditangani

| No | Umpan balik | Ditangani di |
|---|---|---|
| 1 | Text box tiba-tiba muncul; tidak ada flow/case awal, penonton tidak tahu itu datang dari mana | Bagian 2.1, 3, 6 (Case Strip + Aturan Asal-Usul + storyboard) |
| 2 | Perlu `icons.json` untuk generate icon dari ChatGPT; jangan hanya kotak teks | Bagian 2.2, 9, Lampiran A |
| 3 | Flow/case diperdetail supaya orang awam paham, istilah teknis tidak dihilangkan | Bagian 3, 6, 7, 8 |

## 2. Diagnosis dari kode aktual

Catatan metode: semua temuan di bawah berasal dari membaca kode, bukan dari
melihat hasil render. Angka piksel dihitung dari koordinat di kode dan token
`ContentBodyV1` (lebar body 732, tinggi 965). Verifikasi visual tetap wajib
setelah eksekusi.

### 2.1 Poin 1 — Kenapa terasa muncul tiba-tiba

| Temuan | Bukti di kode | Dampak untuk penonton |
|---|---|---|
| Act 3, 4, 5, 6 hanya `ChipRow`: 3–4 kotak muncul sekaligus lewat `setXVisible(true)`, tanpa gerak dan tanpa sumber | `Animation.jsx`: `setAspectsVisible/IdentityVisible/SignalsVisible/OpsVisible(true)` pada awal tiap Act | Terlihat seperti daftar slide, bukan kejadian |
| Semua `ChipRow` digambar di `y=340`, sedangkan server anchor di `y=680` | `ChipRow ... y={340}` vs `SERVICE_NODE {y:680}` | Jarak 340 unit tanpa garis atau objek penghubung; kotak tidak terlihat milik siapa |
| Hanya satu chip aktif yang menampilkan deskripsi; sisanya redup 55% | `active && <text ...>{item.desc}` | Penjelasan hanya berupa teks kecil yang berganti-ganti |
| Act 6: tidak ada objek yang dideploy; hanya chip menyala dan badge anchor berganti teks `DEPLOYING → ROLLBACK → RESTORED` | `setAnchorBadge(...)` di Act 6 | Rollback terjadi tanpa terlihat apa yang gagal |
| Act 7: empat pilar `pop` satu per satu tanpa asal | `PostureWheel` + `setPillarsCount(i + 1)` | Pilar tidak terhubung ke hal yang sudah dilihat di Act 1–6 |
| Act 4: `GateBadge` muncul tanpa user maupun data yang diakses | `GateBadge state={gateState}` | Gate tidak punya siapa yang meminta dan apa yang dilindungi |
| Bug: state `request` merender `DENIED` merah selama 0.6 detik sebelum `GRANTED` | `const granted = state === 'granted'` → `request` jatuh ke sisi `RISK` | Penonton melihat penolakan palsu |
| Act 2: node tujuan baru dirender setelah garis sampai, jadi garis tumbuh menuju titik kosong | `setDnsVisible(true)` dipanggil setelah `FlowPath` selesai | Melanggar aturan destination node harus terlihat (redup) sebelum paket berangkat |
| Act 2: tidak ada aksi client, tidak ada nama domain, tidak ada IP, tidak ada port | `FlowNode label="CLIENT"` hanya lingkaran + teks | Tidak ada "kasus awal" yang memicu semuanya |

### 2.2 Poin 2 — Kenapa visual terasa kotak teks biasa

| Temuan | Bukti | Dampak |
|---|---|---|
| Hampir seluruh visual adalah `rect`/`circle` + teks monospace | `ChipRow`, `FlowNode`, `GateBadge`, `PostureWheel` | Tidak ada objek yang dikenali (laptop, cloud, firewall, database) |
| Satu-satunya "icon" adalah `ServerAnchorIcon`, yaitu tiga persegi panjang | `ServerAnchorIcon` | Server yang jadi tokoh utama tampil seperti diagram |
| Teks deskripsi `fontSize 8.5` dan label badge `9.5` | `ChipRow`, `ServerAnchorIcon` | Di bawah batas keterbacaan standar (caption minimum 11) |
| Keputusan lama "inline SVG dulu, belum ada `icons/icons.json`" | Komentar `data.js` dan `Animation.jsx`; item Icon planning belum dicentang di plan | Keputusan ini yang direvisi (Bagian 9) |
| Tidak ada folder `icons/` | Struktur folder topic 91 | Tidak ada pipeline aset ChatGPT |

### 2.3 Poin 3 — Detail flow

Storyboard lama menjelaskan konsep sebagai daftar (`COMPUTE_FORMS`,
`SERVICE_ASPECTS`, `IDENTITY_ITEMS`, `HEALTH_SIGNALS`, `OPERATIONS_CARDS`).
Penonton awam diberi kosakata (process, resource, dependency, least privilege,
logs, metrics, rollback) tanpa melihat kasusnya. Revisi mengubah tiap Act
menjadi satu kasus yang dapat diikuti sebab-akibatnya.

### 2.4 Temuan tambahan (di luar 3 poin, ikut diperbaiki karena melanggar standar atau menyebabkan bug)

| No | Temuan | Standar yang terkait | Tindakan di revisi |
|---|---|---|---|
| a | `ACT1_BEATS.hook` ("Server itu bentuk fisik atau peran?") dan `ACT4_BEATS.intro` ("Siapa boleh menyentuh data yang mana?") berbentuk pertanyaan | 03 §1.D: caption tidak boleh kalimat tanya | Semua copy diganti pernyataan (Bagian 10) |
| b | Narasi lewat `CaptionBar` + `say()` | 03 §1.D: `say()` deprecated; pakai `IconCaption`/`PathLabel` | `CaptionBar` dihapus; caption menempel di objek |
| c | DNS digambar sebagai node yang dilewati paket (client → DNS → edge → service) | Akurasi teknis | DNS menjadi lookup samping; paket data berjalan lewat rute jaringan (Bagian 6, Act 2) |
| d | Pusat horizontal dipakai `410`, padahal koordinat lokal `ContentBodyV1` berlebar 732 sehingga pusat `366` | 05 layout map | Semua koordinat dihitung ulang dari pusat 366 |
| e | `ChipRow` 4 item: `w = min(178, floor(680/4)-12) = 158`, total lebar 668, pusat 410 → tepi kanan di 744 > 732 dengan `clip` aktif | 05 zona dan overflow | `ChipRow` dihapus; tidak ada baris chip |
| f | `COPY`, `POSTURE_PILLARS` bertanda `TODO: belum dirender`; `POP2`, `CHIME`, `SWOOSH`, `TELEPORT`, `LOCK` ada di `SFX_MAP` tetapi tidak dipanggil | 06 §3 dead config | Dipakai atau dihapus (Bagian 10) |
| g | 7 Act pada durasi 59 detik | 03 §1.E dan §1.P: >4–5 Act perlu alasan tertulis | Alasan ditulis di Bagian 3.6; durasi dinaikkan |
| h | `SFX_SCHEDULES` belum tersambung ke export | 06 | Masuk checklist eksekusi |

## 3. Keputusan yang dikunci

### 3.1 Satu kasus berjalan: toko online `toko.example`

Seluruh 7 Act memakai satu cerita yang sama supaya orang awam punya jangkar:
sebuah aplikasi toko (`toko-web`) yang harus hidup di server, dibuka
pelanggan, bisa mati, menyimpan data pesanan, dipantau, diperbarui, dan
dipulihkan. Nama domain memakai `toko.example` dan IP `203.0.113.10` (rentang
dokumentasi TEST-NET-3), sehingga tidak ada domain/IP nyata sesuai batas aman
plan utama.

### 3.2 Case Strip

Setiap Act dibuka dengan satu strip kasus di bagian atas body (`y 0–44`,
tinggi 36, lebar 640, pusat x=366, font 14). Strip ini satu-satunya channel
untuk kalimat kasus; caption lain menempel di objek. Tidak ada kalimat yang
tampil di dua tempat.

| Act | Case Strip |
|---|---|
| 1 | Kasus: aplikasi toko butuh tempat berjalan. |
| 2 | Kasus: pelanggan membuka toko.example. |
| 3 | Kasus: aplikasi toko mati mendadak. |
| 4 | Kasus: aplikasi toko membaca data pesanan. |
| 5 | Kasus: pesanan melambat, penyebab belum jelas. |
| 6 | Kasus: rilis versi baru bermasalah. |
| 7 | Kasus: server toko diaudit sebelum ramai. |

### 3.3 Aturan Asal-Usul (menjawab poin 1)

Tidak boleh ada objek yang `pop` tanpa sebab. Setiap objek baru harus memenuhi
salah satu:

1. **Lahir dari objek sumber**: unfold/branch dari objek yang sudah ada (mis.
   service manager membuka dari server anchor, log scroll keluar dari anchor).
2. **Dipicu peristiwa**: muncul sebagai akibat paket/pulse yang tiba (mis. rules
   card keluar dari firewall saat paket sampai, alert bell keluar saat grafik
   melewati threshold).
3. **Sudah ada redup lebih dulu** lalu menyala (node jalur Act 2 digambar
   sebagai skeleton redup sebelum paket berangkat).

Tidak ada `ChipRow`. Daftar konsep menjadi aktor yang bergerak.

### 3.4 Caption menempel di objek

Semua caption memakai `IconCaption` (di bawah icon) atau `PathLabel` (di
jalur), maksimal 5 kata, kalimat pernyataan, tanpa emoji dan tanpa kata ganti
orang, font minimum 12 untuk caption dan 11 untuk label sekunder.

### 3.5 Akurasi teknis yang dipertahankan dan diperbaiki

- DNS adalah lookup terpisah: client bertanya, DNS menjawab IP, baru paket data
  berangkat. Paket tidak melewati DNS.
- Port 443 disebut eksplisit sebagai pintu web; port lain digambar tertutup
  (3306 database tidak terbuka dari luar).
- Koneksi terbentuk lewat tiga langkah singkat (SYN, SYN-ACK, ACK). TLS/HTTPS
  tidak dibahas di sini (dirujuk ke topic seri jaringan).
- Service manager (systemd) memulai dependency lebih dulu, memantau proses, dan
  menghidupkan ulang saat mati.
- Identity: service account, admin lewat SSH key, dan identitas asing
  diperlakukan berbeda oleh permission.
- Logs (kejadian) dan metrics (angka) dibedakan; health check dan alert
  memakai threshold.
- Rollback ke versi stabil, backup ke lokasi terpisah, dan restore test
  sebagai bukti pemulihan.
- Tidak ada command runnable, kredensial, langkah hardening, atau perubahan
  firewall nyata (batas aman plan utama tetap berlaku).

### 3.6 Alasan 7 Act dan durasi

Topic ini menyurvei tujuh domain yang masing-masing butuh satu kasus utuh:
peran, jalur masuk, lifecycle service, akses data, observability, perubahan
dan pemulihan, posture. Memadatkan menjadi 4 Act akan mengembalikan bentuk
daftar yang dikeluhkan. Preseden: topic 34 memakai 8 Act pada 105–125 detik.

| | Lama | Revisi |
|---|---:|---:|
| Act 1 | 8 s | 14 s |
| Act 2 | 9 s | 24 s |
| Act 3 | 8 s | 18 s |
| Act 4 | 9 s | 18 s |
| Act 5 | 8 s | 16 s |
| Act 6 | 9 s | 20 s |
| Act 7 | 8 s | 12 s |
| **Total Act** | **59 s** | **122 s** |
| Intro | 1.5 s | 1.5 s |

Angka revisi adalah estimasi; WAJIB diukur ulang dari timeline nyata.
Cadangan bila format 60–75 detik dibutuhkan: pecah menjadi 91a (Act 1–4, ±74 s)
dan 91b (Act 5–7 dengan recap singkat, ±48 s). Keputusan pemecahan tidak
diambil sekarang; default tetap satu video.

## 4. Scene shell, layout, dan peta stasiun

### 4.1 Scene shell

Tidak berubah: scene-ui V1 portrait 820×1340 (`IntroHeaderMorphV1`,
`ActBadgeNavigatorV1`, `ContentBodyV1`). Title tetap `SERVER` biru/cyan
`#38BDF8` + ` ROLE` hijau `#34D399`. Series Identity Contract tidak berubah.

### 4.2 Koordinat body (lokal, 0,0 = pojok kiri-atas body)

| Zona | y lokal | Isi | Aturan |
|---|---|---|---|
| Case Strip | 0–44 | Kalimat kasus per Act | Satu-satunya teks kasus |
| Panggung atas | 60–300 | Client, DNS, cloud, dashboard | Aktor utama boleh |
| Panggung tengah | 300–560 | Edge, service manager, gate, vault | Aktor utama boleh |
| Zona server | 560–780 | Server anchor + badge | Anchor pusat (366, 640) |
| Closing | 785–965 | Breadcrumb, callback strip, tease | Dilarang aktor utama |

Pusat horizontal `x = 366`. Gap minimum antar objek yang bersebelahan 20.

### 4.3 Peta stasiun (posisi tetap lintas Act)

| Stasiun | Posisi (x, y) | Ukuran tampil | Aktif di |
|---|---|---|---|
| Client phone | (110, 120) | 72×110 | Act 1–6 (mengecil dan redup setelah Act 3) |
| Server anchor | (366, 640) | 120×120 | Act 1 settle → Act 7 |
| App tile `toko-web` | menempel di anchor (kanan, 440, 640) | 64×48 | Act 1 dock → Act 6 |
| DNS book | (600, 120) | 90×90 | Act 2 |
| Internet cloud | (366, 300) | 150×100 | Act 2 |
| Firewall wall | (366, 470) | 160×90 | Act 2 |
| Rules card | (590, 470) | 200×120 | Act 2 |
| Listening socket | (366, 590) | 56×40 | Act 2–3 |
| Service manager | (366, 470) | 120×100 | Act 3 |
| Process shelf | db (170, 330), app (366, 330) | 110×80 | Act 3 |
| Identity column | x=110, y=280/400/520 | 130×90 | Act 4 |
| Access gate | (450, 400) | 60×100 | Act 4 |
| Data vault | (590, 420) di Act 4, lalu pindah ke (600, 720) | 100×100 | Act 4–6 |
| Permission card | (590, 550) | 200×104 | Act 4 |
| Monitor dashboard | (366, 290) | 320×200 | Act 5 |
| Log scroll | (120, 470) | 80×100 | Act 5 |
| Health probe | (600, 470) | 70×70 | Act 5 |
| Alert bell | (620, 300) | 70×70 | Act 5 |
| Staging pad | (140, 330) | 130×80 | Act 6 |
| Release stack v1/v2 | (140, 430) | 90×80 | Act 6 |
| Backup vault | (130, 720) | 100×100 | Act 6 |
| Restore test area | (366, 420) | 180×110 | Act 6 |
| Runbook doc | (366, 420) menggantikan restore area | 80×100 | Act 6 |
| Pillar cards | (130, 500), (602, 500), (130, 740), (602, 740) | 180×64 | Act 7 |

Cek tabrakan: tiap Act hanya memakai subset stasiun; pasangan yang berbagi
koordinat (service manager dan firewall di (366, 470); restore area dan runbook
di (366, 420)) tidak pernah aktif bersamaan karena diganti lewat handoff.
Bounding box kartu terlebar (rules card x 490–690) tidak melewati sisi kanan
732. Client (y 65–175) berjarak 21 dari Case Strip. Badge anchor berakhir di
y≈740, di atas zona closing 785.

## 5. Continuity map

| Objek | Lahir | Berpindah/berubah | Selesai | Catatan |
|---|---|---|---|---|
| Client phone | Act 1 (ping) di (110, 120) | Act 4: mengecil 0.6 dan redup 0.5 di tempat | Act 7 awal fade | Sumber trafik untuk Act 5 dan 6 |
| Server anchor | Act 1 converge | Hanya glow/badge/LED yang berubah | Tidak pernah dihapus | Continuity §1.O exception §3.1 |
| Web app card | Act 1 di (366, 90) | Act 1: dock ke anchor jadi `app tile` | Act 6 | Act 3: keluar ke process shelf lalu kembali |
| Empat mesin compute | Act 1 | Converge ke anchor | Act 1 | Callback kecil di closing Act 7 |
| Database tile | Act 3 | Act 4: morph jadi data vault | Act 6 | Handoff ada overlap |
| Data vault | Act 4 | Act 5 pindah ke (600, 720) dan redup | Act 6 | Sumber snapshot backup |
| Health LED | Act 5 (probe docks ke anchor) | Hijau/merah | Act 7 | Bukti kondisi untuk Act 6 |
| Runbook doc | Act 6 (hasil restore test) | Recall di pilar Documentation | Act 7 | |
| Skeleton jalur Act 2 | Act 2 awal | Menyala bertahap | Act 2 seam fade | Bukan objek persisten |

## 6. Storyboard detail per Act

Format waktu: detik relatif dari awal Act. Semua nilai tween tetap (bukan
kumulatif), state di-reset tiap loop, tidak ada `Math.random()` yang
memengaruhi timing.

### 6.1 Act 1 — Server adalah peran (14 s)

Pesan: server bukan bentuk hardware, melainkan peran yang menjawab permintaan.
Hook: pernyataan berlawanan intuisi, bukan pertanyaan ("Laptop pun bisa jadi
server").

| Waktu | Kejadian | Asal-usul | Caption/label (di objek) |
|---|---|---|---|
| 0.0 | Case Strip masuk | — | Kasus: aplikasi toko butuh tempat berjalan. |
| 0.3 | `web-app-card` `toko-web` muncul di (366, 90) | Sumber utama cerita | Satu aplikasi web. |
| 1.3–6.5 | Empat mesin masuk berurutan, jarak 1.4 s: laptop, VM, cloud instance, mini-PC, di baris y=330 (pusat x: 105, 279, 453, 627, lebar 150) | Naik dari y=380 dengan fade | Label nama di bawah icon |
| +0.7 tiap mesin | Salinan app card bergerak dari sumber ke mesin, mesin menyala, beacon `LISTEN` berputar | Salinan dari `web-app-card` (sumber tetap) | Laptop pun bisa jadi server. / Satu mesin, banyak server. / Mesin sewaan di cloud. / Server kecil di jaringan lokal. |
| 6.5 | Client phone muncul di (110, 120) | Slide dari kiri | Client mengirim permintaan. |
| 7.2–8.6 | Beam bercabang dari client ke empat mesin (0.7 s), balasan kembali (0.6 s), centang muncul di layar client | Pulse dari client | Semua mesin menjawab sama. |
| 8.8 | Badge `SERVER` muncul di atas tiap mesin berurutan 0.1 s | Dipicu balasan | — |
| 9.6 | Hold 0.8 | — | — |
| 10.4–12.0 | Empat mesin mengecil dan bergerak ke (366, 640) sambil `server-rack` anchor membesar 0.6→1 dengan overlap; app card ikut dock ke sisi anchor | Handoff, tidak ada teleport | Server adalah peran, bukan bentuk. |
| 12.6–14.0 | Hold, cliffhanger dekat client | — | Permintaan belum tahu jalurnya. |

Exit state: client di (110, 120), anchor di (366, 640) glow 0.3, app tile
menempel di anchor.

### 6.2 Act 2 — Permintaan masuk (24 s)

Pesan: akses adalah rantai (nama, DNS, IP, rute, port, service), bukan satu
alamat. Ini Act yang paling diperdetail.

| Waktu | Kejadian | Asal-usul | Caption/label |
|---|---|---|---|
| 0.0 | Case Strip masuk | — | Kasus: pelanggan membuka toko.example. |
| 0.4–1.6 | Skeleton jalur (garis putus redup) tergambar dari client ke anchor; cloud dan firewall muncul redup saat garis melewatinya; DNS muncul redup di lajur samping y=120 | Digambar dari client (aturan 3) | — |
| 1.6–3.2 | Address bar tampil di layar client; nama `toko.example` terisi bertahap tetap (12 huruf, langkah 0.08 s); chip `IP: belum diketahui` (garis putus) menempel di dekat client | Dipicu aksi pelanggan | Client hanya tahu nama. |
| 3.4 | Enter: paket permintaan (`GET /`, tujuan `toko.example`) lahir tetapi parkir redup di client | Lahir dari client | — |
| 3.7–5.3 | Query pulse cyan bergerak client → DNS di lajur atas (0.7 s) | Dari client | DNS ditanya alamat nama. |
| 5.3–6.2 | Buku DNS terbuka, satu baris record `toko.example → 203.0.113.10` menyala; hold 0.9 | Dipicu query tiba | — |
| 6.2–7.0 | Reply pulse DNS → client; chip IP terisi solid `203.0.113.10` | Dari DNS | Nama berubah jadi IP. |
| 7.8 | Paket parkir menyala dan berangkat | Setelah IP diketahui (tunda 4.4 s dari Enter dijustifikasi: paket tidak bisa berangkat tanpa IP) | — |
| 7.8–9.6 | Paket melewati cloud dan dua titik router (masing-masing berkedip); label port `443` menempel di paket | Bergerak di skeleton | Rute jaringan menuju IP. |
| 9.6–10.2 | Paket berhenti di firewall; rules card keluar dari sisi firewall dengan tiga baris: `443 web`, `22 ssh`, `3306 database` | Dipicu paket tiba | — |
| 10.2–11.4 | Garis scan menelusuri baris; `443 web` cocok (hijau, ALLOW), `22` dan `3306` tetap redup bergembok; palang gate terangkat | Dipicu pencocokan port | Port 443 cocok kebijakan. Lalu: Port lain tetap tertutup. |
| 11.75–12.5 | Paket masuk ke `listening-socket` di atas anchor | Melewati gate | — |
| 12.5–13.8 | Tiga pulse kecil client ⇄ server berlabel `SYN`, `SYN-ACK`, `ACK` | Dipicu paket docking | Koneksi dibentuk tiga langkah. |
| 13.8–15.2 | Garis koneksi solid terbentuk; socket berdenyut | Setelah ACK | Server menerima koneksi. |
| 15.2–16.4 | Hold 1.2 | — | — |
| 16.4–19.4 | Breadcrumb di zona closing menyala berurutan: nama → DNS → IP → rute → port 443 → service | Merangkum jalur yang baru dilalui | Akses adalah rantai, bukan alamat. |
| 19.4–22.0 | Hold; cliffhanger di dekat socket | — | Di balik pintu, proses menunggu. |
| 22.0–24.0 | DNS, cloud, firewall, rules card, skeleton, breadcrumb fade keluar; client, anchor, app tile bertahan | Seam | — |

Catatan teknis: HTTP `GET /`, TCP handshake, dan port 443 dipertahankan sebagai
label; TLS tidak digambar.

### 6.3 Act 3 — Service bekerja (18 s)

Pesan: pintu 443 terbuka karena ada proses yang dijaga service manager;
layanan perlu lifecycle, bukan hanya start sekali.

| Waktu | Kejadian | Asal-usul | Caption/label |
|---|---|---|---|
| 0.0 | Case Strip masuk | — | Kasus: aplikasi toko mati mendadak. |
| 0.4–1.6 | `service-manager` membuka dari atas anchor ke (366, 470), garis kendali ke anchor | Unfold dari anchor | Service manager menjaga proses. |
| 1.6–2.5 | App tile keluar dari anchor ke process shelf (366, 330) dengan status `stopped` redup; tile `database` muncul redup di (170, 330) | App tile dari anchor; database dimulai oleh manager | — |
| 2.0–3.6 | Manager memulai database lebih dulu (pulse 0.5 s), tile database hijau `running`; panah dependency tumbuh database → app | Pulse dari manager | Dependency dijalankan lebih dulu. |
| 3.6–4.6 | Manager memulai app (pulse 0.5 s), tile app hijau; garis tumbuh dari app ke `listening-socket` lalu socket menyala | Menjawab "siapa yang membuka pintu" dari Act 2 | Proses membuka pintu 443. |
| 4.6–6.6 | Bar CPU dan memory di bawah tile tumbuh ke nilai tetap dengan tanda batas | Dipicu proses berjalan | Resource dibatasi dan diawasi. |
| 6.9–10.2 | Client mengirim request, paket ke socket lalu ke app (0.9 s), CPU naik sedikit, respons kembali (0.9 s), layar client menampilkan halaman toko; hold 0.8 | Dari client | Halaman tampil di client. |
| 10.2–11.6 | Kasus: tile app merah dan bar turun ke 0, socket redup; request kedua ditolak di socket dan memantul | Dipicu proses mati | Proses mati, permintaan gagal. |
| 11.6–13.0 | Manager mendeteksi (scan pulse 0.4 s), panah restart melingkar 0.8 s dengan penghitung `restart 1`, tile hijau, socket menyala | Dari manager | Proses dihidupkan ulang otomatis. |
| 13.0–14.4 | Request ulang berhasil, halaman tampil | Dari client | Layanan kembali melayani. |
| 14.4–16.0 | Tiga chip di dekat manager menyala berurutan: `start`, `monitor`, `restart` | Merangkum siklus | Layanan butuh lifecycle. |
| 16.0–18.0 | Manager memudar, app tile turun kembali ke anchor, tile database bertahan | Seam | — |

### 6.4 Act 4 — Data dan identity (18 s)

Pesan: akses data harus disengaja. Tiga identitas meminta akses ke data yang
sama dan mendapat hasil berbeda menurut permission.

| Waktu | Kejadian | Asal-usul | Caption/label |
|---|---|---|---|
| 0.0 | Case Strip masuk; client mengecil dan redup | — | Kasus: aplikasi toko membaca data pesanan. |
| 0.2–1.0 | Tile database bergeser ke (590, 420) dan berubah jadi `data-vault` (overlap 0.5 s) | Handoff dari Act 3 | Data pesanan tersimpan di server. |
| 1.0–2.2 | Access gate (SVG, tertutup, bergembok) tumbuh dari sisi kiri vault di (450, 400) | Dari vault | Gate memeriksa identitas peminta. |
| 2.2–3.6 | Tiga kartu identitas masuk dari tepi kiri berurutan 0.4 s: `toko-web` (service account), `deploy` (user admin, tempel badge group `ops`), `guest` (garis putus, tak dikenal) | Slide dari tepi | Akun layanan / Admin / Tidak dikenal |
| 3.6–5.4 | Permission card membuka di bawah vault; tiga baris muncul 0.3 s: `toko-web rw-`, `ops r--`, `lainnya ---` | Unfold dari vault | Izin tiap identitas berbeda. |
| 5.4–8.1 | Kapsul `toko-web` ke gate (0.7 s), scan cocok baris 1, gembok terbuka, kapsul masuk vault, baris data menyala; hold 0.7 | Dari kartu identitas | Akun layanan boleh baca-tulis. |
| 8.1–11.1 | Kapsul `deploy` membawa `ssh-key`; gate cocok baris 2, vault terbuka sebagian; kapsul kedua berlabel `tulis` memantul (soft-deny) | Dari kartu identitas | Admin hanya boleh membaca. |
| 11.1–13.1 | Kapsul `guest` ke gate; tidak ada baris cocok, gate bergetar dan gembok tetap; kapsul memantul | Dari kartu identitas | Identitas asing ditolak. |
| 13.1–14.6 | Semua baris permission menyala, penanda "akses minimum" menyapu kartu | Merangkum | Akses diberi seperlunya saja. |
| 14.6–18.0 | Kartu identitas, gate, permission card fade; vault pindah ke (600, 720) dan redup 0.6 | Seam | — |

Catatan: fix bug lama; gate memiliki empat state eksplisit: `closed`,
`checking`, `granted`, `denied`. Tidak ada state yang merender penolakan saat
permintaan masih diperiksa.

### 6.5 Act 5 — Bukti kesehatan (16 s)

Pesan: status hijau tunggal tidak cukup; logs (kejadian), metrics (angka),
health check (uji berkala), dan alert (pemberitahuan) harus menyatu.

| Waktu | Kejadian | Asal-usul | Caption/label |
|---|---|---|---|
| 0.0 | Case Strip masuk | — | Kasus: pesanan melambat, penyebab belum jelas. |
| 0.4–3.4 | Client mengirim tiga request (0.6 s per putaran); tiap request menambah satu baris di `log-scroll` yang keluar dari sisi kiri anchor ke (120, 470); baris memuat waktu, status, path | Anchor menulis log | Tiap kejadian dicatat sebagai log. |
| 3.4–4.8 | Dashboard keluar dari atas anchor ke (366, 290); mula-mula hanya satu chip hijau `UP` | Unfold dari anchor | Status hijau saja belum cukup. |
| 4.8–6.4 | Tiga panel grafik terisi garis: latency, error rate, CPU (nilai tetap rendah) | Dipicu dashboard aktif | Metrics mengukur angka dari waktu. |
| 6.4–7.8 | `health-probe` muncul di (600, 470) dengan garis ke anchor; pulse `/health` pergi, jawaban `OK` kembali | Dari anchor | Health check menguji layanan berkala. |
| 7.8–10.6 | Client mengirim burst 6 pulse (0.8 s); latency dan CPU naik; baris log berwarna amber lalu merah (`500 /order`); error rate melonjak | Dari client | Latensi naik, error bertambah. |
| 10.6–11.8 | Probe berikutnya lambat/gagal; probe merah; chip `UP` menjadi `DEGRADED` | Dipicu lonjakan | Health check mulai gagal. |
| 11.8–13.6 | Grafik melewati garis threshold; `alert-bell` keluar dari titik threshold dan berguncang; notifikasi terbang ke slot `owner + runbook` | Dari titik threshold | Alert memberi tahu pemilik layanan. |
| 13.6–15.0 | Kursor waktu vertikal menyapu log, grafik, dan probe pada momen yang sama | Merangkum | Logs, metrics, dan alert menyatu. |
| 15.0–16.0 | Dashboard, log, bell fade; probe docks ke anchor menjadi LED kesehatan | Seam | — |

### 6.6 Act 6 — Perubahan dan pemulihan (20 s)

Pesan: operasi aman memikirkan kegagalan lebih dulu. Health LED dari Act 5
dipakai sebagai bukti untuk keputusan rollback.

| Waktu | Kejadian | Asal-usul | Caption/label |
|---|---|---|---|
| 0.0 | Case Strip masuk; app tile berlabel `v1` | — | Kasus: rilis versi baru bermasalah. |
| 0.4–2.2 | `staging-pad` muncul di (140, 330) dengan `release-package` berlabel `v2` | Dari sisi kiri | Versi baru diuji di staging. |
| 2.2–3.0 | Centang segel muncul di pad | Dipicu uji selesai | Lolos uji staging. |
| 3.0–5.0 | Paket v2 berjalan pad → anchor lewat jalur deploy oranye (1.0 s); app tile berganti `v1`→`v2`; badge `DEPLOYING` | Dari staging | Versi baru berjalan di production. |
| 5.0–6.6 | Client mengirim request, respons merah kembali; LED merah; badge `FAILED`; baris log merah | Dari client | Health check gagal setelah rilis. |
| 6.6–9.4 | Tumpukan rilis `v2 / v1` di (140, 430): penunjuk berpindah ke `v1`; paket v1 berjalan ke anchor (0.9 s); tile kembali `v1`; LED hijau; badge `ROLLBACK` lalu `STABLE`; hold 0.8 | Dari release stack | Rollback kembali ke versi stabil. |
| 9.4–11.8 | Kapsul snapshot bergerak dari vault (600, 720) lewat lajur bawah y≈770 ke `backup-vault` (130, 720) (2.0 s); vault utama tetap ada (salinan) | Dari vault | Backup disalin ke lokasi terpisah. |
| 11.8–13.6 | Backup vault berstatus garis putus "belum diuji"; hold 1.8 | — | Salinan ada, pemulihan belum terbukti. |
| 13.6–17.0 | `restore-cycle` menyalin snapshot ke area uji (366, 420); dua penghitung berdampingan `120 = 120` dibandingkan dengan vault utama; segel hijau muncul di backup | Dari backup vault | Restore diuji di area terpisah. Lalu: Uji restore membuktikan pemulihan. |
| 17.0–19.0 | `runbook-doc` keluar dari area uji dengan tiga centang | Hasil restore test | Langkah pemulihan dicatat di runbook. |
| 19.0–20.0 | Objek operasi fade; anchor, vault, LED bertahan | Seam | — |

### 6.7 Act 7 — Server posture (12 s)

Pesan: server adalah sistem yang dioperasikan; keempat sisi harus seimbang.
Setiap pilar memakai ikon bukti dari Act sebelumnya (bukan kotak kosong).

| Waktu | Kejadian | Asal-usul | Isi kartu |
|---|---|---|---|
| 0.0 | Case Strip masuk; client fade | — | Kasus: server toko diaudit sebelum ramai. |
| 0.6 | Kartu Security (merah) tumbuh dari anchor lewat garis (0.4 s), dua ikon bukti masuk | Dari anchor | `firewall-wall` + gate least-privilege; sub-label: firewall + least privilege |
| 2.5 | Kartu Reliability (hijau) | Dari anchor | `service-manager` + paket rollback; sub-label: lifecycle + rollback |
| 4.4 | Kartu Cost/Capacity (amber) | Dari anchor | `cpu-chip` + `monitor-dashboard`; sub-label: resource + metrics |
| 6.3 | Kartu Documentation (ungu) | Dari anchor | `runbook-doc` + `alert-bell`; sub-label: runbook + alert owner |
| 8.2–9.5 | Keempat garis berdenyut bersama; cincin tergambar mengelilingi anchor | Merangkum | Empat sisi harus seimbang. |
| 9.5–12.0 | Callback strip: empat ikon mesin Act 1 (skala 0.5) muncul di zona closing; hold 2.5 (penutup) | Menjawab hook Act 1 secara eksplisit | Laptop atau cloud, server dioperasikan. |

## 7. Content State Contract (delta)

### 7.1 Act 2 — menggantikan tabel lama di plan utama

| State | Yang penonton lihat | Yang belum boleh terlihat | Pemicu perubahan | Hasil |
|---|---|---|---|---|
| Client awal | Address bar berisi nama, chip `IP: belum diketahui`, paket parkir redup | IP asli, gate terbuka, koneksi | Enter ditekan | Paket lahir, menunggu alamat |
| Lookup DNS | Query pulse ke DNS, record `toko.example → 203.0.113.10` terbuka | IP di sisi client | Query tiba di DNS | Jawaban dibuat |
| Client tahu IP | Chip IP terisi solid | Paket sudah lewat gate | Reply tiba | Paket boleh berangkat |
| Transit rute | Paket melewati cloud dan dua router | Service menerima | Paket berangkat | Tiba di firewall |
| Edge | Rules card, scan port, baris 443 hijau | Socket menyala, koneksi | Port cocok kebijakan | Gate terbuka |
| Server | Socket menyala, tiga pulse handshake, garis koneksi solid | Halaman/respons | Paket docking ke socket | Koneksi terbentuk |

### 7.2 Act 3–6 (baru; sebelumnya "survei", sekarang punya state)

| Act | State awal | Belum boleh terlihat | Pemicu | Hasil |
|---|---|---|---|---|
| 3 | Manager idle, tile `stopped`, socket redup | Proses berjalan, pintu terbuka | Manager mengirim start | Dependency dulu, lalu app, lalu socket menyala |
| 3 | App `running` melayani request | Kegagalan | Proses mati | Socket redup, request memantul, manager restart, layanan pulih |
| 4 | Vault tertutup di balik gate | Data terbaca | Kapsul identitas tiba di gate | Grant sesuai baris permission atau deny |
| 5 | Log kosong, hanya `UP` | Grafik, alert | Request masuk, lonjakan trafik | Log terisi, grafik naik, probe gagal, alert |
| 6 | `v1` stabil, LED hijau | `v2` di production | Paket v2 tiba di anchor | Gagal, rollback, backup, restore test tervalidasi |

## 8. Causal Motion Contract — action utama (§1.T.1)

| Action id | Before | Pemicu/source | Jalur/process | Target & apply | After | Hold | SFX |
|---|---|---|---|---|---|---:|---|
| `copy-app-to-machine` (A1) | Mesin redup, `LISTEN` mati | App card | Salinan app card → mesin | Mesin menyala, beacon `LISTEN` | Mesin siap melayani | 0.3 s | pop / tick |
| `ping-all-machines` (A1) | Empat mesin diam | Client | Beam bercabang → mesin → balasan | Centang di client, badge `SERVER` | Peran tampak sama di semua bentuk | 0.8 s | whoosh / ding |
| `converge-to-server` (A1) | Empat mesin terpisah | Badge `SERVER` | Mesin bergerak ke (366, 640) | Anchor penuh, badge tunggal | Satu server anchor persisten | 1.4 s | swoosh / confirm |
| `dns-lookup` (A2) | `IP: belum diketahui` | Enter di client | Query pulse → DNS → reply | Chip IP terisi | Client tahu IP | 0.9 s | tick / chime |
| `connect-through-edge` (A2) | Paket parkir | IP diketahui | Client → cloud → 2 router → firewall | Paket berhenti di gate | Paket menunggu pemeriksaan port | 0.6 s | whoosh |
| `port-check` (A2) | Rules card 3 baris redup | Paket tiba di firewall | Garis scan tiap baris | Baris 443 hijau, palang gate naik | Gate terbuka, port lain tertutup | 0.35 s | unlock |
| `tcp-handshake` (A2) | Paket di socket | Paket docking | Tiga pulse client ⇄ server | Garis koneksi solid | Koneksi terbentuk | 1.2 s | tick, confirm |
| `start-dependency` (A3) | Semua tile `stopped` | Manager | Pulse ke database lalu app | Tile hijau, socket menyala | Layanan siap menerima | 1.0 s | tick / confirm |
| `crash-restart` (A3) | App `running` | Proses mati | Scan pulse manager → app, panah restart | Tile hijau kembali | Layanan pulih | 1.4 s | soft-deny / confirm |
| `least-privilege-gate` (A4) | Vault tertutup | Kapsul identitas | Kartu → gate → vault | Gembok buka / tetap | Grant sesuai izin atau deny | 0.9 s | key-turn, unlock / soft-deny, lock |
| `emit-log` (A5) | Log kosong | Request client | Anchor → log-scroll | Baris log baru | Bukti kejadian tersimpan | 0.3 s | tick |
| `metric-anomaly-alert` (A5) | Grafik rendah, probe hijau | Burst trafik | Grafik → threshold → bell → owner | Bell berguncang, notifikasi terkirim | Bukti menyatu, pemilik diberi tahu | 1.2 s | alert-pulse |
| `deploy-fail-rollback` (A6) | v1 stabil | Paket v2 | Staging → anchor; lalu v1 → anchor | Tile `v2`→`v1`, LED merah→hijau | Layanan stabil kembali | 0.8 s | whoosh, soft-deny / confirm |
| `backup-copy` (A6) | Vault utama saja | Snapshot | Vault → lajur bawah → backup vault | Backup terisi, status "belum diuji" | Salinan ada, belum terbukti | 1.8 s | swoosh / tick |
| `restore-test` (A6) | Backup belum diuji | Restore cycle | Backup → area uji, bandingkan `120 = 120` | Segel hijau | Pemulihan terbukti, runbook lahir | 1.0 s | confirm, complete |
| `posture-pillar` (A7) | Anchor sendiri | Garis dari anchor | Kartu tumbuh, ikon bukti masuk | Kartu penuh warna | Empat pilar seimbang | 0.7 s | pop2 / ding, complete |

Frame audit (wajib saat verifikasi): tiap action diperiksa pada frame before,
transit, dan after. Contoh `port-check`: A2 10.0 (rules card redup),
10.8 (scan di baris kedua), 11.5 (gate terbuka).

## 9. Icon dan asset plan (menjawab poin 2)

### 9.1 Keputusan

Keputusan lama "inline SVG saja, tanpa `icons/icons.json`" dibatalkan. Diganti
pendekatan hibrid:

- **PNG dari ChatGPT** untuk objek yang dikenali penonton dan tidak punya
  animasi internal: 28 icon dalam 4 batch grid 2×4 (7 icon + 1 slot kosong per
  batch). Definisi lengkap ada di Lampiran A.
- **Inline SVG** untuk elemen dengan gerak/state internal atau teks dinamis:
  paket permintaan, pulse, palang gate dan gembok, bar CPU/memory, garis
  grafik, heartbeat probe, LED, segel centang, badge role, konektor, cincin
  posture, address bar dan layar client, isi log/record/permission (semua teks).
- Tidak ada logo brand pihak ketiga, maskot, atau wajah/ekspresi pada icon.
  Tidak ada teks, huruf, atau angka di dalam PNG; semua label dirender oleh SVG.

### 9.2 Asset State Matrix

| Objek | State | Cara dibuat | Catatan |
|---|---|---|---|
| Server anchor | idle, busy, deploying, failed, stable | 1 PNG `server-rack` + overlay SVG (LED, glow, badge) | Tidak ada PNG per state |
| Client phone | mengetik, menunggu, halaman tampil | 1 PNG `client-phone` dengan layar kosong + overlay SVG | Area layar didefinisikan saat integrasi |
| Access gate | closed, checking, granted, denied | Inline SVG penuh | Ada gerak buka/tutup |
| Firewall | port diperiksa, gate terbuka | PNG `firewall-wall` + palang SVG | |
| Dashboard | UP, DEGRADED | PNG `monitor-dashboard` berpanel kosong + grafik SVG | |
| Backup vault | belum diuji, teruji | PNG `backup-vault` + segel SVG | |
| Log scroll | kosong, berisi, merah | PNG `log-scroll` + baris SVG | |

### 9.3 Fallback

`icons/loader.js` memetakan id ke file. Bila PNG belum ada, `getIcon(id)`
mengembalikan `null` dan komponen menggambar bentuk SVG sederhana (mirip
komponen sekarang) sehingga build tidak pernah crash. Loader tidak boleh
mengimpor file yang belum ada (menghindari error Vite; ikuti pola
`src/content/11-tailscale/icons/loader.js`). `icons/default-icon.png` dipakai
sebagai placeholder tunggal.

### 9.4 Alur generate

1. Salin Lampiran A menjadi `icons/icons.json` (setelah revisi disetujui).
2. Jalankan extension `vm-icon-generator` di ChatGPT web untuk 4 batch; hasil PNG masuk ke `icons/`.
3. Ukuran output ChatGPT tidak dipatok piksel; minta rasio landscape 2:1 dan crop per sel.
4. Periksa tiap icon: siluet tegas, terbaca pada background `#070913`, tidak ada teks/wajah/logo.
5. Regenerate hanya batch yang gagal (bukan satu per satu).

## 10. Copy layar dan SFX

### 10.1 Copy

Seluruh caption sudah tertulis di tabel storyboard (Bagian 6) dan memenuhi
aturan: pernyataan, ≤5 kata, tanpa emoji, tanpa kata ganti orang. Saat
eksekusi, `data.js` menampung semuanya dalam objek `BEATS` per Act (menggantikan
`ACTx_BEATS` dan `COPY` lama) sehingga tidak ada field yang tidak dirender.

Audit otomatis setelah eksekusi (di luar `caption.md`):

- Tidak ada `?` pada string caption.
- Tidak ada emoji.
- Tidak ada kata ganti orang (`kamu`, `aku`, `kita`, `lo`, `gue`, akhiran `-mu`/`-ku`).
- Tidak ada `fontSize` di bawah 11.

### 10.2 SFX (semua sudah ada di `SFX_MAP`, tidak butuh aset audio baru)

| Peristiwa | SFX |
|---|---|
| Objek lahir/muncul | `POP`, `POP2` (bukti Act 7) |
| Highlight/langkah kecil | `TICK` |
| Perjalanan paket/handoff | `WHOOSH`, `SWOOSH` (converge Act 1, jalur bawah backup) |
| DNS reply | `CHIME` |
| Gate terbuka / gembok buka | `UNLOCK`; kunci berputar `KEY_TURN` |
| Gate menolak | `SOFT_DENY`; gembok tertutup `LOCK` |
| Alert | `ALERT_PULSE` |
| Hasil berhasil | `CONFIRM`, `DING`, `COMPLETE` |
| Intro | `SHIMMER` |

`TELEPORT` tidak dipakai (bertentangan dengan aturan tanpa lompat); dihapus dari
`SFX_MAP` saat eksekusi kecuali ada alasan tertulis. `sfx: false` hanya untuk
pergerakan yang benar-benar senyap, wajib berikut alasan. Timing detik per SFX
diambil dari timeline nyata untuk `SFX_SCHEDULES` di `scripts/export-lib.js`
setelah durasi final diukur.

## 11. Dampak pada file saat eksekusi disetujui

| File | Rencana, belum dikerjakan |
|---|---|
| `data.js` | Update `PHASES` (durasi baru), tambah `CASES`, `BEATS`, konstanta stasiun (`BODY_CENTER_X = 366`, posisi Bagian 4.3), `ICON_IDS`; hapus `COPY` lama dan `ACTx_BEATS`; sinkronkan `COMPUTE_FORMS` dengan `iconId`; bersihkan `SFX_MAP` |
| `Animation.jsx` | Hapus `CaptionBar`, `ChipRow`, `FlowNode`, `GateBadge` (versi lama), `PostureWheel`; tambah `CaseStrip`, `IconCaption`, `PathLabel`, `PacketCapsule`, `AccessGate` (4 state), `ResourceBars`, `MetricPanel`, `PostureCard`; timeline ditulis ulang per Act dengan time cursor dan reset deterministik |
| `icons/` | `icons.json` (Lampiran A), `loader.js`, `default-icon.png`, 28 PNG hasil generate |
| `manifest.js`, `metadata.json` | Tidak berubah kecuali tag; `status` tetap `draft` sampai export test lulus |
| `_docs/LINUX_SERVER_PLAN.md` | Sinkronkan storyboard, state contract Act 2, layout map, keputusan icon, checklist |
| `caption.md` | Ditulis ulang mengikuti kasus toko |
| `scripts/export-lib.js` | `SFX_SCHEDULES` untuk topic ini |

Dokumen ini hanya plan. Tidak ada file implementasi, aset, atau konfigurasi
yang diubah.

## 12. Validation gate dan acceptance criteria

- [ ] Tidak ada objek yang muncul tanpa asal-usul (Bagian 3.3); tiap Act punya Case Strip.
- [ ] Tidak ada `ChipRow`, `CaptionBar`, atau `say()` di `Animation.jsx`.
- [ ] Setiap Act memiliki hasil belajar yang dapat dinyatakan dalam satu kalimat dan menjawab kasusnya.
- [ ] DNS digambar sebagai lookup samping; paket tidak melewati DNS.
- [ ] Gate memiliki state `closed`, `checking`, `granted`, `denied` tanpa flash penolakan palsu.
- [ ] 28 PNG hadir, tanpa teks/logo/wajah; fallback SVG tetap jalan saat PNG dihapus.
- [ ] Semua koordinat memakai pusat 366; tidak ada elemen terpotong `clip`; gap ≥20 antar objek.
- [ ] Tidak ada caption berbentuk pertanyaan; semua ≤5 kata; font ≥11.
- [ ] Tidak ada command runnable, kredensial, IP/domain nyata (hanya `toko.example` dan `203.0.113.10`).
- [ ] Hook Act 1 dijawab eksplisit di penutup Act 7.
- [ ] Reset state deterministik tiap loop; tidak ada `Math.random()` yang memengaruhi timing.
- [ ] Durasi Act diukur ulang dan `PHASES` diperbarui; `SFX_SCHEDULES` disambungkan.
- [ ] Dead field audit `data.js` vs `Animation.jsx` bersih.

## 13. Checklist eksekusi (numbering hierarki)

Semua item berstatus `Draft`; tidak ada yang dikerjakan.

- [ ] 1. Persetujuan
  - [ ] 1.1. Review dan setujui revisi ini
  - [ ] 1.2. Putuskan default satu video (122 s) atau pecah 91a/91b
- [ ] 2. Data dan icon planning
  - [ ] 2.1. Buat `icons/icons.json` dari Lampiran A
  - [ ] 2.2. Buat `icons/default-icon.png` dan `icons/loader.js` tanpa import file yang belum ada
  - [ ] 2.3. Update `data.js`: `PHASES`, `CASES`, `BEATS`, konstanta stasiun, `ICON_IDS`, bersihkan `SFX_MAP`
  - [ ] 2.4. Compile check
- [ ] 3. Generate icon
  - [ ] 3.1. Batch 1: actor inti
  - [ ] 3.2. Batch 2: jalur masuk dan service
  - [ ] 3.3. Batch 3: identity, data, bukti
  - [ ] 3.4. Batch 4: operasi, kapasitas, pemulihan
  - [ ] 3.5. Review visual tiap icon, regenerate batch yang gagal
  - [ ] 3.6. Isi `loader.js` dengan import statis setelah file fisik ada
- [ ] 4. Animation.jsx
  - [ ] 4.1. Komponen dasar (`CaseStrip`, `IconCaption`, `PathLabel`, `PacketCapsule`, `AccessGate`, dst.)
  - [ ] 4.2. Act 1
  - [ ] 4.3. Act 2
  - [ ] 4.4. Act 3
  - [ ] 4.5. Act 4
  - [ ] 4.6. Act 5
  - [ ] 4.7. Act 6
  - [ ] 4.8. Act 7
  - [ ] 4.9. Compile check tiap Act
- [ ] 5. Verifikasi
  - [ ] 5.1. Preview manual, frame audit before/transit/after tiap action
  - [ ] 5.2. Ukur ulang durasi Act, update `PHASES`
  - [ ] 5.3. Sambungkan `SFX_SCHEDULES`
  - [ ] 5.4. Audit copy (Bagian 10.1) dan dead field
  - [ ] 5.5. Export MP4 test
- [ ] 6. Dokumen
  - [ ] 6.1. Tulis ulang `caption.md`
  - [ ] 6.2. Sinkronkan `_docs/LINUX_SERVER_PLAN.md`
  - [ ] 6.3. Update status di `revisi/README.md`
  - [ ] 6.4. Checklist Sebelum Commit (03) dan checklist kontrak folder (02 §7)

## 14. Status test (kontrak revisi)

| Item | Status |
|---|---|
| Compile check | Belum (plan only) |
| Preview manual | Belum |
| Export test | Belum |
| Temuan di Bagian 2 | Berasal dari pembacaan kode, belum diverifikasi visual |
| Durasi 122 s | Estimasi, belum diukur |

## Lampiran A — Draft `icons/icons.json` (belum dibuat sebagai file)

Disalin ke `src/content/91-linux-server/icons/icons.json` saat eksekusi
disetujui (checklist 2.1). Warna mengikuti `COLORS` di `data.js`. Slot 8 tiap
batch sengaja kosong sebagai pemisah crop.

```json
{
  "name": "linux-server",
  "description": "Icon set untuk 91-linux-server sesuai revisi/2026-09-19-revisi-01-flow-kausal-icon-chatgpt.md. 28 icon PNG generik (AI-generated, tanpa logo brand, tanpa maskot, tanpa wajah, tanpa teks) dalam 4 batch grid 2x4. Elemen dengan gerak/state internal dan semua teks dinamis dirender sebagai inline SVG di Animation.jsx.",
  "style": {
    "look": "flat design, siluet tebal, garis luar terang, tanpa gradient, terbaca di background navy gelap #070913",
    "view": "tampak depan datar, tanpa perspektif",
    "forbidden": ["teks/huruf/angka di dalam icon", "logo brand", "maskot", "wajah atau ekspresi", "fill hitam", "gradient"]
  },
  "batches": [
    {
      "batch_id": "batch-1",
      "name": "Actor inti: client, server, bentuk compute (Act 1-2)",
      "rows": 2,
      "cols": 4,
      "icons": [
        { "id": "client-phone", "category": "structural", "color": "#38BDF8", "name": "Client Phone", "label": "Client", "description": "Smartphone tampak depan, layar kosong gelap", "usage": "Client persisten Act 1-6; layar diisi overlay SVG (address bar, halaman)" },
        { "id": "server-rack", "category": "structural", "color": "#FBBF24", "name": "Server Rack", "label": "Server", "description": "Unit server rack dengan tiga bay drive dan LED mati", "usage": "Server anchor persisten Act 1-7; LED dan glow dari overlay SVG" },
        { "id": "laptop-machine", "category": "structural", "color": "#38BDF8", "name": "Laptop", "label": "Laptop sebagai server", "description": "Laptop terbuka tampak depan, layar kosong", "usage": "Bentuk compute Act 1" },
        { "id": "vm-partition", "category": "structural", "color": "#A78BFA", "name": "Virtual Machine", "label": "Virtual machine", "description": "Satu kotak server besar terbagi tiga kompartemen kecil menyala", "usage": "Bentuk compute Act 1" },
        { "id": "cloud-instance", "category": "structural", "color": "#22D3EE", "name": "Cloud Instance", "label": "Cloud instance", "description": "Awan berisi satu blok server kecil", "usage": "Bentuk compute Act 1" },
        { "id": "mini-pc", "category": "structural", "color": "#FB923C", "name": "Mini PC", "label": "Mini-PC / edge", "description": "Komputer mini kompak dengan tombol power kecil", "usage": "Bentuk compute Act 1" },
        { "id": "web-app-card", "category": "structural", "color": "#34D399", "name": "Web App", "label": "Aplikasi toko-web", "description": "Jendela aplikasi dengan title bar dan tiga blok konten abstrak", "usage": "Aplikasi sumber Act 1; app tile Act 1-6" }
      ],
      "prompt": "Generate a 2x4 grid of flat-design icons on a transparent PNG background, landscape 2:1 aspect ratio, numbered left to right, top to bottom, each icon centered in its own cell with generous padding: 1 front-facing smartphone with a blank dark screen; 2 rack server unit with three drive bays and unlit indicator lights; 3 open laptop, front view, blank screen; 4 one large server box divided internally into three small glowing compartments; 5 cloud shape containing one small server block; 6 compact mini desktop computer with a tiny power button; 7 application window with a title bar and three abstract content blocks; 8 [EMPTY - leave this slot blank and transparent].\nColors per icon: 1 #38BDF8, 2 #FBBF24, 3 #38BDF8, 4 #A78BFA, 5 #22D3EE, 6 #FB923C, 7 #34D399.\nBold consistent silhouette and line weight, bright light outlines readable on a dark navy background. No text, letters, numbers, logos, mascots, faces, gradients, or black fills. Front view, no perspective."
    },
    {
      "batch_id": "batch-2",
      "name": "Jalur masuk dan service (Act 2-3)",
      "rows": 2,
      "cols": 4,
      "icons": [
        { "id": "dns-book", "category": "structural", "color": "#22D3EE", "name": "DNS Book", "label": "DNS", "description": "Buku direktori dengan dua baris entri abstrak", "usage": "Lookup DNS Act 2; baris record diisi overlay SVG" },
        { "id": "internet-cloud", "category": "structural", "color": "#94A3B8", "name": "Internet Cloud", "label": "Internet", "description": "Awan jaringan dengan tiga node terhubung", "usage": "Rute jaringan Act 2" },
        { "id": "router-hop", "category": "accent", "color": "#94A3B8", "name": "Router Hop", "label": "Router / hop", "description": "Router kecil dengan dua antena dan tiga port", "usage": "Dua titik hop rute Act 2" },
        { "id": "firewall-wall", "category": "structural", "color": "#FB923C", "name": "Firewall Wall", "label": "Firewall / edge", "description": "Segmen tembok bata dengan celah pintu di tengah dan perisai kecil di atas", "usage": "Gate edge Act 2; palang buka/tutup dari overlay SVG" },
        { "id": "listening-socket", "category": "accent", "color": "#FBBF24", "name": "Listening Socket", "label": "Port 443 listen", "description": "Jack port jaringan dalam pelat persegi membulat", "usage": "Pintu masuk di anchor Act 2-3" },
        { "id": "service-manager", "category": "structural", "color": "#FBBF24", "name": "Service Manager", "label": "Service manager", "description": "Panel kontrol dengan tiga baris toggle dan roda gigi di atas", "usage": "Manager Act 3" },
        { "id": "dependency-chain", "category": "accent", "color": "#A78BFA", "name": "Dependency Chain", "label": "Dependency", "description": "Tiga node membulat terhubung panah kiri ke kanan", "usage": "Urutan start Act 3" }
      ],
      "prompt": "Generate a 2x4 grid of flat-design generic network and service icons on a transparent PNG background, landscape 2:1 aspect ratio, numbered left to right, top to bottom, each icon centered in its own cell with generous padding: 1 address directory book with two abstract entry lines; 2 network cloud with three small connected nodes; 3 small router with two antennas and three ports; 4 brick wall segment with a doorway opening in the middle and a small shield on top; 5 network port jack inside a rounded square plate; 6 control panel with three toggle rows and a gear on top; 7 three rounded nodes linked in a chain by left-to-right arrows; 8 [EMPTY - leave this slot blank and transparent].\nColors per icon: 1 #22D3EE, 2 #94A3B8, 3 #94A3B8, 4 #FB923C, 5 #FBBF24, 6 #FBBF24, 7 #A78BFA.\nBold consistent silhouette and line weight, bright light outlines readable on a dark navy background. No text, letters, numbers, logos, faces, gradients, or black fills. Front view, no perspective."
    },
    {
      "batch_id": "batch-3",
      "name": "Identity, data, dan bukti (Act 4-5)",
      "rows": 2,
      "cols": 4,
      "icons": [
        { "id": "user-badge", "category": "structural", "color": "#A78BFA", "name": "User Badge", "label": "User", "description": "Siluet setengah badan tanpa wajah di dalam lencana bundar", "usage": "Admin dan guest Act 4" },
        { "id": "user-group", "category": "accent", "color": "#A78BFA", "name": "User Group", "label": "Group", "description": "Tiga siluet tanpa wajah saling menumpuk", "usage": "Badge group `ops` Act 4" },
        { "id": "service-account", "category": "structural", "color": "#A78BFA", "name": "Service Account", "label": "Service account", "description": "Lencana ID persegi dengan roda gigi menggantikan siluet", "usage": "Identitas toko-web Act 4" },
        { "id": "data-vault", "category": "structural", "color": "#34D399", "name": "Data Vault", "label": "Data pesanan", "description": "Silinder database di dalam bingkai brankas persegi membulat", "usage": "Data Act 4-6" },
        { "id": "ssh-key", "category": "accent", "color": "#FBBF24", "name": "SSH Key", "label": "SSH key", "description": "Kunci klasik dengan pola sirkuit digital di kepalanya", "usage": "Kredensial admin Act 4" },
        { "id": "log-scroll", "category": "structural", "color": "#F472B6", "name": "Log Scroll", "label": "Logs", "description": "Gulungan kertas vertikal dengan enam garis abstrak", "usage": "Logs Act 5; baris teks dari overlay SVG" },
        { "id": "alert-bell", "category": "accent", "color": "#F87171", "name": "Alert Bell", "label": "Alert", "description": "Lonceng notifikasi dengan titik kecil di sudut", "usage": "Alert Act 5, pilar Documentation Act 7" }
      ],
      "prompt": "Generate a 2x4 grid of flat-design generic identity, data and monitoring icons on a transparent PNG background, landscape 2:1 aspect ratio, numbered left to right, top to bottom, each icon centered in its own cell with generous padding: 1 faceless person bust silhouette inside a round badge; 2 three overlapping faceless person silhouettes; 3 square ID badge with a gear in place of a person; 4 database cylinder inside a rounded square vault frame; 5 classic key with a small digital circuit pattern on the bow; 6 vertical paper scroll with six abstract horizontal dashes; 7 notification bell with a small dot at the corner; 8 [EMPTY - leave this slot blank and transparent].\nColors per icon: 1 #A78BFA, 2 #A78BFA, 3 #A78BFA, 4 #34D399, 5 #FBBF24, 6 #F472B6, 7 #F87171.\nBold consistent silhouette and line weight, bright light outlines readable on a dark navy background. No text, letters, numbers, logos, facial features, gradients, or black fills. Front view, no perspective."
    },
    {
      "batch_id": "batch-4",
      "name": "Operasi, kapasitas, dan pemulihan (Act 3, 5-7)",
      "rows": 2,
      "cols": 4,
      "icons": [
        { "id": "monitor-dashboard", "category": "structural", "color": "#F472B6", "name": "Monitor Dashboard", "label": "Metrics dashboard", "description": "Monitor lebar dengan tiga slot panel kosong", "usage": "Dashboard Act 5; grafik dari overlay SVG; recall Act 7" },
        { "id": "release-package", "category": "structural", "color": "#FB923C", "name": "Release Package", "label": "Rilis", "description": "Kotak paket dengan panah kecil di sisi dan strip label kosong", "usage": "Versi v2/v1 Act 6" },
        { "id": "staging-pad", "category": "structural", "color": "#94A3B8", "name": "Staging Pad", "label": "Staging", "description": "Landasan datar dengan garis luar putus-putus untuk uji coba", "usage": "Staging Act 6" },
        { "id": "backup-vault", "category": "structural", "color": "#34D399", "name": "Backup Vault", "label": "Backup", "description": "Tiga cakram bertumpuk dalam kotak tertutup dengan jam kecil", "usage": "Backup Act 6" },
        { "id": "restore-cycle", "category": "accent", "color": "#38BDF8", "name": "Restore Cycle", "label": "Restore", "description": "Panah melingkar berlawanan arah jarum jam mengelilingi dokumen kecil", "usage": "Restore test Act 6" },
        { "id": "runbook-doc", "category": "structural", "color": "#A78BFA", "name": "Runbook", "label": "Runbook", "description": "Dokumen checklist dengan tiga baris centang abstrak", "usage": "Runbook Act 6; pilar Documentation Act 7" },
        { "id": "cpu-chip", "category": "accent", "color": "#FBBF24", "name": "CPU Chip", "label": "CPU / capacity", "description": "Chip persegi dengan pin di keempat sisi", "usage": "Resource Act 3; pilar Cost/Capacity Act 7" }
      ],
      "prompt": "Generate a 2x4 grid of flat-design generic operations and recovery icons on a transparent PNG background, landscape 2:1 aspect ratio, numbered left to right, top to bottom, each icon centered in its own cell with generous padding: 1 wide monitor with three blank rectangular panel slots; 2 shipping package box with a small arrow on its side and a blank label strip; 3 flat test platform with a dotted outline; 4 three stacked disks inside a sealed box with a small clock symbol; 5 circular counter-clockwise arrow around a small document; 6 checklist document with three abstract check rows; 7 square CPU chip with pins on all four sides; 8 [EMPTY - leave this slot blank and transparent].\nColors per icon: 1 #F472B6, 2 #FB923C, 3 #94A3B8, 4 #34D399, 5 #38BDF8, 6 #A78BFA, 7 #FBBF24.\nBold consistent silhouette and line weight, bright light outlines readable on a dark navy background. No text, letters, numbers, logos, faces, gradients, or black fills. Front view, no perspective."
    }
  ],
  "inline_svg_only": [
    "request-packet", "query-pulse", "router-hop-dot", "access-gate (closed/checking/granted/denied)", "padlock",
    "resource-bars", "metric-graph-lines", "health-probe-heartbeat", "status-LED", "seal-check",
    "role-badge", "connector-lines", "posture-ring", "address-bar", "case-strip"
  ],
  "generation": {
    "api_endpoint": "http://localhost:3373/api/icons/generate",
    "output_path": "src/content/91-linux-server/icons"
  },
  "next_steps": [
    "1. Setelah revisi disetujui, salin blok ini menjadi icons/icons.json.",
    "2. Jalankan extension vm-icon-generator di ChatGPT web untuk batch-1 sampai batch-4 (28 icon), hasil PNG masuk ke icons/.",
    "3. Setelah file fisik ada, isi loader.js dengan static import + ICONS map (pola 11-tailscale); jangan import file yang belum ada.",
    "4. Wire ke Animation.jsx sesuai kolom usage; pasang fallback SVG bila getIcon(id) null.",
    "5. Preview semua state termasuk fallback sebelum dianggap selesai."
  ]
}
```
