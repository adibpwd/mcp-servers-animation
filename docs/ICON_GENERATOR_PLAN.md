# Icon Generator System - Implementation Plan

**Project:** Virtual Memory Animation Icon Generation  
**Date:** 2026-08-21  
**Status:** Planning → Implementation

---

## Overview

Build automated system untuk generate icons dari ChatGPT, auto-crop ke individual PNGs, dan simpan langsung ke content folder. System terdiri dari:

1. **Chrome Extension** - Automate ChatGPT prompt & image capture
2. **Backend API** - Receive image, crop grid, save files
3. **Integration** - Replace emoji dengan icons di Animation.jsx

---

## Requirements

### User Requirements

1. ✅ Grid layout fleksibel (beberapa row), skip empty slots
2. ✅ Icon size ~512×512 per icon
3. ✅ Extension untuk automation ChatGPT
4. ✅ API endpoint di server untuk handle extension requests
5. ✅ Server-side crop & auto-move files ke content folder

### Icons Needed (Virtual Memory)

Total: **7 icons**

| # | ID | Label | Usage Location |
|---|---|---|---|
| 1 | browser | Web Browser | Act 1 - Desktop items |
| 2 | game | Game Controller | Act 1 - Desktop items |
| 3 | editor | Code Editor | Act 1 - Desktop items |
| 4 | music | Music App | Act 1 - Desktop items |
| 5 | camera | Video Camera | Act 1 - Desktop items |
| 6 | storage | Storage Box | Act 1 - Gudang/Storage |
| 7 | lightning | Lightning Bolt | Act 4 - Page Fault alert |

---

## Architecture

### System Flow

```
┌─────────────┐
│   User      │
│  Click      │
│ "Generate"  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│  Chrome Extension                           │
│  ┌────────────────────────────────────┐    │
│  │ 1. Read icons.json metadata        │    │
│  │ 2. Extract prompt template         │    │
│  │ 3. Inject to ChatGPT via debugger  │    │
│  │ 4. Wait for image generation       │    │
│  │ 5. Extract image blob              │    │
│  └────────────────┬───────────────────┘    │
└───────────────────┼────────────────────────┘
                    │
                    │ POST /api/icons/generate
                    │ (image blob + metadata)
                    ▼
┌─────────────────────────────────────────────┐
│  Backend API (export-server.mjs)            │
│  ┌────────────────────────────────────┐    │
│  │ 1. Receive image blob              │    │
│  │ 2. Read icons.json (rows, cols)    │    │
│  │ 3. Calculate crop dimensions       │    │
│  │ 4. Loop & crop each icon           │    │
│  │ 5. Save to icons/ folder           │    │
│  │ 6. Return file paths               │    │
│  └────────────────┬───────────────────┘    │
└───────────────────┼────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  File System                                │
│  src/content/virtual-memory/icons/          │
│  ├── icons.json                             │
│  ├── browser.png    (auto-generated)        │
│  ├── game.png                               │
│  ├── editor.png                             │
│  ├── music.png                              │
│  ├── camera.png                             │
│  ├── storage.png                            │
│  └── lightning.png                          │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  Animation.jsx                              │
│  Import icons & render as <image> SVG       │
└─────────────────────────────────────────────┘
```

---

## Component Details

### 1. Icons Metadata File

**Location:** `src/content/virtual-memory/icons/icons.json`

**Structure:**

