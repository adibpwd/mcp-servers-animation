// src/components/workspace/ContentWindow.jsx
// ─────────────────────────────────────────────────────────────
// PLAN-19 Phase 1 — window chrome untuk satu content.
// Resolve topic + render PlayerShell di dalam window.
// Isolasi lifecycle player penuh (audio/timeline scoped) baru Phase 2.
// ─────────────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react'
import { useWorkspace } from './WorkspaceContext'
import { useWindowDragResize } from '../../hooks/useWindowDragResize'
import { resolveTopicById } from '../../content/resolveTopic'
import { fetchContentItem } from '../../data/contentManagement'
import { PlayerShell } from '../PlayerShell'
import WindowErrorBoundary from './WindowErrorBoundary'
import './workspace.css'

const NARROW_VIEWPORT = 768

const STATUS_DOT = {
  loading: '#f5a623',
  ready: '#3ddc84',
  unavailable: '#8a8f98',
  error: '#ff5c5c',
}

export default function ContentWindow({ record }) {
  const { focusWindow, closeWindow, minimizeWindow, maximizeWindow, restoreWindow, setWindowStatus, setPlayerState, moveWindow, resizeWindow } = useWorkspace()
  const [content, setContent] = useState(null)
  const [displayStatus, setDisplayStatus] = useState('loading')
  const [isNarrow, setIsNarrow] = useState(() => window.innerWidth < NARROW_VIEWPORT)

  const { windowId, contentId, rect, mode, zIndex, isFocused } = record
  const isMinimized = mode === 'minimized'

  // Responsive single-window stack (PLAN-19 §7.3 / §12.3.4): di viewport
  // sempit, window dipaksa full-screen dan drag/resize bebas dimatikan.
  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < NARROW_VIEWPORT)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const { onHeaderPointerDown, onResizePointerDown, windowRef } = useWindowDragResize({
    rect,
    mode,
    disabled: isNarrow,
    onMove: (x, y) => moveWindow(windowId, x, y),
    onResize: (width, height) => resizeWindow(windowId, width, height),
  })

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
      className={`content-window ${isFocused ? 'is-focused' : ''} ${mode === 'maximized' ? 'is-maximized' : ''} ${isMinimized ? 'is-hidden' : ''}`}
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
          <button className="window-btn dot minimize" title="Minimize" aria-label="Minimize window" onClick={() => minimizeWindow(windowId)}>
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
