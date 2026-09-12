import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import { VW, VH, PHASES, PROCESSES, RAM_SLOTS, LATENCY, ANIMATION_TIMING, SFX_MAP } from './data'
import { getIcon } from './icons/loader'
import sfxLoader from './sfx-loader'

const lerp = (a, b, t) => a + (b - a) * t

export default function VirtualMemoryAnimation({
  paused = false,
  speed = 1.0,
  volume = 75,
  previewSfx = true,
  audioUnlocked = false,
}) {
  const svgRef    = useRef(null)
  const tlRef     = useRef(null)
  const sfxRef    = useRef({})

  const [morphP,    setMorphP]    = useState(0)
  const [showIntro, setShowIntro] = useState(true)
  const [phaseIdx,  setPhaseIdx]  = useState(0)

  // ── ACT 1: analogy ──
  const [deskItems,   setDeskItems]   = useState([])   // berkas di meja
  const [deskFull,    setDeskFull]    = useState(false)
  const [deskVibrate, setDeskVibrate] = useState(0)    // vibration intensity
  const [analCaption, setAnalCaption] = useState('')

  // ── ACT 2: paging ──
  const [ramSlots,    setRamSlots]    = useState(
    RAM_SLOTS.map(s => ({ ...s, proc: null, pageLabel: '', opacity: 1 }))
  )
  const [ramPct,      setRamPct]      = useState(0)
  const [pagingStep,  setPagingStep]  = useState(-1)   // which mapping arrow to show
  const [arrowAnim,   setArrowAnim]   = useState({ x: 0, opacity: 0, label: '' })
  
  // ACT 2: Box appearance animations
  const [appBoxOpacity, setAppBoxOpacity] = useState(0)
  const [appBoxScale, setAppBoxScale] = useState(0)
  const [appBorderDash, setAppBorderDash] = useState(1000)
  
  const [processBoxes, setProcessBoxes] = useState([
    { id: 'browser', opacity: 0, scale: 0 },
    { id: 'game', opacity: 0, scale: 0 },
    { id: 'ide', opacity: 0, scale: 0 }
  ])
  
  const [ramBoxOpacity, setRamBoxOpacity] = useState(0)
  const [ramBoxScale, setRamBoxScale] = useState(0)
  const [ramBorderDash, setRamBorderDash] = useState(1200)

  // ── ACT 3: swap-out ──
  const [swapSlots,   setSwapSlots]   = useState([])   // [{ label, proc, color }]
  const [swapPct,     setSwapPct]     = useState(0)
  const [act3Ram,     setAct3Ram]     = useState(100)  // starts full
  const [act3Swap,    setAct3Swap]    = useState(0)
  const [swapAlert,   setSwapAlert]   = useState(false)
  const [movingPage,  setMovingPage]  = useState(null) // { label, color, x, y }

  // ── ACT 4: swap-in & latency ──
  const [latencyAnim, setLatencyAnim] = useState(LATENCY.map(() => 0))
  const [pageFaultMsg, setPageFaultMsg] = useState(false)
  const [swapInAnim,   setSwapInAnim]   = useState(false)
  
  // ACT 4: Latency bars appearance animation
  const [latencyBarsVisible, setLatencyBarsVisible] = useState([
    { opacity: 0, scale: 0 },
    { opacity: 0, scale: 0 },
    { opacity: 0, scale: 0 },
    { opacity: 0, scale: 0 }
  ])

  const phase = PHASES[phaseIdx] || PHASES[0]

  // ─── SFX ─────────────────────────────────────────────────────
  const sfx = (name) => {
    if (!previewSfx || typeof window === 'undefined') return
    if (!sfxRef.current[name]) sfxRef.current[name] = new Audio(`/audio/sfx/${name}.wav`)
    const a = sfxRef.current[name]
    a.volume = (volume / 100) * 0.35
    a.playbackRate = speed
    a.currentTime = 0
    a.play().catch(() => {})
  }

  // Debug: Log sfxLoader and props
  useEffect(() => {
    console.log('[DEBUG] Animation mounted')
    console.log('[DEBUG] sfxLoader instance:', sfxLoader)
    console.log('[DEBUG] sfxLoader.enabled:', sfxLoader?.enabled)
    console.log('[DEBUG] previewSfx prop:', previewSfx)
    console.log('[DEBUG] audioUnlocked prop:', audioUnlocked)
    console.log('[DEBUG] volume:', volume, 'speed:', speed)
  }, [audioUnlocked])

  // Sync sfxLoader with unlock state
  useEffect(() => {
    const shouldEnable = previewSfx && audioUnlocked
    sfxLoader.setEnabled(shouldEnable)
    console.log('[SFX] sfxLoader.enabled set to:', shouldEnable)
  }, [previewSfx, audioUnlocked])

  // ─── TIMELINE ────────────────────────────────────────────────
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 })
    tlRef.current = tl
    window.__animationTimeline = tl
    window.__flushSync = flushSync

    let t = 0

    // ════ INTRO MORPH ════
    const mo = { p: 0 }
    tl.add(() => { setShowIntro(true); setMorphP(0); sfx('whoosh') }, t)
    tl.to(mo, { p: 1, duration: 0.8, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, t + 0.3)
    tl.add(() => setShowIntro(false), t + 1.1)
    t += 1.4

    // ════ ACT 1: ANALOGY (ENHANCED - PLAYFUL) ════
    tl.add(() => {
      setPhaseIdx(0)
      setDeskItems([])
      setDeskFull(false)
      setDeskVibrate(0)
      setAnalCaption('RAM = Meja kerja kamu saat ini...')
      sfxLoader.sfx(SFX_MAP.WHOOSH.name, { volume, speed })
    }, t)

    const items1 = [
      { id: 'a', label: 'Browser (15 tab)', color: '#38BDF8', icon: 'browser', x: 60,  y: 20 },
      { id: 'b', label: 'Game besar',       color: '#A78BFA', icon: 'game', x: 190, y: 20 },
      { id: 'c', label: 'VS Code',          color: '#34D399', icon: 'editor', x: 320, y: 20 },
      { id: 'd', label: 'Spotify',          color: '#F472B6', icon: 'music', x: 60,  y: 130 },
      { id: 'e', label: 'Zoom Call',        color: '#FBBF24', icon: 'camera', x: 190, y: 130 },
    ]

    // PLAYFUL ITEM SPAWNING (parallelized with stagger)
    items1.forEach((item, i) => {
      const spawnTime = t + 1 + i * ANIMATION_TIMING.ACT1_ITEM_STAGGER
      
      // Item appears with initial state
      tl.add(() => {
        setDeskItems(prev => [...prev, { 
          ...item, 
          scale: 0, 
          rotation: -15, 
          offsetY: 50,
          glow: 0 
        }])
        setAnalCaption(`Membuka ${item.label}...`)
      }, spawnTime)

      // Animate scale with bounce (overshoot)
      const scaleObj = { v: 0 }
      tl.to(scaleObj, {
        v: 1,
        duration: ANIMATION_TIMING.ACT1_ITEM_DURATION,
        ease: 'back.out(1.7)',
        onStart: () => {
          // POP sound saat item mulai muncul
          sfxLoader.ui(SFX_MAP.POP.name, { volume, speed })
        },
        onUpdate: () => {
          setDeskItems(prev => prev.map(itm => 
            itm.id === item.id ? { ...itm, scale: scaleObj.v } : itm
          ))
          // BOUNCE sound saat scale mencapai overshoot (around 1.0)
          if (scaleObj.v >= 0.95 && scaleObj.v <= 1.0) {
            setDeskItems(prev => prev.map(itm => {
              if (itm.id === item.id && !itm.bouncePlayed) {
                sfxLoader.ui(SFX_MAP.BOUNCE.name, { volume, speed })
                return { ...itm, scale: scaleObj.v, bouncePlayed: true }
              }
              return itm.id === item.id ? { ...itm, scale: scaleObj.v } : itm
            }))
          }
        }
      }, spawnTime)

      // Animate rotation (spin entrance)
      const rotObj = { v: -15 }
      tl.to(rotObj, {
        v: 0,
        duration: ANIMATION_TIMING.ACT1_ITEM_DURATION,
        ease: 'power2.out',
        onUpdate: () => {
          setDeskItems(prev => prev.map(itm => 
            itm.id === item.id ? { ...itm, rotation: rotObj.v } : itm
          ))
        }
      }, spawnTime)

      // Animate Y position (slide up)
      const yObj = { v: 50 }
      tl.to(yObj, {
        v: 0,
        duration: ANIMATION_TIMING.ACT1_ITEM_DURATION,
        ease: 'power2.out',
        onUpdate: () => {
          setDeskItems(prev => prev.map(itm => 
            itm.id === item.id ? { ...itm, offsetY: yObj.v } : itm
          ))
        }
      }, spawnTime)

      // Animate glow (fade in then settle)
      const glowObj = { v: 0 }
      tl.to(glowObj, {
        v: 1,
        duration: ANIMATION_TIMING.ACT1_ITEM_DURATION * 0.6,
        ease: 'power2.out',
        onUpdate: () => {
          setDeskItems(prev => prev.map(itm => 
            itm.id === item.id ? { ...itm, glow: glowObj.v } : itm
          ))
        }
      }, spawnTime)
      tl.to(glowObj, {
        v: 0.7,
        duration: ANIMATION_TIMING.ACT1_ITEM_DURATION * 0.4,
        ease: 'power2.in',
        onUpdate: () => {
          setDeskItems(prev => prev.map(itm => 
            itm.id === item.id ? { ...itm, glow: glowObj.v } : itm
          ))
        }
      }, spawnTime + ANIMATION_TIMING.ACT1_ITEM_DURATION * 0.6)
    })

    // After all items spawned - chime sound
    const allItemsCompleteTime = t + 1 + items1.length * ANIMATION_TIMING.ACT1_ITEM_STAGGER + ANIMATION_TIMING.ACT1_ITEM_DURATION
    tl.add(() => {
      setAnalCaption('Semua aplikasi sudah buka!')
      sfxLoader.ui(SFX_MAP.CHIME.name, { volume, speed })
    }, allItemsCompleteTime)

    // DESK VIBRATE SEQUENCE (building tension)
    const vibrateStart = t + ANIMATION_TIMING.ACT1_DESK_VIBRATE_START
    const vibrateObj = { intensity: 0 }
    
    // Track vibration sound thresholds to prevent duplicate plays
    const vibrateSoundPlayed = { at1: false, at2: false, at3: false }
    
    // Gradual vibration increase
    tl.to(vibrateObj, {
      intensity: 3,
      duration: 2.0,
      ease: 'power2.in',
      onUpdate: () => {
        setDeskVibrate(vibrateObj.intensity)
        
        // Play pulse sounds when intensity crosses thresholds
        if (vibrateObj.intensity >= 1.0 && !vibrateSoundPlayed.at1) {
          sfxLoader.warning(SFX_MAP.ALERT_PULSE.name, { volume: volume * 0.5, speed })
          vibrateSoundPlayed.at1 = true
        }
        if (vibrateObj.intensity >= 2.0 && !vibrateSoundPlayed.at2) {
          sfxLoader.warning(SFX_MAP.ALERT_PULSE.name, { volume: volume * 0.6, speed })
          vibrateSoundPlayed.at2 = true
        }
        if (vibrateObj.intensity >= 2.9 && !vibrateSoundPlayed.at3) {
          sfxLoader.warning(SFX_MAP.ALERT_PULSE.name, { volume: volume * 0.7, speed })
          vibrateSoundPlayed.at3 = true
        }
      }
    }, vibrateStart)

    // DRAMATIC "MEJA PENUH!" MOMENT
    const fullTime = t + ANIMATION_TIMING.ACT1_DESK_FULL_TIME
    tl.add(() => {
      setDeskFull(true)
      setAnalCaption('MEJA PENUH! Tidak bisa buka lebih banyak!')
      
      // Massive vibration spike
      setDeskVibrate(10)
      
      // Danger/emergency layered impact sounds
      sfxLoader.playMultiple([
        { category: 'warnings', name: 'critical-alert', options: { volume: volume * 0.9, speed } },
        { category: 'impacts', name: 'impact', options: { volume: volume * 0.8, speed, delay: 0.05 } },
        { category: 'warnings', name: 'error-beep', options: { volume: volume * 0.7, speed, delay: 0.15 } }
      ])
    }, fullTime)

    // All items bounce simultaneously on impact
    tl.add(() => {
      setDeskItems(prev => prev.map(itm => ({ ...itm, scale: 1.15 })))
    }, fullTime + 0.05)
    tl.add(() => {
      setDeskItems(prev => prev.map(itm => ({ ...itm, scale: 1.0 })))
    }, fullTime + 0.2)

    // Decay vibration
    tl.to(vibrateObj, {
      intensity: 0,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => setDeskVibrate(vibrateObj.intensity)
    }, fullTime + 0.3)

    t += PHASES[0].duration

    // ════ ACT 2: PAGING (ENHANCED - PLAYFUL) ════
    const ramPctObj = { v: 0 }
    tl.add(() => {
      setPhaseIdx(1)
      // sfxLoader.sfx(SFX_MAP.WHOOSH.name, { volume, speed })
      setRamSlots(RAM_SLOTS.map(s => ({ ...s, proc: null, pageLabel: '', opacity: 0, scale: 0, offsetY: 20 })))
      ramPctObj.v = 0
      setRamPct(0)
      setArrowAnim({ x: 0, opacity: 0, label: '' })
    }, t)

    // Explanation text sequence
    tl.add(() => setAnalCaption('Kernel memotong data menjadi "Halaman" 4 KB...'), t + 0.5)

    // ════ NEW: Box Appearance Animations ════
    
    // APLIKASI Container appears (t+1.0s)
    tl.add(() => {
      setAppBoxOpacity(0)
      setAppBoxScale(0)
      setAppBorderDash(1000)
    }, t + 1.0)

    const appBoxAnim = { opacity: 0, scale: 0, borderDash: 1000 }
    tl.to(appBoxAnim, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'back.out(1.4)',
      onStart: () => {
        sfxLoader.transition(SFX_MAP.SWOOSH.name, { volume: volume * 0.5, speed: speed * 1.1 })
      },
      onUpdate: () => {
        setAppBoxOpacity(appBoxAnim.opacity)
        setAppBoxScale(appBoxAnim.scale)
      }
    }, t + 1.0)

    // Border "ular" animation for APLIKASI box (parallel with appearance)
    tl.to(appBoxAnim, {
      borderDash: 0,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => {
        setAppBorderDash(appBoxAnim.borderDash)
      }
    }, t + 1.0)

    // Process boxes appear (staggered: Browser → Game → IDE)
    PROCESSES.forEach((proc, i) => {
      const procAppearTime = t + 1.2 + i * 0.2
      
      tl.add(() => {
        setProcessBoxes(prev => {
          const updated = [...prev]
          updated[i] = { ...updated[i], opacity: 0, scale: 0 }
          return updated
        })
      }, procAppearTime)
      
      const procBoxAnim = { opacity: 0, scale: 0 }
      tl.to(procBoxAnim, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: 'back.out(1.4)',
        onStart: () => {
          sfxLoader.ui(SFX_MAP.POP.name, { volume: volume * 0.6, speed: speed * 1.2 })
        },
        onUpdate: () => {
          setProcessBoxes(prev => {
            const updated = [...prev]
            updated[i] = { opacity: procBoxAnim.opacity, scale: procBoxAnim.scale }
            return updated
          })
        }
      }, procAppearTime)
    })

    // PHYSICAL RAM Container appears (t+1.5s, parallel with RAM slots)
    tl.add(() => {
      setRamBoxOpacity(0)
      setRamBoxScale(0)
      setRamBorderDash(1200)
    }, t + 1.5)

    const ramBoxAnim = { opacity: 0, scale: 0, borderDash: 1200 }
    tl.to(ramBoxAnim, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'back.out(1.4)',
      onStart: () => {
        sfxLoader.transition(SFX_MAP.SWOOSH.name, { volume: volume * 0.5, speed: speed * 1.1 })
      },
      onUpdate: () => {
        setRamBoxOpacity(ramBoxAnim.opacity)
        setRamBoxScale(ramBoxAnim.scale)
      }
    }, t + 1.5)

    // Border "ular" animation for RAM box (parallel)
    tl.to(ramBoxAnim, {
      borderDash: 0,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => {
        setRamBorderDash(ramBoxAnim.borderDash)
      }
    }, t + 1.5)

    // RAM SLOTS APPEAR (staggered slide-in)
    RAM_SLOTS.forEach((slot, i) => {
      const appearTime = t + 1.5 + i * ANIMATION_TIMING.ACT2_SLOT_STAGGER
      
      // Animate slot appearance
      tl.add(() => {
        setRamSlots(prev => {
          const updated = [...prev]
          updated[i] = { ...updated[i], opacity: 0, scale: 0, offsetY: 20 }
          return updated
        })
      }, appearTime)

      const slotAnimObj = { opacity: 0, scale: 0, offsetY: 20 }
      tl.to(slotAnimObj, {
        opacity: 1,
        scale: 1,
        offsetY: 0,
        duration: ANIMATION_TIMING.ACT2_SLOT_DURATION,
        ease: 'back.out(1.4)',
        onStart: () => {
          // SFX: slide-in sound saat slot mulai muncul (dijamin sekali per slot)
          sfxLoader.transition(SFX_MAP.SLIDE_IN.name, { volume: volume * 0.75, speed: speed * 1.1 })
        },
        onUpdate: () => {
          setRamSlots(prev => {
            const updated = [...prev]
            updated[i] = { 
              ...updated[i], 
              opacity: slotAnimObj.opacity,
              scale: slotAnimObj.scale,
              offsetY: slotAnimObj.offsetY
            }
            return updated
          })
        }
      }, appearTime)
    })

    tl.add(() => { 
      setAnalCaption('Browser minta 3 halaman RAM...'); 
      sfxLoader.sfx(SFX_MAP.TYPING.name, { volume: volume * 0.6, speed })
    }, t + 2.5)

    // PAGE ALLOCATION SEQUENCE (with enhanced animations)
    const allMaps = [
      { slot: 0, label: 'Browser P0', color: '#38BDF8', proc: 'Browser', targetPct: 17,  at: t + 3.0 },
      { slot: 1, label: 'Browser P1', color: '#38BDF8', proc: 'Browser', targetPct: 33,  at: t + 4.0 },
      { slot: 2, label: 'Browser P2', color: '#38BDF8', proc: 'Browser', targetPct: 50,  at: t + 5.0 },
      { slot: 3, label: 'Game P0',    color: '#A78BFA', proc: 'Game',    targetPct: 67,  at: t + 6.0 },
      { slot: 4, label: 'Game P1',    color: '#A78BFA', proc: 'Game',    targetPct: 83,  at: t + 7.0 },
    ]

    allMaps.forEach((m, idx) => {
      // Arrow appears with glow
      const arrowObj = { progX: 0 }
      tl.add(() => {
        setArrowAnim({ opacity: 1, label: m.label, color: m.color, progX: 0 })
      }, m.at)
      
      // Arrow moves to target
      tl.to(arrowObj, {
        progX: 1, 
        duration: ANIMATION_TIMING.ACT2_ARROW_MOVE_DURATION, 
        ease: 'power2.inOut',
        onStart: () => {
          // Whoosh sound saat arrow start (lebih dynamic dari scan)
          sfxLoader.transition(SFX_MAP.SWOOSH.name, { volume: volume * 0.5, speed: speed * 1.2 })
        },
        onUpdate: () => setArrowAnim(prev => ({ ...prev, progX: arrowObj.progX }))
      }, m.at + 0.1)

      // RAM bar fills (segment-based)
      tl.to(ramPctObj, {
        v: m.targetPct, 
        duration: 0.35, 
        ease: 'power2.out',
        onUpdate: () => setRamPct(Math.round(ramPctObj.v))
      }, m.at + 0.5)

      // Page lands in slot with BOUNCE
      tl.add(() => {
        setRamSlots(prev => {
          const n = [...prev]
          n[m.slot] = { 
            ...n[m.slot], 
            proc: m.proc, 
            pageLabel: m.label, 
            color: m.color, 
            opacity: 1,
            scale: 1.15  // Bounce overshoot
          }
          return n
        })
        setArrowAnim(prev => ({ ...prev, opacity: 0 }))
        
        // Multiple layered SFX for impact
        sfxLoader.playMultiple([
          { category: SFX_MAP.PLINK.category, name: SFX_MAP.PLINK.name, options: { volume, speed } },
          { category: SFX_MAP.CHIME.category, name: SFX_MAP.CHIME.name, options: { volume: volume * 0.8, speed, delay: 0.08 } }
        ])
      }, m.at + 0.55)

      // Bounce back to normal scale
      tl.add(() => {
        setRamSlots(prev => {
          const n = [...prev]
          n[m.slot] = { ...n[m.slot], scale: 1.0 }
          return n
        })
        // Settle sound saat bounce selesai
        // if (m.targetPct >= 50) {
        //   sfxLoader.ui(SFX_MAP.BEEP.name, { volume: volume * 0.5, speed })
        // }
      }, m.at + 0.7)
    })

    // Milestone caption: 50%
    tl.add(() => {
      setAnalCaption('RAM 50% TERPAKAI - masih aman!')
      sfxLoader.success(SFX_MAP.CONFIRM.name, { volume: volume * 0.7, speed })
    }, t + 5.5)

    // Warning threshold: 83%
    tl.add(() => {
      setAnalCaption('RAM 83% TERPAKAI - BERBAHAYA! Hati-hati...')
      // Layered warning sounds
      sfxLoader.playMultiple([
        { category: 'warnings', name: 'alert-pulse', options: { volume: volume * 0.6, speed } },
        { category: 'warnings', name: 'error-beep', options: { volume: volume * 0.5, speed, delay: 0.2 } }
      ])
    }, t + 7.5)

    // Charge sound (continuous building tension)
    tl.add(() => {
      sfxLoader.success(SFX_MAP.CHARGE.name, { volume: volume * 0.4, speed })
    }, t + 3.0)
    tl.add(() => {
      sfxLoader.success(SFX_MAP.CHARGE.name, { volume: volume * 0.5, speed })
    }, t + 5.0)

    t += PHASES[1].duration

    // ════ ACT 3: SWAP OUT (ENHANCED - HIGH DRAMA) ════
    const ramObj3  = { v: 100 }
    const swapObj3 = { v: 0 }
    const shakeObj = { intensity: 0 }
    
    // SHOCK MOMENT - RAM 100% PENUH
    tl.add(() => {
      setPhaseIdx(2)
      setSwapAlert(false)
      setSwapSlots([])
      setMovingPage(null)
      setAct3Ram(100)
      setAct3Swap(0)
      setAnalCaption('RAM 100% PENUH! Browser minta halaman baru...')
      
      // Massive screen shake
      setDeskVibrate(10)
      
      // Multiple layered critical SFX
      sfxLoader.playMultiple([
        { category: SFX_MAP.CRITICAL_ALERT.category, name: SFX_MAP.CRITICAL_ALERT.name, options: { volume, speed } },
        { category: SFX_MAP.ERROR.category, name: SFX_MAP.ERROR.name, options: { volume: volume * 0.8, speed, delay: 0.1 } }
      ])
    }, t)

    // Quick shake decay
    tl.add(() => setDeskVibrate(0), t + 0.3)

    // PANIC SEQUENCE - RAM slots pulse
    tl.add(() => { 
      setSwapAlert(true)
      sfxLoader.warning(SFX_MAP.ALERT_PULSE.name, { volume, speed })
    }, t + 1.5)
    
    // Error hum ambient (continuous panic)
    tl.add(() => {
      sfxLoader.warning(SFX_MAP.ERROR_HUM.name, { volume: volume * 0.4, speed })
    }, t + 1.8)

    tl.add(() => {
      setAnalCaption('Kernel mencari halaman yang PALING LAMA tidak dipakai...')
    }, t + 2.0)

    // Scan candidates (rapid-fire)
    tl.add(() => sfxLoader.sfx(SFX_MAP.SCAN.name, { volume: volume * 0.6, speed: speed * 1.2 }), t + 2.2)
    tl.add(() => sfxLoader.sfx(SFX_MAP.SCAN.name, { volume: volume * 0.7, speed: speed * 1.3 }), t + 2.5)
    tl.add(() => sfxLoader.sfx(SFX_MAP.SCAN.name, { volume: volume * 0.8, speed: speed * 1.4 }), t + 2.8)

    // VICTIM SELECTED
    tl.add(() => {
      setAnalCaption('Game P0 dipilih untuk di-evict!')
      sfxLoader.playMultiple([
        { category: SFX_MAP.ALERT_PULSE.category, name: SFX_MAP.ALERT_PULSE.name, options: { volume: volume * 0.8, speed } },
        { category: SFX_MAP.ERROR_BEEP.category, name: SFX_MAP.ERROR_BEEP.name, options: { volume, speed, delay: 0.15 } }
      ])
    }, t + 3.2)

    // PAGE MOVEMENT WITH GLITCH EFFECT
    const mpObj = { x: 0, glitch: 0 }
    const glitchSoundPlayed = { at33: false, at66: false }
    
    tl.add(() => {
      setMovingPage({ label: 'Game P0', color: '#A78BFA', x: 0, y: 0, glitch: 0 })
      setAnalCaption('Memindahkan Game P0 ke Swap Disk... (lambat!)')
    }, t + 3.8)

    // Animate page with glitch intensity
    tl.to(mpObj, {
      x: 1,
      duration: ANIMATION_TIMING.ACT3_PAGE_MOVE_DURATION,
      ease: 'power2.inOut',
      onStart: () => {
        // Glitch + materialize sounds saat movement start
        sfxLoader.transition(SFX_MAP.GLITCH.name, { volume, speed })
        // Disk spin saat page mulai bergerak (disk sedang write)
        sfxLoader.impact(SFX_MAP.DISK_SPIN.name, { volume: volume * 0.5, speed })
      },
      onUpdate: () => {
        const glitchIntensity = Math.sin(mpObj.x * Math.PI * 8) * 0.5 + 0.5
        setMovingPage(prev => prev ? { 
          ...prev, 
          x: mpObj.x,
          glitch: glitchIntensity
        } : null)
        
        // Additional glitch sounds at progress milestones
        if (mpObj.x >= 0.33 && mpObj.x <= 0.35 && !glitchSoundPlayed.at33) {
          sfxLoader.transition(SFX_MAP.GLITCH.name, { volume: volume * 0.8, speed: speed * 1.1 })
          glitchSoundPlayed.at33 = true
        }
        if (mpObj.x >= 0.66 && mpObj.x <= 0.68 && !glitchSoundPlayed.at66) {
          sfxLoader.transition(SFX_MAP.GLITCH.name, { volume: volume * 0.7, speed: speed * 0.9 })
          sfxLoader.sfx(SFX_MAP.MATERIALIZE.name, { volume: volume * 0.7, speed, delay: 0.1 })
          glitchSoundPlayed.at66 = true
        }
      }
    }, t + 4.0)

    // Swap sound as page enters swap area
    tl.add(() => {
      sfxLoader.impact(SFX_MAP.SWAP.name, { volume, speed })
    }, t + 5.2)

    // PAGE LANDS IN SWAP
    tl.add(() => {
      setMovingPage(null)
      setRamSlots(prev => {
        const n = [...prev]
        n[3] = { ...RAM_SLOTS[3], proc: null, pageLabel: '', opacity: 1, scale: 1 }
        return n
      })
      setSwapSlots([{ label: 'Game P0', color: '#A78BFA' }])
      
      // Landing impact SFX
      sfxLoader.playMultiple([
        { category: SFX_MAP.TELEPORT.category, name: SFX_MAP.TELEPORT.name, options: { volume, speed } },
        { category: SFX_MAP.IMPACT.category, name: SFX_MAP.IMPACT.name, options: { volume: volume * 0.7, speed, delay: 0.1 } },
        { category: SFX_MAP.PLINK.category, name: SFX_MAP.PLINK.name, options: { volume: volume * 0.6, speed, delay: 0.2 } }
      ])
    }, t + 5.5)

    // RAM/SWAP BARS UPDATE
    tl.to(ramObj3, {
      v: 83, duration: 0.6, ease: 'power2.out',
      onUpdate: () => setAct3Ram(Math.round(ramObj3.v))
    }, t + 5.5)
    tl.to(swapObj3, {
      v: 33, duration: 0.6, ease: 'power2.out',
      onUpdate: () => setAct3Swap(Math.round(swapObj3.v))
    }, t + 5.5)

    // Charge sound for bar animations
    tl.add(() => {
      sfxLoader.success(SFX_MAP.CHARGE.name, { volume: volume * 0.5, speed })
    }, t + 5.5)

    // SLOT FREED MOMENT
    tl.add(() => {
      setAnalCaption('Slot RAM bebas! Browser dapat halaman baru.')
      sfxLoader.impact(SFX_MAP.UNLOCK.name, { volume: volume * 0.8, speed })
    }, t + 6.2)

    // BROWSER ALLOCATES NEW PAGE
    const arrowObjAct3 = { progX: 0 }
    tl.add(() => {
      setArrowAnim({ opacity: 1, label: 'Browser P3', color: '#38BDF8', progX: 0 })
    }, t + 6.8)
    
    tl.to(arrowObjAct3, {
      progX: 1, duration: 0.5, ease: 'power2.inOut',
      onStart: () => {
        // Swoosh sound saat arrow mulai bergerak
        sfxLoader.transition(SFX_MAP.SWOOSH.name, { volume: volume * 0.5, speed: speed * 1.2 })
      },
      onUpdate: () => setArrowAnim(prev => ({ ...prev, progX: arrowObjAct3.progX }))
    }, t + 6.9)
    
    tl.add(() => {
      setRamSlots(prev => {
        const n = [...prev]
        n[3] = { ...n[3], proc: 'Browser', pageLabel: 'Browser P3', color: '#38BDF8', opacity: 1, scale: 1.15 }
        return n
      })
      ramObj3.v = 83
      setAct3Ram(83)
      setArrowAnim(prev => ({ ...prev, opacity: 0 }))
      
      // Success with slight concern
      sfxLoader.playMultiple([
        { category: SFX_MAP.LOCK.category, name: SFX_MAP.LOCK.name, options: { volume, speed } },
        { category: SFX_MAP.CHIME.category, name: SFX_MAP.CHIME.name, options: { volume: volume * 0.7, speed, delay: 0.1 } }
      ])
    }, t + 7.4)

    // Bounce back to normal
    tl.add(() => {
      setRamSlots(prev => {
        const n = [...prev]
        n[3] = { ...n[3], scale: 1.0 }
        return n
      })
    }, t + 7.6)

    // Confirm sound - settling moment
    tl.add(() => {
      setAnalCaption('Kernel senang dengan solution itu...')
      sfxLoader.success(SFX_MAP.CONFIRM.name, { volume: volume * 0.6, speed })
    }, t + 8.5)

    // ════ SWAP SEQUENCE 2: Game P1 → 50% ════
    tl.add(() => {
      setAct3Ram(83)
      setAnalCaption('Tunggu... RAM penuh lagi! Browser butuh halaman baru...')
      sfxLoader.playMultiple([
        { category: SFX_MAP.CRITICAL_ALERT.category, name: SFX_MAP.CRITICAL_ALERT.name, options: { volume, speed } },
        { category: SFX_MAP.ERROR.category, name: SFX_MAP.ERROR.name, options: { volume: volume * 0.7, speed, delay: 0.2 } }
      ])
    }, t + 9.5)

    tl.add(() => {
      setAnalCaption('Kernel mencari victim lagi... Game P1 dipilih!')
      sfxLoader.playMultiple([
        { category: SFX_MAP.ALERT_PULSE.category, name: SFX_MAP.ALERT_PULSE.name, options: { volume: volume * 0.8, speed } },
        { category: SFX_MAP.ERROR_BEEP.category, name: SFX_MAP.ERROR_BEEP.name, options: { volume, speed, delay: 0.15 } }
      ])
    }, t + 10.5)

    // Game P1 movement
    const mpObj2 = { x: 0 }
    tl.add(() => {
      setMovingPage({ label: 'Game P1', color: '#A78BFA', x: 0, y: -60, glitch: 0 })
      setAnalCaption('Memindahkan Game P1 ke Swap Disk...')
    }, t + 11.2)

    tl.to(mpObj2, {
      x: 1,
      duration: ANIMATION_TIMING.ACT3_PAGE_MOVE_DURATION,
      ease: 'power2.inOut',
      onStart: () => {
        sfxLoader.transition(SFX_MAP.GLITCH.name, { volume, speed })
        sfxLoader.impact(SFX_MAP.DISK_SPIN.name, { volume: volume * 0.5, speed })
      },
      onUpdate: () => {
        const glitchIntensity = Math.sin(mpObj2.x * Math.PI * 8) * 0.5 + 0.5
        setMovingPage(prev => prev ? { ...prev, x: mpObj2.x, glitch: glitchIntensity } : null)
      }
    }, t + 11.4)

    tl.add(() => {
      sfxLoader.impact(SFX_MAP.SWAP.name, { volume, speed })
    }, t + 12.6)

    tl.add(() => {
      setMovingPage(null)
      setRamSlots(prev => {
        const n = [...prev]
        n[4] = { ...RAM_SLOTS[4], proc: null, pageLabel: '', opacity: 1, scale: 1 }
        return n
      })
      setSwapSlots(prev => [...prev, { label: 'Game P1', color: '#A78BFA' }])
      
      sfxLoader.playMultiple([
        { category: SFX_MAP.TELEPORT.category, name: SFX_MAP.TELEPORT.name, options: { volume, speed } },
        { category: SFX_MAP.IMPACT.category, name: SFX_MAP.IMPACT.name, options: { volume: volume * 0.7, speed, delay: 0.1 } },
        { category: SFX_MAP.PLINK.category, name: SFX_MAP.PLINK.name, options: { volume: volume * 0.6, speed, delay: 0.2 } }
      ])
    }, t + 12.9)

    tl.to(ramObj3, {
      v: 67, duration: 0.6, ease: 'power2.out',
      onUpdate: () => setAct3Ram(Math.round(ramObj3.v))
    }, t + 12.9)
    tl.to(swapObj3, {
      v: 50, duration: 0.6, ease: 'power2.out',
      onUpdate: () => setAct3Swap(Math.round(swapObj3.v))
    }, t + 12.9)

    tl.add(() => {
      sfxLoader.success(SFX_MAP.CHARGE.name, { volume: volume * 0.5, speed })
    }, t + 12.9)

    // ════ SWAP SEQUENCE 3: IDE P0 → 80% ════
    tl.add(() => {
      setAnalCaption('Masih penuh! IDE P0 ikut di-swap...')
      sfxLoader.playMultiple([
        { category: SFX_MAP.ALERT_PULSE.category, name: SFX_MAP.ALERT_PULSE.name, options: { volume: volume * 0.8, speed } },
        { category: SFX_MAP.ERROR_BEEP.category, name: SFX_MAP.ERROR_BEEP.name, options: { volume, speed, delay: 0.15 } }
      ])
    }, t + 14.0)

    // IDE P0 movement
    const mpObj3 = { x: 0 }
    tl.add(() => {
      setMovingPage({ label: 'IDE P0', color: '#FBBF24', x: 0, y: -120, glitch: 0 })
      setAnalCaption('Memindahkan IDE P0 ke Swap Disk...')
    }, t + 14.5)

    tl.to(mpObj3, {
      x: 1,
      duration: ANIMATION_TIMING.ACT3_PAGE_MOVE_DURATION,
      ease: 'power2.inOut',
      onStart: () => {
        sfxLoader.transition(SFX_MAP.GLITCH.name, { volume, speed })
        sfxLoader.impact(SFX_MAP.DISK_SPIN.name, { volume: volume * 0.5, speed })
      },
      onUpdate: () => {
        const glitchIntensity = Math.sin(mpObj3.x * Math.PI * 8) * 0.5 + 0.5
        setMovingPage(prev => prev ? { ...prev, x: mpObj3.x, glitch: glitchIntensity } : null)
      }
    }, t + 14.7)

    tl.add(() => {
      sfxLoader.impact(SFX_MAP.SWAP.name, { volume, speed })
    }, t + 15.9)

    tl.add(() => {
      setMovingPage(null)
      setRamSlots(prev => {
        const n = [...prev]
        n[5] = { ...RAM_SLOTS[5], proc: null, pageLabel: '', opacity: 1, scale: 1 }
        return n
      })
      setSwapSlots(prev => [...prev, { label: 'IDE P0', color: '#FBBF24' }])
      
      sfxLoader.playMultiple([
        { category: SFX_MAP.TELEPORT.category, name: SFX_MAP.TELEPORT.name, options: { volume, speed } },
        { category: SFX_MAP.IMPACT.category, name: SFX_MAP.IMPACT.name, options: { volume: volume * 0.7, speed, delay: 0.1 } },
        { category: SFX_MAP.PLINK.category, name: SFX_MAP.PLINK.name, options: { volume: volume * 0.6, speed, delay: 0.2 } }
      ])
    }, t + 16.2)

    tl.to(ramObj3, {
      v: 50, duration: 0.6, ease: 'power2.out',
      onUpdate: () => setAct3Ram(Math.round(ramObj3.v))
    }, t + 16.2)
    tl.to(swapObj3, {
      v: 80, duration: 0.6, ease: 'power2.out',
      onUpdate: () => setAct3Swap(Math.round(swapObj3.v))
    }, t + 16.2)

    tl.add(() => {
      sfxLoader.success(SFX_MAP.CHARGE.name, { volume: volume * 0.5, speed })
      setAnalCaption('3 halaman di-swap! Komputer jadi lambat...')
    }, t + 16.2)

    tl.add(() => {
      sfxLoader.success(SFX_MAP.CONFIRM.name, { volume: volume * 0.6, speed })
    }, t + 17.5)

    t += PHASES[2].duration

    // ════ ACT 4: SWAP IN + LATENCY (ENHANCED - EDUCATIONAL) ════
    const latObj = LATENCY.map(() => ({ v: 0 }))
    
    // RECAP & SETUP
    tl.add(() => {
      setPhaseIdx(3)
      sfxLoader.sfx(SFX_MAP.WHOOSH.name, { volume, speed })
      setPageFaultMsg(false)
      setSwapInAnim(false)
      setLatencyAnim(LATENCY.map(() => 0))
      setAnalCaption('Kamu klik Game lagi... data ada di Swap Disk!')
    }, t)

    // PAGE FAULT EVENT (DRAMATIC)
    tl.add(() => { 
      setPageFaultMsg(true)
      setAnalCaption('PAGE FAULT! Kernel harus ambil data dari Gudang...')
      
      // Dramatic page fault SFX
      sfxLoader.playMultiple([
        { category: SFX_MAP.PAGE_FAULT.category, name: SFX_MAP.PAGE_FAULT.name, options: { volume, speed } },
        { category: SFX_MAP.ERROR.category, name: SFX_MAP.ERROR.name, options: { volume: volume * 0.7, speed, delay: 0.15 } }
      ])
    }, t + 2.0)

    // SWAP-IN JOURNEY BEGINS
    tl.add(() => { 
      setSwapInAnim(true)
      setAnalCaption('Swap In: Game P0 ditarik balik ke RAM (butuh waktu!)')
      
      // Journey start SFX
      sfxLoader.playMultiple([
        { category: SFX_MAP.SWAP.category, name: SFX_MAP.SWAP.name, options: { volume, speed } },
        { category: SFX_MAP.MATERIALIZE.category, name: SFX_MAP.MATERIALIZE.name, options: { volume: volume * 0.7, speed, delay: 0.2 } }
      ])
    }, t + 3.5)

    // LATENCY BARS FILL (staggered with milestones)
    LATENCY.forEach((lat, i) => {
      const appearTime = t + 5.0 + i * ANIMATION_TIMING.ACT4_LATENCY_STAGGER
      const fillTime = appearTime + 0.3  // Fill starts after appearance
      const latencyTickPlayed = { at33: false, at66: false, at95: false }
      
      // Bar appearance animation (NEW)
      tl.add(() => {
        setLatencyBarsVisible(prev => {
          const updated = [...prev]
          updated[i] = { opacity: 0, scale: 0 }
          return updated
        })
      }, appearTime)
      
      const barAppearAnim = { opacity: 0, scale: 0 }
      tl.to(barAppearAnim, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: 'back.out(1.4)',
        onStart: () => {
          sfxLoader.ui(SFX_MAP.POP.name, { volume: volume * 0.5, speed: speed * 1.2 })
        },
        onUpdate: () => {
          setLatencyBarsVisible(prev => {
            const updated = [...prev]
            updated[i] = { opacity: barAppearAnim.opacity, scale: barAppearAnim.scale }
            return updated
          })
        }
      }, appearTime)
      
      // Bar fill animation
      tl.to(latObj[i], {
        v: lat.bar, 
        duration: ANIMATION_TIMING.ACT4_LATENCY_BAR_DURATION, 
        ease: 'power2.out',
        onStart: () => {
          // Play appropriate sound untuk setiap tier
          if (i === 0) {
            // CPU Cache - instant, fast zing
            sfxLoader.success(SFX_MAP.CONFIRM.name, { volume: volume * 0.8, speed: speed * 1.5 })
          } else if (i === 1) {
            // RAM - fast chime
            sfxLoader.ui(SFX_MAP.CHIME.name, { volume: volume * 0.7, speed: speed * 1.1 })
          } else if (i === 2) {
            // SSD - disk spin (fast) + confirm
            sfxLoader.impact(SFX_MAP.DISK_SPIN.name, { volume: volume * 0.4, speed: speed * 1.2 })
          } else if (i === 3) {
            // HDD - slow disk spin
            sfxLoader.impact(SFX_MAP.DISK_SPIN.name, { volume: volume * 0.6, speed: speed * 0.8 })
          }
        },
        onUpdate: () => {
          setLatencyAnim(prev => {
            const n = [...prev]; n[i] = latObj[i].v; return n
          })
          
          // HDD: Play latency tick sounds at progress milestones
          if (i === 3) {
            const progress = latObj[i].v / lat.bar
            if (progress >= 0.33 && progress <= 0.35 && !latencyTickPlayed.at33) {
              sfxLoader.warning(SFX_MAP.LATENCY_TICK.name, { volume: volume * 0.4, speed: speed * 0.9 })
              latencyTickPlayed.at33 = true
            }
            if (progress >= 0.66 && progress <= 0.68 && !latencyTickPlayed.at66) {
              sfxLoader.warning(SFX_MAP.LATENCY_TICK.name, { volume: volume * 0.4, speed: speed * 0.85 })
              latencyTickPlayed.at66 = true
            }
            if (progress >= 0.95 && !latencyTickPlayed.at95) {
              sfxLoader.warning(SFX_MAP.LATENCY_TICK.name, { volume: volume * 0.4, speed: speed * 0.8 })
              latencyTickPlayed.at95 = true
            }
          }
        },
        onComplete: () => {
          // SSD complete sound
          if (i === 2) {
            sfxLoader.success(SFX_MAP.SWAP_IN_COMPLETE.name, { volume: volume * 0.6, speed })
          }
        }
      }, fillTime)
    })

    // GAME P0 LANDS IN RAM (celebration)
    tl.add(() => {
      setAnalCaption('Game P0 kembali ke RAM! Tapi lama banget...')
      sfxLoader.playMultiple([
        { category: SFX_MAP.VICTORY.category, name: SFX_MAP.VICTORY.name, options: { volume: volume * 0.7, speed } },
        { category: SFX_MAP.CHIME.category, name: SFX_MAP.CHIME.name, options: { volume: volume * 0.6, speed, delay: 0.15 } }
      ])
    }, t + 6.5)

    // KEY INSIGHT
    tl.add(() => {
      setAnalCaption('Itulah kenapa SSD jauh lebih baik dari HDD!')
      sfxLoader.warning(SFX_MAP.ALERT_PULSE.name, { volume: volume * 0.5, speed })
    }, t + 7.5)

    // FINAL TIP
    tl.add(() => {
      setAnalCaption('Tip: Gunakan SSD bukan HDD untuk Swap, 100x lebih cepat!')
      sfxLoader.success(SFX_MAP.COMPLETE.name, { volume: volume * 0.6, speed })
    }, t + 8.5)

    t += PHASES[3].duration

    return () => {
      tl.kill()
      if (window.__animationTimeline === tl) delete window.__animationTimeline
    }
  }, [])

  useEffect(() => {
    if (!tlRef.current) return
    tlRef.current.timeScale(speed)
    if (paused) tlRef.current.pause(); else tlRef.current.resume()
  }, [speed, paused])

  // ─── Computed layout constants ────────────────────────────────
  // ACT2/3 RAM bar: 732px wide total, bar max 660px
  const RAM_BAR_W   = 660
  const SWAP_BAR_W  = 660

  // For ACT2 arrow: from left panel (x≈44+300=344) to right RAM panel (x≈44+330)
  const ARROW_SX = 344
  const ARROW_EX = 524
  const ARROW_Y  = 580

  return (
    <svg ref={svgRef} viewBox={`0 0 ${VW} ${VH}`}
      style={{ width: '100%', height: '100%', maxHeight: '100vh',
        maxWidth: `calc(100vh * ${VW} / ${VH})`, background: '#070913', userSelect: 'none' }}>

      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b1"/>
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="b2"/>
          <feMerge><feMergeNode in="b2"/><feMergeNode in="b1"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="shadow">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5"/>
        </filter>
        <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2CD1A8" />
          <stop offset="100%" stopColor="#38BCF8" />
        </linearGradient>
        <linearGradient id="ramGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#34D399"/>
          <stop offset="70%" stopColor="#38BDF8"/>
          <stop offset="100%" stopColor="#F43F5E"/>
        </linearGradient>
        <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 Z" fill="currentColor"/>
        </marker>
      </defs>

      {/* Background grid */}
      <g opacity={0.05}>
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i*40} y1={0} x2={i*40} y2={VH} stroke="#F472B6" strokeWidth={1}/>)}
        {Array.from({ length: 34 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i*40} x2={VW} y2={i*40} stroke="#F472B6" strokeWidth={1}/>)}
      </g>

      {/* ── HEADER ── */}
      {(() => {
        const p = morphProgress => morphProgress
        const mp = morphP
        const taglineX = lerp(44, VW/2, mp)  // Slide from left to center during morph
        const tyY  = lerp(580, 30, mp)
        const tyFs = lerp(22, 16, mp)
        const txX  = 44  // Fixed left, no horizontal movement
        const txY  = lerp(660, 80, mp)
        const txFs = lerp(80, 50, mp)
        const subX = 44  // Fixed left, no horizontal movement
        const subY = lerp(740, 115, mp)
        const subFs = lerp(26, 18, mp)
        return (
          <g>
            <text 
              x={taglineX} 
              y={tyY} 
              textAnchor={mp < 0.5 ? "start" : "middle"}
              fill="#64748B" 
              fontSize={tyFs} 
              fontFamily="monospace" 
              letterSpacing={3}
            >
              LINUX CORE · <tspan fill="#2CD1A8" fontWeight={700}>ADIB-DEV.COM</tspan>
            </text>
            <text x={txX} y={txY} textAnchor="start" fill="url(#headerGrad)"
              fontSize={txFs} fontFamily="'Arial Black', Impact, sans-serif" fontWeight={900} letterSpacing={1}>
              RAM & SWAP
            </text>
            <text x={subX} y={subY} textAnchor="start" fill="#94A3B8" fontSize={subFs} fontFamily="sans-serif" fontWeight={500}>
              Kenapa Komputer Lambat Saat RAM <tspan fill="#2CD1A8" fontFamily="monospace" fontWeight={700}>Penuh</tspan> — <tspan fill="#38BCF8" fontFamily="monospace" fontWeight={700}>Swap Disk</tspan> Jelasin
            </text>
          </g>
        )
      })()}

      {/* ── PHASE BADGE ── */}
      {!showIntro && (
        <g transform="translate(44, 165)">
          <rect width={400} height={40} rx={20} fill="#0F172A" stroke={phase.badgeColor} strokeWidth={1.8} filter="url(#shadow)"/>
          <circle cx={22} cy={20} r={6} fill={phase.badgeColor} filter="url(#glow)"/>
          <text x={40} y={26} fill={phase.badgeColor} fontSize={15} fontFamily="monospace" fontWeight={700} letterSpacing={1}>
            {phase.badge}
          </text>
          <g transform="translate(640, 12)">
            {PHASES.map((ph, i) => (
              <circle key={ph.id} cx={i * 24} cy={8}
                r={i === phaseIdx ? 7 : 4}
                fill={i === phaseIdx ? phase.badgeColor : '#334155'}
                stroke={i === phaseIdx ? '#fff' : 'none'} strokeWidth={1.5}/>
            ))}
          </g>
        </g>
      )}

      {/* ══════════════════════════════════════════
           ACT 1 — ANALOGY: Meja Kerja vs Gudang (ENHANCED)
           ══════════════════════════════════════════ */}
      {!showIntro && phaseIdx === 0 && (
        <g transform="translate(44, 230)">

          {/* Caption Narasi */}
          <rect width={732} height={52} rx={14} fill="#0B1120" stroke="#334155" strokeWidth={1}/>
          <text x={366} y={32} textAnchor="middle" fill="#E2E8F0" fontSize={17} fontFamily="sans-serif">
            {analCaption}
          </text>

          {/* DESK (Meja) with vibration */}
          <g transform={`translate(${deskVibrate * (Math.random() - 0.5) * 2}, ${80 + deskVibrate * (Math.random() - 0.5) * 2})`}>
            <rect width={470} height={330} rx={18}
              fill={deskFull ? '#2D0A0A' : '#090D1A'}
              stroke={deskFull ? '#F43F5E' : '#38BDF8'}
              strokeWidth={deskFull ? 3 : 2} filter="url(#shadow)"/>
            {deskFull && (
              <rect width={470} height={300} rx={18} fill="#F43F5E" fillOpacity={0.15} filter="url(#glow)"/>
            )}

            <text x={235} y={35} textAnchor="middle" fill="#38BDF8" fontSize={22} fontFamily="'Arial Black', sans-serif">
              MEJA KERJA
            </text>
            <text x={235} y={58} textAnchor="middle" fill="#64748B" fontSize={13} fontFamily="monospace">
              = RAM (8 GB)
            </text>

            {/* Enhanced desk items with playful animations */}
            {deskItems.map((item, i) => {
              const scale = item.scale || 1
              const rotation = item.rotation || 0
              const offsetY = item.offsetY || 0
              const glow = item.glow || 0
              
              return (
                <g key={item.id} transform={`translate(${item.x}, ${item.y + 80 + offsetY})`}>
                  <g transform={`scale(${scale}) rotate(${rotation} 55 45)`}>
                    <rect width={110} height={90} rx={12}
                      fill={`${item.color}22`} 
                      stroke={item.color} 
                      strokeWidth={2}
                      filter={glow > 0.3 ? "url(#glow)" : "none"}
                      opacity={glow > 0 ? 0.8 + glow * 0.2 : 1}
                    />
                    {glow > 0.5 && (
                      <rect width={110} height={90} rx={12}
                        fill={item.color}
                        fillOpacity={glow * 0.15}
                      />
                    )}
                    <image 
                      href={getIcon(item.icon)} 
                      x={28} 
                      y={10} 
                      width={54} 
                      height={54} 
                      preserveAspectRatio="xMidYMid meet"
                    />
                    <text x={55} y={62} textAnchor="middle" fill="#FFFFFF" fontSize={12} fontFamily="sans-serif" fontWeight={700}>
                      {item.label.split(' ')[0]}
                    </text>
                    <text x={55} y={78} textAnchor="middle" fill={item.color} fontSize={10} fontFamily="monospace">
                      {item.label.substring(item.label.indexOf(' ') + 1)}
                    </text>
                  </g>
                </g>
              )
            })}

            {deskFull && (
              <g transform="translate(235, 254)">
                <rect x={-120} y={-22} width={240} height={36} rx={10} fill="#F43F5E" filter="url(#glow)"/>
                <text x={0} y={0} textAnchor="middle" fill="#FFFFFF" fontSize={16} fontFamily="monospace" fontWeight={900}>
                  MEJA PENUH! 🚨
                </text>
              </g>
            )}
          </g>

          {/* Arrow */}
          <g transform="translate(490, 195)">
            <line x1={0} y1={0} x2={60} y2={0} stroke="#475569" strokeWidth={2} strokeDasharray="4,4"/>
            <text x={30} y={-10} textAnchor="middle" fill="#475569" fontSize={13} fontFamily="monospace">
              Penuh?
            </text>
            <polygon points="58,-6 58,6 72,0" fill="#475569"/>
          </g>

          {/* GUDANG (Disk Swap) */}
          <g transform="translate(560, 80)">
            <rect width={172} height={300} rx={18} fill="#1C0A14" stroke="#9D174D" strokeWidth={2} filter="url(#shadow)"/>
            <text x={86} y={35} textAnchor="middle" fill="#F43F5E" fontSize={18} fontFamily="'Arial Black', sans-serif">
              GUDANG
            </text>
            <text x={86} y={55} textAnchor="middle" fill="#64748B" fontSize={12} fontFamily="monospace">
              = SWAP DISK
            </text>

            <image 
              href={getIcon('storage')} 
              x={32} 
              y={70} 
              width={108} 
              height={108} 
              preserveAspectRatio="xMidYMid meet"
              opacity={0.3}
            />
            <text x={86} y={200} textAnchor="middle" fill="#9D174D" fontSize={14} fontFamily="sans-serif">
              Jauh & Lambat
            </text>
            <text x={86} y={222} textAnchor="middle" fill="#64748B" fontSize={12} fontFamily="monospace">
              HDD/SSD
            </text>
          </g>

          {/* Insight box */}
          <g transform="translate(0, 450)">
            <rect width={732} height={90} rx={14} fill="#0F172A" stroke="#334155" strokeWidth={1}/>
            <text x={36} y={34} fill="#FBBF24" fontSize={16} fontFamily="monospace" fontWeight={800}>
              ANALOGI:
            </text>
            <text x={36} y={58} fill="#CBD5E1" fontSize={15} fontFamily="sans-serif">
              RAM = Meja kerja (akses cepat, terbatas).
            </text>
            <text x={36} y={78} fill="#CBD5E1" fontSize={15} fontFamily="sans-serif">
              Swap = Gudang di lantai bawah (bisa lebih banyak, tapi jalan ke sana butuh waktu).
            </text>
          </g>

        </g>
      )}

      {/* ══════════════════════════════════════════
           ACT 2 — PAGING: Proses Minta RAM (ENHANCED)
           ══════════════════════════════════════════ */}
      {!showIntro && phaseIdx === 1 && (
        <g transform="translate(44, 230)">

          {/* Caption Narasi */}
          <rect width={732} height={52} rx={14} fill="#0B1120" stroke="#334155" strokeWidth={1}/>
          <text x={366} y={32} textAnchor="middle" fill="#E2E8F0" fontSize={17} fontFamily="sans-serif">
            {analCaption}
          </text>

          {/* Kernel / App Side */}
          <g transform="translate(0, 75)" opacity={appBoxOpacity}>
            <g transform={`scale(${appBoxScale})`} style={{transformOrigin: '150px 185px'}}>
              <rect width={300} height={370} rx={18} fill="#090D1A" stroke="#A78BFA" strokeWidth={2} 
                filter="url(#shadow)"
                strokeDasharray={appBorderDash > 0 ? "1000" : "none"}
                strokeDashoffset={appBorderDash}
              />
              <text x={150} y={35} textAnchor="middle" fill="#A78BFA" fontSize={18} fontFamily="'Arial Black', sans-serif">APLIKASI</text>
              <text x={150} y={54} textAnchor="middle" fill="#64748B" fontSize={12} fontFamily="monospace">meminta halaman memori</text>

            {PROCESSES.map((proc, i) => {
              const filled = ramSlots.filter(s => s.proc === proc.name).length
              const iconSrc = getIcon(proc.icon)
              return (
                <g key={proc.id} transform={`translate(20, ${80 + i * 95})`} 
                  opacity={processBoxes[i]?.opacity || 0}>
                  <g transform={`scale(${processBoxes[i]?.scale || 0})`} style={{transformOrigin: '130px 40px'}}>
                    <rect width={260} height={80} rx={12} fill={`${proc.color}18`} stroke={proc.color} strokeWidth={1.5}/>
                    {iconSrc && (
                      <image href={iconSrc} x={16} y={10} width={48} height={48} opacity={0.9}/>
                    )}
                    <text x={80} y={28} fill="#FFFFFF" fontSize={16} fontFamily="monospace" fontWeight={700}>{proc.name}</text>
                    <text x={80} y={48} fill="#64748B" fontSize={12} fontFamily="sans-serif">{proc.desc}</text>
                    <text x={80} y={66} fill={proc.color} fontSize={13} fontFamily="monospace">
                      {filled}/{proc.pages} halaman di RAM
                    </text>
                  </g>
                </g>
              )
              })}
            </g>
          </g>

          {/* Arrow (animated with glow trail) */}
          {arrowAnim.opacity > 0 && (
            <g>
              <rect
                x={lerp(310, 520, arrowAnim.progX || 0) - 48}
                y={390}
                width={96} height={36} rx={10}
                fill={arrowAnim.color} fillOpacity={0.25}
                stroke={arrowAnim.color} strokeWidth={2}
                filter="url(#glow)"/>
              <text
                x={lerp(310, 520, arrowAnim.progX || 0)}
                y={413} textAnchor="middle" fill="#FFFFFF" fontSize={13} fontFamily="monospace" fontWeight={700}>
                {arrowAnim.label}
              </text>
            </g>
          )}

          {/* RAM Side */}
          <g transform="translate(360, 75)" opacity={ramBoxOpacity}>
            <g transform={`scale(${ramBoxScale})`} style={{transformOrigin: '186px 185px'}}>
              <rect width={372} height={370} rx={18} fill="#090D1A" stroke="#34D399" strokeWidth={2} 
                filter="url(#shadow)"
                strokeDasharray={ramBorderDash > 0 ? "1200" : "none"}
                strokeDashoffset={ramBorderDash}
              />
              <text x={186} y={35} textAnchor="middle" fill="#34D399" fontSize={18} fontFamily="'Arial Black', sans-serif">PHYSICAL RAM</text>

            {/* RAM usage bar with glow */}
            <rect x={20} y={50} width={332} height={14} rx={7} fill="#1E293B"/>
            <rect x={20} y={50} width={332 * ramPct / 100} height={14} rx={7}
              fill={ramPct > 85 ? '#F43F5E' : '#34D399'}
              filter={ramPct > 85 ? 'url(#glow)' : 'none'}/>
            <text x={186} y={82} textAnchor="middle" fill={ramPct > 85 ? '#F43F5E' : '#94A3B8'}
              fontSize={14} fontFamily="monospace" fontWeight={800}>
              {ramPct}% TERPAKAI {ramPct > 85 ? '(HAMPIR PENUH!)' : ''}
            </text>

            {/* RAM Slots Grid (Enhanced with scale & offset) */}
            <g transform="translate(16, 100)">
              {ramSlots.map((slot, i) => {
                const col = i % 2
                const row = Math.floor(i / 2)
                const sx  = col * 170
                const sy  = row * 85
                const scale = slot.scale || 1
                const offsetY = slot.offsetY || 0
                const opacity = slot.opacity || 0
                
                return (
                  <g key={slot.id} transform={`translate(${sx}, ${sy + offsetY})`} opacity={opacity}>
                    <g transform={`scale(${scale})`} transform-origin="77.5 37.5">
                      <rect width={155} height={75} rx={10}
                        fill={slot.proc ? `${slot.color}28` : '#0B1120'}
                        stroke={slot.proc ? slot.color : '#1E293B'}
                        strokeWidth={slot.proc ? 2 : 1}
                        filter={scale > 1.05 ? 'url(#glow)' : 'none'}
                      />
                      {slot.proc ? (
                        <>
                          <text x={78} y={30} textAnchor="middle" fill={slot.color} fontSize={13} fontFamily="monospace" fontWeight={800}>
                            {slot.pageLabel}
                          </text>
                          <text x={78} y={50} textAnchor="middle" fill="#94A3B8" fontSize={11} fontFamily="sans-serif">
                            4 KB
                          </text>
                          <circle cx={135} cy={15} r={6} fill={slot.color} filter="url(#glow)"/>
                        </>
                      ) : (
                        <text x={78} y={42} textAnchor="middle" fill="#334155" fontSize={13} fontFamily="monospace">
                          KOSONG
                        </text>
                      )}
                    </g>
                  </g>
                )
              })}
            </g>
          </g>
          </g>

          {/* Insight Box 1 */}
          <g transform="translate(0, 465)">
            <rect width={732} height={65} rx={14} fill="#0F172A" stroke="#334155" strokeWidth={1}/>
            <text x={36} y={24} fill="#64748B" fontSize={14} fontFamily="monospace">
              <tspan x={36} dy={0}>Setiap halaman = 4 KB data. Kernel memutuskan di <tspan fill="#A78BFA" fontWeight={700}>Physical Frame</tspan> mana</tspan>
              <tspan x={36} dy={20}>setiap halaman disimpan.</tspan>
            </text>
          </g>

          {/* Insight Box 2 */}
          <g transform="translate(0, 540)">
            <rect width={732} height={45} rx={14} fill="#0F172A" stroke="#334155" strokeWidth={1}/>
            <text x={36} y={28} fill="#64748B" fontSize={14} fontFamily="sans-serif">
              Aplikasi hanya tahu "Virtual Address" — tidak peduli di mana fisiknya.
            </text>
          </g>

        </g>
      )}

      {/* ══════════════════════════════════════════
           ACT 3 — SWAP OUT: RAM Penuh
          ══════════════════════════════════════════ */}
      {!showIntro && phaseIdx === 2 && (
        <g transform="translate(44, 230)">

          {/* Caption Narasi */}
          <rect width={732} height={52} rx={14} fill={swapAlert ? '#1C0A0A' : '#0B1120'}
            stroke={swapAlert ? '#F43F5E' : '#334155'} strokeWidth={swapAlert ? 2 : 1}
            filter={swapAlert ? 'url(#glow)' : 'none'}/>
          <text x={366} y={32} textAnchor="middle" fill={swapAlert ? '#FCA5A5' : '#E2E8F0'} fontSize={17} fontFamily="sans-serif">
            {analCaption}
          </text>

          {/* RAM Bar */}
          <g transform="translate(0, 75)">
            <rect width={732} height={90} rx={16} fill="#090D1A" stroke={act3Ram >= 99 ? '#F43F5E' : '#334155'} strokeWidth={2}
              filter={act3Ram >= 99 ? 'url(#glow)' : 'none'}/>
            <text x={30} y={30} fill="#CBD5E1" fontSize={16} fontFamily="'Arial Black', sans-serif">
              RAM
            </text>
            <text x={702} y={30} textAnchor="end" fill={act3Ram >= 95 ? '#F43F5E' : act3Ram >= 85 ? '#FBBF24' : '#34D399'} fontSize={22} fontFamily="monospace" fontWeight={900}>
              {act3Ram}%
            </text>
            <rect x={20} y={45} width={RAM_BAR_W} height={24} rx={12} fill="#1E293B"/>
            <rect x={20} y={45} width={RAM_BAR_W * act3Ram / 100} height={24} rx={12}
              fill={act3Ram >= 95 ? '#F43F5E' : act3Ram >= 85 ? '#FBBF24' : '#34D399'} filter={act3Ram >= 95 ? 'url(#glow)' : 'none'}/>
          </g>

          {/* SWAP Bar */}
          <g transform="translate(0, 185)">
            <rect width={732} height={90} rx={16} fill="#090D1A" stroke={act3Swap > 0 ? '#F43F5E' : '#334155'} strokeWidth={2}/>
            <text x={30} y={30} fill="#FDA4AF" fontSize={16} fontFamily="'Arial Black', sans-serif">
              SWAP DISK
            </text>
            <text x={702} y={30} textAnchor="end" fill="#F43F5E" fontSize={22} fontFamily="monospace" fontWeight={900}>
              {act3Swap}%
            </text>
            <rect x={20} y={45} width={SWAP_BAR_W} height={24} rx={12} fill="#1E293B"/>
            <rect x={20} y={45} width={SWAP_BAR_W * act3Swap / 100} height={24} rx={12}
              fill="#F43F5E" filter={act3Swap > 0 ? 'url(#glow)' : 'none'}/>
          </g>

          {/* Moving Page Animation: RAM → Swap */}
          {movingPage && (
            <g>
              {/* From RAM section (x≈370) to Swap section (x≈600) */}
              <g transform={`translate(${lerp(100, 600, movingPage.x)}, ${340 + (movingPage.y || 0)})`}>
                <rect x={-55} y={-22} width={110} height={44} rx={10}
                  fill={movingPage.color} fillOpacity={0.3}
                  stroke={movingPage.color} strokeWidth={2} filter="url(#glow)"/>
                <text x={0} y={4} textAnchor="middle" fill="#FFFFFF" fontSize={13} fontFamily="monospace" fontWeight={800}>
                  {movingPage.label}
                </text>
                <text x={0} y={18} textAnchor="middle" fill={movingPage.color} fontSize={11} fontFamily="monospace">
                  → SWAP
                </text>
              </g>
              {/* Arrow guide line */}
              <line x1={100} y1={340 + (movingPage.y || 0)} x2={600} y2={340 + (movingPage.y || 0)}
                stroke="#4C1D29" strokeWidth={2} strokeDasharray="6,4"/>
            </g>
          )}

          {/* Slot grid (RAM) */}
          <g transform="translate(0, 300)">
            <rect width={360} height={270} rx={16} fill="#090D1A" stroke="#1E293B" strokeWidth={1.5}/>
            <text x={180} y={28} textAnchor="middle" fill="#94A3B8" fontSize={14} fontFamily="monospace">PHYSICAL RAM</text>
            <g transform="translate(12, 45)">
              {ramSlots.map((slot, i) => {
                const col = i % 2; const row = Math.floor(i / 2)
                return (
                  <g key={slot.id} transform={`translate(${col * 170}, ${row * 68})`}>
                    <rect width={155} height={58} rx={8}
                      fill={slot.proc ? `${slot.color}25` : '#0B1120'}
                      stroke={slot.proc ? slot.color : '#1E293B'} strokeWidth={1.5}/>
                    <text x={78} y={35} textAnchor="middle"
                      fill={slot.proc ? '#FFFFFF' : '#334155'} fontSize={13} fontFamily="monospace" fontWeight={700}>
                      {slot.proc ? slot.pageLabel : 'KOSONG'}
                    </text>
                  </g>
                )
              })}
            </g>
          </g>

          {/* Arrow RAM → Swap (animated) */}
          {arrowAnim.opacity > 0 && (
            <g transform="translate(0, 420)">
              <g transform={`translate(${lerp(360, 372, arrowAnim.progX || 0)}, 0)`}>
                <rect x={-52} y={-18} width={104} height={36} rx={10}
                  fill={arrowAnim.color} fillOpacity={0.25}
                  stroke={arrowAnim.color} strokeWidth={2} filter="url(#glow)"/>
                <text x={0} y={6} textAnchor="middle" fill="#FFF" fontSize={13} fontFamily="monospace" fontWeight={700}>
                  {arrowAnim.label}
                </text>
              </g>
            </g>
          )}

          {/* SWAP Slots */}
          <g transform="translate(372, 300)">
            <rect width={360} height={270} rx={16} fill="#1C0A14" stroke="#9D174D" strokeWidth={2}/>
            <text x={180} y={28} textAnchor="middle" fill="#F43F5E" fontSize={14} fontFamily="monospace">SWAP DISK (GUDANG)</text>
            
            {/* Swap percentage bar */}
            <g transform="translate(15, 220)">
              <rect x={0} y={0} width={330} height={16} rx={8} fill="#0B1120" stroke="#4C1D29" strokeWidth={1}/>
              <rect x={0} y={0} width={330 * act3Swap / 100} height={16} rx={8}
                fill={act3Swap > 70 ? '#F43F5E' : act3Swap > 40 ? '#FBBF24' : '#9D174D'}
                filter={act3Swap > 70 ? 'url(#glow)' : 'none'}/>
              <text x={165} y={30} textAnchor="middle" fill={act3Swap > 70 ? '#F43F5E' : '#F472B6'}
                fontSize={12} fontFamily="monospace" fontWeight={700}>
                SWAP: {act3Swap}%
              </text>
            </g>
            
            <g transform="translate(12, 50)">
              {swapSlots.length === 0 ? (
                <text x={165} y={80} textAnchor="middle" fill="#4C1D29" fontSize={14} fontFamily="monospace">KOSONG</text>
              ) : swapSlots.map((s, i) => (
                <g key={i} transform={`translate(0, ${i * 68})`}>
                  <rect width={330} height={58} rx={8} fill={`${s.color}20`} stroke={s.color} strokeWidth={1.5}/>
                  <text x={165} y={35} textAnchor="middle" fill="#FFFFFF" fontSize={14} fontFamily="monospace" fontWeight={700}>
                    {s.label}
                  </text>
                </g>
              ))}
            </g>
          </g>

          {/* Warning box */}
          {swapAlert && (
            <g transform="translate(0, 590)">
              <rect width={732} height={70} rx={14} fill="#2D0A0A" stroke="#F43F5E" strokeWidth={2} filter="url(#glow)"/>
              <text x={36} y={30} fill="#F43F5E" fontSize={15} fontFamily="monospace" fontWeight={900}>SWAP AKTIF = KOMPUTER TERASA LAMBAT!</text>
              <text x={36} y={54} fill="#FDA4AF" fontSize={13} fontFamily="sans-serif">
                Disk jauh lebih lambat dari RAM. Upgrade RAM jika Swap sering penuh.
              </text>
            </g>
          )}

        </g>
      )}

      {/* ══════════════════════════════════════════
           ACT 4 — SWAP IN + LATENCY COMPARISON
          ══════════════════════════════════════════ */}
      {!showIntro && phaseIdx === 3 && (
        <g transform="translate(44, 230)">

          {/* Caption */}
          <rect width={732} height={52} rx={14} fill="#0B1120" stroke="#334155" strokeWidth={1}/>
          <text x={366} y={32} textAnchor="middle" fill="#E2E8F0" fontSize={17} fontFamily="sans-serif">
            {analCaption}
          </text>

          {/* Page Fault Box */}
          <g transform="translate(0, 80)">
            <rect width={732} height={110} rx={16}
              fill={pageFaultMsg ? '#1C0A0A' : '#090D1A'}
              stroke={pageFaultMsg ? '#F43F5E' : '#334155'} strokeWidth={2}
              filter={pageFaultMsg ? 'url(#glow)' : 'none'}/>

            <text x={366} y={42} textAnchor="middle" fill={pageFaultMsg ? '#F43F5E' : '#64748B'}
              fontSize={26} fontFamily="'Arial Black', sans-serif">
              {pageFaultMsg ? (
                <>
                  <image href={getIcon('lightning')} x={320} y={16} width={32} height={32} />
                  <tspan x={366} dy={0}>PAGE FAULT TERJADI!</tspan>
                </>
              ) : (
                'Menunggu akses...'
              )}
            </text>
            <text x={366} y={72} textAnchor="middle" fill={pageFaultMsg ? '#FDA4AF' : '#475569'}
              fontSize={15} fontFamily="sans-serif">
              {pageFaultMsg
                ? 'Data yang diminta tidak ada di RAM — ada di Swap Disk!'
                : 'Aplikasi mencoba mengakses data...'}
            </text>
            {swapInAnim && (
              <g>
                <text x={366} y={96} textAnchor="middle" fill="#FBBF24" fontSize={13} fontFamily="monospace" fontWeight={700}>
                  Kernel: Swap In → Tarik Game P0 dari disk ke RAM... (menunggu disk!)
                </text>
              </g>
            )}
          </g>

          {/* Swap In visual: Disk → RAM */}
          {swapInAnim && (
            <g transform="translate(0, 215)">
              <rect width={200} height={80} rx={14} fill="#1C0A14" stroke="#F43F5E" strokeWidth={2}/>
              <text x={100} y={35} textAnchor="middle" fill="#F43F5E" fontSize={15} fontFamily="monospace" fontWeight={800}>SWAP DISK</text>
              <text x={100} y={58} textAnchor="middle" fill="#FFFFFF" fontSize={13} fontFamily="monospace">Game P0</text>

              <line x1={208} y1={40} x2={340} y2={40} stroke="#FBBF24" strokeWidth={3} strokeDasharray="8,5" filter="url(#glow)"/>
              <polygon points="338,34 338,46 352,40" fill="#FBBF24" filter="url(#glow)"/>
              <text x={270} y={28} textAnchor="middle" fill="#FBBF24" fontSize={12} fontFamily="monospace">LAMBAT!</text>

              <rect x={358} width={200} height={80} rx={14} fill="#064E3B" stroke="#34D399" strokeWidth={2}/>
              <text x={458} y={35} textAnchor="middle" fill="#34D399" fontSize={15} fontFamily="monospace" fontWeight={800}>RAM</text>
              <text x={458} y={58} textAnchor="middle" fill="#FFFFFF" fontSize={13} fontFamily="monospace">Game P0 ✓</text>

              <rect x={570} width={162} height={80} rx={14} fill="#0B1120" stroke="#64748B" strokeWidth={1}/>
              <text x={651} y={33} textAnchor="middle" fill="#64748B" fontSize={12} fontFamily="monospace">vs. dari RAM:</text>
              <text x={651} y={55} textAnchor="middle" fill="#34D399" fontSize={13} fontFamily="monospace" fontWeight={700}>LANGSUNG!</text>
            </g>
          )}

          {/* Latency Comparison Chart */}
          <g transform="translate(0, 330)">
            <rect width={732} height={330} rx={18} fill="#090D1A" stroke="#1E293B" strokeWidth={2}/>
            <text x={366} y={36} textAnchor="middle" fill="#FFFFFF" fontSize={20} fontFamily="'Arial Black', sans-serif">
              PERBANDINGAN KECEPATAN AKSES
            </text>
            <text x={366} y={56} textAnchor="middle" fill="#64748B" fontSize={13} fontFamily="monospace">
              (Makin panjang bar = makin LAMBAT)
            </text>

            {LATENCY.map((lat, i) => {
              const barW  = (latencyAnim[i] / 100) * 490
              const rowY  = 80 + i * 58
              const barVisible = latencyBarsVisible[i] || { opacity: 0, scale: 0 }
              return (
                <g key={lat.label} 
                   transform={`translate(20, ${rowY}) scale(${barVisible.scale})`}
                   opacity={barVisible.opacity}>
                  <text x={0} y={16} fill="#94A3B8" fontSize={14} fontFamily="monospace">{lat.label}</text>
                  <text x={692} y={16} textAnchor="end" fill={lat.color} fontSize={14} fontFamily="monospace" fontWeight={700}>{lat.ns}</text>
                  <rect x={0} y={25} width={490} height={20} rx={10} fill="#1E293B"/>
                  <rect x={0} y={25} width={barW} height={20} rx={10} fill={lat.color}
                    filter={i >= 2 ? 'url(#glow)' : 'none'}/>
                </g>
              )
            })}

            {/* Insight: SSD vs HDD */}
            <g transform="translate(16, 315)">
              <text x={0} y={0} fill="#FBBF24" fontSize={13} fontFamily="monospace" fontWeight={700}>
                Tip: Jika pakai Swap, gunakan SSD. HDD ~100x lebih lambat dari SSD!
              </text>
            </g>
          </g>

          {/* swappiness hint */}
          <g transform="translate(0, 695)">
            <rect width={732} height={80} rx={14} fill="#0F172A" stroke="#FBBF24" strokeWidth={1.5}/>
            <text x={30} y={30} fill="#FBBF24" fontSize={15} fontFamily="monospace" fontWeight={800}>
              sysctl vm.swappiness = ?
            </text>
            <text x={30} y={54} fill="#CBD5E1" fontSize={14} fontFamily="sans-serif">
              0–10 = Hindari swap (cocok DB/Server)  |  60 = Default Linux  |  100 = Agresif swap
            </text>
          </g>

        </g>
      )}

      {/* ── FOOTER ── */}
      <g transform="translate(44, 1250)">
        <rect width={732} height={62} rx={16} fill="#090D1A" stroke="#1E293B" strokeWidth={1.5} filter="url(#shadow)"/>
        <circle cx={30} cy={31} r={5} fill={phase.badgeColor} filter="url(#glow)"/>
        <text x={48} y={37} fill="#E2E8F0" fontSize={16} fontFamily="sans-serif" fontWeight={500}>
          {phase.caption}
        </text>
      </g>
    </svg>
  )
}
