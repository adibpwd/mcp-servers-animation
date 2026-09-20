# Revisi 01 — User Access yang Lebih Padat dan Hidup

| Item | Keputusan |
|---|---|
| Content | 37 — User, Group, dan Admin Access |
| Status | PLAN ONLY — belum ada kode, preview, atau perubahan akses dieksekusi |
| Tujuan revisi | Memperluas model user access dan menghilangkan Act yang pasif/terlalu kosong. |
| Nama karakter | **Nisa diganti menjadi Yono Bakrie** pada implementasi berikutnya. |
| Durasi target | 100–120 detik, atau dibagi menjadi dua episode bila format maksimum sekitar 60 detik. |

## 1. Diagnosis versi saat ini

Plan dan animasi saat ini sudah memiliki alur user → group → owner → sudo,
tetapi sebagian besar Act hanya memperlihatkan kartu yang muncul, connector,
dan satu gerbang. Penonton belum cukup melihat alasan Linux menyimpan identity,
bagaimana system memilih rule akses, perbedaan owner/group/others, atau mengapa
izin admin sementara berbeda dari permission file.

Masalah ritme yang perlu dihilangkan:

- Act 1 berhenti setelah satu user aktif, padahal identity dapat membuktikan
  user name, UID, primary group, supplementary groups, home, dan process
  context secara ringkas.
- Act 2 hanya mengumpulkan anggota group, tanpa menunjukkan perbedaan primary
  group dan supplementary group serta tujuan group sebagai rule bersama.
- Act 3 berhenti pada dua ownership tag, tanpa memvisualkan bagaimana sistem
  memilih owner/group/others dan beda file versus directory.
- Act 4 memakai gate sudo sebagai payoff tunggal; policy, scope satu command,
  least privilege, audit, dan perbedaan root belum memberi konflik/hasil cukup.

Tujuan motion baru: setiap Act mempunyai **pertanyaan, konflik akses, request
yang berjalan, rule yang dipilih, hasil yang terlihat, serta hold membaca**.
Tidak ada card dekoratif yang diam lebih dari satu beat tanpa membawa state baru.

## 2. Perubahan nama karakter: Nisa → Yono Bakrie

Pada implementasi nanti, semua referensi karakter kedua diganti konsisten:

| Lokasi | Kondisi saat ini | Target revisi |
|---|---|---|
| Data user | id/label Nisa | id aman `yono-bakrie`, label tampilan `Yono Bakrie`. |
| Group membership | adib + nisa | adib + Yono Bakrie. |
| UserCard/animation state | CARD_NISA dan state Nisa | CARD_YONO_BAKRIE dan state Yono Bakrie. |
| Plan, caption, copy | Nisa sebagai anggota tim | Yono Bakrie sebagai anggota tim. |
| Accessibility/test labels | Nama Nisa | Nama Yono Bakrie. |

Nama tampilan boleh memiliki spasi; id teknis memakai bentuk yang stabil dan
mudah dipakai di data. Yono Bakrie tetap anggota tim yang valid, bukan contoh
user gagal atau “penyusup”.

## 3. Model mental access yang diperluas

```
login identity → user UID + primary/supplementary groups
                          ↓
request ke file/directory atau system action
                          ↓
owner class / group class / others class → permission decision
                          ↓
ordinary access allowed/denied
                          ↓
jika perubahan sistem: sudo policy → temporary elevation untuk satu action
                          ↓
audit/log evidence → privilege kembali normal
```

Tiga pertanyaan yang wajib dijawab visual:

1. **Siapa yang meminta?** User identity, UID, group membership, session/process.
2. **Aturan mana yang berlaku?** Owner, group, atau others; permission dan
   resource context.
3. **Apakah tindakan memerlukan hak admin?** Policy sudo terpisah dari group
   proyek dan permission file biasa.

## 4. Pembahasan baru yang perlu masuk

