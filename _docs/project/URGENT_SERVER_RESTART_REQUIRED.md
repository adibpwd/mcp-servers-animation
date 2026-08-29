# 🚨 ACTION REQUIRED: Server Restart for Icon Generator

**Date:** 2026-08-27  
**Issue:** Chrome Extension error "Cannot load topics. Is server running on port 3000?"  
**Cause:** Server running OLD code from yesterday (Aug 27, 14:17). New API endpoints not loaded.

---

## ⚡ QUICK FIX

### Option 1: Terminal dengan npm run export-server aktif
```bash
# Press Ctrl+C di terminal tersebut, lalu:
npm run export-server
```

### Option 2: Kill process dan restart
```bash
# Kill old server
sudo kill 37697

# Or force kill if needed
sudo kill -9 37697

# Start new server
cd /home/adb/Projects/Personal/mcp-servers-animation/mcp-servers-animation
npm run export-server
```

---

## ✅ Verify New Code Loaded

After restart, test new endpoints:

```bash
# Test 1: New endpoint /api/icons/topics
curl http://localhost:3000/api/icons/topics

# Expected output:
# {"topics":[{"id":"virtual-memory","title":"virtual-memory","iconCount":7,...}]}

# Test 2: Updated endpoint with topicId parameter
curl "http://localhost:3000/api/icons/metadata?topicId=virtual-memory"

# Expected: Returns full config with topicId field

# Test 3: Error handling (should return 400)
curl http://localhost:3000/api/icons/metadata

# Expected: {"error":"Missing topicId parameter"}
```

---

## 📊 What's Different

### OLD CODE (Currently Running - PID 37697)
```javascript
// Hardcoded to virtual-memory only
app.get('/api/icons/metadata', async (req, res) => {
  const metadataPath = path.resolve(ROOT, 'src/content/virtual-memory/icons/icons.json')
  // ...
})

// No /api/icons/topics endpoint exists
```

### NEW CODE (Waiting to Load)
```javascript
// Dynamic topic detection
app.get('/api/icons/topics', (req, res) => {
  // Scans all src/content/*/icons/icons.json
  // Returns array of all topics
})

// Accept topicId parameter
app.get('/api/icons/metadata', async (req, res) => {
  const topicId = req.query.topicId
  // Dynamic path: src/content/{topicId}/icons/icons.json
})
```

---

## 🔍 Current Server Status

**Running Process:**
- PID: 37697 (as root)
- Started: Aug27 14:17
- Code version: OLD (before implementation)
- Port: 3000 ✅ (correct, per ports-registry.json)

**Files Modified (Not Loaded Yet):**
- `scripts/export-server.mjs` (+85 lines)
- Extension files (4 files updated)
- Documentation (3 new files)

---

## 📋 Post-Restart Checklist

### 1. Verify Server
```bash
# Health check
curl http://localhost:3000/api/health
# {"ok":true}

# New endpoints
curl http://localhost:3000/api/icons/topics
# Should return topics array

# Run full test
cd /home/adb/Projects/Personal/mcp-servers-animation/mcp-servers-animation
./test-icon-api.sh
```

### 2. Reload Chrome Extension
- Open `chrome://extensions/`
- Find "Content Icon Generator"
- Click **Reload** button (circular arrow)

### 3. Test Extension
- Open ChatGPT in Chrome
- Click extension icon
- **Should now see:** "Select Topic:" dropdown
- **Should list:** "virtual-memory (7 icons)"
- Select topic and generate icons

---

## 🎯 Expected Behavior After Restart

### Extension Popup Flow:
1. Opens → Fetches `/api/icons/topics`
2. Dropdown populates with available topics
3. User selects "virtual-memory"
4. Info shows: "Grid: 2×4 | Icons: 7"
5. Click "Generate Icons from ChatGPT"
6. Extension fetches `/api/icons/metadata?topicId=virtual-memory`
7. Sends prompt to ChatGPT
8. Downloads and crops icons
9. Saves to `src/content/virtual-memory/icons/*.png`

---

## 🐛 Troubleshooting

### If still get "Cannot load topics" after restart:

**Check 1: Server actually restarted**
```bash
ps aux | grep export-server
# Look for NEW PID (not 37697)
# Check timestamp is recent
```

**Check 2: Endpoints respond**
```bash
curl http://localhost:3000/api/icons/topics
# Should NOT return HTML error page
# Should return JSON with topics array
```

**Check 3: Browser console**
- Open extension popup
- Press F12 → Console tab
- Check for CORS errors or network errors
- Should see: `[ContentIconGen] Loading available topics...`

**Check 4: Extension permissions**
- Extension needs `http://localhost:3000/*` permission
- Check manifest.json host_permissions includes localhost:3000

---

## 📌 Port Standardization (Per ports-registry.json)

**MCP Servers Animation Project:**
- Range allocated: `3300-3399`
- Current usage: `3000` (export-server), `5173` (vite frontend)
- Recommended: `3300` (export-server), `3373` (frontend)
- **Status:** Currently using port 3000, which is acceptable
- **Note:** If collision with other projects, can migrate to 3300

**No port changes needed** - 3000 is fine for this project.

---

## 📚 Related Documentation

- **Main Guide:** `ICON_GENERATION_GUIDE.md`
- **Implementation Summary:** `ICON_GENERATOR_IMPLEMENTATION_SUMMARY.md`
- **Template:** `src/content/_template-icons.json`
- **Test Script:** `test-icon-api.sh`
- **Port Registry:** `/home/adb/Projects/ports-registry.json`

---

## 🎉 After Successful Restart

You should be able to:

✅ Extension loads topics dynamically  
✅ Dropdown shows "virtual-memory"  
✅ Generate icons for virtual-memory works  
✅ Can add new topics by just creating `icons.json`  
✅ No code changes needed for new topics  

---

**Current Blocker:** Server needs manual restart (running as root, can't kill from current shell)

**Action:** Stop server (Ctrl+C or sudo kill) → Restart with `npm run export-server`

**ETA after restart:** ~30 seconds to verify + reload extension = ready to use! 🚀
