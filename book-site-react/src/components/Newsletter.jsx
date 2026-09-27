import { useState } from 'react'
import Reveal from './Reveal.jsx'

export default function Newsletter() {
  const [note, setNote] = useState(
    'Placeholder form — not wired to a mailing list yet. Connect it to your provider (e.g. Mailchimp, Buttondown) before publishing.',
  )

  function handleSubmit(e) {
    e.preventDefault()
    setNote('Placeholder only — this demo form does not send email. Wire it to a real provider before publishing.')
  }

  return (
    <section className="alt" id="newsletter">
      <div className="wrap">
        <Reveal as="div" className="newsletter-panel">
          <p className="kicker">Stay in the Rising</p>
          <h2>Get Saga News</h2>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <label htmlFor="newsletterEmail" className="visually-hidden">
              Email address
            </label>
            <input id="newsletterEmail" type="email" name="email" placeholder="you@example.com" required />
            <button type="submit" className="btn solid">
              Subscribe
            </button>
          </form>
          <p className="form-note">{note}</p>
        </Reveal>
      </div>
    </section>
  )
}