```json
{
  "name": "virtual-memory",
  "description": "7 icons for Virtual Memory animation",
  "icons": [
    { "id": "browser", "name": "Browser", "label": "Web Browser" },
    { "id": "game", "name": "Game", "label": "Game Controller" },
    { "id": "editor", "name": "Editor", "label": "Code Editor" },
    { "id": "music", "name": "Music", "label": "Music App" },
    { "id": "camera", "name": "Camera", "label": "Video Camera" },
    { "id": "storage", "name": "Storage", "label": "Storage Box" },
    { "id": "lightning", "name": "Lightning", "label": "Alert/Lightning" }
  ],
  "generation": {
    "rows": 2,
    "cols": 4,
    "prompt": "Generate a 2x4 grid of 8 minimalist grayscale monochrome icons on transparent background (PNG). Icons are numbered top-left to bottom-right:\n\n1. Web browser (globe/window)\n2. Game controller (gamepad)\n3. Code editor/IDE (window with code)\n4. Music app (speaker/note)\n5. Video camera (camera)\n6. Storage box (package/box)\n7. Lightning bolt (alert symbol)\n8. [EMPTY - leave this slot blank/transparent]\n\nStyle: Flat design, black/gray colors only, each icon same size, high contrast, transparent background. Each icon should be clearly distinct and recognizable. Grid layout 2 rows × 4 columns, total 4096x2048 pixels (512x512 per icon).",
    "api_endpoint": "http://localhost:3000/api/icons/generate",
    "output_path": "src/content/virtual-memory/icons"
  }
}
```

**Key Fields:**
- `icons[]` - Array of icon metadata (id for filename, label for description)
- `generation.rows` - Grid rows (2)
- `generation.cols` - Grid columns (4)
- `generation.prompt` - ChatGPT prompt template (explicit instructions)
- `generation.api_endpoint` - Backend API URL
- `generation.output_path` - Where to save cropped files

---

### 2. Chrome Extension

**Location:** `src/extensions/vm-icon-generator/`

**Files Structure:**

```
src/extensions/vm-icon-generator/
├── manifest.json              # Extension configuration
├── popup.html                 # UI (minimal button + status)
├── popup.js                   # Popup logic (trigger generation)
├── content.js                 # Content script (ChatGPT page)
├── background.js              # Service worker (debugger API)
└── inject.js                  # Inject code to main frame
```

#### manifest.json

```json
{
  "manifest_version": 3,
  "name": "Virtual Memory Icon Generator",
  "version": "0.1.0",
  "description": "Generate icons for Virtual Memory animation from ChatGPT",
  "permissions": ["activeTab", "scripting", "storage", "debugger"],
  "host_permissions": [
    "https://chatgpt.com/*",
    "https://chat.openai.com/*",
    "http://localhost:3000/*"
  ],
  "action": {
    "default_popup": "popup.html",
    "default_title": "VM Icon Generator"
  },
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["https://chatgpt.com/*", "https://chat.openai.com/*"],
      "js": ["content.js"],
      "run_at": "document_idle"
    }
  ],
  "web_accessible_resources": [
    {
      "resources": ["inject.js"],
      "matches": ["https://chatgpt.com/*", "https://chat.openai.com/*"]
    }
  ]
}
```

#### popup.html

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      width: 380px;
      margin: 0;
      padding: 16px;
      background: #0f172a;
      color: #f8fafc;
      font-family: system-ui, sans-serif;
    }
    h1 {
      font-size: 16px;
      margin: 0 0 12px;
    }
    button {
      width: 100%;
      border: 0;
      border-radius: 12px;
      background: #34d399;
      color: #052e16;
      padding: 12px;
      font-weight: 800;
      cursor: pointer;
      font-size: 14px;
    }
    button:disabled {
      background: #64748b;
      cursor: not-allowed;
    }
    .status {
      margin-top: 12px;
      padding: 12px;
      background: #020617;
      border: 1px solid #334155;
      border-radius: 10px;
      font-size: 12px;
      color: #94a3b8;
      white-space: pre-wrap;
      max-height: 300px;
      overflow: auto;
    }
    .preview {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-top: 12px;
    }
    .preview img {
      width: 100%;
      border: 1px solid #334155;
      border-radius: 8px;
      background: #020617;
    }
  </style>
</head>
<body>
  <h1>VM Icon Generator</h1>
  <button id="generate">Generate Icons from ChatGPT</button>
  <div id="status" class="status">Ready. Click "Generate Icons" to start.</div>
  <div id="preview" class="preview"></div>
  <script src="popup.js"></script>
</body>
</html>
```

#### popup.js

```js
const generateBtn = document.getElementById('generate');
const statusEl = document.getElementById('status');
const previewEl = document.getElementById('preview');

function setStatus(text) {
  statusEl.textContent = text;
  console.log('[VMIconGen]', text);
}

