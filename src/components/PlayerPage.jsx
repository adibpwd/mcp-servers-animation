import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CONTENT_REGISTRY } from '../content/registry'
import { PlayerShell } from './PlayerShell'

export function PlayerPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [content, setContent] = useState(null)

  useEffect(() => {
    // Find content from registry
    const found = CONTENT_REGISTRY.find(c => c.id === id)
    if (found) {
      setContent(found)
    } else {
      // Content not found, redirect to home
      navigate('/')
    }
  }, [id, navigate])

  if (!content) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#070913',
        color: '#94A3B8'
      }}>
        Loading...
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
