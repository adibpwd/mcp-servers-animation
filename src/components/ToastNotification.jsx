// src/components/ToastNotification.jsx
// ─────────────────────────────────────────────────────────────
// Toast Notification Context & Provider untuk feedback visual instan.
// ─────────────────────────────────────────────────────────────
import React, { createContext, useContext, useState, useCallback } from 'react'
import './ToastNotification.css'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, icon = '✅', duration = 2800) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 4)
    setToasts((prev) => [...prev, { id, message, icon, exiting: false }])

    setTimeout(() => {
      // Mark exiting for animation
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
      )
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 200)
    }, duration)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast: addToast }}>
      {children}
      <div className="toast-container" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-item ${toast.exiting ? 'toast-exiting' : ''}`}
          >
            <span className="toast-icon">{toast.icon}</span>
            <span className="toast-message">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    // Safe fallback jika dipanggil di luar ToastProvider
    return { showToast: (msg, icon) => console.log(`[Toast] ${icon} ${msg}`) }
  }
  return ctx
}
