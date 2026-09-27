import Reveal from './Reveal.jsx'
import { COLOR_HIERARCHY, WORLD_CATEGORIES, FUN_FACTS } from '../data/world.js'
import { HOUSES } from '../data/houses.js'

export default function World() {
  return (
    <section id="world">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <span className="eyebrow">The World</span>
          <h2>The Society, the Rising, the Republic</h2>
        </Reveal>

        <Reveal as="div" style={{ marginBottom: 'var(--space-6)' }}>
          <h3 style={{ textAlign: 'center', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '1.1rem', marginBottom: 'var(--space-3)' }}>
            The Color Hierarchy
          </h3>
          <div className="hierarchy-list">
            {COLOR_HIERARCHY.map((c) => (
              <div className="hierarchy-row" key={c.name}>
                <div className="hierarchy-swatch" style={{ background: c.hex }} />
                <span className="name">{c.name}</span>
                <span className="role">{c.role}</span>
              </div>
            ))}
          </div>
          <p className="hierarchy-note">
            "The system was built to make inequality look natural."
            <span className="tag">Fan commentary: not a canonical quotation</span>
          </p>
        </Reveal>

        <Reveal as="div" style={{ marginBottom: 'var(--space-6)' }}>
          <h3 style={{ textAlign: 'center', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '1.1rem', marginBottom: 'var(--space-3)' }}>
            The Lore Archive
          </h3>
          <div className="world-grid">
            {WORLD_CATEGORIES.map((w) => (
              <div className="world-card" key={w.title}>
                <h3>{w.title}</h3>
                <p>{w.body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal as="div" style={{ marginBottom: 'var(--space-6)' }}>
          <h3 style={{ textAlign: 'center', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '1.1rem', marginBottom: 'var(--space-3)' }}>
            The Houses
          </h3>
          <div className="house-grid">
            {HOUSES.map((h) => (
              <div className="house-card" key={h.name}>
                <h3>{h.name}</h3>
                {h.motto && <p className="motto">"{h.motto}" {h.mottoTranslation}</p>}
                {h.sigil && <p className="sigil">Sigil: {h.sigil}</p>}
                <p className="influence">{h.identity}, {h.influence}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal as="div">
          <h3 style={{ textAlign: 'center', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '1.1rem', marginBottom: 'var(--space-3)' }}>
            Fun Facts
          </h3>
          <div className="world-grid">
            {FUN_FACTS.map((f, i) => (
              <div className="world-card" key={i}>
                <p style={{ marginTop: 0, fontSize: '13px', color: 'var(--ash)' }}>{f}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
