// src/components/workspace/WorkspaceContext.jsx
// ─────────────────────────────────────────────────────────────
// PLAN-19 Phase 1 — Workspace foundation.
// State store untuk dashboard windowed content management.
// Fase 1: open/focus/close/minimize + z-index + persistence dasar.
// Drag/resize/tile nyata ditambahkan di Phase 3 (lihat PLAN-19 §12.3).
// ─────────────────────────────────────────────────────────────
import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react'
import { saveItemChanges } from '../../data/contentManagement'
import { useToast } from '../ToastNotification'

const WorkspaceContext = createContext(null)

const STORAGE_KEY = 'content-workspace:v1'
const PINNED_STORAGE_KEY = 'content-workspace:pinned-v2'
const MAX_RESTORED_WINDOWS = 10
// Default portrait, mirip layar HP (feel "scroll sosmed") — user bisa
// resize bebas kalau mau landscape/desktop-size (lihat useWindowDragResize.js).
const DEFAULT_SIZE = { width: 390, height: 760 }
const CASCADE_STEP = 32
const MIN_WIDTH_SAFE = 280
const MIN_HEIGHT_SAFE = 200

function defaultRectFor(index) {
  const offset = (index % 8) * CASCADE_STEP
  return {
    x: 80 + offset,
    y: 60 + offset,
    width: DEFAULT_SIZE.width,
    height: DEFAULT_SIZE.height,
  }
}