| Konsep | Penjelasan untuk pemula | Batas agar tetap akurat |
|---|---|---|
| User account dan UID | Nama ramah manusia dipetakan ke identity numerik sistem. | UID bukan password dan bukan permission. |
| Primary vs supplementary group | User mempunyai primary group serta bisa menjadi anggota group tambahan. | Group tidak otomatis memberi read/write; permission resource tetap menentukan. |
| Process identity | Program berjalan membawa effective identity yang menentukan aksesnya. | Jangan masuk capability, namespace, SELinux/AppArmor detail pada episode dasar. |
| Ownership | File/directory memiliki user owner dan group owner. | Ownership tidak otomatis berarti semua aksi diizinkan. |
| Owner/group/others classes | Sistem memilih satu kelas rule berdasarkan relationship requester-resource. | Ia tidak menjumlahkan semua permission class. |
| Read/write/execute | Makna berbeda untuk file dan directory. | Directory execute/traverse harus disebut; detail angka mode diteruskan. |
| Directory versus file | Directory mengatur daftar/navigasi/entry; file mengatur isi/execution. | Jangan menyederhanakan directory sebagai file besar. |
| Inheritance/umask | File baru memperoleh owner/group dan mode awal dipengaruhi context/umask. | Tidak mengajarkan konfigurasi umask. |
| ACL dan policy MAC | Rule tambahan dapat ada pada sistem modern. | Hanya “lapisan tambahan”, bukan tutorial ACL/SELinux/AppArmor. |
| Root dan sudo | Root sangat berkuasa; sudo memberi elevasi menurut policy dan scope. | Tidak ada root shell, password, sudoers, atau command berbahaya. |
| Least privilege dan audit | Hak seperlunya, scope kecil, record tindakan. | Audit bukan jaminan tindakan benar. |

## 5. Perbandingan yang harus terlihat, bukan hanya disebut

### User, group, dan admin

| Konsep | Menjawab | Bukan |
|---|---|---|
| User | Siapa identitas requester? | Permission rule itu sendiri. |
| Group | Keanggotaan bersama mana yang bisa dipakai rule? | Password bersama atau akses otomatis penuh. |
| Owner | Siapa pemilik resource? | Satu-satunya orang yang dapat memakai resource. |
| Permission | Aksi apa yang boleh untuk class tertentu? | Identitas user. |
| sudo policy | Kapan identity boleh melakukan aksi admin? | Group proyek atau permission file biasa. |
| Root | Identity administrator yang sangat kuat. | Mode kerja normal untuk semua task. |

### File dan directory

| Aksi | File | Directory |
|---|---|---|
| Read | Membaca isi file. | Melihat daftar entry, tergantung permission terkait. |
| Write | Mengubah isi file. | Membuat, menghapus, atau rename entry bergantung kombinasi rule. |
| Execute | Menjalankan file yang dapat dieksekusi. | Traverse/masuk dan mengakses entry menurut path. |

Tabel ini divisualkan lewat satu request capsule yang mencoba “read report” dan
“open team folder”; response berbeda menegaskan bahwa huruf permission tidak
selalu bermakna sama pada jenis resource berbeda.

## 6. Storyboard revisi: tujuh Act yang aktif

| Act | Konflik → gerak → payoff | Pembahasan padat | Durasi |
|---|---|---|---:|
| 1 — Identity masuk | Adib dan Yono Bakrie login ke mesin sama; token nama dipetakan menjadi UID/session/process badge. | Account, UID, home/session, process identity. | 14 dtk |
| 2 — Group membentuk konteks | Primary group ring melekat ke masing-masing user; supplementary project-team connector menambahkan keduanya tanpa mengganti identity. | Primary vs supplementary group; group bukan permission otomatis. | 15 dtk |
| 3 — Resource punya metadata | Yono membuat team-notes directory dan report.md; owner/group/mode birth tags datang dari identity/context. | Ownership, parent context, umask sebagai konsep mode awal. | 15 dtk |
| 4 — Rule resolver memilih kelas | Dua request capsule—Adib dan Yono—bergerak ke resource; resolver menyalakan tepat satu lane owner/group/others untuk masing-masing. | Pemilihan rule class; access allowed/denied. | 18 dtk |
| 5 — File bukan directory | Read/write/execute tokens menguji report file lalu team directory; pintu file dan folder memberi makna berbeda. | rwx file vs directory; traverse. | 17 dtk |
| 6 — System action butuh policy lain | Request ubah sistem berhenti di admin gate; project-team connector sengaja tidak melewati gate; sudo policy membaca identity + action scope. | Root, sudo, least privilege, temporary grant. | 18 dtk |
| 7 — Bukti dan return normal | Temporary key melekat pada satu action, audit event dicatat, key kembali/hilang; summary merajut identity → rule → policy. | Audit, scope, privilege kembali normal. | 13 dtk |

