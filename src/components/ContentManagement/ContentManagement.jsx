import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ListView from './ListView'
import KanbanView from './KanbanView'
import OSGridView from './OSGridView'
import { 
  sortByPriority, 
  updateItemPriority, 
  updateItemStatus,
  fetchContentList, 
  saveItemChanges 
} from '../../data/contentManagement'
import { WorkspaceProvider, useWorkspace } from '../workspace/WorkspaceContext'
import WorkspaceSurface from '../workspace/WorkspaceSurface'
import MacOSDock from '../workspace/MacOSDock'
import { resolveTopicById } from '../../content/resolveTopic'
import { useToast } from '../ToastNotification'
import './ContentManagement.css'

// PLAN-19 §9.3 — batas jumlah content pada deep link (align dengan
// MAX_RESTORED_WINDOWS di WorkspaceContext).
const MAX_DEEP_LINK_WINDOWS = 10

export default function ContentManagement() {
  return (
    <WorkspaceProvider>
      <ContentManagementInner />
    </WorkspaceProvider>
  )
}

function ContentManagementInner() {
  const [view, setView] = useState(() => {
    try {
      return window.localStorage.getItem('cm_view_mode') || 'os'
    } catch (_) {
      return 'os'
    }
  })
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [openNowOnly, setOpenNowOnly] = useState(false)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { windows, order, focusedId, openContent, focusWindow, syncPinnedFromServer, hydrated } = useWorkspace()
  const { showToast } = useToast()
  const deepLinkAppliedRef = useRef(false)

  const handleSetView = (newView) => {
    setView(newView)
    try {
      window.localStorage.setItem('cm_view_mode', newView)
    } catch (_) {}
  }

  // Fetch all items from API on mount
  useEffect(() => {
    const loadItems = async () => {
      setLoading(true)
      setError(null)
      const result = await fetchContentList()
      if (result.success) {
        setItems(result.items) // Already sorted by API
        // Hentikan sync pertama saat bukan device pertama (source of truth server)
        syncPinnedFromServer(result.items)
      } else {
        setError('Gagal memuat data dari server. Pastikan server berjalan.')
      }
      setLoading(false)
    }
    loadItems()
  }, [syncPinnedFromServer])

  // PLAN-19 §9.3 / Phase 4.4 — deep link `/?open=id1,id2&focus=id2`.
  // Dijalankan sekali setelah items ter-load dan workspace ter-hydrate,
  // supaya tidak menimpa layout yang sudah dipulihkan dari localStorage
  // dan supaya validasi id memakai daftar item yang benar-benar ada.
  useEffect(() => {
    if (deepLinkAppliedRef.current) return
    if (loading || !hydrated) return
    if (items.length === 0) return

    const openParam = searchParams.get('open')
    if (!openParam) {
      deepLinkAppliedRef.current = true
      return
    }

    const validIds = new Set(items.map((i) => i.id))
    const requestedIds = openParam
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id && validIds.has(id))
      .slice(0, MAX_DEEP_LINK_WINDOWS)

    requestedIds.forEach((id) => {
      const item = items.find((i) => i.id === id)
      const resolved = resolveTopicById(id)
      openContent(id, item?.title, resolved?.meta?.folderNumber)
    })

    const focusParam = searchParams.get('focus')
    if (focusParam && requestedIds.includes(focusParam)) {
      focusWindow(`content:${focusParam}`)
    }

    deepLinkAppliedRef.current = true
  }, [loading, hydrated, items, searchParams, openContent, focusWindow])

  // Filter list/kanban berdasar search query + toggle "open now" (Phase 4.2).
  const filteredItems = useMemo(() => {
    let result = items

    const query = searchQuery.trim().toLowerCase()
    if (query) {
      result = result.filter((item) => {
        const haystack = [
          item.title,
          item.subtitle,
          item.category,
          item.id,
          ...(item.tags || []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return haystack.includes(query)
      })
    }

    if (openNowOnly) {
      result = result.filter((item) => Boolean(windows[`content:${item.id}`]))
    }

    return result
  }, [items, searchQuery, openNowOnly, windows])

  // Share workspace saat ini sebagai link (Phase 4.4 — fitur eksplisit,
  // bukan otomatis, sesuai PLAN-19 §9.3).
  const handleCopyWorkspaceLink = async () => {
    if (order.length === 0) return
    const openIds = order.map((windowId) => windows[windowId].contentId)
    const params = new URLSearchParams()
    params.set('open', openIds.slice(0, MAX_DEEP_LINK_WINDOWS).join(','))
    if (focusedId && windows[focusedId]) {
      params.set('focus', windows[focusedId].contentId)
    }
    setSearchParams(params, { replace: true })
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`
    try {
      await navigator.clipboard.writeText(url)
      showToast('Link workspace disalin ke clipboard', '🔗')
    } catch (err) {
      console.warn('[ContentManagement] Gagal copy ke clipboard, link tetap di URL bar.', err)
    }
  }

  // Handle priority update → update local state + save API
  const handlePriorityChange = async (itemId, newPriority) => {
    const item = items.find((i) => i.id === itemId)
    // Optimistic update local state
    setItems(prev => sortByPriority(updateItemPriority(prev, itemId, newPriority)))
    showToast(`Priority '${item?.title || itemId}' diubah ke ${newPriority}`, '🔢')
    // Save to API
    await saveItemChanges(itemId, { priority: newPriority })
  }

  // Handle status update → update local state + save API
  const handleStatusChange = async (itemId, newStatus) => {
    const item = items.find((i) => i.id === itemId)
    const statusIcons = { draft: '📝', ready: '⭐', posted: '✅' }
    const statusLabels = { draft: 'Draft', ready: 'Ready to Post', posted: 'Posted' }
    // Optimistic update local state
    setItems(prev => updateItemStatus(prev, itemId, newStatus))
    showToast(`Status '${item?.title || itemId}' diubah ke ${statusLabels[newStatus] || newStatus}`, statusIcons[newStatus] || '✅')
    // Save to API
    await saveItemChanges(itemId, { status: newStatus })
  }

  // Buka content sebagai window internal (PLAN-19).
  // Direct route /preview/:id tetap ada & dipakai handleQuickPreview/bookmark.
  const handleOpenWindow = (itemId, options) => {
    const item = items.find((i) => i.id === itemId)
    const resolved = resolveTopicById(itemId)
    openContent(itemId, item?.title, resolved?.meta?.folderNumber, options?.originRect)
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
          <div className="cm-title">
            <h1>Content Management</h1>
            <p className="cm-subtitle">{items.length} konten · Manage priority & status</p>
          </div>
          <button
            className="cm-history-btn"
            onClick={() => navigate('/export-history')}
            title="View export history"
          >
            📋 History
          </button>
        </div>

        <div className="view-toggle">
          <button
            className={`view-btn ${view === 'os' ? 'active' : ''}`}
            onClick={() => handleSetView('os')}
            title="OS Desktop (Launchpad & macOS Dock)"
          >
            <span className="view-icon">💻</span>
            <span>OS Desktop</span>
          </button>
          <button
            className={`view-btn ${view === 'list' ? 'active' : ''}`}
            onClick={() => handleSetView('list')}
          >
            <span className="view-icon">📋</span>
            <span>List</span>
          </button>
          <button
            className={`view-btn ${view === 'kanban' ? 'active' : ''}`}
            onClick={() => handleSetView('kanban')}
          >
            <span className="view-icon">📊</span>
            <span>Kanban</span>
          </button>
        </div>
      </div>

      {/* Search / filter toolbar — Phase 4.2 */}
      <div className="cm-toolbar">
        <div className="cm-search-wrapper">
          <span className="cm-search-icon">🔍</span>
          <input
            type="text"
            className="cm-search-input"
            placeholder="Cari title, subtitle, category, atau tag…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="cm-search-clear"
              onClick={() => setSearchQuery('')}
              title="Bersihkan pencarian"
            >
              ✕
            </button>
          )}
        </div>

        <button
          className={`cm-filter-chip ${openNowOnly ? 'active' : ''}`}
          onClick={() => setOpenNowOnly((v) => !v)}
          title="Tampilkan hanya content yang sedang punya window terbuka"
        >
          <span className="cm-filter-dot" />
          Open now {order.length > 0 ? `(${order.length})` : ''}
        </button>

        <button
          className="cm-share-btn"
          onClick={handleCopyWorkspaceLink}
          disabled={order.length === 0}
          title={order.length === 0 ? 'Buka minimal satu window dulu' : 'Copy link workspace saat ini'}
        >
          🔗 Copy workspace link
        </button>

        <span className="cm-result-count">
          {filteredItems.length} dari {items.length} konten
        </span>
      </div>

      {/* Main Content Area */}
      <div className="cm-content">
        {view === 'os' && (
          <OSGridView
            items={filteredItems}
            windows={windows}
            onOpenWindow={handleOpenWindow}
          />
        )}

        {view === 'list' && (
          <ListView
            items={filteredItems}
            windows={windows}
            onOpenWindow={handleOpenWindow}
            onPriorityChange={handlePriorityChange}
          />
        )}

        {view === 'kanban' && (
          <KanbanView
            items={filteredItems}
            windows={windows}
            onOpenWindow={handleOpenWindow}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>

      <WorkspaceSurface />
      <MacOSDock />
    </div>
  )
}
