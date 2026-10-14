import { useState, useEffect, useRef, useCallback } from 'react'
import { HEROES, VILLAINS } from '../../data/heroes.js'
import { soundEngine } from '../../audio/soundEngine.js'
import { SurtoArt, ImpasseArt, FragmentoArt, EclipseArt } from '../art/VillainArt.jsx'
import MitosArt from '../art/MitosArt.jsx'
import PampeeArt from '../art/PampeeArt.jsx'
import GaldiosArt from '../art/GaldiosArt.jsx'
import NiaArt from '../art/NiaArt.jsx'

const VILLAIN_ART = { surto: SurtoArt, impasse: ImpasseArt, fragmento: FragmentoArt, eclipse: EclipseArt }
const HERO_ART = { mitos: MitosArt, pampee: PampeeArt, galdios: GaldiosArt, nia: NiaArt }

// 0 = grass (walkable), 1 = obstacle
const MAP = [
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,1,0,0,0,0,0,0,1],
  [1,0,0,0,1,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,1,0,0,0,0,0,1],
  [1,0,0,0,0,0,1,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,1,0,0,0,0,0,0,1],
  [1,0,0,0,0,1,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,1,0,0,0,0,1],
  [1,1,0,0,0,0,0,1,1,1],
]
const ROWS = 12
const COLS = 10

// Villain challenge spots — phases 1-10
const SPOTS = [
  { phase: 1,  row: 10, col: 6 },
  { phase: 2,  row: 10, col: 2 },
  { phase: 3,  row: 9,  col: 5 },
  { phase: 4,  row: 8,  col: 3 },
  { phase: 5,  row: 8,  col: 7 },
  { phase: 6,  row: 6,  col: 4 },
  { phase: 7,  row: 5,  col: 2 },
  { phase: 8,  row: 4,  col: 6 },
  { phase: 9,  row: 2,  col: 6 },
  { phase: 10, row: 0,  col: 4 },
]

const HERO_START = { row: 11, col: 4 }

// Tile backgrounds per hero theme
const GRASS_COLOR = { mitos: '#061220', pampee: '#120e00', galdios: '#120400', nia: '#070010' }
const PATH_COLOR  = { mitos: '#0a1e32', pampee: '#1a1400', galdios: '#1c0600', nia: '#0c0018' }
const TREE_EMOJI  = { mitos: '⚡', pampee: '🌿', galdios: '🪨', nia: '💫' }