function addStatus(text) {
  statusEl.textContent += '\n' + text;
  statusEl.scrollTop = statusEl.scrollHeight;
}

generateBtn.addEventListener('click', async () => {
  generateBtn.disabled = true;
  setStatus('Starting icon generation...');
  
  try {
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) throw new Error('No active tab found');
    
    // Check if ChatGPT page
    if (!tab.url?.includes('chatgpt.com') && !tab.url?.includes('chat.openai.com')) {
      throw new Error('Please open ChatGPT page first');
    }
    
    addStatus('Triggering generation in content script...');
    
    // Send message to content script
    const response = await chrome.tabs.sendMessage(tab.id, { type: 'START_GENERATION' });
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    addStatus('Generation started successfully!');
    addStatus('Wait for ChatGPT to generate image...');
    
  } catch (error) {
    addStatus('ERROR: ' + error.message);
    console.error(error);
  } finally {
    generateBtn.disabled = false;
  }
});

// Listen for status updates from content script
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'STATUS_UPDATE') {
    addStatus(msg.text);
  }
  if (msg.type === 'GENERATION_COMPLETE') {
    addStatus('✅ Generation complete!');
    addStatus(`Icons saved: ${msg.icons.join(', ')}`);
    generateBtn.disabled = false;
  }
  if (msg.type === 'GENERATION_ERROR') {
    addStatus('❌ Error: ' + msg.error);
    generateBtn.disabled = false;
  }
});
```

#### content.js

```js
const ICONS_JSON_URL = 'http://localhost:3000/api/icons/metadata';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function sendStatus(text) {
  chrome.runtime.sendMessage({ type: 'STATUS_UPDATE', text });
  console.log('[VMIconGen][content]', text);
}

// Listen for START_GENERATION message from popup
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.type === 'START_GENERATION') {
    try {
      await runGeneration();
      sendResponse({ ok: true });
    } catch (error) {
      sendResponse({ ok: false, error: error.message });
      chrome.runtime.sendMessage({ type: 'GENERATION_ERROR', error: error.message });
    }
    return true; // Keep channel open for async
  }
});

async function runGeneration() {
  sendStatus('Fetching icons metadata...');
  
  // Fetch icons.json metadata
  const metaRes = await fetch(ICONS_JSON_URL);
  if (!metaRes.ok) throw new Error('Failed to fetch icons metadata');
  const metadata = await metaRes.json();
  
  sendStatus(`Metadata loaded: ${metadata.icons.length} icons`);
  
  const prompt = metadata.generation.prompt;
  if (!prompt) throw new Error('No prompt in metadata');
  
  sendStatus('Sending prompt to ChatGPT...');
  
  // Get image sources before sending prompt
  const beforeSources = new Set([...document.querySelectorAll('img')].map(img => img.src));
  
  // Send prompt via background script (using debugger API)
  const sendRes = await chrome.runtime.sendMessage({ type: 'SEND_PROMPT', text: prompt });
  if (!sendRes.ok) throw new Error('Failed to send prompt: ' + sendRes.error);
  
  sendStatus('Prompt sent! Waiting for ChatGPT to generate...');
  
  // Wait for image generation
  const img = await waitForGeneratedImage(beforeSources);
  sendStatus('Image generated! Downloading...');
  
  // Fetch image blob
  const imgRes = await fetch(img.src);
  const blob = await imgRes.blob();
  
  sendStatus(`Image downloaded (${Math.round(blob.size / 1024)}KB). Uploading to server...`);
  
  // Upload to server for cropping
  const formData = new FormData();
  formData.append('image', blob, 'icons-grid.png');
  formData.append('metadata', JSON.stringify(metadata));
  
  const uploadRes = await fetch(metadata.generation.api_endpoint, {
    method: 'POST',
    body: formData
  });
  
  if (!uploadRes.ok) {
    const errorText = await uploadRes.text();
    throw new Error(`Upload failed: ${uploadRes.status} ${errorText}`);
  }
  
  const result = await uploadRes.json();
  sendStatus(`✅ Server cropped ${result.icons.length} icons successfully!`);
  
  chrome.runtime.sendMessage({ 
    type: 'GENERATION_COMPLETE', 
    icons: result.icons.map(i => i.id) 
  });
}

