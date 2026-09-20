// src/components/workspace/WorkspaceSurface.jsx
// Merender seluruh ContentWindow yang sedang terbuka (PLAN-19 §4)
// + keyboard shortcut alternative untuk drag/resize/close (PLAN-19 §12.3.5).
import React, { useEffect } from 'react'
import { useWorkspace } from './WorkspaceContext'
import ContentWindow from './ContentWindow'
import './workspace.css'

const MOVE_STEP = 24
const RESIZE_STEP = 24

export default function WorkspaceSurface() {
  const {
    windows, order, focusedId,
    focusWindow, closeWindow, minimizeWindow, maximizeWindow, restoreWindow,
    moveWindow, resizeWindow,
  } = useWorkspace()

  // Shortcut keyboard (PLAN-19 §12.3.5):
  //   Ctrl/Cmd+W        -> close focused window
  //   Ctrl/Cmd+M        -> minimize focused window
  //   Ctrl/Cmd+Shift+F  -> toggle maximize/restore focused window
  //   Ctrl/Cmd+1..9     -> focus window ke-N (urutan buka)
  //   Alt+Arrow         -> move focused window
  //   Alt+Shift+Arrow   -> resize focused window
  useEffect(() => {
    const isTypingTarget = (el) => {
      if (!el) return false
      const tag = el.tagName
      return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable
    }

    const onKeyDown = (e) => {
      if (isTypingTarget(e.target)) return
      if (order.length === 0) return
      const mod = e.ctrlKey || e.metaKey

      if (mod && (e.key === 'w' || e.key === 'W')) {
        if (focusedId) { e.preventDefault(); closeWindow(focusedId) }
        return
      }
      if (mod && (e.key === 'm' || e.key === 'M')) {
        if (focusedId) { e.preventDefault(); minimizeWindow(focusedId) }
        return
      }
      if (mod && e.shiftKey && (e.key === 'f' || e.key === 'F')) {
        if (focusedId) {
          e.preventDefault()
          const win = windows[focusedId]
          if (win.mode === 'maximized') restoreWindow(focusedId)
          else maximizeWindow(focusedId)
        }
        return
      }
      if (mod && /^[1-9]$/.test(e.key)) {
        const idx = parseInt(e.key, 10) - 1
        if (order[idx]) { e.preventDefault(); focusWindow(order[idx]) }
        return
      }
      if (e.altKey && focusedId && windows[focusedId]?.mode !== 'maximized') {
        const win = windows[focusedId]
        const isResize = e.shiftKey
        const step = isResize ? RESIZE_STEP : MOVE_STEP
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          isResize
            ? resizeWindow(focusedId, Math.max(win.rect.width - step, 280), win.rect.height)
            : moveWindow(focusedId, Math.max(win.rect.x - step, 0), win.rect.y)
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          isResize
            ? resizeWindow(focusedId, win.rect.width + step, win.rect.height)
            : moveWindow(focusedId, win.rect.x + step, win.rect.y)
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          isResize
            ? resizeWindow(focusedId, win.rect.width, Math.max(win.rect.height - step, 200))
            : moveWindow(focusedId, win.rect.x, Math.max(win.rect.y - step, 0))
        } else if (e.key === 'ArrowDown') {
          e.preventDefault()
          isResize
            ? resizeWindow(focusedId, win.rect.width, win.rect.height + step)
            : moveWindow(focusedId, win.rect.x, win.rect.y + step)
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [order, focusedId, windows, focusWindow, closeWindow, minimizeWindow, maximizeWindow, restoreWindow, moveWindow, resizeWindow])

  if (order.length === 0) return null

  return (
    <div className="workspace-surface">
      {order.map((windowId) => (
        <ContentWindow key={windowId} record={windows[windowId]} />
      ))}
    </div>
  )
}
