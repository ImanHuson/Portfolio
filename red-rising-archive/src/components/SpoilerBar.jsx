import { useSpoiler } from '../context/SpoilerContext.jsx'

export default function SpoilerBar() {
  const { level, setLevel, LEVELS } = useSpoiler()
  return (
    <div className="spoiler-bar" role="region" aria-label="Spoiler settings">
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