const initialState = {
  windows: {}, // windowId -> WindowRecord
  order: [], // windowId[] urutan buka (dipakai utk dock)
  pinnedIds: [], // contentId[] yang di-pin ke dock (urut by pinnedAt)
  pinnedMeta: {}, // contentId -> { pinnedAt: ISO }
  focusedId: null,
  nextZ: 1,
  hydrated: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE': {
      const { pinnedIds, pinnedMeta } = action.payload
      const meta = pinnedMeta || {}
      return {
        ...state,
        ...action.payload,
        pinnedIds: Array.isArray(pinnedIds) ? pinnedIds : [],
        pinnedMeta: meta,
        hydrated: true,
      }
    }

    case 'TOGGLE_PIN': {
      const { contentId, pinnedAt } = action.payload
      const isPinned = state.pinnedIds.includes(contentId)
      let nextPinned = []
      let nextMeta = { ...state.pinnedMeta }
      if (isPinned) {
        nextPinned = state.pinnedIds.filter((id) => id !== contentId)
        delete nextMeta[contentId]
      } else {
        nextPinned = [...state.pinnedIds, contentId]
        nextMeta[contentId] = { pinnedAt: pinnedAt || new Date().toISOString() }
      }
      return { ...state, pinnedIds: nextPinned, pinnedMeta: nextMeta }
    }

    case 'PIN_ITEM': {
      const { contentId, pinnedAt } = action.payload
      if (state.pinnedIds.includes(contentId)) return state
      return {
        ...state,
        pinnedIds: [...state.pinnedIds, contentId],
        pinnedMeta: {
          ...state.pinnedMeta,
          [contentId]: { pinnedAt: pinnedAt || new Date().toISOString() },
        },
      }
    }

    case 'UNPIN_ITEM': {
      const { contentId } = action.payload
      const nextMeta = { ...state.pinnedMeta }
      delete nextMeta[contentId]
      return {
        ...state,
        pinnedIds: state.pinnedIds.filter((id) => id !== contentId),
        pinnedMeta: nextMeta,
      }
    }

    case 'SYNC_PINNED_FROM_SERVER': {
      // Merge server + lokal (union): pin server urut by pinnedAt
      // duluan, pin lokal-only (belum ada di server) menyusul.
      const serverPinned = action.payload.serverPinned // Map<contentId, { pinnedAt }>
      const localOnly = state.pinnedIds.filter((id) => !serverPinned.has(id))
      const localSorted = [...localOnly].sort((a, b) => {
        const at = (id) => state.pinnedMeta[id]?.pinnedAt || Date.now()
        return at(a) - at(b)
      })
      const serverSorted = Array.from(serverPinned.entries())
        .sort((a, b) => (a[1]?.pinnedAt || 0) - (b[1]?.pinnedAt || 0))
        .map(([id]) => id)
      const ids = [...serverSorted, ...localSorted]
      const meta = { ...state.pinnedMeta }
      for (const [id, info] of serverPinned.entries()) {
        meta[id] = { pinnedAt: info?.pinnedAt || meta[id]?.pinnedAt || new Date().toISOString() }
      }
      if (JSON.stringify(state.pinnedIds) === JSON.stringify(ids) &&
          JSON.stringify(state.pinnedMeta) === JSON.stringify(meta)) return state
      return { ...state, pinnedIds: ids, pinnedMeta: meta }
    }

    case 'OPEN_CONTENT': {
      const { contentId, title, folderNumber, originRect } = action.payload
      const windowId = `content:${contentId}`
      const existing = state.windows[windowId]

      const stringTitle = typeof title === 'string' ? title : (title?.title || contentId)

      if (existing) {
        // Sudah terbuka -> fokuskan, jangan duplikat (PLAN-19 §5.1)
        return focusWindowInState(state, windowId)
      }

      const z = state.nextZ
      const index = state.order.length
      const record = {
        windowId,
        contentId,
        title: stringTitle,
        folderNumber: folderNumber || null,
        openOrigin: originRect || null,
        status: 'loading',
        rect: defaultRectFor(index),
        mode: 'normal',
        zIndex: z,
        isFocused: true,
        playerState: 'paused',
        openedAt: Date.now(),
        lastFocusedAt: Date.now(),
      }

      const windows = { ...state.windows }
      // Unfocus semua window lain
      for (const id in windows) windows[id] = { ...windows[id], isFocused: false }
      windows[windowId] = record

      return {
        ...state,
        windows,
        order: [...state.order, windowId],
        focusedId: windowId,
        nextZ: z + 1,
      }
    }

    case 'FOCUS_WINDOW':
      return focusWindowInState(state, action.payload.windowId)

    case 'CLOSE_WINDOW': {
      const { windowId } = action.payload
      if (!state.windows[windowId]) return state
      const windows = { ...state.windows }
      delete windows[windowId]
      const order = state.order.filter((id) => id !== windowId)
      const focusedId = state.focusedId === windowId
        ? (order[order.length - 1] || null)
        : state.focusedId
      return { ...state, windows, order, focusedId }
    }

    case 'MINIMIZE_WINDOW': {
      const { windowId } = action.payload
      const win = state.windows[windowId]
      if (!win) return state
      const windows = {
        ...state.windows,
        [windowId]: { ...win, mode: 'minimized', isFocused: false },
      }
      const focusedId = state.focusedId === windowId ? null : state.focusedId
      return { ...state, windows, focusedId }
    }

    case 'MAXIMIZE_WINDOW': {
      const { windowId } = action.payload
      const win = state.windows[windowId]
      if (!win) return state
      const next = focusWindowInState(state, windowId)
      next.windows[windowId] = {
        ...next.windows[windowId],
        mode: 'maximized',
        preMaximizeRect: win.mode === 'maximized' ? win.preMaximizeRect : win.rect,
      }
      return next
    }

    case 'RESTORE_WINDOW': {
      const { windowId } = action.payload
      const win = state.windows[windowId]
      if (!win) return state
      const next = focusWindowInState(state, windowId)
      next.windows[windowId] = {
        ...next.windows[windowId],
        mode: 'normal',
        rect: win.preMaximizeRect || win.rect,
      }
      return next
    }

    case 'MOVE_WINDOW': {
      const { windowId, x, y } = action.payload
      const win = state.windows[windowId]
      if (!win || win.mode === 'maximized') return state
      return {
        ...state,
        windows: { ...state.windows, [windowId]: { ...win, rect: { ...win.rect, x, y } } },
      }
    }

    case 'RESIZE_WINDOW': {
      const { windowId, width, height } = action.payload
      const win = state.windows[windowId]
      if (!win || win.mode === 'maximized') return state
      return {
        ...state,
        windows: { ...state.windows, [windowId]: { ...win, rect: { ...win.rect, width, height } } },
      }
    }

    case 'SET_STATUS': {
      const { windowId, status, title } = action.payload
      const win = state.windows[windowId]
      if (!win) return state
      return {
        ...state,
        windows: {
          ...state.windows,
          [windowId]: { ...win, status, title: title ?? win.title },
        },
      }
    }

    case 'SET_PLAYER_STATE': {
      // playerState: 'paused' | 'playing' | 'exporting' (PLAN-19 §5.1, §8, §10)
      const { windowId, playerState } = action.payload
      const win = state.windows[windowId]
      if (!win || win.playerState === playerState) return state
      return {
        ...state,
        windows: { ...state.windows, [windowId]: { ...win, playerState } },
      }
    }

    case 'CASCADE_WINDOWS': {
      // PLAN-19 §7.3 "Cascade" — susun ulang window normal (skip minimized).
      const windows = { ...state.windows }
      let idx = 0
      state.order.forEach((id) => {
        if (windows[id].mode === 'minimized') return
        windows[id] = { ...windows[id], mode: 'normal', rect: defaultRectFor(idx) }
        idx += 1
      })
      return { ...state, windows }
    }

    case 'TILE_WINDOWS': {
      // PLAN-19 §7.3 "Tile" — grid otomatis (1/2/3/4+ kolom) untuk window
      // yang sedang normal/maximized (minimized dilewati, tetap di dock).
      const targetIds = state.order.filter((id) => state.windows[id].mode !== 'minimized')
      const n = targetIds.length
      if (n === 0) return state
      const cols = n === 1 ? 1 : n <= 4 ? 2 : 3
      const rows = Math.ceil(n / cols)
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1280
      const vh = typeof window !== 'undefined' ? (window.innerHeight - 48) : 760 // sisakan ruang dock
      const cellW = Math.floor(vw / cols)
      const cellH = Math.floor(vh / rows)
      const windows = { ...state.windows }
      targetIds.forEach((id, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        windows[id] = {
          ...windows[id],
          mode: 'normal',
          rect: {
            x: col * cellW,
            y: row * cellH,
            width: Math.max(cellW - 8, MIN_WIDTH_SAFE),
            height: Math.max(cellH - 8, MIN_HEIGHT_SAFE),
          },
        }
      })
      return { ...state, windows }
    }

    default:
      return state
  }
}

