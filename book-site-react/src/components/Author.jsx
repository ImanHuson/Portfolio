import Reveal from './Reveal.jsx'

export default function AuthorSection() {
  return (
    <section className="alt" id="author">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <p className="kicker">The Author</p>
          <h2>Pierce Brown</h2>
        </Reveal>
        <Reveal as="div" className="author-block">
          <div className="author-portrait" aria-hidden="true">
            PB
          </div>
          <div className="author-copy">
            <h3>#1 New York Times Bestselling Author</h3>
            <p>
              Pierce Brown is the author of the Red Rising Saga. He lives in Los Angeles, where he continues to write
              within the world of Darrow and the Rising.
            </p>
            <div className="author-links">
              <a className="btn" href="https://www.piercebrown.com/aboutpierce" target="_blank" rel="noopener noreferrer">
                About Pierce →
              </a>
              <a className="btn" href="https://www.piercebrown.com/redrisingsaga" target="_blank" rel="noopener noreferrer">
                Official Saga Page →
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
