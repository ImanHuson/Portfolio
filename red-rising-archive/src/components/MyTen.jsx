import { useState } from 'react'
import Reveal from './Reveal.jsx'
import CharacterDossier from './CharacterDossier.jsx'
import { CHARACTERS } from '../data/characters.js'

export default function MyTen() {
  const [open, setOpen] = useState(null)

  return (
    <section className="alt" id="my-ten">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <span className="eyebrow">My Ten</span>
          <h2>The Ten Faces of Power</h2>
          <p>The characters I keep coming back to — not an objective ranking, just mine. Click a card to open the full dossier.</p>
        </Reveal>
        <div className="ten-grid">
          {CHARACTERS.map((c, i) => (
            <Reveal as="div" delay={i * 0.03} key={c.id}>
              <button className="ten-card" onClick={() => setOpen(c)}>
                <div className="order">{c.order}</div>
                <h3>{c.name}</h3>
                <p className="epithet">{c.color}</p>
                <p className="axis">{c.axis} — my reading of them</p>
              </button>
            </Reveal>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: 'var(--space-4)', color: 'var(--ash)', fontSize: '0.85rem' }}>
          Axis labels above are this archive's personal interpretation, not canonical character definitions.
        </p>
      </div>
      {open && <CharacterDossier character={open} onClose={() => setOpen(null)} />}
    </section>
  )
}
