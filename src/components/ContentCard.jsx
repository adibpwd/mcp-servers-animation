import React from 'react'
import './ContentCard.css'

export function ContentCard({ content, onSelect }) {
  const isReady = content.status === 'ready'

  return (
    <div
      data-topic-id={content.id}
      className={`content-card ${isReady ? 'ready' : 'locked'}`}
      onClick={() => isReady && onSelect(content)}
      style={{ '--card-color': content.color }}
    >
      {/* Category badge */}
      <div className="card-category">{content.category}</div>

      {/* Title */}
      <div className="card-title">{content.title}</div>

      {/* Subtitle */}
      <div className="card-subtitle">{content.subtitle}</div>

      {/* Tags */}
      <div className="card-tags">
        {content.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      {/* CTA */}
      <div className="card-cta">
        {isReady
          ? <span className="cta-play">▶ &nbsp;Play</span>
          : <span className="cta-soon">Coming Soon</span>
        }
      </div>
    </div>
  )
}
