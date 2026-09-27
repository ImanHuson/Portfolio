import Reveal from './Reveal.jsx'
import SixBooksScroll from './SixBooksScroll.jsx'
import SpoilerGate from './SpoilerGate.jsx'
import { BOOKS, UPCOMING } from '../data/books.js'

export default function Saga() {
  return (
    <section id="saga">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <h2>The Six Books</h2>
          <p>Scroll through the carousel below, or read the full list underneath it.</p>
        </Reveal>
      </div>

      <SixBooksScroll />

      <div className="wrap" style={{ marginTop: 'var(--space-5)' }}>
        <div className="books-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-3)' }}>
          {BOOKS.map((b, i) => (
            <Reveal as="article" delay={i * 0.04} key={b.numeral} className="house-card">
              <div style={{ fontFamily: 'var(--font-display)', color: 'var(--blood)', fontSize: '2rem', opacity: 0.6 }}>{b.numeral}</div>
              <h3>{b.title}</h3>
              <p style={{ color: 'var(--pale-gold)', fontSize: '11px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', letterSpacing: '1px', margin: '4px 0 var(--space-1)' }}>
                {b.subtitle}
              </p>
              <SpoilerGate minBook={i + 1}>
                <p style={{ fontSize: '0.9rem', color: 'var(--ash)' }}>{b.body}</p>
                <p style={{ fontSize: '12px', color: 'var(--ash)', marginTop: 8 }}>{b.themes.join(' · ')}</p>
              </SpoilerGate>
            </Reveal>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: 'var(--space-4)', color: 'var(--ash)', fontSize: '0.85rem' }}>
          {UPCOMING.title}: {UPCOMING.status}.
        </p>
      </div>
    </section>
  )
}
