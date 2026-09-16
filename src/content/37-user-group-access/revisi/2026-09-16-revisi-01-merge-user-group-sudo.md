# Revisi-01 — Merge Content 37 + 38: User, Group, dan Izin Admin

| Item | Nilai |
|---|---|
| Content survivor | 37 — User, Group, and Access |
| Content yang digabung | 38 — sudo |
| Status | 📝 PLAN / ANALISIS ONLY — tidak ada kode, metadata, registry, atau Content 38 yang dihapus. |
| Durasi target | 55–60 detik termasuk intro, transisi, dan closing. |

## Keputusan editorial

Alurnya menjadi `user → group dan ownership → perubahan sistem → sudo → review aman`. Ini koheren karena penonton mengenal terlebih dahulu **siapa** yang bekerja, sebelum melihat kapan satu user dapat meminta izin admin.

Group tidak boleh disamakan dengan sudo. `project-team` menjelaskan ownership file bersama. Izin admin ditentukan policy sistem; pada beberapa distro policy dapat memakai group admin seperti `sudo` atau `wheel`, tetapi itu bukan aturan universal dan tidak diajarkan mendetail di content ini.

| Field | Keputusan |
|---|---|
| Title A | `USER` — sky blue `#38BDF8` |
| Title B | `ACCESS` — emerald `#34D399` |
| Subtitle | `Identitas, group, dan izin admin sementara` |
| Audience promise | Audiens memahami ownership user/group serta bahwa sudo memberi privilege sementara untuk satu command setelah policy mengizinkan. |
| Tone | Gedung kerja: kartu identitas, roster team, file bersama, lalu penjaga admin untuk satu pekerjaan sistem. |

## Scope gabungan

| Materi | Keputusan | Batas akurasi |
|---|---|---|
| User aktif | Act 1 | User adalah identitas akun/proses, bukan hanya nama. |
| Group dan ownership | Act 2 | Group membantu konteks akses; tidak otomatis memberi read/write. |
| User biasa dan perubahan sistem | Act 3 | Task biasa dapat berjalan tanpa sudo; perubahan sistem bisa perlu izin. |
| Sudo, policy, one-command grant | Act 4 | Sudo bukan root mode permanen; password tidak dikirim ke command. |
| Checklist source/target/impact | Act 4 payoff | Tidak ada command destruktif atau contoh yang dapat disalin berbahaya. |
| chmod, chown, ACL, 755/644 | Tetap Content 40–42 | Hanya teaser, bukan action. |
| Root user, sudoers | Tetap Content 39 / lanjutan | Tidak ada root shell atau konfigurasi policy. |

## Empat Act dan continuity

| Act | Cerita | Entry | Exit | Durasi |
|---|---|---|---|---:|
| 1 — Siapa yang bekerja? | adib dan nisa memakai mesin yang sama; adib menjadi user aktif | Dua card idle | adib active | 11,0s |
| 2 — Siapa memiliki file? | Mereka membentuk project-team; proposal.md mendapat owner/group tag | User aktif, file belum tagged | Owner `adib`, group `project-team` | 13,0s |
| 3 — Kapan perlu izin admin? | Status biasa berhasil; perubahan sistem berhenti pada gate | Ownership dipahami | Request sudo waiting | 13,0s |
| 4 — Satu izin, tetap diperiksa | Policy memeriksa user; key hanya menempel pada satu command; checklist menutup | Request waiting | Key hilang, user tetap normal | 16,0s |

Tidak ada Act kelima untuk daftar command. Takeaway muncul sesudah key/gate kembali tertutup.

| Actor | Lahir | Persist | Handoff wajib |
|---|---|---|---|
| `adib` user card | Act 1 | Act 1–4 | idle → active → policy checked → tetap normal. |
| `nisa` user card | Act 1 | Act 1–2, redup sesudahnya | Menjadi anggota team, bukan contoh user gagal. |
| `project-team` | Act 2 | Act 2–4, redup | Connector dari dua user; tidak punya path ke gate. |
| `proposal.md` | Act 2 | Act 2 sampai teaser | File muncul → owner tag → group tag. |
| Terminal | Act 1 | Act 1–4 | Command normal → sudo request → output aman. |
| Gate, policy, key | Act 3 | Act 3–4 | Request → waiting → check → key attached → released. |

