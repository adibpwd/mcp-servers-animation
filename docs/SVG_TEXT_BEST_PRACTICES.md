# SVG Text Best Practices

Solusi umum untuk masalah text rendering di SVG canvas.

---

## Problem: SVG Text Tidak Support Word Wrap

HTML memiliki automatic text wrapping. SVG tidak.

```html
<!-- HTML: Auto wrap ✅ -->
<div style="width: 300px">
  This long text will automatically wrap to the next line when it reaches the boundary.
</div>

<!-- SVG: Overflow ❌ -->
<svg>
  <text x="0" y="20" style="width: 300px">
    This long text will overflow outside the SVG boundary and keep going forever...
  </text>
</svg>
```

**Root Cause:** SVG `<text>` element tidak mengenal konsep "width" atau "max-width". Text akan render dalam single line sampai infinity.

---

## Solution 1: Manual Line Break dengan `<tspan>`

### Basic Pattern

```jsx
<text x={36} y={24} fontSize={14} fill="#94A3B8">
  <tspan x={36} dy={0}>First line of text that fits nicely</tspan>
  <tspan x={36} dy={20}>Second line continues here with proper spacing</tspan>
  <tspan x={36} dy={20}>Third line if needed</tspan>
</text>
```

**Key Attributes:**
- `x={36}` - Reset horizontal position di setiap tspan (untuk left align konsisten)
- `dy={0}` - Baris pertama, no vertical offset
- `dy={20}` - Baris berikutnya, offset dari baris sebelumnya

### Spacing Guidelines

```js
// Font size → dy spacing mapping
fontSize={11}  → dy={16-18}
fontSize={12}  → dy={17-19}
fontSize={14}  → dy={18-22}
fontSize={16}  → dy={20-24}
fontSize={18}  → dy={22-26}
```

**Formula:** `dy = fontSize * 1.3 to 1.5` (line-height equivalent)

### With Inline Styling

```jsx
<text x={36} y={24} fontSize={14} fill="#64748B" fontFamily="monospace">
  <tspan x={36} dy={0}>
    Setiap halaman = 4 KB data. Kernel memutuskan di{' '}
    <tspan fill="#A78BFA" fontWeight={700}>Physical Frame</tspan> mana
  </tspan>
  <tspan x={36} dy={20}>setiap halaman disimpan.</tspan>
</text>
```

**Notes:**
- Nested `<tspan>` untuk color/weight changes
- Parent `<text>` attributes inherited kecuali di-override
- Whitespace di JSX preserved (gunakan `{' '}` untuk explicit space)

---

## Solution 2: Multiple Boxes (Recommended for 3+ Lines)

### Pattern

```jsx
{/* Box 1 - Technical Content */}
<g transform="translate(0, 460)">
  <rect width={732} height={65} rx={14} 
    fill="#0F172A" 
    stroke="#334155" 
    strokeWidth={1}/>
  <text x={36} y={24} fontSize={14} fontFamily="monospace" fill="#94A3B8">
    <tspan x={36} dy={0}>Technical explanation line 1...</tspan>
    <tspan x={36} dy={20}>Technical explanation line 2...</tspan>
  </text>
</g>

{/* Box 2 - General Explanation */}
<g transform="translate(0, 535)">
  <rect width={732} height={45} rx={14} 
    fill="#0F172A" 
    stroke="#334155" 
    strokeWidth={1}/>
  <text x={36} y={28} fontSize={14} fontFamily="sans-serif" fill="#CBD5E1">
    General human-friendly explanation in separate box.
  </text>
</g>
```

### When to Use Multiple Boxes

✅ **Use when:**
- 3+ lines of text
- Mix of technical (monospace) + general (sans-serif) content
- Need visual separation between concepts
- Different styling per section (e.g., alert box + info box)

❌ **Don't use when:**
- 1-2 lines only (overkill, waste space)
- Tight vertical space constraints
- Content semantically belongs together

### Box Height Guidelines

```js
// Single line
height = 45px  // fontSize 14 + 31px padding (top+bottom)

// Two lines
height = 65px  // fontSize 14 * 2 + 20px line spacing + 27px padding

// Three lines
height = 85px  // fontSize 14 * 3 + 40px line spacing + 27px padding

// Formula
height = (fontSize * lineCount) + ((lineCount - 1) * lineSpacing) + topPadding + bottomPadding
```

**Example Calculation:**
```
fontSize:     14px
lineCount:    2
lineSpacing:  20px
topPadding:   24px (y position)
bottomPadding: ~17px (visual balance)

height = (14 * 2) + (1 * 20) + 24 + 17 = 65px ✅
```

---

## Solution 3: Reduce Font Size (Last Resort)

### When Acceptable

