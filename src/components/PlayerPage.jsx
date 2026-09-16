import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchContentItem } from '../data/contentManagement'
import { resolveTopicById } from '../content/resolveTopic'
import { PlayerShell } from './PlayerShell'
import './PlayerPage.css'

export function PlayerPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [content, setContent] = useState(null)
  const [unavailable, setUnavailable] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setUnavailable(false)
    setContent(null)

    const resolved = resolveTopicById(id)
    if (resolved) {
      if (resolved.hasAnimation) {
        setContent({ ...resolved.meta, component: resolved.component })
      } else {
        setContent(resolved.meta)
        setUnavailable(true)
      }
      setLoading(false)

      fetchContentItem(id).then(res => {
        if (isMounted && res.success && res.item) {
          setContent(prev => ({ ...res.item, ...prev, component: prev?.component || resolved.component }))
        }
      })
    } else {
      fetchContentItem(id).then(res => {
        if (!isMounted) return
        if (res.success && res.item) {
          setContent(res.item)
          setUnavailable(true)
          setLoading(false)
        } else {
          navigate('/')
        }
      })
    }

    return () => { isMounted = false }
  }, [id, navigate])

  if (loading) {
    return (
      <div className="player-page-loading">
        <span>Loading...</span>
      </div>
    )
  }

  if (unavailable) {
    return (
      <div className="player-page-unavailable">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h2>Preview animasi belum tersedia</h2>
        <p className="topic-title">{content?.title}</p>
        <p>Topic ini sudah punya metadata, tapi file Animation.jsx-nya belum dibuat.</p>
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Kembali ke daftar
        </button>
      </div>
    )
  }

  return (
    <PlayerShell
      content={content}
      onBack={() => navigate(-1)}
    />
  )
}