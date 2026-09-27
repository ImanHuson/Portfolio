import { createContext, useContext, useState, useEffect } from 'react'

const SpoilerContext = createContext(null)

const LEVELS = [
  { value: 0, label: 'Spoiler-Safe (Hide All)' },
  { value: 1, label: 'Book 1 — Red Rising' },
  { value: 2, label: 'Book 2 — Golden Son' },
  { value: 3, label: 'Book 3 — Morning Star' },
  { value: 4, label: 'Book 4 — Iron Gold' },
  { value: 5, label: 'Book 5 — Dark Age' },
  { value: 6, label: 'Book 6 — Light Bringer' },
  { value: 99, label: 'All Spoilers' },
]

export function SpoilerProvider({ children }) {
  const [level, setLevel] = useState(0) // spoiler-safe default, per brief §27

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('rr-spoiler-level')
      if (saved !== null) setLevel(Number(saved))
    } catch {
      /* private-mode/blocked storage — stay on the safe default */
    }
  }, [])

  function updateLevel(v) {
    setLevel(v)
    try {
      window.localStorage.setItem('rr-spoiler-level', String(v))
    } catch {
      /* per-viewer convenience only; fine if it can't persist */
    }
  }

  const allowed = (minBook) => level === 99 || level >= minBook

  return (
    <SpoilerContext.Provider value={{ level, setLevel: updateLevel, allowed, LEVELS }}>
      {children}
    </SpoilerContext.Provider>
  )
}

export function useSpoiler() {
  const ctx = useContext(SpoilerContext)
  if (!ctx) throw new Error('useSpoiler must be used within SpoilerProvider')
  return ctx
}
