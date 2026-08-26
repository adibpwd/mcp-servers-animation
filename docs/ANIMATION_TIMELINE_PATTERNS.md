# GSAP Timeline Animation Patterns

Best practices untuk build smooth, loopable animations dengan GSAP.

---

## Core Timeline Setup

### Basic Structure

```jsx
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function YourAnimation({ paused = false, speed = 1.0 }) {
  const tlRef = useRef(null)
  const [phaseIdx, setPhaseIdx] = useState(0)

  useEffect(() => {
    const tl = gsap.timeline({ 
      repeat: -1,        // Infinite loop
      repeatDelay: 1     // 1s pause before restart
    })
    
    tlRef.current = tl
    window.__animationTimeline = tl  // Required for timeline controls
    
    let t = 0  // Time cursor

    // Your animations here
    
    return () => tl.kill()  // Cleanup on unmount
  }, [])

  // Handle paused prop
  useEffect(() => {
    if (tlRef.current) {
      paused ? tlRef.current.pause() : tlRef.current.play()
    }
  }, [paused])

  // Handle speed prop
  useEffect(() => {
    if (tlRef.current) {
      tlRef.current.timeScale(speed)
    }
  }, [speed])

  return <svg>{/* Your SVG content */}</svg>
}
```

**Key Points:**
- `window.__animationTimeline` WAJIB untuk PREV/NEXT button integration
- Always cleanup dengan `return () => tl.kill()`
- Separate useEffects untuk paused/speed untuk reactivity proper

---

## Time Cursor Pattern

### ✅ Recommended: Sequential Time Cursor

```js
let t = 0  // Time cursor

// Act 1
tl.add(() => setPhaseIdx(0), t)
tl.to(element, { x: 100, duration: 1 }, t + 0.5)
tl.to(element, { y: 50, duration: 0.8 }, t + 1.5)
t += 8  // Act 1 duration

// Act 2
tl.add(() => setPhaseIdx(1), t)
tl.to(element, { rotation: 90, duration: 1.2 }, t + 0.3)
t += 12  // Act 2 duration

// Act 3
tl.add(() => setPhaseIdx(2), t)
// ...
```

**Pros:**
- Easy to read/maintain ✅
- Clear Act boundaries ✅
- Easy to adjust timing (change one number) ✅
- No mental math (t + 0.5 + 1.0 + 0.8 = ?) ✅

### ❌ Avoid: Relative Positioning

```js
// BAD: Hard to track total timeline length
tl.to(element, { x: 100 }, '+=0.5')
tl.to(element, { y: 50 }, '+=0.3')
tl.to(element, { rotation: 90 }, '+=0.8')
// What's total duration? Need to sum manually...
```

### ❌ Avoid: Hardcoded Absolute Times

```js
// BAD: Changing Act 1 duration breaks everything
tl.to(element, { x: 100 }, 8.5)   // Act 1 ends at 8
tl.to(element, { y: 50 }, 9.3)    // If Act 1 changes, need to update ALL
tl.to(element, { rotation: 90 }, 10.1)
```

---

## State Management

### Pattern 1: React State untuk Visual Updates

```jsx
const [items, setItems] = useState([])

// Timeline callback updates React state
tl.add(() => {
  setItems(prev => [...prev, newItem])
}, t + 1)

// Render dari state
return (
  <g>
    {items.map(item => (
      <rect key={item.id} fill={item.color} />
    ))}
  </g>
)
```

**Use for:**
- Adding/removing elements
- Conditional rendering
- Complex state logic

### Pattern 2: Tween Object untuk Smooth Animations

```jsx
const [progress, setProgress] = useState(0)

// Tween object (not state directly)
const progressObj = { v: 0 }

tl.to(progressObj, {
  v: 100,
  duration: 2,
  ease: 'power2.out',
  onUpdate: () => setProgress(Math.round(progressObj.v))
}, t)

// Render dari state
return <text>{progress}%</text>
```

**Use for:**
- Numeric counters
- Progress bars
- Opacity transitions
- Smooth interpolations

### ⚠️ Common Mistake: Direct State Tweening

```jsx
// ❌ BAD: GSAP cannot tween React state directly
const [progress, setProgress] = useState(0)
tl.to(progress, { v: 100 }, t)  // Won't work!

// ✅ GOOD: Tween intermediate object, update state in callback
const progressObj = { v: 0 }
tl.to(progressObj, { 
  v: 100, 
  onUpdate: () => setProgress(progressObj.v) 
}, t)
```

---

## Loop-safe Patterns

