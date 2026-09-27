import { useState } from 'react'

const LINKS = [
  ['saga', 'Saga'],
  ['world', 'World'],
  ['characters', 'Characters'],
  ['author', 'Author'],
  ['reviews', 'Reviews'],
  ['excerpt', 'Excerpt'],
  ['buy', 'Buy'],
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-nav">
      <div className="nav-inner">
        <a className="wordmark" href="#hero">
          RED<span>RISING</span> SAGA
        </a>
        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="primaryNav"
          onClick={() => setOpen((v) => !v)}
        >
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
