# PLAN — 37 User, Group, dan Izin Admin

| Item | Nilai |
|---|---|
| Content | 37 — User, Group, and Admin Access (gabungan Content 38 — sudo) |
| Status | 📝 PLAN ONLY — belum ada kode/animasi yang dieksekusi |
| Target audiens | Pemula Linux dan pengguna komputer umum |
| Tujuan belajar | Memahami user, group/ownership, serta sudo sebagai izin admin sementara untuk satu command |
| Prasyarat | 25 Linux Filesystem dan 34 Install Applications |
| Scene shell | scene-ui V1, portrait 820 × 1340 |

## Audience promise

Setelah menonton, audiens memahami bahwa Linux tidak hanya melihat nama file: Linux juga melihat siapa pemiliknya, grup mana yang terkait, dan siapa yang diberi akses.

## Identitas seri

| Field | Keputusan |
|---|---|
| Kategori | Linux Fundamentals |
| Title A | USER — cyan atau blue |
| Title B | ACCESS — emerald |
| Subtitle | Identitas, group, dan izin admin sementara |
| Tone | Gedung kerja: kartu identitas, roster team, file bersama, lalu penjaga admin untuk satu pekerjaan sistem |
| Shell | Scene UI V1 dengan hero-to-header, empat Act, badge, dan dot navigator |

## Batas akurasi

1. User adalah akun/identitas sistem; group adalah kumpulan user untuk pembagian akses.
2. Kepemilikan file dicatat sebagai user owner dan group owner, bukan hanya “milik semua orang”.
3. Content ini belum mengajarkan angka permission atau command chmod/chown secara detail; itu diteruskan pada content 40–42.
4. Jangan menyatakan group otomatis memberi semua akses; akses final tetap dipengaruhi permission file.
5. Gunakan user contoh generik: adib, nisa, dan group project-team.

## Validasi analogi

User dianalogikan sebagai kartu identitas pekerja. Group dianalogikan sebagai daftar tim yang bisa mendapat akses bersama ke satu ruang. File adalah lemari dengan nama pemilik dan nama tim. Analogi tidak menyamakan group dengan password atau admin; group hanya membantu Linux mengelompokkan aturan akses.

## Storyboard empat Act

| Act | Setup → tegangan → titik balik → payoff | Konsep | Exit state |
|---|---|---|---|
| 1 — Identitas | Dua orang membuka komputer yang sama → sistem perlu tahu siapa yang masuk → kartu user adib dan nisa muncul → setiap proses berjalan atas identitas user. | user account | Dua user memiliki identitas berbeda. |
| 2 — Tim | Dua user bekerja pada proyek sama → akses satu-satu merepotkan → project-team dibuat sebagai grup → anggota tim dikumpulkan. | group | adib dan nisa tercatat dalam project-team. |
| 3 — Pemilik file | File proposal.md dibuat oleh adib → label owner dan group melekat pada file → nisa terlihat sebagai anggota grup, bukan pemilik pribadi → ownership punya dua sisi. | user owner dan group owner | proposal.md memiliki owner adib dan group project-team. |
| 4 — Aturan berikutnya | Tim perlu menentukan siapa yang dapat membaca atau menulis → layer permission muncul sebagai gerbang berikutnya → user/group memberi konteks untuk aturan → audience siap masuk permission. | hubungan user, group, permission | Takeaway menghubungkan identitas sebelum chmod. |

## State contract

| State | Yang terlihat | Yang belum boleh terlihat | Pemicu | Hasil |
|---|---|---|---|---|
| Identitas | Kartu adib dan nisa | Group bersama | Act 1 | Linux mengenal user aktif |
| Tim | Group project-team dengan anggota | Ownership file final | Act 2 | Anggota dapat dikelompokkan |
| Ownership | File proposal.md dengan owner/group tags | Akses read/write final | Act 3 | Dua label ownership dipahami |
| Permission context | Gerbang read/write redup | Detail chmod | Act 4 | Dasar menuju content permission |

## Continuity map

Kartu user adib dan nisa adalah anchor persisten. Group project-team lahir di Act 2 dan tetap hidup pada Act 3–4. File proposal.md lahir di Act 3 sebagai objek yang menerima tag owner dan group; tag tidak boleh muncul sebelum file terlihat. Gerbang permission pada Act 4 adalah teaser, bukan perubahan akses nyata.

## Layout map V1

Semua koordinat adalah local terhadap ContentBodyV1.

| Area | Local y | Isi |
|---|---:|---|
| Narration bubble | 35–115 | Caption singkat per beat |
| User identity cards | 155–360 | adib dan nisa sebagai anchor |
| Group lane | 405–530 | project-team dan hubungan anggota |
| File ownership card | 585–745 | proposal.md, owner, dan group tags |
| Permission teaser / takeaway | 800–930 | Gerbang redup dan rangkuman |