### Problem: State Overflow Setelah Loop

```jsx
// ❌ BAD: Cumulative values overflow setelah loop
const ramPctObj = { v: 0 }

tl.to(ramPctObj, { v: ramPctObj.v + 17 }, t)  // Loop 1: 17%
tl.to(ramPctObj, { v: ramPctObj.v + 16 }, t + 1)  // Loop 1: 33%
// Loop 2: 33 + 17 = 50%, 50 + 16 = 66%
// Loop 3: 66 + 17 = 83%, 83 + 16 = 99%
// Loop 4: OVERFLOW! 99 + 17 = 116% ❌
```

### ✅ Solution 1: Fixed Target Values

```jsx
const ramPctObj = { v: 0 }

// Reset di awal Act
tl.add(() => { ramPctObj.v = 0 }, t)

// Tween ke fixed targets
tl.to(ramPctObj, { v: 17 }, t + 1)   // Always 17%
tl.to(ramPctObj, { v: 33 }, t + 2)   // Always 33%
tl.to(ramPctObj, { v: 50 }, t + 3)   // Always 50%
// Setiap loop: 0 → 17 → 33 → 50 ✅
```

### ✅ Solution 2: State Reset at Act Start

```jsx
tl.add(() => {
  // Reset ALL state to initial values
  setRamPct(0)
  setRamSlots(INITIAL_SLOTS)
  setSwapPct(0)
  ramPctObj.v = 0
  swapPctObj.v = 0
}, t)
```

**Golden Rule:** Setiap Act harus bisa start dari clean slate. No assumptions tentang state dari Act sebelumnya.

---

## Animation Sequencing

### Sequential (One After Another)

```js
let t = 0

tl.to(element, { x: 100, duration: 1 }, t)
t += 1  // Wait for previous to finish

tl.to(element, { y: 50, duration: 0.5 }, t)
t += 0.5

tl.to(element, { rotation: 90, duration: 0.8 }, t)
t += 0.8
```

### Simultaneous (Parallel)

```js
let t = 0

// Both animations start at t=0, run in parallel
tl.to(element1, { x: 100, duration: 1 }, t)
tl.to(element2, { y: 50, duration: 1 }, t)
// Don't increment t between parallel animations

t += 1  // Increment only AFTER all parallel animations
```

### Overlap (Staggered)

```js
let t = 0

tl.to(element1, { x: 100, duration: 1 }, t)
tl.to(element2, { x: 100, duration: 1 }, t + 0.3)  // Starts 0.3s after element1
tl.to(element3, { x: 100, duration: 1 }, t + 0.6)  // Starts 0.3s after element2

t += 1.6  // Last animation finishes at t + 0.6 + 1.0 = 1.6
```

### Stagger Helper (Many Elements)

```js
// Animate array of items with stagger
const items = [item1, item2, item3, item4, item5]

items.forEach((item, i) => {
  tl.to(item, { 
    opacity: 1, 
    scale: 1, 
    duration: 0.5 
  }, t + i * 0.2)  // Each starts 0.2s after previous
})

t += items.length * 0.2 + 0.5  // Total = stagger time + last animation duration
```

---

## Easing Functions

### Common Easings

```js
// Ease out (fast start, slow end) - Most natural
tl.to(element, { x: 100, ease: 'power2.out' }, t)

// Ease in (slow start, fast end)
tl.to(element, { x: 100, ease: 'power2.in' }, t)

// Ease in-out (smooth both ends)
tl.to(element, { x: 100, ease: 'power2.inOut' }, t)

// Linear (no easing, constant speed)
tl.to(element, { x: 100, ease: 'none' }, t)

// Elastic (bouncy overshoot)
tl.to(element, { scale: 1, ease: 'elastic.out(1, 0.5)' }, t)

// Back (slight overshoot)
tl.to(element, { x: 100, ease: 'back.out(1.4)' }, t)
```

### Easing Selection Guide

```js
// Element entering screen
ease: 'power3.out'  // Fast entrance, smooth landing

// Element exiting screen
ease: 'power2.in'  // Accelerate away

// UI transitions (buttons, modals)
ease: 'power2.inOut'  // Balanced, professional

// Progress bars, counters
ease: 'power2.out'  // Quick start, slow finish (feels faster)

// Physical objects (bounce, spring)
ease: 'elastic.out(1, 0.5)'  // Playful, fun

// Continuous loops (rotation)
ease: 'none'  // Linear for smooth loops
```

**Recommendation:** Default to `power2.out` untuk majority of animations. It's versatile and feels natural.

