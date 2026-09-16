import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { COLOR_MAP } from '../utils/colorScheme'

export default function LineTracer({ link, progress }) {
  const lineRef = useRef(null)
  const dotRef = useRef(null)

  const color = COLOR_MAP[link.color] || '#00D9FF'
  const lengthRef = useRef(1)

  // progress passed 0..1 (manual step animation). Fallback to GSAP timeline.
  useEffect(() => {
    const line = lineRef.current
    const dot = dotRef.current
    const { x1, y1, x2, y2 } = link
    const len = Math.hypot(x2 - x1, y2 - y1)
    lengthRef.current = len

    line.setAttribute('stroke-dasharray', `${len}`);
    line.setAttribute('stroke-dashoffset', len);
    dot.setAttribute('opacity', 1)

    const tween = gsap.to(line, {
      strokeDashoffset: 0,
      duration: link.duration || 1.2,
      delay: link.delay || 0,
      ease: 'power2.inOut'
    })

    const dotTween = gsap.fromTo(
      dot,
      { x: x1, y: y1 },
      {
        x: x2 - 6,
        y: y2 - 6,
        duration: link.duration || 1.2,
        delay: link.delay || 0,
        ease: 'power2.inOut',
        onComplete: () => dot.setAttribute('opacity', 0.3)
      }
    )

    return () => {
      tween.kill()
      dotTween.kill()
    }
  }, [link])

  return (
    <g>
      <line
        ref={lineRef}
        x1={link.x1}
        y1={link.y1}
        x2={link.x2}
        y2={link.y2}
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        filter="url(#glow)"
      />
      <circle ref={dotRef} r={5} fill={color} filter="url(#glow)" opacity="0.9" />
    </g>
  )
}