import React, { useState } from 'react'
import { STATUS, STATUS_META, getItemsByStatus } from '../../data/contentManagement'

export default function KanbanView({ items, onItemClick, onStatusChange }) {
  const [draggedItem, setDraggedItem] = useState(null)
  const [dragOverColumn, setDragOverColumn] = useState(null)

  const columns = [
    { id: STATUS.DRAFT, title: 'DRAFT', items: getItemsByStatus(items, STATUS.DRAFT) },
    { id: STATUS.READY, title: 'READY TO POST', items: getItemsByStatus(items, STATUS.READY) },
    { id: STATUS.POSTED, title: 'POSTED', items: getItemsByStatus(items, STATUS.POSTED) },
  ]

  const handleDragStart = (e, item) => {
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverColumn(null)
  }

  const handleDragOver = (e, columnId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumn(columnId)
  }

  const handleDragLeave = (e) => {
    // Only clear if leaving the column entirely
    if (e.currentTarget.contains(e.relatedTarget)) return
    setDragOverColumn(null)
  }

  const handleDrop = (e, columnId) => {
    e.preventDefault()
    setDragOverColumn(null)

    if (draggedItem && draggedItem.status !== columnId) {
      // Status changed - save to API
      onStatusChange(draggedItem.id, columnId)
    }

    setDraggedItem(null)
  }

  return (
    <div className="kanban-view">
      {columns.map((column) => {
        const statusMeta = STATUS_META[column.id]
        const isOver = dragOverColumn === column.id
        const isDragging = draggedItem !== null

        return (
          <div
            key={column.id}
            className={`kanban-column ${isOver ? 'drag-over' : ''}`}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div 
              className="column-header"
              style={{ borderColor: statusMeta.color }}
            >
              <h3 className="column-title" style={{ color: statusMeta.color }}>
                {column.title}
              </h3>
              <span className="column-count">{column.items.length}</span>
            </div>

            {/* Column Content */}
            <div className="column-content">
              {column.items.length === 0 ? (
                <div className="column-empty">
                  {isDragging ? 'Drop here' : 'No items'}
                </div>
              ) : (
                column.items.map((item) => (
                  <div
                    key={item.id}
                    className={`kanban-card ${draggedItem?.id === item.id ? 'dragging' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    onDragEnd={handleDragEnd}
                    onClick={() => onItemClick(item.id)}
                  >
                    {/* Card Header */}
                    <div className="card-header">
                      <div 
                        className="card-color-dot" 
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="card-priority">
                        <span className="priority-label">Pri</span>
                        <span className="priority-value">{item.priority}</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="card-body">
                      <h4 className="card-title">{item.title}</h4>
                      <p className="card-subtitle">{item.subtitle}</p>
                    </div>

                    {/* Card Footer */}
                    <div className="card-footer">
                      <span className="card-category">{item.category}</span>
                      <div className="card-tags">
                        {item.tags.slice(0, 2).map((tag, i) => (
                          <span key={i} className="card-tag">{tag}</span>
                        ))}
                        {item.tags.length > 2 && (
                          <span className="card-tag-more">+{item.tags.length - 2}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