---

## Callback Patterns

### Timeline Callbacks

```js
// Callback at specific time
tl.add(() => {
  console.log('This runs at t=5')
  setPhaseIdx(1)
}, 5)

// Callback with label
tl.addLabel('act2Start', t)
tl.add(() => {
  console.log('Act 2 starts')
}, 'act2Start')
```

### Tween Callbacks

```js
tl.to(element, {
  x: 100,
  duration: 1,
  
  // Runs when tween starts
  onStart: () => {
    console.log('Animation started')
    sfx('whoosh')
  },
  
  // Runs every frame during tween
  onUpdate: () => {
    setProgress(element.x)
  },
  
  // Runs when tween completes
  onComplete: () => {
    console.log('Animation finished')
    setCompleted(true)
  },
  
  // Runs when tween is repeated (if repeat > 0)
  onRepeat: () => {
    console.log('Animation looped')
  }
}, t)
```

### Real-world Example: SFX Integration

```js
const sfx = (name) => {
  if (!previewSfx) return
  const audio = new Audio(`/audio/sfx/${name}.wav`)
  audio.volume = volume / 100
  audio.playbackRate = speed
  audio.play().catch(() => {})
}

// Play SFX at animation start
tl.add(() => {
  setDeskItems(prev => [...prev, newItem])
  sfx('click')  // Sync sound with visual
}, t + 1)
```

---

## Advanced Patterns

### Pattern 1: Moving Element Animation

```jsx
const [movingItem, setMovingItem] = useState(null)

// Animate item from A to B
const moveObj = { x: 0 }

tl.add(() => {
  setMovingItem({ label: 'Item', color: '#38BDF8', x: 0 })
}, t)

tl.to(moveObj, {
  x: 1,
  duration: 1.2,
  ease: 'power2.inOut',
  onUpdate: () => {
    setMovingItem(prev => prev ? { ...prev, x: moveObj.x } : null)
  }
}, t + 0.1)

tl.add(() => setMovingItem(null), t + 1.3)

// Render
const lerp = (a, b, t) => a + (b - a) * t

{movingItem && (
  <g transform={`translate(${lerp(startX, endX, movingItem.x)}, ${y})`}>
    <rect fill={movingItem.color} />
    <text>{movingItem.label}</text>
  </g>
)}
```

**Use for:**
- Drag & drop simulation
- Item transitions between containers
- Data flow visualization

### Pattern 2: Morph Animation

```jsx
const [morphP, setMorphP] = useState(0)

const mo = { p: 0 }
tl.to(mo, {
  p: 1,
  duration: 0.8,
  ease: 'power3.inOut',
  onUpdate: () => setMorphP(mo.p)
}, t)

// Render with interpolation
const radius = lerp(10, 50, morphP)
const opacity = morphP
const color = lerpColor('#38BDF8', '#F43F5E', morphP)

<circle r={radius} opacity={opacity} fill={color} />
```

**Use for:**
- Shape transitions
- Icon morphs
- Color gradients
- Intro/outro effects

### Pattern 3: Multi-step Sequence with State

```jsx
const [step, setStep] = useState(0)

// Step 1: Setup
tl.add(() => setStep(1), t)
tl.to(element, { opacity: 1, duration: 0.5 }, t)
t += 1

// Step 2: Process
tl.add(() => setStep(2), t)
tl.to(progressBar, { width: 100, duration: 2 }, t)
t += 2.5

// Step 3: Complete
tl.add(() => setStep(3), t)
tl.to(checkmark, { scale: 1, ease: 'back.out(1.7)', duration: 0.6 }, t)
t += 1

// Conditional rendering based on step
{step === 1 && <LoadingSpinner />}
{step === 2 && <ProgressBar />}
{step === 3 && <Checkmark />}
```

---

## Performance Optimization

### Avoid Expensive Operations in `onUpdate`

```jsx
// ❌ BAD: Heavy computation every frame (60fps = 60x per second)
tl.to(obj, {
  x: 100,
  duration: 2,
  onUpdate: () => {
    const complexCalc = items.map(i => heavyFunction(i))  // Expensive!
    setData(complexCalc)
  }
}, t)

// ✅ GOOD: Only update simple values in onUpdate
tl.to(obj, {
  x: 100,
  duration: 2,
  onUpdate: () => {
    setProgress(obj.x)  // Simple assignment
  }
}, t)
```

### Use Direct Property Animation When Possible

