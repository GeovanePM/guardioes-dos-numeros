import { useState, useEffect, useRef } from 'react'
import { HEROES, VILLAINS } from '../../data/heroes.js'
import { soundEngine } from '../../audio/soundEngine.js'
import { SurtoArt, ImpasseArt, FragmentoArt, EclipseArt } from '../art/VillainArt.jsx'
import MangaBubble from '../ui/MangaBubble.jsx'

const VILLAIN_ART_MAP = { surto: SurtoArt, impasse: ImpasseArt, fragmento: FragmentoArt, eclipse: EclipseArt }

const DEFEAT_MSGS = [
  'Impossível! Fui derrotado por um estudante?!',
  'Não... como ousam conhecer a matemática?!',
  'Argh! Mas isso não é o fim! Voltarei!',
  'Vocês foram sortudos dessa vez! Só dessa vez!',
  'Meu poder... diminuindo... Mas me vejo de novo!',
  'Grrr... você passou desta vez... próxima será diferente!',
]

const LAUGH_MSGS = [
  'HAHAHAHA! Matemática é dura demais pra você!',
  'AHAHAHA! Sabia que não conseguiriam! Que pena!',
  'MUAHAHAHA! Se renda à minha superioridade!',
  'WAHAHA! A matemática derrota covardes assim!',
  'HA-HA-HA! Venham de novo se tiverem coragem!',
]

const SCENARIO_MSGS = {
  mitos:  ['O Vale Elétrico brilha mais forte!', 'A energia voltou ao Vale!', 'Os circuitos estão restaurados!'],
  pampee: ['O enigma foi resolvido!', 'A selva está mais segura!', 'A detetive triunfou!'],
  galdios:['A fortaleza resiste!', 'A blindagem foi preservada!', 'A muralha permanece de pé!'],
  nia:    ['As estrelas brilham novamente!', 'O céu estelar está salvo!', 'A constelação foi restaurada!'],
}

function pickMsg(arr) { return arr[Math.floor(Math.random() * arr.length)] }

// ─── Star particles (win only) ───────────────────────────────────────────────
function StarParticles({ color }) {
  const colors = [color, '#FFD700', '#FFF', '#FF6B35', '#FF4EE0']
  return (
    <div className="prs-particles" aria-hidden="true">
      {Array.from({ length: 18 }, (_, i) => (
        <div
          key={i}
          className="prs-particle"
          style={{
            '--x': `${(Math.random() * 200 - 100).toFixed(0)}px`,
            '--y': `${-(60 + Math.random() * 140).toFixed(0)}px`,
            '--rot': `${(Math.random() * 720).toFixed(0)}deg`,
            '--col': colors[i % colors.length],
            '--delay': `${(Math.random() * 0.4).toFixed(2)}s`,
            '--size': `${5 + Math.floor(Math.random() * 7)}px`,
            left: `${10 + Math.random() * 80}%`,
            top: '55%',
          }}
        />
      ))}
    </div>
  )
}

// ─── Hero victory image (tries victory-specific, falls back to normal) ──────
function HeroVictoryImage({ heroId, heroName, color }) {
  const [src, setSrc] = useState(`/assets/heroes/${heroId}-vitoria.png`)
  const fallback = `/assets/${heroId}.png`
  return (
    <img
      src={src}
      alt={`${heroName} vitória`}
      className="prs-hero-victory-img"
      style={{ '--hero-color': color }}
      onError={() => { if (src !== fallback) setSrc(fallback) }}
    />
  )
}

