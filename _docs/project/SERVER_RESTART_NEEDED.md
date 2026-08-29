# Server Restart Instructions

**Error:** Extension shows "Cannot load topics. Is server running on port 3000?"

**Cause:** Server is running OLD CODE from Aug27. Need to restart to load NEW API endpoints.

---

## Quick Fix (Run in Terminal)

```bash
# 1. Stop old server (Ctrl+C in terminal where npm run export-server is running)
# OR kill the process:
sudo kill 37697

# 2. Start server with new code
cd /home/adb/Projects/Personal/mcp-servers-animation/mcp-servers-animation
npm run export-server
```

---

## Verify Server is Updated

After restart, test the new endpoints:

```bash
# Test new /api/icons/topics endpoint
curl http://localhost:3000/api/icons/topics

# Should return:
# {"topics":[{"id":"virtual-memory","title":"virtual-memory","iconCount":7,...}]}

# Test updated /api/icons/metadata endpoint
curl "http://localhost:3000/api/icons/metadata?topicId=virtual-memory"

# Should return full config with topicId injected
```

---

## What Changed

**Old code (currently running):**
- `/api/icons/metadata` - hardcoded to virtual-memory only
- No `/api/icons/topics` endpoint

**New code (need to load):**
- `/api/icons/topics` - lists all topics dynamically
- `/api/icons/metadata?topicId=X` - accepts topicId parameter

---

## After Server Restart

1. **Reload Chrome Extension:**
   - Go to `chrome://extensions/`
   - Find "Content Icon Generator"
   - Click Reload button

2. **Test Extension:**
   - Open ChatGPT tab
   - Click extension icon
   - Should see dropdown with topics
   - Select "virtual-memory"
   - Click "Generate Icons from ChatGPT"

---

**Current Status:**
- ❌ Server running old code (PID 37697 from Aug27)
- ✅ All new code implemented and ready
- ⏳ Waiting for manual server restart

**Action Required:**
Stop the server (Ctrl+C or sudo kill) and restart with `npm run export-server`
