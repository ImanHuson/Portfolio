import Reveal from './Reveal.jsx'

// Only "Hic Sunt Leones" was independently confirmed as an exact in-book
// motto (House Augustus). The rest of this creed is a fan-composed
// manifesto inspired by the saga's themes and rallying language — presented
// as that, not transcribed as book-exact quotations, per the brief's own
// "verify every phrase before labeling it canonical" rule.
const CREED = [
  { line: 'Hail Libertas', note: 'Fan-composed rallying phrase' },
  { line: 'Hail Reaper', note: 'Fan-composed rallying phrase' },
  { line: 'Break the Chains', note: 'Fan phrase, evoking a real line from the saga' },
  { line: 'Live for More', note: 'Echoes Eo\'s line to Darrow in Red Rising' },
  { line: 'Through the Thorns to the Stars', note: 'Fan-composed' },
  { line: 'Hic Sunt Leones', note: 'Verified: House Augustus motto ("Here Be Lions")' },
]

export default function HowlersCreed() {
  return (
    <section id="creed-section">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <h2>The Howler's Creed</h2>
          <p>A fan-composed manifesto, not an official text. Each line's status is shown alongside it.</p>
        </Reveal>
        <Reveal as="div" className="creed-list">
          {CREED.map((c) => (
            <div className="creed-item" key={c.line}>
              {c.line}
              <small>{c.note}</small>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
