# React + D3 Network Animation - Comprehensive Technical Setup Prompt

## 📁 Project Structure

```
/Users/macbookpro/Projects/Personal/mcp-servers-animation/
├── src/
│   ├── components/
│   │   ├── NetworkDiagram.jsx
│   │   ├── AnimatedCounter.jsx
│   │   ├── LineTracer.jsx
│   │   └── NodeGlow.jsx
│   ├── hooks/
│   │   └── useD3ForceSimulation.js
│   ├── utils/
│   │   ├── animationConfig.js
│   │   ├── colorScheme.js
│   │   ├── frameSequence.js
│   │   └── nodeData.js
│   ├── styles/
│   │   ├── NetworkDiagram.css
│   │   ├── animations.css
│   │   └── theme.css
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── public/
│   └── index.html
├── frames/
│   ├── frame_01.jpg
│   ├── frame_02.jpg
│   └── ... frame_18.jpg
├── export/
│   └── output.mp4
├── scripts/
│   ├── export-video.js
│   └── frame-analyzer.js
├── package.json
├── vite.config.js
├── .env
└── SETUP_PROMPT.md
```

---

## 🚀 QUICK START

### **1. Install Dependencies**
```bash
cd /Users/macbookpro/Projects/Personal/mcp-servers-animation

npm install react@18 react-dom@18 d3@7.8.5 gsap@3.12.2 vite@5.0.0 @vitejs/plugin-react

npm install -D puppeteer@21.0.0 ffmpeg-static
```

### **2. Update package.json Scripts**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "export": "node scripts/export-video.js"
  }
}
```

### **3. Run Dev Server**
```bash
npm run dev
# Open http://localhost:5173
```

### **4. Export to Video**
```bash
npm run export
```

---

## 🎨 COMPONENT SPECIFICATIONS

### **NetworkDiagram.jsx**
**Purpose:** Main D3 force-directed graph visualization

**Features:**
- D3 force simulation with configurable forces
- SVG rendering (1920x1080)
- Node circles with labels
- Dashed link lines
- Glow effects via SVG filters
- Dark theme (#0a0e27 background)

**Key Dependencies:** d3@7.8.5, React Hooks (useEffect, useRef, useState)

**Color Scheme:**
- Primary: Cyan (#00D9FF)
- Secondary: Pink (#FF006E)
- Gold: #FFD60A
- Dark Background: #0a0e27

**D3 Forces:**
- Link force: distance 150px
- Charge force: strength -300
- Center force: width/2, height/2
- Collision force: radius 60px

---

### **AnimatedCounter.jsx**
**Purpose:** Animated counter 14 → 29

**Features:**
- GSAP timeline animation
- Counter starts at 14, ends at 29
- Duration: ~12 seconds
- Two-digit format display (00, 01, 02...)
- Positioned top-right
- Font: Monospace, 72px, Cyan color

**Key Dependencies:** gsap@3.12.2

---

### **LineTracer.jsx**
**Purpose:** Animated connection lines with glowing dots

**Features:**
- SVG line with stroke-dasharray animation
- Glowing dot travels along line
- Duration: 1.2 seconds per line
- Stagger delay: 0.15 seconds between lines
- Colors: Cyan or Pink
- Glow filter: feGaussianBlur stdDeviation="4"

**Key Dependencies:** gsap@3.12.2

---

### **NodeGlow.jsx**
**Purpose:** Glow effect component (optional)

**Features:**
- Circular glow animation
- Pulse effect using GSAP
- Opacity animation 0.3 → 1.0
- Duration: 0.6 seconds per pulse

---

### **useD3ForceSimulation.js**
**Purpose:** Custom React hook for D3 state management

**Responsibilities:**
- Initialize D3 force simulation
- Update React state on 'tick' event
- Manage simulation lifecycle
- Return positions array and simulation instance

**Inputs:**
- nodes: Array of node objects with id, label, x, y, type, size
- links: Array of link objects with source, target, color, animated
- config: Object with width, height, forceStrength, linkDistance

**Outputs:**
- positions: Updated node positions
- simulation: D3 simulation instance reference

---

## 📊 DATA STRUCTURE

### **frameSequence.js**
```javascript
export const FRAME_SEQUENCE = [
  {
    frameNumber: 1,
    duration: 1.0,
    counter: 14,
    activeLinks: [],
    description: "Title intro frame"
  },
  {
    frameNumber: 2,
    duration: 1.0,
    counter: 15,
    activeLinks: [
      {
        source: 'claude',
        target: 'github',
        color: 'cyan',
        delay: 0.0,
        duration: 1.2
      }
    ],
    description: "First line animation"
  },
  // Continue for frames 3-18...
  {
    frameNumber: 18,
    duration: 1.5,
    counter: 29,
    activeLinks: [],
    description: "Final frame"
  }
]

