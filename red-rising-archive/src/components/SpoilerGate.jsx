import { useSpoiler } from '../context/SpoilerContext.jsx'

/** Blurs its children until the visitor's spoiler level reaches minBook. */
export default function SpoilerGate({ minBook, children }) {
  const { allowed, setLevel, level } = useSpoiler()
  if (allowed(minBook)) return children

  return (
    <div
      className="spoiler-blur"
      role="button"
      tabIndex={0}
      title={`Contains spoilers through Book ${minBook}. Click to reveal.`}
      onClick={() => setLevel(Math.max(level, minBook))}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') setLevel(Math.max(level, minBook))
      }}
    >
      {children}
    </div>
  )
}