function focusWindowInState(state, windowId) {
  const win = state.windows[windowId]
  if (!win) return state
  const z = state.nextZ
  const windows = { ...state.windows }
  for (const id in windows) windows[id] = { ...windows[id], isFocused: id === windowId }
  windows[windowId] = {
    ...windows[windowId],
    mode: windows[windowId].mode === 'minimized' ? 'normal' : windows[windowId].mode,
    zIndex: z,
    lastFocusedAt: Date.now(),
  }
  return { ...state, windows, focusedId: windowId, nextZ: z + 1 }
}

function loadPersisted() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.windows)) return null
    return parsed
  } catch (err) {
    console.warn('[Workspace] Gagal membaca layout tersimpan, pakai default.', err)
    return null
  }
}

function clampRect(rect) {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  const width = Math.min(rect.width || DEFAULT_SIZE.width, vw)
  const height = Math.min(rect.height || DEFAULT_SIZE.height, vh)
  const x = Math.min(Math.max(rect.x || 0, 0), Math.max(vw - width, 0))
  const y = Math.min(Math.max(rect.y || 0, 0), Math.max(vh - height, 0))
  return { x, y, width, height }
}

const PINNED_STORAGE_KEY_V1 = 'content-workspace:pinned-v1'

// Baca pin tersimpan dengan migrasi v1 -> v2:
//  - v1: localStorage key 'content-workspace:pinned-v1' berisi array id polos.
//  - v2: key 'content-workspace:pinned-v2' berisi array { contentId, pinnedAt }.
function loadPersistedPins() {
  try {
    const rawV2 = window.localStorage.getItem(PINNED_STORAGE_KEY)
    if (rawV2) {
      const parsed = JSON.parse(rawV2)
      if (Array.isArray(parsed)) return parsed
    }
    const rawV1 = window.localStorage.getItem(PINNED_STORAGE_KEY_V1)
    if (rawV1) {
      const parsed = JSON.parse(rawV1)
      if (Array.isArray(parsed)) {
        const now = new Date().toISOString()
        return parsed.map((id) => ({ contentId: String(id), pinnedAt: now }))
      }
    }
  } catch (_) {}
  return []
}

