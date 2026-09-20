import React, { useState } from 'react'
import { STATUS_META } from '../../data/contentManagement'

// Phase 4.3 — open-state indicator. windows = map dari useWorkspace().
function getOpenState(windows, itemId) {
  const win = windows?.[`content:${itemId}`]
  if (!win) return null
  if (win.isFocused) return { label: 'Focused', mode: 'focused' }
  if (win.mode === 'minimized') return { label: 'Minimized', mode: 'minimized' }
  return { label: 'Open', mode: 'open' }
}

export default function ListView({ items, windows, onOpenWindow, onPriorityChange }) {
  const [editingId, setEditingId] = useState(null)
  const [inputValue, setInputValue] = useState('')

  const handlePriorityUp = (item) => {
    const newPriority = Math.max(1, item.priority - 1)
    onPriorityChange(item.id, newPriority)
  }

  const handlePriorityDown = (item) => {
    const newPriority = item.priority + 1
    onPriorityChange(item.id, newPriority)
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    // Only allow numeric input
    if (value === '' || /^\d+$/.test(value)) {
      setInputValue(value)
    }
  }

  const handleInputBlur = (itemId) => {
    if (inputValue !== '') {
      const numValue = parseInt(inputValue, 10)
      const clampedValue = Math.max(1, Math.min(100, numValue))
      onPriorityChange(itemId, clampedValue)
    }
    setEditingId(null)
    setInputValue('')
  }

  const handleInputKeyDown = (e, itemId) => {
    if (e.key === 'Enter') {
      handleInputBlur(itemId)
    } else if (e.key === 'Escape') {
      setEditingId(null)
      setInputValue('')
    }
  }

  const handleInputClick = (item) => {
    setEditingId(item.id)
    setInputValue(item.priority.toString())
  }

  return (
    <div className="list-view">
      <table className="list-table">
        <thead>
          <tr>
            <th className="col-priority">Priority</th>
            <th className="col-title">Title</th>
            <th className="col-status">Status</th>
            <th className="col-category">Category</th>
            <th className="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const statusMeta = STATUS_META[item.status]
            const isEditing = editingId === item.id
            const openState = getOpenState(windows, item.id)

            return (
              <tr key={item.id} className="list-row">
                <td className="col-priority">
                  <div className="priority-controls" onClick={(e) => e.stopPropagation()}>
                    <div className="priority-buttons">
                      <button 
                        className="priority-btn up"
                        onClick={() => handlePriorityUp(item)}
                        title="Increase priority (move up)"
                      >
                        ▲
                      </button>
                      <button 
                        className="priority-btn down"
                        onClick={() => handlePriorityDown(item)}
                        title="Decrease priority (move down)"
                      >
                        ▼
                      </button>
                    </div>
                    <div className="priority-input-wrapper">
                      {isEditing ? (
                        <input
                          type="text"
                          className="priority-input editing"
                          value={inputValue}
                          onChange={handleInputChange}
                          onBlur={() => handleInputBlur(item.id)}
                          onKeyDown={(e) => handleInputKeyDown(e, item.id)}
                          autoFocus
                          maxLength={3}
                        />
                      ) : (
                        <input
                          type="text"
                          className="priority-input"
                          value={item.priority}
                          onClick={() => handleInputClick(item)}
                          readOnly
                        />
                      )}
                    </div>
                  </div>
                </td>

                <td className="col-title">
                  <div className="title-content">
                    <div 
                      className="title-color-dot" 
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="title-text">
                      <div className="title-main">
                        {item.title}
                        {openState && (
                          <span className={`open-state-badge is-${openState.mode}`} title={`Window: ${openState.label}`}>
                            <span className="open-state-dot" /> {openState.label}
                          </span>
                        )}
                      </div>
                      <div className="title-subtitle">{item.subtitle}</div>
                    </div>
                  </div>
                </td>

                <td className="col-status">
                  <span 
                    className="status-badge"
                    style={{ 
                      color: statusMeta.color,
                      backgroundColor: statusMeta.bgColor 
                    }}
                  >
                    {statusMeta.label}
                  </span>
                </td>

                <td className="col-category">
                  <span className="category-text">{item.category}</span>
                </td>

                <td className="col-actions">
                  <button
                    className={`open-window-btn ${openState ? 'is-open' : ''}`}
                    onClick={() => onOpenWindow(item.id)}
                    title={openState ? `Fokuskan window (${openState.label})` : 'Buka dalam window'}
                  >
                    {openState ? (openState.mode === 'minimized' ? 'Restore window' : 'Focus window') : 'Open window'}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
