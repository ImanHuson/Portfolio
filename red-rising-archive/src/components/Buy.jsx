import Reveal from './Reveal.jsx'
import { BOOKS } from '../data/books.js'

const RETAILERS = ['Amazon', 'Barnes & Noble', 'Bookshop', 'Kobo', "Powell's"]

export default function Buy() {
  return (
    <section id="buy">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <span className="eyebrow">Buy the Books</span>
          <h2>Own the Saga</h2>
          <p>Retailer links below are placeholders. Swap in real URLs before publishing.</p>
        </Reveal>
        <div className="buy-grid">
          {BOOKS.map((b, i) => (
            <Reveal as="div" delay={i * 0.03} className="buy-card" key={b.numeral}>
              <h4>{b.numeral}. {b.title}</h4>
              <div className="buy-links">
                {RETAILERS.map((r) => (
                  <a key={r} className="btn ghost" href="#" title={`Placeholder: add real ${r} link`}>{r}</a>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
