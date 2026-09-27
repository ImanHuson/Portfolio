import { useEffect, useRef } from 'react'
import SpoilerGate from './SpoilerGate.jsx'

export default function CharacterDossier({ character, onClose }) {
  const dialogRef = useRef(null)
  const previouslyFocused = useRef(null)

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    previouslyFocused.current = document.activeElement
    dialogRef.current?.focus()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previouslyFocused.current?.focus?.()
    }
  }, [onClose])

  return (
    <div className="dossier-backdrop" onClick={onClose}>
      <div
        className="dossier"
        role="dialog"
        aria-modal="true"
        aria-label={character.name}
        tabIndex={-1}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close" onClick={onClose} aria-label="Close dossier">✕</button>
        <div className="order">{character.order}</div>
        <h3>{character.name}</h3>
        <p className="epithet">{character.epithet}</p>
        <div className="meta-row">
          <span><strong>Color:</strong> {character.color}</span>
          <span><strong>House:</strong> {character.house}</span>
          <span><strong>Role:</strong> {character.role}</span>
        </div>
        <div className="traits">
          {character.traits.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <SpoilerGate minBook={character.minBook}>
          <p className="framing">{character.framing}</p>
          {character.note && <p className="note">{character.note}</p>}
          {character.spoilerNote && <p className="note">{character.spoilerNote}</p>}
          {character.debated && (
            <div className="debate">
              <strong>Fan debate:</strong> the community is sharply divided on {character.name}. Some readers find
              the complexity compelling, others strongly reject the ideology and actions. This dossier's framing is
              this archive's personal reading, not a consensus verdict.
            </div>
          )}
        </SpoilerGate>
      </div>
    </div>
  )
}
