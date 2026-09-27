import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

/** Fades/lifts a block in on scroll. Never touches opacity — only the lift
 * transform animates, so content stays visible (readable, screenshot-safe)
 * even if the scroll trigger never fires. See design.md's motion note. */
export default function Reveal({ children, as: Tag = 'div', delay = 0, className = '' }) {
  const ref = useRef(null)
  useGSAP(
    () => {
      gsap.fromTo(
        ref.current,
        { y: 24 },
        {
          y: 0,
          duration: 0.8,
          delay,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
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
