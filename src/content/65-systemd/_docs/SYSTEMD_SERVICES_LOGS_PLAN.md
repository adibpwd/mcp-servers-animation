# PLAN — 65 Services, systemd, dan Linux Logs

| Item | Nilai |
|---|---|
| Status | ✅ SUDAH DIEKSEKUSI (revisi-01, 2026-09-18) — lihat `revisi/2026-09-18-revisi-01-implementasi-awal.md`. Preview manual & export MP4 masih tertunda. |
| Produksi | Gabungan Content 65 (systemd) dan 67 (logs) |
| Audiens | Pemula yang sudah memahami process |
| Hasil belajar | Memahami service sebagai process yang dikelola systemd, serta log sebagai bukti lifecycle dan diagnosis. |

## Keputusan merge

Content 60 tetap menjelaskan process individual. Content 65 mengambil kelanjutan alami: service adalah workload yang perlu dimulai, dijaga, dihentikan, dan diamati. Content 67 diserap ke cerita yang sama karena journal/log menjawab “apa yang terjadi pada service itu?”. Tidak ada penghapusan metadata Content 67; lihat plan pengarah pada Content 67.

## Model mental

```
unit definition → systemd manager → service process → status/lifecycle
                                           ↓
                                    journal/log records
                                           ↓
                                    operator diagnosis
```

Systemd adalah init/service manager pada banyak distro Linux, bukan seluruh Linux dan bukan satu-satunya init system. Unit adalah objek konfigurasi yang dapat mewakili service, timer, socket, mount, target, dan lainnya. Fokus video: unit service.

## Batas aman

- Tidak memuat command runnable, file unit nyata, perubahan enable/disable, restart produksi, atau edit log.
- Tidak mengajarkan menjalankan service sebagai root tanpa kebutuhan.
- Jangan menyatakan semua distro memakai systemd atau semua log hanya berada pada satu file.
- Status active tidak selalu berarti aplikasi sehat; log, health check, dan konteks tetap perlu.

## Konsep yang dibahas

| Konsep | Penjelasan |
|---|---|
| Process vs service | Process adalah instance berjalan; service adalah workload yang dideklarasikan dan dikelola. |
| systemd dan PID 1 | Pada sistem systemd, manager memulai/mengawasi unit; PID dapat berubah saat service direstart. |
| Unit file | Deklarasi desired behavior, dependency, user, environment, dan lifecycle—bukan executable itu sendiri. |
| Lifecycle | Load → start → active/running → reload atau restart → stop → failed/inactive. |
| Enable vs start | Enable mengatur integrasi boot/target; start mengubah state saat ini. Keduanya tidak sama. |
| Dependency/order | Requirement dan ordering menentukan unit apa yang dibutuhkan dan kapan mulai. |
| Restart policy | Manager dapat mencoba memulihkan process, tetapi restart loop adalah sinyal yang perlu diperiksa. |
| Journal | Catatan event terstruktur yang dapat disaring menurut unit, waktu, boot, priority, atau field. |
| Log sources | App stdout/stderr, syslog-compatible sources, kernel, service manager, dan aplikasi sendiri. |
| Log rotation/retention | Penyimpanan log perlu batas ukuran/waktu; bukti audit dan kapasitas disk perlu diseimbangkan. |
| Diagnosis | Status menjawab kondisi ringkas; log memberi urutan kejadian dan error; metrics/health check melengkapi. |

## Storyboard: enam Act

| Act | Cerita | Payoff |
|---|---|---|
| 1 — Dari process ke service | Process web-demo hidup; unit definition memberi manager tujuan. | Service bukan sekadar nama process. |
| 2 — Manager lifecycle | systemd mengubah unit inactive → starting → active. | Manager menjaga lifecycle. |
| 3 — Boot dan dependency | Target boot memicu dependency/order map. | Enable berbeda dari start. |
| 4 — Ketika process gagal | Process berhenti; status berubah failed/restarting secara terbatas. | Active/failed adalah state yang perlu dibaca. |
| 5 — Jejak di log | stdout/stderr dan event manager masuk journal timeline. | Log menjelaskan apa dan kapan terjadi. |
| 6 — Diagnosis aman | Operator membaca status → log terfilter → waktu/boot/context. | Jangan menebak; ikuti bukti. |

## Kontrak state

| State | Terlihat | Belum boleh terlihat |
|---|---|---|
| declared | Unit definition + process belum aktif | Status active |
| starting | Manager mengirim start request | App sehat final |
| active | Service process + status ringkas | Klaim bebas error |
| failed | Exit/failure reason + limited restart policy | Recovery tanpa bukti |
| observed | Journal timeline dan filter | Log sebagai satu-satunya health signal |

## Log literacy

| Pertanyaan | Sumber pertama | Lanjutan |
|---|---|---|
| Apakah unit dikelola dan active? | Unit status | PID, recent state, dependency. |
| Kapan gagal atau direstart? | Journal timeline | Boot/time/priority filter. |
| Mengapa app gagal? | App stderr/application log | Config, dependency, resource, network context. |
| Apakah service benar-benar sehat? | Health check/metrics bila ada | Status dan log hanya satu bagian observability. |

## Anti-pattern yang wajib disebut

- Menganggap restart menyelesaikan akar masalah.
- Menghapus log demi “membersihkan error”.
- Menyalin unit file tanpa memahami user, path, dependency, dan environment.
- Menganggap PID adalah identitas service permanen.
- Menganggap enable berarti service sedang berjalan.

## Copy layar

- Service adalah process yang dikelola.
- Unit menyatakan perilaku yang diinginkan.
- Start dan enable memiliki arti berbeda.
- Status menunjukkan state; log menunjukkan kejadian.
- Restart loop perlu diagnosis.
- Bukti waktu membantu menemukan akar masalah.

## Acceptance criteria

- [ ] Process, service, unit, systemd, status, journal, dan application log dibedakan.
- [ ] Start versus enable, active versus healthy, dan PID versus service identity dijelaskan.
- [ ] Lifecycle, failure, restart policy, dependency/order, dan log timeline terlihat.
- [ ] Tidak ada command runnable atau perubahan service/log sistem.
- [ ] Content 67 diperlakukan sebagai bagian observability dari unit 65.

## Rencana file bila implementasi disetujui

| File | Rencana |
|---|---|
| 65-systemd/data.js | Unit/service states, journal events, dependency data, copy. |
| 65-systemd/Animation.jsx | Enam Act, lifecycle handoff, journal timeline, diagnosis map. |
| 65-systemd/caption.md | Caption gabungan services dan logs. |
| 67-linux-logs | Tidak dibuat animasi terpisah kecuali scope merge dibatalkan. |

