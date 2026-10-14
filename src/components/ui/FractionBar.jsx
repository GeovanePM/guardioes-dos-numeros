export default function FractionBar({ num, den, color = '#4FC3F7', size = 'md' }) {
  const height = size === 'sm' ? 24 : 36
  const width = size === 'sm' ? 160 : 220

  return (
    <div className="fraction-bar-wrap" aria-label={`${num} de ${den} partes`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {Array.from({ length: den }, (_, i) => (
          <rect
            key={i}
            x={i * (width / den) + 1}
            y={2}
            width={width / den - 2}
            height={height - 4}
            rx={3}
            fill={i < num ? color : '#e0e0e0'}
            stroke="white"
            strokeWidth={1}
          />
        ))}
      </svg>
      <span className="fraction-bar-label">{num}/{den}</span>
    </div>
  )
}

export function CompareBars({ fracs = [] }) {
  return (
    <div className="compare-bars">
      {fracs.map((f, i) => (
        <div key={i} className="compare-bar-row">
          <FractionBar num={f.num} den={f.den} size="sm" />
        </div>
      ))}
    </div>
  )
}
