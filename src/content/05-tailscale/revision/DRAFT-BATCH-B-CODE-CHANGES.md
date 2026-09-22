# DRAFT — Batch B Code Changes (belum aktif)

**Status**: DRAFT, disimpan terpisah dari `loader.js` & `Animation.jsx` yang live.
Jangan diterapkan sebelum 11 PNG di bawah ini sudah digenerate & ada di
`src/content/tailscale/icons/`. Kalau diterapkan sekarang, `import ... from
'./xxx.png'` di loader.js akan gagal build karena file belum ada.

## Prasyarat sebelum apply
Jalankan generation `icons.json` → `generation.batch_b` (1x panggilan API,
grid 4x4) via extension, lalu pastikan 11 file ini ada:

```
cloud-internet.png
firewall-normal.png
firewall-strict.png
face-surprised.png
face-happy.png
house-frame.png
building-frame.png
laptop-danger.png
laptop-crypto.png
laptop-server.png
laptop-success.png
```

---

## 1. Full replacement untuk `icons/loader.js`

```javascript
// Icon loader utility for Tailscale animation
// Import all icons as assets

import wireguardKeyIcon from './wireguard-key.png'
import coordinationServerIcon from './coordination-server.png'
import derpRelayIcon from './derp-relay.png'
import meshNetworkIcon from './mesh-network.png'
import tailscaleLogoIcon from './tailscale-logo.png'
import mobilePhoneIcon from './mobile-phone.png'

// NEW — structural icons (Batch B)
import cloudInternetIcon from './cloud-internet.png'
import firewallNormalIcon from './firewall-normal.png'
import firewallStrictIcon from './firewall-strict.png'
import faceSurprisedIcon from './face-surprised.png'
import faceHappyIcon from './face-happy.png'
import houseFrameIcon from './house-frame.png'
import buildingFrameIcon from './building-frame.png'
import laptopDangerIcon from './laptop-danger.png'
import laptopCryptoIcon from './laptop-crypto.png'
import laptopServerIcon from './laptop-server.png'
import laptopSuccessIcon from './laptop-success.png'

export const ICONS = {
  'wireguard-key': wireguardKeyIcon,
  'coordination-server': coordinationServerIcon,
  'derp-relay': derpRelayIcon,
  'mesh-network': meshNetworkIcon,
  'tailscale-logo': tailscaleLogoIcon,
  'mobile-phone': mobilePhoneIcon,
  // NEW:
  'cloud-internet': cloudInternetIcon,
  'firewall-normal': firewallNormalIcon,
  'firewall-strict': firewallStrictIcon,
  'face-surprised': faceSurprisedIcon,
  'face-happy': faceHappyIcon,
  'house-frame': houseFrameIcon,
  'building-frame': buildingFrameIcon,
  'laptop-danger': laptopDangerIcon,
  'laptop-crypto': laptopCryptoIcon,
  'laptop-server': laptopServerIcon,
  'laptop-success': laptopSuccessIcon,
}

export function getIcon(id) {
  return ICONS[id] || null
}
```

---

## 2. Hapus definisi komponen SVG di `Animation.jsx`

Hapus BLOK berikut secara utuh (setelah `T`/`O` helper, sebelum `SpeechBubble`):

- `const Laptop = ({ x, y, color = COLORS.TEXT, scale = 1 }) => (...)`
- `const HouseFrame = ({ x, y }) => (...)`
- `const BuildingFrame = ({ x, y }) => (...)`
- `const CloudShape = ({ x, y, label = 'INTERNET', color = COLORS.MUTED }) => (...)`
- `const FirewallWall = ({ x, y, strict = false }) => (...)`
- `const FaceReact = ({ x, y, mood = 'surprised', color = '#FBBF24' }) => (...)`

**JANGAN hapus**: `Badge`, `SpeechBubble`, `KeyToken`, `ServerBox`, `wrapText`
(layout primitive, tetap dipakai).

---

## 3. Replace tiap usage (edit_block old_string → new_string)