export const TOTAL_DURATION = FRAME_SEQUENCE.reduce((sum, f) => sum + f.duration, 0)
```

### **nodeData.js**
```javascript
export const NODES = [
  { id: 'claude', label: 'CLAUDE', type: 'ai-model', size: 60 },
  { id: 'cursor', label: 'CURSOR', type: 'ai-model', size: 60 },
  { id: 'chatgpt', label: 'CHATGPT', type: 'ai-model', size: 60 },
  { id: 'github', label: 'GITHUB', type: 'tool', size: 40 },
  { id: 'postgres', label: 'POSTGRES', type: 'tool', size: 40 },
  { id: 'slack', label: 'SLACK', type: 'tool', size: 40 },
  { id: 'gmail', label: 'GMAIL', type: 'tool', size: 40 }
]

export const LINKS = [
  { source: 'claude', target: 'github', color: 'cyan' },
  { source: 'cursor', target: 'postgres', color: 'pink' },
  { source: 'chatgpt', target: 'slack', color: 'gold' }
]
```

### **animationConfig.js**
```javascript
export const ANIMATION_CONFIG = {
  // Timing
  FPS: 30,
  TOTAL_DURATION: 15,
  LINE_ANIMATION_DURATION: 1.2,
  COUNTER_UPDATE_INTERVAL: 0.1,
  GLOW_PULSE_DURATION: 0.6,
  STAGGER_DELAY: 0.15,

  // Colors
  COLORS: {
    PRIMARY_CYAN: '#00D9FF',
    SECONDARY_PINK: '#FF006E',
    GOLD: '#FFD60A',
    DARK_BG: '#0a0e27',
    NODE_STROKE: '#1e293b'
  },

  // D3 Force Configuration
  FORCE_CONFIG: {
    STRENGTH: -300,
    LINK_DISTANCE: 150,
    COLLISION_RADIUS: 60,
    CENTER_STRENGTH: 0.1
  },

  // SVG Configuration
  SVG_CONFIG: {
    WIDTH: 1920,
    HEIGHT: 1080,
    GLOW_BLUR: 4,
    GLOW_FILTER: 'url(#glow)'
  }
}
```

---

## 🎬 Video Export Script

**File: `scripts/export-video.js`**

**Purpose:** Export animated visualization to MP4 using Puppeteer + FFmpeg

**Technical Details:**
- Uses headless Chromium (Puppeteer) to capture screenshots
- 30 FPS capture
- Total 450 frames (15 seconds * 30 FPS)
- FFmpeg encodes to H.264 MP4
- Output: `./export/output.mp4`

**Requirements:**
- FFmpeg installed (via ffmpeg-static)
- Puppeteer 21+
- Dev server running on localhost:5173

**Process:**
1. Launch headless browser
2. Navigate to localhost:5173
3. Set viewport to 1920x1080
4. Capture screenshot every frame
5. Save PNG sequence to ./export/frames/
6. Encode PNG sequence to MP4 using FFmpeg

---

## 🎯 STEP-BY-STEP IMPLEMENTATION

### **Phase 1: Setup (10 min)**
```bash
cd /Users/macbookpro/Projects/Personal/mcp-servers-animation
npm install react@18 react-dom@18 d3@7.8.5 gsap@3.12.2 vite@5.0.0 @vitejs/plugin-react
npm install -D puppeteer@21.0.0 ffmpeg-static
```

### **Phase 2: Create Configuration Files (5 min)**
1. Create `vite.config.js` - Vite configuration
2. Create `public/index.html` - HTML entry point
3. Create `.env` - Environment variables
4. Update `package.json` - Add scripts

### **Phase 3: Create Utilities (15 min)**
1. Create `src/utils/animationConfig.js` - Animation constants
2. Create `src/utils/frameSequence.js` - Frame definitions
3. Create `src/utils/nodeData.js` - Node & link data
4. Create `src/utils/colorScheme.js` - Color palette

### **Phase 4: Create Hooks (10 min)**
1. Create `src/hooks/useD3ForceSimulation.js` - D3 state hook

### **Phase 5: Create Components (30 min)**
1. Create `src/components/NetworkDiagram.jsx` - Main visualization
2. Create `src/components/AnimatedCounter.jsx` - Counter animation
3. Create `src/components/LineTracer.jsx` - Line animation
4. Create `src/components/NodeGlow.jsx` - Glow effect

### **Phase 6: Create Styles (10 min)**
1. Create `src/styles/theme.css` - Color theme
2. Create `src/styles/NetworkDiagram.css` - Component styles
3. Create `src/styles/animations.css` - GSAP animations

### **Phase 7: Create Main App (10 min)**
1. Create `src/App.jsx` - Main orchestrator component
2. Create `src/main.jsx` - React DOM render

### **Phase 8: Create Export Script (10 min)**
1. Create `scripts/export-video.js` - Puppeteer + FFmpeg export

### **Phase 9: Test & Export (10 min)**
```bash
npm run dev          # Test animation
npm run export       # Generate MP4
```

---

## 📋 TECHNICAL CHECKLIST

**Dependencies:**
- [ ] react@18
- [ ] react-dom@18
- [ ] d3@7.8.5
- [ ] gsap@3.12.2
- [ ] vite@5.0.0
- [ ] @vitejs/plugin-react
- [ ] puppeteer@21.0.0
- [ ] ffmpeg-static

**Configuration Files:**
- [ ] vite.config.js
- [ ] package.json (scripts updated)
- [ ] .env (if needed)

**Source Files:**
- [ ] src/main.jsx
- [ ] src/App.jsx
- [ ] src/App.css

**Components (src/components/):**
- [ ] NetworkDiagram.jsx
- [ ] AnimatedCounter.jsx
- [ ] LineTracer.jsx
- [ ] NodeGlow.jsx

**Hooks (src/hooks/):**
- [ ] useD3ForceSimulation.js

**Utilities (src/utils/):**
- [ ] animationConfig.js
- [ ] frameSequence.js
- [ ] nodeData.js
- [ ] colorScheme.js

**Styles (src/styles/):**
- [ ] theme.css
- [ ] NetworkDiagram.css
- [ ] animations.css

**Public Files (public/):**
- [ ] index.html

**Scripts (scripts/):**
- [ ] export-video.js

---

## 🎥 Expected Output

✅ Development server running on `http://localhost:5173`
✅ Animated network diagram with D3 force simulation
✅ Counter animation synced with frame sequence
✅ Cyan/pink/gold animated connection lines
✅ Glowing dots traveling along connections
✅ MP4 video exported to `./export/output.mp4`
✅ Video resolution: 1920x1080
✅ Video framerate: 30 FPS
✅ Video duration: 15 seconds

