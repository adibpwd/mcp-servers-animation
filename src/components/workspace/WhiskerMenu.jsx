// src/components/workspace/WhiskerMenu.jsx
// ─────────────────────────────────────────────────────────────
// Pop-up menu launcher ala XFCE Whisker menu.
// Memiliki search realtime, filter category, dan peluncuran window langsung.
// ─────────────────────────────────────────────────────────────
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { fetchContentList } from '../../data/contentManagement'
import { resolveTopicById } from '../../content/resolveTopic'
import { useWorkspace } from './WorkspaceContext'
import './workspace.css'

export default function WhiskerMenu({ isOpen, onClose, onOpenContent }) {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('All')
  const { windows, pinnedIds, togglePin } = useWorkspace()
  const menuRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    fetchContentList().then((res) => {
      if (res.success && Array.isArray(res.items)) {
        setItems(res.items)
      }
    })
  }, [])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setSearch('')
    }
  }, [isOpen])

  // Close when clicked outside
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && !e.target.closest('.dock-whisker-btn')) {
        onClose()
      }
    }
    window.addEventListener('pointerdown', handleClickOutside)
    return () => window.removeEventListener('pointerdown', handleClickOutside)
  }, [isOpen, onClose])

  const categories = useMemo(() => {
    const set = new Set(['All'])
    items.forEach((item) => {
      if (item.category) set.add(item.category)
    })
    return Array.from(set)
  }, [items])

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((item) => {
      if (selectedCat !== 'All' && item.category !== selectedCat) return false
      if (!q) return true
      const matchTitle = item.title?.toLowerCase().includes(q)
      const matchSubtitle = item.subtitle?.toLowerCase().includes(q)
      const matchId = item.id?.toLowerCase().includes(q)
      const matchTags = item.tags?.some((t) => t.toLowerCase().includes(q))
      return matchTitle || matchSubtitle || matchId || matchTags
    })
  }, [items, search, selectedCat])

  if (!isOpen) return null

  return (
    <div ref={menuRef} className="whisker-menu" role="dialog" aria-label="Whisker App Launcher">
      <div className="whisker-header">
        <div className="whisker-search-box">
          <span className="whisker-search-icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            className="whisker-search-input"
            placeholder="Type to search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="whisker-search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>
      </div>

      <div className="whisker-body">
        {/* Categories sidebar */}
        <div className="whisker-categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`whisker-cat-item ${selectedCat === cat ? 'is-active' : ''}`}
              onClick={() => setSelectedCat(cat)}
            >
              {cat === 'All' ? '🌟 All Items' : cat}
            </button>
          ))}
        </div>

        {/* Items list */}
        <div className="whisker-items-list">
          {filteredItems.length === 0 ? (
            <div className="whisker-empty">No content matching "{search}"</div>
          ) : (
            filteredItems.map((item) => {
              const windowId = `content:${item.id}`
              const isRunning = !!windows[windowId]
              const isPinned = pinnedIds.includes(item.id)
              const resolved = resolveTopicById(item.id)
              const folderNumber = item.folderNumber || resolved?.meta?.folderNumber || `${item.priority}`.padStart(2, '0')

              return (
                <div
                  key={item.id}
                  className={`whisker-item ${isRunning ? 'is-running' : ''}`}
                  onClick={() => {
                    onOpenContent(item.id, item.title, folderNumber)
                    onClose()
                  }}
                >
                  <div className="whisker-item-icon">
                    <span>{folderNumber}</span>
                  </div>
                  <div className="whisker-item-info">
                    <div className="whisker-item-title">
                      {item.title}
                      {isRunning && <span className="whisker-badge-running">Active</span>}
                    </div>
                    <div className="whisker-item-subtitle">{item.subtitle || item.id}</div>
                  </div>
                  <button
                    className={`whisker-pin-btn ${isPinned ? 'is-pinned' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      togglePin(item.id)
                    }}
                    title={isPinned ? 'Unpin from Dock' : 'Pin to Dock'}
                  >
                    {isPinned ? '📌' : '📍'}
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>

      <div className="whisker-footer">
        <span>{filteredItems.length} items found</span>
        <span className="whisker-hint">Esc to close</span>
      </div>
    </div>
  )
}
