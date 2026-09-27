import Reveal from './Reveal.jsx'

export default function OpeningStatement() {
  return (
    <section id="opening">
      <div className="statement">
        <Reveal as="p" className="lead">
          A story about freedom, power, war, loyalty, inheritance, and what happens when people try to build a
          better world with the weapons of the old one.
        </Reveal>
        <Reveal as="div" delay={0.1}>
          <h2 style={{ marginTop: 'var(--space-4)', fontSize: '1.6rem', letterSpacing: '2px' }}>
            The Red Rising Saga
          </h2>
          <p className="intro">
            Darrow is a Red, born into the lowest caste of a solar empire built on a rigid color hierarchy. When he
            learns the truth about the world he's sacrificed for, he infiltrates the Institute to challenge the
            ruling Gold caste from within — and sets in motion a war that spans six books and the entire Solar
            System. Science fiction. Space opera. Dystopian revolution. Military epic. Political tragedy. Character
            drama. Red Rising is all of these at once.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
