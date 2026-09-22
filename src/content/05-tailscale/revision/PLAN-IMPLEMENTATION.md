# Plan — Implementasi Icon PNG ke `Animation.jsx` (Tailscale)

**Status**: PLANNING ONLY — belum ada kode yang diubah. Ini lanjutan dari
`PLAN-ICONS.md` (yang sudah dieksekusi: `icons.json` dibuat + 6 PNG sudah
di-generate lewat extension).

## 0. Hasil Cek Status Saat Ini

- ✅ `src/content/tailscale/icons/icons.json` — ada
- ✅ 6 file PNG hasil generate — ada semua: `wireguard-key.png`,
  `coordination-server.png`, `derp-relay.png`, `mesh-network.png`,
  `tailscale-logo.png`, `mobile-phone.png`
- ❌ `src/content/tailscale/icons/loader.js` — **belum ada**
- ❌ `Animation.jsx` — **belum ada** `import { getIcon }`, **belum ada**
  `<image href=...>` sama sekali. Masih 100% shape SVG manual.

**Kesimpulan: icon sudah di-generate tapi 0% terpasang ke animasi.**

## 1. File Baru: `icons/loader.js`

Mengikuti pola persis `virtual-memory/icons/loader.js`:

```js
// Icon loader utility for Tailscale animation
import wireguardKeyIcon from './wireguard-key.png'
import coordinationServerIcon from './coordination-server.png'
import derpRelayIcon from './derp-relay.png'
import meshNetworkIcon from './mesh-network.png'
import tailscaleLogoIcon from './tailscale-logo.png'
import mobilePhoneIcon from './mobile-phone.png'

export const ICONS = {
  'wireguard-key': wireguardKeyIcon,
  'coordination-server': coordinationServerIcon,
  'derp-relay': derpRelayIcon,
  'mesh-network': meshNetworkIcon,
  'tailscale-logo': tailscaleLogoIcon,
  'mobile-phone': mobilePhoneIcon,
}

export function getIcon(id) {
  return ICONS[id] || null
}
```

## 2. Import Baru di `Animation.jsx`

Tambah 1 baris di bagian import (setelah `import sfxLoader ...`):

```js
import { getIcon } from './icons/loader'
```

## 3. Titik Penggantian di JSX (6 lokasi)

Semua icon dipasang lewat `<image href={getIcon('id')} x=... y=... width=... height=... />`
di **dalam** `<g>` yang sudah ada transform pop-in (`T()`/`O()`) — jadi timeline GSAP
(`popIn`, sfx, timing) **tidak perlu diubah sama sekali**, cuma isi child SVG-nya diganti.

Karena `<image>` di SVG di-posisikan dari pojok kiri-atas (bukan center kayak
`<circle r=...>`), tiap penggantian butuh offset `x = -width/2, y = -height/2` supaya
tetap center di titik yang sama.

### 3.1. `wireguard-key` — Act 2, 4 lokasi
Ganti `<KeyToken x={0} y={0} locked={...} />` jadi `<image href={getIcon('wireguard-key')} x={-16} y={-16} width={32} height={32} />` di 4 grup:
`pubKeyHome`, `privKeyHome`, `pubKeyOffice`, `privKeyOffice`.
Teks label "PUBLIC"/"PRIVATE" di bawahnya **tetap dipertahankan** (tidak dihapus).

### 3.2. `tailscale-logo` — Act 2, 2 lokasi
Ganti isi `<g transform={T('installIconHome', 150, 60)}>` (lingkaran+huruf "T") dan
pasangannya `installIconOffice` jadi `<image href={getIcon('tailscale-logo')} x={-18} y={-18} width={36} height={36} />`.

### 3.3. `coordination-server` — Act 3, 1 lokasi
Di dalam `<ServerBox x={0} y={0} label="COORDINATION SERVER" color={COLORS.SERVER} w={260} />`
— tambah `<image href={getIcon('coordination-server')} .../>` sebagai aksen icon kecil
di pojok/tengah box (ServerBox tetap dipakai sebagai frame/label, icon nempel di atasnya).

### 3.4. `derp-relay` — Act 4, 1 lokasi
Sama pola dengan 3.3, tapi di `<ServerBox x={0} y={0} label="DERP RELAY SERVER" color={COLORS.RELAY} w={240} />`.
Ini penting supaya visual DERP relay **beda jelas** dari coordination server
(sebelumnya dua-duanya pakai `ServerBox` polos yang identik, cuma beda warna label).

