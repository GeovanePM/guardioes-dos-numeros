export default function Hearts({ count, max = 3 }) {
  return (
    <div className="hearts-row" aria-label={`${count} de ${max} corações`}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`heart ${i < count ? 'heart-full' : 'heart-empty'} ${i === count && count < max ? 'heart-lost' : ''}`}
          aria-hidden="true"
        >
          {i < count ? '❤️' : '🖤'}
        </span>
      ))}
    </div>
  )
}
