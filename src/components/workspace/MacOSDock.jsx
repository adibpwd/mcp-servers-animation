// src/components/workspace/MacOSDock.jsx
// ─────────────────────────────────────────────────────────────
// Glassmorphic macOS style dock.
// - Default Item 1: Whisker Menu Launcher button (XFCE Style)
// - Items: Pinned items + Open Windows dengan active dots
// - Context menu untuk Pin/Unpin, Minimize, Restore, Close
// ─────────────────────────────────────────────────────────────
import React, { useState, useEffect, useRef } from 'react'
import { useWorkspace } from './WorkspaceContext'
import { resolveTopicById } from '../../content/resolveTopic'
import WhiskerMenu from './WhiskerMenu'
import './workspace.css'

export default function MacOSDock() {
  const {
    windows,
    order,
    pinnedIds,
    focusedId,
    openContent,
    focusWindow,
    minimizeWindow,
    restoreWindow,
    closeWindow,
    togglePin,
  } = useWorkspace()

  const [whiskerOpen, setWhiskerOpen] = useState(false)
  const [contextMenu, setContextMenu] = useState(null)
  const dockRef = useRef(null)

  // Gabungkan pinned items dan active window items menjadi satu list unik
  const activeContentIds = order.map((winId) => windows[winId]?.contentId).filter(Boolean)
  const allDockContentIds = Array.from(new Set([...pinnedIds, ...activeContentIds]))

  // Close context menu on outside click
  useEffect(() => {
    if (!contextMenu) return
    const onDocClick = () => setContextMenu(null)
    window.addEventListener('click', onDocClick)
    return () => window.removeEventListener('click', onDocClick)
  }, [contextMenu])

  const handleDockItemClick = (contentId, windowId, e) => {
    if (contextMenu) setContextMenu(null)

    // Simpan koordinat dock item untuk trigger animasi mekar window (genie)
    const rect = e.currentTarget.getBoundingClientRect()
    window.__lastDockClickRect = rect

    if (windowId && windows[windowId]) {
      const win = windows[windowId]
      if (win.mode === 'minimized') {
        restoreWindow(windowId)
      } else if (win.isFocused) {
        // Jika sudah fokus dan diklik lagi di dock, minimize (perilaku umum)
        minimizeWindow(windowId)
      } else {
        focusWindow(windowId)
      }
    } else {
      // Content belum dibuka -> open window (tumbuh dari icon dock)
      const resolved = resolveTopicById(contentId)
      const title = resolved?.meta?.title || contentId
      const folderNumber = resolved?.meta?.folderNumber || null
      openContent(contentId, title, folderNumber, rect)
    }
  }

  const handleContextMenu = (e, contentId, windowId) => {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    setContextMenu({
      contentId,
      windowId,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    })
  }

  return (
    <>
      <WhiskerMenu
        isOpen={whiskerOpen}
        onClose={() => setWhiskerOpen(false)}
        onOpenContent={(id, title, folderNum) => {
          openContent(id, title, folderNum)
        }}
      />

      <div ref={dockRef} className="macos-dock-container">
        <div className="macos-dock">
          {/* Whisker App Launcher Button */}
          <button
            className={`dock-app-icon dock-whisker-btn ${whiskerOpen ? 'is-active' : ''}`}
            onClick={() => setWhiskerOpen((v) => !v)}
            title="Applications Menu (Whisker Launcher)"
            aria-label="App Launcher"
          >
            <span className="dock-whisker-grid">⊞</span>
            <span className="dock-tooltip">Whisker Menu</span>
          </button>

          <div className="dock-divider" />

          {/* Dock Content Items (Pinned & Open) */}
          {allDockContentIds.map((contentId) => {
            const windowId = `content:${contentId}`
            const win = windows[windowId]
            const isOpen = !!win
            const isMinimized = win?.mode === 'minimized'
            const isFocused = win?.isFocused && !isMinimized
            const isPinned = pinnedIds.includes(contentId)
            const isExporting = win?.playerState === 'exporting'

            const resolved = resolveTopicById(contentId)
            const rawTitle = win?.title || resolved?.meta?.title || contentId
            const displayTitle = typeof rawTitle === 'string' ? rawTitle : (rawTitle?.title || contentId)
            const folderNumber = win?.folderNumber || resolved?.meta?.folderNumber || '··'

            return (
              <div
                key={contentId}
                className="dock-item-wrapper"
                onContextMenu={(e) => handleContextMenu(e, contentId, isOpen ? windowId : null)}
              >
                <button
                  className={`dock-app-icon ${isOpen ? 'is-open' : ''} ${isMinimized ? 'is-minimized' : ''} ${isFocused ? 'is-focused' : ''}`}
                  onClick={(e) => handleDockItemClick(contentId, isOpen ? windowId : null, e)}
                  title={displayTitle}
                  id={`dock-item-${contentId}`}
                >
                  <div className="dock-icon-box">
                    <span className="dock-folder-num">{folderNumber}</span>
                  </div>

                  {isExporting && <span className="dock-export-spin">⟳</span>}

                  <span className="dock-tooltip">
                    {folderNumber && `${folderNumber} `}{displayTitle}
                  </span>
                </button>

                {/* macOS Active Dot Indicator */}
                {isOpen && (
                  <div className={`dock-dot ${isMinimized ? 'is-dimmed' : ''}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Context Menu Popup */}
      {contextMenu && (
        <div
          className="dock-context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="dock-context-header">
            {resolveTopicById(contextMenu.contentId)?.meta?.title || contextMenu.contentId}
          </div>
          
          <button
            className="dock-context-btn"
            onClick={() => {
              togglePin(contextMenu.contentId)
              setContextMenu(null)
            }}
          >
            {pinnedIds.includes(contextMenu.contentId) ? '📌 Unpin from Dock' : '📍 Pin to Dock'}
          </button>

          {contextMenu.windowId && (
            <>
              {windows[contextMenu.windowId]?.mode === 'minimized' ? (
                <button
                  className="dock-context-btn"
                  onClick={() => {
                    restoreWindow(contextMenu.windowId)
                    setContextMenu(null)
                  }}
                >
                  ↗ Restore Window
                </button>
              ) : (
                <button
                  className="dock-context-btn"
                  onClick={() => {
                    minimizeWindow(contextMenu.windowId)
                    setContextMenu(null)
                  }}
                >
                  — Minimize Window
                </button>
              )}

              <div className="dock-context-divider" />

              <button
                className="dock-context-btn is-danger"
                onClick={() => {
                  closeWindow(contextMenu.windowId)
                  setContextMenu(null)
                }}
              >
                ✕ Close Window
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}
