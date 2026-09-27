import Reveal from './Reveal.jsx'

const FIELDS = [
  'Favorite Character', 'Favorite Book', 'Favorite Villain', 'Favorite Battle', 'Favorite Relationship',
  'Most Devastating Death', 'Best Speech', 'Funniest Character', 'Most Underrated',
  "Character I'd Follow Into an Iron Rain",
]

export default function PersonalProfile() {
  return (
    <section className="alt" id="about">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <span className="eyebrow">My Red Rising</span>
          <h2>The Personal Fan Profile</h2>
          <p>Placeholders below, for the site owner to fill in.</p>
        </Reveal>
        <Reveal as="div" className="profile-grid">
          {FIELDS.map((f) => (
            <div className="profile-field" key={f}>
              <div className="k">{f}</div>
              <div className="v">(to be filled in)</div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