function isChatGenerating() {
  const text = document.body.innerText;
  return text.includes('Generating') || 
         text.includes('Creating') || 
         text.includes('Drawing') ||
         !!document.querySelector('[data-testid="stop-button"]');
}

async function waitForGeneratedImage(beforeSources, timeoutMs = 360000) {
  const startTime = Date.now();
  let foundLoading = false;
  
  while (Date.now() - startTime < timeoutMs) {
    const loading = isChatGenerating();
    if (loading) foundLoading = true;
    
    if (foundLoading && !loading) {
      // Generation finished, find new image
      const selectors = [
        'img[alt^="Generated image:"]',
        'div[class*="imagegen"] img',
        'div[class*="image-gen"] img'
      ];
      
      for (const sel of selectors) {
        const imgs = [...document.querySelectorAll(sel)].filter(img => {
          if (!img.src || beforeSources.has(img.src)) return false;
          const rect = img.getBoundingClientRect();
          return rect.width >= 120 && rect.height >= 120;
        });
        
        if (imgs.length) {
          return imgs[imgs.length - 1]; // Return latest image
        }
      }
    }
    
    await sleep(1500);
  }
  
  throw new Error('Timeout: Image generation did not complete within 6 minutes');
}
```

#### background.js

```js
// Same pattern as carousel-asset-generator
// Use Chrome Debugger API to type prompt into ChatGPT

function debuggerAttach(target) {
  return new Promise((resolve, reject) => {
    chrome.debugger.attach(target, '1.3', () => {
      if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
      else resolve();
    });
  });
}

function debuggerDetach(target) {
  return new Promise(resolve => chrome.debugger.detach(target, () => resolve()));
}

function debuggerCommand(target, method, params = {}) {
  return new Promise((resolve, reject) => {
    chrome.debugger.sendCommand(target, method, params, result => {
      if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
      else resolve(result);
    });
  });
}

async function sendPromptViaDebugger(tabId, text) {
  const target = { tabId };
  await debuggerAttach(target);
  
  try {
    // Focus input
    await debuggerCommand(target, 'Runtime.evaluate', {
      expression: '(()=>{const i=document.querySelector(\'#prompt-textarea,[contenteditable="true"]\');if(i){i.focus();return true}return false})()',
      returnByValue: true
    });
    
    // Clear existing text (Ctrl+A, Backspace)
    await debuggerCommand(target, 'Input.dispatchKeyEvent', { 
      type: 'keyDown', key: 'a', code: 'KeyA', 
      windowsVirtualKeyCode: 65, nativeVirtualKeyCode: 65, modifiers: 2 
    });
    await debuggerCommand(target, 'Input.dispatchKeyEvent', { 
      type: 'keyUp', key: 'a', code: 'KeyA', 
      windowsVirtualKeyCode: 65, nativeVirtualKeyCode: 65, modifiers: 2 
    });
    await debuggerCommand(target, 'Input.dispatchKeyEvent', { 
      type: 'keyDown', key: 'Backspace', code: 'Backspace', 
      windowsVirtualKeyCode: 8, nativeVirtualKeyCode: 8 
    });
    await debuggerCommand(target, 'Input.dispatchKeyEvent', { 
      type: 'keyUp', key: 'Backspace', code: 'Backspace', 
      windowsVirtualKeyCode: 8, nativeVirtualKeyCode: 8 
    });
    
    // Insert prompt text
    await debuggerCommand(target, 'Input.insertText', { text });
    
    // Add space to trigger button enable
    await new Promise(resolve => setTimeout(resolve, 300));
    await debuggerCommand(target, 'Input.dispatchKeyEvent', { 
      type: 'keyDown', key: ' ', code: 'Space', text: ' ', 
      windowsVirtualKeyCode: 32, nativeVirtualKeyCode: 32 
    });
    await debuggerCommand(target, 'Input.dispatchKeyEvent', { 
      type: 'char', key: ' ', text: ' ' 
    });
    await debuggerCommand(target, 'Input.dispatchKeyEvent', { 
      type: 'keyUp', key: ' ', code: 'Space', 
      windowsVirtualKeyCode: 32, nativeVirtualKeyCode: 32 
    });
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ok: true };
    
  } finally {
    await debuggerDetach(target);
  }
}

