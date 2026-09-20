# PLAN — 91 Linux Server: Sistem yang Menyediakan Layanan

| Item | Nilai |
|---|---|
| Status | 🚧 IN PROGRESS — data.js/manifest.js/Animation.jsx (7 Act) ditulis & compile OK, BELUM preview manual/export test |
| Terakhir diupdate | 2026-09-18 |
| Audiens | Pemula menuju operator yang telah melihat user, process, service, network, SSH, dan logs |
| Hasil belajar | Memahami server sebagai peran sistem yang menyediakan service dengan akses, network, data, observability, dan operasi yang disengaja. |
| Scene shell | scene-ui V1 (portrait 820×1340) — intro category/title/subtitle, 7 Act, `ActBadgeNavigatorV1` + dot, body via `ContentBodyV1` |

## Audience promise

Penonton tidak lagi menyamakan server dengan “komputer besar”. Server adalah
sistem yang menjalankan layanan untuk client melalui jaringan atau jaringan
lokal; bentuknya dapat physical, virtual machine, cloud instance, container
host, atau perangkat kecil.

## Model sistem

```
clients → DNS/IP/ports → firewall/edge → service manager → application process
                                                ↓                 ↓
                                       identity/access       data/storage
                                                ↓                 ↓
                                         logs/metrics ← monitoring/backups
```

Tidak ada satu komponen yang membuat server aman atau andal. Keandalan muncul
dari interaksi akses, network, service lifecycle, data, observability, update,
backup, dan prosedur recovery.

## Domain yang dibahas

| Domain | Pertanyaan penting | Hubungan content |
|---|---|---|
| Purpose/role | Layanan apa, siapa client, dan SLA/risikonya? | Dasar desain. |
| Compute/runtime | Process, resource, service manager, dependency. | 60 dan 65. |
| Identity/access | User, group, least privilege, SSH, MFA/key policy. | 37–45. |
| Network | Interface, DNS, route, port, firewall/edge, TLS. | 81 dan 84. |
| Data | Filesystem, database, permissions, encryption, backup/restore. | Filesystem/security series. |
| Observability | Logs, metrics, traces/health check, alert. | 65/67. |
| Operations | Update, configuration management, deployment, rollback, capacity. | Operator practice. |
| Resilience | Redundancy, backup, restore test, incident response, documentation. | Reliability practice. |

## Batas aman

- Tidak ada langkah deploy, hardening command, kredensial, IP/domain nyata, firewall change, atau cloud provisioning.
- Jangan menjanjikan one-size-fits-all server stack.
- Backup tanpa uji restore bukan bukti pemulihan.
- High availability tidak menggantikan backup; security tidak menggantikan monitoring.

## Storyboard: tujuh Act

| Act | Cerita | Payoff |
|---|---|---|
| 1 — Server adalah peran | Laptop, VM, cloud instance, dan mini-PC menawarkan app yang sama ke client. | Server bukan bentuk hardware tunggal. |
| 2 — Permintaan masuk | Client name → DNS/IP → port → edge policy → service. | Akses adalah rantai, bukan satu alamat. |
| 3 — Service bekerja | systemd/service manager menjaga application process dan resource. | Layanan perlu lifecycle. |
| 4 — Data dan identity | User policy mengakses data melalui app; least privilege gate. | Akses data harus disengaja. |
| 5 — Bukti kesehatan | Logs, metrics, health check, dan alert menyatu pada timeline. | Status tunggal tidak cukup. |
| 6 — Perubahan dan pemulihan | Version/config change punya deployment, rollback, backup, restore-test cards. | Operasi aman memikirkan kegagalan dahulu. |
| 7 — Server posture | Security, reliability, cost/capacity, dan documentation membentuk scorecard seimbang. | Server adalah sistem sosio-teknis yang dioperasikan. |

## Maturity map

| Tahap | Fokus |
|---|---|
| Personal lab | Tujuan jelas, akun terpisah, update, backup sederhana, log dasar. |
| Small production | Least privilege, SSH policy, firewall, monitoring, restore test, dokumentasi. |
| Team/scale | IaC/config management, secret management, alert ownership, capacity, audit, incident process. |
| Critical system | Redundancy, change control, threat modeling, DR exercise, compliance dan observability matang. |

