import Reveal from './Reveal.jsx'

export default function FanArt() {
  return (
    <section id="archive">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <span className="eyebrow">Fan Art</span>
          <h2>Community Gallery</h2>
          <p>No fan art is scraped or reproduced here without permission. This is the submission/attribution architecture, ready for real work to be added.</p>
        </Reveal>
        <Reveal as="div" className="gallery-cta-grid">
          <div className="gallery-cta">
            <h4>Submit Fan Art</h4>
            <p>Placeholder: connect to a real submission form before publishing.</p>
          </div>
          <div className="gallery-cta">
            <h4>View Community Art</h4>
            <p>Placeholder gallery slot: populate only with permissioned work.</p>
          </div>
          <div className="gallery-cta">
            <h4>Artist Credit</h4>
            <p>Every piece shown must carry artist name + original source link.</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
