import { useState } from 'react'
import { HEROES } from '../../data/heroes.js'
import { STORIES } from '../../data/stories.js'
import MitosArt from '../art/MitosArt.jsx'
import PampeeArt from '../art/PampeeArt.jsx'
import GaldiosArt from '../art/GaldiosArt.jsx'
import NiaArt from '../art/NiaArt.jsx'

const ART_MAP = { mitos: MitosArt, pampee: PampeeArt, galdios: GaldiosArt, nia: NiaArt }

export default function ComicPanel({ heroId, comicIndex, onContinue }) {
  const hero = HEROES[heroId]
  const story = STORIES[heroId][comicIndex]
  const [panelIndex, setPanelIndex] = useState(0)
  const HeroArt = ART_MAP[heroId]

  if (!story) {
    onContinue()
    return null
  }

  const panel = story.panels[panelIndex]
  const isLast = panelIndex >= story.panels.length - 1

  function nextPanel() {
    if (isLast) {
      onContinue()
    } else {
      setPanelIndex(i => i + 1)
    }
  }

  const isNarrator = panel.speaker === 'Narrador'
  const isHero = panel.speaker === hero.name
  const isVillain = !isNarrator && !isHero

  return (
    <div
      className={`screen screen-comic bg-${heroId}`}
      style={{ '--hero-color': hero.color, '--hero-color-dark': hero.colorDark }}
    >
      {/* Comic header */}
      <div className="comic-header">
        <span className="comic-badge">📖 Quadrinho Desbloqueado!</span>
        <h2 className="comic-title">{story.title}</h2>
        <span className="comic-pages">{panelIndex + 1}/{story.panels.length}</span>
      </div>

      {/* Comic panel */}
      <div className="comic-frame">
        {/* Hero art */}
        <div className={`comic-art ${isVillain ? 'comic-art-villain-scene' : ''}`}>
          <HeroArt size={150} className={isVillain ? 'art-dimmed' : ''} />
        </div>

        {/* Speech bubble */}
        <div className={`comic-bubble ${isNarrator ? 'bubble-narrator' : isHero ? 'bubble-hero' : 'bubble-villain'}`}>
          {!isNarrator && (
            <p className="bubble-speaker" style={isHero ? { color: hero.color } : {}}>
              {panel.speaker}
            </p>
          )}
          <p className="bubble-text">{panel.text}</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="comic-nav">
        <div className="comic-dots">
          {story.panels.map((_, i) => (
            <span key={i} className={`comic-dot ${i === panelIndex ? 'comic-dot-active' : ''}`} style={i === panelIndex ? { background: hero.color } : {}} />
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
