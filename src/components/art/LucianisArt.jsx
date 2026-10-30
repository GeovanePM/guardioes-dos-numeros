export default function LucianisArt({ size = 180, className = '' }) {
  return (
    <img
      src="/assets/lucianis.png"
      alt="Mestra Lucianis"
      width={size}
      height={size}
      className={`char-img char-img-lucianis ${className}`}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  )
}
