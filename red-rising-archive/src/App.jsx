import Nav from './components/Nav.jsx'
import SpoilerBar from './components/SpoilerBar.jsx'
import Hero from './components/Hero.jsx'
import OpeningStatement from './components/OpeningStatement.jsx'
import ActDivider from './components/ActDivider.jsx'
import Saga from './components/Saga.jsx'
import MyTen from './components/MyTen.jsx'
import World from './components/World.jsx'
import QuoteVault from './components/QuoteVault.jsx'
import Moments from './components/Moments.jsx'
import FanArt from './components/FanArt.jsx'
import Fandom from './components/Fandom.jsx'
import PersonalProfile from './components/PersonalProfile.jsx'
import HowlersCreed from './components/HowlersCreed.jsx'
import Author from './components/Author.jsx'
import Buy from './components/Buy.jsx'
import Footer from './components/Footer.jsx'

/* The page reads as five acts (Arrival, Revelation, Exploration, Immersion,
 * Finale) rather than a flat list of sections. Each ActDivider is one
 * editorial line, not a literal "Act II" label (see its own file comment
 * for why), and shifts the ambient tint slightly within the same locked
 * dark theme — never a full theme flip. */
export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="ambient" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main id="main">
        {/* Act I: Arrival */}
        <Hero />
        <OpeningStatement />

        <ActDivider line="Six books. Ten faces of power. One rebellion that would not stay contained." />

        {/* Act II: Revelation */}
        <Saga />
        <MyTen />

        <ActDivider
          line="A solar system built on color, and the words that outlived the war."
          tint="radial-gradient(ellipse 70% 60% at 50% 50%, rgba(183,154,97,0.16), transparent 70%)"
        />

        {/* Act III: Exploration */}
        <World />
        <QuoteVault />
        <Moments />

        <ActDivider line="The rising did not end with the last page. It moved into a fandom that kept telling the story." />

        {/* Act IV: Immersion */}
        <FanArt />
        <Fandom />
        <PersonalProfile />
        <HowlersCreed />

        <ActDivider
          line="Every rebellion has an author. Every ending, a beginning still on the shelf."
          tint="radial-gradient(ellipse 70% 60% at 50% 50%, rgba(183,154,97,0.16), transparent 70%)"
        />

        {/* Act V: Finale */}
        <Author />
        <Buy />
      </main>
      <Footer />
      <SpoilerBar />
    </>
  )
}
