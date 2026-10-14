// Manga-style speech bubbles — 3 types: speech (smooth), shout (jagged burst), thought (cloud)

/**
 * type='speech'  — oval smooth bubble, tail points to speaker (default: bottom-left)
 * type='shout'   — spiky burst shape, for villain shouts / intense moments
 * type='thought' — soft cloud, for Mestre hints / internal thoughts
 * tailSide='left'|'right'|'bottom'|'none'
 */
export default function MangaBubble({
  type = 'speech',
  tailSide = 'left',
  bgColor,
  borderColor,
  textColor,
  children,
  className = '',
  style = {},
}) {
  if (type === 'shout') {
    return <ShoutBubble bgColor={bgColor} borderColor={borderColor} textColor={textColor} className={className} style={style}>{children}</ShoutBubble>
  }
  if (type === 'thought') {
    return <ThoughtBubble bgColor={bgColor} borderColor={borderColor} textColor={textColor} className={className} style={style}>{children}</ThoughtBubble>
  }
  return <SpeechBubble tailSide={tailSide} bgColor={bgColor} borderColor={borderColor} textColor={textColor} className={className} style={style}>{children}</SpeechBubble>
}

// ─── Speech bubble ──────────────────────────────────────────────────────────
function SpeechBubble({ tailSide, bgColor = '#fff', borderColor = '#222', textColor = '#1a1a1a', children, className, style }) {
  const tailStyles = {
    left: {
      position: 'absolute',
      bottom: -16,
      left: 20,
      width: 0,
      height: 0,
    },
    right: {
      position: 'absolute',
      bottom: -16,
      right: 20,
      width: 0,
      height: 0,
    },
    bottom: {
      position: 'absolute',
      bottom: -16,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 0,
      height: 0,
    },
  }

  return (
    <div
      className={`manga-speech ${className}`}
      style={{
        background: bgColor,
        border: `2.5px solid ${borderColor}`,
        color: textColor,
        boxShadow: `3px 3px 0 ${borderColor}`,
        ...style,
      }}
    >
      {children}
      {tailSide !== 'none' && (
        <>
          {/* Outer triangle (border color) */}
          <div style={{
            ...tailStyles[tailSide] || tailStyles.left,
            borderLeft: tailSide === 'left' ? '12px solid transparent' : undefined,
            borderRight: tailSide === 'right' ? '12px solid transparent' : (tailSide === 'left' ? '12px solid transparent' : '12px solid transparent'),
            borderTop: `16px solid ${borderColor}`,
          }} />
          {/* Inner triangle (fill color) */}
          <div style={{
            ...tailStyles[tailSide] || tailStyles.left,
            bottom: -12,
            left: tailSide === 'bottom' ? '50%' : (tailSide === 'left' ? 22 : undefined),
            right: tailSide === 'right' ? 22 : undefined,
            transform: tailSide === 'bottom' ? 'translateX(-50%)' : undefined,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: `14px solid ${bgColor}`,
          }} />
        </>
      )}
    </div>
  )
}

// ─── Shout / burst bubble ────────────────────────────────────────────────────
function ShoutBubble({ bgColor = '#fff0f0', borderColor = '#cc0000', textColor = '#1a1a1a', children, className, style }) {
  // SVG path for jagged burst shape — 100×60 viewBox, scales via preserveAspectRatio:none
  const pathD = [
    'M10,4 L22,0 L33,7 L45,1 L57,8 L68,1 L80,7 L90,2 L100,6',
    'L97,16 L100,26 L96,36 L100,46 L97,56 L100,60',
    'L88,57 L78,60 L67,55 L55,60 L45,56 L33,60 L22,56 L10,60',
    'L2,56 L0,46 L4,36 L0,26 L4,16 L0,6 Z',
  ].join(' ')

  return (
    <div
      className={`manga-shout-wrap ${className}`}
      style={{ position: 'relative', ...style }}
    >
      {/* SVG background burst */}
      <svg
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
      >
        <path d={pathD} fill={bgColor} stroke={borderColor} strokeWidth="2" strokeLinejoin="round" />
      </svg>
      {/* Text content on top */}
      <div
        className="manga-shout-content"
        style={{ position: 'relative', zIndex: 1, color: textColor }}
      >
        {children}
      </div>
    </div>
  )
}

// ─── Thought / cloud bubble ──────────────────────────────────────────────────
function ThoughtBubble({ bgColor = 'rgba(230,255,235,0.95)', borderColor = '#4CAF50', textColor = '#1a2a1a', children, className, style }) {
  return (
    <div
      className={`manga-thought ${className}`}
      style={{
        background: bgColor,
        border: `2px dashed ${borderColor}`,
        color: textColor,
        boxShadow: `2px 2px 0 ${borderColor}40`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
