import Particles from './Particles.jsx'
import SplitText from './SplitText.jsx'
import ShinyText from './ShinyText.jsx'

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-particles" aria-hidden="true">
        <Particles
          particleColors={['#b0281f', '#d9b567', '#f3ede2']}
          particleCount={180}
          particleSpread={10}
          speed={0.08}
          particleBaseSize={80}
          moveParticlesOnHover={false}
          alphaParticles
          disableRotation={false}
        />
      </div>
      <div className="hero-inner">
        <div className="emblem" aria-hidden="true">
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="60,4 112,60 60,116 8,60" stroke="#b8923f" strokeWidth="1.5" fill="none" />
            <polygon points="60,26 94,60 60,94 26,60" stroke="#7a1414" strokeWidth="1.5" fill="none" />
            <circle cx="60" cy="60" r="6" fill="#d9b567" />
          </svg>
        </div>
        <span className="byline">
          <ShinyText text="Pierce Brown" speed={4} color="#b8923f" shineColor="#f3ede2" />
        </span>
        <SplitText
          text="The Red Rising Saga"
          tag="h1"
          className="hero-title"
          splitType="words"
          delay={60}
          duration={1}
          from={{ opacity: 0, y: 30 }}
          to={{ opacity: 1, y: 0 }}
        />
        <p className="lede">
          Six books. One rebellion. A civilization built on a rigid color hierarchy — and the man born to burn it
          down.
        </p>
        <a className="btn solid" href="#saga">
          Explore the Saga
        </a>
      </div>
    </section>
  )
}
