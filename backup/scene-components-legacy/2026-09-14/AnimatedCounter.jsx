import { useRef, useEffect } from 'react'
import gsap from 'gsap'

export default function AnimatedCounter({ start = 14, end = 29, duration = 12 }) {
  const counterRef = useRef(null)
  const displayRef = useRef(null)

  useEffect(() => {
    const obj = { value: start }
    displayRef.current.textContent = String(start).padStart(2, '0')

    const tween = gsap.to(obj, {
      value: end,
      duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        const val = Math.round(obj.value)
        displayRef.current.textContent = String(val).padStart(2, '0')
      }
    })

    return () => tween.kill()
  }, [start, end, duration])

  return (
    <div ref={counterRef} className="animated-counter">
      <span ref={displayRef}>14</span>
    </div>
  )
}