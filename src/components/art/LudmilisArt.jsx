export default function LudmilisArt({ size = 180, className = '' }) {
  return (
    <img
      src="/assets/ludmilis.png"
      alt="Mestra Ludmilis"
      width={size}
      height={size}
      className={`char-img char-img-ludmilis ${className}`}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  )
}