## State contract

| State | Tampak | Belum boleh tampak | Trigger | Bukti hasil |
|---|---|---|---|---|
| `identity` | adib/nisa, adib active | Group/file/admin key | Select user | Linux mengenal user aktif. |
| `team` | project-team dan connector | File tags/sudo grant | Members arrive | Group adalah konteks bersama. |
| `ownership` | proposal.md + owner/group tag | Read/write final/admin grant | Tags attach | File punya dua konteks ownership. |
| `normal-task` | Command baca status berhasil | Key/gate | Command commit | Tidak semua task perlu sudo. |
| `admin-request` | Command sudo berhenti di gate | Output/key attached | Request intent | Izin belum diberikan. |
| `temporary-grant` | Policy scan dan key ke command | Root/permanent access | Policy approved | Privilege hanya satu action. |
| `safe-complete` | Output aman dan key hilang | Gate terbuka | Command apply | User kembali normal. |

## Causal Motion Contract — Before → Action → After

| Action | Before | Intent/source | Travel/process | Apply | After/explain | Hold | SFX | Audit |
|---|---|---|---|---|---|---:|---|---|
| `select-user` | adib/nisa idle | Focus memilih adib | Ring bergerak ke adib | adib active | `Linux mengenal user aktif` | 0,8s | pop | cards / focus / active |
| `form-group` | Tanpa team | Connector dari dua card | Garis menuju capsule project-team | Avatar masuk capsule | `Group menyatukan tim` | 0,9s | connector-snap | before / connector / team |
| `tag-ownership` | proposal tanpa metadata | File muncul dari work area | Owner tag lalu group tag travel | Tags attach sesudah file hadir | `File punya owner dan group` | 1,0s | arrive + tick | file / tag / tagged |
| `normal-command` | User normal | `$ systemctl status demo` commit | Pulse ke read-only status | Status tampil | `Tugas biasa tidak perlu sudo` | 0,7s | tick | prompt / pulse / status |
| `request-sudo` | System change belum boleh | `$ sudo apt install editor-lite` commit | Pulse ke gate dan berhenti | Gate `waiting` | `sudo meminta izin admin` | 0,8s | lock | command / waiting / gate |
| `verify-policy` | Gate waiting | Policy reads adib + command | Scan gate → policy → command | Approved visible | `Policy memeriksa user` | 0,8s | paper-open | wait / scan / approved |
| `grant-once` | Approved, command belum jalan | Key keluar gate | Key attaches ke satu command | Output aman; key release | `Izin berlaku untuk satu tugas` | 1,1s | unlock + confirm | gate / attached / released |
| `review-safety` | Command selesai | Checklist muncul dari result | Source → target → impact pills tersusun | Semua visible | `Pahami dahulu, lalu sudo` | 1,2s | pop + ding | result / pills / takeaway |

Aturan keras: group `project-team` tidak memiliki path ke gate; key tidak pernah menempel ke user card; password tidak ditampilkan; kartu command tidak jelas harus abstrak tanpa command nyata berbahaya.

## Layout contract

Semua koordinat local terhadap `ContentBodyV1` (`732 × 965`).

| Zona | Local y | Isi | Guardrail |
|---|---:|---|---|
| Caption | 18–68 | Copy satu ide | Maks. 8 kata, fade saat transit. |
| Identity + terminal | 96–282 | User cards, terminal 1–3 rows | Terminal tumbuh ke atas dan tidak menutup cards. |
| Group / ownership | 316–520 | Team capsule, connector, file, tags | Tag relatif terhadap file, bukan coordinate absolut. |
| Admin transit | 552–710 | Request, key, policy, gate | Hanya satu request/key aktif. |
| Result / safety | 744–850 | Output aman atau checklist | Gate/policy tidak tampil penuh bersamaan dengan checklist. |
| Closing | 878–946 | Takeaway | Muncul sesudah key release. |

