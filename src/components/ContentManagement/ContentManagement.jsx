import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ListView from './ListView'
import KanbanView from './KanbanView'
import { 
  sortByPriority, 
  updateItemPriority, 
  updateItemStatus,
  fetchContentList,
  saveItemChanges 
} from '../../data/contentManagement'
import './ContentManagement.css'

export default function ContentManagement() {
  const [view, setView] = useState('list')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Fetch all items from API on mount
  useEffect(() => {
    const loadItems = async () => {
      setLoading(true)
      setError(null)
      const result = await fetchContentList()
      if (result.success) {
        setItems(result.items) // Already sorted by API
      } else {
        setError('Gagal memuat data dari server. Pastikan server berjalan.')
      }
      setLoading(false)
    }
    loadItems()
  }, [])

  // Handle priority update → update local state + save API
  const handlePriorityChange = async (itemId, newPriority) => {
    // Optimistic update local state
    setItems(prev => sortByPriority(updateItemPriority(prev, itemId, newPriority)))
    // Save to API
    await saveItemChanges(itemId, { priority: newPriority })
  }

  // Handle status update → update local state + save API
  const handleStatusChange = async (itemId, newStatus) => {
    // Optimistic update local state
    setItems(prev => updateItemStatus(prev, itemId, newStatus))
    // Save to API
    await saveItemChanges(itemId, { status: newStatus })
  }

  // Navigate to preview page
  const handleItemClick = (itemId) => {
    navigate(`/preview/${itemId}`)
  }

  if (loading) {
    return (
      <div className="content-management">
        <div className="cm-loading">
          <div className="cm-spinner" />
          <span>Memuat data konten...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="content-management">
        <div className="cm-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Coba Lagi</button>
        </div>
      </div>
    )
  }

  return (
    <div className="content-management">
      {/* Header with View Toggle */}
      <div className="cm-header">
        <div className="cm-title-group">
          <button className="cm-back-btn" onClick={() => navigate('/')}>← Back</button>
          <div className="cm-title">
            <h1>Content Management</h1>
            <p className="cm-subtitle">{items.length} konten · Manage priority & status</p>
          </div>
        </div>

        <div className="view-toggle">
          <button
            className={`view-btn ${view === 'list' ? 'active' : ''}`}
            onClick={() => setView('list')}
          >
            <span className="view-icon">📋</span>
            <span>List</span>
          </button>
          <button
            className={`view-btn ${view === 'kanban' ? 'active' : ''}`}
            onClick={() => setView('kanban')}
          >
            <span className="view-icon">📊</span>
            <span>Kanban</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="cm-content">
        {view === 'list' && (
          <ListView
            items={items}
            onItemClick={handleItemClick}
            onPriorityChange={handlePriorityChange}
          />
        )}

        {view === 'kanban' && (
          <KanbanView
            items={items}
            onItemClick={handleItemClick}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </div>
  )
}
