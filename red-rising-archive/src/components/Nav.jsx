import { useState } from 'react'

const LINKS = [
  ['saga', 'The Saga'],
  ['my-ten', 'My Ten'],
  ['world', 'The World'],
  ['quotes', 'The Quote Vault'],
  ['moments', 'The Moments'],
  ['archive', 'The Archive'],
  ['fandom', 'The Fandom'],
  ['about', 'About'],
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <header className="site-nav">
      <div className="nav-inner">
        <a className="nav-brand" href="#hero">
          <span className="b1">Red Rising</span>
          <span className="b2">Pierce Brown</span>
        </a>
        <button className="nav-toggle" aria-expanded={open} aria-controls="primaryNav" onClick={() => setOpen((v) => !v)}>
          Menu
        </button>
        <nav className={`primary-links${open ? ' open' : ''}`} id="primaryNav" aria-label="Primary">
          {LINKS.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
