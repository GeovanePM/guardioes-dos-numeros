import { useState } from 'react'
import { HEROES, HERO_ORDER } from '../../data/heroes.js'
import { TEACHERS } from '../../data/teachers.js'
import ClaudianisArt from '../art/ClaudianisArt.jsx'
import LucianisArt from '../art/LucianisArt.jsx'
import LudmilisArt from '../art/LudmilisArt.jsx'
import GabriielisArt from '../art/GabriielisArt.jsx'
import MitosArt from '../art/MitosArt.jsx'
import PampeeArt from '../art/PampeeArt.jsx'
import GaldiosArt from '../art/GaldiosArt.jsx'
import NiaArt from '../art/NiaArt.jsx'

const HERO_ART = { mitos: MitosArt, pampee: PampeeArt, galdios: GaldiosArt, nia: NiaArt }
const TEACHER_ART = { lucianis: LucianisArt, ludmilis: LudmilisArt, gabrielis: GabriielisArt, claudianis: ClaudianisArt }

function pickWelcome(teacherId) {
  const msgs = TEACHERS[teacherId]?.welcome || []
  return msgs[Math.floor(Math.random() * msgs.length)] || ''
}

function ResetModal({ progress, onResetHero, onResetAll, onClose }) {
  const [confirm, setConfirm] = useState(null) // null | 'hero:mitos' | 'all'
  const heroesWithProgress = HERO_ORDER.filter(id => {
    const p = progress[id]
    return p && (p.phasesCompleted?.length > 0 || p.xp > 0)
  })

  if (confirm === 'all') {
    return (
      <div className="reset-overlay" onClick={onClose}>
        <div className="reset-modal" onClick={e => e.stopPropagation()}>
          <p className="reset-confirm-icon">⚠️</p>
          <p className="reset-confirm-msg">Apagar <strong>todo</strong> o progresso? Isso não pode ser desfeito.</p>
          <div className="reset-confirm-btns">
            <button className="btn btn-danger" onClick={() => { onResetAll(); onClose() }}>Sim, apagar tudo</button>
            <button className="btn btn-secondary" onClick={() => setConfirm(null)}>Cancelar</button>
          </div>
        </div>
      </div>
    )
  }

  if (confirm && confirm.startsWith('hero:')) {
    const heroId = confirm.slice(5)
    const hero = HEROES[heroId]
    return (
      <div className="reset-overlay" onClick={onClose}>
        <div className="reset-modal" onClick={e => e.stopPropagation()}>
          <p className="reset-confirm-icon" style={{ color: hero.color }}>{hero.themeIcon}</p>
          <p className="reset-confirm-msg">Reiniciar apenas <strong>{hero.name}</strong>? O progresso deste herói será apagado.</p>
          <div className="reset-confirm-btns">
            <button className="btn btn-danger" onClick={() => { onResetHero(heroId); onClose() }}>Sim, reiniciar</button>
            <button className="btn btn-secondary" onClick={() => setConfirm(null)}>Cancelar</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="reset-overlay" onClick={onClose}>
      <div className="reset-modal" onClick={e => e.stopPropagation()}>
        <h3 className="reset-title">Reiniciar Progresso</h3>
        {heroesWithProgress.length === 0 ? (
          <p className="reset-empty">Nenhum progresso salvo ainda.</p>
        ) : (
          <>
            <p className="reset-sub">Escolha o que deseja reiniciar:</p>
            <div className="reset-hero-list">
              {heroesWithProgress.map(id => {
                const hero = HEROES[id]
                const phases = progress[id]?.phasesCompleted?.length || 0
                return (
                  <button
                    key={id}
                    className="reset-hero-item"
                    style={{ '--hero-color': hero.color }}
                    onClick={() => setConfirm(`hero:${id}`)}
                  >
                    <span className="reset-hero-icon">{hero.themeIcon}</span>
                    <span className="reset-hero-info">
                      <span className="reset-hero-name">{hero.name}</span>
                      <span className="reset-hero-phases">{phases}/10 fases</span>
                    </span>
                    <span className="reset-hero-action">Reiniciar</span>
                  </button>
                )
              })}
            </div>
            <button className="btn btn-danger reset-all-btn" onClick={() => setConfirm('all')}>
              Apagar tudo
            </button>
          </>
        )}
        <button className="btn btn-secondary" onClick={onClose}>Fechar</button>
      </div>
    </div>
  )
}

export default function HeroSelect({ onSelect, progress, onResetHero, onResetAll }) {
  const [hovered, setHovered] = useState(null)
  const [showReset, setShowReset] = useState(false)

  const activeTeacherId = hovered ? HEROES[hovered].teacher : 'claudianis'
  const activeTeacher = TEACHERS[activeTeacherId]
  const TeacherArt = TEACHER_ART[activeTeacherId]
  const [welcomeMsg] = useState(() => ({
    lucianis:  pickWelcome('lucianis'),
    ludmilis:  pickWelcome('ludmilis'),
    gabrielis: pickWelcome('gabrielis'),
    claudianis: pickWelcome('claudianis'),
  }))

  return (
    <div className="screen screen-hero-select">
      {/* Barra da mestra — muda conforme o herói em foco */}
      <div className="claudianis-bar">
        <div className="claudianis-avatar-sm">
          <TeacherArt size={72} />
        </div>
        <div className="claudianis-welcome-bubble">
          <p className="claudianis-name-sm">{activeTeacher.name}</p>
          <p>{welcomeMsg[activeTeacherId]}</p>
        </div>
        <button
          className="reset-gear-btn"
          onClick={() => setShowReset(true)}
          aria-label="Opções de reinício"
          title="Reiniciar progresso"
        >
          ⚙️
        </button>
      </div>

      <h2 className="select-title">Escolha seu Herói</h2>

      <div className="hero-grid">
        {HERO_ORDER.map(heroId => {
          const hero = HEROES[heroId]
          const heroProgress = progress[heroId]
          const phasesCompleted = heroProgress?.phasesCompleted?.length || 0
          const Art = HERO_ART[heroId]
          const teacherId = hero.teacher
          const teacher = TEACHERS[teacherId]

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
                <p className="hero-teacher">👩‍🏫 {teacher.name}</p>
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

      {showReset && (
        <ResetModal
          progress={progress}
          onResetHero={onResetHero}
          onResetAll={onResetAll}
          onClose={() => setShowReset(false)}
        />
      )}
    </div>
  )
}
