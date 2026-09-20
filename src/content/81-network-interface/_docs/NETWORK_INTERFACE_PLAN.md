# PLAN — 81 Network Interface: Identitas Koneksi Linux

| Item | Nilai |
|---|---|
| Status | PLAN ONLY — jangan dieksekusi |
| Audiens | Pemula Linux yang memahami device dan jaringan dasar |
| Hasil belajar | Memahami interface sebagai titik koneksi OS, serta relasi link, MAC, IP, route, DNS, dan state konektivitas. |

## Audience promise

Penonton dapat membedakan “interface aktif” dari “internet berfungsi”: kabel/Wi-Fi,
IP address, default route, DNS, dan layanan tujuan adalah lapisan pemeriksaan
yang berbeda.

## Model mental

```
application → DNS/name → route/default gateway → network interface → link/Wi-Fi
                                                         ↓
                                                     MAC + IP
```

Interface adalah representasi koneksi jaringan pada OS. Ia dapat fisik,
wireless, virtual, loopback, bridge, VLAN, tunnel, atau container interface.

## Konsep inti

| Konsep | Penjelasan |
|---|---|
| Interface name | Label OS untuk adapter/jalur jaringan; nama dapat berbeda antar sistem. |
| Link state | Koneksi fisik/Wi-Fi carrier; link up tidak menjamin IP, route, DNS, atau internet. |
| MAC address | Identitas link-layer yang umumnya relevan pada jaringan lokal, bukan alamat internet global. |
| IP address/prefix | Identitas layer jaringan dan cakupan subnet; IPv4/IPv6 dapat hidup bersamaan. |
| DHCP/static | Cara konfigurasi alamat; DHCP dapat juga memberi gateway/DNS/lease. |
| Loopback | Jalur mesin ke dirinya sendiri; tidak berarti jaringan luar aktif. |
| Default gateway/route | Keputusan ke mana paket keluar untuk tujuan di luar subnet. |
| DNS | Mengubah nama menjadi address; bukan bagian yang sama dengan interface. |
| Virtual interfaces | Bridge, VLAN, VPN/tunnel, container dapat membuat jalur tanpa kartu fisik tambahan. |
| Network manager | Tool/layer distro yang mengatur koneksi; bukan protokol jaringan itu sendiri. |

## Batas aman

- Tidak ada IP/MAC nyata, perintah konfigurasi, perubahan route, Wi-Fi password, atau tindakan network reset.
- Jangan menyatakan satu nama interface berlaku di semua distro.
- Jangan menyamakan MAC dengan IP atau menganggap interface up berarti server dapat dijangkau.

## Storyboard: enam Act

| Act | Cerita | Payoff |
|---|---|---|
| 1 — Titik koneksi | Laptop memiliki wired, Wi-Fi, dan loopback cards. | Interface adalah titik OS ke jaringan. |
| 2 — Link dan identity | Cable/Wi-Fi link, MAC, IP/prefix muncul berlapis. | MAC dan IP berada pada peran berbeda. |
| 3 — Mendapat konfigurasi | DHCP/static decision memberi address, gateway, DNS. | IP saja belum melengkapi koneksi. |
| 4 — Memilih jalan | Paket ke subnet lokal atau default gateway memakai route map. | Gateway/route menentukan arah keluar. |
| 5 — Nama ke tujuan | DNS name menjadi address, kemudian interface route dipilih. | DNS bukan internet dan bukan interface. |
| 6 — Interface virtual | Loopback, bridge/VLAN/VPN/container masuk sebagai jalur virtual. | Tidak semua interface adalah kartu fisik. |

## Kontrak diagnosis konseptual

| Gejala | Lapisan yang diperiksa | Jangan langsung simpulkan |
|---|---|---|
| Tidak ada carrier | Link/interface | Bukan otomatis masalah DNS. |
| Ada link, tanpa address | Konfigurasi DHCP/static | Bukan otomatis firewall. |
| Ada address, tujuan luar gagal | Route/gateway | Bukan otomatis aplikasi rusak. |
| Address berfungsi, nama gagal | DNS | Bukan otomatis internet putus. |
| Semua dasar ada, layanan gagal | Port/service/security | Masuk Content 84 dan 91. |

## Copy layar

- Interface adalah titik koneksi OS.
- Link up belum tentu internet siap.
- MAC dan IP punya peran berbeda.
- Gateway memilih jalan keluar.
- DNS menerjemahkan nama, bukan membawa paket.
- Jalur virtual juga interface.

## Acceptance criteria

- [ ] Menjelaskan physical, wireless, loopback, dan virtual interface.
- [ ] Membedakan link, MAC, IP/prefix, DHCP/static, route/gateway, dan DNS.
- [ ] Menunjukkan diagnosis berlapis tanpa command atau perubahan network.
- [ ] Menyiapkan transisi ke port/service pada Content 84.

