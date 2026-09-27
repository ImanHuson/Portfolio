import Reveal from './Reveal.jsx'
import SpoilerGate from './SpoilerGate.jsx'
import { MOMENTS } from '../data/moments.js'

export default function Moments() {
  return (
    <section id="moments">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <span className="eyebrow">The Moments</span>
          <h2>Scenes That Define the Saga</h2>
        </Reveal>
        <div className="moments-grid">
          {MOMENTS.map((m, i) => (
            <Reveal as="article" delay={i * 0.03} className="moment-card" key={m.order}>
              <div className="order">{m.order}</div>
              <h3>{m.title}</h3>
              <p className="book-tag">{m.book}</p>
              <SpoilerGate minBook={m.minBook}>
                <p className="why">{m.why}</p>
                {m.quote && <p className="snippet">&ldquo;{m.quote}&rdquo;</p>}
              </SpoilerGate>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
