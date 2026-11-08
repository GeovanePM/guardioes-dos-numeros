import { useEffect } from 'react'
import { soundEngine } from '../../audio/soundEngine.js'

export default function StartScreen({ onStart }) {
  useEffect(() => {
    // Inicia música no primeiro toque/clique — desbloqueia AudioContext em mobile/tablet
    function unlock() {
      document.removeEventListener('touchstart', unlock)
      document.removeEventListener('click', unlock)
      soundEngine.startTheme('opening')
    }
    document.addEventListener('touchstart', unlock)
    document.addEventListener('click', unlock)
    return () => {
      document.removeEventListener('touchstart', unlock)
      document.removeEventListener('click', unlock)
    }
  }, [])

  function handleStart() {
    onStart()
  }

  return (
    <div className="screen screen-start screen-start-cover">
      {/* Capa do gibi preenche a tela */}
      <img
        src="/assets/cover.jpg"
        alt="Guardiões dos Números — Heróis da Matemática"
        className="start-cover-bg"
      />

      {/* Gradiente inferior para legibilidade */}
      <div className="start-cover-gradient" />

      {/* Botão e rodapé sobre a capa */}
      <div className="start-cover-content">
        <button className="btn-start start-cover-btn" onClick={handleStart}>
          ⚔️ Jogar Agora!
        </button>
        <p className="start-footer">
          Turmas 11.501 · 11.502 · 11.503 · 11.504
        </p>
      </div>
    </div>
  )
}
