### Tujuan yang Harus Terlihat

User membuktikan identitas, kemudian policy server memutuskan **hak** yang berbeda. Jangan menampilkan daftar password/key/certificate/MFA serta daftar Full Shell/SFTP/Restricted sebagai card grid.

### Case: Akun Deploy Terbatas

| Beat | Before → intent → travel → apply → after |
|---|---|
| Identity | User identity card `deploy-bot` membawa public-key proof token melalui encrypted channel ke sshd. Password/key/certificate/MFA boleh muncul sebagai label alternatif kecil di luar path utama, bukan urutan item. |
| Authenticate | Proof token masuk verifier ring → signature cocok → identity card mendapat badge `verified user`. Server belum memberi shell. |
| Authorize | Verified identity bergerak ke policy gate bertuliskan `deploy policy` → gate membaca scope token `release only` → gate memilih lane restricted task. |
| Apply | Restricted task node menyala; full shell node tetap redup dan SFTP-only node tidak dipilih. |
| After | Satu task receipt kembali ke client; audiens melihat “berhasil membuktikan identitas” tidak otomatis berarti shell penuh. |

Copy maksimum: `Login dan hak akses berbeda.`

## Act 3 — Satu Kanal Membawa Shell, Command, dan File

### Tujuan yang Harus Terlihat

SSH channel adalah transport terenkripsi. Payload yang dibawa menentukan mode: interaksi shell, satu remote task, atau file transfer. Jangan tampilkan chip row “mode kanal” dan “mekanisme transfer”.

### Case Berurutan: Inspect lalu Kirim Artefak

| Beat | Before → intent → travel → apply → after |
|---|---|
| Remote shell | Client terminal mengirim command capsule `uptime` melalui channel → capsule tiba di remote shell prompt → remote host membuat output health singkat → output kembali ke terminal client dengan host badge `server`. |
| Remote task | Shell prompt menyusut menjadi task capsule `check-service` tanpa terminal interaktif → capsule pergi dan mengembalikan status token. | 
| File transfer | File tile `release.tar` lahir di sisi client → berubah menjadi sealed file capsule → melewati channel → mendarat pada remote file tray. File tray baru terisi saat capsule tiba. |
| After | Channel tetap sama, tetapi payload memiliki bentuk berbeda: command capsule, task receipt, file capsule. |

SCP/SFTP/rsync/SSHFS hanya boleh menjadi label kecil “contoh transfer” pada file tray. Tidak perlu mengajar semua mekanisme dalam satu Act.

Copy maksimum: `Kanal sama dapat membawa data berbeda.`

## Act 4 — Jangkau Layanan Privat dengan Jalur yang Jelas

### Tujuan yang Harus Terlihat

Forwarding tidak boleh digambar sebagai empat card mode. Audiens harus melihat listener berada di mana dan traffic berakhir di mana.

### Case: Aplikasi Lokal Menuju Database Privat

| Beat | Before → intent → travel → apply → after |
|---|---|
| Before | Local app di client ingin mengakses database yang hanya terlihat dari jaringan server. Database node dan port private berada di belakang server; tidak ada route langsung dari client. |
| Local listener | Local-only listener ring lahir di client, dengan label pendek `localhost`. Ring tidak meluas ke jaringan publik. |
| Travel | App packet masuk listener lokal → capsule masuk encrypted SSH tunnel → keluar di sisi server → bergerak ke private database node. |
| Apply | Database node menerima query capsule dan mengirim result capsule kembali melalui jalur yang sama. |
| After | Local app menerima result; line direct client → database tetap putus/redup, membuktikan channel menentukan jalur. |

### Bastion sebagai Lanjutan Singkat

Setelah case utama, server target digeser ke private zone dan bastion node muncul di tengah. **Packet yang sama** bergerak client → bastion → target; trusted identity marker tetap pada target. Tidak ada chain box statis dan tidak ada klaim bastion menghilangkan kebutuhan memverifikasi host akhir.

Label ringkas: `Listener dan tujuan menentukan arah.`

## Act 5 — Akses Aman Memerlukan Siklus Hidup dan Bukti

### Tujuan yang Harus Terlihat

Key, policy, logging, dan response incident bukan empat dashboard card. Mereka adalah lifecycle akses: key valid dipakai, koneksi dicatat, key dicabut, dan akses berikutnya dihentikan.

### Case: Key Dicabut Saat Akses Tidak Lagi Diperlukan

