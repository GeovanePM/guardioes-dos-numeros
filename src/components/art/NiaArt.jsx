export default function NiaArt({ size = 200, className = '' }) {
  return (
    <img
      src="/assets/nia.png"
      alt="Nia — Heroína do Céu Estelar"
      width={size}
      height={size}
      className={`char-img char-img-nia ${className}`}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  )
}
