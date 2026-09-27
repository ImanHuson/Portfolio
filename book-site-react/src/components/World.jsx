import Reveal from './Reveal.jsx'

const CASTES = [
  ['#b0281f', 'Red', 'Miners & laborers'],
  ['#d9b567', 'Gold', 'Ruling class'],
  ['#cfd3d6', 'Silver', 'Finance & industry'],
  ['#b87d4b', 'Copper', 'Bureaucracy'],
  ['#3b3f45', 'Obsidian', 'Warrior caste'],
  ['#6b7280', 'Grey', 'Soldiers & police'],
  ['#3f6fb0', 'Blue', 'Pilots & navigators'],
  ['#3f8f5a', 'Green', 'Scouts & pioneers'],
]

const FACTIONS = [
  ['The Sons of Ares', "The resistance movement working to bring down the Society from within."],
  ['House Augustus', 'One of the ruling Gold houses at the center of the early war for power.'],
  ['The Society', 'The entrenched interplanetary order built on the color hierarchy.'],
  ['The New Republic', "The fragile order that rises from the war — and its own struggle to hold together."],
]

export default function World() {
  return (
    <section className="alt" id="world">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <p className="kicker">The World</p>
          <h2>The Society, Mars, and the Rising</h2>
        </Reveal>

        <Reveal as="div" className="world-block">
          <h3>The Color Hierarchy</h3>
          <p className="lead">
            The Society sorts every life at birth into a color caste, each bred and engineered for a fixed role.
            Darrow's story begins at the bottom of that ladder.
          </p>
          <div className="caste-grid">
            {CASTES.map(([color, name, role]) => (
              <div className="caste-chip" key={name}>
                <div className="caste-swatch" style={{ background: color }} />
                <div className="caste-name">{name}</div>
                <div className="caste-role">{role}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal as="div" className="world-block">
          <h3>Mars & the Solar System</h3>
          <p className="lead">
            The saga opens beneath the surface of Mars, where Reds mine helium-3 to terraform a world they're told is
            still uninhabitable. As the story widens, the war carries across the Society's colonies throughout the
            Solar System.
          </p>
        </Reveal>

        <Reveal as="div" className="world-block">
          <h3>The Rising & Major Factions</h3>
          <div className="factions-grid">
            {FACTIONS.map(([name, desc]) => (
              <div className="faction-card" key={name}>
                <h4>{name}</h4>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
