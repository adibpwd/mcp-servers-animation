import { useState, useCallback, useEffect } from 'react'

const DEFAULT_SETTINGS = {
  volume: 75,
  speed: 1.0,
  previewSfx: true
}

const STORAGE_KEY = 'exportSettings'

export function useExportSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
      } catch (err) {
        console.error('Failed to parse export settings:', err)
      }
    }
    setIsLoaded(true)
  }, [])

  const updateSettings = useCallback((updates) => {
    setSettings((prev) => {
      const newSettings = { ...prev, ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings))
      return newSettings
    })
  }, [])

  return {
    settings,
    updateSettings,
    isLoaded,
    resetSettings: () => {
      setSettings(DEFAULT_SETTINGS)
      localStorage.removeItem(STORAGE_KEY)
    }
  }
}
