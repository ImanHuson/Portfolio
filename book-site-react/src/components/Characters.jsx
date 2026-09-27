import Reveal from './Reveal.jsx'

const CHARACTERS = [
  ['D', 'Darrow', 'Red / Gold', 'A Red miner remade into a Gold to bring down the Society from within.'],
  ['M', 'Virginia "Mustang" au Augustus', 'House Augustus', 'Strategist and reluctant heir to one of the ruling Gold houses.'],
  ['S', 'Sevro au Barca', 'House Barca', "Darrow's closest ally — small, vicious, and fiercely loyal."],
  ['C', 'Cassius au Bellona', 'House Bellona', 'A friend turned enemy, caught between vengeance and honor.'],
  ['L', 'Lysander au Lune', 'House Lune', "Heir to the old order, shaped by a war he didn't start."],
  ['L', 'Lyria of Lagalos', 'Red', "A voice from the margins of the war the earlier books didn't tell."],
  ['E', 'Ephraim ti Horn', 'Grey', 'A thief pulled into a war far bigger than any job he planned for.'],
]

export default function Characters() {
  return (
    <section id="characters">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <p className="kicker">The Characters</p>
          <h2>Who Fights, Who Falls, Who Rules</h2>
        </Reveal>
        <div className="chars-grid">
          {CHARACTERS.map(([initial, name, house, desc], i) => (
            <Reveal as="div" className="char-card" delay={i * 0.04} key={name}>
              <div className="char-badge">{initial}</div>
              <h4>{name}</h4>
              <p className="char-house">{house}</p>
              <p>{desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
