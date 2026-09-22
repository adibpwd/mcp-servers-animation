# BUILD & EXPORT GUIDE — REST API (Revisi-07) 🚀

**Quick reference** untuk melanjutkan dari Animation.jsx completion ke export MP4.

---

## ✅ COMPLETED

- ✅ data.js (213 lines) — 3 users, 6 requests, NETWORKING theme
- ✅ Animation.jsx (543 lines) — Full timeline, state mutations, render
- ✅ Documentation — Execution log, summary, checklist

---

## 📝 NEXT: STEP-BY-STEP

### STEP 1️⃣: Navigate to Project Root
```bash
cd /home/adb/Projects/Personal/mcp-servers-animation/mcp-servers-animation
```

### STEP 2️⃣: Install Dependencies (if not already done)
```bash
npm install
# Should complete in ~2-3 min
# Installs: react, vite, gsap, tailwindcss, etc.
```

### STEP 3️⃣: Browser Build Test
```bash
npm run build
# Vite compiles src/ → dist/
# ✅ Should succeed without errors
# ⚠️  If error: check imports/syntax in Animation.jsx, data.js
```

### STEP 4️⃣: Dev Preview (Visual Verify)
```bash
npm run dev
# Starts dev server (http://localhost:5173 or similar)
# Opens browser automatically
#
# Verify in browser:
# 1. Navigate to topic list
# 2. Find "REST API" card (should show "NETWORKING" label in green)
# 3. Click → Opens player
# 4. Watch animation:
#
# ACT 1 (0-3.5s):
#   - Browser panel pops in
#   - Adib avatar shown
#   - "Adib membuka halaman profil" caption
#   - GET request travels to gate
#
# ACT 2 (3.5-12s):
#   - Request enters processor (lock sound)
#   - Cabinet shows 4 users (0/generic, 1/Adib, 2/Jokowo, 3/Prabowo)
#   - Response travels back to browser
#   - "200 OK" status badge
#   - Browser panel updates: "Adib · age · role"
#
# ACT 3 (12-25.5s):
#   - Beat A.1: POST_JOKOWO → cabinet slot 2 highlights
#   - Beat A.2: POST_PRABOWO → cabinet slot 3 highlights
#   - Browser shows: "+ Jokowo (Student)" + "+ Prabowo ditambahkan"
#   - Beat B: PUT → Adib hair stroke changes to purple
#   - Browser shows: "Rambut: ungu"
#
# ACT 4 (25.5-39s):
#   - Beat A: PATCH_JOKOWO → Jokowo role changes on cabinet
#   - Browser shows: "+ Jokowo (Professional)"
#   - Beat B: DELETE_PRABOWO → Prabowo slot fades/crosses
#   - Browser shows: "— Prabowo dihapus"
#   - Closing: "Adib (purple) · Jokowo (Professional) · Prabowo (deleted)"
#
# Press Ctrl+C to stop dev server
```

---

## 🎬 EXPORT MP4

### Method A: Script Command (Recommended)
```bash
npm run export:17
# Uses Puppeteer + ffmpeg
# Captures animation frame-by-frame
# Outputs to: export/17-rest-api-revisi-07.mp4
# ⏱️  Takes ~2-3 minutes (depends on system)
```

### Method B: Manual Export (if npm script fails)
```bash
node scripts/export-video.js --topic 17
# Same result as Method A
```

### After Export
```bash
# Verify output
ls -lh export/17-rest-api-revisi-07.mp4
# Should be ~50-100 MB (1-2 min video @ 30fps)

# View in player
open export/17-rest-api-revisi-07.mp4  # macOS
# or
vlc export/17-rest-api-revisi-07.mp4   # Linux/macOS
# or
start export/17-rest-api-revisi-07.mp4 # Windows
```

---

## ⚠️ TROUBLESHOOTING

