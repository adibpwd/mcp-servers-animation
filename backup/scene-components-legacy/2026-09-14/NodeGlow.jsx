import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ANIMATION_CONFIG } from '../utils/animationConfig'

export default function NodeGlow({ active = true, color = ANIMATION_CONFIG.COLORS.PRIMARY_CYAN }) {
  const glowRef = useRef(null)

  useEffect(() => {
    if (!active) return
    const tween = gsap.to(glowRef.current, {
      opacity: 1,
      scale: 1.4,
      duration: ANIMATION_CONFIG.GLOW_PULSE_DURATION,
      yoyo: true,
      repeat: -1,
      ease: 'power1.inOut'
    })
    return () => tween.kill()
  }, [active])

  if (!active) return null
  return <circle ref={glowRef} className="node-glow" r={20} fill={color} opacity={0.3} />
}