Kartu user diletakkan horizontal dengan perhitungan lebar dan gap minimal. Semua body child memakai local y positif. Header dan navigator hanya dikelola Scene UI V1.

## Elemen visual dan aset

| Elemen | Bentuk | Perilaku |
|---|---|---|
| User card | Inline SVG ID card | Persistent dari Act 1 sampai akhir |
| Group capsule | Inline SVG team pill | Lahir Act 2, menerima member connector |
| File card | Inline SVG dokumen | Lahir Act 3 |
| Owner tag | Inline SVG pill cyan | Menempel ke file setelah file tampil |
| Group tag | Inline SVG pill purple | Menempel ke file setelah owner tag |
| Permission gate | Inline SVG gate redup | Teaser Act 4 |

First pass memakai inline SVG karena kartu user, connector group, dan file ownership memerlukan state animasi. Saat eksekusi, buat folder icons, icons.json, default-icon.png, serta loader fallback sesuai kontrak topic baru.

## Draft teks in-video

| Beat | Teks |
|---|---|
| Act 1 | Linux mengenal user aktif |
| Act 1 | Setiap user punya identitas |
| Act 2 | Group menyatukan tim |
| Act 2 | Anggota berbagi konteks akses |
| Act 3 | File punya user owner |
| Act 3 | File juga punya group owner |
| Act 4 | Permission memakai konteks ini |
| Closing | Identitas datang sebelum izin |

Semua teks produksi deklaratif, pendek, tanpa emoji, tanpa kata ganti orang, dan tidak menduplikasi kalimat antara bubble serta kartu informasi.

## Audio beat map

| Momen | Candidate SFX | Catatan |
|---|---|---|
| Intro selesai | success/shimmer | Header compact selesai |
| User card masuk | ui/pop dan ui/pop-2 | Dipisah sedikit |
| Connector menuju group | impacts/connector-snap | Menandai anggota masuk tim |
| File proposal muncul | ui/paper-arrive | Awal Act 3 |
| Owner/group tag menempel | ui/tick | Maksimal dua cue berdekatan |
| Permission gate teaser | impacts/lock | Tidak menyatakan akses benar-benar terkunci |
| Takeaway | success/ding | Penutup |

Sebelum implementasi, audit aset audio shared untuk semantik, loudness, provenance, dan kategori. Semua cue aktual perlu masuk SFX_MAP dan export schedule pada waktu yang sama dengan GSAP.

## Rencana file saat eksekusi