export function WorkspaceProvider({ children }) {
  const [state, dispatch] = useReducer(workspaceReducer, initialState, initWorkspaceState)
  const persistTimer = useRef(null)
  const { showToast } = useToast()

  // Hydration sekali saat mount (PLAN-19 §9.2)
  useEffect(() => {
    const persisted = loadPersisted()
    const savedPins = loadPersistedPins()
    const initialPinned = savedPins.map((p) => p.contentId)
    const initialMeta = {}
    for (const p of savedPins) {
      if (p.contentId) initialMeta[p.contentId] = { pinnedAt: p.pinnedAt || new Date().toISOString() }
    }
    const basePayload = { ...initialState, pinnedIds: initialPinned, pinnedMeta: initialMeta, hydrated: true }

    if (!persisted) {
      dispatch({ type: 'HYDRATE', payload: basePayload })
      return
    }
    const trimmed = persisted.windows.slice(0, MAX_RESTORED_WINDOWS)
    const windows = {}
    const order = []
    let z = 1
    trimmed.forEach((w, idx) => {
      if (!w || !w.contentId) return
      const windowId = `content:${w.contentId}`
      windows[windowId] = {
        windowId,
        contentId: w.contentId,
        title: w.title || w.contentId,
        folderNumber: w.folderNumber || null,
        status: 'loading',
        rect: clampRect(w.rect || defaultRectFor(idx)),
        mode: w.mode === 'minimized' || w.mode === 'maximized' ? w.mode : 'normal',
        zIndex: idx + 1,
        isFocused: false,
        playerState: 'paused',
        openedAt: Date.now(),
        lastFocusedAt: w.lastFocusedAt || Date.now(),
        preMaximizeRect: w.preMaximizeRect || null,
      }
      order.push(windowId)
      z = idx + 2
    })
    const focusedId = persisted.focusedId && windows[persisted.focusedId] ? persisted.focusedId : null
    if (focusedId) windows[focusedId] = { ...windows[focusedId], isFocused: true }
    dispatch({
      type: 'HYDRATE',
      payload: {
        windows,
        order,
        pinnedIds: initialPinned,
        pinnedMeta: initialMeta,
        focusedId,
        nextZ: z,
        hydrated: true,
      },
    })
  }, [])

  // Persist ke localStorage dengan debounce ringan (PLAN-19 §9.1)
  useEffect(() => {
    if (!state.hydrated) return
    if (persistTimer.current) clearTimeout(persistTimer.current)
    persistTimer.current = setTimeout(() => {
      try {
        const payload = {
          version: 1,
          focusedId: state.focusedId,
          windows: state.order.map((id) => {
            const w = state.windows[id]
            return {
              contentId: w.contentId,
              title: w.title,
              folderNumber: w.folderNumber,
              rect: w.rect,
              mode: w.mode,
              preMaximizeRect: w.preMaximizeRect || null,
              lastFocusedAt: w.lastFocusedAt,
            }
          }),
        }
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
        window.localStorage.setItem(
          PINNED_STORAGE_KEY,
          JSON.stringify(state.pinnedIds.map((id) => ({
            contentId: id,
            pinnedAt: state.pinnedMeta[id]?.pinnedAt || new Date().toISOString(),
          })))
        )
        // Setelah sukses persist v2, hapus key v1 lama supaya tidak bermigrasi ulang.
        try { window.localStorage.removeItem(PINNED_STORAGE_KEY_V1) } catch (_) {}
      } catch (err) {
        console.warn('[Workspace] Gagal menyimpan layout.', err)
      }
    }, 300)
    return () => clearTimeout(persistTimer.current)
  }, [state])

  const openContent = useCallback((contentId, title, folderNumber, originRect) => {
    dispatch({ type: 'OPEN_CONTENT', payload: { contentId, title, folderNumber, originRect: originRect || null } })
  }, [])
  const focusWindow = useCallback((windowId) => dispatch({ type: 'FOCUS_WINDOW', payload: { windowId } }), [])
  const closeWindow = useCallback((windowId) => dispatch({ type: 'CLOSE_WINDOW', payload: { windowId } }), [])
  const minimizeWindow = useCallback((windowId) => dispatch({ type: 'MINIMIZE_WINDOW', payload: { windowId } }), [])
  const maximizeWindow = useCallback((windowId) => dispatch({ type: 'MAXIMIZE_WINDOW', payload: { windowId } }), [])
  const restoreWindow = useCallback((windowId) => dispatch({ type: 'RESTORE_WINDOW', payload: { windowId } }), [])

  // Ref untuk membaca state pin terbaru di dalam callback (tanpa memecah useCallback deps).
  const pinnedIdsRef = useRef(state.pinnedIds)
  useEffect(() => { pinnedIdsRef.current = state.pinnedIds }, [state.pinnedIds])

  // Pin/unpin selalu: (1) update state lokal optimis, (2) persist ke server
  // (metadata.json) supaya dock sama di device mana pun, (3) rollback state
  // kalau simpan kegagal.
  const persistPinToServer = useCallback(async (contentId, isPinned) => {
    const result = await saveItemChanges(contentId, { pinned: isPinned, pinnedAt: isPinned ? new Date().toISOString() : undefined })
    if (!result.success) {
      // Rollback: balikkan ke kondisi sebelumnya dari server/state lama
      dispatch({ type: isPinned ? 'UNPIN_ITEM' : 'PIN_ITEM', payload: { contentId } })
      console.warn(`[Workspace] Gagal sync pin '${contentId}' ke server:`, result.error)
    }
  }, [])

  const togglePin = useCallback((contentId) => {
    const isPinned = pinnedIdsRef.current.includes(contentId)
    dispatch({ type: 'TOGGLE_PIN', payload: { contentId, pinnedAt: isPinned ? undefined : new Date().toISOString() } })
    persistPinToServer(contentId, !isPinned)
    showToast(isPinned ? `'${contentId}' dilepas dari Dock` : `'${contentId}' dipin ke Dock`, isPinned ? '📍' : '📌')
  }, [persistPinToServer, showToast])

  const pinItem = useCallback((contentId) => {
    if (pinnedIdsRef.current.includes(contentId)) return
    dispatch({ type: 'PIN_ITEM', payload: { contentId, pinnedAt: new Date().toISOString() } })
    persistPinToServer(contentId, true)
    showToast(`'${contentId}' dipin ke Dock`, '📌')
  }, [persistPinToServer, showToast])

  const unpinItem = useCallback((contentId) => {
    if (!pinnedIdsRef.current.includes(contentId)) return
    dispatch({ type: 'UNPIN_ITEM', payload: { contentId } })
    persistPinToServer(contentId, false)
    showToast(`'${contentId}' dilepas dari Dock`, '📍')
  }, [persistPinToServer, showToast])

  const syncPinnedFromServer = useCallback((items) => {
    const serverPinned = new Map()
    for (const item of items) {
      if (item?.pinned) {
        serverPinned.set(item.id, { pinnedAt: item.pinnedAt || new Date().toISOString() })
      }
    }
    dispatch({ type: 'SYNC_PINNED_FROM_SERVER', payload: { serverPinned } })
  }, [])

  const setWindowStatus = useCallback((windowId, status, title) => {
    dispatch({ type: 'SET_STATUS', payload: { windowId, status, title } })
  }, [])
  const setPlayerState = useCallback((windowId, playerState) => {
    dispatch({ type: 'SET_PLAYER_STATE', payload: { windowId, playerState } })
  }, [])
  const moveWindow = useCallback((windowId, x, y) => dispatch({ type: 'MOVE_WINDOW', payload: { windowId, x, y } }), [])
  const resizeWindow = useCallback((windowId, width, height) => dispatch({ type: 'RESIZE_WINDOW', payload: { windowId, width, height } }), [])
  // Tile & cascade nyata — PLAN-19 §12.3 (Phase 3).
  const tileWindows = useCallback(() => dispatch({ type: 'TILE_WINDOWS' }), [])
  const cascadeWindows = useCallback(() => dispatch({ type: 'CASCADE_WINDOWS' }), [])

  const value = {
    windows: state.windows,
    order: state.order,
    pinnedIds: state.pinnedIds,
    pinnedMeta: state.pinnedMeta,
    focusedId: state.focusedId,
    hydrated: state.hydrated,
    openContent,
    focusWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    togglePin,
    pinItem,
    unpinItem,
    syncPinnedFromServer,
    setWindowStatus,
    setPlayerState,
    moveWindow,
    resizeWindow,
    tileWindows,
    cascadeWindows,
  }

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) {
    throw new Error('useWorkspace harus dipakai di dalam <WorkspaceProvider>')
  }
  return ctx
}