function execInMain(tabId, func) {
  return chrome.scripting.executeScript({ 
    target: { tabId }, 
    world: 'MAIN', 
    func 
  })
  .then(results => results?.[0]?.result ?? null)
  .catch(err => ({ __error: err.message }));
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const tabId = sender.tab?.id;
  
  if (msg?.type === 'SEND_PROMPT') {
    if (!tabId) {
      sendResponse({ ok: false, error: 'No sender tab' });
      return true;
    }
    
    console.log('[VMIconGen][bg] SEND_PROMPT', { tabId, length: msg.text?.length });
    
    (async () => {
      try {
        const result = await sendPromptViaDebugger(tabId, msg.text);
        
        // Click submit button
        await new Promise(resolve => setTimeout(resolve, 500));
        const clicked = await execInMain(tabId, () => {
          const btn = document.querySelector('button[data-testid="send-button"],button[aria-label="Send prompt"]');
          if (btn && !btn.disabled) {
            btn.click();
            return true;
          }
          return false;
        });
        
        sendResponse({ ok: true, clicked });
        
      } catch (error) {
        sendResponse({ ok: false, error: error.message });
      }
    })();
    
    return true; // Keep channel open for async
  }
});
```

---

### 3. Backend API Endpoint

**Location:** Add to `scripts/export-server.mjs`

**New Dependencies:**

```bash
npm install sharp
```

**Implementation:**

```js
import sharp from 'sharp'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')

// ... existing code ...

// Add new route
app.post('/api/icons/generate', upload.single('image'), async (req, res) => {
  try {
    console.log('[icons/generate] Request received')
    
    if (!req.file) {
      return res.status(400).send('No image file uploaded')
    }
    
    const metadata = JSON.parse(req.body.metadata)
    console.log('[icons/generate] Metadata:', metadata)
    
    const { icons, generation } = metadata
    const { rows, cols, output_path } = generation
    
    if (!rows || !cols || !icons || !output_path) {
      return res.status(400).send('Invalid metadata: missing rows, cols, icons, or output_path')
    }
    
    // Load image
    const imageBuffer = req.file.buffer
    const image = sharp(imageBuffer)
    const imageMetadata = await image.metadata()
    
    console.log('[icons/generate] Image dimensions:', imageMetadata.width, 'x', imageMetadata.height)
    
    const cellWidth = Math.floor(imageMetadata.width / cols)
    const cellHeight = Math.floor(imageMetadata.height / rows)
    
    console.log('[icons/generate] Cell size:', cellWidth, 'x', cellHeight)
    
    // Ensure output directory exists
    const outputDir = path.resolve(PROJECT_ROOT, output_path)
    await fs.mkdir(outputDir, { recursive: true })
    
    const results = []
    
    // Crop each icon
    for (let i = 0; i < icons.length; i++) {
      const icon = icons[i]
      const row = Math.floor(i / cols)
      const col = i % cols
      
      const left = col * cellWidth
      const top = row * cellHeight
      
      console.log(`[icons/generate] Cropping ${icon.id} at (${left}, ${top}) size (${cellWidth}, ${cellHeight})`)
      
      const croppedBuffer = await sharp(imageBuffer)
        .extract({ left, top, width: cellWidth, height: cellHeight })
        .png()
        .toBuffer()
      
      const filename = `${icon.id}.png`
      const filepath = path.join(outputDir, filename)
      
      await fs.writeFile(filepath, croppedBuffer)
      
      console.log(`[icons/generate] Saved ${filename}`)
      
      results.push({
        id: icon.id,
        filename,
        path: filepath,
        size: croppedBuffer.length
      })
    }
    
    console.log('[icons/generate] All icons cropped successfully')
    
    res.json({
      success: true,
      icons: results,
      metadata: {
        rows,
        cols,
        cellWidth,
        cellHeight,
        totalIcons: icons.length
      }
    })
    
  } catch (error) {
    console.error('[icons/generate] Error:', error)
    res.status(500).send('Icon generation failed: ' + error.message)
  }
})

