import { useState } from 'react'
import { HEROES, HERO_ORDER } from '../../data/heroes.js'
import { CLAUDIANIS_WELCOME } from '../../data/claudianis.js'
import ClaudianisArt from '../art/ClaudianisArt.jsx'
import MitosArt from '../art/MitosArt.jsx'
import PampeeArt from '../art/PampeeArt.jsx'
import GaldiosArt from '../art/GaldiosArt.jsx'
import NiaArt from '../art/NiaArt.jsx'

const ART_MAP = { mitos: MitosArt, pampee: PampeeArt, galdios: GaldiosArt, nia: NiaArt }

const WELCOME_MSG = CLAUDIANIS_WELCOME[Math.floor(Math.random() * CLAUDIANIS_WELCOME.length)]

export default function HeroSelect({ onSelect, progress }) {
  const [hovered, setHovered] = useState(null)

  return (
    <div className="screen screen-hero-select">
      {/* Claudianis welcome */}
      <div className="claudianis-bar">
        <div className="claudianis-avatar-sm">
          <ClaudianisArt size={72} />
        </div>
        <div className="claudianis-welcome-bubble">
          <p className="claudianis-name-sm">Mestre Claudianis</p>
          <p>{WELCOME_MSG}</p>
        </div>
      </div>

      <h2 className="select-title">Escolha seu Herói</h2>

      <div className="hero-grid">
        {HERO_ORDER.map(heroId => {
          const hero = HEROES[heroId]
          const heroProgress = progress[heroId]
          const phasesCompleted = heroProgress?.phasesCompleted?.length || 0
          const Art = ART_MAP[heroId]

          return (
            <button
              key={heroId}
              className={`hero-card hero-card-${heroId} ${hovered === heroId ? 'hero-card-hover' : ''}`}
              style={{
                '--hero-color': hero.color,
                '--hero-color-dark': hero.colorDark,
                '--hero-glow': hero.colorGlow
              }}
              onClick={() => onSelect(heroId)}
              onMouseEnter={() => setHovered(heroId)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(heroId)}
              onBlur={() => setHovered(null)}
              aria-label={`Escolher ${hero.name}, turma ${hero.className}`}
            >
              <div className="hero-card-art">
                <Art size={130} />
              </div>
              <div className="hero-card-info">
                <h3 className="hero-name">{hero.name}</h3>
                <p className="hero-class">Turma {hero.className}</p>
                <p className="hero-theme">{hero.themeIcon} {hero.theme}</p>
                {phasesCompleted > 0 && (
                  <div className="hero-progress-mini">
                    <span className="progress-dots">
                      {Array.from({ length: 10 }, (_, i) => (
                        <span key={i} className={`dot ${(heroProgress?.phasesCompleted || []).includes(i + 1) ? 'dot-done' : ''}`} />
                      ))}
                    </span>
                    <span className="progress-label">{phasesCompleted}/10 fases</span>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