| Beat | Before → intent → travel → apply → after |
|---|---|
| Valid access | Identity key card `deploy-key` berstatus aktif; connection event melintas ke sshd dan satu log event masuk audit timeline. |
| Lifecycle event | Owner/expiry signal mencapai key registry → key berubah dari active menjadi revoked melalui handoff, bukan hilang mendadak. |
| Next attempt | Connection baru membawa identity yang sama menuju server → verifier menemukan status revoked → policy gate menutup. |
| Apply | Request berhenti pada gate, restricted task tidak menyala; deny event masuk audit timeline dan alert dot muncul. |
| After | Timeline menunjukkan allow event lama dan deny event baru; key lifecycle, policy, log, serta response terlihat sebagai satu sebab-akibat. |

Copy maksimum: `Akses perlu dapat dicabut dan diaudit.`

## Perubahan Implementasi yang Direncanakan

| Area sekarang | Pengganti |
|---|---|
| `identityRow` dan `gatePanel` | Identity card, proof token, verifier ring, policy gate, dan tiga outcome node yang hanya satu dipilih. |
| `channelRow`, `shellPrompt`, `fileRow` | Satu channel dengan command/task/file capsules yang memiliki motion dan handoff berbeda. |
| `forwardGrid` dan `bastionChain` | Local listener → tunnel → private database flow; lalu packet menerus ke bastion → target flow. |
| `opsGrid` | Key registry, audit timeline, revoke handoff, deny gate, dan alert dot. |
| Narration text panjang | Satu copy pendek per payoff, ditempel dekat state akhir. |

## State, Layout, Asset, Timeline, dan Audio

| Area | Rencana revisi |
|---|---|
| State | Tambah identity proof, verified user, selected scope, channel payload type, local listener, query/result, key lifecycle, audit events, deny result. Reset lengkap tiap loop. |
| Layout | Client atas; channel di tengah; sshd/policy di bawah; private DB/bastion hanya muncul pada Act 4; audit timeline Act 5 memakai zone bawah tanpa menabrak server anchor. |
| Asset | Inline SVG seluruhnya: identity card, proof token, verifier, policy gate, command/task/file capsule, local listener, DB node, key registry, audit event, alert dot. Tidak perlu PNG/AI baru. |
| Timeline | Semua action memakai before → intent → travel → apply → after. Handoff source/target overlap minimal satu frame. Tidak ada payload teleport atau target yang muncul setelah packet menghilang. |
| Audio | Verification: tick/confirm; authz: gate/confirm; channel payload: typing/whoosh/arrive; forwarding: connector/whoosh; revoke: warning/lock. Audit SFX_MAP dan export schedule saat implementasi. |

## Checklist Tindak Lanjut

- [ ] Sinkronkan `SSH_PLAN.md`, `data.js`, dan `Animation.jsx` dengan storyboard visual ini sebelum coding.
- [ ] Ganti seluruh highlight-only loop untuk Act 2–5 dengan state/action di atas.
- [ ] Pertahankan client, server, trust badge, dan channel sebagai anchor; jangan reset canvas antar Act.
- [ ] Preview before, transit, apply, dan after pada host trust, authz, each payload type, forwarding, bastion, revoke, dan deny.
- [ ] Audit safe-zone, collision, loop reset, SFX coverage, compile, preview, dan export.

## Status Tes

| Pemeriksaan | Status |
|---|---|
| Static audit | Selesai untuk revision plan ini |
| Eksekusi kode | ✅ Selesai — `data.js` (ACT2_CASE..ACT5_CASE) dan `Animation.jsx` ditulis ulang total untuk Act 2–5; Act 1 tidak diubah |
| Compile | ✅ `esbuild` exit 0 untuk `data.js` dan `Animation.jsx`; semua named export yang diimpor terverifikasi ada |
| Preview manual | Belum dijalankan — perlu cek posisi absolut (NEAR_CLIENT/MID/NEAR_SERVER, y=300/500/740) tidak bertabrakan dengan anchor client/server, dan durasi tiap beat |
| Export | Belum dijalankan |

## Catatan implementasi tambahan (di luar isi plan asli)

- Helper baru `appear()` dan `travel()` ditambahkan di `Animation.jsx` — keduanya bekerja dengan **koordinat absolut** (bukan delta seperti `popIn` Act 1), dirender lewat `A(id) = T(id, 0, 0)`. `popIn`/`popOut`/`T(id,cx,cy)` tetap dipakai apa adanya untuk anchor Act 1.
- Caption penutup keseluruhan (`CLOSING_CAPTION` — "Enkripsi penting, verifikasi dan policy juga") tetap ditampilkan sebagai beat `ops-closing` SETELAH punchline kasus Act 5 (`ACT5_CASE.copy.after`), bukan menggantikannya — plan tidak menyebut ini dihapus.
- SFX untuk `revoke` dipakai `sfxLoader.play('warnings', ...)` langsung (bukan `sfxLoader.warning(...)`) karena keberadaan method convenience tersebut tidak terverifikasi dalam sesi ini.