```jsx
{/* Original - overflow */}
<text x={36} y={28} fontSize={14}>
  Very long technical explanation that definitely overflows the 732px boundary...
</text>

{/* Reduced - fits but smaller */}
<text x={36} y={28} fontSize={12}>
  Very long technical explanation that definitely overflows the 732px boundary...
</text>
```

**Rules:**
- Max reduction: 2px (14→12 OK, 14→10 NOT OK)
- Only for captions or secondary info
- NEVER for primary content atau body text
- Check readability di device kecil

### Better Alternative

Daripada reduce font, **edit text content** untuk lebih concise:

```jsx
{/* ❌ Long & reduced font */}
<text fontSize={11}>
  The kernel will decide in which physical frame each virtual page is stored in RAM.
</text>

{/* ✅ Concise & normal font */}
<text fontSize={14}>
  Kernel picks Physical Frame for each page.
</text>
```

---

## Solution 4: Dynamic Text Width Calculation (Advanced)

### Pattern

```jsx
const [textWidth, setTextWidth] = useState(0)
const textRef = useRef(null)

useEffect(() => {
  if (textRef.current) {
    const bbox = textRef.current.getBBox()
    setTextWidth(bbox.width)
  }
}, [textContent])

return (
  <g>
    <text ref={textRef} x={36} y={28} fontSize={14}>
      {textContent}
    </text>
    {textWidth > 650 && (
      <text x={36} y={50} fontSize={11} fill="#F43F5E">
        ⚠ Text too long, will overflow!
      </text>
    )}
  </g>
)
```

**Use Cases:**
- Development/debug mode
- User-generated content
- Dynamic translations

**Warning:** `getBBox()` only works after element rendered ke DOM. Not available di SSR.

---

## Common Pitfalls

### ❌ Pitfall 1: Forgetting `x` Reset di `<tspan>`

```jsx
{/* BAD: Second line indented weirdly */}
<text x={36} y={24}>
  <tspan dy={0}>First line at x=36</tspan>
  <tspan dy={20}>Second line offset dari end of first line (??) </tspan>
</text>

{/* GOOD: Consistent left align */}
<text x={36} y={24}>
  <tspan x={36} dy={0}>First line at x=36</tspan>
  <tspan x={36} dy={20}>Second line also at x=36 ✅</tspan>
</text>
```

### ❌ Pitfall 2: Inconsistent `dy` Values

```jsx
{/* BAD: Uneven spacing */}
<text x={36} y={24}>
  <tspan x={36} dy={0}>Line 1</tspan>
  <tspan x={36} dy={25}>Line 2 - too far</tspan>
  <tspan x={36} dy={15}>Line 3 - too close</tspan>
</text>

{/* GOOD: Consistent rhythm */}
<text x={36} y={24}>
  <tspan x={36} dy={0}>Line 1</tspan>
  <tspan x={36} dy={20}>Line 2</tspan>
  <tspan x={36} dy={20}>Line 3</tspan>
</text>
```

### ❌ Pitfall 3: Box Height Tidak Sesuai Content

```jsx
{/* BAD: Text overflow keluar dari box */}
<g>
  <rect width={732} height={45} fill="#0F172A"/>
  <text x={36} y={24}>
    <tspan x={36} dy={0}>Line 1</tspan>
    <tspan x={36} dy={20}>Line 2</tspan>
    <tspan x={36} dy={20}>Line 3 - keluar dari box!</tspan>
  </text>
</g>

{/* GOOD: Box height accommodate semua lines */}
<g>
  <rect width={732} height={85} fill="#0F172A"/>
  <text x={36} y={24}>
    <tspan x={36} dy={0}>Line 1</tspan>
    <tspan x={36} dy={20}>Line 2</tspan>
    <tspan x={36} dy={20}>Line 3 - masih ada space ✅</tspan>
  </text>
</g>
```

### ❌ Pitfall 4: Nested `<tspan>` Tanpa Close Tag Proper

```jsx
{/* BAD: Unclosed tspan causes weird inheritance */}
<text>
  <tspan x={36} dy={0}>Normal <tspan fill="#A78BFA">highlighted</tspan> back to normal
</text>

{/* GOOD: Explicit structure */}
<text>
  <tspan x={36} dy={0}>
    Normal <tspan fill="#A78BFA">highlighted</tspan> back to normal
  </tspan>
</text>
```

---

## Text Measurement Helper

### Estimate Text Width (Rough)

```js
// Monospace fonts (konsisten per char)
const monoCharWidth = {
  11: 6.6,  // fontSize 11 ≈ 6.6px per char
  12: 7.2,
  14: 8.4,
  16: 9.6,
}

function estimateMonoWidth(text, fontSize) {
  return text.length * monoCharWidth[fontSize]
}

// Usage
const text = "Browser P0"
const width = estimateMonoWidth(text, 14)  // ≈ 84px

// Check overflow
if (width > 650) {
  console.warn('Text will overflow!')
}
```

