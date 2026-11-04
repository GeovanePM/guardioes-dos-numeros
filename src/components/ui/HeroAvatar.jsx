import { useState, useEffect } from 'react'
import MitosArt from '../art/MitosArt.jsx'
import PampeeArt from '../art/PampeeArt.jsx'
import GaldiosArt from '../art/GaldiosArt.jsx'
import NiaArt from '../art/NiaArt.jsx'

const ART_MAP = {
  mitos: MitosArt,
  pampee: PampeeArt,
  galdios: GaldiosArt,
  nia: NiaArt
}

export default function HeroAvatar({ heroId, size = 160, reaction = null, phrase = null }) {
  const [animClass, setAnimClass] = useState('')
  const [showRing, setShowRing] = useState(false)

  useEffect(() => {
    if (reaction === 'correct') {
      setAnimClass('hero-jump')
      setShowRing(true)
      const t = setTimeout(() => { setAnimClass(''); setShowRing(false) }, 900)
      return () => clearTimeout(t)
    } else if (reaction === 'wrong') {
      setAnimClass('hero-shake')
      setShowRing(false)
      const t = setTimeout(() => setAnimClass(''), 600)
      return () => clearTimeout(t)
    }
  }, [reaction])

  const ArtComponent = ART_MAP[heroId]
  if (!ArtComponent) return null

  return (
    <div className={`hero-avatar-wrap ${animClass}`}>
      {phrase && (
        <div className="hero-speech-bubble">
          <p>{phrase}</p>
        </div>
      )}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <ArtComponent size={size} className="hero-art" />
        {showRing && <div className="hero-power-ring" />}
        {showRing && <div className="hero-power-ring hero-power-ring-2" />}
      </div>
    </div>
  )
}
