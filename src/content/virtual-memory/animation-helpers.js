// animation-helpers.js
// Reusable GSAP animation helpers for playful effects

import gsap from 'gsap'

/**
 * Item Spawn Animation - Playful bounce entry with rotation and glow
 * @param {object} setState - React setState function
 * @param {object} item - Item to spawn
 * @param {number} delay - Delay before animation starts
 * @param {object} timeline - GSAP timeline
 * @returns {number} Animation duration
 */
export const itemSpawn = (setState, item, delay, timeline) => {
  const t = delay
  const duration = 0.4

  // Add item to state with initial transform values
  timeline.add(() => {
    setState(prev => [...prev, { 
      ...item, 
      scale: 0, 
      rotation: -15, 
      offsetY: 50,
      glow: 0 
    }])
  }, t)

  // Animate scale with overshoot (bounce effect)
  const scaleObj = { scale: 0 }
  timeline.to(scaleObj, {
    scale: 1,
    duration: duration,
    ease: 'back.out(1.7)',
    onUpdate: () => {
      setState(prev => prev.map(itm => 
        itm.id === item.id ? { ...itm, scale: scaleObj.scale } : itm
      ))
    }
  }, t)

  // Animate rotation (spin entrance)
  const rotObj = { rotation: -15 }
  timeline.to(rotObj, {
    rotation: 0,
    duration: duration,
    ease: 'power2.out',
    onUpdate: () => {
      setState(prev => prev.map(itm => 
        itm.id === item.id ? { ...itm, rotation: rotObj.rotation } : itm
      ))
    }
  }, t)

  // Animate Y position (slide up)
  const yObj = { y: 50 }
  timeline.to(yObj, {
    y: 0,
    duration: duration,
    ease: 'power2.out',
    onUpdate: () => {
      setState(prev => prev.map(itm => 
        itm.id === item.id ? { ...itm, offsetY: yObj.y } : itm
      ))
    }
  }, t)

  // Animate glow (fade in then settle)
  const glowObj = { glow: 0 }
  timeline.to(glowObj, {
    glow: 1,
    duration: duration * 0.6,
    ease: 'power2.out',
    onUpdate: () => {
      setState(prev => prev.map(itm => 
        itm.id === item.id ? { ...itm, glow: glowObj.glow } : itm
      ))
    }
  }, t)
  timeline.to(glowObj, {
    glow: 0.7,
    duration: duration * 0.4,
    ease: 'power2.in',
    onUpdate: () => {
      setState(prev => prev.map(itm => 
        itm.id === item.id ? { ...itm, glow: glowObj.glow } : itm
      ))
    }
  }, t + duration * 0.6)

  return duration
}

/**
 * Screen Shake - Vibration effect for dramatic moments
 * @param {object} setState - React setState for shake offset
 * @param {number} intensity - Shake amplitude (pixels)
 * @param {number} duration - Shake duration (seconds)
 * @param {number} delay - Delay before shake
 * @param {object} timeline - GSAP timeline
 */
export const screenShake = (setState, intensity, duration, delay, timeline) => {
  const shakeObj = { x: 0, y: 0 }
  
  timeline.add(() => {
    setState({ x: 0, y: 0 })
  }, delay)

  // Multiple rapid shakes
  const shakeCount = Math.floor(duration * 10) // 10 shakes per second
  for (let i = 0; i < shakeCount; i++) {
    const t = delay + (i / shakeCount) * duration
    const amp = intensity * (1 - i / shakeCount) // Decay amplitude
    
    timeline.to(shakeObj, {
      x: (Math.random() - 0.5) * amp * 2,
      y: (Math.random() - 0.5) * amp * 2,
      duration: duration / shakeCount,
      ease: 'none',
      onUpdate: () => setState({ x: shakeObj.x, y: shakeObj.y })
    }, t)
  }

  // Return to center
  timeline.to(shakeObj, {
    x: 0, y: 0,
    duration: 0.1,
    ease: 'power2.out',
    onUpdate: () => setState({ x: 0, y: 0 })
  }, delay + duration)
}

/**
 * Glitch Effect - RGB split distortion for dramatic page movements
 * @param {object} setState - React setState for glitch state
 * @param {number} intensity - Glitch intensity (0-1)
 * @param {number} duration - Glitch duration
 * @param {number} delay - Delay before glitch
 * @param {object} timeline - GSAP timeline
 */
export const glitchEffect = (setState, intensity, duration, delay, timeline) => {
  const glitchObj = { intensity: 0, offsetX: 0 }

  timeline.add(() => {
    setState({ active: true, intensity: 0, offsetX: 0 })
  }, delay)

  // Rapid glitch pulses
  const pulseCount = Math.floor(duration * 15) // 15 glitches per second
  for (let i = 0; i < pulseCount; i++) {
    const t = delay + (i / pulseCount) * duration
    
    timeline.to(glitchObj, {
      intensity: Math.random() * intensity,
      offsetX: (Math.random() - 0.5) * 4,
      duration: duration / pulseCount,
      ease: 'none',
      onUpdate: () => setState({ 
        active: true, 
        intensity: glitchObj.intensity,
        offsetX: glitchObj.offsetX
      })
    }, t)
  }

  // End glitch
  timeline.add(() => {
    setState({ active: false, intensity: 0, offsetX: 0 })
  }, delay + duration)
}