### 3.1 Act 1 — houseBox
```
OLD:
            <g transform={T('houseBox', 150, 170)} opacity={O('houseBox')}>
              <HouseFrame x={0} y={0} />
              <Laptop x={0} y={0} color={COLORS.DANGER} />
              <text textAnchor="middle" y={52} fill={COLORS.TEXT} fontSize={14} fontWeight={700}>{DEVICES.home.label}</text>
              <text textAnchor="middle" y={68} fill={COLORS.MUTED} fontSize={11}>{DEVICES.home.sub}</text>
            </g>

NEW:
            <g transform={T('houseBox', 150, 170)} opacity={O('houseBox')}>
              <image href={getIcon('house-frame')} x={-55} y={-108} width={110} height={108} />
              <image href={getIcon('laptop-danger')} x={-34} y={-24} width={68} height={44} />
              <text textAnchor="middle" y={52} fill={COLORS.TEXT} fontSize={14} fontWeight={700}>{DEVICES.home.label}</text>
              <text textAnchor="middle" y={68} fill={COLORS.MUTED} fontSize={11}>{DEVICES.home.sub}</text>
            </g>
```

### 3.2 Act 1 — officeBox
```
OLD:
            <g transform={T('officeBox', 582, 170)} opacity={O('officeBox')}>
              <BuildingFrame x={0} y={0} />
              <Laptop x={0} y={0} color={COLORS.DANGER} />
              <text textAnchor="middle" y={52} fill={COLORS.TEXT} fontSize={14} fontWeight={700}>{DEVICES.office.label}</text>
              <text textAnchor="middle" y={68} fill={COLORS.MUTED} fontSize={11}>{DEVICES.office.sub}</text>
            </g>

NEW:
            <g transform={T('officeBox', 582, 170)} opacity={O('officeBox')}>
              <image href={getIcon('building-frame')} x={-52} y={-100} width={104} height={125} />
              <image href={getIcon('laptop-danger')} x={-34} y={-24} width={68} height={44} />
              <text textAnchor="middle" y={52} fill={COLORS.TEXT} fontSize={14} fontWeight={700}>{DEVICES.office.label}</text>
              <text textAnchor="middle" y={68} fill={COLORS.MUTED} fontSize={11}>{DEVICES.office.sub}</text>
            </g>
```

### 3.3 Act 1 — wallHome / wallOffice
```
OLD: <g transform={T('wallHome', 250, 170)} opacity={O('wallHome')}><FirewallWall x={0} y={0} /></g>
     <g transform={T('wallOffice', 500, 170)} opacity={O('wallOffice')}><FirewallWall x={0} y={0} /></g>

NEW: <g transform={T('wallHome', 250, 170)} opacity={O('wallHome')}><image href={getIcon('firewall-normal')} x={-8} y={-70} width={16} height={140} /></g>
     <g transform={T('wallOffice', 500, 170)} opacity={O('wallOffice')}><image href={getIcon('firewall-normal')} x={-8} y={-70} width={16} height={140} /></g>
```

### 3.4 Act 1 — cloudInternet
```
OLD:
            <g transform={T('cloudInternet', 366, 40)} opacity={O('cloudInternet')}>
              <CloudShape x={0} y={0} color={COLORS.MUTED} />
            </g>

NEW:
            <g transform={T('cloudInternet', 366, 40)} opacity={O('cloudInternet')}>
              <image href={getIcon('cloud-internet')} x={-38} y={-24} width={76} height={48} />
              <text textAnchor="middle" y={8} fill={COLORS.MUTED} fontSize={11} fontFamily="monospace" fontWeight={700}>INTERNET</text>
            </g>
```
> Catatan: label "INTERNET" tadinya di-render di dalam `CloudShape`. Karena
> icon PNG nggak bisa render teks, label dipindah jadi `<text>` terpisah
> persis di posisi sama (y=8, relatif ke grup yang sama).

### 3.5 Act 1 — reactFace
```
OLD:
            <g transform={T('reactFace', 150, 280)} opacity={O('reactFace')}>
              <FaceReact x={0} y={0} mood="surprised" color="#FBBF24" />
            </g>

NEW:
            <g transform={T('reactFace', 150, 280)} opacity={O('reactFace')}>
              <image href={getIcon('face-surprised')} x={-30} y={-30} width={60} height={60} />
            </g>
```

