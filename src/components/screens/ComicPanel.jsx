import { useEffect, useState } from 'react'
import { HEROES } from '../../data/heroes.js'
import { STORIES } from '../../data/stories.js'
import { soundEngine } from '../../audio/soundEngine.js'

export default function ComicPanel({ heroId, comicIndex, onContinue }) {
  const hero = HEROES[heroId]
  const story = STORIES[heroId][comicIndex]
  const [panelIndex, setPanelIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [imageZoom, setImageZoom] = useState(false)

  useEffect(() => { soundEngine.startTheme('story'); return () => {} }, [])
  useEffect(() => { if (!story) onContinue() }, [story, onContinue])

  if (!story) return null

  const panel = story.panels[panelIndex]
  const isLast = panelIndex >= story.panels.length - 1
  const isNarrator = panel.speaker === 'Narrador'
  const isHero = panel.speaker === hero.name

  function nextPanel() {
    if (isLast) {
      onContinue()
    } else {
      setPanelIndex(i => i + 1)
      setExpanded(false)
      setImageZoom(false)
    }
  }

  // ── Compact card ──────────────────────────────────────────────────────────
  if (!expanded) {
    return (
      <div className="story-card-overlay">
        <div className="story-card-compact" style={{ borderColor: `${hero.color}44` }}>
          <img
            src={story.image}
            alt={story.title}
            className="story-card-preview-img"
            style={{ cursor: 'pointer' }}
            onClick={() => setExpanded(true)}
          />
          <button
            className="story-card-tap-btn"
            style={{ borderColor: `${hero.color}70`, color: hero.color, background: `${hero.color}14` }}
            onClick={() => setExpanded(true)}
          >
            📖 Clique aqui para ler
          </button>
        </div>
      </div>
    )
  }

  // ── Expanded full-screen ───────────────────────────────────────────────────
  return (
    <div className="story-screen-expanded" style={{ '--hero-color': hero.color }}>
      {imageZoom && (
        <div className="story-img-lightbox" onClick={() => setImageZoom(false)}>
          <img src={story.image} alt={story.title} />
          <button className="story-img-lightbox-close" onClick={(e) => { e.stopPropagation(); setImageZoom(false) }}>✕</button>
        </div>
      )}

      <div className="story-topbar">
        <span className="story-chapter-tag">📖 {story.title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="story-page-count">{panelIndex + 1}/{story.panels.length}</span>
          <button className="story-close-btn" onClick={onContinue} aria-label="Fechar e prosseguir">✕</button>
        </div>
      </div>

      <div className="story-image-zoom-wrap" onClick={() => setImageZoom(true)}>
        <img src={story.image} alt={story.title} className="story-image" />
        <span className="story-image-zoom-hint">🔍 ampliar</span>
      </div>

      <div className={`story-dialogue ${isNarrator ? 'dlg-narrator' : isHero ? 'dlg-hero' : 'dlg-villain'}`}>
        {!isNarrator && (
          <span className="dlg-speaker" style={isHero ? { color: hero.color } : { color: '#FF8888' }}>
            {panel.speaker}
          </span>
        )}
        <p className="dlg-text">{panel.text}</p>
      </div>

      <div className="story-nav">
        <div className="story-dots">
          {story.panels.map((_, i) => (
            <span key={i}
              className={`story-dot ${i === panelIndex ? 'story-dot-active' : ''}`}
              style={i === panelIndex ? { background: hero.color } : {}}
            />
          ))}
        </div>
        <button
          className="btn btn-primary story-next-btn"
          style={{ background: hero.color }}
          onClick={nextPanel}
        >
          {isLast ? 'Continuar aventura →' : 'Próximo →'}
        </button>
        <button className="btn-skip" onClick={onContinue}>Fechar e prosseguir</button>
      </div>
    </div>
  )
}