---

## 📚 Key Technologies

**Frontend:**
- React 18: Component framework
- D3.js 7.8.5: Data visualization & force simulation
- GSAP 3.12.2: Animation library
- Vite 5.0.0: Build tool & dev server

**Export:**
- Puppeteer 21.0.0: Headless browser automation
- FFmpeg: Video encoding

**Styling:**
- CSS3: Animations & effects
- SVG: Vector graphics

---

## 🔧 Troubleshooting

**Port 5173 already in use:**
```bash
lsof -i :5173
kill -9 <PID>
npm run dev
```

**FFmpeg not found:**
```bash
npm install ffmpeg-static --save-dev
```

**D3 simulation too slow:**
- Reduce node count
- Increase `alphaDecay` in simulation
- Use requestAnimationFrame for tick updates

**Video export fails:**
- Ensure dev server is running (`npm run dev`)
- Check `./export/frames/` directory exists
- Verify FFmpeg is installed

---

## 📖 Resources

- D3.js Documentation: https://d3js.org
- GSAP Documentation: https://greensock.com/gsap/
- React Hooks: https://react.dev/reference/react
- Puppeteer: https://pptr.dev
- Vite: https://vitejs.dev

---

## ✨ Notes

- Animation timing: 15 seconds total duration
- Frame sequence: 18 frames from uploaded images
- Color theme: Dark with cyan/pink neon
- Resolution: Full HD (1920x1080)
- Performance target: 60 FPS (capture at 30 FPS)

---

**Created with ❤️ for smooth animated network visualization**
**Last updated: 2026-08-16**