// Add metadata endpoint
app.get('/api/icons/metadata', async (req, res) => {
  try {
    const metadataPath = path.resolve(PROJECT_ROOT, 'src/content/virtual-memory/icons/icons.json')
    const data = await fs.readFile(metadataPath, 'utf8')
    res.json(JSON.parse(data))
  } catch (error) {
    console.error('[icons/metadata] Error:', error)
    res.status(500).send('Failed to load metadata: ' + error.message)
  }
})
```

**Required Changes to export-server.mjs:**

1. Add `import multer from 'multer'` for file upload handling
2. Configure multer: `const upload = multer({ storage: multer.memoryStorage() })`
3. Add sharp import
4. Add two new routes: `/api/icons/generate` (POST) and `/api/icons/metadata` (GET)

---

### 4. Animation.jsx Integration

**Changes Required:**

1. Remove CSS `filter: grayscale(100%)` from emoji text elements
2. Import icon files as assets
3. Replace `<text>{emoji}</text>` with `<image href={iconPath} />`
4. Adjust sizing/positioning

**Implementation:**

Create icon loader utility:

**File:** `src/content/virtual-memory/icons/loader.js`

```js
// Import all icons
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

export function getIcon(id) {
  return ICONS[id] || null
}
```

**Update Animation.jsx:**

```js
// Add import
import { getIcon } from './icons/loader'

// Update deskItems data structure to include icon id
const items1 = [
  { id: 'a', label: 'Browser (15 tab)', color: '#38BDF8', icon: 'browser', x: 60,  y: 20 },
  { id: 'b', label: 'Game besar',       color: '#A78BFA', icon: 'game', x: 190, y: 20 },
  { id: 'c', label: 'VS Code',          color: '#34D399', icon: 'editor', x: 320, y: 20 },
  { id: 'd', label: 'Spotify',          color: '#F472B6', icon: 'music', x: 60,  y: 130 },
  { id: 'e', label: 'Zoom Call',        color: '#FBBF24', icon: 'camera', x: 190, y: 130 },
]

// Replace emoji text rendering with image
// OLD:
// <text x={55} y={38} textAnchor="middle" fontSize={28} style={{ filter: 'grayscale(100%)' }}>{item.emoji}</text>

// NEW:
<image 
  href={getIcon(item.icon)} 
  x={28} 
  y={10} 
  width={54} 
  height={54} 
  preserveAspectRatio="xMidYMid meet"
/>

// Update storage icon (line 449)
// OLD:
// <text x={86} y={130} textAnchor="middle" fill="#4C1D29" fontSize={60} style={{ filter: 'grayscale(100%)' }}>📦</text>

// NEW:
<image 
  href={getIcon('storage')} 
  x={32} 
  y={70} 
  width={108} 
  height={108} 
  preserveAspectRatio="xMidYMid meet"
  opacity={0.3}
/>

// Update lightning icon (line 749)
// OLD:
// {pageFaultMsg ? '⚡ PAGE FAULT TERJADI!' : 'Menunggu akses...'}

