import { useState, useEffect, useCallback } from 'react'
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

const ROOM_API = import.meta.env.VITE_ROOM_API_URL ?? ''
const FOCUS_LABEL = { fracoes: 'Frações', problemas: 'Problemas', logica: 'Lógica' }
const TYPE_LABEL  = { tarefa: 'Tarefa', prova: 'Estudo p/ Prova' }

// Lê taskId da URL uma única vez
function getUrlTaskId() {
  try { return new URL(window.location.href).searchParams.get('taskId') }
  catch { return null }
}

// ── Banner de missão ──────────────────────────────────────────────────────────
function MissionBanner({ task }) {
  if (!task) return null
  const focusLabels = (task.focus ?? []).map(f => FOCUS_LABEL[f] ?? f).join(', ')
  return (
    <div className="mission-banner">
      <span className="mission-banner-icon">🎯</span>
      <div className="mission-banner-text">
        <span className="mission-banner-type">{TYPE_LABEL[task.type] ?? task.type}</span>
        <span className="mission-banner-title">{task.title}</span>
        {focusLabels && <span className="mission-banner-focus">{focusLabels}</span>}
      </div>
    </div>
  )
}

// ── Modal de registro de conclusão ────────────────────────────────────────────
function MissionCompleteModal({ task, onRegister, onSkip }) {
  const [name,    setName]    = useState('')
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)
  const [err,     setErr]     = useState('')

  async function submit(e) {
    e.preventDefault()
    if (!name.trim()) { setErr('Digite seu nome'); return }
    setLoading(true)
    setErr('')
    try {
      const res = await fetch(`${ROOM_API}/api/tasks/${task.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName: name.trim() }),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? 'Erro') }
      setDone(true)
      setTimeout(() => onRegister(), 2500)
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mission-modal-overlay">
      <div className="mission-modal">
        {done ? (
          <>
            <div className="mission-modal-icon">🏆</div>
            <h2 className="mission-modal-title">Missão registrada!</h2>
            <p className="mission-modal-sub">Seu professor foi notificado. Continue jogando!</p>
          </>
        ) : (
          <>
            <div className="mission-modal-icon">⭐</div>
            <h2 className="mission-modal-title">Missão concluída!</h2>
            <p className="mission-modal-sub">
              Você completou a tarefa <strong>{task.title}</strong>.
              Registre seu nome para o professor saber.
            </p>
            {err && <p className="mission-modal-err">{err}</p>}
            <form className="mission-modal-form" onSubmit={submit}>
              <input
                className="mission-modal-input"
                placeholder="Seu nome completo"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                className="mission-modal-btn"
                disabled={loading}
              >
                {loading ? 'Registrando...' : 'Registrar'}
              </button>
            </form>
            <button className="mission-modal-skip" onClick={onSkip}>
              Pular (já me cadastrei)
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ── App principal ─────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState({ name: 'start' })
  const [muted,  setMuted]  = useState(false)
  const { progress, completePhase, markFirstType, hasSeenFirstType, getHeroProgress } = useProgress()

  // missão
  const [taskId]          = useState(() => getUrlTaskId())
  const [task,    setTask]    = useState(null)
  const [externalQuestions, setExternalQuestions] = useState([])
  const [sessionWins, setSessionWins] = useState(0)
  const [showMissionModal, setShowMissionModal] = useState(false)
  const [taskRegistered,   setTaskRegistered]   = useState(false)

  useEffect(() => {
    if (!taskId || !ROOM_API) return
    fetch(`${ROOM_API}/api/tasks/${taskId}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d && d.status === 'active') setTask(d) })
      .catch(() => {})
  }, [taskId])

  // Quando a tarefa tem tópico de matéria, carrega as questões geradas
  useEffect(() => {
    if (!task?.subject_topic_id || !ROOM_API) return
    fetch(`${ROOM_API}/api/topics/${task.subject_topic_id}/questions`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setExternalQuestions(data ?? []))
      .catch(() => {})
  }, [task])

  // ── navegação ────────────────────────────────────────────────────────────────
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

  // ── resultados de batalha ────────────────────────────────────────────────────
  function handleBattleWin(heroId, phase, hearts, correctCount) {
    completePhase(heroId, phase, hearts, correctCount)
    soundEngine.startTheme('worldMap')
    setScreen({ name: 'phase-result', type: 'win', heroId, phase, hearts, correctCount })

    if (task && !taskRegistered) {
      const wins = sessionWins + 1
      setSessionWins(wins)
      if (wins >= 3) setShowMissionModal(true)
    }
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

  // ── tela de ending: mostra modal se não registrou ainda ──────────────────────
  function handleEndingFinish(heroId) {
    if (task && !taskRegistered) setShowMissionModal(true)
    goWorldMap(heroId)
  }

  // ── renderização ─────────────────────────────────────────────────────────────
  function renderScreen() {
    const s = screen
    if (s.name === 'start')       return <StartScreen onStart={goHeroSelect} task={task} />
    if (s.name === 'hero-select') return <HeroSelect onSelect={goWorldMap} progress={progress} />
    if (s.name === 'world-map')   return (
      <WorldMap
        heroId={s.heroId}
        heroProgress={getHeroProgress(s.heroId)}
        onBattle={(phase) => goPhase(s.heroId, phase)}
        onBack={goHeroSelect}
        lastWonPhase={s.lastWonPhase}
      />
    )
    if (s.name === 'battle') return (
      <Battle
        heroId={s.heroId}
        phase={s.phase}
        taskFocus={task?.focus}
        externalQuestions={externalQuestions.length > 0 ? externalQuestions : null}
        onWin={(hearts, correct) => handleBattleWin(s.heroId, s.phase, hearts, correct)}
        onLose={() => handleBattleLose(s.heroId, s.phase)}
        onBack={() => goWorldMap(s.heroId)}
        hasSeenFirstType={hasSeenFirstType}
        onMarkFirstType={markFirstType}
      />
    )
    if (s.name === 'phase-result') return (
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
    if (s.name === 'comic') return (
      <ComicPanel
        heroId={s.heroId}
        comicIndex={s.comicIndex}
        onContinue={() => goWorldMap(s.heroId, s.lastWonPhase)}
      />
    )
    if (s.name === 'ending') return (
      <Ending
        heroId={s.heroId}
        onFinish={() => handleEndingFinish(s.heroId)}
      />
    )
    return <StartScreen onStart={goHeroSelect} task={task} />
  }

  const heroId      = screen.heroId || null
  const hero        = heroId ? HEROES[heroId] : null
  const heroProgress = heroId ? progress[heroId] : null

  return (
    <div className="app-layout">
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

      <div className="app-main">
        {task && <MissionBanner task={task} />}
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

      <aside className="dsk-sidebar dsk-right" aria-hidden="true">
        {hero && heroProgress ? (
          <div className="dsk-progress-panel">
            <h3 className="dsk-panel-title">Progresso</h3>
            <div className="dsk-pdots">
              {Array.from({ length: 10 }, (_, i) => {
                const ph   = i + 1
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
            {task && (
              <div className="dsk-mission-info">
                <span className="dsk-mission-label">Missão ativa</span>
                <span className="dsk-mission-wins">{Math.min(sessionWins, 3)}/3 batalhas</span>
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

      {showMissionModal && task && (
        <MissionCompleteModal
          task={task}
          onRegister={() => { setTaskRegistered(true); setShowMissionModal(false) }}
          onSkip={() => { setTaskRegistered(true); setShowMissionModal(false) }}
        />
      )}
    </div>
  )
}
