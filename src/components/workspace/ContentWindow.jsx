// src/components/workspace/ContentWindow.jsx
// ─────────────────────────────────────────────────────────────
// PLAN-19 Phase 1 — window chrome untuk satu content.
// Resolve topic + render PlayerShell di dalam window.
// Isolasi lifecycle player penuh (audio/timeline scoped) baru Phase 2.
// ─────────────────────────────────────────────────────────────
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useWorkspace } from './WorkspaceContext'
import { useWindowDragResize } from '../../hooks/useWindowDragResize'
import { resolveTopicById } from '../../content/resolveTopic'
import { fetchContentItem } from '../../data/contentManagement'
import { PlayerShell } from '../PlayerShell'
import WindowErrorBoundary from './WindowErrorBoundary'
import './workspace.css'

const NARROW_VIEWPORT = 768
// Magic lamp / Genie GNOME effect parameters:
// Deformasi 3D kurva lampu jin: Scale Y menyusut lebih lambat daripada Scale X,
// ditambah 3D perspective + skew rotasi lentur (meniru cairan/kain keluar dari lampu).
const FLY_IN_DURATION = 460
const FLY_OUT_DURATION = 380
const FLY_IN_EASE = 'cubic-bezier(0.2, 0.8, 0.25, 1)'
const FLY_OUT_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)'

const STATUS_DOT = {
  loading: '#f5a623',
  ready: '#3ddc84',
  unavailable: '#8a8f98',
  error: '#ff5c5c',
}

