import { useEffect, useState } from 'react'
import { OPENING } from '../../data/stories.js'
import { soundEngine } from '../../audio/soundEngine.js'

export default function OpeningScene({ onFinish, panels: customPanels, chapterTag }) {
  const [index, setIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [imageZoom, setImageZoom] = useState(false)

  // 'story' theme starts when the user opens the card — not on mount.
  // This lets the 'opening' theme from the landing page play briefly first.

  const panels = customPanels || OPENING
  const panel = panels[index]
  const isLast = index >= panels.length - 1

  function next() {
    if (isLast) {
      onFinish()
    } else {
      setIndex(i => i + 1)
      setExpanded(false)
      setImageZoom(false)
    }
  }

  // reset when panels change (e.g. reused for finale)
  useEffect(() => { setIndex(0); setExpanded(false); setImageZoom(false) }, [panels])

  // ── Compact card ──────────────────────────────────────────────────────────
  if (!expanded) {
    return (
      <div className="story-card-overlay">
        <div className="story-card-compact" style={{ borderColor: 'rgba(255,215,0,0.25)' }}>
          <img
            src={panel.image}
            alt=""
            className="story-card-preview-img"
            style={{ cursor: 'pointer' }}
            onClick={() => { soundEngine.startTheme('story'); setExpanded(true) }}
          />
          <button className="story-card-tap-btn" onClick={() => { soundEngine.startTheme('story'); setExpanded(true) }}>
            📖 Clique aqui para ler
          </button>
        </div>
      </div>
    )
  }

  // ── Expanded full-screen ───────────────────────────────────────────────────
  return (
    <div className="story-screen-expanded">
      {imageZoom && (
        <div className="story-img-lightbox" onClick={() => setImageZoom(false)}>
          <img src={panel.image} alt="" />
          <button className="story-img-lightbox-close" onClick={(e) => { e.stopPropagation(); setImageZoom(false) }}>✕</button>
        </div>
      )}

      <div className="story-topbar">
        <span className="story-chapter-tag">{chapterTag || '⚔️ Prólogo'}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="story-page-count">{index + 1}/{panels.length}</span>
          <button className="story-close-btn" onClick={onFinish} aria-label="Fechar e prosseguir">✕</button>
        </div>
      </div>

      <div className="story-image-zoom-wrap" onClick={() => setImageZoom(true)}>
        <img src={panel.image} alt="" className="story-image" />
        <span className="story-image-zoom-hint">🔍 ampliar</span>
      </div>

      <div className="story-dialogue dlg-narrator">
        <p className="dlg-text">{panel.text}</p>
      </div>

      <div className="story-nav">
        <div className="story-dots">
          {panels.map((_, i) => (
            <span key={i}
              className={`story-dot ${i === index ? 'story-dot-active' : ''}`}
              style={i === index ? { background: '#FFD700' } : {}}
            />
          ))}
        </div>
        <button className="btn btn-primary story-next-btn story-opening-btn" onClick={next}>
          {isLast ? (customPanels ? '🏆 Ver o final!' : '⚔️ Começar a aventura!') : 'Próximo →'}
        </button>
        <button className="btn-skip" onClick={onFinish}>Fechar e prosseguir</button>
      </div>
    </div>
  )
}
