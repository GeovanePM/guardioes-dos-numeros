export default function GaldiosArt({ size = 200, className = '' }) {
  return (
    <img
      src="/assets/galdios.png"
      alt="Galdios — Herói da Fortaleza Blindada"
      width={size}
      height={size}
      className={`char-img char-img-galdios ${className}`}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  )
}