### 3.6 Act 2 — houseBox2 / officeBox2
```
OLD:
            <g transform={T('houseBox2', 150, 170)} opacity={O('houseBox2')}>
              <HouseFrame x={0} y={0} />
              <Laptop x={0} y={0} color={COLORS.CRYPTO} />
              <text textAnchor="middle" y={52} fill={COLORS.TEXT} fontSize={14} fontWeight={700}>{DEVICES.home.label}</text>
            </g>
            <g transform={T('officeBox2', 582, 170)} opacity={O('officeBox2')}>
              <BuildingFrame x={0} y={0} />
              <Laptop x={0} y={0} color={COLORS.CRYPTO} />
              <text textAnchor="middle" y={52} fill={COLORS.TEXT} fontSize={14} fontWeight={700}>{DEVICES.office.label}</text>
            </g>

NEW:
            <g transform={T('houseBox2', 150, 170)} opacity={O('houseBox2')}>
              <image href={getIcon('house-frame')} x={-55} y={-108} width={110} height={108} />
              <image href={getIcon('laptop-crypto')} x={-34} y={-24} width={68} height={44} />
              <text textAnchor="middle" y={52} fill={COLORS.TEXT} fontSize={14} fontWeight={700}>{DEVICES.home.label}</text>
            </g>
            <g transform={T('officeBox2', 582, 170)} opacity={O('officeBox2')}>
              <image href={getIcon('building-frame')} x={-52} y={-100} width={104} height={125} />
              <image href={getIcon('laptop-crypto')} x={-34} y={-24} width={68} height={44} />
              <text textAnchor="middle" y={52} fill={COLORS.TEXT} fontSize={14} fontWeight={700}>{DEVICES.office.label}</text>
            </g>
```

### 3.7 Act 3 — houseBox3 / officeBox3
```
OLD:
            <g transform={T('houseBox3', 150, 190)} opacity={O('houseBox3')}>
              <HouseFrame x={0} y={0} />
              <Laptop x={0} y={0} color={COLORS.SERVER} />
              <text textAnchor="middle" y={52} fill={COLORS.TEXT} fontSize={14} fontWeight={700}>{DEVICES.home.label}</text>
            </g>
            <g transform={T('officeBox3', 582, 190)} opacity={O('officeBox3')}>
              <BuildingFrame x={0} y={0} />
              <Laptop x={0} y={0} color={COLORS.SERVER} />
              <text textAnchor="middle" y={52} fill={COLORS.TEXT} fontSize={14} fontWeight={700}>{DEVICES.office.label}</text>
            </g>

NEW:
            <g transform={T('houseBox3', 150, 190)} opacity={O('houseBox3')}>
              <image href={getIcon('house-frame')} x={-55} y={-108} width={110} height={108} />
              <image href={getIcon('laptop-server')} x={-34} y={-24} width={68} height={44} />
              <text textAnchor="middle" y={52} fill={COLORS.TEXT} fontSize={14} fontWeight={700}>{DEVICES.home.label}</text>
            </g>
            <g transform={T('officeBox3', 582, 190)} opacity={O('officeBox3')}>
              <image href={getIcon('building-frame')} x={-52} y={-100} width={104} height={125} />
              <image href={getIcon('laptop-server')} x={-34} y={-24} width={68} height={44} />
              <text textAnchor="middle" y={52} fill={COLORS.TEXT} fontSize={14} fontWeight={700}>{DEVICES.office.label}</text>
            </g>
```

### 3.8 Act 4 — houseBox4 / officeBox4 / wallHome4 / wallOffice4 / wallOfficeStrict
```
OLD:
            <g transform={T('houseBox4', 150, 170)} opacity={O('houseBox4')}>
              <HouseFrame x={0} y={0} />
              <Laptop x={0} y={0} color={COLORS.SUCCESS} />
              <text textAnchor="middle" y={52} fill={COLORS.TEXT} fontSize={14} fontWeight={700}>{DEVICES.home.label}</text>
            </g>
            <g transform={T('officeBox4', 582, 170)} opacity={O('officeBox4')}>
              <BuildingFrame x={0} y={0} />
              <Laptop x={0} y={0} color={COLORS.SUCCESS} />
              <text textAnchor="middle" y={52} fill={COLORS.TEXT} fontSize={14} fontWeight={700}>{DEVICES.office.label}</text>
            </g>
            <g transform={T('wallHome4', 250, 170)} opacity={O('wallHome4')}><FirewallWall x={0} y={0} /></g>
            <g transform={T('wallOffice4', 500, 170)} opacity={O('wallOffice4')}><FirewallWall x={0} y={0} /></g>

NEW:
            <g transform={T('houseBox4', 150, 170)} opacity={O('houseBox4')}>
              <image href={getIcon('house-frame')} x={-55} y={-108} width={110} height={108} />
              <image href={getIcon('laptop-success')} x={-34} y={-24} width={68} height={44} />
              <text textAnchor="middle" y={52} fill={COLORS.TEXT} fontSize={14} fontWeight={700}>{DEVICES.home.label}</text>
            </g>
            <g transform={T('officeBox4', 582, 170)} opacity={O('officeBox4')}>
              <image href={getIcon('building-frame')} x={-52} y={-100} width={104} height={125} />
              <image href={getIcon('laptop-success')} x={-34} y={-24} width={68} height={44} />
              <text textAnchor="middle" y={52} fill={COLORS.TEXT} fontSize={14} fontWeight={700}>{DEVICES.office.label}</text>
            </g>
            <g transform={T('wallHome4', 250, 170)} opacity={O('wallHome4')}><image href={getIcon('firewall-normal')} x={-8} y={-70} width={16} height={140} /></g>
            <g transform={T('wallOffice4', 500, 170)} opacity={O('wallOffice4')}><image href={getIcon('firewall-normal')} x={-8} y={-70} width={16} height={140} /></g>
```

