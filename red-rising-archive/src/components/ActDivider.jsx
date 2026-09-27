import Reveal from './Reveal.jsx'

/** A full-bleed editorial beat between the site's five acts (Arrival,
 * Revelation, Exploration, Immersion, Finale). Deliberately not a literal
 * "ACT II" label with a number — the design-taste skill bans generic
 * stage/phase numbering as an AI tell. The line itself carries the pacing. */
export default function ActDivider({ line, tint }) {
  return (
    <div className="act-divider" style={tint ? { '--act-tint': tint } : undefined}>
      <Reveal as="p">{line}</Reveal>
    </div>
  )
}