### Estimate Sans-serif Width (Variable)

```js
// Average char width (sans-serif lebih variable)
const sansCharWidth = {
  11: 5.5,
  12: 6.0,
  14: 7.0,
  16: 8.0,
}

function estimateSansWidth(text, fontSize) {
  // Add 10% buffer for wide chars (W, M, etc)
  return text.length * sansCharWidth[fontSize] * 1.1
}
```

**Note:** Ini rough estimate. Actual width depends on:
- Font family (Arial vs Helvetica vs System)
- Font weight (normal vs bold)
- Character composition (lowercase vs UPPERCASE)

Untuk precision, use `getBBox()` setelah render.

---

## Typography Best Practices

### Hierarchy

```jsx
{/* Title - Large, Bold */}
<text fontSize={20} fontFamily="'Arial Black', sans-serif" fontWeight={900}>
  MAIN TITLE
</text>

{/* Heading - Medium, Semi-bold */}
<text fontSize={16} fontFamily="sans-serif" fontWeight={700}>
  Section Heading
</text>

{/* Body Technical - Normal, Monospace */}
<text fontSize={14} fontFamily="monospace" fill="#94A3B8">
  Technical content (code-like)
</text>

{/* Body General - Normal, Sans-serif */}
<text fontSize={14} fontFamily="sans-serif" fill="#CBD5E1">
  Human-friendly explanation
</text>

{/* Caption - Small */}
<text fontSize={11} fontFamily="sans-serif" fill="#64748B">
  Additional info or metadata
</text>
```

### Color Contrast

```jsx
// Light text on dark background (current theme)
Background: #070913 (dark blue-gray)

Text Colors:
- Primary:   #E2E8F0  (contrast ratio 12.8:1 ✅)
- Secondary: #CBD5E1  (contrast ratio 10.5:1 ✅)
- Tertiary:  #94A3B8  (contrast ratio 6.8:1 ✅)
- Muted:     #64748B  (contrast ratio 4.6:1 ✅ for large text)
- Dim:       #475569  (contrast ratio 3.2:1 ⚠ use sparingly)
```

**WCAG AA Requirements:**
- Normal text (14px): min 4.5:1 contrast
- Large text (18px+): min 3:1 contrast

**Check at:** https://webaim.org/resources/contrastchecker/

### Line Length

```js
// Optimal line length untuk readability
Monospace (code):    50-70 characters
Sans-serif (prose):  45-75 characters

// Current layout
Box width:     732px
Left padding:  36px
Right padding: 36px
Usable width:  660px

// Max chars per line
fontSize 14 monospace: ~78 chars (sedikit over, OK untuk technical)
fontSize 14 sans:      ~94 chars (too long, should break earlier)
```

**Recommendation:** Break lines at 65-70 chars untuk readability optimal.

---

## Real-world Examples

### Example 1: Virtual Memory Act 2 Insight

```jsx
{/* Box 1 - Technical (2 lines) */}
<g transform="translate(0, 465)">
  <rect width={732} height={65} rx={14} fill="#0F172A" stroke="#334155" strokeWidth={1}/>
  <text x={36} y={24} fill="#64748B" fontSize={14} fontFamily="monospace">
    <tspan x={36} dy={0}>
      Setiap halaman = 4 KB data. Kernel memutuskan di{' '}
      <tspan fill="#A78BFA" fontWeight={700}>Physical Frame</tspan> mana
    </tspan>
    <tspan x={36} dy={20}>setiap halaman disimpan.</tspan>
  </text>
</g>

{/* Box 2 - Explanation (1 line) */}
<g transform="translate(0, 540)">
  <rect width={732} height={45} rx={14} fill="#0F172A" stroke="#334155" strokeWidth={1}/>
  <text x={36} y={28} fill="#64748B" fontSize={14} fontFamily="sans-serif">
    Aplikasi hanya tahu "Virtual Address" — tidak peduli di mana fisiknya.
  </text>
</g>
```

**Why 2 boxes:**
- Semantic separation (technical vs general explanation)
- Different font families (monospace vs sans-serif)
- Visual breathing room antara concepts
- Easier maintenance (edit one tanpa affect layout lain)

### Example 2: Multi-line Label di Slot

```jsx
{/* RAM Slot dengan multi-line label */}
<g transform={`translate(${x}, ${y})`}>
  <rect width={155} height={75} rx={10} fill={`${color}28`} stroke={color} strokeWidth={2}/>
  
  {/* Title */}
  <text x={78} y={25} textAnchor="middle" fill={color} fontSize={13} fontWeight={800}>
    Browser P0
  </text>
  
  {/* Subtitle */}
  <text x={78} y={45} textAnchor="middle" fill="#94A3B8" fontSize={11}>
    4 KB
  </text>
  
  {/* Badge */}
  <circle cx={135} cy={15} r={6} fill={color}/>
</g>
```

