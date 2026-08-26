// src/shared/GlowDot.js
// Helper: buat SVG circle dengan GSAP glow animation
// Dipanggil imperatif (bukan React component)
// karena GSAP perlu akses langsung ke DOM element

import gsap from 'gsap'

/**
 * Buat animated glowing dot yang bergerak dari (x1,y1) ke (x2,y2)
 * @param {SVGElement} parent  - parent SVG <g> element
 * @param {number}     x1,y1  - start position
 * @param {number}     x2,y2  - end position
 * @param {string}     color  - fill color hex
 * @param {number}     delay  - GSAP delay (seconds)
 * @param {number}     dur    - travel duration (seconds)
 * @param {number}     gap    - gap between repeats (seconds)
 * @param {number}     [r=7]  - dot radius
 * @returns {{ el: SVGCircleElement, tl: gsap.core.Timeline }}
 */
export function createGlowDot(parent, x1, y1, x2, y2, color, delay, dur, gap, r = 7) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  el.setAttribute('r',      r)
  el.setAttribute('cx',     x1)
  el.setAttribute('cy',     y1)
  el.setAttribute('fill',   color)
  el.setAttribute('opacity', '0')
  el.setAttribute('filter', 'url(#dotGlow)')
  parent.appendChild(el)

  const tl = gsap.timeline({ repeat: -1, repeatDelay: gap, delay })
  tl.to(el,  { opacity: 0.95, duration: 0.1 })
  tl.to(el,  { attr: { cx: x2, cy: y2 }, duration: dur, ease: 'none' })
  tl.to(el,  { opacity: 0, duration: 0.15 })
  tl.set(el, { attr: { cx: x1, cy: y1 } })

  return { el, tl }
}

/**
 * Destroy semua dots sekaligus
 */
export function destroyDots(dots = []) {
  dots.forEach(({ el, tl }) => {
    tl.kill()
    el.remove()
  })
}
