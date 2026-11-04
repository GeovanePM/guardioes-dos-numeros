import { useState } from 'react'
import { HEROES, HERO_ORDER } from '../../data/heroes.js'
import { ENDINGS } from '../../data/stories.js'

export default function Ending({ heroId, onFinish, progress = {}, onGoHero }) {
  const hero   = HEROES[heroId]
  const ending = ENDINGS[heroId]
  const [panelIndex, setPanelIndex] = useState(0)
  const [expanded,   setExpanded]   = useState(false)
  const [imageZoom,  setImageZoom]  = useState(false)
  const [showFinal,  setShowFinal]  = useState(false)

  // ── Victory screen (after all panels) ───────────────────────────────────────
  if (showFinal) {
    const otherHeroes = HERO_ORDER.filter(id => id !== heroId)
    const incomplete  = otherHeroes.filter(id => !(progress[id]?.ending))
    const allDone     = incomplete.length === 0

    return (
      <div className="story-card-overlay">
        <div className="story-card-compact" style={{ borderColor: `${hero.color}55`, maxWidth: 500 }}>
          <div style={{ padding: '20px 16px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.4rem', marginBottom: 6 }}>🏆</div>
            <h2 style={{ color: hero.color, fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px' }}>
              {ending.title}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', margin: '0 0 14px' }}>
              🏆 Turma {hero.className} — Missão Cumprida!
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
              {[
                { icon: '⚔️', label: '10 Fases', sub: 'Concluídas' },
                { icon: hero.themeIcon, label: hero.theme, sub: 'Restaurado' },
              ].map(({ icon, label, sub }) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '8px 14px', flex: 1 }}>
                  <div style={{ fontSize: '1.3rem' }}>{icon}</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', marginTop: 2 }}>{label}</div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)' }}>{sub}</div>
                </div>
              ))}
            </div>

            {allDone ? (
              <div style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.35)', borderRadius: 12, padding: '10px 14px', marginBottom: 14 }}>
                <p style={{ color: '#FFD700', fontWeight: 800, fontSize: '0.88rem', margin: 0 }}>🌟 PACTO DOS QUATRO CUMPRIDO! 🌟</p>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.78rem', margin: '4px 0 0' }}>
                  Todos os Guardiões venceram! O universo está restaurado!
                </p>
              </div>
            ) : (
              <div style={{ marginBottom: 14 }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: 8 }}>
                  ⚔️ {incomplete.length} Guardião{incomplete.length > 1 ? 'ões precisam' : ' precisa'} da sua ajuda!
                </p>
                {incomplete.map(id => {
                  const h = HEROES[id]
                  const phases = progress[id]?.phasesCompleted?.length || 0
                  const next   = progress[id]?.maxPhaseUnlocked || 1
                  return (
                    <button key={id} onClick={() => onGoHero?.(id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                        background: `${h.color}18`, border: `1.5px solid ${h.color}55`,
                        borderRadius: 10, padding: '8px 12px', marginBottom: 6,
                        color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
                      <span style={{ fontSize: '1.2rem' }}>{h.themeIcon}</span>
                      <span style={{ flex: 1, textAlign: 'left' }}>
                        <span style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: h.color }}>{h.name}</span>
                        <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)' }}>
                          {phases === 0 ? 'Ainda não começou' : `Fase ${next} — ${phases}/10`}
                        </span>
                      </span>
                      <span style={{ color: h.color }}>→</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <button className="story-card-tap-btn"
            style={{ borderColor: `${hero.color}70`, color: hero.color, background: `${hero.color}14` }}
            onClick={onFinish}>
            🗺️ Voltar ao Mapa
          </button>
        </div>
      </div>
    )
  }

  const panel     = ending.panels[panelIndex]
  const isLast    = panelIndex >= ending.panels.length - 1
  const isNarrator = panel.speaker === 'Narrador'
  const isHero    = panel.speaker === hero.name

  function nextPanel() {
    if (isLast) setShowFinal(true)
    else { setPanelIndex(i => i + 1); setExpanded(false); setImageZoom(false) }
  }

  // ── Compact card ────────────────────────────────────────────────────────────
  if (!expanded) {
    return (
      <div className="story-card-overlay">
        <div className="story-card-compact" style={{ borderColor: `${hero.color}55` }}>
          <div style={{ background: `${hero.color}18`, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1.1rem' }}>🏆</span>
            <span style={{ color: hero.color, fontWeight: 800, fontSize: '0.82rem' }}>Final Desbloqueado!</span>
          </div>
          <img
            src={ending.image}
            alt={ending.title}
            className="story-card-preview-img"
            style={{ cursor: 'pointer' }}
            onClick={() => setExpanded(true)}
          />
          <button
            className="story-card-tap-btn"
            style={{ borderColor: `${hero.color}70`, color: hero.color, background: `${hero.color}14` }}
            onClick={() => setExpanded(true)}
          >
            🏆 Clique aqui para ler o final
          </button>
        </div>
      </div>
    )
  }

  // ── Expanded full-screen ─────────────────────────────────────────────────────
  return (
    <div className="story-screen-expanded" style={{ '--hero-color': hero.color }}>
      {imageZoom && (
        <div className="story-img-lightbox" onClick={() => setImageZoom(false)}>
          <img src={ending.image} alt={ending.title} />
          <button className="story-img-lightbox-close"
            onClick={e => { e.stopPropagation(); setImageZoom(false) }}>✕</button>
        </div>
      )}

      <div className="story-topbar">
        <span className="story-chapter-tag">🏆 {ending.title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="story-page-count">{panelIndex + 1}/{ending.panels.length}</span>
          <button className="story-close-btn" onClick={() => setShowFinal(true)} aria-label="Pular para vitória">✕</button>
        </div>
      </div>

      <div className="story-image-zoom-wrap" onClick={() => setImageZoom(true)}>
        <img src={ending.image} alt={ending.title} className="story-image" />
        <span className="story-image-zoom-hint">🔍 ampliar</span>
      </div>

      <div className={`story-dialogue ${isNarrator ? 'dlg-narrator' : isHero ? 'dlg-hero' : 'dlg-villain'}`}>
        {!isNarrator && (
          <span className="dlg-speaker" style={{ color: isHero ? hero.color : '#FF8888' }}>
            {panel.speaker}
          </span>
        )}
        <p className="dlg-text">{panel.text}</p>
      </div>

      <div className="story-nav">
        <div className="story-dots">
          {ending.panels.map((_, i) => (
            <span key={i}
              className={`story-dot ${i === panelIndex ? 'story-dot-active' : ''}`}
              style={i === panelIndex ? { background: hero.color } : {}}
            />
          ))}
        </div>
        <button className="btn btn-primary story-next-btn"
          style={{ background: hero.color }} onClick={nextPanel}>
          {isLast ? '🏆 Ver vitória!' : 'Próximo →'}
        </button>
        <button className="btn-skip" onClick={() => setShowFinal(true)}>Pular para vitória</button>
      </div>
    </div>
  )
}
