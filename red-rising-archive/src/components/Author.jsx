import Reveal from './Reveal.jsx'

export default function Author() {
  return (
    <section className="alt" id="author">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <h2>Pierce Brown</h2>
        </Reveal>
        <Reveal as="div" className="author-block">
          <div className="author-portrait" aria-hidden="true">PB</div>
          <div className="author-copy">
            <h3>Author of the Red Rising Saga</h3>
            <p>
              Pierce Brown is the author of the six-book Red Rising Saga. Before writing full-time, his official
              site describes work at a tech startup, at Disney's ABC Studios, as an NBC page, and on a U.S. Senate
              campaign. He lives in Los Angeles.
            </p>
            <div className="author-links">
              <a className="btn" href="https://www.piercebrown.com/aboutpierce" target="_blank" rel="noopener noreferrer">About Pierce →</a>
              <a className="btn" href="https://www.piercebrown.com/redrisingsaga" target="_blank" rel="noopener noreferrer">Official Saga Page →</a>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--ash)', marginTop: 'var(--space-2)' }}>
              This fan archive is not endorsed by or affiliated with Pierce Brown. Social handles under his name
              vary and weren't independently confirmed here, so none are linked here, only the verified official site.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
