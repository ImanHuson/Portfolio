import Reveal from './Reveal.jsx'
import SpoilerGate from './SpoilerGate.jsx'
import { MOMENTS } from '../data/moments.js'

export default function Moments() {
  return (
    <section id="moments">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <h2>Scenes That Define the Saga</h2>
        </Reveal>
        <div className="moments-timeline">
          {MOMENTS.map((m, i) => (
            <Reveal as="article" delay={i * 0.03} className="moment-row" key={m.order}>
              <div className="order">{m.order}</div>
              <div>
                <p className="book-tag">{m.book}</p>
                <h3>{m.title}</h3>
                <SpoilerGate minBook={m.minBook}>
                  <p className="why">{m.why}</p>
                  {m.quote && <p className="snippet">&ldquo;{m.quote}&rdquo;</p>}
                </SpoilerGate>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