// NEW: Split into icon + text
{pageFaultMsg ? (
  <>
    <image href={getIcon('lightning')} x={320} y={16} width={32} height={32} />
    <text x={366} y={42} /* ... */ >PAGE FAULT TERJADI!</text>
  </>
) : (
  <text /* ... */ >Menunggu akses...</text>
)}
```

---

## Implementation Checklist

### Phase 1: Infrastructure Setup

- [ ] Install `sharp` dependency: `npm install sharp`
- [ ] Install `multer` for file upload: `npm install multer`
- [ ] Create `src/content/virtual-memory/icons/` folder
- [ ] Create `icons.json` metadata file
- [ ] Create `src/extensions/vm-icon-generator/` folder

### Phase 2: Backend API

- [ ] Add multer configuration to export-server.mjs
- [ ] Add `/api/icons/metadata` GET endpoint
- [ ] Add `/api/icons/generate` POST endpoint
- [ ] Implement crop logic with sharp
- [ ] Test manually with curl + sample image

### Phase 3: Chrome Extension

- [ ] Create manifest.json
- [ ] Create popup.html + popup.js
- [ ] Create content.js (ChatGPT page script)
- [ ] Create background.js (debugger API)
- [ ] Test prompt injection locally
- [ ] Test image detection
- [ ] Test upload to API

### Phase 4: Integration

- [ ] Create icons/loader.js utility
- [ ] Update Animation.jsx imports
- [ ] Replace emoji text with `<image>` elements (Act 1 desktop items)
- [ ] Replace storage emoji (Act 1)
- [ ] Replace lightning emoji (Act 4)
- [ ] Adjust icon sizing/positioning
- [ ] Remove CSS grayscale filters

### Phase 5: Testing

- [ ] Build project: `npm run build`
- [ ] Test server running: `http://localhost:3000/api/icons/metadata`
- [ ] Load extension in Chrome
- [ ] Open ChatGPT
- [ ] Click "Generate Icons"
- [ ] Verify image generated
- [ ] Verify icons cropped & saved to folder
- [ ] Verify animation renders icons correctly
- [ ] Test export MP4 (icons visible in video)

---

## Technical Decisions

### Grid Layout: 2×4 (8 slots, 7 icons used)

**Rationale:**
- 7 icons needed → 2 rows × 4 cols = 8 slots (1 empty)
- Easy to instruct ChatGPT ("slot 8 leave blank")
- Simple indexing: `row = floor(i / 4)`, `col = i % 4`
- Skip empty slot in crop loop

**Alternative Considered:** 1×7 grid
- Rejected: Hard to generate in ChatGPT (too horizontal)
- Rejected: Quality degradation with small icon size

### Image Processing: Sharp (server-side)

**Rationale:**
- Fast, lightweight, well-maintained
- Simple crop API: `.extract({ left, top, width, height })`
- Already Node.js ecosystem
- No browser-side processing complexity

**Alternative Considered:** Canvas API in extension
- Rejected: More complex extension code
- Rejected: User's browser performance varies

### Extension Architecture: Minimal Popup

**Rationale:**
- Single purpose: generate icons for virtual-memory
- No need for complex UI
- Fast development
- Easy to extend later if needed

**Alternative Considered:** Full-featured like carousel-asset-generator
- Rejected: Overkill for single use case
- Rejected: Longer development time

### File Storage: Direct Filesystem

**Rationale:**
- Icons part of project source code
- Versioned in git
- No external dependencies
- Fast import in Animation.jsx

**Alternative Considered:** CDN/external storage
- Rejected: Unnecessary complexity
- Rejected: Additional deployment step

---

## Error Handling

### Extension Errors

1. **ChatGPT not open**
   - Check: `tab.url.includes('chatgpt.com')`
   - Action: Show error "Please open ChatGPT first"

2. **Prompt send failed**
   - Retry: 3 attempts with 2s delay
   - Action: Show error + suggest manual paste

3. **Image not detected**
   - Timeout: 6 minutes
   - Action: Show error "Generation timeout, check ChatGPT"

4. **Upload failed**
   - Check: Server response status
   - Action: Show detailed error message

### Server Errors

1. **No image file**
   - HTTP 400: "No image file uploaded"

2. **Invalid metadata**
   - HTTP 400: "Invalid metadata: missing X"

3. **Crop failed**
   - HTTP 500: "Icon generation failed: {error}"
   - Log: Detailed error with stack trace

4. **File write failed**
   - HTTP 500: "Failed to save icon: {error}"

### Animation Errors

1. **Icon file missing**
   - Fallback: Show placeholder rect
   - Log: Warning "Icon {id} not found"

2. **Icon load failed**
   - Fallback: Use emoji as backup
   - Log: Error "Failed to load icon {id}"

---

## Future Enhancements

### Phase 2 Features (Post-MVP)

1. **Multi-project support**
   - Config file for multiple animations
   - Dropdown to select project
   - Batch generation

