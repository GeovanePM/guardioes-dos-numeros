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

  useEffect(() => {
    if (reaction === 'correct') {
      setAnimClass('hero-jump')
      const t = setTimeout(() => setAnimClass(''), 800)
      return () => clearTimeout(t)
    } else if (reaction === 'wrong') {
      setAnimClass('hero-shake')
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
      <ArtComponent size={size} className="hero-art" />
    </div>
  )
}