Terminal memakai 1–3 baris dan anchor bawah tetap. Act 2 memakai group/ownership mode; Act 3–4 menggunakan area itu sebagai context card redup, bukan menumpuk panel baru. `clipPath` hanya untuk isi terminal, bukan menyembunyikan collision.

## Komponen dan data setelah plan disetujui

| Komponen | State | Kontrak |
|---|---|---|
| `UserCard` | idle, active, policy-checked | adib persist; nisa bukan user gagal. |
| `GroupCapsule` | hidden, forming, ready | Team context, tidak memberi permission otomatis. |
| `OwnershipFile` | hidden, ready, tagged | File hadir sebelum tag attach. |
| `TerminalPanel` | normal, sudo-request, output | Source setiap action; history bergerak ke atas. |
| `AdminGate` | hidden, waiting, scanning, approved, closed | Context policy ringkas, bukan tutorial sudoers. |
| `TemporaryKey` | hidden, travelling, attached, released | Tepat satu command, tidak global. |
| `SafetyChecklist` | hidden, entering, visible | Source, target, impact; abstrak dan aman. |

```js
USERS = [{ id: 'adib', active: true }, { id: 'nisa' }]
GROUP = { id: 'project-team', members: ['adib', 'nisa'] }
FILE = { id: 'proposal', owner: 'adib', group: 'project-team' }
SAFE_SYSTEM_ACTION = '$ sudo apt install editor-lite'
```

`SAFE_SYSTEM_ACTION` menjadi bridge dengan Content 34, tetapi Content 37 gabungan menjelaskan otorisasi, bukan repository/dependency.

## Copy, palette, dan audio

Copy: `Linux mengenal user aktif`; `Group menyatukan tim`; `File punya owner dan group`; `Tugas biasa tidak perlu sudo`; `sudo meminta izin admin`; `Izin berlaku untuk satu tugas`; `Pahami dahulu, lalu sudo`.

Palette: user/info `#38BDF8`; group/ownership `#A78BFA`; success `#34D399`; waiting `#FBBF24`; unsafe abstract card `#F43F5E`. Title wajib sky blue → emerald.

Audio: pop untuk user/group, `impacts/connector-snap` untuk team, `ui/paper-arrive` untuk file, lock untuk request, `ui/paper-open` untuk policy, unlock untuk grant, confirm untuk result, ding untuk closing. Semua masuk `SFX_MAP` dan sinkron dengan Apply.

## Migrasi yang direncanakan setelah plan disetujui

| Urutan | File | Perubahan nanti |
|---:|---|---|
| 1 | `src/content/37-user-group-access/data.js` | PHASES gabungan, palette, actor data, command/action map, captions, SFX. |
| 2 | `src/content/37-user-group-access/Animation.jsx` | Empat Act, actor persistent, causal lifecycle, terminal, gate/key/checklist. |
| 3 | `src/content/37-user-group-access/metadata.json` | Subtitle/tags/status gabungan. |
| 4 | manifest/caption/icon contract | Dibuat atau diperbarui saat implementasi dimulai. |
| 5 | Preview/export Content 37 | Audit before/transit/after, replay loop, layout terbesar, audio. |
| 6 | Content 38 | Hanya setelah langkah 5 lulus: hapus folder/metadata/roadmap Content 38 dalam perubahan terpisah yang recoverable. |

## Checklist penerimaan

- [ ] Empat Act menghasilkan ±55–60 detik tanpa hold kosong.
- [ ] User, group ownership, permission context, dan temporary admin grant dapat dibedakan.
- [ ] `project-team` tidak pernah divisualkan sebagai pemberi sudo.
- [ ] Semua action memiliki before, source, travel, apply, after, hold, SFX, dan tiga audit frame.
- [ ] Owner/group tag muncul setelah file; key hanya satu command lalu hilang.
- [ ] Tidak ada password, root mode, sudoers detail, atau command berbahaya.
- [ ] Tidak ada overlap pada terminal tiga baris, ownership, gate, checklist, atau closing.
- [ ] Loop kedua reset: users, team, tags, history, request, gate, policy scan, key, output, checklist, caption, dan SFX.
- [ ] Preview manual intro, audit frames, replay, dan export test disetujui sebelum Content 38 dihapus.
