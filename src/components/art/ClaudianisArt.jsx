export default function ClaudianisArt({ size = 180, className = '' }) {
  return (
    <img
      src="/assets/claudianis.png"
      alt="Mestre Claudianis"
      width={size}
      height={size}
      className={`char-img char-img-claudianis ${className}`}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  )
}
