// src/components/FloatingControls.jsx
// ─────────────────────────────────────────────────────────────
// Mode "window" (dashboard windowed content) — header toolbar & bottom
// timeline prev/next disembunyikan, digantikan bubble floating ala iOS
// AssistiveTouch: Play selalu keliatan, tombol "More" (⋯) buka menu
// vertikal kecil berisi Export/Download/Copy/Settings. Bubble bisa
// di-drag bebas di dalam area window (pointer events, clamp ke bounds
// kontainer .player-shell).
// ─────────────────────────────────────────────────────────────
import React, { useCallback, useRef, useState, useEffect } from 'react'
import './FloatingControls.css'

export function FloatingControls({
  isPaused,
  onTogglePlay,
  isFocused,
  isExporting,
  onExport,
  canDownload,
  downloadHref,
  downloadName,
  copiedCaption,
  onCopyCaption,
  onOpenSettings,
}) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ x: null, y: null }) // null = pakai default CSS (kanan-bawah)
  const rootRef = useRef(null)
  const dragRef = useRef(null)
  const movedRef = useRef(false)

  // Drag bubble bebas dalam bounds parent (.player-shell). Klik biasa
  // (tanpa gerak) tetap toggle "More"; kalau digeser >6px dianggap drag,
  // bukan klik.
  const handlePointerMove = useCallback((e) => {
    const d = dragRef.current
    if (!d) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) movedRef.current = true

    const parent = rootRef.current?.offsetParent
    const bounds = parent ? parent.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight }
    const size = 56 // kira-kira lebar/tinggi bubble+margin aman
    const nextX = Math.min(Math.max(d.originX + dx, 8), Math.max(bounds.width - size, 8))
    const nextY = Math.min(Math.max(d.originY + dy, 8), Math.max(bounds.height - size, 8))
    setPos({ x: nextX, y: nextY })
  }, [])

  const handlePointerUp = useCallback(() => {
    dragRef.current = null
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
  }, [handlePointerMove])

  const handlePointerDown = useCallback((e) => {
    const el = rootRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const parent = el.offsetParent
    const parentRect = parent ? parent.getBoundingClientRect() : { left: 0, top: 0 }
    movedRef.current = false
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: pos.x != null ? pos.x : rect.left - parentRect.left,
      originY: pos.y != null ? pos.y : rect.top - parentRect.top,
    }
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }, [pos, handlePointerMove, handlePointerUp])

  // Tutup menu "More" kalau klik di luar bubble, atau saat window blur.
  useEffect(() => {
    if (!open) return
    const onDocPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    window.addEventListener('pointerdown', onDocPointerDown)
    return () => window.removeEventListener('pointerdown', onDocPointerDown)
  }, [open])

  useEffect(() => {
    if (!isFocused) setOpen(false)
  }, [isFocused])

  const handleMoreClick = () => {
    if (movedRef.current) return // itu drag, bukan klik
    setOpen((v) => !v)
  }

  const style = pos.x != null ? { left: pos.x, top: pos.y, right: 'auto', bottom: 'auto' } : undefined

  return (
    <div ref={rootRef} className="floating-controls" style={style}>
      {open && (
        <div className="floating-menu" role="menu">
          <button
            className="floating-menu-item"
            onClick={onOpenSettings}
            role="menuitem"
          >⚙️ Settings</button>

          <button
            className={`floating-menu-item ${isExporting ? 'is-busy' : ''}`}
            onClick={onExport}
            disabled={isExporting}
            role="menuitem"
          >⟳ {isExporting ? 'Exporting…' : 'Export'}</button>

          <a
            className={`floating-menu-item ${canDownload ? '' : 'is-disabled'}`}
            href={canDownload ? downloadHref : '#'}
            download={canDownload ? downloadName : false}
            onClick={(e) => !canDownload && e.preventDefault()}
            role="menuitem"
          >⬇ Download</a>

          <button
            className="floating-menu-item"
            onClick={onCopyCaption}
            role="menuitem"
          >{copiedCaption ? '✓ Copied!' : '📋 Copy caption'}</button>
        </div>
      )}

      <button
        className={`floating-btn floating-play ${isPaused ? 'paused' : 'playing'}`}
        onClick={onTogglePlay}
        disabled={!isFocused}
        title={!isFocused ? 'Focus window ini dulu' : (isPaused ? 'Play' : 'Pause')}
        aria-label={isPaused ? 'Play' : 'Pause'}
      >
        {isPaused ? '▶' : '⏸'}
      </button>

      <button
        className={`floating-btn floating-more ${open ? 'is-open' : ''}`}
        onPointerDown={handlePointerDown}
        onClick={handleMoreClick}
        title="More (drag untuk pindah)"
        aria-label="More actions"
        aria-expanded={open}
      >
        {isExporting ? <span className="floating-spin">⟳</span> : '⋯'}
      </button>
    </div>
  )
}
