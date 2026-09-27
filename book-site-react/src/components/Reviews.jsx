import Reveal from './Reveal.jsx'

export default function Reviews() {
  return (
    <section id="reviews">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <p className="kicker">Praise</p>
          <h2>Reviews & Praise</h2>
          <p>
            Placeholder pull-quotes below — replace with licensed review blurbs and their real, attributed sources
            before this site goes live.
          </p>
        </Reveal>
        <div className="reviews-grid">
          {[0, 1, 2].map((i) => (
            <Reveal as="blockquote" className="review" delay={i * 0.05} key={i}>
              <p>&ldquo;Placeholder blurb — insert a short, licensed pull-quote here.&rdquo;</p>
              <cite>— Placeholder, Publication Name</cite>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
