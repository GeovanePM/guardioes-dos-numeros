import { HEROES, VILLAINS } from '../../data/heroes.js'
import MitosArt from '../art/MitosArt.jsx'
import PampeeArt from '../art/PampeeArt.jsx'
import GaldiosArt from '../art/GaldiosArt.jsx'
import NiaArt from '../art/NiaArt.jsx'
import { SurtoArt, ImpasseArt, FragmentoArt, EclipseArt } from '../art/VillainArt.jsx'

const ART_MAP = { mitos: MitosArt, pampee: PampeeArt, galdios: GaldiosArt, nia: NiaArt }
const VILLAIN_ART_MAP = { surto: SurtoArt, impasse: ImpasseArt, fragmento: FragmentoArt, eclipse: EclipseArt }

const PHASE_LABELS = {
  1: 'Início', 2: 'Aprendiz', 3: 'Explorador', 4: 'Desafiante',
  5: 'Guerreiro', 6: 'Veterano', 7: 'Especialista', 8: 'Mestre',
  9: 'Elite', 10: 'Chefe Final'
}

export default function PhaseMap({ heroId, heroProgress, onPhaseSelect, onBack }) {
  const hero = HEROES[heroId]
  const villain = VILLAINS[hero.villain]
  const HeroArt = ART_MAP[heroId]
  const VillainArt = VILLAIN_ART_MAP[hero.villain]
  const maxUnlocked = heroProgress?.maxPhaseUnlocked || 1
  const completed = heroProgress?.phasesCompleted || []
  const xp = heroProgress?.xp || 0
  const ending = heroProgress?.ending || false

  return (
    <div
      className={`screen screen-map bg-${heroId}`}
      style={{ '--hero-color': hero.color, '--hero-color-dark': hero.colorDark, '--hero-glow': hero.colorGlow }}
    >
      {/* Header */}
      <div className="map-header">
        <button className="btn-back" onClick={onBack} aria-label="Voltar">← Heróis</button>
        <div className="map-hero-info">
          <span className="map-hero-name">{hero.name}</span>
          <span className="map-hero-class">Turma {hero.className}</span>
        </div>
        <div className="map-xp">
          <span className="xp-icon">⭐</span>
          <span className="xp-value">{xp} XP</span>
        </div>
      </div>

      {/* Hero + Villain art */}
      <div className="map-art-row">
        <div className="map-hero-art">
          <HeroArt size={110} />
        </div>
        <div className="map-vs-area">
          <div className="map-theme-badge">
            {hero.themeIcon} {hero.theme}
          </div>
          {ending && <div className="map-victory-badge">🏆 Concluído!</div>}
        </div>
        <div className="map-villain-art">
          <VillainArt size={100} />
          <p className="villain-name-small">{villain.name}</p>
        </div>
      </div>

      {/* Phase trail */}
      <div className="phase-trail">
        <div className="trail-path">
          {Array.from({ length: 10 }, (_, i) => {
            const phase = i + 1
            const isCompleted = completed.includes(phase)
            const isUnlocked = phase <= maxUnlocked
            const isBoss = phase === 10
            const isCurrent = phase === maxUnlocked && !isCompleted

            return (
              <div key={phase} className={`phase-node-wrap phase-pos-${phase}`}>
                {/* Connector line */}
                {phase < 10 && (
                  <div className={`trail-line ${isCompleted ? 'trail-line-done' : ''}`} />
                )}

                <button
                  className={`phase-node ${isCompleted ? 'phase-done' : ''} ${isUnlocked && !isCompleted ? 'phase-unlocked' : ''} ${!isUnlocked ? 'phase-locked' : ''} ${isBoss ? 'phase-boss' : ''} ${isCurrent ? 'phase-current' : ''}`}
                  onClick={() => isUnlocked && onPhaseSelect(phase)}
                  disabled={!isUnlocked}
                  aria-label={`Fase ${phase}: ${PHASE_LABELS[phase]}${!isUnlocked ? ' (bloqueada)' : isCompleted ? ' (concluída)' : ''}`}
                >
                  <span className="phase-num">
                    {isCompleted ? '✓' : !isUnlocked ? '🔒' : isBoss ? '💀' : `${phase}`}
                  </span>
                </button>

                <div className="phase-label-wrap">
                  <span className={`phase-label ${isBoss ? 'phase-label-boss' : ''}`}>
                    {isBoss ? villain.name : PHASE_LABELS[phase]}
                  </span>
                  {isBoss && <span className="phase-sublabel">Chefe Final</span>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Comics unlocked notice */}
      {(heroProgress?.comicsUnlocked?.length || 0) > 0 && (
        <div className="comics-notice">
          <span>📖 {heroProgress.comicsUnlocked.length} quadrinho{heroProgress.comicsUnlocked.length > 1 ? 's' : ''} desbloqueado{heroProgress.comicsUnlocked.length > 1 ? 's' : ''}!</span>
        </div>
      )}
    </div>
  )
}
