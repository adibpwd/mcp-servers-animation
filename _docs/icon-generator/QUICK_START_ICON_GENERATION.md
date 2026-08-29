# Quick Start - Icon Generation

**5-Minute Guide to Generate Icons**

---

## Prerequisites

✅ Backend server running: `node scripts/export-server.mjs`  
✅ Chrome browser installed  
✅ Internet connection (for ChatGPT)

---

## Step 1: Load Extension (1 min)

```bash
1. Open Chrome
2. Go to: chrome://extensions
3. Toggle "Developer mode" (top right)
4. Click "Load unpacked"
5. Navigate to and select:
   /home/adb/Projects/Personal/mcp-servers-animation/mcp-servers-animation/src/extensions/vm-icon-generator
6. Extension loads with icon
```

---

## Step 2: Generate Icons (2 min)

```bash
1. Open new tab: https://chatgpt.com
2. Click extension icon (VM Icon Generator)
3. Click button: "Generate Icons from ChatGPT"
4. Watch status updates in popup
5. Wait ~60 seconds for completion
6. Status shows: "✅ Server cropped 7 icons successfully!"
```

---

## Step 3: Verify Files (30 sec)

```bash
ls -lh src/content/virtual-memory/icons/*.png

# Expected: 7 files
# browser.png, game.png, editor.png, music.png,
# camera.png, storage.png, lightning.png
```

---

## Step 4: Update Loader (1 min)

Edit: `src/content/virtual-memory/icons/loader.js`

**Replace lines 5-13 with:**

```javascript
import browserIcon from './browser.png'
import gameIcon from './game.png'
import editorIcon from './editor.png'
import musicIcon from './music.png'
import cameraIcon from './camera.png'
import storageIcon from './storage.png'
import lightningIcon from './lightning.png'

export const ICONS = {
  browser: browserIcon,
  game: gameIcon,
  editor: editorIcon,
  music: musicIcon,
  camera: cameraIcon,
  storage: storageIcon,
  lightning: lightningIcon,
}
```

**Delete/comment old placeholder code**

Save file.

---

## Step 5: Test (30 sec)

```bash
npm run build
npm run dev

# Open: http://localhost:5173
# Navigate to: Virtual Memory animation
# Verify: Icons display (not blank spaces)
```

---

## Troubleshooting

**Extension won't load:**
- Check all files in `src/extensions/vm-icon-generator/`
- Verify manifest.json syntax

**Prompt not injecting:**
- Check ChatGPT page loaded fully
- Try manual paste if automation fails

**Icons not showing:**
- Verify 7 PNG files exist
- Check loader.js imports uncommented
- Rebuild: `npm run build`

---

## Files Location

```
Extension: src/extensions/vm-icon-generator/
Icons:     src/content/virtual-memory/icons/*.png
Loader:    src/content/virtual-memory/icons/loader.js
```

---

## Support

See full documentation:
- `docs/ICON_GENERATOR_PLAN.md`
- `ICON_GENERATOR_FINAL_SUMMARY.md`
- `ICON_GENERATOR_TESTING_RESULTS.md`

---

**Total Time: ~5 minutes**

