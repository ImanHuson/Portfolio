import Nav from './components/Nav.jsx'
import SpoilerBar from './components/SpoilerBar.jsx'
import Hero from './components/Hero.jsx'
import OpeningStatement from './components/OpeningStatement.jsx'
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

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="ambient" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main id="main">
        <Hero />
        <OpeningStatement />
        <Saga />
        <MyTen />
        <World />
        <QuoteVault />
        <Moments />
        <FanArt />
        <Fandom />
        <PersonalProfile />
        <HowlersCreed />
        <Author />
        <Buy />
      </main>
      <Footer />
      <SpoilerBar />
    </>
  )
}
