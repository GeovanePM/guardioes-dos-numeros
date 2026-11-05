import { useEffect, useRef } from 'react'

export default function StartScreen({ onStart }) {
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = new Audio('/assets/landing_music.mp3')
    audio.loop = true
    audio.volume = 0.75
    audioRef.current = audio

    const tryPlay = () => {
      if (audio.paused) audio.play().catch(() => {})
    }

    audio.play().catch(() => {
      // Mobile browsers block autoplay — play on first user interaction
      document.addEventListener('touchstart', tryPlay, { once: true })
      document.addEventListener('click', tryPlay, { once: true })
    })

    return () => {
      audio.pause()
      audio.src = ''
      document.removeEventListener('touchstart', tryPlay)
      document.removeEventListener('click', tryPlay)
    }
  }, [])

  function handleStart() {
    const audio = audioRef.current
    if (!audio || audio.paused) { onStart(); return }

    let vol = audio.volume
    const step = vol / 13
    const fade = setInterval(() => {
      vol = Math.max(0, vol - step)
      audio.volume = vol
      if (vol <= 0) {
        clearInterval(fade)
        audio.pause()
        onStart()
      }
    }, 30)
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