```jsx
// ✅ BEST: Let GSAP animate DOM properties directly (no React re-renders)
useEffect(() => {
  gsap.to(svgRef.current, { rotation: 360, duration: 2 })
}, [])

// ❌ SLOWER: Animate via React state (triggers re-renders)
const [rotation, setRotation] = useState(0)
tl.to({ v: 0 }, { 
  v: 360, 
  onUpdate: (self) => setRotation(self.targets()[0].v) 
}, t)
```

**Rule of Thumb:** Animate SVG attributes directly via refs untuk smooth animations. Use state untuk discrete updates (adding/removing elements).

### Throttle State Updates

```jsx
let lastUpdate = 0

tl.to(obj, {
  x: 100,
  duration: 2,
  onUpdate: () => {
    const now = Date.now()
    // Only update state max 10x per second (instead of 60x)
    if (now - lastUpdate > 100) {
      setProgress(obj.x)
      lastUpdate = now
    }
  }
}, t)
```

---

## Common Pitfalls

### ❌ Pitfall 1: Forgetting `window.__animationTimeline`

```jsx
// BAD: Timeline controls won't work
useEffect(() => {
  const tl = gsap.timeline({ repeat: -1 })
  tlRef.current = tl
  // Missing: window.__animationTimeline = tl
  
  // Result: PREV/NEXT buttons don't skip timeline ❌
}, [])
```

**Fix:** Always assign timeline to window object:
```js
window.__animationTimeline = tl
```

### ❌ Pitfall 2: Not Cleaning Up Timeline

```jsx
// BAD: Timeline keeps running after unmount (memory leak)
useEffect(() => {
  const tl = gsap.timeline({ repeat: -1 })
  // Missing cleanup
}, [])
```

**Fix:** Always kill timeline on unmount:
```js
return () => tl.kill()
```

### ❌ Pitfall 3: Dependencies in useEffect

```jsx
// BAD: Timeline recreated every time speed changes
useEffect(() => {
  const tl = gsap.timeline({ repeat: -1 })
  tl.to(element, { x: 100 }, 0)
  return () => tl.kill()
}, [speed])  // Timeline rebuilt on speed change!
```

**Fix:** Separate timeline creation from speed control:
```jsx
// Create timeline once
useEffect(() => {
  const tl = gsap.timeline({ repeat: -1 })
  tlRef.current = tl
  return () => tl.kill()
}, [])

// Control speed separately
useEffect(() => {
  if (tlRef.current) {
    tlRef.current.timeScale(speed)
  }
}, [speed])
```

### ❌ Pitfall 4: Time Cursor Arithmetic Errors

```jsx
// BAD: Lost track of time cursor
let t = 0
tl.to(element, { x: 100, duration: 1 }, t)
t += 0.5  // Wrong! Animation duration is 1, not 0.5
tl.to(element, { y: 50, duration: 0.8 }, t)  // Overlaps unintentionally
```

**Fix:** Increment by actual duration:
```js
let t = 0
tl.to(element, { x: 100, duration: 1 }, t)
t += 1  // Match duration ✅
tl.to(element, { y: 50, duration: 0.8 }, t)
t += 0.8  // Match duration ✅
```

---

## Debugging Timeline

### Console Log Timeline Structure

```jsx
useEffect(() => {
  const tl = gsap.timeline({ repeat: -1 })
  // ... build timeline
  
  console.log('Timeline duration:', tl.duration())
  console.log('Timeline progress:', tl.progress())
  console.log('Timeline children:', tl.getChildren())
  
  // Debug: Log current time every second
  setInterval(() => {
    console.log('Timeline time:', tl.time())
  }, 1000)
}, [])
```

### Visual Timeline Indicator

```jsx
const [debugTime, setDebugTime] = useState(0)

useEffect(() => {
  const tl = gsap.timeline({ repeat: -1 })
  tlRef.current = tl
  
  // Update debug time every frame
  tl.eventCallback('onUpdate', () => {
    setDebugTime(tl.time())
  })
}, [])

// Render debug overlay
{process.env.NODE_ENV === 'development' && (
  <text x={10} y={30} fill="#00FF00" fontSize={14} fontFamily="monospace">
    Time: {debugTime.toFixed(2)}s / {tlRef.current?.duration().toFixed(2)}s
  </text>
)}
```

### Pause at Specific Time (Debug)

```jsx
useEffect(() => {
  const tl = gsap.timeline({ repeat: -1 })
  // ... build timeline
  
  // Pause at t=5 to inspect state
  tl.pause(5)
  
  // Or pause at label
  tl.addLabel('debugPoint', 8.5)
  tl.pause('debugPoint')
}, [])
```

