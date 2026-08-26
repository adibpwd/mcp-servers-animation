import React, { useState, useEffect, Suspense, lazy } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { STATUS, STATUS_META, fetchContentItem, saveItemChanges } from '../data/contentManagement'
import { CONTENT_REGISTRY } from '../content/registry'
import './ContentPreview.css'

export default function ContentPreview() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [item, setItem] = useState(null)
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  // Fetch item detail from API on mount
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      const result = await fetchContentItem(id)
      if (result.success && result.item) {
        setItem(result.item)
        setStatus(result.item.status)
        setPriority(result.item.priority)
      } else {
        setError(result.error || 'Konten tidak ditemukan')
      }
      setLoading(false)
    }
    load()
  }, [id])

  const handleBack = () => {
    navigate('/content-management')
    window.scrollTo(0, 0)
  }

  const handleSave = async () => {
    setSaving(true)
    const result = await saveItemChanges(item.id, { status, priority })
    setSaving(false)

    if (result.success) {
      // Sync local item state with saved values
      setItem(prev => ({ ...prev, status, priority }))
    } else {
      alert('Gagal menyimpan: ' + (result.error || 'Unknown error'))
    }
  }

  const handlePriorityUp = () => setPriority(prev => Math.max(1, prev - 1))
  const handlePriorityDown = () => setPriority(prev => prev + 1)

  const handlePriorityInput = (e) => {
    const val = e.target.value
    if (val === '' || /^\d+$/.test(val)) {
      const num = parseInt(val, 10)
      if (!isNaN(num)) setPriority(Math.max(1, Math.min(100, num)))
    }
  }

  if (loading) {
    return (
      <div className="content-preview">
        <div className="preview-loading-full">
          <div className="loading-spinner" />
          <span>Memuat data konten...</span>
        </div>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="content-preview">
        <div className="preview-error">
          <h2>{error || 'Konten tidak ditemukan'}</h2>
          <button onClick={handleBack}>← Back to Management</button>
        </div>
      </div>
    )
  }

  const registryItem = CONTENT_REGISTRY.find(c => c.id === id)
  const AnimationComponent = registryItem ? lazy(registryItem.component) : null

  const hasChanges = status !== item.status || priority !== item.priority

  return (
    <div className="content-preview">
      {/* Top Bar */}
      <div className="preview-topbar">
        <button className="back-btn" onClick={handleBack}>
          ← Back to Management
        </button>

        <div className="preview-info">
          <span className="preview-category">{item.category}</span>
          <span className="preview-title">{item.title}</span>
        </div>

        <button
          className={`save-btn ${saving ? 'saving' : ''} ${hasChanges ? 'has-changes' : ''}`}
          onClick={handleSave}
          disabled={saving || !hasChanges}
        >
          {saving ? 'Menyimpan...' : hasChanges ? 'Simpan Perubahan' : 'Tersimpan ✓'}
        </button>
      </div>

      {/* Animation Preview */}
      <div className="preview-canvas">
        {AnimationComponent ? (
          <Suspense fallback={
            <div className="preview-loading">
              <div className="loading-spinner" />
              <span>Loading animation...</span>
            </div>
          }>
            <AnimationComponent
              paused={false}
              speed={1.0}
              volume={75}
              previewSfx={true}
            />
          </Suspense>
        ) : (
          <div className="preview-unavailable">
            <p>Preview animasi belum tersedia untuk konten ini.</p>
          </div>
        )}
      </div>

      {/* Controls Panel */}
      <div className="preview-controls">
        <div className="control-group">
          <label className="control-label">Status</label>
          <select
            className="status-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ color: STATUS_META[status]?.color }}
          >
            <option value={STATUS.DRAFT}>{STATUS_META.draft.label}</option>
            <option value={STATUS.READY}>{STATUS_META.ready.label}</option>
            <option value={STATUS.POSTED}>{STATUS_META.posted.label}</option>
          </select>
        </div>

        <div className="control-group">
          <label className="control-label">Priority</label>
          <div className="priority-control">
            <button className="priority-btn" onClick={handlePriorityUp}>▲</button>
            <input
              type="text"
              className="priority-input"
              value={priority}
              onChange={handlePriorityInput}
              maxLength={3}
            />
            <button className="priority-btn" onClick={handlePriorityDown}>▼</button>
          </div>
        </div>

        <div className="control-group">
          <label className="control-label">Subtitle</label>
          <p className="control-text">{item.subtitle}</p>
        </div>

        <div className="control-group">
          <label className="control-label">Tags</label>
          <div className="control-tags">
            {item.tags.map((tag, i) => (
              <span key={i} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

