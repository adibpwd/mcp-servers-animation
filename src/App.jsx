import React from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import ContentManagement from './components/ContentManagement/ContentManagement'
import { ExportHistory } from './components/ExportHistory'
import { PlayerPage } from './components/PlayerPage'
import SceneUiFixtureV1 from './shared/scene-ui/v1/__fixtures__/SceneUiFixtureV1'
import './App.css'

function HistoryPage() {
  const navigate = useNavigate()
  return <ExportHistory onBack={() => navigate('/')} />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ContentManagement />} />
        <Route path="/export-history" element={<HistoryPage />} />
        <Route path="/preview/:id" element={<PlayerPage />} />
        {/* Dev-only fixture, bukan topic — lihat PLAN-12 Tahap A/C */}
        <Route path="/dev/scene-ui-v1" element={<SceneUiFixtureV1 />} />
      </Routes>
    </BrowserRouter>
  )
}