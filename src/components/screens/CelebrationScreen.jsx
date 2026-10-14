import { useState, useEffect, useRef, useCallback } from 'react'
import { HEROES } from '../../data/heroes.js'
import ClaudianisArt from '../art/ClaudianisArt.jsx'
import MitosArt from '../art/MitosArt.jsx'
import PampeeArt from '../art/PampeeArt.jsx'
import GaldiosArt from '../art/GaldiosArt.jsx'
import NiaArt from '../art/NiaArt.jsx'
import { soundEngine } from '../../audio/soundEngine.js'

const ART_MAP = { mitos: MitosArt, pampee: PampeeArt, galdios: GaldiosArt, nia: NiaArt }

const DIALOGUES = {
  mitos: [
    { speaker: 'Mestre Claudianis', msg: 'Excelente, Mitos! Cada raio de raciocínio seu acertou em cheio nessa batalha!' },
    { speaker: 'Mitos', msg: 'Aprendi com o melhor! A matemática é meu verdadeiro poder! ⚡' },
    { speaker: 'Mestre Claudianis', msg: 'O Vale Elétrico ficará mais seguro a cada fase que você superar. Avante, guardião!' },
  ],
  pampee: [
    { speaker: 'Mestre Claudianis', msg: 'Pampee, sua lupa matemática é infalível! Cada pista levou direto à resposta!' },
    { speaker: 'Pampee', msg: 'A investigação nunca falha quando a matemática é nosso guia, Mestre! 🔍' },
    { speaker: 'Mestre Claudianis', msg: 'A Selva dos Enigmas treme diante de uma detetive tão brilhante!' },
  ],
  galdios: [
    { speaker: 'Mestre Claudianis', msg: 'Galdios, sua blindagem matemática é impenetrável! O Fragmento não teve chance!' },
    { speaker: 'Galdios', msg: 'Conhecimento é a melhor armadura, Mestre! Aprendi isso com você! 🛡️' },
    { speaker: 'Mestre Claudianis', msg: 'Cada fase vencida fortalece ainda mais sua proteção. Em frente, guerreiro!' },
  ],
  nia: [
    { speaker: 'Mestre Claudianis', msg: 'Nia, você fez as estrelas brilharem ainda mais hoje! Que precisão matemática!' },
    { speaker: 'Nia', msg: 'O Céu Estelar me guia, Mestre, mas são seus ensinamentos que iluminam meu caminho! ⭐' },
    { speaker: 'Mestre Claudianis', msg: 'E o Eclipse jamais poderá apagar essa luz! Continue, estrela guardiã!' },
  ],
}

const CHAR_DELAY = 30

export default function CelebrationScreen({ heroId, phase, hearts, onContinue }) {
  const hero = HEROES[heroId]
  const HeroArt = ART_MAP[heroId]
  const dialogues = DIALOGUES[heroId] || DIALOGUES.mitos

  const [step, setStep] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(true)
  const timerRef = useRef(null)
  const charRef = useRef(0)
  const doneRef = useRef(false)   // tracks if we already called onContinue

  const dlg = dialogues[step]
  const fullText = dlg?.msg ?? ''
  const isClaudianis = dlg?.speaker === 'Mestre Claudianis'
  const isLast = step >= dialogues.length - 1

  useEffect(() => {
    soundEngine.playCelebration()
  }, [])

  // Start typewriter whenever step changes
  useEffect(() => {
    clearInterval(timerRef.current)
    charRef.current = 0
    setDisplayed('')
    setTyping(true)

    timerRef.current = setInterval(() => {
      charRef.current += 1
      setDisplayed(fullText.slice(0, charRef.current))
      if (charRef.current >= fullText.length) {
        clearInterval(timerRef.current)
        setTyping(false)
      }
    }, CHAR_DELAY)

    return () => clearInterval(timerRef.current)
  }, [step, fullText])

  // Single tap handler — works for every state:
  // typing  → skip to end
  // done, not last → advance
  // done, last → continue to next screen
  function handleTap() {
    if (typing) {
      clearInterval(timerRef.current)
      setDisplayed(fullText)
      setTyping(false)
      return
    }
    if (!isLast) {
      soundEngine.playClick()
      setStep(s => s + 1)
      return
    }
    // Last dialogue, done typing → go to next screen
    if (!doneRef.current) {
      doneRef.current = true
      soundEngine.playClick()
      onContinue()
    }
  }

  const heroActive   = !isClaudianis
  const mestreActive = isClaudianis

  return (
    <div
      className={`screen screen-celebration bg-${heroId}`}
      style={{ '--hero-color': hero.color, '--hero-glow': hero.colorGlow }}
      onClick={handleTap}
    >
      {/* Stars + title */}
      <div className="celeb-header">
        <div className="celebration-stars">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="victory-star" style={{ animationDelay: `${i * 0.1}s` }}>⭐</span>
          ))}
        </div>
        <h2 className="celebration-title">
          {phase === 10 ? '🏆 Missão Completa!' : `Fase ${phase} Conquistada!`}
        </h2>
      </div>

      {/* Characters — active speaker gets highlight, other is dimmed */}
      <div className="celebration-chars">
        <div className={`celeb-char ${heroActive ? 'celeb-char-active' : 'celeb-char-inactive'}`}>
          <HeroArt size={heroActive ? 128 : 96} className={heroActive ? 'art-victory' : ''} />
          <span className="celeb-char-name" style={{ color: hero.color }}>{hero.name}</span>
        </div>
        <div className={`celeb-char ${mestreActive ? 'celeb-char-active' : 'celeb-char-inactive'}`}>
          <ClaudianisArt size={mestreActive ? 128 : 96} className={mestreActive ? 'art-victory' : ''} />
          <span className="celeb-char-name" style={{ color: '#FFD700' }}>Mestre Claudianis</span>
        </div>
      </div>

      {/* RPG dialogue box */}
      <div
        key={step}
        className={`celeb-dialogue-box ${isClaudianis ? 'celeb-box-claudianis' : 'celeb-box-hero'}`}
        style={{ '--speaker-color': isClaudianis ? '#FFD700' : hero.color }}
      >
        <div className="celeb-dialogue-speaker">
          <span className="celeb-dialogue-name" style={{ color: isClaudianis ? '#FFD700' : hero.color }}>
            {dlg?.speaker}
          </span>
          <span className="celeb-step-dots">
            {dialogues.map((_, i) => (
              <span key={i} className={`celeb-dot ${i === step ? 'celeb-dot-active' : ''}`} />
            ))}
          </span>
        </div>

        <p className="celeb-dialogue-text">
          {displayed}
          {typing && <span className="celeb-cursor">|</span>}
        </p>

        <div className="celeb-dialogue-hint">
          {typing
            ? <span className="celeb-hint-text">Toque para pular ▶</span>
            : isLast
              ? <span className="celeb-hint-text celeb-hint-pulse">Toque para continuar a aventura! ▶</span>
              : <span className="celeb-hint-text celeb-hint-pulse">Toque para continuar... ▶</span>
          }
        </div>
      </div>

      {/* Hearts stat */}
      <div className="celebration-stat">
        <span className="celeb-stat-icon">{'❤️'.repeat(hearts)}{'🖤'.repeat(3 - hearts)}</span>
        <span className="celeb-stat-label">
          {hearts} {hearts === 1 ? 'coração restante' : 'corações restantes'}
        </span>
      </div>
    </div>
  )
}
