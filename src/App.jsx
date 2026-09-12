import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { ContentList } from './components/ContentList'
import { PlayerShell } from './components/PlayerShell'
import { ExportHistory } from './components/ExportHistory'
import ContentManagement from './components/ContentManagement/ContentManagement'
import { PlayerPage } from './components/PlayerPage'
import SceneUiFixtureV1 from './shared/scene-ui/v1/__fixtures__/SceneUiFixtureV1'
import './App.css'

// Home screen with navigation to content management
function Home() {
  const [selected, setSelected] = useState(null)
  const [showHistory, setShowHistory] = useState(false)
  const navigate = useNavigate()

  if (showHistory) {
    return <ExportHistory onBack={() => setShowHistory(false)} />
  }

  if (selected) {
    return <PlayerShell content={selected} onBack={() => setSelected(null)} />
  }

  return (
    <ContentList 
      onSelect={setSelected} 
      onShowHistory={() => setShowHistory(true)}
      onManage={() => navigate('/content-management')}
    />
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/content-management" element={<ContentManagement />} />
        <Route path="/preview/:id" element={<PlayerPage />} />
        {/* Dev-only fixture, bukan topic — lihat PLAN-12 Tahap A/C */}
        <Route path="/dev/scene-ui-v1" element={<SceneUiFixtureV1 />} />
      </Routes>
    </BrowserRouter>
  )
}
