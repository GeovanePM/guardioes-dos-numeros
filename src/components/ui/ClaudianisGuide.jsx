import { useState } from 'react'
import ClaudianisArt from '../art/ClaudianisArt.jsx'

export default function ClaudianisGuide({ message, onDismiss, variant = 'tip' }) {
  const [visible, setVisible] = useState(true)

  if (!visible || !message) return null

  function handleDismiss() {
    setVisible(false)
    onDismiss?.()
  }

  return (
    <div className={`claudianis-guide claudianis-${variant}`} role="dialog" aria-label="Dica do Mestre Claudianis">
      <div className="claudianis-inner">
        <div className="claudianis-avatar">
          <ClaudianisArt size={80} />
        </div>
        <div className="claudianis-content">
          <p className="claudianis-name">Mestre Claudianis</p>
          <p className="claudianis-msg">{message}</p>
          <button className="btn btn-sm btn-claudianis" onClick={handleDismiss}>
            Entendi! ✨
          </button>
        </div>
      </div>
    </div>
  )
}

export function ClaudianisHintButton({ hint, heroColor }) {
  const [showing, setShowing] = useState(false)

  return (
    <div className="hint-wrap">
      <button
        className="btn-hint"
        style={{ borderColor: heroColor, color: heroColor }}
        onClick={() => setShowing(s => !s)}
        aria-label="Pedir dica do Mestre Claudianis"
      >
        💡 Dica
      </button>
      {showing && (
        <div className="hint-bubble">
          <div className="hint-avatar">
            <ClaudianisArt size={50} />
          </div>
          <p>{hint}</p>
          <button className="btn btn-sm" onClick={() => setShowing(false)}>Fechar</button>
        </div>
      )}
    </div>
  )
}