// ═══════════════════════════════════════════════════════════════════════════
export default function PhaseResultScreen({
  type, heroId, phase, hearts, correctCount = 0,
  onContinue, onRetry, onMap
}) {
  const hero = HEROES[heroId]
  const villain = VILLAINS[hero.villain]
  const VillainArt = VILLAIN_ART_MAP[hero.villain]
  const msgRef = useRef(type === 'win' ? pickMsg(DEFEAT_MSGS) : pickMsg(LAUGH_MSGS))
  const scenarioRef = useRef(pickMsg(SCENARIO_MSGS[heroId] || ['Fase concluída!']))
  const msg = msgRef.current

  useEffect(() => {
    if (type === 'win') {
      soundEngine.playExplosion()
    } else {
      soundEngine.playVillainLaugh()
    }
  }, [])

  // ── WIN SCREEN ─────────────────────────────────────────────────────────────
  if (type === 'win') {
    return (
      <div
        className={`screen prs-screen prs-win bg-${heroId}`}
        style={{ '--hero-color': hero.color }}
        role="main"
        aria-label={`Fase ${phase} vencida`}
      >
        <StarParticles color={hero.color} />

        {/* Stars header */}
        <div className="prs-win-header" aria-hidden="true">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="prs-star" style={{ animationDelay: `${i * 0.08}s` }}>⭐</span>
          ))}
        </div>

        <h2 className="prs-win-title" style={{ color: hero.color }}>
          {phase === 10 ? '🏆 Missão Completa!' : `Fase ${phase} Vencida!`}
        </h2>

        <p className="prs-scenario-msg">{scenarioRef.current}</p>

        {/* Hero victory art */}
        <div className="prs-hero-victory" aria-hidden="true">
          <HeroVictoryImage heroId={heroId} heroName={hero.name} color={hero.color} />
        </div>

        {/* Stats row */}
        <div className="prs-result-stats" aria-label={`${hearts} coração${hearts!==1?'s':''} restante${hearts!==1?'s':''}, ${correctCount} acerto${correctCount!==1?'s':''}`}>
          <div className="prs-stat-box">
            <span className="prs-stat-icon">❤️</span>
            <span className="prs-stat-val">{hearts}</span>
            <span className="prs-stat-label">coração{hearts!==1?'s':''}</span>
          </div>
          <div className="prs-stat-box">
            <span className="prs-stat-icon">✅</span>
            <span className="prs-stat-val">{correctCount}/5</span>
            <span className="prs-stat-label">acerto{correctCount!==1?'s':''}</span>
          </div>
        </div>

        {/* Villain defeated (secondary) */}
        <div className="prs-villain-card prs-villain-defeated" aria-hidden="true">
          <div className="prs-villain-art-wrap prs-villain-sm">
            <VillainArt size={96} />
          </div>
          <MangaBubble
            type="shout"
            bgColor="rgba(40,0,0,0.9)"
            borderColor="#FF4444"
            textColor="#FF9999"
            className="prs-villain-bubble"
          >
            <p className="prs-villain-name">{villain.name}</p>
            <p className="prs-villain-msg">"{msg}"</p>
          </MangaBubble>
        </div>

        {/* Action buttons */}
        <div className="prs-win-btns">
          {phase < 10 && (
            <button
              className="btn btn-primary btn-large"
              style={{ background: hero.color }}
              onClick={onContinue}
              aria-label="Ir para a próxima fase"
            >
              Próxima fase →
            </button>
          )}
          {phase === 10 && (
            <button
              className="btn btn-primary btn-large"
              style={{ background: hero.color }}
              onClick={onContinue}
              aria-label="Ver final"
            >
              🏆 Ver final!
            </button>
          )}
          <button
            className="btn btn-secondary"
            onClick={onMap}
            aria-label="Voltar ao mapa"
          >
            🗺️ Voltar ao mapa
          </button>
        </div>
      </div>
    )
  }

  // ── LOSE SCREEN ─────────────────────────────────────────────────────────────
  return (
    <div
      className={`screen prs-screen prs-lose bg-${heroId}`}
      style={{ '--hero-color': hero.color }}
      role="main"
      aria-label="Derrota — tente novamente"
    >
      {/* Villain large, centered, triumphant */}
      <div className="prs-villain-card prs-villain-triumphant" aria-hidden="true">
        <div className="prs-villain-art-wrap prs-villain-big">
          <VillainArt size={220} />
        </div>
        <MangaBubble
          type="shout"
          bgColor="rgba(60,0,0,0.95)"
          borderColor="#FF2200"
          textColor="#FFB0B0"
          className="prs-villain-bubble"
        >
          <p className="prs-villain-name">{villain.name}</p>
          <p className="prs-villain-msg">"{msg}"</p>
        </MangaBubble>
      </div>

      <div className="prs-lose-content">
        <p className="prs-lose-icon" aria-hidden="true">💔</p>
        <p className="prs-lose-title">Os corações acabaram!</p>
        <p className="prs-lose-sub">{hero.name} precisa tentar novamente.</p>
        <div className="prs-lose-btns">
          <button
            className="btn btn-primary btn-large"
            style={{ background: hero.color }}
            onClick={onRetry}
            aria-label="Tentar a fase novamente"
          >
            🔄 Tentar de novo!
          </button>
          <button
            className="btn btn-secondary"
            onClick={onMap}
            aria-label="Voltar ao mapa"
          >
            🗺️ Voltar ao mapa
          </button>
        </div>
      </div>
    </div>
  )
}
