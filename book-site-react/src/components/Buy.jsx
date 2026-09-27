import Reveal from './Reveal.jsx'

export default function Buy() {
  return (
    <section id="buy">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <p className="kicker">Buy the Books</p>
          <h2>Own the Saga</h2>
          <p>Retailer links below are placeholders — swap in real URLs before publishing.</p>
        </Reveal>
        <Reveal as="div" className="buy-grid">
          <a className="btn" href="#" title="Placeholder — add real Amazon link">Buy on Amazon</a>
          <a className="btn" href="#" title="Placeholder — add real B&N link">Buy on Barnes &amp; Noble</a>
          <a className="btn" href="#" title="Placeholder — add real Bookshop link">Buy on Bookshop</a>
          <a className="btn" href="#" title="Placeholder — add real Kobo link">Buy on Kobo</a>
        </Reveal>
      </div>
    </section>
  )
}