Target total sekitar 110 detik. Jika format channel maksimum 60 detik, pecah
dengan batas berikut:

- **37a User, Group, Ownership**: Act 1–3.
- **37b Permission Resolver**: Act 4–5.
- **37c Admin Access dan sudo**: Act 6–7.

Tidak ada Act yang hanya menjadi layar rangkuman pasif; semua ringkasan lahir
dari actor yang telah bergerak pada Act sebelumnya.

## 7. Motion contract: cara membuatnya ramai tetapi bermakna

| Action | Before | Travel/process | Apply | After/hold |
|---|---|---|---|---|
| Login identity | Dua identity card idle. | Name token → UID badge → session ring. | Process badge terikat pada user aktif. | Identity stack terbaca 0,8 dtk. |
| Add group context | User punya primary ring. | project-team connector berangkat dari group roster. | Supplementary badge melekat ke dua user. | Text “membership, not automatic access”. |
| Create resource | Resource belum ada. | Identity/context token menuju file/folder birth tray. | Owner, group, mode seed attach berurutan. | Metadata card dapat dibaca. |
| Resolve permission | Request capsule membawa user+action. | Resolver memeriksa relationship. | Tepat satu lane owner/group/others menyala. | Allowed/denied result, dengan alasan singkat. |
| Compare resource type | Read/write/execute tokens idle. | Token memantul ke file lalu directory gate. | Response berbeda untuk type resource. | Side-by-side takeaway. |
| Request admin | System action belum boleh. | Request berhenti di sudo policy gate. | Policy scope approved atau denied abstrak. | Project group tetap tidak terhubung gate. |
| Grant and audit | Key masih di gate. | Key → one action → audit ledger. | Output aman lalu key release. | User kembali normal; ledger tersimpan. |

Aturan rhythm:

- Maksimum satu subject fokus, satu request, dan tiga metadata chip pada saat
  yang sama; “ramai” berasal dari urutan/causality, bukan clutter.
- Tambahkan micro-motion bermakna: session heartbeat, resolver scan,
  metadata shimmer, connector flow, audit ledger stamp, serta status pulse.
- Gunakan camera focus/crop transition ketika berpindah dari identity ke
  resource lalu admin; jangan mendadak mengganti seluruh scene.
- Hold setelah result selalu memuat perubahan yang baru terjadi, bukan panel
  diam berisi pengulangan copy.
- SFX menandai Apply: identity tick, connector snap, metadata attach, resolver
  scan, allow/deny click, lock/unlock, ledger stamp. Tidak ada SFX spam.

## 8. State dan continuity contract

| Actor | Lahir | Persist/handoff |
|---|---|---|
| Adib | Act 1 | Tetap sebagai requester owner pada beberapa request. |
| Yono Bakrie | Act 1 | Tetap anggota project-team dan requester group pada Act 4–5. |
| Identity stack | Act 1 | Name → UID → primary/supplementary group → process badge. |
| project-team | Act 2 | Tetap sebagai membership context; tidak pernah memberikan sudo. |
| team-notes directory | Act 3 | Dipakai untuk demonstrasi directory semantics Act 5. |
| report.md | Act 3 | Dipakai untuk file semantics/owner relationship Act 4–5. |
| Permission resolver | Act 4 | Menyala hanya saat request, kemudian menjadi hasil rule. |
| sudo policy gate | Act 6 | Tidak muncul sebelum ordinary permission selesai. |
| Temporary key/audit ledger | Act 6 | Key hanya satu action; ledger bertahan ke Act 7. |

State yang dilarang:

- Badge admin pada user sejak awal.
- Group connector langsung ke admin gate.
- Allowed result sebelum resolver memilih class.
- Owner/group tag sebelum resource lahir.
- Key tetap pada user sesudah action.
- File and directory diberi interpretasi rwx yang sama.

## 9. Layout baru