---

## Real-world Examples

### Example 1: RAM Filling Animation (Virtual Memory)

```jsx
const ramPctObj = { v: 0 }
const [ramPct, setRamPct] = useState(0)
const [ramSlots, setRamSlots] = useState(INITIAL_SLOTS)

// Reset state di awal Act
tl.add(() => {
  ramPctObj.v = 0
  setRamPct(0)
  setRamSlots(INITIAL_SLOTS)
}, t)

// Each allocation: arrow animation + slot fill + progress update
const allocations = [
  { slot: 0, label: 'Browser P0', targetPct: 17, at: t + 1.0 },
  { slot: 1, label: 'Browser P1', targetPct: 33, at: t + 2.3 },
  { slot: 2, label: 'Browser P2', targetPct: 50, at: t + 3.6 },
]

allocations.forEach(alloc => {
  // Arrow animation (0.5s)
  const arrowObj = { x: 0 }
  tl.add(() => setArrowVisible(true), alloc.at)
  tl.to(arrowObj, {
    x: 1,
    duration: 0.5,
    ease: 'power2.inOut',
    onUpdate: () => setArrowPos(arrowObj.x)
  }, alloc.at)
  
  // Slot fills + RAM bar updates (parallel with arrow)
  tl.to(ramPctObj, {
    v: alloc.targetPct,
    duration: 0.4,
    ease: 'power2.out',
    onUpdate: () => setRamPct(Math.round(ramPctObj.v))
  }, alloc.at + 0.1)
  
  tl.add(() => {
    setRamSlots(prev => {
      const n = [...prev]
      n[alloc.slot] = { ...n[alloc.slot], label: alloc.label, filled: true }
      return n
    })
  }, alloc.at + 0.5)
})

t += 5  // Total Act duration
```

### Example 2: Swap Out Animation

```jsx
const [movingPage, setMovingPage] = useState(null)

// Page moves from RAM to Swap
const moveObj = { x: 0 }

tl.add(() => {
  setMovingPage({ label: 'Game P0', color: '#A78BFA', x: 0 })
  setSwapAlert(true)
  sfx('error')
}, t)

tl.to(moveObj, {
  x: 1,
  duration: 1.2,
  ease: 'power2.inOut',
  onUpdate: () => {
    if (movingPage) {
      setMovingPage(prev => ({ ...prev, x: moveObj.x }))
    }
  }
}, t + 0.2)

tl.add(() => {
  setMovingPage(null)
  setSwapAlert(false)
  // Update RAM and Swap bars
  setAct3Ram(83)
  setAct3Swap(17)
}, t + 1.4)

t += 2
```

---

## Testing Checklist

### Before Commit
- [ ] Timeline loops smoothly (no state overflow)
- [ ] `window.__animationTimeline` assigned
- [ ] Cleanup function present (`tl.kill()`)
- [ ] Pause/play works correctly
- [ ] Speed control works (0.5x, 1x, 2x)
- [ ] PREV/NEXT buttons skip 5s properly
- [ ] No console errors after 3+ loops
- [ ] All Acts have proper duration in `PHASES`

### Performance
- [ ] No janky animations (check at 30fps and 60fps)
- [ ] State updates throttled if needed
- [ ] No expensive computations in `onUpdate`
- [ ] Direct DOM animations used where possible

### Visual
- [ ] Timeline matches PHASES duration
- [ ] Easing feels natural
- [ ] SFX sync with visuals
- [ ] No visual glitches during loop restart

---

## Summary

### Core Principles

1. **Use time cursor pattern** for readable sequencing
2. **Reset state at Act start** for clean loops
3. **Use fixed target values** instead of cumulative
4. **Separate timeline creation from controls** (pause/speed)
5. **Always cleanup** with `tl.kill()`
6. **Register to window object** for timeline controls

### Quick Reference

```js
// Timeline setup
const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 })
window.__animationTimeline = tl

// Time cursor
let t = 0
tl.to(element, { x: 100, duration: 1 }, t)
t += 1

// State updates
tl.add(() => setState(newValue), t)

// Smooth tweening
const obj = { v: 0 }
tl.to(obj, { v: 100, onUpdate: () => setState(obj.v) }, t)

// Cleanup
return () => tl.kill()
```

---

## Further Reading

- GSAP Timeline Docs: https://greensock.com/docs/v3/GSAP/Timeline
- Easing Visualizer: https://greensock.com/ease-visualizer/
- GSAP Cheat Sheet: https://ihatetomatoes.net/greensock-cheat-sheet/
