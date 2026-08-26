// src/hooks/useTimeline.js
// Reusable GSAP timeline hook untuk semua content

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * @param {Function} buildFn   - (timeline) => void, called once on mount
 * @param {Object}   options   - gsap.timeline options (repeat, repeatDelay, etc.)
 * @returns {{ timelineRef }}
 */
export function useTimeline(buildFn, options = {}) {
  const timelineRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5, ...options })
    timelineRef.current = tl
    buildFn(tl)

    return () => tl.kill()
  }, [])

  return { timelineRef }
}
