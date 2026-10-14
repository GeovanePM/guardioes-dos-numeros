import { useState } from 'react'
import { useProgress } from './hooks/useProgress.js'
import { STORIES } from './data/stories.js'
import { HEROES } from './data/heroes.js'
import { soundEngine } from './audio/soundEngine.js'
import StartScreen from './components/screens/StartScreen.jsx'
import HeroSelect from './components/screens/HeroSelect.jsx'
import WorldMap from './components/screens/WorldMap.jsx'
import Battle from './components/screens/Battle.jsx'
import PhaseResultScreen from './components/screens/PhaseResultScreen.jsx'
import ComicPanel from './components/screens/ComicPanel.jsx'
import Ending from './components/screens/Ending.jsx'
import './styles/globals.css'

export default function App() {
  const [screen, setScreen] = useState({ name: 'start' })
  const [muted, setMuted] = useState(false)
  const { progress, completePhase, markFirstType, hasSeenFirstType, getHeroProgress } = useProgress()

  // ─── navigation helpers with theme changes ────────────────────────────────
  function goHeroSelect() {
    soundEngine.startTheme('heroSelect')
    setScreen({ name: 'hero-select' })
  }

  function goWorldMap(heroId, lastWonPhase) {
    soundEngine.startTheme('worldMap')
    setScreen({ name: 'world-map', heroId, lastWonPhase: lastWonPhase || null })
  }

  function goPhase(heroId, phase) {
    soundEngine.startTheme('battle')
    setScreen({ name: 'battle', heroId, phase })
  }

  // ─── battle outcomes ──────────────────────────────────────────────────────
  function handleBattleWin(heroId, phase, hearts, correctCount) {
    completePhase(heroId, phase, hearts, correctCount)
    soundEngine.startTheme('worldMap')      // switch music before result screen
    setScreen({ name: 'phase-result', type: 'win', heroId, phase, hearts, correctCount })
  }

  function handleBattleLose(heroId, phase) {
    soundEngine.startTheme('worldMap')
    setScreen({ name: 'phase-result', type: 'lose', heroId, phase, hearts: 0 })
  }

  function handleResultContinue(heroId, phase) {
    const comicPhases = [2, 4, 6, 8]
    const heroStories = STORIES[heroId] || []
    if (phase === 10) { setScreen({ name: 'ending', heroId }); return }
    if (comicPhases.includes(phase)) {
      const comicIndex = comicPhases.indexOf(phase)
      if (comicIndex < heroStories.length) {
        setScreen({ name: 'comic', heroId, comicIndex, lastWonPhase: phase })
        return
      }
    }
    goWorldMap(heroId, phase)
  }

  function toggleMute() {
    const nowMuted = soundEngine.toggleMute()
    setMuted(nowMuted)
  }

  // ─── screen routing ───────────────────────────────────────────────────────
  function renderScreen() {
    const s = screen

    if (s.name === 'start') {
      return <StartScreen onStart={goHeroSelect} />
    }
    if (s.name === 'hero-select') {
      return <HeroSelect onSelect={goWorldMap} progress={progress} />
    }
    if (s.name === 'world-map') {
      return (
        <WorldMap
          heroId={s.heroId}
          heroProgress={getHeroProgress(s.heroId)}
          onBattle={(phase) => goPhase(s.heroId, phase)}
          onBack={goHeroSelect}
          lastWonPhase={s.lastWonPhase}
        />
      )
    }
    if (s.name === 'battle') {
      return (
        <Battle
          heroId={s.heroId}
          phase={s.phase}
          onWin={(hearts, correct) => handleBattleWin(s.heroId, s.phase, hearts, correct)}
          onLose={() => handleBattleLose(s.heroId, s.phase)}
          onBack={() => goWorldMap(s.heroId)}
          hasSeenFirstType={hasSeenFirstType}
          onMarkFirstType={markFirstType}
        />
      )
    }
    if (s.name === 'phase-result') {
      return (
        <PhaseResultScreen
          type={s.type}
          heroId={s.heroId}
          phase={s.phase}
          hearts={s.hearts}
          correctCount={s.correctCount || 0}
          onContinue={() => handleResultContinue(s.heroId, s.phase)}
          onRetry={() => goPhase(s.heroId, s.phase)}
          onMap={() => goWorldMap(s.heroId)}
        />
      )
    }
    if (s.name === 'comic') {
      return (
        <ComicPanel
          heroId={s.heroId}
          comicIndex={s.comicIndex}
          onContinue={() => goWorldMap(s.heroId, s.lastWonPhase)}
        />
      )
    }
    if (s.name === 'ending') {
      return (
        <Ending
          heroId={s.heroId}
          onFinish={() => goWorldMap(s.heroId)}
        />
      )
    }
    return <StartScreen onStart={goHeroSelect} />
  }

  const heroId = screen.heroId || null
  const hero = heroId ? HEROES[heroId] : null
  const heroProgress = heroId ? progress[heroId] : null

  return (
    <div className="app-layout">
      {/* ── Desktop left sidebar ── */}
      <aside className="dsk-sidebar dsk-left" aria-hidden="true">
        {hero ? (
          <div className="dsk-hero-panel">
            <img src={`/assets/${heroId}.png`} alt="" className="dsk-hero-img" />
            <h2 className="dsk-hero-name" style={{ color: hero.color }}>{hero.name}</h2>
            <p className="dsk-hero-class">Turma {hero.className}</p>
            <p className="dsk-hero-theme">{hero.themeIcon} {hero.theme}</p>
          </div>
        ) : (
          <div className="dsk-logo-panel">
            <img src="/assets/logo.jpg" alt="" className="dsk-logo-img" />
            <p className="dsk-logo-tagline">Heróis da Matemática</p>
            <div className="dsk-hero-icons">
              <span>⚡ Mitos</span>
              <span>🔍 Pampee</span>
              <span>🛡️ Galdios</span>
              <span>⭐ Nia</span>
            </div>
          </div>
        )}
      </aside>

      {/* ── Main content ── */}
      <div className="app-main">
        {renderScreen()}
        {screen.name !== 'start' && (
          <button
            className={`btn-mute btn-mute-float${muted ? ' muted' : ''}`}
            onClick={toggleMute}
            aria-label={muted ? 'Ativar som' : 'Silenciar som'}
            title={muted ? 'Ativar som' : 'Silenciar som'}
          >
            {muted ? '🔇' : '🎵'}
          </button>
        )}
      </div>

      {/* ── Desktop right sidebar ── */}
      <aside className="dsk-sidebar dsk-right" aria-hidden="true">
        {hero && heroProgress ? (
          <div className="dsk-progress-panel">
            <h3 className="dsk-panel-title">Progresso</h3>
            <div className="dsk-pdots">
              {Array.from({ length: 10 }, (_, i) => {
                const ph = i + 1
                const done = (heroProgress.phasesCompleted || []).includes(ph)
                return (
                  <div key={ph} className={`dsk-pdot${done ? ' dsk-pdot-done' : ''}`}
                    style={done ? { background: hero.color } : {}}>
                    {done ? '★' : ph}
                  </div>
                )
              })}
            </div>
            <p className="dsk-xp">⚡ {heroProgress.xp || 0} XP</p>
            <p className="dsk-phases-done">
              {(heroProgress.phasesCompleted || []).length}/10 fases
            </p>
            {screen.phase && (
              <div className="dsk-phase-now" style={{ borderColor: hero.color }}>
                <span className="dsk-phase-now-label">Fase atual</span>
                <span className="dsk-phase-now-num" style={{ color: hero.color }}>{screen.phase}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="dsk-mission-panel">
            <h3 className="dsk-panel-title">Missão</h3>
            <p className="dsk-mission-text">
              O Comandante Caos embaralhou os números do Reino da Matemática!
            </p>
            <p className="dsk-mission-text">
              4 heróis representam as turmas do 5º ano. Escolha o seu e restaure a ordem!
            </p>
            <div className="dsk-mission-types">
              <span>÷ Frações</span>
              <span>📋 Problemas</span>
              <span>🧩 Lógica</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}