**Pattern:** Small fixed-size boxes (155x75) → single-line labels only, gunakan hierarchy (title + subtitle) instead of multi-line.

---

## Debugging Tips

### Visual Grid Overlay

```jsx
{/* Add temporary grid untuk debug text positioning */}
{process.env.NODE_ENV === 'development' && (
  <g opacity={0.2}>
    {/* Vertical guides every 100px */}
    {[0, 100, 200, 300, 400, 500, 600, 700].map(x => (
      <line key={x} x1={x} y1={0} x2={x} y2={VH} stroke="#00FF00" strokeWidth={1}/>
    ))}
    
    {/* Horizontal guides every 50px */}
    {[0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600].map(y => (
      <line key={y} x1={0} y1={y} x2={VW} y2={y} stroke="#00FF00" strokeWidth={1}/>
    ))}
  </g>
)}
```

### Bounding Box Debug

```jsx
{/* Show actual text bounding box */}
<text ref={textRef} x={36} y={28} fontSize={14}>
  Your text content here
</text>

{process.env.NODE_ENV === 'development' && textRef.current && (() => {
  const bbox = textRef.current.getBBox()
  return (
    <rect 
      x={bbox.x} 
      y={bbox.y} 
      width={bbox.width} 
      height={bbox.height}
      fill="none" 
      stroke="#FF0000" 
      strokeWidth={1}
      strokeDasharray="4 2"
    />
  )
})()}
```

---

## Alternatives to SVG Text

### Option: Use HTML Overlay

```jsx
// SVG for graphics
<svg viewBox="0 0 820 640">
  <rect width={732} height={65} fill="#0F172A"/>
  {/* Visual elements only */}
</svg>

// HTML for text (better wrapping)
<div style={{
  position: 'absolute',
  top: '460px',
  left: '44px',
  width: '732px',
  fontSize: '14px',
  fontFamily: 'monospace',
  color: '#94A3B8'
}}>
  This text will wrap automatically when it reaches the boundary, just like normal HTML text behavior.
</div>
```

**Pros:**
- Auto text wrapping ✅
- Better typography control ✅
- Easier i18n/translation ✅

**Cons:**
- Text not part of SVG export ❌
- Positioning complexity (absolute positioning) ❌
- Koordinasi antara SVG + HTML layers tricky ❌

**Verdict:** Not recommended untuk export-heavy use cases (MP4 rendering). OK untuk web-only viewers.

### Option: Use `<foreignObject>`

```jsx
<svg viewBox="0 0 820 640">
  <rect width={732} height={65} fill="#0F172A"/>
  
  <foreignObject x={36} y={460} width={660} height={65}>
    <div xmlns="http://www.w3.org/1999/xhtml" style={{
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#94A3B8'
    }}>
      This HTML text renders INSIDE SVG canvas and will wrap automatically!
    </div>
  </foreignObject>
</svg>
```

**Pros:**
- Auto text wrapping ✅
- Text part of SVG ✅
- Exportable ✅ (depends on renderer)

**Cons:**
- Browser support uneven (works di modern browsers, iffy di older) ⚠
- Export renderer mungkin tidak support (FFmpeg/Puppeteer) ❌
- XMLNS declaration required (easy to forget) ⚠

**Verdict:** Worth exploring untuk future. Test export compatibility first.

---

## Summary

### Quick Decision Tree

```
Need to render text in SVG?
│
├─ 1-2 lines, fits width?
│  └─ Use simple <text> ✅
│
├─ 1-2 lines, too long?
│  └─ Use <text> + <tspan> untuk break ✅
│
├─ 3+ lines?
│  └─ Use multiple boxes (recommended) ✅
│
├─ Dynamic/user content?
│  └─ Consider foreignObject (test export) ⚠
│
└─ Web-only viewer?
   └─ HTML overlay OK ✅
```

### Golden Rules

1. **Always test di actual viewport size** (jangan assume di dev screen)
2. **Check readability di 1080p & 4K** (scaling behavior berbeda)
3. **Use consistent dy spacing** dalam satu text block
4. **Box height = content + breathing room** (jangan terlalu ketat)
5. **Monospace for code, sans-serif for prose**
6. **Check color contrast** (min 4.5:1 untuk body text)
7. **Break lines at logical points** (after punctuation, before keywords)

---

## Further Reading

- SVG Text Spec: https://www.w3.org/TR/SVG2/text.html
- WCAG Contrast: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum
- Typography Best Practices: https://practicaltypography.com/
