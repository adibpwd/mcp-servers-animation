# Sumber & Lisensi Logo Distro (Install Applications)

File PNG final (`ubuntu-logo.png`, `debian-logo.png`, `fedora-logo.png`,
`arch-logo.png`, `opensuse-logo.png`, `alpine-logo.png`) di folder induk
(`icons/`) di-generate dari SVG asli di folder ini (`*-original.svg`),
diwarnai dengan hex resmi brand masing-masing (`*-colored.svg`), lalu
dirender ke PNG lewat `scripts/svg-to-png.mjs` (headless Chrome/Puppeteer,
transparent background, 300x300 @2x).

| Icon (runtime id) | Distro | Sumber asli | Lisensi | URL | Access date |
|---|---|---|---|---|---|
| ubuntu-logo | Ubuntu | Simple Icons `ubuntu.svg` (hex resmi #E95420) | CC0-1.0 | https://github.com/simple-icons/simple-icons | 2026-09-19 |
| debian-logo | Debian | Simple Icons `debian.svg` (hex resmi #A81D33) | CC0-1.0 | https://github.com/simple-icons/simple-icons | 2026-09-19 |
| fedora-logo | Fedora | Simple Icons `fedora.svg` (hex resmi #51A2DA) | CC0-1.0 | https://github.com/simple-icons/simple-icons | 2026-09-19 |
| arch-logo | Arch Linux | Simple Icons `archlinux.svg` (hex resmi #1793D1) | CC0-1.0 | https://github.com/simple-icons/simple-icons | 2026-09-19 |
| opensuse-logo | openSUSE | Simple Icons `opensuse.svg` (hex resmi #73BA25) | CC0-1.0 | https://github.com/simple-icons/simple-icons | 2026-09-19 |
| alpine-logo | Alpine Linux | Simple Icons `alpinelinux.svg` (hex resmi #0D597F) | CC0-1.0 | https://github.com/simple-icons/simple-icons | 2026-09-19 |

- Prioritas asli: official brand/media page. Untuk enam distro ini
  dipakai fallback yang sudah disetujui: Simple Icons (CC0-1.0), sumber
  yang sama seperti `docker-engine-icon` di topic container-docker
  (lihat src/content/10-container-docker/icons/_originals/LICENSE-LOGOS.md).
- Warna: hex resmi per-brand dari dataset Simple Icons (bukan warna
  tebakan), lihat kolom "Sumber asli" di atas.
- Proses: `*-original.svg` = file mentah dari Simple Icons, TIDAK
  dimodifikasi. `*-colored.svg` = original + fill warna resmi (satu-
  satunya modifikasi, karena source SVG-nya path polos tanpa fill).
  `*-logo.png` di folder icons/ = hasil rasterize `*-colored.svg`.
- Tidak ada stretch/crop/recolor di luar penambahan fill resmi di atas;
  tidak menyiratkan endorsement dari distro terkait (dipakai murni
  sebagai identifikasi visual, sama seperti precedent Docker/Node/
  Python/Redis di topic container-docker).