## Checklist penilaian desain

- Layanan dan owner jelas.
- Akses user/admin memakai least privilege dan recovery path.
- Interface, DNS, port, edge policy, dan TLS scope dipahami.
- Service memiliki dependency, resource boundary, health signal, dan log.
- Data memiliki ownership, permission, backup, retention, dan restore test.
- Perubahan dapat diaudit dan rollback bila perlu.
- Alert mempunyai owner serta runbook.
- Dokumentasi membantu orang lain memulihkan layanan.

## Copy layar

- Server adalah peran yang menyediakan layanan.
- Client melewati DNS, network, dan policy.
- Service, data, dan identity harus selaras.
- Logs dan metrics memberi bukti kesehatan.
- Backup harus diuji dengan restore.
- Operasi yang baik menyiapkan kegagalan.

## Acceptance criteria

- [ ] Mengintegrasikan process, services/logs, SSH/access, interface, ports, data, monitoring, backup, dan recovery.
- [ ] Menjelaskan server sebagai role pada berbagai bentuk compute.
- [ ] Membedakan security, availability, backup, and observability.
- [ ] Tidak memuat konfigurasi atau perubahan infrastruktur runnable.



---

## Series Identity Contract (§1.Q)

| Field | Nilai |
|---|---|
| Seri | Linux Fundamentals (lanjutan 81-network-interface, 84-network-ports, 65-systemd, 67-linux-logs) |
| Kategori intro & manifest | `Linux Fundamentals` |
| Palette title | Title A `SERVER` — Biru/Cyan `#38BDF8`; Title B ` ROLE` — Hijau `#34D399` |
| Header reference | Pola hero→header lerp ala `44-ssh`/`17-rest-api` (scene-ui V1, tanpa typing effect custom) |
| Alasan menyimpang | Tidak ada — ikuti format seri standar |
| Warna manifest | `#F472B6` (sudah ada di `metadata.json`) dipakai untuk badge/tag topic, bukan title header (title tetap Biru→Hijau sesuai standar §1.Q) |

## Content State Contract — Act 2 "Permintaan Masuk" (§1.M)

Satu-satunya Act yang berbentuk alur request/response eksplisit di topic ini
(Act lain bersifat survei sistem, bukan mutasi data tunggal).

| State | Yang penonton lihat | Yang belum boleh terlihat | Pemicu perubahan | Hasil |
|---|---|---|---|---|
| Client awal | Client node diam, belum ada paket | Service yang dituju | Client mengetik nama domain | Paket lahir |
| DNS/IP transit | Paket bergerak ke node DNS, redup di awal | Port/edge policy | Paket tiba di DNS | IP ditemukan, cabang path menyala |
| Edge/firewall | Paket lewat gerbang edge dengan highlight port | Service internal | Port cocok kebijakan | Gate terbuka |
| Service aktif | Paket tiba di service manager, service node menyala | — | Paket diterima | Service memproses, lanjut Act 3 |

## Causal Motion Contract — Action Utama per Act (§1.T.1)

| Action id | Before | Pemicu/source | Jalur/process | Target & apply | After | Hold | SFX |
|---|---|---|---|---|---|---:|---|
| `request-masuk` (Act 2) | Client diam, DNS/edge/service redup | Client ketik domain | Paket: client→DNS→edge→service | Paket tiba di service, node menyala | Service aktif, path Act2 lengkap | 0.8s | whoosh, success |
| `service-lifecycle` (Act 3) | Service manager idle | Dependency/resource check | Highlight dependency graph | Process node menyala, resource bar terisi | Service running stabil | 1.0s | ui, success |
| `least-privilege-gate` (Act 4) | User policy vs data digambar terpisah | User request akses data | Kapsul user menuju gate akses | Gate granted/denied menyala | Akses tervisualisasi jelas | 0.9s | impact, success/error |
| `health-evidence` (Act 5) | Logs/metrics/alert terpisah, status tunggal belum cukup | Event pada service | Sinyal dari service ke timeline log/metric | Timeline gabung, alert muncul bila anomali | Bukti kesehatan terlihat menyatu | 1.2s | ui, warning |
| `change-rollback` (Act 6) | Versi lama berjalan stabil | Config/version change dipicu | Deployment card bergerak ke staging→prod | Rollback path menyala bila gagal | Backup/restore-test tervalidasi | 1.0s | transition, success/error |