2. **Icon preview in extension**
   - Show cropped icons in popup
   - Download individual icons
   - Re-crop adjustments

3. **Automatic retry logic**
   - Retry failed crops
   - Retry uploads
   - Queue system

4. **Style variations**
   - Color customization
   - Size presets
   - Export formats (SVG, WebP)

5. **Prompt templates**
   - Multiple style presets
   - User-defined templates
   - A/B testing

---

## Dependencies

### New npm Packages

```json
{
  "sharp": "^0.33.0",
  "multer": "^1.4.5-lts.1"
}
```

### Chrome Extension APIs

- `chrome.debugger` - Inject prompt to ChatGPT
- `chrome.scripting` - Execute scripts in page
- `chrome.storage.local` - Persist state
- `chrome.tabs` - Query/message active tab
- `chrome.runtime` - Message passing

---

## Testing Strategy

### Unit Tests

1. **Metadata parsing**
   - Valid JSON structure
   - Required fields present
   - Prompt template valid

2. **Crop calculations**
   - Correct cell dimensions
   - Boundary checks
   - Row/col indexing

3. **Icon loader**
   - Import all icons
   - Handle missing icons
   - Return correct paths

### Integration Tests

1. **API endpoint**
   - POST with valid image → 200 + files saved
   - POST with invalid data → 400 error
   - GET metadata → 200 + JSON returned

2. **Extension flow**
   - Prompt injection → ChatGPT receives text
   - Image detection → Found after generation
   - Upload → Server receives blob

3. **Animation rendering**
   - Icons display correctly
   - Sizing/positioning accurate
   - No visual regressions

### E2E Tests

1. **Full generation flow**
   - Open extension → Click generate
   - ChatGPT generates → Image detected
   - Server crops → Files saved
   - Animation renders → Icons visible

2. **Export verification**
   - Export MP4 → Icons visible in video
   - Timeline controls → Icons persist

---

## Rollout Plan

### Step 1: Development (Local)

1. Build backend API
2. Test with curl + sample image
3. Verify files saved correctly

### Step 2: Extension Development

1. Build extension locally
2. Load unpacked in Chrome
3. Test ChatGPT integration
4. Test upload to local server

### Step 3: Integration

1. Generate icons via extension
2. Update Animation.jsx
3. Test rendering
4. Test export

### Step 4: Documentation

1. Update main README.md
2. Add extension usage guide
3. Document API endpoints
4. Add troubleshooting section

### Step 5: Deployment

1. Commit icons to git
2. Commit extension code
3. Update server with new routes
4. Deploy to production

---

## Timeline Estimate

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| 1. Setup | Folders, icons.json, dependencies | 30 min |
| 2. Backend API | Routes, crop logic, testing | 1-2 hours |
| 3. Extension | All files, ChatGPT integration | 2-3 hours |
| 4. Integration | Animation.jsx updates | 1 hour |
| 5. Testing | E2E, bug fixes | 1-2 hours |
| **Total** | | **5-8 hours** |

---

## Resources

- Chrome Extension Docs: https://developer.chrome.com/docs/extensions/
- Sharp Library: https://sharp.pixelplumbing.com/
- Multer Docs: https://github.com/expressjs/multer
- ChatGPT DOM Selectors: (inspect live page for current selectors)

---

## Success Criteria

✅ **MVP Complete When:**

1. Extension successfully sends prompt to ChatGPT
2. ChatGPT generates icon grid image
3. Extension detects & uploads image to server
4. Server crops 7 individual icons
5. Icons saved to `src/content/virtual-memory/icons/`
6. Animation.jsx renders icons instead of emoji
7. Icons visible in live preview
8. Icons visible in exported MP4
9. Build completes with no errors
10. All 7 icons display correctly in all Acts

---

## Notes

- Grid slot 8 (bottom-right) intentionally left empty in prompt
- Icons should be grayscale/monochrome for theme consistency
- Transparent background required for proper SVG overlay
- Icon size in SVG adjustable via width/height attributes
- Fallback to emoji possible if icon generation fails

---

**Status:** Ready for implementation
**Next Step:** Create icons.json metadata file
