import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

/**
 * Wraps a block and fades/lifts it in once it scrolls into view.
 * Respects prefers-reduced-motion (handled globally via CSS in index.css,
 * which zeroes out animation/transition durations) — this still runs the
 * tween, but the reduced-duration override makes it effectively instant.
 */
export default function Reveal({ children, as: Tag = 'div', delay = 0, className = '' }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      // Opacity is never touched here — see the .reveal comment in
      // index.css. Only the resting lift transform animates in.
      gsap.fromTo(
        ref.current,
        { y: 24 },
        {
          y: 0,
          duration: 0.8,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 85%',
            once: true,
          },
        },
      )
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={`reveal ${className}`}>
      {children}
    </Tag>
  )
}
