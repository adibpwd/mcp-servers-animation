# PLAN — 46 Ping & Traceroute: Menemukan Letak Jaringan Tersendat

| Item | Nilai |
|---|---|
| Status | 📝 PLAN ONLY |
| Audiens | Pengguna Linux yang ingin mendiagnosa koneksi jaringan lambat atau putus secara presisi. |
| Audience promise | Memahami protokol ICMP Echo, perhitungan latensi RTT (Round Trip Time), dan cara `traceroute` memakai TTL router. |
| Scene shell | scene-ui V1 portrait 820×1340: IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1. |

## Series Identity
- **Seri**: Linux Fundamentals — Networking & Troubleshooting
- **Title Segments**: `PING &` (Cyan `#38BDF8`) + ` TRACEROUTE` (Emerald `#34D399`)
- **Prasyarat**: 81 Network Interface, 19 Network Ports.

## Model Mental
- **`ping` (Echo Request/Reply):** Seperti memantulkan bola ke dinding untuk menguji: "Apakah server seberang hidup, dan berapa lama bola memantul kembali (latensi)?".
- **`traceroute` (Hop by Hop):** Memanfaatkan batas umur paket (TTL = Time To Live). Setiap router yang dilewati mengurangi TTL sebanyak 1. Ketika TTL habis (`TTL Expired in Transit`), router mengirim sinyal balik, membuka identitas setiap pos perhentian jalur internet.

## Storyboard (4 Act)
1. **Act 1: Website Tidak Merespons — Siapa yang Salah?**
   - Browser timeout. Kita perlu mendiagnosa apakah masalah ada di WiFi lokal, ISP, atau server tujuan.
2. **Act 2: Memantulkan Bola dengan `ping`**
   - Mengirim paket ICMP Echo. Mengukur RTT (misal: 15ms stabil vs 500ms jittering atau 100% packet loss).
3. **Act 3: Trik Cerdas `traceroute` & TTL (Time To Live)**
   - Paket 1 dikirim dengan `TTL=1` ➔ Mati di Router 1 (IP Router 1 tercatat).
   - Paket 2 dikirim dengan `TTL=2` ➔ Mati di Router 2 (IP Router 2 tercatat).
   - Paket 3 dikirim dengan `TTL=3` ➔ Sampai di server tujuan.
4. **Act 4: Menemukan Titik Putus / Firewall Drop**
   - Menunjukkan baris `* * * Request timed out` di hop ke-5: mengidentifikasi lokasi persis kabel putus atau firewall ISP yang memblokir trafik.
