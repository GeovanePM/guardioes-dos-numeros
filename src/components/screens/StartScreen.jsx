import { useState, useEffect } from 'react'
import { soundEngine } from '../../audio/soundEngine.js'

export default function StartScreen({ onStart }) {
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    if (unlocked) return
    function unlock() {
      document.removeEventListener('touchstart', unlock)
      document.removeEventListener('click', unlock)
      soundEngine.startTheme('opening')
      setUnlocked(true)
    }
    document.addEventListener('touchstart', unlock)
    document.addEventListener('click', unlock)
    return () => {
      document.removeEventListener('touchstart', unlock)
      document.removeEventListener('click', unlock)
    }
  }, [unlocked])

  return (
    <div className="screen screen-start screen-start-cover">
      <img
        src="/assets/cover.jpg"
        alt="Guardiões dos Números — Heróis da Matemática"
        className="start-cover-bg"
      />
      <div className="start-cover-gradient" />

      {unlocked ? (
        <div className="start-cover-content start-cover-content-in">
          <button className="btn-start start-cover-btn" onClick={onStart}>
            ⚔️ Jogar Agora!
          </button>
          <p className="start-footer">
            Turmas 11.501 · 11.502 · 11.503 · 11.504
          </p>
        </div>
      ) : (
        <div className="start-tap-hint">
          🎵 Toque na tela para começar
        </div>
      )}
    </div>
  )
}