| File | Perubahan yang direncanakan |
|---|---|
| src/content/37-user-group-access/data.js | Viewport, PHASES, palette, user/group/file labels, captions, dan SFX_MAP. |
| src/content/37-user-group-access/manifest.js | Metadata Linux Fundamentals. |
| src/content/37-user-group-access/Animation.jsx | Timeline GSAP, reset loop, Scene UI V1, user cards, group connector, ownership file, dan teaser permission. |
| src/content/37-user-group-access/caption.md | Caption sosial media di luar video. |
| src/content/37-user-group-access/icons/* | icons.json, fallback icon, loader, dan aset bila audit membutuhkannya. |
| src/content/registry.js | Entry manifest coming-soon sesudah implementasi. |
| scripts/export-lib.js | Jadwal SFX yang sinkron. |

## Checklist eksekusi

- [ ] Kunci metadata dan title segments cyan/blue → emerald.
- [ ] Buat data.js sebelum Animation.jsx.
- [ ] Buat manifest, caption, dan kontrak folder icons.
- [ ] Gunakan satu IntroHeaderMorphV1 yang tetap mounted setelah morph.
- [ ] Gunakan ActBadgeNavigatorV1 dari satu array PHASES.
- [ ] Render semua visual di ContentBodyV1 local coordinate.
- [ ] Jadikan user cards dan project-team anchor sesuai continuity map.
- [ ] Munculkan owner/group tag hanya setelah file proposal terlihat.
- [ ] Jangan memvisualkan group sebagai izin penuh tanpa layer permission.
- [ ] Reset seluruh state pada repeat timeline.
- [ ] Wire SFX_MAP dan export schedule dengan kategori eksplisit.
- [ ] Audit dead field, teks in-video, collision, dan coverage SFX.
- [ ] Compile, preview intro/morph/semua Act/replay, lalu export MP4.

## Batasan

Content ini mengajarkan sudo hanya sebagai izin admin sementara untuk satu command setelah policy mengizinkan. Content ini tidak mengajarkan password, sudoers, root shell, chmod, chown, ACL, atau angka 755/644. Permission, chmod, dan chown tetap berada pada content 40–42; root user tetap pada content 39.

---

# Kontrak Gabungan 37 + 38 — Sumber Kebenaran Produksi

> Bagian ini menggantikan ringkasan lama di atas bila ada perbedaan. Status
> tetap plan-only. Content 38 telah dikonsolidasikan ke plan utama ini.

## Keputusan editorial dan batas akurasi

Alur final: **user → group dan ownership → perubahan sistem → sudo → review aman**. Group `project-team` menjelaskan konteks file bersama, **bukan** pemberi izin sudo. Izin admin ditentukan policy sistem; beberapa distro dapat memakai group admin seperti `sudo` atau `wheel`, tetapi hal itu bukan aturan universal dan tidak perlu diajarkan mendetail di sini.

| Dibahas | Tidak dibahas |
|---|---|
| User aktif, group, owner dan group owner file | chmod, chown, ACL, angka 755/644. |
| Tugas biasa versus perubahan sistem | Root shell, sudoers, atau password. |
| Sudo request, policy check, grant tepat satu command | Command destruktif atau command tidak jelas yang dapat disalin. |
| Checklist source, target, impact | Klaim semua group dapat menjalankan sudo. |

## Struktur empat Act

| Act | Cerita | Entry state | Exit state | Durasi |
|---|---|---|---|---:|
| 1 — Siapa yang bekerja? | adib dan nisa memakai mesin yang sama; adib dipilih sebagai user aktif | Dua card idle | adib active | 11,0s |
| 2 — Siapa memiliki file? | project-team terbentuk; `proposal.md` menerima owner dan group tag | User active, file belum tagged | owner `adib`, group `project-team` | 13,0s |
| 3 — Kapan perlu izin admin? | Status biasa berhasil; perubahan sistem berhenti pada gate | Ownership dipahami | Request sudo waiting | 13,0s |
| 4 — Satu izin, tetap diperiksa | Policy memeriksa user; key menempel satu command lalu hilang; checklist menutup | Request waiting | User tetap normal | 16,0s |

Target total 55–60 detik termasuk intro/closing. Tidak ada Act kelima berupa daftar command; takeaway muncul sesudah key dilepas dan gate tertutup.

## State dan continuity contract

| Actor | Lahir | Persist | Handoff wajib |
|---|---|---|---|
| User `adib` | Act 1 | Act 1–4 | idle → active → policy checked → tetap normal. |
| User `nisa` | Act 1 | Act 1–2, lalu redup | Anggota team, bukan contoh user gagal. |
| Group `project-team` | Act 2 | Act 2–4, redup | Connector dari dua user; tidak punya path ke gate. |
| File `proposal.md` | Act 2 | Act 2 sampai teaser | File muncul → owner tag → group tag. |
| Terminal | Act 1 | Act 1–4 | Command normal → request sudo → output aman. |
| Gate/policy/key | Act 3 | Act 3–4 | Request → waiting → scan → attached → released. |

| State | Yang tampak | Yang belum boleh tampak | Trigger | Bukti |
|---|---|---|---|---|
| `identity` | adib/nisa dan adib active | Group/file/admin key | User dipilih | Linux mengenal user aktif. |
| `team` | project-team + connector | Tag file/sudo grant | Members arrive | Group adalah konteks bersama. |
| `ownership` | proposal + owner/group tag | Read/write final/admin grant | Tags attach | File punya dua konteks ownership. |
| `normal-task` | Command baca status berhasil | Key/gate | Command commit | Tidak semua task perlu sudo. |
| `admin-request` | Command sudo berhenti di gate | Output/key attached | Intent request | Izin belum diberikan. |
| `temporary-grant` | Policy scan dan key ke command | Root/permanent access | Policy approved | Privilege satu action. |
| `safe-complete` | Output aman, key hilang | Gate terbuka | Command apply | User normal kembali. |

## Causal Motion Contract — Before → Action → After

| Action | Before | Intent/source | Travel/process | Apply | After/explain | Hold | SFX | Audit |
|---|---|---|---|---|---|---:|---|---|
| `select-user` | adib/nisa idle | Focus memilih adib | Ring ke card adib | adib active | `Linux mengenal user aktif` | 0,8s | pop | cards / focus / active |
| `form-group` | Tanpa team | Connector dari dua card | Garis menuju project-team | Avatar masuk capsule | `Group menyatukan tim` | 0,9s | connector-snap | before / connector / team |
| `tag-ownership` | proposal tanpa metadata | File muncul | Owner lalu group tag travel | Tags attach sesudah file hadir | `File punya owner dan group` | 1,0s | arrive + tick | file / tag / tagged |
| `normal-command` | User normal | `$ systemctl status demo` commit | Pulse ke status read-only | Status tampil | `Tugas biasa tidak perlu sudo` | 0,7s | tick | prompt / pulse / status |
| `request-sudo` | System change belum boleh | `$ sudo apt install editor-lite` commit | Pulse ke gate dan berhenti | Gate waiting | `sudo meminta izin admin` | 0,8s | lock | command / wait / gate |
| `verify-policy` | Gate waiting | Policy membaca adib + command | Scan gate → policy → command | Approved visible | `Policy memeriksa user` | 0,8s | paper-open | wait / scan / approved |
| `grant-once` | Approved, command belum jalan | Key keluar gate | Key attach pada satu command | Output aman; key release | `Izin berlaku untuk satu tugas` | 1,1s | unlock + confirm | gate / attached / released |
| `review-safety` | Command selesai | Checklist dari result | Pill source → target → impact | Semua visible | `Pahami dahulu, lalu sudo` | 1,2s | pop + ding | result / pills / takeaway |

Aturan keras: key tidak pernah menempel pada user card; password tidak ditampilkan/dikirim ke command; group `project-team` tidak terhubung ke gate; command tidak jelas harus abstrak tanpa command nyata berbahaya.

## Layout dan komponen

| Zona local `ContentBodyV1` | Rentang y | Isi | Guardrail |
|---|---:|---|---|
| Caption | 18–68 | Satu copy deklaratif | Maks. 8 kata, fade saat transit. |
| Identity + terminal | 96–282 | User cards, terminal 1–3 rows | Terminal tumbuh ke atas dan tidak menutup cards. |
| Group / ownership | 316–520 | Team capsule, connector, file, tags | Tag relatif terhadap file, bukan coordinate absolut. |
| Admin transit | 552–710 | Request, key, policy/gate | Maks. satu request/key aktif. |
| Result / safety | 744–850 | Output aman atau checklist | Gate/policy tidak penuh bersamaan dengan checklist. |
| Closing | 878–946 | Takeaway | Sesudah key release. |

| Komponen | State | Kontrak |
|---|---|---|
| `UserCard` | idle, active, policy-checked | adib persist; nisa bukan user gagal. |
| `GroupCapsule` | hidden, forming, ready | Team context, tidak memberi permission otomatis. |
| `OwnershipFile` | hidden, ready, tagged | File hadir sebelum tags attach. |
| `TerminalPanel` | normal, sudo-request, output | Source setiap action; history bergerak ke atas. |
| `AdminGate` | hidden, waiting, scanning, approved, closed | Context policy ringkas, bukan tutorial sudoers. |
| `TemporaryKey` | hidden, travelling, attached, released | Tepat satu command, tidak global. |
| `SafetyChecklist` | hidden, entering, visible | Source, target, impact; abstrak dan aman. |

## Data, copy, audio, dan acceptance

```js
USERS = [{ id: 'adib', active: true }, { id: 'nisa' }]
GROUP = { id: 'project-team', members: ['adib', 'nisa'] }
FILE = { id: 'proposal', owner: 'adib', group: 'project-team' }
SAFE_SYSTEM_ACTION = '$ sudo apt install editor-lite'
```

`SAFE_SYSTEM_ACTION` adalah bridge dengan Content 34, tetapi Content 37 menjelaskan otorisasi—bukan repository/dependency.

Copy: `Linux mengenal user aktif`; `Group menyatukan tim`; `File punya owner dan group`; `Tugas biasa tidak perlu sudo`; `sudo meminta izin admin`; `Izin berlaku untuk satu tugas`; `Pahami dahulu, lalu sudo`.

Palette: user/info `#38BDF8`; group/ownership `#A78BFA`; success `#34D399`; waiting `#FBBF24`; unsafe abstract card `#F43F5E`. Title wajib sky blue → emerald. Audio: pop user/group, `connector-snap` team, `paper-arrive` file, lock request, `paper-open` policy, unlock grant, confirm result, ding closing. Seluruh cue masuk `SFX_MAP` pada beat Apply.

### Checklist penerimaan

- [ ] Empat Act menghasilkan ±55–60 detik tanpa hold kosong.
- [ ] User, group ownership, permission context, dan temporary admin grant dapat dibedakan.
- [ ] `project-team` tidak pernah divisualkan sebagai pemberi sudo.
- [ ] Semua action memiliki before, source, travel, apply, after, hold, SFX, dan audit frame.
- [ ] Owner/group tags muncul sesudah file; key hanya satu command lalu hilang.
- [ ] Tidak ada password, root mode, sudoers detail, atau command berbahaya.
- [ ] Tidak ada overlap pada terminal tiga baris, ownership, gate, checklist, atau closing.
- [ ] Loop kedua reset users, team, tags, history, request, gate, policy scan, key, output, checklist, caption, dan SFX.
- [ ] Preview intro, before/transit/after, replay, dan export test lulus sebelum content ditandai ready.
