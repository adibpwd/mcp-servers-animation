# FINAL SETUP INSTRUCTIONS - Manual Mode

## Problem Summary
- Docker build terlalu lama dan kompleks
- Background node processes keep crashing
- CORS sudah di-fix di export-server.mjs

## Solution: Manual Terminal Setup

### Changes Applied:
1. ✅ **CORS Fixed** - export-server.mjs now allows requests from `100.78.186.122:5173`
2. ✅ **Frontend rebuilt** - uses `EXPORT_SERVER_URL` env variable
3. ✅ **SFX Schedule added** - 44 events for virtual-memory
4. ✅ **Progress UI** - Floating bottom-right indicator
5. ✅ **Timeline hiding** - PREV/NEXT buttons hidden during export

---

## Manual Setup (2 Terminals Required)

### Terminal 1: Start Export Server

```bash
cd /home/adb/Projects/Personal/mcp-servers-animation/mcp-servers-animation
npm run export-server
```

**Keep this terminal open!** You should see:
```
Export server running on http://0.0.0.0:3000
```

### Terminal 2: Start Frontend (Optional - already built)

If you want dev mode with hot reload:
```bash
cd /home/adb/Projects/Personal/mcp-servers-animation/mcp-servers-animation
npm run dev
```

Or just use the built version at: `http://100.78.186.122:5173`

---

## Testing Export

1. **Access:** http://100.78.186.122:5173 or http://localhost:5173
2. **Select:** Virtual Memory topic
3. **Click:** Export MP4 button
4. **Choose:** Duration (40s recommended)
5. **Watch:** Progress indicator bottom-right
6. **Verify log shows:** `Sound effects: 44 scheduled`

---

## Expected Behavior

### ✅ What Should Work:
- ✓ No more "Gagal memulai export" error
- ✓ No CORS errors in browser console
- ✓ Progress indicator appears bottom-right (non-blocking)
- ✓ PREV/NEXT buttons disappear during export
- ✓ Log shows "Sound effects: 44 scheduled" (not 0)
- ✓ Exported video has audio (UI sounds, swoosh, beeps, etc.)
- ✓ Real-time progress updates (500ms polling)

### 📋 Expected Export Log:
```
=== Starting export: virtual-memory ===
Export duration: 40s (30fps) @ 1x speed
Volume: 100%, Speed: 1x
Sound effects: 44 scheduled                    ← Must see this!
[Audio] Copied 34 audio files to export directory
Launching Chrome for topic: virtual-memory...
Navigating to http://localhost:5173...
Hiding UI elements for clean export...
Recording 1200 frames (~40.0s at 30fps with 1x speed)...
Captured 1200 frames successfully.
Running ffmpeg to encode...
Mixing 44 sound effects into video...
Encoding complete. Output: virtual-memory.mp4
✅ SELESAI! Video: virtual-memory.mp4 (X.XX MB)
```

---

## Troubleshooting

### Issue: "CORS request did not succeed"
**Solution:** Make sure export-server is running in Terminal 1

**Verify:**
```bash
curl http://localhost:3000/api/export/status?topicId=virtual-memory
```
Should return JSON response (not connection refused)

### Issue: "Sound effects: 0 scheduled"
**Solution:** Restart export-server to reload updated SFX_SCHEDULES

### Issue: PREV/NEXT still visible
**Solution:** Hard refresh browser (Ctrl+Shift+R)

### Issue: Audio still silent in exported video
**Check:**
1. Log shows "44 scheduled"? 
2. Audio files exist: `ls public/audio/transitions/*.wav`
3. FFmpeg mixing audio: Check for "Mixing X sound effects" in log

---

## Files Modified (Summary)

1. `scripts/export-lib.js` - Added virtual-memory SFX schedule (44 events)
2. `scripts/export-server.mjs` - Fixed CORS with explicit origin whitelist
3. `src/components/PlayerShell.jsx` - Dynamic server URL + timeline hide fix
4. `src/components/ProgressIndicator.jsx` - NEW floating progress widget
5. `src/components/ProgressIndicator.css` - NEW styles
6. `src/components/TimelineProgressBar.jsx` - isExporting prop
7. `src/components/TimelineProgressBar.css` - hidden class

---

## Next Steps

1. **Start export-server** in Terminal 1 (keep running)
2. **Access web UI** at http://100.78.186.122:5173
3. **Export virtual-memory** (40s duration)
4. **Report back:**
   - Does log show "44 scheduled"?
   - Does video have audio?
   - Are PREV/NEXT hidden?

---

## Why Not Docker?

Docker build takes 10-15 minutes due to:
- Node.js image download (large)
- npm ci installing all dependencies
- Chromium installation for Puppeteer
- Multiple build stages

Manual mode is faster and easier to debug.

---

**Ready to test! Start export-server in Terminal 1 and try exporting.** 🚀
