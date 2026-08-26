import React from 'react'
import { CONTENT_REGISTRY } from '../content/registry'
import { ContentCard } from './ContentCard'
import './ContentList.css'

export function ContentList({ onSelect, onShowHistory, onManage }) {
  const ready   = CONTENT_REGISTRY.filter(c => c.status === 'ready')
  const coming  = CONTENT_REGISTRY.filter(c => c.status === 'coming-soon')

  return (
    <div className="content-list">

      {/* Header */}
      <header className="list-header">
        <div className="list-brand">
          <span className="brand-dot">●</span>
          <span className="brand-name">AI Explainer</span>
          <button 
            className="history-link"
            onClick={onShowHistory}
            title="View export history"
          >
            📋 History
          </button>
          <button 
            className="manage-link"
            onClick={onManage}
            title="Manage content"
          >
            ⚙️ Manage
          </button>
        </div>
        <p className="list-tagline">
          Visual animations for complex AI concepts
        </p>
      </header>

      {/* Ready section */}
      <section className="list-section">
        <h2 className="section-title">
          <span className="section-dot ready-dot">●</span> Ready to Watch
        </h2>
        <div className="card-grid">
          {ready.map(c => (
            <ContentCard key={c.id} content={c} onSelect={onSelect} />
          ))}
        </div>
      </section>

      {/* Coming soon section */}
      <section className="list-section">
        <h2 className="section-title">
          <span className="section-dot soon-dot">●</span> Coming Soon
        </h2>
        <div className="card-grid">
          {coming.map(c => (
            <ContentCard key={c.id} content={c} onSelect={onSelect} />
          ))}
        </div>
      </section>

      <footer className="list-footer">
        <span>Built with React + D3 + GSAP</span>
      </footer>
    </div>
  )
}
