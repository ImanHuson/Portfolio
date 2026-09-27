export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="starfield" aria-hidden="true" style={starfieldStyle} />
      <div className="hero-inner">
        <span className="eyebrow">A Personal Fan Archive</span>
        <h1>The Red Rising Saga</h1>
        <p className="lede">Six books. A civilization at war. A rebellion that refuses to die.</p>
        <div className="cta-row">
          <a className="btn solid" href="#saga">Enter the Archive</a>
          <a className="btn ghost" href="#my-ten">Explore My Ten</a>
        </div>
        <div className="meta">
          <div>Pierce Brown</div>
          <div>Red Rising • Golden Son • Morning Star</div>
          <div>Iron Gold • Dark Age • Light Bringer</div>
        </div>
      </div>
    </section>
  )
}

const starfieldStyle = {
  position: 'absolute',
  inset: 0,
  backgroundImage: [
    "radial-gradient(1.5px 1.5px at 8% 22%, rgba(231,225,213,0.55), transparent)",
    "radial-gradient(1.5px 1.5px at 22% 68%, rgba(231,225,213,0.35), transparent)",
    "radial-gradient(1px 1px at 38% 12%, rgba(231,225,213,0.45), transparent)",
    "radial-gradient(1.5px 1.5px at 52% 78%, rgba(231,225,213,0.4), transparent)",
    "radial-gradient(1px 1px at 66% 34%, rgba(231,225,213,0.55), transparent)",
    "radial-gradient(1.5px 1.5px at 78% 58%, rgba(231,225,213,0.3), transparent)",
    "radial-gradient(1px 1px at 88% 18%, rgba(231,225,213,0.45), transparent)",
    "radial-gradient(1.5px 1.5px at 95% 82%, rgba(231,225,213,0.35), transparent)",
    "radial-gradient(2px 2px at 15% 88%, rgba(126,16,24,0.25), transparent)",
    "radial-gradient(2px 2px at 70% 8%, rgba(183,154,97,0.25), transparent)",
  ].join(', '),
  backgroundRepeat: 'no-repeat',
}
