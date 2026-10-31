import { useState } from 'react'
import { HEROES } from '../../data/heroes.js'
import { STORIES } from '../../data/stories.js'

export default function ComicPanel({ heroId, comicIndex, onContinue }) {
  const hero = HEROES[heroId]
  const story = STORIES[heroId][comicIndex]
  const [panelIndex, setPanelIndex] = useState(0)

  if (!story) { onContinue(); return null }

  const panel = story.panels[panelIndex]
  const isLast = panelIndex >= story.panels.length - 1
  const isNarrator = panel.speaker === 'Narrador'
  const isHero = panel.speaker === hero.name

  function nextPanel() {
    isLast ? onContinue() : setPanelIndex(i => i + 1)
  }

  return (
    <div
      className={`screen screen-comic bg-${heroId}`}
      style={{ '--hero-color': hero.color, '--hero-color-dark': hero.colorDark }}
    >
      <div className="comic-header">
        <span className="comic-badge">📖 Quadrinho Desbloqueado!</span>
        <h2 className="comic-title">{story.title}</h2>
        <span className="comic-pages">{panelIndex + 1}/{story.panels.length}</span>
      </div>

      {/* Illustrated panel */}
      <div className="comic-illustration">
        <img
          src={story.image}
          alt={story.title}
          className="comic-illustration-img"
        />
        {/* Text bubble overlaid at bottom */}
        <div className={`comic-overlay-bubble ${isNarrator ? 'bubble-narrator' : isHero ? 'bubble-hero' : 'bubble-villain'}`}>
          {!isNarrator && (
            <p className="bubble-speaker" style={isHero ? { color: hero.color } : {}}>
              {panel.speaker}
            </p>
          )}
          <p className="bubble-text">{panel.text}</p>
        </div>
      </div>

      <div className="comic-nav">
        <div className="comic-dots">
          {story.panels.map((_, i) => (
            <span
              key={i}
              className={`comic-dot ${i === panelIndex ? 'comic-dot-active' : ''}`}
              style={i === panelIndex ? { background: hero.color } : {}}
            />
          ))}
        </div>
        <button
          className="btn btn-primary btn-large"
          style={{ background: hero.color }}
          onClick={nextPanel}
        >
          {isLast ? 'Continuar aventura! →' : 'Próximo →'}
        </button>
      </div>
    </div>
  )
}