| Zone local ContentBodyV1 | Isi | Guardrail |
|---|---|---|
| Caption/top | Pertanyaan Act dan copy satu kalimat. | Maksimum delapan kata; tidak mengulang label UI. |
| Identity rail | Adib + Yono Bakrie, UID/session/group badge. | Dua card plus badge tidak overlap; label nama tampilan cukup besar. |
| Relationship arena | Roster group, connector, resource birth tray, owner/group tags. | Satu resource focus per beat. |
| Resolver lane | Owner/group/others tracks dan request capsule. | Tepat satu lane terang sebagai rule yang dipilih. |
| Resource semantic lane | File card serta directory card dengan action tokens. | Perbedaan file/directory berdampingan hanya saat compare Act 5. |
| Admin/audit lane | Sudo policy gate, one-action key, ledger. | Gate dan ledger crossfade agar tidak berebut area. |
| Closing | Identity → rule → policy map. | Muncul setelah key release. |

## 10. Copy layar

| Beat | Copy deklaratif |
|---|---|
| Identity | `Account memberi identity pada process` |
| UID | `Nama dipetakan ke identity sistem` |
| Group | `Group memberi konteks bersama` |
| Ownership | `Resource menyimpan owner dan group` |
| Resolver | `Satu class rule dipilih per request` |
| File | `File dan directory memakai rwx berbeda` |
| Admin | `Group proyek bukan izin admin` |
| Sudo | `Policy memberi scope sementara` |
| Audit | `Tindakan admin meninggalkan bukti` |
| Closing | `Identity, rule, lalu privilege seperlunya` |

## 11. Batas keamanan dan akurasi

- Tidak ada command chmod/chown, angka 755/644, ACL syntax, password, sudoers,
  root shell, atau command system nyata yang dapat disalin.
- Tidak ada klaim bahwa membership group pasti memberi write access.
- Tidak ada klaim setiap sistem memakai sudo group bernama sama.
- ACL, SELinux, AppArmor, Linux capability, namespaces, dan polkit hanya
  disebut sebagai lapisan lanjutan; tidak dianimasikan sebagai rule dasar.
- “Denied” adalah demonstrasi policy abstrak dan tidak menjadikan Yono Bakrie
  sebagai user gagal.
- Nama orang dipakai hanya sebagai contoh fiktif pembelajaran.

## 12. Acceptance criteria implementasi nanti

- [ ] Seluruh Nisa diganti menjadi Yono Bakrie pada data, code identifier,
      copy, accessibility label, caption, dan test/asset reference terkait.
- [ ] Setiap Act mempunyai konflik, request bergerak, resolver/policy process,
      Apply state, result, dan hold membaca; tidak ada Act sepi.
- [ ] User, UID, group primary/supplementary, process identity, ownership,
      owner/group/others, file/directory rwx, sudo policy, audit dibedakan.
- [ ] Yono Bakrie ditampilkan sebagai anggota tim valid, bukan user gagal.
- [ ] project-team tidak pernah dihubungkan sebagai sumber hak sudo.
- [ ] File dan directory mendapat semantic rwx yang benar secara konseptual.
- [ ] Privilege elevasi hanya untuk satu action, lalu release dan audit record.
- [ ] Tidak ada credential, command runnable, privilege escalation detail,
      atau perubahan filesystem/system nyata.
- [ ] Preview harus mengaudit setiap before/transit/after serta replay reset.

## 13. Rencana dampak file bila eksekusi disetujui

| File | Perubahan yang direncanakan, belum dilakukan |
|---|---|
| data.js | Ganti identifier/label Nisa → Yono Bakrie; tambah identity, resolver, resource, policy, audit state data. |
| Animation.jsx | Ganti identifier/state/component refs; ubah empat Act menjadi tujuh Act atau seri; tambah causal motion dan reset state. |
| manifest.js/caption.md | Sesuaikan subtitle, duration, caption, dan learning promise. |
| icons/ | Audit kebutuhan icon identity, directory, resolver, policy, ledger; jangan mengambil asset tanpa provenance. |
| _docs plan utama | Setelah implementasi disetujui, sinkronkan plan utama dengan keputusan revisi ini. |

Dokumen ini murni analisis dan plan. Tidak ada nama data live, animasi, user
account, group, permission, atau sudo policy yang diubah/dijalankan.

