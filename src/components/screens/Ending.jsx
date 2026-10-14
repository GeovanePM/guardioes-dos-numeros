import { useState } from 'react'
import { HEROES, VILLAINS } from '../../data/heroes.js'
import { ENDINGS } from '../../data/stories.js'
import MitosArt from '../art/MitosArt.jsx'
import PampeeArt from '../art/PampeeArt.jsx'
import GaldiosArt from '../art/GaldiosArt.jsx'
import NiaArt from '../art/NiaArt.jsx'
import { SurtoArt, ImpasseArt, FragmentoArt, EclipseArt } from '../art/VillainArt.jsx'

const ART_MAP = { mitos: MitosArt, pampee: PampeeArt, galdios: GaldiosArt, nia: NiaArt }
const VILLAIN_ART_MAP = { surto: SurtoArt, impasse: ImpasseArt, fragmento: FragmentoArt, eclipse: EclipseArt }

export default function Ending({ heroId, onFinish }) {
  const hero = HEROES[heroId]
  const villain = VILLAINS[hero.villain]
  const ending = ENDINGS[heroId]
  const HeroArt = ART_MAP[heroId]
  const VillainArt = VILLAIN_ART_MAP[hero.villain]
  const [panelIndex, setPanelIndex] = useState(0)
  const [showFinal, setShowFinal] = useState(false)

  const panel = ending.panels[panelIndex]
  const isLast = panelIndex >= ending.panels.length - 1
  const isHero = panel.speaker === hero.name
  const isVillain = panel.speaker === villain.name

  function nextPanel() {
    if (isLast) {
      setShowFinal(true)
    } else {
      setPanelIndex(i => i + 1)
    }
  }

  if (showFinal) {
    return (
      <div
        className={`screen screen-ending bg-${heroId}`}
        style={{ '--hero-color': hero.color, '--hero-color-dark': hero.colorDark }}
      >
        <div className="ending-victory">
          <div className="victory-stars">
            {['⭐', '🌟', '✨', '⭐', '🌟'].map((s, i) => (
              <span key={i} className="victory-star" style={{ animationDelay: `${i * 0.15}s` }}>{s}</span>
            ))}
          </div>
          <div className="victory-art">
            <HeroArt size={180} className="art-victory" />
          </div>
          <h2 className="victory-title">{ending.title}</h2>
          <p className="victory-class">🏆 Turma {hero.className} — Missão Cumprida!</p>
          <div className="victory-stats">
            <div className="stat-box">
              <span className="stat-icon">⚔️</span>
              <span className="stat-label">10 Fases</span>
              <span className="stat-sub">Concluídas</span>
            </div>
            <div className="stat-box">
              <span className="stat-icon">💀</span>
              <span className="stat-label">{villain.name}</span>
              <span className="stat-sub">Derrotado</span>
            </div>
            <div className="stat-box">
              <span className="stat-icon">{hero.themeIcon}</span>
              <span className="stat-label">{hero.theme}</span>
              <span className="stat-sub">Restaurado</span>
            </div>
          </div>
          <button
            className="btn btn-primary btn-large"
            style={{ background: hero.color }}
            onClick={onFinish}
          >
            Voltar ao Mapa 🗺️
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`screen screen-ending screen-comic bg-${heroId}`}
      style={{ '--hero-color': hero.color, '--hero-color-dark': hero.colorDark }}
    >
      <div className="comic-header">
        <span className="comic-badge ending-badge">🏆 Final Desbloqueado!</span>
        <h2 className="comic-title">{ending.title}</h2>
        <span className="comic-pages">{panelIndex + 1}/{ending.panels.length}</span>
      </div>

      <div className="comic-frame comic-frame-ending">
        <div className="comic-art-duo">
          <div className={`art-duo-hero ${isHero ? 'art-spotlight' : 'art-dimmed'}`}>
            <HeroArt size={110} />
          </div>
          <div className={`art-duo-villain ${isVillain ? 'art-spotlight villain-defeated' : 'art-dimmed'}`}>
            <VillainArt size={90} />
          </div>
        </div>

        <div className={`comic-bubble ${isHero ? 'bubble-hero' : isVillain ? 'bubble-villain' : 'bubble-narrator'}`}>
          {panel.speaker !== 'Narrador' && (
            <p className="bubble-speaker" style={isHero ? { color: hero.color } : { color: villain.color }}>
              {panel.speaker}
            </p>
          )}
          <p className="bubble-text">{panel.text}</p>
        </div>
      </div>

      <div className="comic-nav">
        <div className="comic-dots">
          {ending.panels.map((_, i) => (
            <span key={i} className={`comic-dot ${i === panelIndex ? 'comic-dot-active' : ''}`} style={i === panelIndex ? { background: hero.color } : {}} />
          ))}
        </div>
        <button
          className="btn btn-primary btn-large"
          style={{ background: hero.color }}
          onClick={nextPanel}
        >
          {isLast ? '🏆 Ver vitória!' : 'Próximo →'}
        </button>
      </div>
    </div>
  )
}
