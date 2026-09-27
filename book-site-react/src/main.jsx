import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './index.css'
import App from './App.jsx'

gsap.registerPlugin(ScrollTrigger)

// Standard Lenis + GSAP ScrollTrigger integration: Lenis drives the actual
// scroll, ScrollTrigger is told to re-check on every Lenis scroll tick, and
// GSAP's own ticker drives Lenis's rAF loop instead of a separate one.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (!prefersReducedMotion) {
  const lenis = new Lenis()
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
