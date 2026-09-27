import { useEffect, useRef } from 'react'
import { useSpoiler } from '../context/SpoilerContext.jsx'

export default function SpoilerBar() {
  const { level, setLevel, LEVELS } = useSpoiler()
  const ref = useRef(null)

  // This bar is fixed to the viewport bottom and wraps to 2 lines on
  // narrow screens, so its height isn't a constant. Anything else that
  // anchors to the viewport bottom (the books-3d caption) needs to know
  // the real height to avoid being covered by this bar — see index.css.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const setVar = () => document.documentElement.style.setProperty('--spoiler-bar-h', `${el.offsetHeight}px`)
    setVar()
    const ro = new ResizeObserver(setVar)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="spoiler-bar" role="region" aria-label="Spoiler settings" ref={ref}>
      <span className="label">Spoiler level:</span>
      <select value={level} onChange={(e) => setLevel(Number(e.target.value))} aria-label="Spoiler level">
        {LEVELS.map((l) => (
          <option key={l.value} value={l.value}>
            {l.label}
          </option>
        ))}
      </select>
      <span className="label" style={{ marginLeft: 'auto' }}>
        This site contains spoilers for all six published books.
      </span>
    </div>
  )
}
