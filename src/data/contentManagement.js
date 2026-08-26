// src/data/contentManagement.js
// Data model & API helpers for Content Management Dashboard

const API_BASE = 'http://100.78.186.122:3000'

// Status enum
export const STATUS = {
  DRAFT: 'draft',
  READY: 'ready',
  POSTED: 'posted',
}

// Status metadata
export const STATUS_META = {
  draft: {
    label: 'Draft',
    color: '#64748B',
    bgColor: '#1E293B',
  },
  ready: {
    label: 'Ready to Post',
    color: '#FBBF24',
    bgColor: '#713F12',
  },
  posted: {
    label: 'Posted',
    color: '#34D399',
    bgColor: '#064E3B',
  },
}

// Helper: Sort items by priority (ascending)
export const sortByPriority = (items) => {
  return [...items].sort((a, b) => a.priority - b.priority)
}

// Helper: Get items by status
export const getItemsByStatus = (items, status) => {
  return items.filter(item => item.status === status)
}

// Helper: Update item priority (local state mutation)
export const updateItemPriority = (items, itemId, newPriority) => {
  return items.map(item =>
    item.id === itemId
      ? { ...item, priority: Math.max(1, Math.min(100, newPriority)) }
      : item
  )
}

// Helper: Update item status (local state mutation)
export const updateItemStatus = (items, itemId, newStatus) => {
  return items.map(item =>
    item.id === itemId
      ? { ...item, status: newStatus }
      : item
  )
}

// ── API Calls ─────────────────────────────────────────────────

// GET /api/content - Fetch all items from server
export const fetchContentList = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/content`)
    const data = await res.json()
    if (!data.ok) throw new Error(data.error || 'Failed to fetch')
    return { success: true, items: data.items }
  } catch (err) {
    console.error('[ContentAPI] fetchContentList failed:', err.message)
    return { success: false, items: [], error: err.message }
  }
}

// GET /api/content/:id - Fetch single item from server
export const fetchContentItem = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/api/content/${id}`)
    const data = await res.json()
    if (!data.ok) throw new Error(data.error || 'Failed to fetch')
    return { success: true, item: data.item }
  } catch (err) {
    console.error(`[ContentAPI] fetchContentItem(${id}) failed:`, err.message)
    return { success: false, item: null, error: err.message }
  }
}

// POST /api/content/:id - Save status and/or priority to server
export const saveItemChanges = async (itemId, updates) => {
  try {
    const res = await fetch(`${API_BASE}/api/content/${itemId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    const data = await res.json()
    if (!data.ok) throw new Error(data.error || 'Failed to save')
    return { success: true, item: data.item }
  } catch (err) {
    console.error(`[ContentAPI] saveItemChanges(${itemId}) failed:`, err.message)
    return { success: false, error: err.message }
  }
}

