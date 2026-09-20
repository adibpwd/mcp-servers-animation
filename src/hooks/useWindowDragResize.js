// src/hooks/useWindowDragResize.js
// ─────────────────────────────────────────────────────────────
// PLAN-19 Phase 3 — drag header & resize edge/corner untuk ContentWindow.
// Pointer event murni (tanpa lib). disabled dipakai untuk viewport kecil
// (single-window stack, PLAN-19 §7.3) supaya drag/resize free dimatikan.
// 
// PERFORMANCE OPTIMIZATION: Direct DOM manipulation via CSS transform
// untuk drag (realtime 60fps+), state update hanya saat drag selesai.
// ─────────────────────────────────────────────────────────────
import { useCallback, useRef } from 'react'

const MIN_WIDTH = 320
const MIN_HEIGHT = 220

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}

export function useWindowDragResize({ rect, mode, disabled, onMove, onResize }) {
  const dragRef = useRef(null)
  const windowRef = useRef(null)

  const handleDragMove = useCallback((e) => {
    const d = dragRef.current
    if (!d || d.isResize || !windowRef.current) return
    
    // Hitung delta dari posisi awal drag
    const deltaX = e.clientX - d.startX
    const deltaY = e.clientY - d.startY
    
    // Clamp supaya window tidak keluar viewport
    const vw = window.innerWidth
    const vh = window.innerHeight
    const clampedX = clamp(d.originX + deltaX, 0, Math.max(vw - d.width, 0))
    const clampedY = clamp(d.originY + deltaY, 0, Math.max(vh - d.height, 0))
    
    // Direct DOM manipulation (GPU-accelerated, no React re-render!)
    const finalDeltaX = clampedX - d.originX
    const finalDeltaY = clampedY - d.originY
    windowRef.current.style.transform = `translate(${finalDeltaX}px, ${finalDeltaY}px)`
  }, [])

  const handleDragUp = useCallback((e) => {
    const d = dragRef.current
    if (!d || d.isResize || !windowRef.current) return
    
    // Hitung posisi final
    const deltaX = e.clientX - d.startX
    const deltaY = e.clientY - d.startY
    const vw = window.innerWidth
    const vh = window.innerHeight
    const finalX = clamp(d.originX + deltaX, 0, Math.max(vw - d.width, 0))
    const finalY = clamp(d.originY + deltaY, 0, Math.max(vh - d.height, 0))
    
    // Reset transform (posisi akan di-set via React state)
    windowRef.current.style.transform = ''
    
    // Update React state sekali saja di akhir
    onMove(finalX, finalY)
    
    dragRef.current = null
    window.removeEventListener('pointermove', handleDragMove)
    window.removeEventListener('pointerup', handleDragUp)
  }, [onMove, handleDragMove])

  const onHeaderPointerDown = useCallback((e) => {
    if (disabled || mode === 'maximized') return
    if (e.target.closest('.window-controls')) return
    
    dragRef.current = {
      isResize: false,
      startX: e.clientX,
      startY: e.clientY,
      originX: rect.x,
      originY: rect.y,
      width: rect.width,
      height: rect.height,
    }
    
    window.addEventListener('pointermove', handleDragMove)
    window.addEventListener('pointerup', handleDragUp)
    e.preventDefault() // Prevent text selection during drag
  }, [disabled, mode, rect.x, rect.y, rect.width, rect.height, handleDragMove, handleDragUp])

  const handleResizeMove = useCallback((e) => {
    const d = dragRef.current
    if (!d || !d.isResize || !windowRef.current) return
    const vw = window.innerWidth
    const vh = window.innerHeight

    let newWidth = d.originWidth
    let newHeight = d.originHeight

    if (d.handle.includes('e')) {
      newWidth = clamp(d.originWidth + (e.clientX - d.startX), MIN_WIDTH, vw - d.originX)
    }
    if (d.handle.includes('s')) {
      newHeight = clamp(d.originHeight + (e.clientY - d.startY), MIN_HEIGHT, vh - d.originY)
    }

    d.currentWidth = newWidth
    d.currentHeight = newHeight

    // Direct DOM update tanpa React re-render tiap pixel!
    windowRef.current.style.width = `${newWidth}px`
    windowRef.current.style.height = `${newHeight}px`
  }, [])

  const handleResizeUp = useCallback(() => {
    const d = dragRef.current
    if (!d || !d.isResize) return
    
    if (d.currentWidth && d.currentHeight) {
      onResize(d.currentWidth, d.currentHeight)
    }

    dragRef.current = null
    window.removeEventListener('pointermove', handleResizeMove)
    window.removeEventListener('pointerup', handleResizeUp)
  }, [onResize, handleResizeMove])

  const onResizePointerDown = useCallback((e, handle = 'se') => {
    if (disabled || mode === 'maximized') return
    e.stopPropagation()
    e.preventDefault()

    dragRef.current = {
      isResize: true,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      originX: rect.x,
      originY: rect.y,
      originWidth: rect.width,
      originHeight: rect.height,
      currentWidth: rect.width,
      currentHeight: rect.height,
    }

    if (e.target.setPointerCapture) {
      try { e.target.setPointerCapture(e.pointerId) } catch (_) {}
    }

    window.addEventListener('pointermove', handleResizeMove)
    window.addEventListener('pointerup', handleResizeUp)
  }, [disabled, mode, rect.x, rect.y, rect.width, rect.height, handleResizeMove, handleResizeUp])

  return { onHeaderPointerDown, onResizePointerDown, windowRef }
}
