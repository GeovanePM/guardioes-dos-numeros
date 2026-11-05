export default function PampeeArt({ size = 200, className = '' }) {
  return (
    <img
      src="/assets/pampee.png"
      alt="Pampee — Heroína da Selva dos Enigmas"
      width={size}
      height={size}
      className={`char-img char-img-pampee ${className}`}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  )
}
