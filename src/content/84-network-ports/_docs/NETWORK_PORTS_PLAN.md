# PLAN — 84 Network Ports: Pintu Layanan, Bukan Pintu Mesin

| Item | Nilai |
|---|---|
| Status | PLAN ONLY — jangan dieksekusi |
| Audiens | Pemula yang sudah memahami IP, interface, dan client-server |
| Hasil belajar | Memahami port sebagai endpoint transport yang mengarahkan koneksi ke service, serta memahami listener, TCP/UDP, firewall, dan scope exposure. |

## Audience promise

Penonton dapat membedakan IP address yang memilih mesin dengan port yang memilih
layanan, dan tahu bahwa port terbuka belum cukup membuktikan aplikasi sehat atau
aman.

## Model mental

```
client app → destination IP → TCP/UDP → destination port → listener/service
                                                ↓
                                        firewall/security policy
```

Port adalah nomor endpoint layer transport, bukan lubang fisik dan bukan
identitas aplikasi global. Source port umumnya bersifat sementara; destination
port dapat memakai nilai umum atau nilai yang dikonfigurasi sendiri.

## Konsep inti

| Konsep | Penjelasan |
|---|---|
| IP versus port | IP memilih host/interface tujuan; port membantu transport memilih service pada host itu. |
| Socket | Kombinasi protocol, address, port, dan state yang mengidentifikasi endpoint/connection. |
| Listener | Process/service yang bind dan menerima koneksi pada address/port/protocol tertentu. |
| TCP | Connection-oriented; handshake, state, reliability/order pada tingkat transport. |
| UDP | Datagram-oriented; tidak memiliki handshake TCP dan aplikasi menangani kebutuhan reliability sendiri. |
| Source/destination port | Client biasanya memakai ephemeral source port; server sering menyediakan destination listener. |
| Bind scope | Loopback, private interface, atau all-interface binding mengubah siapa yang dapat menjangkau service. |
| Firewall | Policy yang mengizinkan/menolak trafik; terpisah dari apakah process sedang listen. |
| NAT/proxy/load balancer | Dapat memetakan atau meneruskan traffic; address/port publik tidak selalu sama dengan backend. |
| TLS/application protocol | Port tidak membuktikan enkripsi, identitas, atau kesehatan aplikasi. |

## Batas aman

- Tidak ada scanning, enumeration, firewall change, port forwarding, exploit, atau target nyata.
- Jangan mengklaim port 22/80/443 bersifat wajib atau selalu aman.
- “Open” perlu selalu diberi konteks: listen di mana, dari jaringan mana, melalui policy apa, dan service apa.

## Storyboard: enam Act

| Act | Cerita | Payoff |
|---|---|---|
| 1 — Host bukan service | Client memilih IP server lalu melihat banyak pintu bernomor. | IP dan port memecahkan masalah berbeda. |
| 2 — Listener menerima | Web and SSH demo listeners menempel pada process cards. | Service harus listen agar dapat menerima koneksi. |
| 3 — TCP dan UDP | TCP handshake lane dibandingkan dengan UDP datagram lane. | Protocol mengubah bentuk komunikasi. |
| 4 — Dua ujung koneksi | Ephemeral source port client bertemu destination port server. | Satu koneksi punya endpoint di kedua sisi. |
| 5 — Scope dan firewall | Loopback/private/all-interface plus policy gate. | Listen dan allowed bukan hal sama. |
| 6 — Jalur nyata | NAT/proxy/load balancer memetakan public endpoint ke backend; service health check muncul. | Port terbuka bukan bukti aplikasi sehat/aman. |

## Diagnosis konseptual

| Pertanyaan | Lapisan |
|---|---|
| Host dapat dijangkau? | Interface, route, DNS. |
| Ada listener pada protocol/address/port yang tepat? | Process/service/socket. |
| Policy mengizinkan jalur itu? | Firewall/security group/network policy. |
| Traffic dipetakan oleh proxy/NAT/load balancer? | Edge/routing layer. |
| Aplikasi memberi respons yang valid? | Application protocol, TLS, health. |

## Copy layar

- IP memilih host; port memilih layanan.
- Listener menerima koneksi untuk service.
- TCP dan UDP tidak berperilaku sama.
- Source port dan destination port berbeda peran.
- Firewall dan listener adalah dua pemeriksaan.
- Open port belum berarti service sehat.

## Acceptance criteria

- [ ] Membedakan IP, port, socket, listener, protocol, source/destination port.
- [ ] Menjelaskan TCP/UDP, bind scope, firewall, NAT/proxy, dan health secara proporsional.
- [ ] Tidak ada contoh scanning, perubahan rule, atau target nyata.
- [ ] Menghubungkan ports ke SSH dan Linux server tanpa mengulang materi mereka.

