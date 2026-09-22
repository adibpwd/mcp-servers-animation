// ═══════════════════════════════════════════════════════════════════════════════════════════
// src/content/linux-vs-unix/Animation-redesign.jsx
// ─────────────────────────────────────────────────────────────────────────────────────────
// Linux vs Unix — REDESIGNED ANIMATION
// Protocol Conflict Narrative: Recipe → Interpretation → Consequences → Bridge
// ═══════════════════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  VW, VH,
  COLORS, CHARACTERS, PHASES,
  PHASE_RECIPE, PHASE_PERMISSIONS, PHASE_SIGNALS, PHASE_SHELL,
  PHASE_CONSEQUENCES, PHASE_RESOLUTION,
  ANIMATION_TIMING, EASING, SFX_MAP,
  NARRATOR, CHARACTER_DIALOGUE, ANNOTATIONS,
} from './data-redesign'
import sfxLoader from './sfx-loader'

export default function LinuxVsUnixAnimationRedesign({
  paused = false,
  speed = 1.0,
  volume = 75,
  previewSfx = true,
  audioUnlocked = false,
}) {
  const svgRef = useRef(null)
  const masterRef = useRef(null)

  // Phase tracking
  const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0)
  const [caption, setCaption] = useState('')
  const [captionColor, setCaptionColor] = useState(COLORS.NARRATOR)

  // ═══════════════════════════════════════════════════════════════════════════════════════
  // PHASE 1: RECIPE - State for character and recipe card
  // ═══════════════════════════════════════════════════════════════════════════════════════
  const [phase1State, setPhase1State] = useState({
    tuxOpacity: 0,
    tuxScale: 0,
    bsdOpacity: 0,
    bsdScale: 0,
    recipeOpacity: 0,
    recipeScale: 0,
    recipeGlow: 0,
    eyeGlowTux: 0,
    eyeGlowBsd: 0,
    highlightIdx: -1,
  })

  // ═══════════════════════════════════════════════════════════════════════════════════════
  // PHASE 2A: PERMISSIONS - State for file comparison
  // ═══════════════════════════════════════════════════════════════════════════════════════
  const [phase2aState, setPhase2aState] = useState({
    fileOpacity: 0,
    fileScale: 0,
    linuxOpacity: 0,
    linuxY: 0,
    bsdOpacity: 0,
    bsdY: 0,
    permissionChangeProgress: 0, // 0-1 for morphing permissions
    deltaOpacity: 0,
    deltaY: 0,
  })

  // ═══════════════════════════════════════════════════════════════════════════════════════
  // PHASE 2B: SIGNALS - State for process animation
  // ═══════════════════════════════════════════════════════════════════════════════════════
  const [phase2bState, setPhase2bState] = useState({
    processOpacity: 0,
    processRotation: 0,
    processScale: 0,
    signalSentTux: false,
    signalSentBsd: false,
    timelineProgress: 0, // 0-1 for signal timeline
    exitAnimationTux: 0, // 0-1 smooth fade
    exitAnimationBsd: 0, // 0-1 crash effect
  })

  // ═══════════════════════════════════════════════════════════════════════════════════════
  // PHASE 2C: SHELL - State for pipeline animation
  // ═══════════════════════════════════════════════════════════════════════════════════════
  const [phase2cState, setPhase2cState] = useState({
    commandOpacity: 0,
    linuxPipelineProgress: 0, // 0-1
    bsdPipelineProgress: 0, // 0-1
    linuxStages: [0, 0, 0], // opacity for each stage
    bsdStages: [0, 0, 0],
    dataFlowProgress: 0, // 0-1 for data flowing through
  })

  // ═══════════════════════════════════════════════════════════════════════════════════════
  // PHASE 3: CONSEQUENCES - State for split screen and error
  // ═══════════════════════════════════════════════════════════════════════════════════════
  const [phase3State, setPhase3State] = useState({
    laptopOpacity: 0,
    codeOpacity: 0,
    splitProgress: 0, // 0-1 for split screen
    linuxSuccess: 0, // 0-1 green glow
    bsdError: 0, // 0-1 red glow
    errorMessageY: 100,
    errorMessageOpacity: 0,
    shakeIntensity: 0,
  })

  // ═══════════════════════════════════════════════════════════════════════════════════════
  // PHASE 4: RESOLUTION - State for Venn diagram
  // ═══════════════════════════════════════════════════════════════════════════════════════
  const [phase4State, setPhase4State] = useState({
    circleAOpacity: 0,
    circleBOpacity: 0,
    circleLabelOpacity: 0,
    posixTools: [0, 0, 0, 0, 0], // opacity for each tool
    linuxOnly: [0, 0, 0],
    bsdOnly: [0, 0, 0],
    characterReactionProgress: 0, // 0-1
  })

  // ═══════════════════════════════════════════════════════════════════════════════════════
  // Setup SFX
  // ═══════════════════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const shouldEnable = previewSfx && audioUnlocked
    sfxLoader.setEnabled(shouldEnable)
  }, [previewSfx, audioUnlocked])

  // ═══════════════════════════════════════════════════════════════════════════════════════
  // Main animation timeline
  // ═══════════════════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const master = gsap.timeline({
      repeat: -1,
      repeatDelay: ANIMATION_TIMING.LOOP_DELAY,
      paused: paused,
      timeScale: speed,
      onRepeat: () => setCurrentPhaseIdx(0),
    })

    masterRef.current = master

    // ═══════════════════════════════════════════════════════════════════════════════════
    // PHASE 1: THE RECIPE (4.5s)
    // ═══════════════════════════════════════════════════════════════════════════════════
    const phase1_start = 0

    // Characters entrance
    master.to(
      { tuxScale: 0, tuxOpacity: 0 },
      {
        tuxScale: 1,
        tuxOpacity: 1,
        duration: ANIMATION_TIMING.CHARACTER_ENTRANCE_DURATION,
        ease: EASING.BOUNCY,
        onUpdate: function() {
          setPhase1State(prev => ({
            ...prev,
            tuxScale: this.targets()[0].tuxScale,
            tuxOpacity: this.targets()[0].tuxOpacity,
          }))
        },
      },
      phase1_start
    )

    master.to(
      { bsdScale: 0, bsdOpacity: 0 },
      {
        bsdScale: 1,
        bsdOpacity: 1,
        duration: ANIMATION_TIMING.CHARACTER_ENTRANCE_DURATION,
        ease: EASING.BOUNCY,
        onUpdate: function() {
          setPhase1State(prev => ({
            ...prev,
            bsdScale: this.targets()[0].bsdScale,
            bsdOpacity: this.targets()[0].bsdOpacity,
          }))
        },
      },
      phase1_start + ANIMATION_TIMING.CHARACTER_ENTRANCE_STAGGER
    )

    // Recipe card slide in
    master.to(
      { recipeScale: 0.3, recipeOpacity: 0 },
      {
        recipeScale: 1,
        recipeOpacity: 1,
        duration: ANIMATION_TIMING.RECIPE_SLIDE_DURATION,
        ease: EASING.SNAPPY,
        onUpdate: function() {
          setPhase1State(prev => ({
            ...prev,
            recipeScale: this.targets()[0].recipeScale,
            recipeOpacity: this.targets()[0].recipeOpacity,
          }))
        },
      },
      phase1_start + 0.2
    )

    // Recipe glow effect
    master.to(
      { recipeGlow: 0 },
      {
        recipeGlow: 1,
        duration: ANIMATION_TIMING.RECIPE_GLOW_DURATION,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        onUpdate: function() {
          setPhase1State(prev => ({
            ...prev,
            recipeGlow: this.targets()[0].recipeGlow,
          }))
        },
      },
      phase1_start + 0.4
    )

    // Eye glow effects
    master.to(
      { eyeGlowTux: 0 },
      {
        eyeGlowTux: 1,
        duration: 0.4,
        ease: 'power2.out',
        onUpdate: function() {
          setPhase1State(prev => ({
            ...prev,
            eyeGlowTux: this.targets()[0].eyeGlowTux,
          }))
        },
      },
      phase1_start + 0.8
    )

    master.to(
      { eyeGlowBsd: 0 },
      {
        eyeGlowBsd: 1,
        duration: 0.4,
        ease: 'power2.out',
        onUpdate: function() {
          setPhase1State(prev => ({
            ...prev,
            eyeGlowBsd: this.targets()[0].eyeGlowBsd,
          }))
        },
      },
      phase1_start + 0.9
    )

    // Highlight key phrases from recipe
    master.to(
      { highlightIdx: -1 },
      {
        highlightIdx: PHASE_RECIPE.keyHighlights.length - 1,
        duration: PHASE_RECIPE.keyHighlights.length * 0.5,
        onUpdate: function() {
          const idx = Math.floor(this.targets()[0].highlightIdx)
          setPhase1State(prev => ({
            ...prev,
            highlightIdx: idx,
          }))
          // Play SFX for each highlight
          if (previewSfx && audioUnlocked) {
            sfxLoader.play(SFX_MAP.PLINK.name, volume)
          }
        },
      },
      phase1_start + 1.2
    )

    // Phase label
    const phaseLabel = svg.querySelector('[data-phase="recipe"]')
    if (phaseLabel) {
      master.fromTo(
        phaseLabel,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: EASING.SNAPPY },
        phase1_start + 0.5
      )
    }

    // Play SFX
    if (previewSfx && audioUnlocked) {
      master.add(() => sfxLoader.play(SFX_MAP.POP.name, volume), phase1_start + 0.3)
      master.add(() => sfxLoader.play(SFX_MAP.WHOOSH.name, volume), phase1_start + 0.5)
    }

    // ═══════════════════════════════════════════════════════════════════════════════════
    // PHASE 2A: FILE PERMISSIONS (3.5s)
    // ═══════════════════════════════════════════════════════════════════════════════════
    const phase2a_start = phase1_start + ANIMATION_TIMING.PHASE1_DURATION

    // File appears
    master.to(
      { fileScale: 0, fileOpacity: 0 },
      {
        fileScale: 1,
        fileOpacity: 1,
        duration: ANIMATION_TIMING.FILE_SPAWN_DURATION,
        ease: EASING.BOUNCY,
        onUpdate: function() {
          setPhase2aState(prev => ({
            ...prev,
            fileScale: this.targets()[0].fileScale,
            fileOpacity: this.targets()[0].fileOpacity,
          }))
        },
      },
      phase2a_start
    )

    // Linux approach slides in
    master.to(
      { linuxY: 100, linuxOpacity: 0 },
      {
        linuxY: 0,
        linuxOpacity: 1,
        duration: 0.5,
        ease: EASING.SNAPPY,
        onUpdate: function() {
          setPhase2aState(prev => ({
            ...prev,
            linuxY: this.targets()[0].linuxY,
            linuxOpacity: this.targets()[0].linuxOpacity,
          }))
        },
      },
      phase2a_start + 0.2
    )

    // BSD approach slides in (opposite side)
    master.to(
      { bsdY: -100, bsdOpacity: 0 },
      {
        bsdY: 0,
        bsdOpacity: 1,
        duration: 0.5,
        ease: EASING.SNAPPY,
        onUpdate: function() {
          setPhase2aState(prev => ({
            ...prev,
            bsdY: this.targets()[0].bsdY,
            bsdOpacity: this.targets()[0].bsdOpacity,
          }))
        },
      },
      phase2a_start + 0.3
    )

    // Permission mode changes
    master.to(
      { permissionChangeProgress: 0 },
      {
        permissionChangeProgress: 1,
        duration: ANIMATION_TIMING.PERMISSION_CHANGE_DURATION,
        ease: EASING.SMOOTH,
        onUpdate: function() {
          setPhase2aState(prev => ({
            ...prev,
            permissionChangeProgress: this.targets()[0].permissionChangeProgress,
          }))
        },
      },
      phase2a_start + 1.0
    )

    // Delta label appears
    master.to(
      { deltaOpacity: 0, deltaY: 30 },
      {
        deltaOpacity: 1,
        deltaY: 0,
        duration: 0.4,
        ease: EASING.SNAPPY,
        onUpdate: function() {
          setPhase2aState(prev => ({
            ...prev,
            deltaOpacity: this.targets()[0].deltaOpacity,
            deltaY: this.targets()[0].deltaY,
          }))
        },
      },
      phase2a_start + 1.6
    )

    // Play SFX
    if (previewSfx && audioUnlocked) {
      master.add(() => sfxLoader.play(SFX_MAP.POP.name, volume), phase2a_start)
      master.add(() => sfxLoader.play(SFX_MAP.WHOOSH.name, volume), phase2a_start + 0.2)
      master.add(() => sfxLoader.play(SFX_MAP.ERROR_BUZZ.name, volume), phase2a_start + 1.6)
    }

    // ═══════════════════════════════════════════════════════════════════════════════════
    // PHASE 2B: SIGNAL HANDLING (3.0s)
    // ═════════════════════════════════════════════════════════════════════════════════
    const phase2b_start = phase2a_start + ANIMATION_TIMING.PHASE2A_DURATION
    master.to(
      { processRotation: 0, processScale: 0, processOpacity: 0 },
      {
        processRotation: 360 * 2,
        processScale: 1,
        processOpacity: 1,
        duration: ANIMATION_TIMING.PROCESS_SPIN_DURATION,
        ease: 'linear',
        onUpdate: function() {
          setPhase2bState(prev => ({...prev, processRotation: this.targets()[0].processRotation, processScale: this.targets()[0].processScale, processOpacity: this.targets()[0].processOpacity}))
        },
      },
      phase2b_start
    )
    master.to({timelineProgress: 0}, {timelineProgress: 0.5, duration: 1.2, ease: EASING.SMOOTH, onUpdate: function() {setPhase2bState(prev => ({...prev, timelineProgress: this.targets()[0].timelineProgress, signalSentTux: true}))}}, phase2b_start + 0.4)
    master.to({exitAnimationTux: 0}, {exitAnimationTux: 1, duration: ANIMATION_TIMING.PROCESS_EXIT_DURATION, ease: 'power2.in', onUpdate: function() {setPhase2bState(prev => ({...prev, exitAnimationTux: this.targets()[0].exitAnimationTux}))}}, phase2b_start + 1.2)
    master.to({timelineProgress: 0.5}, {timelineProgress: 1, duration: 1.5, ease: EASING.SMOOTH, onUpdate: function() {setPhase2bState(prev => ({...prev, timelineProgress: this.targets()[0].timelineProgress, signalSentBsd: true}))}}, phase2b_start + 0.5)
    master.to({exitAnimationBsd: 0}, {exitAnimationBsd: 1, duration: ANIMATION_TIMING.PROCESS_EXIT_DURATION * 0.8, ease: 'power4.in', onUpdate: function() {setPhase2bState(prev => ({...prev, exitAnimationBsd: this.targets()[0].exitAnimationBsd}))}}, phase2b_start + 1.8)
    if (previewSfx && audioUnlocked) {
      master.add(() => sfxLoader.play(SFX_MAP.SIGNAL_SEND.name, volume), phase2b_start + 0.4)
      master.add(() => sfxLoader.play(SFX_MAP.WHOOSH.name, volume), phase2b_start + 1.2)
      master.add(() => sfxLoader.play(SFX_MAP.ERROR_BEEP.name, volume), phase2b_start + 1.8)
    }

    // ═════════════════════════════════════════════════════════════════════════════════
    // PHASE 2C: SHELL BEHAVIOR (3.5s)
    // ═════════════════════════════════════════════════════════════════════════════════
    const phase2c_start = phase2b_start + ANIMATION_TIMING.PHASE2B_DURATION
    master.to({commandOpacity: 0}, {commandOpacity: 1, duration: 0.4, ease: EASING.SNAPPY, onUpdate: function() {setPhase2cState(prev => ({...prev, commandOpacity: this.targets()[0].commandOpacity}))}}, phase2c_start)
    master.to({linuxPipelineProgress: 0}, {linuxPipelineProgress: 1, duration: ANIMATION_TIMING.PIPELINE_FLOW_DURATION, ease: EASING.SMOOTH, onUpdate: function() {const p = this.targets()[0].linuxPipelineProgress; setPhase2cState(prev => ({...prev, linuxPipelineProgress: p, linuxStages: [p > 0 ? 1 : 0, p > 0.33 ? 1 : 0, p > 0.66 ? 1 : 0]}))}}, phase2c_start + 0.4)
    master.to({bsdPipelineProgress: 0}, {bsdPipelineProgress: 1, duration: ANIMATION_TIMING.PIPELINE_FLOW_DURATION, ease: EASING.SMOOTH, onUpdate: function() {const p = this.targets()[0].bsdPipelineProgress; setPhase2cState(prev => ({...prev, bsdPipelineProgress: p, bsdStages: [p > 0 ? 1 : 0, p > 0.33 ? 1 : 0, p > 0.66 ? 1 : 0]}))}}, phase2c_start + 0.5)
    if (previewSfx && audioUnlocked) {
      master.add(() => sfxLoader.play(SFX_MAP.PLINK.name, volume), phase2c_start)
      master.add(() => sfxLoader.play(SFX_MAP.WHOOSH.name, volume), phase2c_start + 0.4)
      master.add(() => sfxLoader.play(SFX_MAP.WHOOSH.name, volume), phase2c_start + 0.5)
    }

    // ═════════════════════════════════════════════════════════════════════════════════
    // PHASE 3: CONSEQUENCES (6.0s)
    // ═════════════════════════════════════════════════════════════════════════════════
    const phase3_start = phase2c_start + ANIMATION_TIMING.PHASE2C_DURATION
    master.to({laptopOpacity: 0, codeOpacity: 0}, {laptopOpacity: 1, codeOpacity: 1, duration: 0.6, ease: EASING.SNAPPY, onUpdate: function() {setPhase3State(prev => ({...prev, laptopOpacity: this.targets()[0].laptopOpacity, codeOpacity: this.targets()[0].codeOpacity}))}}, phase3_start)
    master.to({splitProgress: 0}, {splitProgress: 1, duration: 0.8, ease: EASING.SMOOTH, onUpdate: function() {setPhase3State(prev => ({...prev, splitProgress: this.targets()[0].splitProgress}))}}, phase3_start + 0.8)
    master.to({linuxSuccess: 0}, {linuxSuccess: 1, duration: 0.6, ease: EASING.SMOOTH, onUpdate: function() {setPhase3State(prev => ({...prev, linuxSuccess: this.targets()[0].linuxSuccess}))}}, phase3_start + 1.6)
    master.to({bsdError: 0}, {bsdError: 1, duration: 0.6, ease: EASING.SMOOTH, onUpdate: function() {setPhase3State(prev => ({...prev, bsdError: this.targets()[0].bsdError}))}}, phase3_start + 1.8)
    master.to({errorMessageY: 20, errorMessageOpacity: 0}, {errorMessageY: 0, errorMessageOpacity: 1, duration: 0.5, ease: EASING.SNAPPY, onUpdate: function() {setPhase3State(prev => ({...prev, errorMessageY: this.targets()[0].errorMessageY, errorMessageOpacity: this.targets()[0].errorMessageOpacity}))}}, phase3_start + 2.2)
    if (previewSfx && audioUnlocked) {
      master.add(() => sfxLoader.play(SFX_MAP.LAPTOP_POWER.name, volume), phase3_start)
      master.add(() => sfxLoader.play(SFX_MAP.SUCCESS_CHIME.name, volume), phase3_start + 1.6)
      master.add(() => sfxLoader.play(SFX_MAP.ERROR_BEEP.name, volume), phase3_start + 1.8)
      master.add(() => sfxLoader.play(SFX_MAP.ERROR_BUZZ.name, volume), phase3_start + 2.2)
    }

    // ═════════════════════════════════════════════════════════════════════════════════
    // PHASE 4: RESOLUTION (5.0s)
    // ═════════════════════════════════════════════════════════════════════════════════
    const phase4_start = phase3_start + ANIMATION_TIMING.PHASE3_DURATION
    master.to({circleAOpacity: 0}, {circleAOpacity: 1, duration: ANIMATION_TIMING.CIRCLE_DRAW_DURATION, ease: EASING.SNAPPY, onUpdate: function() {setPhase4State(prev => ({...prev, circleAOpacity: this.targets()[0].circleAOpacity}))}}, phase4_start)
    master.to({circleBOpacity: 0}, {circleBOpacity: 1, duration: ANIMATION_TIMING.CIRCLE_DRAW_DURATION, ease: EASING.SNAPPY, onUpdate: function() {setPhase4State(prev => ({...prev, circleBOpacity: this.targets()[0].circleBOpacity}))}}, phase4_start + ANIMATION_TIMING.CIRCLE_STAGGER)
    master.to({circleLabelOpacity: 0}, {circleLabelOpacity: 1, duration: 0.4, ease: EASING.SNAPPY, onUpdate: function() {setPhase4State(prev => ({...prev, circleLabelOpacity: this.targets()[0].circleLabelOpacity}))}}, phase4_start + ANIMATION_TIMING.CIRCLE_STAGGER * 2)
    master.to({toolProgress: 0}, {toolProgress: 1, duration: 1.5, ease: EASING.SMOOTH, onUpdate: function() {const p = this.targets()[0].toolProgress; setPhase4State(prev => ({...prev, posixTools: [p > 0.0 ? 1 : 0, p > 0.25 ? 1 : 0, p > 0.5 ? 1 : 0, p > 0.75 ? 1 : 0, p > 0.9 ? 1 : 0]}))}}, phase4_start + 1.2)
    master.to({linuxOnlyProgress: 0}, {linuxOnlyProgress: 1, duration: 0.8, ease: EASING.SMOOTH, onUpdate: function() {const p = this.targets()[0].linuxOnlyProgress; setPhase4State(prev => ({...prev, linuxOnly: [p > 0.0 ? 1 : 0, p > 0.33 ? 1 : 0, p > 0.66 ? 1 : 0]}))}}, phase4_start + 2.0)
    master.to({bsdOnlyProgress: 0}, {bsdOnlyProgress: 1, duration: 0.8, ease: EASING.SMOOTH, onUpdate: function() {const p = this.targets()[0].bsdOnlyProgress; setPhase4State(prev => ({...prev, bsdOnly: [p > 0.0 ? 1 : 0, p > 0.33 ? 1 : 0, p > 0.66 ? 1 : 0]}))}}, phase4_start + 2.4)
    master.to({characterReactionProgress: 0}, {characterReactionProgress: 1, duration: 0.6, ease: EASING.SNAPPY, onUpdate: function() {setPhase4State(prev => ({...prev, characterReactionProgress: this.targets()[0].characterReactionProgress}))}}, phase4_start + 3.0)
    if (previewSfx && audioUnlocked) {
      master.add(() => sfxLoader.play(SFX_MAP.WHOOSH.name, volume), phase4_start)
      master.add(() => sfxLoader.play(SFX_MAP.WHOOSH.name, volume), phase4_start + ANIMATION_TIMING.CIRCLE_STAGGER)
      master.add(() => sfxLoader.play(SFX_MAP.PLINK.name, volume), phase4_start + 1.2)
      master.add(() => sfxLoader.play(SFX_MAP.SUCCESS_CHIME.name, volume), phase4_start + 3.0)
      master.add(() => sfxLoader.play(SFX_MAP.VICTORY_CHORD.name, volume), phase4_start + 3.8)
    }
    master.to({}, {}, ANIMATION_TIMING.MASTER_DURATION - ANIMATION_TIMING.LOOP_DELAY)
    // (rest of animation will be added in next write_file call)

  }, [paused, speed, volume, previewSfx, audioUnlocked])

  // ═══════════════════════════════════════════════════════════════════════════════════════
  // Sync paused state
  // ═══════════════════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (masterRef.current) {
      if (paused) {
        masterRef.current.pause()
      } else {
        masterRef.current.play()
      }
    }
  }, [paused])

  // ═══════════════════════════════════════════════════════════════════════════════════════
  // Sync speed
  // ═══════════════════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (masterRef.current) {
      masterRef.current.timeScale(speed)
    }
  }, [speed])

  // ═══════════════════════════════════════════════════════════════════════════════════════
  // RENDER SVG
  // ═══════════════════════════════════════════════════════════════════════════════════════
  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VW} ${VH}`}
      width="100%"
      height="100%"
      className="linux-vs-unix-animation"
      style={{ background: '#1a1a2e' }}
    >
      {/* PHASE 1: RECIPE SCENE */}
      <g className="phase-1-scene">
        {/* Narrator caption */}
        <text
          x={VW / 2}
          y={50}
          textAnchor="middle"
          fontSize={NARRATOR.fontSize}
          fill={NARRATOR.color}
          opacity={phase1State.tuxOpacity}
          data-phase="recipe"
        >
          {PHASE_RECIPE.sceneDescription}
        </text>

        {/* Tux Character */}
        <circle
          cx={PHASE_RECIPE.tuxPosition.x}
          cy={PHASE_RECIPE.tuxPosition.y}
          r={50}
          fill={COLORS.TUX_PRIMARY}
          opacity={phase1State.tuxOpacity}
          style={{
            transform: `scale(${phase1State.tuxScale})`,
            transformOrigin: `${PHASE_RECIPE.tuxPosition.x}px ${PHASE_RECIPE.tuxPosition.y}px`,
          }}
        />
        <text
          x={PHASE_RECIPE.tuxPosition.x}
          y={PHASE_RECIPE.tuxPosition.y + 10}
          textAnchor="middle"
          fontSize={30}
          opacity={phase1State.tuxOpacity}
        >
          {CHARACTERS.TUX.emoji}
        </text>

        {/* Eye glow for Tux */}
        <circle
          cx={PHASE_RECIPE.tuxPosition.x}
          cy={PHASE_RECIPE.tuxPosition.y}
          r={50}
          fill="none"
          stroke={COLORS.TUX_ACCENT}
          strokeWidth={3}
          opacity={phase1State.eyeGlowTux * 0.6}
          filter="url(#glow)"
        />

        {/* BSD Character */}
        <circle
          cx={PHASE_RECIPE.bsdPosition.x}
          cy={PHASE_RECIPE.bsdPosition.y}
          r={50}
          fill={COLORS.BSD_PRIMARY}
          opacity={phase1State.bsdOpacity}
          style={{
            transform: `scale(${phase1State.bsdScale})`,
            transformOrigin: `${PHASE_RECIPE.bsdPosition.x}px ${PHASE_RECIPE.bsdPosition.y}px`,
          }}
        />
        <text
          x={PHASE_RECIPE.bsdPosition.x}
          y={PHASE_RECIPE.bsdPosition.y + 10}
          textAnchor="middle"
          fontSize={30}
          opacity={phase1State.bsdOpacity}
        >
          {CHARACTERS.BSD.emoji}
        </text>

        {/* Eye glow for BSD */}
        <circle
          cx={PHASE_RECIPE.bsdPosition.x}
          cy={PHASE_RECIPE.bsdPosition.y}
          r={50}
          fill="none"
          stroke={COLORS.BSD_ACCENT}
          strokeWidth={3}
          opacity={phase1State.eyeGlowBsd * 0.6}
          filter="url(#glow)"
        />

        {/* Recipe Card */}
        <rect
          x={PHASE_RECIPE.recipePosition.x - 100}
          y={PHASE_RECIPE.recipePosition.y - 60}
          width={200}
          height={120}
          rx={10}
          fill={COLORS.RECIPE_BG}
          opacity={phase1State.recipeOpacity}
          style={{
            transform: `scale(${phase1State.recipeScale})`,
            transformOrigin: `${PHASE_RECIPE.recipePosition.x}px ${PHASE_RECIPE.recipePosition.y}px`,
          }}
        />

        {/* Recipe card glow */}
        <rect
          x={PHASE_RECIPE.recipePosition.x - 100}
          y={PHASE_RECIPE.recipePosition.y - 60}
          width={200}
          height={120}
          rx={10}
          fill="none"
          stroke={COLORS.TUX_PRIMARY}
          strokeWidth={3}
          opacity={phase1State.recipeGlow}
        />

        {/* Recipe text */}
        <text
          x={PHASE_RECIPE.recipePosition.x}
          y={PHASE_RECIPE.recipePosition.y - 20}
          textAnchor="middle"
          fontSize={16}
          fontWeight="bold"
          fill={COLORS.RECIPE_TEXT}
          opacity={phase1State.recipeOpacity}
        >
          POSIX Standard
        </text>

        {/* Highlighted clauses */}
        {PHASE_RECIPE.keyHighlights.map((highlight, idx) => (
          <text
            key={`highlight-${idx}`}
            x={PHASE_RECIPE.recipePosition.x}
            y={PHASE_RECIPE.recipePosition.y + 10 + idx * 20}
            textAnchor="middle"
            fontSize={11}
            fill={phase1State.highlightIdx === idx ? COLORS.CONFLICT_ZONE : COLORS.RECIPE_TEXT}
            opacity={phase1State.recipeOpacity * (phase1State.highlightIdx >= idx ? 1 : 0.4)}
          >
            • {highlight}
          </text>
        ))}
      </g>

      {/* PHASE 2A: PERMISSIONS SCENE */}
      <g className="phase-2a-scene" opacity={phase2aState.fileOpacity}>
        {/* File representation */}
        <rect
          x={VW / 2 - 80}
          y={VH / 2 - 100}
          width={160}
          height={200}
          rx={5}
          fill="#2d3748"
          stroke={COLORS.NEUTRAL}
          strokeWidth={2}
          style={{
            transform: `scale(${phase2aState.fileScale})`,
            transformOrigin: `${VW / 2}px ${VH / 2 - 100}px`,
          }}
        />

        {/* Filename */}
        <text
          x={VW / 2}
          y={VH / 2 - 70}
          textAnchor="middle"
          fontSize={12}
          fontWeight="bold"
          fill={COLORS.NARRATOR}
        >
          {PHASE_PERMISSIONS.linux.filename}
        </text>

        {/* Linux permissions info */}
        <g opacity={phase2aState.linuxOpacity} style={{ transform: `translateY(${phase2aState.linuxY}px)` }}>
          <text x={VW / 2 - 120} y={VH / 2 - 20} fontSize={11} fill={COLORS.TUX_PRIMARY}>
            Linux
          </text>
          <text x={VW / 2 - 120} y={VH / 2 + 5} fontSize={10} fill={COLORS.NARRATOR}>
            Owner: user
          </text>
          <text x={VW / 2 - 120} y={VH / 2 + 20} fontSize={10} fill={COLORS.NARRATOR}>
            Group: developers
          </text>
          <text x={VW / 2 - 120} y={VH / 2 + 35} fontSize={10} fill={COLORS.TUX_ACCENT} fontWeight="bold">
            Mode: 755 📖
          </text>
        </g>

        {/* BSD permissions info */}
        <g opacity={phase2aState.bsdOpacity} style={{ transform: `translateY(${phase2aState.bsdY}px)` }}>
          <text x={VW / 2 + 40} y={VH / 2 - 20} fontSize={11} fill={COLORS.BSD_PRIMARY}>
            BSD
          </text>
          <text x={VW / 2 + 40} y={VH / 2 + 5} fontSize={10} fill={COLORS.NARRATOR}>
            Owner: root
          </text>
          <text x={VW / 2 + 40} y={VH / 2 + 20} fontSize={10} fill={COLORS.NARRATOR}>
            Group: wheel
          </text>
          <text x={VW / 2 + 40} y={VH / 2 + 35} fontSize={10} fill={COLORS.BSD_ACCENT} fontWeight="bold">
            Mode: 700 🔐
          </text>
        </g>

        {/* Delta indicator */}
        <text
          x={VW / 2}
          y={VH / 2 + 80}
          textAnchor="middle"
          fontSize={12}
          fill={COLORS.CONFLICT_ZONE}
          opacity={phase2aState.deltaOpacity}
          style={{ transform: `translateY(${phase2aState.deltaY}px)` }}
        >
          ⚡ Divergence Detected
        </text>
      </g>

      {/* PHASE 2B: SIGNALS SCENE */}
      <g className="phase-2b-scene" opacity={phase2bState.processOpacity} style={{transform: `translateY(${-50 + phase2bState.processOpacity * 50}px)`}}>
        <circle cx={VW / 2} cy={VH / 2} r={60} fill="none" stroke={COLORS.TUX_PRIMARY} strokeWidth={3} style={{transform: `rotate(${phase2bState.processRotation}deg) scale(${phase2bState.processScale})`, transformOrigin: `${VW / 2}px ${VH / 2}px`}} />
        <text x={VW / 2} y={VH / 2 + 10} textAnchor="middle" fontSize={12} fill={COLORS.NARRATOR}>web-server</text>
        <line x1={VW / 4} y1={VH / 2 + 120} x2={VW * 3 / 4} y2={VH / 2 + 120} stroke={COLORS.NEUTRAL} strokeWidth={2} opacity={phase2bState.processOpacity} />
        <circle cx={VW / 4 + (VW / 2) * phase2bState.timelineProgress} cy={VH / 2 + 100} r={8} fill={phase2bState.signalSentTux ? COLORS.TUX_PRIMARY : COLORS.NEUTRAL} />
        <text x={VW / 4 + (VW / 2) * phase2bState.timelineProgress} y={VH / 2 + 75} textAnchor="middle" fontSize={10} fill={COLORS.TUX_PRIMARY} opacity={phase2bState.signalSentTux ? 1 : 0}>SIGTERM 👋</text>
        <circle cx={VW / 4 + (VW / 2) * Math.max(0, phase2bState.timelineProgress - 0.5) * 2} cy={VH / 2 + 140} r={8} fill={phase2bState.signalSentBsd ? COLORS.BSD_PRIMARY : COLORS.NEUTRAL} />
        <text x={VW / 4 + (VW / 2) * Math.max(0, phase2bState.timelineProgress - 0.5) * 2} y={VH / 2 + 165} textAnchor="middle" fontSize={10} fill={COLORS.BSD_PRIMARY} opacity={phase2bState.signalSentBsd ? 1 : 0}>SIGKILL ⚡</text>
      </g>

      {/* PHASE 2C: SHELL SCENE */}
      <g className="phase-2c-scene" opacity={phase2cState.commandOpacity}>
        <text x={VW / 2} y={100} textAnchor="middle" fontSize={14} fill={COLORS.NARRATOR} fontFamily="monospace">$ {PHASE_SHELL.command}</text>
        {PHASE_SHELL.linux.stages.map((stage, idx) => (
          <g key={`linux-stage-${idx}`}>
            <rect x={150 + idx * 200} y={250} width={160} height={60} rx={8} fill={COLORS.TUX_SECONDARY} stroke={COLORS.TUX_PRIMARY} strokeWidth={2} opacity={phase2cState.linuxStages[idx]} />
            <text x={230 + idx * 200} y={285} textAnchor="middle" fontSize={12} fill={COLORS.NARRATOR} opacity={phase2cState.linuxStages[idx]}>{stage}</text>
          </g>
        ))}
        {PHASE_SHELL.bsd.stages.map((stage, idx) => (
          <g key={`bsd-stage-${idx}`}>
            <rect x={150 + idx * 200} y={400} width={160} height={60} rx={0} fill={COLORS.BSD_SECONDARY} stroke={COLORS.BSD_PRIMARY} strokeWidth={2} opacity={phase2cState.bsdStages[idx]} />
            <text x={230 + idx * 200} y={435} textAnchor="middle" fontSize={12} fill={COLORS.NARRATOR} opacity={phase2cState.bsdStages[idx]}>{stage}</text>
          </g>
        ))}
      </g>

      {/* PHASE 3: CONSEQUENCES SCENE */}
      <g className="phase-3-scene" opacity={phase3State.laptopOpacity} style={{transform: `translateY(${5 * (1 - phase3State.splitProgress)}px)`}}>
        <rect x={VW / 2 - 200 + (phase3State.splitProgress * -150)} y={50} width={350} height={450} rx={20} fill={COLORS.TUX_SECONDARY} stroke={COLORS.TUX_PRIMARY} strokeWidth={2} opacity={0.8} />
        <rect x={VW / 2 + 50 + (phase3State.splitProgress * 150)} y={50} width={350} height={450} rx={20} fill={COLORS.BSD_SECONDARY} stroke={COLORS.BSD_PRIMARY} strokeWidth={2} opacity={0.8} />
        <text x={VW / 2 - 25} y={90} textAnchor="middle" fontSize={14} fill={COLORS.TUX_PRIMARY} fontWeight="bold" opacity={phase3State.codeOpacity}>Linux</text>
        <text x={VW / 2 + 225} y={90} textAnchor="middle" fontSize={14} fill={COLORS.BSD_PRIMARY} fontWeight="bold" opacity={phase3State.codeOpacity}>BSD</text>
        <text x={VW / 2 - 25} y={200} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={COLORS.NARRATOR} opacity={phase3State.codeOpacity && phase3State.linuxSuccess}>chmod 755 config.sh</text>
        <text x={VW / 2 + 225} y={200} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={COLORS.NARRATOR} opacity={phase3State.codeOpacity && phase3State.bsdError}>chmod 755 config.sh</text>
        <circle cx={VW / 2 - 25} cy={300} r={40} fill="none" stroke={COLORS.SUCCESS} strokeWidth={3} opacity={phase3State.linuxSuccess} />
        <text x={VW / 2 - 25} y={310} textAnchor="middle" fontSize={24} opacity={phase3State.linuxSuccess}>✓</text>
        <circle cx={VW / 2 + 225} cy={300} r={40} fill="none" stroke={COLORS.ERROR} strokeWidth={3} opacity={phase3State.bsdError} />
        <text x={VW / 2 + 225} y={310} textAnchor="middle" fontSize={24} opacity={phase3State.bsdError}>✗</text>
        <text x={VW / 2} y={VH - 50} textAnchor="middle" fontSize={13} fill={COLORS.ERROR} opacity={phase3State.errorMessageOpacity} style={{transform: `translateY(${phase3State.errorMessageY}px)`}}>Permission Denied 🔐</text>
      </g>

      {/* PHASE 4: RESOLUTION SCENE - VENN DIAGRAM */}
      <g className="phase-4-scene" opacity={phase4State.circleAOpacity + phase4State.circleBOpacity > 0 ? 1 : 0}>
        <circle cx={VW / 2 - 120} cy={VH / 2} r={120} fill={COLORS.TUX_PRIMARY} opacity={phase4State.circleAOpacity * 0.2} stroke={COLORS.TUX_PRIMARY} strokeWidth={2} />
        <circle cx={VW / 2 + 120} cy={VH / 2} r={120} fill={COLORS.BSD_PRIMARY} opacity={phase4State.circleBOpacity * 0.2} stroke={COLORS.BSD_PRIMARY} strokeWidth={2} />
        <circle cx={VW / 2 - 60} cy={VH / 2} r={100} fill={COLORS.RESOLUTION_ZONE} opacity={phase4State.circleAOpacity * 0.3 + phase4State.circleBOpacity * 0.3} stroke={COLORS.RESOLUTION_ZONE} strokeWidth={2} />
        <text x={VW / 2 - 140} y={VH / 2 - 150} textAnchor="middle" fontSize={14} fill={COLORS.TUX_PRIMARY} fontWeight="bold" opacity={phase4State.circleLabelOpacity}>Linux</text>
        <text x={VW / 2 + 140} y={VH / 2 - 150} textAnchor="middle" fontSize={14} fill={COLORS.BSD_PRIMARY} fontWeight="bold" opacity={phase4State.circleLabelOpacity}>BSD</text>
        <text x={VW / 2} y={VH / 2 - 100} textAnchor="middle" fontSize={12} fill={COLORS.RESOLUTION_ZONE} fontWeight="bold" opacity={phase4State.circleLabelOpacity}>POSIX</text>
        {PHASE_RESOLUTION.posixTools.map((tool, idx) => (
          <text key={`posix-${idx}`} x={VW / 2 + (idx - 2) * 50} y={VH / 2 + 40} textAnchor="middle" fontSize={11} fill={COLORS.RESOLUTION_ZONE} opacity={phase4State.posixTools[idx]}>{tool.emoji} {tool.tool}</text>
        ))}
        {PHASE_RESOLUTION.linuxOnly.map((tool, idx) => (
          <text key={`linux-${idx}`} x={VW / 2 - 180} y={VH / 2 + 100 + idx * 30} textAnchor="middle" fontSize={10} fill={COLORS.TUX_PRIMARY} opacity={phase4State.linuxOnly[idx]}>{tool.tool}</text>
        ))}
        {PHASE_RESOLUTION.bsdOnly.map((tool, idx) => (
          <text key={`bsd-${idx}`} x={VW / 2 + 180} y={VH / 2 + 100 + idx * 30} textAnchor="middle" fontSize={10} fill={COLORS.BSD_PRIMARY} opacity={phase4State.bsdOnly[idx]}>{tool.tool}</text>
        ))}
      </g>

      {/* SVG Filters */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  )
}