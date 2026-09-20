// src/components/workspace/WindowDock.jsx
// Dock berisi window terbuka + minimized (PLAN-19 §5, §7.3 "minimize all").
import React from 'react'
import { useWorkspace } from './WorkspaceContext'
import './workspace.css'

export default function WindowDock() {
  const { windows, order, minimizeWindow, focusWindow, cascadeWindows, tileWindows } = useWorkspace()

  if (order.length === 0) return null

  const handleMinimizeAll = () => {
    order.forEach((id) => {
      if (windows[id].mode !== 'minimized') minimizeWindow(id)
    })
  }

  return (
    <div className="window-dock">
      {order.map((id) => {
        const w = windows[id]
        return (
          <button
            key={id}
            className={`dock-item ${w.mode === 'minimized' ? 'is-minimized' : ''} ${w.isFocused ? 'is-active' : ''}`}
            onClick={() => focusWindow(id)}
            title={w.title}
          >
            {w.title}
            {w.playerState === 'exporting' && <span className="dock-export-badge" title="Exporting…">⟳</span>}
          </button>
        )
      })}
      <button className="dock-item dock-minimize-all" onClick={handleMinimizeAll} title="Minimize all">
        Minimize all
      </button>
      <button className="dock-item" onClick={cascadeWindows} title="Susun cascade">
        Cascade
      </button>
      <button className="dock-item" onClick={tileWindows} title="Susun grid/tile">
        Tile
      </button>
    </div>
  )
}
