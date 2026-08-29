# Export Troubleshooting Guide

## ✅ Issues Fixed (2026-08-22)

### 1. Timing Sync Issue
**Problem:** Export timing tidak match dengan preview  
**Root Cause:** BASE_DURATION = 30s, tapi virtual-memory = 37s  
**Fix:** Created BASE_DURATIONS map dengan virtual-memory: 37  
**Status:** ✅ FIXED

### 2. Audio Files Corrupt
**Problem:** 21 audio files dalam format salah (MPEG/XML bukan WAV)  
**Fix:** Converted semua ke proper WAV format  
**Status:** ✅ FIXED (42 valid WAV files)

### 3. Missing whoosh.wav
**Problem:** transitions/whoosh.wav tidak ada  
**Fix:** Copied dari sfx/whoosh.wav  
**Status:** ✅ FIXED

---

## 🔍 Common Issues & Solutions

### Issue: "Missing audio file"
**Log:** `[SFX] Missing: /path/to/file.wav`  
**Solution:**
1. Check file exists: `ls -lh public/audio/category/file.wav`
2. Check file format: `file public/audio/category/file.wav`
3. Should be: "RIFF (little-endian) data, WAVE audio"
4. If wrong format, convert: `ffmpeg -i file.wav -ar 44100 -ac 1 file_fixed.wav -y`

### Issue: "FFmpeg exited with code X"
**Possible causes:**
- Corrupt audio file (check with `file` command)
- Unsupported format (must be WAV)
- File permissions issue

**Solution:**
```bash
# Check all audio files
for f in public/audio/*/*.wav; do
  file "$f" | grep -v "RIFF" && echo "CORRUPT: $f"
done

# Re-convert if needed
ffmpeg -i corrupt.wav -ar 44100 -ac 1 fixed.wav -y
```

### Issue: "Events after filter: X" (where X < 107)
**Cause:** Some audio files missing or corrupt  
**Solution:**
1. Check which files are missing in export log
2. Verify files exist and are valid WAV
3. Re-export after fixing

### Issue: Audio not synced in video
**Check:**
1. Is BASE_DURATIONS correct? `grep -A 3 BASE_DURATIONS scripts/export-lib.js`
2. Is scale calculation correct? Should see `scale=0.811` for 30s export
3. Is animation duration correct? Check PHASES in data.js

---

## 🧪 Verification Commands

### Check all audio files are valid:
```bash
cd public/audio
for f in */*.wav; do
  file "$f" | grep -q "RIFF" || echo "❌ $f"
done
```

### Count total events:
```bash
node -e "const fs=require('fs'); const c=fs.readFileSync('scripts/export-lib.js','utf8'); const m=c.match(/'virtual-memory':\s*\[([\s\S]*?)\n  \]/); console.log((m[1].match(/{ at:/g)||[]).length);"
```

### Check BASE_DURATIONS:
```bash
grep -A 5 "BASE_DURATIONS" scripts/export-lib.js
```

---

## 📊 Expected Export Log

```
[SFX] Using baseDuration=37s for 'virtual-memory' (scale=0.811)
[SFX] Total events before filter: 107
[SFX] Events after filter: 107
[Export] Sound effects: 107 scheduled
[Export] Captured 900 / 900 frames (100%)
[Export] Running ffmpeg to encode...
[Export] Mixing 107 sound effects into video...
[Export] ✅ Export complete: public/videos/virtual-memory.mp4
```

---

## 🆘 Still Having Issues?

1. Check `SFX_UPGRADE_SUMMARY.md` for detailed documentation
2. Verify all files in "Files Modified" section
3. Check export logs for specific error messages
4. Restart export-server if needed

---

*Last updated: 2026-08-22 19:48 UTC*