```
OLD:
            <g transform={T('wallOfficeStrict', 500, 170)} opacity={O('wallOfficeStrict')}>
              <FirewallWall x={0} y={0} strict={true} />
            </g>

NEW:
            <g transform={T('wallOfficeStrict', 500, 170)} opacity={O('wallOfficeStrict')}>
              <image href={getIcon('firewall-strict')} x={-16} y={-74} width={32} height={148} />
            </g>
```

### 3.9 Act 5 — meshHome / meshOffice / happyFace
```
OLD:
            <g transform={T('meshHome', 150, 300)} opacity={O('meshHome')}>
              <HouseFrame x={0} y={0} /><Laptop x={0} y={0} color={COLORS.SUCCESS} />
              <text textAnchor="middle" y={52} fill={COLORS.TEXT} fontSize={13} fontWeight={700}>{DEVICES.home.label}</text>
            </g>
            <g transform={T('meshOffice', 582, 300)} opacity={O('meshOffice')}>
              <BuildingFrame x={0} y={0} /><Laptop x={0} y={0} color={COLORS.SUCCESS} />
              <text textAnchor="middle" y={52} fill={COLORS.TEXT} fontSize={13} fontWeight={700}>{DEVICES.office.label}</text>
            </g>

NEW:
            <g transform={T('meshHome', 150, 300)} opacity={O('meshHome')}>
              <image href={getIcon('house-frame')} x={-55} y={-108} width={110} height={108} />
              <image href={getIcon('laptop-success')} x={-34} y={-24} width={68} height={44} />
              <text textAnchor="middle" y={52} fill={COLORS.TEXT} fontSize={13} fontWeight={700}>{DEVICES.home.label}</text>
            </g>
            <g transform={T('meshOffice', 582, 300)} opacity={O('meshOffice')}>
              <image href={getIcon('building-frame')} x={-52} y={-100} width={104} height={125} />
              <image href={getIcon('laptop-success')} x={-34} y={-24} width={68} height={44} />
              <text textAnchor="middle" y={52} fill={COLORS.TEXT} fontSize={13} fontWeight={700}>{DEVICES.office.label}</text>
            </g>
```

```
OLD:
            <g transform={T('happyFace', 366, 300)} opacity={O('happyFace')}>
              <FaceReact x={0} y={0} mood="happy" color={COLORS.CRYPTO} />
            </g>

NEW:
            <g transform={T('happyFace', 366, 300)} opacity={O('happyFace')}>
              <image href={getIcon('face-happy')} x={-30} y={-30} width={60} height={60} />
            </g>
```

---

## 4. Checklist apply (urutan disarankan)

- [ ] Generate 11 PNG via extension (`icons.json` → `generation.batch_b`)
- [ ] Verify semua 11 file ada di `icons/`, ukuran & transparansi OK
- [ ] Timpa `icons/loader.js` dengan isi §1
- [ ] Buka `Animation.jsx`, hapus 6 definisi komponen (§2)
- [ ] Apply 9 blok replace di §3 satu-satu (pakai `edit_block`, unik per old_string)
- [ ] `npm run dev`, preview browser tiap Act (0–4), cek posisi icon (mungkin perlu geser ±5px)
- [ ] Export video test (Puppeteer) untuk final check

**Belum ada satupun dari langkah checklist ini yang dijalankan.**
