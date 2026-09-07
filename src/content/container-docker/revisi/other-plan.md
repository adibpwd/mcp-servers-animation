# Plan: Ganti Icon "Mirip Logo" (AI-generated) → Logo Asli — Topic Lain

**Scope: SEMUA topic KECUALI `container-docker`.** Plan untuk
container-docker ada di `revisi/2026-09-07-0802-revisi-01.md` di folder
yang sama.

**Masalah & solusi umum**: sama seperti di revisi-01 — icon brand di
project ini di-generate lewat ChatGPT image gen (`vm-icon-generator`
extension), sengaja generik untuk hindari trademark, tapi hasilnya kurang
akurat untuk logo brand yang audiens sudah familiar. Solusi: ambil file
logo asli (SVG/PNG resmi) dari sumber terpercaya, drop-in replace ke
folder `icons/` masing-masing topic.

## 1. Audit — Icon yang Perlu Logo Asli

### linux-vs-unix/icons/ (paling banyak, 20 logo brand)

Semua ini di-generate AI dengan niat "seakurat mungkin" tapi tetap hasil AI
image-gen, bukan file asli:

`macos, solaris, aix, hpux, freebsd, bsd-daemon, android, ubuntu, fedora,
arch, debian, windows, bell-labs-v2, c-language-v2, slackware, redhat,
suse, gentoo, centos, mint, manjaro, popos, tux, gnu-fsf`

(`pdp7, posix, distro-tree, cloud-server, supercomputer, wsl-bridge,
terminal-hacker, linus` tetap generik/ilustratif, tidak perlu logo asli —
itu bukan brand mark.)

### desktop-environment/icons/

`gnome-logo, kde-logo, xfce-logo` — sama, diniatkan akurat tapi hasil AI.

### tailscale/icons/

`tailscale-logo` — sengaja dibuat generik ("NOT the real Tailscale
trademark") karena Tailscale itu produk komersial aktif, bukan project
open-source/bahasa umum. Risiko trademark lebih tinggi dari logo bahasa
pemrograman/distro Linux. Saran: biarkan generik, kecuali kamu memang
ingin pakai logo resmi Tailscale.

## 2. Sumber Logo Asli

| Kategori | Sumber utama | Format | Lisensi |
|---|---|---|---|
| Distro Linux & OS (Ubuntu, Debian, Fedora, Arch, dst) | Simple Icons dulu (banyak distro ada), fallback Wikimedia Commons utk yang tak ada (AIX, HP-UX, Solaris, Slackware lama) | SVG/PNG | CC0 (Simple Icons) / cek lisensi per file di Wikimedia (umumnya PD/fair-use logo) |
| Desktop environment (GNOME, KDE, XFCE) | Simple Icons (`gnome`, `kde`, `xfce`) | SVG | CC0 |
| Tailscale (kalau jadi dipakai) | Simple Icons (`tailscale`) | SVG monokrom | CC0 |

**Catatan**: Simple Icons monokrom (single path), cocok karena semua icon
di `linux-vs-unix`/`desktop-environment` dipakai dalam gaya
flat/monochrome — beda dengan `container-docker` yang butuh full-color
(pakai Devicon, lihat revisi-01).

Metode download (via `Desktop Commander:start_process`, bukan sandbox
Claude karena `cdn.jsdelivr.net`/`commons.wikimedia.org` tidak termasuk
domain yang di-allow sandbox) dan cara convert SVG→PNG sama persis
seperti yang dijelaskan di revisi-01 §3-4 — tidak diulang di sini.

## 3. Urutan Eksekusi (checklist)

### Phase C — desktop-environment (gnome, kde, xfce)

- [ ] Download gnome-logo, kde-logo, xfce-logo dari Simple Icons
- [ ] Convert & recolor monokrom sesuai style guide topic ini
- [ ] Cek render di dock/taskbar mockup
- [ ] Commit: `fix(icons): replace desktop-environment DE logos with real logos`

### Phase D — linux-vs-unix (20 logo, kerjain per-batch)

- [ ] Batch OS: macos, solaris, aix, hpux, freebsd, bsd-daemon, android, windows
- [ ] Batch distro: ubuntu, fedora, arch, debian, slackware, redhat, suse,
      gentoo, centos, mint, manjaro, popos
- [ ] Batch sisanya: bell-labs-v2, c-language-v2, tux, gnu-fsf
- [ ] Cek render tiap batch sebelum lanjut ke batch berikutnya
- [ ] Commit per-batch: `fix(icons): replace linux-vs-unix <batch> logos with real logos`

### Phase E — tailscale-logo (skip, kecuali dikonfirmasi)

- [ ] Konfirmasi: mau ganti logo resmi Tailscale, atau tetap generik? (default: tetap generik)

## 4. Yang TIDAK saya lakukan otomatis

- Saya tidak akan generate/gambar ulang logo pakai AI (itu sumber masalahnya).
- Saya tidak akan pakai logo dari sumber tak jelas lisensinya — hanya
  Simple Icons / Devicon / Wikimedia yang jelas boleh dipakai utk
  identifikasi brand.
- `tailscale-logo` saya skip dari eksekusi otomatis kecuali kamu
  konfirmasi mau pakai logo resmi (trademark-nya lebih sensitif krn
  produk komersial aktif).

**Next**: konfirmasi mau mulai dari Phase C (desktop-environment), atau
langsung Phase D (linux-vs-unix, per-batch).
