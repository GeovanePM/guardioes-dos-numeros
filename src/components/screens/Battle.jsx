import { useState, useEffect, useRef } from 'react'
import { HEROES, VILLAINS } from '../../data/heroes.js'
import { CLAUDIANIS_TIPS } from '../../data/claudianis.js'
import { generateBattle, generateFocusedBattle } from '../../generators/index.js'
import { pick } from '../../generators/utils.js'
import { soundEngine } from '../../audio/soundEngine.js'
import Hearts from '../ui/Hearts.jsx'
import HeroAvatar from '../ui/HeroAvatar.jsx'
import FractionBar, { CompareBars } from '../ui/FractionBar.jsx'
import ClaudianisArt from '../art/ClaudianisArt.jsx'
import { SurtoArt, ImpasseArt, FragmentoArt, EclipseArt } from '../art/VillainArt.jsx'
import MangaBubble from '../ui/MangaBubble.jsx'

const VILLAIN_ART_MAP = { surto: SurtoArt, impasse: ImpasseArt, fragmento: FragmentoArt, eclipse: EclipseArt }

// Messages for each reaction scenario
const MESTRE_CORRECT = [
  'Muito bem! Esse raciocínio é poderoso! ⭐',
  'Excelente! Sua mente é mais forte que qualquer vilão!',
  'Perfeito! Cada acerto enfraquece o inimigo!',
  'Brilhante! A matemática está do seu lado!',
  'Isso mesmo! Continue assim, guardião!',
  'Fantástico! O conhecimento é sua melhor arma!',
  'Você arrasou! A resposta certa nunca falha!',
  'Maravilhoso! Mais um golpe no inimigo!',
]
const VILLAIN_HURT = [
  'Como você acertou?! Impossível!',
  'Não pode ser! Mas não vou desistir!',
  'Ugh! Um golpe de sorte... só isso!',
  'Não! Mas o próximo será diferente!',
  'Grrr... você teve ajuda, com certeza!',
  'Argh! Sinto o golpe... mas não acabou!',
]
const VILLAIN_TAUNT = [
  'Hahaha! Errou! Estou vencendo!',
  'Sabia que não conseguiria! Que fácil!',
  'Ótimo! Mais um erro seu! Continua assim!',
  'Excelente! Continue errando, por favor!',
  'Hah! A matemática não é para você!',
  'Meu plano está funcionando! Erre mais!',
]
const MESTRE_WRONG = [
  'Não desanime! Um erro nos ensina mais que dez acertos. Respira!',
  'Está tudo bem! Você tem mais chances. Foco na próxima!',
  'Releia a pergunta com calma antes de responder. Você consegue!',
  'Continue firme! Os guardiões não desistem nunca!',
  'Vamos! Confio em você, guardião. A próxima é sua!',
  'Não importa o erro — o que importa é continuar tentando!',
]

// Villain intro phrases per phase (pre-phase screen)
const VILLAIN_PHASE_MSGS = [
  null,
  'Fase 1? Mero aquecimento para mim! Não passarão!',
  'Achou que era fácil? A fase 2 vai provar o contrário!',
  'Os desafios crescem a cada fase. Preparem-se para falhar!',
  'Metade do caminho, mas eu só estou aquecendo!',
  'Fase 5! Aqui as coisas ficam sérias de verdade!',
  'Seis fases? Chegaram longe demais! Isso termina aqui!',
  'Fase 7 vai ser sua derrota — garantido!',
  'Oito fases! Que ousadia... mas vou acabar com isso!',
  'Tão perto da batalha final... será que chegam lá vivos?',
]
const MESTRE_BATTLE_MSG = [
  null,
  'Com calma e foco, a matemática vence qualquer desafio!',
  'Não se deixem intimidar! Cada pergunta tem uma resposta certa!',
  'Lembrem das dicas! Frações, problemas e lógica são suas armas!',
  'Você chegou na metade! A matemática está do seu lado.',
  'Fase 5! Vocês já provaram que são guardiões de verdade!',
  'A cada fase, vocês ficam mais fortes. A matemática é seu poder!',
  'Sete fases! Impressionante! Confie no que aprendemos juntos!',
  'Quase lá! Oito fases de pura dedicação. Eu acredito em você!',
  'A batalha final se aproxima! Uma fase de cada vez. Respira fundo!',
]

