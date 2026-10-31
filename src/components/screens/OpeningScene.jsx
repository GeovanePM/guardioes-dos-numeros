import { useState } from 'react'
import { OPENING } from '../../data/stories.js'

export default function OpeningScene({ onFinish }) {
  const [index, setIndex] = useState(0)

  const panel = OPENING[index]
  const isLast = index >= OPENING.length - 1

  function next() {
    if (isLast) {
      onFinish()
    } else {
      setIndex(i => i + 1)
    }
  }

  return (
    <div className="screen opening-screen">
      <div className="opening-illustration">
        <img
          src={panel.image}
          alt=""
          className="opening-img"
        />
        <div className="opening-text-bar">
          <p className="opening-text">{panel.text}</p>
        </div>
      </div>

      <div className="opening-nav">
        <div className="opening-dots">
          {OPENING.map((_, i) => (
            <span key={i} className={`comic-dot ${i === index ? 'comic-dot-active' : ''}`}
              style={i === index ? { background: '#FFD700' } : {}} />
          ))}
        </div>
        <button className="btn btn-primary btn-large opening-btn" onClick={next}>
          {isLast ? '⚔️ Começar a aventura!' : 'Próximo →'}
        </button>
        <button className="btn-skip" onClick={onFinish}>Pular introdução</button>
      </div>
    </div>
  )
}