export default function ContentWindow({ record }) {
  const { focusWindow, closeWindow, minimizeWindow, maximizeWindow, restoreWindow, setWindowStatus, setPlayerState, moveWindow, resizeWindow } = useWorkspace()
  const { windowId, contentId, rect, mode, zIndex, isFocused } = record
  const [content, setContent] = useState(null)
  const [displayStatus, setDisplayStatus] = useState('loading')
  const [isNarrow, setIsNarrow] = useState(() => window.innerWidth < NARROW_VIEWPORT)
  const [isMinimizing, setIsMinimizing] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const animRef = useRef(null) // ref ke Web Animation yang sedang jalan
  const justMountedRef = useRef(true)
  const prevModeRef = useRef(mode)
  const isMinimized = mode === 'minimized'

  const { onHeaderPointerDown, onResizePointerDown, windowRef } = useWindowDragResize({
    rect,
    mode,
    disabled: isNarrow,
    onMove: (x, y) => moveWindow(windowId, x, y),
    onResize: (width, height) => resizeWindow(windowId, width, height),
  })

  // Bounding rect icon dock punya content ini (id: dock-item-<contentId>)
  const getDockRect = useCallback(() => {
    const el = document.getElementById(`dock-item-${contentId}`)
    if (!el) return null
    return el.getBoundingClientRect()
  }, [contentId])

  const cancelFly = useCallback(() => {
    if (animRef.current) {
      animRef.current.cancel()
      animRef.current = null
    }
  }, [])

  const cleanTransform = useCallback((el) => {
    el.style.transform = ''
    el.style.opacity = ''
    el.style.transformOrigin = ''
  }, [])

  // Fly-in dari satu rect asal (dock icon / tile grid) ke posisi normal window (Genie Magic Lamp).
  const flyInFromRect = useCallback((originRect, onDone) => {
    const el = windowRef.current
    if (!el) return
    cancelFly()

    const target = el.getBoundingClientRect()
    const o = originRect || { ...target }
    const scaleX = Math.max(0.02, (o.width || 48) / target.width)
    const scaleY = Math.max(0.02, (o.height || 48) / target.height)
    const tx = (o.left + (o.width || 48) / 2) - (target.left + target.width / 2)
    const ty = (o.top + (o.height || 48) / 2) - (target.top + target.height / 2)

    // Arah lengkungan kurva jin (jika dock di kiri vs kanan)
    const curveSign = tx > 0 ? -1 : 1
    const bendSkew = Math.min(Math.max((tx / window.innerWidth) * 22, -18), 18)

    // Transform-origin diatur ke arah titik dock
    el.style.transformOrigin = `${50 + (tx / target.width) * 40}% bottom`
    el.style.opacity = '0'
    setIsRestoring(true)

    animRef.current = el.animate(
      [
        // 1. Di dalam dock icon: pipih, melengkung tajam ke bawah
        {
          transform: `perspective(900px) translate3d(${tx}px, ${ty}px, -200px) scale(${scaleX}, ${scaleY * 0.4}) skewX(${bendSkew * 1.4}deg) rotateX(45deg)`,
          opacity: 0,
          filter: 'blur(4px)',
          offset: 0,
        },
        // 2. Muncrat/keluar lampu jin (25%): memanjang ke atas dulu (Scale Y lebih cepat naik dari Scale X, efek corong)
        {
          transform: `perspective(900px) translate3d(${tx * 0.72}px, ${ty * 0.55}px, -80px) scale(${scaleX * 2.2}, ${scaleY + 0.35}) skewX(${bendSkew}deg) rotateX(25deg)`,
          opacity: 0.75,
          filter: 'blur(1.5px)',
          offset: 0.28,
        },
        // 3. Melebar horizontal (65%): mulai mengembang ke ukuran asli sambil lurus
        {
          transform: `perspective(900px) translate3d(${tx * 0.18}px, ${ty * 0.12}px, -15px) scale(0.92, 1.04) skewX(${bendSkew * 0.2}deg) rotateX(6deg)`,
          opacity: 0.96,
          filter: 'blur(0px)',
          offset: 0.68,
        },
        // 4. Mendarat sempurna di viewport
        {
          transform: 'perspective(900px) translate3d(0, 0, 0) scale(1, 1) skewX(0deg) rotateX(0deg)',
          opacity: 1,
          filter: 'blur(0px)',
          offset: 1,
        },
      ],
      { duration: FLY_IN_DURATION, easing: FLY_IN_EASE, fill: 'both' }
    )
    animRef.current.onfinish = () => {
      animRef.current = null
      cleanTransform(el)
      setIsRestoring(false)
      onDone?.()
    }
  }, [cancelFly, cleanTransform, windowRef])

  // Responsive single-window stack (PLAN-19 §7.3 / §12.3.4): di viewport
  // sempit, window dipaksa full-screen dan drag/resize bebas dimatikan.
  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < NARROW_VIEWPORT)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Restore (minimized → normal): terbang masuk dari icon dock.
  useEffect(() => {
    const prev = prevModeRef.current
    prevModeRef.current = mode

    if (prev === 'minimized' && mode !== 'minimized' && !isMinimizing) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => flyInFromRect(getDockRect()))
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, flyInFromRect, getDockRect, isMinimizing])

  // Buka pertama kali (dari dock / grid / whisker): tumbuh dari asal klik.
  useEffect(() => {
    if (!justMountedRef.current || mode === 'minimized') return
    justMountedRef.current = false
    const origin = record.openOrigin || getDockRect()
    if (origin) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => flyInFromRect(origin))
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Cleanup animasi saat unmount.
  useEffect(() => () => cancelFly(), [cancelFly])

  // Minimize → window tersedot masuk ke icon dock (Genie Magic Lamp).
  const handleMinimize = () => {
    if (isMinimizing || isMinimized) return
    const el = windowRef.current
    if (!el) return
    cancelFly()

    const start = el.getBoundingClientRect()
    const dock = getDockRect() || {
      left: window.innerWidth / 2 - 24,
      top: window.innerHeight - 72,
      width: 48,
      height: 48,
    }
    const scaleX = Math.max(0.02, dock.width / start.width)
    const scaleY = Math.max(0.02, dock.height / start.height)
    const tx = (dock.left + dock.width / 2) - (start.left + start.width / 2)
    const ty = (dock.top + dock.height / 2) - (start.top + start.height / 2)

    const bendSkew = Math.min(Math.max((tx / window.innerWidth) * 22, -18), 18)

    el.style.transformOrigin = `${50 + (tx / start.width) * 40}% bottom`
    setIsMinimizing(true)

    animRef.current = el.animate(
      [
        // 1. Posisi normal
        {
          transform: 'perspective(900px) translate3d(0, 0, 0) scale(1, 1) skewX(0deg) rotateX(0deg)',
          opacity: 1,
          filter: 'blur(0px)',
          offset: 0,
        },
        // 2. Mulai terhisap ke bawah: bagian bawah menyempit, skew mengarah ke dock icon
        {
          transform: `perspective(900px) translate3d(${tx * 0.35}px, ${ty * 0.25}px, -40px) scale(0.85, 0.92) skewX(${bendSkew * 0.6}deg) rotateX(15deg)`,
          opacity: 0.95,
          filter: 'blur(0.5px)',
          offset: 0.35,
        },
        // 3. Masuk corong/pipa sedot: memanjang vertikal sambil mengecil horizontal
        {
          transform: `perspective(900px) translate3d(${tx * 0.82}px, ${ty * 0.72}px, -120px) scale(${scaleX * 1.8}, ${scaleY + 0.2}) skewX(${bendSkew}deg) rotateX(32deg)`,
          opacity: 0.6,
          filter: 'blur(2px)',
          offset: 0.78,
        },
        // 4. Masuk ke dalam lampu jin (titik dock)
        {
          transform: `perspective(900px) translate3d(${tx}px, ${ty}px, -200px) scale(${scaleX}, ${scaleY * 0.3}) skewX(${bendSkew * 1.4}deg) rotateX(45deg)`,
          opacity: 0,
          filter: 'blur(4px)',
          offset: 1,
        },
      ],
      { duration: FLY_OUT_DURATION, easing: FLY_OUT_EASE, fill: 'forwards' }
    )
    animRef.current.onfinish = () => {
      animRef.current = null
      cleanTransform(el)
      setIsMinimizing(false)
      minimizeWindow(windowId)
    }
  }

  // Resolve topic — sama pola dengan PlayerPage.jsx, tapi window-scoped
  // dan tidak melakukan navigate() karena ini bukan route.
  useEffect(() => {
    let isMounted = true
    const resolved = resolveTopicById(contentId)

    if (resolved) {
      if (resolved.hasAnimation) {
        setContent({ ...resolved.meta, component: resolved.component })
        setDisplayStatus('ready')
        setWindowStatus(windowId, 'ready', resolved.meta?.title)
      } else {
        setContent(resolved.meta)
        setDisplayStatus('unavailable')
        setWindowStatus(windowId, 'unavailable', resolved.meta?.title)
      }
      fetchContentItem(contentId).then((res) => {
        if (isMounted && res.success && res.item) {
          setContent((prev) => ({ ...res.item, ...prev, component: prev?.component || resolved.component }))
        }
      })
    } else {
      fetchContentItem(contentId).then((res) => {
        if (!isMounted) return
        if (res.success && res.item) {
          setContent(res.item)
          setDisplayStatus('unavailable')
          setWindowStatus(windowId, 'unavailable', res.item?.title)
        } else {
          setDisplayStatus('error')
          setWindowStatus(windowId, 'error')
        }
      })
    }
    return () => { isMounted = false }
  }, [contentId, windowId, setWindowStatus])

  const handleClose = () => {
    if (record.playerState === 'exporting') {
      const ok = window.confirm('Export sedang berjalan untuk window ini. Tutup window tetap?')
      if (!ok) return
    }
    closeWindow(windowId)
  }

  const style = (mode === 'maximized' || isNarrow)
    ? { left: 0, top: 0, width: '100%', height: '100%', zIndex }
    : { left: rect.x, top: rect.y, width: rect.width, height: rect.height, zIndex }

  return (
    <div
      ref={windowRef}
      className={`content-window ${isFocused ? 'is-focused' : ''} ${mode === 'maximized' ? 'is-maximized' : ''} ${isMinimized && !isMinimizing ? 'is-hidden' : ''} ${isMinimizing ? 'is-minimizing' : ''} ${isRestoring ? 'is-restoring' : ''}`}
      style={style}
      onMouseDown={() => !isFocused && focusWindow(windowId)}
      role="dialog"
      aria-label={content?.title || contentId}
    >
      <div
        className="window-header"
        onPointerDown={onHeaderPointerDown}
        onDoubleClick={() => (mode === 'maximized' ? restoreWindow(windowId) : maximizeWindow(windowId))}
      >
        <span className="window-status-dot" style={{ backgroundColor: STATUS_DOT[displayStatus] }} />
        <div className="window-title-group">
          <span className="window-title">
            {record.folderNumber && <span className="window-number">{record.folderNumber} </span>}
            {content?.title || contentId}
          </span>
          <span className="window-subtitle">{contentId}</span>
        </div>
        <div className="window-controls traffic-lights">
          <button className="window-btn dot minimize" title="Minimize" aria-label="Minimize window" onClick={handleMinimize}>
            <span className="dot-glyph">—</span>
          </button>
          <button
            className="window-btn dot maximize"
            title={mode === 'maximized' ? 'Restore' : 'Maximize'}
            aria-label={mode === 'maximized' ? 'Restore window' : 'Maximize window'}
            onClick={() => (mode === 'maximized' ? restoreWindow(windowId) : maximizeWindow(windowId))}
          >
            <span className="dot-glyph">{mode === 'maximized' ? '❐' : '+'}</span>
          </button>
          <button className="window-btn dot close" title="Close" aria-label="Close window" onClick={handleClose}>
            <span className="dot-glyph">×</span>
          </button>
        </div>
      </div>

      <div className="window-body">
        {displayStatus === 'loading' && (
          <div className="window-state window-loading">
            <div className="cm-spinner" />
            <span>Memuat content…</span>
          </div>
        )}

        {displayStatus === 'unavailable' && (
          <div className="window-state window-unavailable">
            <h4>Preview belum tersedia</h4>
            <p>{content?.title}</p>
            <p className="hint">Metadata sudah ada, tapi Animation.jsx untuk topic ini belum dibuat.</p>
          </div>
        )}

        {displayStatus === 'error' && (
          <div className="window-state window-error">
            <h4>Content tidak ditemukan</h4>
            <p>ID: {contentId}</p>
          </div>
        )}

        {displayStatus === 'ready' && content && (
          <WindowErrorBoundary
            windowId={windowId}
            title={content?.title}
            onError={() => setWindowStatus(windowId, 'error')}
          >
            <PlayerShell
              content={content}
              onBack={handleClose}
              isFocused={isFocused && !isMinimized}
              onPlayerStateChange={(playerState) => setPlayerState(windowId, playerState)}
              onContentUpdate={(updated) => setContent((prev) => ({ ...prev, ...updated }))}
              windowed
            />
          </WindowErrorBoundary>
        )}
      </div>

      {mode !== 'maximized' && !isNarrow && (
        <>
          <div className="window-resize-edge edge-e" onPointerDown={(e) => onResizePointerDown(e, 'e')} />
          <div className="window-resize-edge edge-s" onPointerDown={(e) => onResizePointerDown(e, 's')} />
          <div className="window-resize-handle edge-se" onPointerDown={(e) => onResizePointerDown(e, 'se')} />
        </>
      )}
    </div>
  )
}
