export default function MitosArt({ size = 200, className = '' }) {
  return (
    <img
      src="/assets/mitos.png"
      alt="Mitos — Herói do Vale Elétrico"
      width={size}
      height={size}
      className={`char-img char-img-mitos ${className}`}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  )
}
