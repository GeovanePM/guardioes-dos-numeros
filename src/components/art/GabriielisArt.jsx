export default function GabriielisArt({ size = 180, className = '' }) {
  return (
    <img
      src="/assets/gabrielis.png"
      alt="Mestra Gabrielis"
      width={size}
      height={size}
      className={`char-img char-img-gabrielis ${className}`}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  )
}
