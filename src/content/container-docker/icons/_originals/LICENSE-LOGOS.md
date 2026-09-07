# Sumber & Lisensi Logo Asli

File PNG final (`node-icon.png`, `python-icon.png`, `redis-icon.png`,
`docker-engine-icon.png`) di folder induk (`icons/`) di-generate dari SVG
asli di folder ini.

| Icon | Sumber SVG asli | Lisensi | URL |
|---|---|---|---|
| node-icon | Devicon `nodejs-original.svg` | MIT | https://github.com/devicons/devicon |
| python-icon | Devicon `python-original.svg` | MIT | https://github.com/devicons/devicon |
| redis-icon | Devicon `redis-original.svg` | MIT | https://github.com/devicons/devicon |
| docker-engine-icon | Simple Icons `docker.svg` (fill di-set manual ke #2496ED, warna brand Docker) | CC0 | https://simpleicons.org/?q=docker |

Cara render SVG -> PNG: `scripts/svg-to-png.mjs` (pakai headless Chrome
via Puppeteer, karena ImageMagick bawaan tidak support SVG gradient).

`backup-ai-generated/` = versi lama hasil AI image-gen (generik, sengaja
menghindari trademark), disimpan sebagai arsip kalau suatu saat mau
balik ke versi generik lagi.
