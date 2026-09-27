import Reveal from './Reveal.jsx'

const CHANNELS = ['Reddit', 'X', 'Fan Art', 'Theories', 'Memes', 'Podcasts', 'Fan Sites', 'Community']

const FAN_VOICES = [
  {
    text: "Recurring enthusiasm for Darrow, Sevro, Cassius, Mustang, Diomedes, and Apollonius shows up across r/RedRising threads. Lysander, though, is consistently the most argued-about character in the cast.",
    source: 'Aggregated observation, r/RedRising (paraphrased, not a direct quote)',
  },
  {
    text: "Community directories point to r/RedRising, Sons of Ares, Howler Life, and the Howler Archives as the saga's main unofficial gathering points.",
    source: 'Red Rising Wiki community directory',
  },
]

export default function Fandom() {
  return (
    <section className="alt" id="fandom">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <span className="eyebrow">The Fandom</span>
          <h2>The Howler's Chorus</h2>
          <p>Community observation shown below is paraphrased and sourced. Never presented as canon, never invented.</p>
        </Reveal>
        <Reveal as="div" className="fandom-grid" style={{ marginBottom: 'var(--space-4)' }}>
          {CHANNELS.map((c) => (
            <div className="fandom-chip" key={c}>{c}</div>
          ))}
        </Reveal>
        {FAN_VOICES.map((v, i) => (
          <Reveal as="div" delay={i * 0.05} className="fan-voice" key={i}>
            <p>{v.text}</p>
            <p className="attr">Fan Voice - {v.source}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