/**
 * Pulse Glow - Pulsing glow effect for elements
 * @param {object} setState - React setState for glow intensity
 * @param {number} intensity - Max glow intensity (0-1)
 * @param {number} duration - Pulse duration
 * @param {number} delay - Delay before pulse
 * @param {object} timeline - GSAP timeline
 */
export const pulseGlow = (setState, intensity, duration, delay, timeline) => {
  const glowObj = { value: 0 }

  // Pulse up
  timeline.to(glowObj, {
    value: intensity,
    duration: duration / 2,
    ease: 'power2.inOut',
    onUpdate: () => setState(glowObj.value)
  }, delay)

  // Pulse down
  timeline.to(glowObj, {
    value: 0,
    duration: duration / 2,
    ease: 'power2.inOut',
    onUpdate: () => setState(glowObj.value)
  }, delay + duration / 2)
}

/**
 * Slot Appear - RAM slot slide in animation
 * @param {object} setState - React setState for slots
 * @param {number} slotIndex - Index of slot to animate
 * @param {number} delay - Delay before animation
 * @param {object} timeline - GSAP timeline
 */
export const slotAppear = (setState, slotIndex, delay, timeline) => {
  const duration = 0.3
  const animObj = { opacity: 0, scale: 0, offsetY: 20 }

  timeline.add(() => {
    setState(prev => {
      const updated = [...prev]
      updated[slotIndex] = { ...updated[slotIndex], opacity: 0, scale: 0, offsetY: 20 }
      return updated
    })
  }, delay)

  timeline.to(animObj, {
    opacity: 1,
    scale: 1,
    offsetY: 0,
    duration: duration,
    ease: 'back.out(1.4)',
    onUpdate: () => {
      setState(prev => {
        const updated = [...prev]
        updated[slotIndex] = { 
          ...updated[slotIndex], 
          opacity: animObj.opacity,
          scale: animObj.scale,
          offsetY: animObj.offsetY
        }
        return updated
      })
    }
  }, delay)
}

/**
 * Page Journey - Animated page travel from source to destination
 * @param {object} setState - React setState for page position
 * @param {object} from - Start position {x, y}
 * @param {object} to - End position {x, y}
 * @param {number} duration - Journey duration
 * @param {number} delay - Delay before journey
 * @param {object} timeline - GSAP timeline
 */
export const pageJourney = (setState, from, to, duration, delay, timeline) => {
  const posObj = { x: from.x, y: from.y, progress: 0 }

  timeline.add(() => {
    setState({ x: from.x, y: from.y, active: true, progress: 0 })
  }, delay)

  timeline.to(posObj, {
    x: to.x,
    y: to.y,
    progress: 1,
    duration: duration,
    ease: 'power2.inOut',
    onUpdate: () => {
      setState({ 
        x: posObj.x, 
        y: posObj.y, 
        active: true,
        progress: posObj.progress
      })
    }
  }, delay)

  timeline.add(() => {
    setState({ x: to.x, y: to.y, active: false, progress: 1 })
  }, delay + duration)
}

/**
 * Particle Burst - Celebration/impact particle effect
 * @param {object} setState - React setState for particles
 * @param {object} position - Burst center {x, y}
 * @param {string} color - Particle color
 * @param {number} count - Number of particles
 * @param {number} delay - Delay before burst
 * @param {object} timeline - GSAP timeline
 */
export const particleBurst = (setState, position, color, count, delay, timeline) => {
  const duration = 0.6
  const particles = []

  // Generate particles with random directions
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    const velocity = 40 + Math.random() * 30
    particles.push({
      id: `particle_${Date.now()}_${i}`,
      x: position.x,
      y: position.y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      color: color,
      opacity: 1,
      scale: 0.5 + Math.random() * 0.5
    })
  }

  timeline.add(() => {
    setState(particles)
  }, delay)

  // Animate particles
  particles.forEach((particle, i) => {
    const pObj = { ...particle }
    timeline.to(pObj, {
      x: particle.x + particle.vx,
      y: particle.y + particle.vy,
      opacity: 0,
      scale: particle.scale * 0.3,
      duration: duration,
      ease: 'power2.out',
      onUpdate: () => {
        setState(prev => prev.map(p => 
          p.id === particle.id ? { ...pObj } : p
        ))
      }
    }, delay)
  })

  // Clear particles
  timeline.add(() => {
    setState([])
  }, delay + duration)
}

/**
 * Latency Bar Fill - Staggered bar filling with color
 * @param {object} setState - React setState for bar values
 * @param {number} index - Bar index
 * @param {number} targetValue - Target fill percentage
 * @param {number} delay - Delay before fill
 * @param {object} timeline - GSAP timeline
 */
export const latencyBarFill = (setState, index, targetValue, delay, timeline) => {
  const duration = 0.8
  const barObj = { value: 0 }

  timeline.to(barObj, {
    value: targetValue,
    duration: duration,
    ease: 'power2.out',
    onUpdate: () => {
      setState(prev => {
        const updated = [...prev]
        updated[index] = barObj.value
        return updated
      })
    }
  }, delay)
}

export default {
  itemSpawn,
  screenShake,
  glitchEffect,
  pulseGlow,
  slotAppear,
  pageJourney,
  particleBurst,
  latencyBarFill
}
