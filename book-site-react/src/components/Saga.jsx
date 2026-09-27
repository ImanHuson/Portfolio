import Reveal from './Reveal.jsx'

const BOOKS = [
  ['I', 'Book One', 'Red Rising', 'A Red miner discovers the world he was born into is a lie — and reinvents himself to bring it down from the inside.'],
  ['II', 'Book Two', 'Golden Son', "Embedded among the ruling Gold houses, Darrow's rebellion turns to open war — and every alliance becomes a liability."],
  ['III', 'Book Three', 'Morning Star', 'The war for the Solar System reaches its breaking point, and the price of victory comes due.'],
  ['IV', 'Book Four', 'Iron Gold', "A decade after the Rising, the republic Darrow fought for strains under the weight of its own new power."],
  ['V', 'Book Five', 'Dark Age', 'Fractured alliances and a widening war push every surviving character past what they thought they could survive.'],
  ['VI', 'Book Six', 'Light Bringer', "The saga's latest chapter carries the interplanetary war and its political reckoning to a new scale."],
]

export default function Saga() {
  return (
    <section id="saga">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <p className="kicker">The Saga</p>
          <h2>An Empire Built on Color. A Revolution Built on Blood.</h2>
          <p>
            Across six novels, Pierce Brown traces Darrow's rise from a Red miner beneath the surface of Mars to the
            center of a war that spans the Solar System — a saga of rebellion, political power, loyalty, and the cost
            of remaking a civilization.
          </p>
        </Reveal>
        <div className="books-grid" id="books">
          {BOOKS.map(([numeral, tag, title, desc], i) => (
            <Reveal as="article" className="book-card" delay={i * 0.05} key={numeral}>
              <span className="book-numeral">{numeral}</span>
              <p className="book-tag">{tag}</p>
              <h3>{title}</h3>
              <p>{desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
