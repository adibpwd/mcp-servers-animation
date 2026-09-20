# REVISI 03 — 91 Linux Server: Icon SVG Inline untuk Batch-4 dan AccessGate (Act 4)

| Item | Keputusan |
|---|---|
| Content | 91 — Linux Server: Sistem yang Menyediakan Layanan |
| Status | ✅ SUDAH DIEKSEKUSI (kode + compile). Belum dicek di preview browser |
| Tanggal | 2026-09-20 |
| Hubungan dengan revisi-02 | Pengganti SEMENTARA untuk PNG batch-4 yang ditahan (revisi-02 §4.2, item 3.2 "regenerate batch-4" tetap berlaku). Rencana PNG tidak diubah |
| File diubah | `Animation.jsx` saja. `loader.js`, `icons/`, `data.js`, `manifest.js` tidak diubah |

## 1. Umpan balik

| No | Umpan balik | Penyebab |
|---|---|---|
| 1 | Act 4: status `CLOSED` / `GRANTED` tidak ada icon | `AccessGate` hanya kotak polos + teks status |
| 2 | Act 6: staging, backup, restore tidak ada icon | 7 PNG batch-4 sengaja belum di-wire di `loader.js` (background bukan transparan), jadi `Icon` jatuh ke kotak dashed berlabel teks |

## 2. Perubahan

### 2.1 Fallback SVG inline di komponen `Icon`
Urutan render sekarang: PNG (kalau sudah di-wire di `loader.js`) → SVG inline (`SVG_ICONS`) → kotak dashed berlabel.
Begitu PNG batch-4 transparan sudah di-uncomment di `loader.js`, PNG otomatis menggantikan SVG; tidak ada yang perlu diubah lagi.

Pictogram SVG dibuat untuk ketujuh icon batch-4 (semua id yang dipakai kode):

| id | Dipakai di | Gambar |
|---|---|---|
| `staging-pad` | Act 6 | slab landasan + zona uji putus-putus + tiang + LED |
| `release-package` | Act 6 (`v2`/`v1`), Act 7 | kotak paket + tutup + pita |
| `backup-vault` | Act 6 | pintu vault + dial + salinan putus-putus di belakang |
| `restore-cycle` | Act 6 | panah melingkar berlawanan jarum jam + jam di tengah |
| `runbook-doc` | Act 6, Act 7 | dokumen berlipat + tiga baris checklist |
| `cpu-chip` | Act 7 (pilar Capacity) | die + inti + pin |
| `monitor-dashboard` | Act 5, Act 7 | layar + grid + batang + garis tren |

Warna mengikuti prop `color` yang sudah dipakai tiap pemanggilan (mis. `release-package` merah untuk v2 gagal, hijau untuk v1). Label teks fallback lama (`STAGING`, `BACKUP`, `RESTORE`, dst.) tidak tampil lagi, sama seperti icon PNG yang memang tanpa teks; makna tetap dibawa caption Act 6.

### 2.2 `AccessGate` (Act 4)
Gembok inline berubah menurut state:

| State | Tampilan |
|---|---|
| `closed` | gembok tertutup, abu-abu |
| `checking` | gembok tertutup + cincin putus-putus berputar |
| `granted` | gembok terbuka + centang, hijau |
| `denied` | gembok tertutup + tanda silang, merah |

Teks label status di bawah tetap ada.

## 3. Verifikasi
- `esbuild` compile `Animation.jsx`: lolos.
- Belum dicek visual di preview. Yang perlu dilihat: proporsi tiap SVG di ukuran pemakaian (mis. `monitor-dashboard` 320×140 di Act 5, `release-package` 44×34 di `ReleaseStack`), dan cincin `checking` tidak menabrak tepi kotak gate (60px lebar).

## 4. Di luar cakupan
- Chip `ALLOW` / `CLOSED` pada baris port firewall Act 2 tetap chip teks (bukan gate); belum diberi icon.
- Regenerate PNG batch-4 (revisi-02 item 3.2) masih pending.
