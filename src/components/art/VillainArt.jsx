export function SurtoArt({ size = 180, className = '' }) {
  return (
    <img
      src="/assets/surto.png"
      alt="Surto — General do Caos Elétrico"
      width={size}
      height={size}
      className={`char-img char-img-villain char-img-screen ${className}`}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  )
}

export function ImpasseArt({ size = 180, className = '' }) {
  return (
    <img
      src="/assets/impasse.png"
      alt="Impasse — General dos Labirintos"
      width={size}
      height={size}
      className={`char-img char-img-villain ${className}`}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  )
}

export function FragmentoArt({ size = 180, className = '' }) {
  return (
    <img
      src="/assets/fragmento.png"
      alt="Fragmento — General da Destruição"
      width={size}
      height={size}
      className={`char-img char-img-villain ${className}`}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  )
}

export function EclipseArt({ size = 180, className = '' }) {
  return (
    <img
      src="/assets/eclipse.png"
      alt="Eclipse — General das Trevas"
      width={size}
      height={size}
      className={`char-img char-img-villain char-img-screen ${className}`}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  )
}