### 3.5. `mobile-phone` — Act 5, 1 lokasi
Ganti `<rect x={-16} y={-28} width={32} height={56} rx={8} .../>` (device HP manual)
jadi `<image href={getIcon('mobile-phone')} x={-16} y={-28} width={32} height={56} />`
di dalam grup `meshPhone`.

### 3.6. `mesh-network` — Act 5, elemen BARU (opsional)
Belum ada elemen existing yang cocok diganti — ini aksen baru. Rencana: tempel
sebagai badge kecil di tengah area mesh (misal dekat garis-garis `meshLine-*`)
buat mempertegas konsep "network graph". **Opsional**, bisa di-skip kalau setelah
dicoba keliatan kepenuhan (Act 5 sudah banyak elemen: laptop, HP, cloud, face, badge).

## 4. Yang TIDAK Diubah

Semua shape vector lain (`Laptop`, `HouseFrame`, `BuildingFrame`, `CloudShape`,
`FirewallWall`, `Badge`, `SpeechBubble`, `FaceReact`) **tetap seperti sekarang** —
tidak diganti icon PNG, sesuai keputusan awal di `PLAN-ICONS.md` § 2.

## 5. Risiko / Hal yang Perlu Dicek Saat Eksekusi Nanti

- **Bundling Vite**: pastikan import `.png` di `loader.js` ke-resolve dengan benar
  lewat Vite asset pipeline (harus sama seperti `virtual-memory`, yang sudah terbukti
  jalan) — tidak perlu konfigurasi tambahan karena pola identik.
- **Sizing per icon**: ukuran `width`/`height` di draft (§3) masih perkiraan
  berdasarkan ukuran shape lama yang digantikan. Perlu cek visual langsung setelah
  dipasang (kemungkinan perlu tuning ±beberapa px).
- **`ServerBox` jadi generic**: kalau mau rapi, `ServerBox` komponennya sendiri bisa
  ditambah prop opsional `icon` (misal `<ServerBox icon="coordination-server" .../>`)
  supaya reusable untuk 2 kasus (§3.3 & §3.4) tanpa duplikasi kode — ini keputusan
  implementasi, bukan wajib.
- **Export/render pipeline (Puppeteer/FFmpeg)**: perlu dicek apakah `<image href>`
  ke asset Vite-bundled ke-render dengan benar saat export video (sama seperti
  `virtual-memory` yang sudah export duluan tanpa masalah — kemungkinan besar aman).

## 6. Status Eksekusi (2026-09-05)

- [x] Buat `src/content/tailscale/icons/loader.js` (§ 1) — DONE
- [x] Tambah `import { getIcon } from './icons/loader'` di `Animation.jsx` (§ 2) — DONE
- [x] § 3.1 `wireguard-key` — 4 lokasi (pubKeyHome, privKeyHome, pubKeyOffice, privKeyOffice) — DONE
- [x] § 3.2 `tailscale-logo` — 2 lokasi (installIconHome, installIconOffice) — DONE
- [x] § 3.3 `coordination-server` — aksen icon di `ServerBox` Act 3 — DONE
- [x] § 3.4 `derp-relay` — aksen icon di `ServerBox` Act 4 — DONE
- [x] § 3.5 `mobile-phone` — ganti rect manual HP Act 5 — DONE
- [ ] § 3.6 `mesh-network` — **DI-SKIP** untuk sekarang. Butuh entry `popIn()` baru di
      timeline GSAP Act 5 (elemen baru, bukan pengganti elemen existing) dan berisiko
      bikin Act 5 kepenuhan (sudah ada laptop, HP, cloud, face, badge). Bisa
      dikerjakan menyusul kalau memang mau ditambahkan.
- [x] Verifikasi: `grep getIcon` di `Animation.jsx` → 9 pemanggilan `<image>` ketemu ✅
- [x] Verifikasi: frontend `http://localhost:3373` tetap 200, tidak ada error/fail di
      `docker compose logs` ✅
- [ ] Belum di-cek visual manual di browser (buka preview topic Tailscale) — icon
      bisa aja perlu tuning ukuran/posisi setelah dilihat langsung
- [ ] Belum di-test export video

**5 dari 6 icon sudah tersambung ke `Animation.jsx`. `mesh-network` masih pending
(opsional, lihat catatan di atas).**
