// src/components/workspace/WindowErrorBoundary.jsx
// PLAN-19 §10, §2.3 — error di satu window (mis. dynamic import Animation.jsx
// gagal) tidak boleh meruntuhkan dashboard/window lain.
import React from 'react'

export default class WindowErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error(`[Workspace] Error di window "${this.props.windowId}":`, error, info)
    if (this.props.onError) this.props.onError(error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="window-state window-error">
          <h4>Terjadi error pada window ini</h4>
          <p>{this.props.title || this.props.windowId}</p>
          <p className="hint">Window lain di dashboard tetap berjalan normal.</p>
        </div>
      )
    }
    return this.props.children
  }
}