export default function Battle({
  heroId,
  phase,
  taskFocus,
  externalQuestions,
  onWin,
  onLose,
  onBack,
  hasSeenFirstType,
  onMarkFirstType
}) {
  const hero = HEROES[heroId]
  const villain = VILLAINS[hero.villain]
  const isBoss = phase === 10
  const VillainArt = VILLAIN_ART_MAP[hero.villain]

  const [questions] = useState(() => {
    if (externalQuestions && externalQuestions.length > 0) {
      const shuffled = [...externalQuestions].sort(() => Math.random() - 0.5)
      return shuffled.slice(0, 5).map(q => ({ ...q, questionType: 'external' }))
    }
    return taskFocus && taskFocus.length > 0
      ? generateFocusedBattle(phase, taskFocus)
      : generateBattle(phase)
  })
  const [qIndex, setQIndex] = useState(0)
  const [hearts, setHearts] = useState(3)
  const heartsRef = useRef(3)
  const correctRef = useRef(0)
  const [answered, setAnswered] = useState(null)       // null | 'correct' | 'wrong'
  const [selectedOption, setSelectedOption] = useState(null)
  const [heroPhrase, setHeroPhrase] = useState(() => pick(hero.phrases.beforePhase))
  const [showingPrePhase, setShowingPrePhase] = useState(true)
  const [hintVisible, setHintVisible] = useState(false)
  const [firstTimeTip, setFirstTimeTip] = useState(null)
  // Narrative feedback after answering
  const [feedbackData, setFeedbackData] = useState(null)

  const currentQ = questions[qIndex]

  useEffect(() => {
    if (showingPrePhase && isBoss) soundEngine.playBossIntro()
  }, [])

  // First-time type tip
  useEffect(() => {
    if (!showingPrePhase && currentQ) {
      const type = currentQ.questionType
      if (type === 'external') return
      if (!hasSeenFirstType(type)) {
        const tip = CLAUDIANIS_TIPS[type]?.firstTime
        if (tip) { setFirstTimeTip(tip); onMarkFirstType(type) }
      }
    }
  }, [qIndex, showingPrePhase])

  function handleStartBattle() {
    soundEngine.playClick()
    setShowingPrePhase(false)
    setHeroPhrase(null)
  }

  function handleAnswer(optionIndex) {
    if (answered !== null) return
    const isCorrect = optionIndex === currentQ.correct

    setSelectedOption(optionIndex)
    setAnswered(isCorrect ? 'correct' : 'wrong')
    setHintVisible(false)
    setFirstTimeTip(null)

    if (isCorrect) {
      soundEngine.playCorrect()
      correctRef.current += 1
      setHeroPhrase(pick(hero.phrases.correct))
      setFeedbackData({
        type: 'correct',
        mestreMsg: pick(MESTRE_CORRECT),
        villainMsg: pick(VILLAIN_HURT),
      })
    } else {
      heartsRef.current -= 1
      setHearts(heartsRef.current)
      setHeroPhrase(pick(hero.phrases.wrong))
      setTimeout(() => soundEngine.playHeartLost(), 180)
      soundEngine.playWrong()
      setFeedbackData({
        type: 'wrong',
        mestreMsg: pick(MESTRE_WRONG),
        villainMsg: pick(VILLAIN_TAUNT),
      })
    }
  }

  function handleNext() {
    if (heartsRef.current <= 0) { onLose(); return }
    if (qIndex + 1 >= questions.length) { onWin(heartsRef.current, correctRef.current); return }
    setQIndex(i => i + 1)
    setAnswered(null)
    setSelectedOption(null)
    setHeroPhrase(null)
    setFeedbackData(null)
    setHintVisible(false)
    setFirstTimeTip(null)
  }

  // ── PRE-PHASE SCREEN ─────────────────────────────────────────────
  if (showingPrePhase) {
    const villainMsg = isBoss
      ? villain.taunt
      : (VILLAIN_PHASE_MSGS[phase] ?? villain.description)
    const mestreMsg = isBoss
      ? 'Esta é a batalha final! Toda a matemática que aprendemos será sua espada e escudo!'
      : (MESTRE_BATTLE_MSG[phase] ?? 'Com calma e foco, a matemática vence qualquer desafio!')

    return (
      <div
        className={`screen screen-battle bg-${heroId}`}
        style={{ '--hero-color': hero.color, '--hero-color-dark': hero.colorDark }}
      >
        <div className="pre-phase-screen">
          {isBoss ? (
            <div className="boss-intro">
              <div className="villain-art-wrap villain-appear">
                <VillainArt size={160} />
              </div>
              <div className="villain-taunt-bubble">
                <p className="villain-name-title">{villain.name}</p>
                <p className="villain-title-sub">{villain.title}</p>
                <p className="villain-taunt">"{villain.taunt}"</p>
              </div>
            </div>
          ) : (
            <div className="villain-intro-light">
              <div className="villain-intro-row">
                <div className="villain-mini-wrap">
                  <VillainArt size={96} />
                  <div className="villain-mini-challenge">
                    <p className="villain-mini-name">{villain.name}</p>
                    <p className="villain-mini-msg">"{villainMsg}"</p>
                  </div>
                </div>
              </div>
              <div className="mestre-counter">
                <ClaudianisArt size={52} />
                <div className="mestre-counter-text">
                  <span className="mestre-counter-name">Mestre Claudianis</span>
                  <span className="mestre-counter-msg">{mestreMsg}</span>
                </div>
              </div>
              <div className="phase-intro-art">
                <HeroAvatar heroId={heroId} size={130} phrase={heroPhrase} />
              </div>
            </div>
          )}

          <div className="pre-phase-info">
            {isBoss ? (
              <>
                <h2 className="phase-title boss-title">⚔️ BATALHA FINAL!</h2>
                <p className="phase-subtitle">Fase 10 — Confronte {villain.name}!</p>
              </>
            ) : (
              <>
                <h2 className="phase-title">Fase {phase}</h2>
                <p className="phase-subtitle">{hero.themeIcon} {hero.theme}</p>
              </>
            )}
            <div className="phase-rules">
              <span>5 perguntas</span>
              <Hearts count={3} max={3} />
              <span>{externalQuestions ? '📚 Questões da Matéria' : 'Frações · Problemas · Lógica'}</span>
            </div>
          </div>

          <button
            className="btn btn-primary btn-large"
            style={{ background: hero.color }}
            onClick={handleStartBattle}
          >
            {isBoss ? '⚔️ Batalhar!' : `Iniciar Fase ${phase}!`}
          </button>
          <button className="btn-back-sm" onClick={onBack}>← Mapa</button>
        </div>
      </div>
    )
  }

  // ── BATTLE SCREEN ─────────────────────────────────────────────────
  const hint = CLAUDIANIS_TIPS[currentQ?.questionType]
    ? pick(CLAUDIANIS_TIPS[currentQ.questionType].hints)
    : null

  return (
    <div
      className={`screen screen-battle bg-${heroId}`}
      style={{ '--hero-color': hero.color, '--hero-color-dark': hero.colorDark }}
    >
      {/* Top bar */}
      <div className="battle-topbar">
        <button className="btn-back-sm" onClick={onBack} aria-label="Voltar ao mapa">← Mapa</button>
        <div className="battle-phase-info">
          <span className="battle-phase-label">Fase {phase}</span>
          <span className="battle-q-counter">{qIndex + 1}/5</span>
        </div>
        <Hearts count={hearts} max={3} />
      </div>

      {/* Progress bar */}
      <div className="battle-progress-bar">
        <div className="battle-progress-fill" style={{ width: `${(qIndex / 5) * 100}%`, background: hero.color }} />
      </div>

      {/* First-time type tip from Mestre */}
      {firstTimeTip && (
        <div className="battle-first-tip">
          <ClaudianisArt size={40} />
          <div className="battle-first-tip-text">
            <span className="battle-first-tip-name">Mestre Claudianis</span>
            <span className="battle-first-tip-msg">{firstTimeTip}</span>
          </div>
          <button className="battle-first-tip-close" onClick={() => setFirstTimeTip(null)}>✕</button>
        </div>
      )}

      {/* ── QUESTION PHASE: villain presents the problem ── */}
      {!answered && (
        <div className="battle-villain-question">
          <div className="bvq-art">
            <VillainArt size={isBoss ? 96 : 80} />
            <span className="bvq-villain-name">{villain.name}</span>
          </div>
          <div className="bvq-bubble-area">
            <span className={`q-type-badge-sm bg-${heroId}`}>
              {{ fraction: '÷ Fração', problem: '📋 Problema', logic: '🧩 Lógica', external: '📚 Matéria' }[currentQ?.questionType]}
            </span>
            <MangaBubble
              type="shout"
              bgColor="rgba(40,0,0,0.92)"
              borderColor="#FF4444"
              textColor="#FFD0D0"
              className="battle-manga-bubble"
            >
              <p className="bvq-question-text">{currentQ?.question}</p>
              {currentQ?.visual?.type === 'fraction-bar' && (
                <FractionBar num={currentQ.visual.num} den={currentQ.visual.den} color={hero.color} />
              )}
              {currentQ?.visual?.type === 'compare' && (
                <CompareBars fracs={currentQ.visual.fracs} />
              )}
            </MangaBubble>
          </div>
        </div>
      )}

      {/* ── FEEDBACK PHASE: villain reacts + Mestre responds ── */}
      {answered && feedbackData && (
        <div className={`battle-feedback-row ${feedbackData.type}`}>
          {/* Villain side */}
          <div className="bfr-col bfr-villain-col">
            <div className={`bfr-art ${feedbackData.type === 'correct' ? 'bfr-villain-hurt' : 'bfr-villain-taunt'}`}>
              <VillainArt size={68} />
            </div>
            <MangaBubble
              type="shout"
              bgColor={feedbackData.type === 'correct' ? 'rgba(0,0,40,0.9)' : 'rgba(50,0,0,0.92)'}
              borderColor={feedbackData.type === 'correct' ? '#6666FF' : '#FF2222'}
              textColor={feedbackData.type === 'correct' ? '#AAAAFF' : '#FFB0B0'}
              className="battle-manga-bubble bfr-villain-manga"
            >
              <span className="bfr-bubble-name">{villain.name}</span>
              <p className="bfr-bubble-msg">"{feedbackData.villainMsg}"</p>
            </MangaBubble>
          </div>

          {/* Mestre side */}
          <div className="bfr-col bfr-mestre-col">
            <ClaudianisArt size={68} />
            <MangaBubble
              type={feedbackData.type === 'correct' ? 'speech' : 'thought'}
              tailSide="right"
              bgColor={feedbackData.type === 'correct' ? 'rgba(0,40,10,0.95)' : 'rgba(30,25,0,0.95)'}
              borderColor={feedbackData.type === 'correct' ? '#4CAF50' : '#FFD700'}
              textColor={feedbackData.type === 'correct' ? '#AAFFBB' : '#FFE08A'}
              className="battle-manga-bubble bfr-mestre-manga"
            >
              <span className="bfr-bubble-name">Mestre Claudianis</span>
              <p className="bfr-bubble-msg">{feedbackData.mestreMsg}</p>
            </MangaBubble>
          </div>
        </div>
      )}

      {/* Hero avatar + phrase (always visible) */}
      <div className="battle-hero-row">
        <HeroAvatar
          heroId={heroId}
          size={72}
          reaction={answered}
          phrase={heroPhrase}
        />
      </div>

      {/* ── HINT (only before answering, not for external questions) ── */}
      {!answered && hint && (
        <div className="battle-hint-area">
          {hintVisible ? (
            <div className="battle-hint-open">
              <ClaudianisArt size={38} />
              <MangaBubble
                type="thought"
                bgColor="rgba(20,30,0,0.92)"
                borderColor="#4CAF50"
                textColor="#CCFFCC"
                className="battle-hint-manga"
              >
                <span className="battle-hint-label">Mestre Claudianis</span>
                <p className="battle-hint-text">{hint}</p>
              </MangaBubble>
              <button className="battle-hint-close" onClick={() => setHintVisible(false)}>✕</button>
            </div>
          ) : (
            <button className="battle-hint-btn" onClick={() => setHintVisible(true)}>
              💡 Pedir dica da Mestre
            </button>
          )}
        </div>
      )}

      {/* Options grid */}
      <div className="options-grid">
        {currentQ?.options?.map((option, i) => {
          let btnClass = 'option-btn'
          if (answered !== null) {
            if (i === currentQ.correct) btnClass += ' option-correct'
            else if (i === selectedOption && answered === 'wrong') btnClass += ' option-wrong'
            else btnClass += ' option-disabled'
          }
          return (
            <button
              key={i}
              className={btnClass}
              style={answered === null ? { '--hero-color': hero.color } : {}}
              onClick={() => answered === null && handleAnswer(i)}
              disabled={answered !== null}
              aria-label={`Opção ${String.fromCharCode(65 + i)}: ${option}`}
            >
              <span className="option-letter">{String.fromCharCode(65 + i)}</span>
              <span className="option-text">{option}</span>
            </button>
          )
        })}
      </div>

      {/* Explanation + Next */}
      {answered && (
        <div className={`explanation-card ${answered === 'correct' ? 'exp-correct' : 'exp-wrong'}`}>
          <p className="exp-icon">{answered === 'correct' ? '✅' : '❌'}</p>
          <p className="exp-text">{currentQ?.explanation}</p>
          <button
            className="btn btn-primary"
            style={{ background: hero.color }}
            onClick={handleNext}
          >
            {qIndex + 1 >= questions.length ? '🏁 Ver resultado!' : 'Próxima →'}
          </button>
        </div>
      )}
    </div>
  )
}