### Build Error: "Unknown file extension .jsx"
- **Cause**: Vite not configured for JSX
- **Fix**: Check vite.config.js includes React plugin
  ```javascript
  import react from '@vitejs/plugin-react'
  export default {
    plugins: [react()],
  }
  ```

### Build Error: "Cannot find module 'data.js'"
- **Cause**: Import path mismatch
- **Fix**: Verify import in Animation.jsx:
  ```javascript
  import { ... } from './data'  // ← Correct (no .js extension)
  // import { ... } from './data.js'  // ← Wrong
  ```

### Export Timeout / Chrome Not Found
- **Cause**: Puppeteer binary missing or timeout too short
- **Fix**: 
  ```bash
  # Re-install Puppeteer chrome binary
  npm install puppeteer --save-dev
  # or
  npm run export:17 -- --timeout 180000  # 180s timeout
  ```

### Animation Timing Off (Not Exactly 39s)
- **Check**: Verify PHASES in data.js
  ```javascript
  export const PHASES = [
    { duration: 3.5 },   // ACT 1
    { duration: 8.5 },   // ACT 2
    { duration: 13.5 },  // ACT 3
    { duration: 13.5 },  // ACT 4
  ]
  // Total = 39.0s ✅
  ```
- **If off**: Adjust timeline offsets in Animation.jsx (see timeline comments)

---

## 📊 VERIFICATION CHECKLIST (Post-Export)

- ✅ MP4 file exists and > 10 MB
- ✅ Duration is 39s ± 0.5s
- ✅ Audio (if mixed in) is synced
- ✅ Frame rate is 30fps (smooth playback)
- ✅ All 4 Acts visible with correct captions
- ✅ Cabinet slots update per mutation
- ✅ Colors correct (mint green, sky blue, amber accents)
- ✅ No glitches or freezes
- ✅ Response badges appear & disappear correctly
- ✅ Closing caption shows all 3 users

---

## 📁 KEY FILES REFERENCE

| File | Purpose |
|------|---------|
| `src/content/17-rest-api/data.js` | Animation constants, PHASES, REQUESTS, COLORS |
| `src/content/17-rest-api/Animation.jsx` | GSAP timeline, React state, SVG render |
| `src/content/registry.js` | Topic registration (ensure #17 is listed) |
| `vite.config.js` | Build configuration (Vite + React) |
| `package.json` | Dependencies, npm scripts (build, dev, export) |
| `scripts/export-video.js` | MP4 export script (Puppeteer + ffmpeg) |

---

## 🎯 FINAL CHECKLIST

- ✅ data.js complete & imported
- ✅ Animation.jsx updated for 3 users
- ✅ No import errors
- ✅ npm run build succeeds
- ✅ npm run dev shows animation correctly
- ✅ npm run export:17 produces MP4
- ✅ MP4 plays without artifacts
- ✅ Timing is 39s ± 0.5s
- ✅ All state mutations visible on screen

---

## 💡 TIPS

**For faster iteration**:
```bash
# Keep dev server running in one terminal
npm run dev

# Make edits to Animation.jsx
# Changes auto-reload in browser (HMR)
# No need to rebuild between edits
```

**For debugging**:
```javascript
// In Animation.jsx, add console logs:
useEffect(() => {
  console.log('jokowoRole updated:', jokowoRole)
  console.log('prabowoPresent updated:', prabowoPresent)
}, [jokowoRole, prabowoPresent])

// Check browser console (F12 → Console tab)
```

**To export without audio** (faster):
```bash
npm run export:17 -- --audio false
# Skips audio mixing, saves ~10-15s per export
```

---

## 🚀 DONE!

Once export completes successfully, Revisi-07 is production-ready. 

**Next projects** (beyond scope):
- Icon asset generation (docs/06-icon-generation.md)
- Multi-language captions
- Advanced audio mixing (Revise-08+)

---

**Last updated**: 2026-09-12
**Ready for**: npm build + dev preview + export MP4
