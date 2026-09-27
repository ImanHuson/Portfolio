import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Saga from './components/Saga.jsx'
import World from './components/World.jsx'
import Characters from './components/Characters.jsx'
import AuthorSection from './components/Author.jsx'
import Reviews from './components/Reviews.jsx'
import Excerpt from './components/Excerpt.jsx'
import Buy from './components/Buy.jsx'
import Newsletter from './components/Newsletter.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Saga />
        <World />
        <Characters />
        <AuthorSection />
        <Reviews />
        <Excerpt />
        <Buy />
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}
