#!/bin/bash
set -e

echo "=== Phase 5: Icon Generation E2E Test ==="
echo ""

# Check prerequisites
echo "✓ Checking prerequisites..."
command -v node >/dev/null || { echo "✗ node not found"; exit 1; }
command -v jq >/dev/null 2>&1 || { echo "⚠ jq not found (optional)"; }

# Start server (background)
echo "✓ Starting backend server..."
node scripts/export-server.mjs &
SERVER_PID=$!
sleep 3

# Check server health
echo "✓ Testing API endpoint..."
curl -s http://localhost:3000/api/icons/metadata >/dev/null || {
  echo "✗ Server API not responding"
  kill $SERVER_PID 2>/dev/null || true
  exit 1
}

echo "✓ API endpoint OK"

# Test 1: Verify metadata
echo ""
echo "=== Test 1: Verify Metadata ==="
if command -v jq >/dev/null 2>&1; then
  ICONS_COUNT=$(curl -s http://localhost:3000/api/icons/metadata | jq '.icons | length')
  echo "Icons in metadata: $ICONS_COUNT"
  [ "$ICONS_COUNT" -eq 7 ] && echo "✓ PASS: 7 icons configured" || echo "✗ FAIL: Expected 7 icons"
else
  echo "⚠ jq not available, skipping JSON validation"
  curl -s http://localhost:3000/api/icons/metadata | head -20
fi

# Test 2: Check extension files
echo ""
echo "=== Test 2: Check Extension Files ==="
EXT_DIR="src/extensions/vm-icon-generator"
[ -f "$EXT_DIR/manifest.json" ] && echo "✓ manifest.json exists" || echo "✗ manifest.json MISSING"
[ -f "$EXT_DIR/popup.html" ] && echo "✓ popup.html exists" || echo "✗ popup.html MISSING"
[ -f "$EXT_DIR/popup.js" ] && echo "✓ popup.js exists" || echo "✗ popup.js MISSING"
[ -f "$EXT_DIR/content.js" ] && echo "✓ content.js exists" || echo "✗ content.js MISSING"
[ -f "$EXT_DIR/background.js" ] && echo "✓ background.js exists" || echo "✗ background.js MISSING"

# Test 3: Verify output directory exists
echo ""
echo "=== Test 3: Verify Output Directory ==="
OUTPUT_DIR="src/content/virtual-memory/icons"
[ -d "$OUTPUT_DIR" ] && echo "✓ Output directory exists: $OUTPUT_DIR" || echo "✗ FAIL: Directory missing"
[ -f "$OUTPUT_DIR/icons.json" ] && echo "✓ icons.json metadata exists" || echo "✗ icons.json MISSING"

# Test 4: Build project
echo ""
echo "=== Test 4: Build Project ==="
echo "Running: npm run build"
if npm run build >/dev/null 2>&1; then
  echo "✓ Build successful"
  [ -d "dist" ] && echo "✓ dist/ directory created"
else
  echo "✗ Build failed"
fi

# Cleanup
echo ""
echo "=== Cleanup ==="
kill $SERVER_PID 2>/dev/null || true
echo "✓ Server stopped"

echo ""
echo "=== Test Summary ==="
echo "✓ All infrastructure checks completed"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 MANUAL TESTING STEPS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Start backend server:"
echo "   node scripts/export-server.mjs"
echo ""
echo "2. Load Chrome Extension:"
echo "   • Open chrome://extensions in Chrome"
echo "   • Enable 'Developer mode' (top right)"
echo "   • Click 'Load unpacked'"
echo "   • Select folder: $EXT_DIR"
echo ""
echo "3. Generate icons from ChatGPT:"
echo "   • Open https://chatgpt.com in Chrome"
echo "   • Click extension icon (VM Icon Generator)"
echo "   • Click 'Generate Icons from ChatGPT'"
echo "   • Wait ~60 seconds for generation"
echo ""
echo "4. Verify icon files:"
echo "   ls -lh $OUTPUT_DIR/*.png"
echo "   # Should see 7 PNG files:"
echo "   # browser.png, game.png, editor.png, music.png,"
echo "   # camera.png, storage.png, lightning.png"
echo ""
echo "5. Test animation rendering:"
echo "   npm run dev"
echo "   # Open http://localhost:5173"
echo "   # Navigate to Virtual Memory animation"
echo "   # Verify icons display (not emoji)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
