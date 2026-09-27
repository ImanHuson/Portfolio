import Reveal from './Reveal.jsx'

export default function Excerpt() {
  return (
    <section className="alt" id="excerpt">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <p className="kicker">Excerpt</p>
          <h2>Begin the Rising</h2>
        </Reveal>
        <Reveal as="div" className="excerpt-panel">
          <p className="teaser">
            The first pages of Red Rising open below the surface of Mars, in a world Darrow has never questioned —
            until he has no choice left but to.
          </p>
          <div className="excerpt-placeholder">
            Excerpt placeholder — insert the licensed opening pages of <em>Red Rising</em> here. Do not paste
            copyrighted book text into this section without permission from the author/publisher.
          </div>
          <a className="btn solid" href="https://www.piercebrown.com/redrisingsaga" target="_blank" rel="noopener noreferrer">
            Read a Sample →
          </a>
        </Reveal>
      </div>
    </section>
  )
}
