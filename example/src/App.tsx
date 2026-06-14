import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import DocumentationSection from './DocumentationSection'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <p style={{ margin: 0, fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--accent)' }}>
            @avoidray/click-to-source
          </p>
          <h1 style={{ margin: '12px 0', fontSize: 32 }}>Try it out</h1>
          <p style={{ margin: '0 auto', maxWidth: '42ch', lineHeight: 1.5 }}>
            Hold <code>Alt</code> (<code>Option</code> on Mac), hover any element on this page, then click to reveal its source location. That's the whole library.{' '}
            <a href="https://github.com/avoidray/click-to-source" target="_blank" rel="noreferrer">View on GitHub</a>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <DocumentationSection />
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href={`${import.meta.env.BASE_URL}icons.svg#social-icon`}></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href={`${import.meta.env.BASE_URL}icons.svg#github-icon`}></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href={`${import.meta.env.BASE_URL}icons.svg#discord-icon`}></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href={`${import.meta.env.BASE_URL}icons.svg#x-icon`}></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href={`${import.meta.env.BASE_URL}icons.svg#bluesky-icon`}></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
