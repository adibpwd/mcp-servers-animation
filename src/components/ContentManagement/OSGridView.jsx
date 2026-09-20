// src/components/ContentManagement/OSGridView.jsx
// ─────────────────────────────────────────────────────────────
// iOS / macOS Launchpad style grid untuk mode "OS Desktop".
// Menampilkan seluruh content item sebagai App Cards ber-squircle
// dengan warna berdasarkan STATUS (draft=abu-abu, ready=blue,
// posted=green), shine effect, dan running dot.
// ─────────────────────────────────────────────────────────────
import React, { useMemo } from 'react'
import { resolveTopicById } from '../../content/resolveTopic'
import { useWorkspace } from '../workspace/WorkspaceContext'
import { STATUS_META } from '../../data/contentManagement'
import './OSGridView.css'

// Warna ikon mengikuti status content, bukan kategori:
// draft → abu-abu (silver), ready → biru, posted → hijau.
const STATUS_THEMES = {
  draft: {
    bg: 'linear-gradient(135deg, #94a3b8, #64748b)',
    accent: '#94a3b8',
    shadow: 'rgba(148, 163, 184, 0.3)',
  },
  ready: {
    bg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    accent: '#3b82f6',
    shadow: 'rgba(59, 130, 246, 0.35)',
  },
  posted: {
    bg: 'linear-gradient(135deg, #22c55e, #15803d)',
    accent: '#22c55e',
    shadow: 'rgba(34, 197, 94, 0.35)',
  },
}

export default function OSGridView({ items, windows, onOpenWindow }) {
  const { pinnedIds, togglePin } = useWorkspace()

  // Group items by category (biar grid tetap terstruktur rapi)
  const categorized = useMemo(() => {
    const map = {}
    items.forEach((item) => {
      const cat = item.category || 'Linux Fundamentals'
      if (!map[cat]) map[cat] = []
      map[cat].push(item)
    })
    return map
  }, [items])

  return (
    <div className="os-grid-view">
      {/* Header section */}
      <div className="os-grid-header">
        <h1 className="os-grid-main-title">Animation Library</h1>
        <p className="os-grid-subtitle">Interaktif & Visualisasi Konsep Software Engineering.</p>
        {/* Legend status warna */}
        <div className="os-status-legend">
          <span className="os-legend-item">
            <i className="os-legend-dot" style={{ background: '#94a3b8' }} /> Draft
          </span>
          <span className="os-legend-item">
            <i className="os-legend-dot" style={{ background: '#3b82f6' }} /> Ready to Post
          </span>
          <span className="os-legend-item">
            <i className="os-legend-dot" style={{ background: '#22c55e' }} /> Posted
          </span>
        </div>
      </div>

      {Object.entries(categorized).map(([category, catItems], catIndex) => {
        return (
          <section key={category} className="os-category-group">
            <div className="os-category-title-bar">
              <h2 className="os-category-name">{category}</h2>
              <span className="os-category-badge">{catIndex + 1}</span>
              <span className="os-category-item-count">{catItems.length} items</span>
            </div>

            <div className="os-app-grid">
              {catItems.map((item) => {
                const windowId = `content:${item.id}`
                const openWindow = windows[windowId]
                const isRunning = !!openWindow
                const isPinned = pinnedIds.includes(item.id)

                const resolved = resolveTopicById(item.id)
                const folderNumber = item.folderNumber || resolved?.meta?.folderNumber || `${item.priority}`.padStart(2, '0')

                const statusKey = item.status === 'ready' || item.status === 'posted' ? item.status : 'draft'
                const theme = STATUS_THEMES[statusKey]
                const statusMeta = STATUS_META[statusKey]

                const handleContextMenu = (e) => {
                  e.preventDefault()
                  togglePin(item.id)
                }

                return (
                  <div
                    key={item.id}
                    className={`os-app-card ${isRunning ? 'is-running' : ''}`}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      onOpenWindow(item.id, { originRect: rect })
                    }}
                    onContextMenu={handleContextMenu}
                    title={`${folderNumber} ${item.title}\nStatus: ${statusMeta?.label || 'Draft'}\n(Right-click to ${isPinned ? 'unpin from' : 'pin to'} dock)`}
                  >
                    <div className="os-icon-wrapper">
                      {/* App Icon Squircle dengan Shine Effect + Warna Status */}
                      <div
                        className="app-icon os-icon-squircle"
                        style={{
                          background: theme.bg,
                          '--theme-shadow': theme.shadow,
                          '--status-accent': theme.accent,
                        }}
                      >
                        <span className="os-folder-number">{folderNumber}</span>
                        <span className="os-tag-label">{item.tags?.[0] || 'TOPIC'}</span>
                      </div>

                      {/* Status Badge (READY / POSTED) */}
                      {statusKey === 'ready' && (
                        <div className="os-badge status-ready" title="Ready to Post">
                          <span>READY</span>
                        </div>
                      )}

                      {statusKey === 'posted' && (
                        <div className="os-badge status-posted" title="Posted">
                          <svg className="os-badge-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}

                      {isPinned && (
                        <div className="os-badge status-pinned" title="Pinned to Dock">
                          📌
                        </div>
                      )}
                    </div>

                    {/* App Title & Status Label */}
                    <div className="os-app-info">
                      <p className="os-app-title">{item.title}</p>
                      <p
                        className="os-app-status"
                        style={{ color: theme.accent }}
                      >
                        {statusMeta?.label || 'Draft'}
                      </p>
                    </div>

                    {/* Running Dot Indicator */}
                    {isRunning && <div className="os-running-dot" />}
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