export default function WorldMap({ heroId, heroProgress, onBattle, onBack, lastWonPhase }) {
  const hero = HEROES[heroId]
  const villain = VILLAINS[hero.villain]
  const HeroArt  = HERO_ART[heroId]
  const VillainArtComp = VILLAIN_ART[hero.villain]

  const completed = heroProgress?.phasesCompleted || []
  const [pos, setPos] = useState({ ...HERO_START })
  const [confirm, setConfirm] = useState(null)
  const [winBanner, setWinBanner] = useState(lastWonPhase || null)
  const touchRef = useRef(null)

  useEffect(() => {
    if (winBanner) {
      const t = setTimeout(() => setWinBanner(null), 2800)
      return () => clearTimeout(t)
    }
  }, [winBanner])

  // Tile size — fill width minus padding
  const tileSize = Math.min(Math.floor((Math.min(window.innerWidth, 600) - 24) / COLS), 50)

  const spotAt = useCallback((r, c) =>
    SPOTS.find(s => s.row === r && s.col === c && !completed.includes(s.phase))
  , [completed])

  const move = useCallback((dr, dc) => {
    setPos(cur => {
      const r = cur.row + dr
      const c = cur.col + dc
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return cur
      if (MAP[r][c] === 1) return cur   // obstacle
      const spot = spotAt(r, c)
      if (spot) {
        soundEngine.playClick()
        setConfirm(spot.phase)
        return cur   // bumped into villain — stay put
      }
      return { row: r, col: c }
    })
  }, [spotAt])

  // Keyboard arrows + WASD
  useEffect(() => {
    const handle = (e) => {
      if (['ArrowUp','w','ArrowDown','s','ArrowLeft','a','ArrowRight','d'].includes(e.key)) {
        e.preventDefault()
        const dirs = { ArrowUp:'u', w:'u', ArrowDown:'d2', s:'d2', ArrowLeft:'l', a:'l', ArrowRight:'r', d:'r' }
        const dir = dirs[e.key]
        if (dir === 'u') move(-1, 0)
        else if (dir === 'd2') move(1, 0)
        else if (dir === 'l') move(0, -1)
        else move(0, 1)
      }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [move])

  // Swipe gesture on map
  function onTouchStart(e) { touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY } }
  function onTouchEnd(e) {
    if (!touchRef.current) return
    const dx = e.changedTouches[0].clientX - touchRef.current.x
    const dy = e.changedTouches[0].clientY - touchRef.current.y
    const threshold = 24
    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > threshold) move(0, dx > 0 ? 1 : -1)
    } else {
      if (Math.abs(dy) > threshold) move(dy > 0 ? 1 : -1, 0)
    }
    touchRef.current = null
  }

  function startBattle() {
    const phase = confirm
    setConfirm(null)
    onBattle(phase)
  }

  const totalDefeated = completed.length
  const allDefeated = totalDefeated >= 10

  return (
    <div
      className={`screen screen-worldmap bg-${heroId}`}
      style={{ '--hero-color': hero.color, '--hero-glow': hero.colorGlow }}
    >
      {/* Header */}
      <div className="wm-header">
        <button className="btn-back-sm" onClick={onBack}>← Heróis</button>
        <div className="wm-hero-label">
          <span className="wm-hero-name" style={{ color: hero.color }}>{hero.name}</span>
          <span className="wm-progress">{totalDefeated}/10 {totalDefeated === 1 ? 'derrotado' : 'derrotados'}</span>
        </div>
        {allDefeated
          ? <span className="wm-complete-badge">✅ Completo!</span>
          : <span className="wm-phase-hint">{hero.themeIcon} {hero.theme}</span>
        }
      </div>

      {/* Win banner — shown briefly after returning from battle */}
      {winBanner && (
        <div className="wm-win-banner" style={{ borderColor: hero.color }}>
          <span className="wm-win-icon">🏆</span>
          <span className="wm-win-text">
            {winBanner === 10
              ? 'Missão completa! Você venceu!'
              : `Fase ${winBanner} conquistada!`}
          </span>
        </div>
      )}

      {/* Battle confirm dialog */}
      {confirm !== null && (
        <div className="wm-overlay">
          <div className="wm-confirm">
            <div className="wm-confirm-villain">
              <VillainArtComp size={88} />
            </div>
            <p className="wm-confirm-name">{villain.name}</p>
            <p className="wm-confirm-phase">Fase {confirm}{confirm === 10 ? ' — CHEFE FINAL! ⚔️' : ''}</p>
            <p className="wm-confirm-quote">
              "{confirm === 10
                ? villain.taunt
                : `Fase ${confirm}! Enfrente-me se tiver coragem!`}"
            </p>
            <div className="wm-confirm-actions">
              <button
                className="btn btn-primary"
                style={{ background: confirm === 10 ? '#FF4444' : hero.color }}
                onClick={startBattle}
              >
                {confirm === 10 ? '⚔️ Batalha Final!' : '⚔️ Batalhar!'}
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setConfirm(null)}>
                Recuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map grid */}
      <div
        className="wm-grid"
        style={{
          gridTemplateColumns: `repeat(${COLS}, ${tileSize}px)`,
          width: COLS * tileSize,
          height: ROWS * tileSize,
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {MAP.map((row, r) => row.map((tile, c) => {
          const spot = SPOTS.find(s => s.row === r && s.col === c)
          const isDefeated = spot && completed.includes(spot.phase)
          const isActive   = spot && !completed.includes(spot.phase)
          const isBoss     = spot?.phase === 10
          const isHero     = pos.row === r && pos.col === c

          return (
            <div
              key={`${r}-${c}`}
              className={`wm-tile${tile === 1 ? ' wm-obstacle' : ''}`}
              style={{
                width: tileSize,
                height: tileSize,
                background: tile === 0
                  ? (r % 2 === c % 2 ? GRASS_COLOR[heroId] : PATH_COLOR[heroId])
                  : 'rgba(0,0,0,0.55)',
              }}
            >
              {/* Obstacle decoration */}
              {tile === 1 && (
                <span style={{ fontSize: tileSize * 0.52, lineHeight: 1 }}>
                  {TREE_EMOJI[heroId]}
                </span>
              )}

              {/* Active villain */}
              {isActive && !isHero && (
                <div className={`wm-villain${isBoss ? ' wm-villain-boss' : ''}`}
                  style={{ width: tileSize - 2, height: tileSize - 2 }}>
                  <VillainArtComp size={tileSize - 6} />
                  <span className="wm-badge"
                    style={{ background: isBoss ? '#FF4444' : 'rgba(0,0,0,0.75)' }}>
                    {spot.phase}
                  </span>
                </div>
              )}

              {/* Defeated → star badge */}
              {isDefeated && !isHero && (
                <div className="wm-freed-badge" style={{ fontSize: tileSize * 0.36 }}>
                  <span className="wm-freed-star">★</span>
                  <span className="wm-freed-num">{spot?.phase}</span>
                </div>
              )}

              {/* Hero */}
              {isHero && (
                <div className="wm-hero" style={{ width: tileSize - 2, height: tileSize - 2 }}>
                  <HeroArt size={tileSize - 4} />
                </div>
              )}
            </div>
          )
        }))}
      </div>

      {/* D-pad controls */}
      <div className="wm-dpad" role="group" aria-label="Controles de movimento">
        <div className="dpad-row">
          <button className="dpad-btn" onClick={() => move(-1, 0)} aria-label="Mover para cima">▲</button>
        </div>
        <div className="dpad-row">
          <button className="dpad-btn" onClick={() => move(0, -1)} aria-label="Mover para a esquerda">◄</button>
          <div className="dpad-center" style={{ color: hero.color }} aria-hidden="true">{hero.themeIcon}</div>
          <button className="dpad-btn" onClick={() => move(0, 1)} aria-label="Mover para a direita">►</button>
        </div>
        <div className="dpad-row">
          <button className="dpad-btn" onClick={() => move(1, 0)} aria-label="Mover para baixo">▼</button>
        </div>
      </div>

      <p className="wm-hint">Mova até o inimigo para batalhar • Teclas ↑↓←→ ou deslize</p>
    </div>
  )
}