## Layout Zone (§1.R, canvas 820×1340, scene-ui V1)

```
┌────────────────────────────────────┐
│ Header (y: 0–160)                  │  IntroHeaderMorphV1 — category/title/subtitle
├────────────────────────────────────┤
│ Navigation (y: 160–230)            │  ActBadgeNavigatorV1 — 7 dot
├────────────────────────────────────┤
│ Content / ContentBodyV1 (y: 230–1250) │
│   - Act 1: multi-bentuk compute (laptop/VM/cloud/mini-PC)
│   - Act 2: spine client→DNS→edge→service (FlowchartSpine)
│   - Act 3: service manager + dependency graph
│   - Act 4: user/data + least-privilege gate
│   - Act 5: logs/metrics/health-check timeline
│   - Act 6: deployment/rollback/backup card
│   - Act 7: scorecard (security/reliability/cost/docs)
├────────────────────────────────────┤
│ Reserved (y: 1250–1340)            │  progress bar, tease badge
└────────────────────────────────────┘
```

FlowchartSpine Act 2 (local coordinate `ContentBodyV1`, 0,0 = body.x/body.y):
Client `(120, 80)` → DNS `(410, 260)` → Edge/Firewall `(410, 460)` → Service `(410, 680)`.

## Checklist Eksekusi

- [x] Pre-planning: Series Identity Contract diisi
- [x] Pre-planning: Content State Contract (Act 2) diisi
- [x] Pre-planning: Causal Motion Contract (5 action utama) diisi
- [x] Pre-planning: Layout zone diagram + FlowchartSpine Act 2 diisi
- [x] Scene shell: scene-ui V1 dipilih, kriteria portrait 820×1340 terpenuhi
- [ ] Icon planning: audit elemen visual + `icons/icons.json` lengkap (belum — semua elemen direncanakan inline SVG dulu, sama seperti `44-ssh`, sampai terbukti perlu PNG)
- [x] Setup folder: `manifest.js` (Implemented — compile check OK)
- [x] Setup folder: `data.js` — VW/VH, COLORS, PHASES 7 Act, intro title, FlowchartSpine Act2, COPY, POSTURE_PILLARS (Implemented — compile check OK, 15 exports)
- [x] `metadata.json` disinkronkan (subtitle, tags) dengan `manifest.js` — verifikasi §10
- [x] Animation.jsx — Act 1: Server adalah peran (Implemented — compile OK, belum preview manual)
- [x] Animation.jsx — Act 2: Permintaan masuk (Implemented — compile OK, belum preview manual)
- [x] Animation.jsx — Act 3: Service bekerja (Implemented — compile OK, belum preview manual)
- [x] Animation.jsx — Act 4: Data dan identity (Implemented — compile OK, belum preview manual)
- [x] Animation.jsx — Act 5: Bukti kesehatan (Implemented — compile OK, belum preview manual)
- [x] Animation.jsx — Act 6: Perubahan dan pemulihan (Implemented — compile OK, belum preview manual)
- [x] Animation.jsx — Act 7: Server posture (scorecard) (Implemented — compile OK, belum preview manual)
- [ ] Sambungkan SFX real ke `scripts/export-lib.js` (`SFX_SCHEDULES`) — belum, timing detik per SFX perlu diambil dari timeline nyata (lihat catatan durasi Act di bawah)
- [ ] `caption.md` (narasi sosial media)
- [x] Dead field audit (`data.js` vs `Animation.jsx`) — `COPY` ditandai `// TODO: belum dirender`, semua field lain terpakai
- [ ] Checklist Sebelum Commit (03 §"Checklist Sebelum Commit")
- [ ] Checklist kontrak folder (02 §7)
