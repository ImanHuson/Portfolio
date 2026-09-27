import { useMemo, useState } from 'react'
import Reveal from './Reveal.jsx'
import { FEATURED_QUOTES, QUOTE_FILTERS } from '../data/quotes.js'

export default function QuoteVault() {
  const [theme, setTheme] = useState(null)
  const [copiedIndex, setCopiedIndex] = useState(null)

  const filtered = useMemo(
    () => (theme ? FEATURED_QUOTES.filter((q) => q.themes.includes(theme)) : FEATURED_QUOTES),
    [theme],
  )

  function copyQuote(q, i) {
    const text = `"${q.text}" — ${q.speaker}`
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedIndex(i)
      setTimeout(() => setCopiedIndex(null), 1500)
    })
  }

  return (
    <section className="alt" id="quotes">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <span className="eyebrow">The Quote Vault</span>
          <h2>Words That Stay</h2>
          <p>The fan archive's favorites — short, verified snippets only. Longer passages point to the book, not a full reprint.</p>
        </Reveal>

        <div className="vault-filters" role="group" aria-label="Filter by theme">
          <button aria-pressed={theme === null} onClick={() => setTheme(null)}>All</button>
          {QUOTE_FILTERS.themes.map((t) => (
            <button key={t} aria-pressed={theme === t} onClick={() => setTheme(t)}>
              {t}
            </button>
          ))}
        </div>

        <div className="quote-grid">
          {filtered.map((q, i) => (
            <Reveal as="blockquote" delay={i * 0.03} className="quote-card" key={q.text}>
              <button className="copy-btn" onClick={() => copyQuote(q, i)} aria-label="Copy quote">
                {copiedIndex === i ? 'Copied' : 'Copy'}
              </button>
              <p className="text">&ldquo;{q.text}&rdquo;</p>
              <p className="source">— {q.speaker}, {q.context}</p>
            </Reveal>
          ))}
          {filtered.length === 0 && <p style={{ color: 'var(--ash)', textAlign: 'center' }}>No quotes tagged with that theme yet.</p>}
        </div>
      </div>
    </section>
  )
}
