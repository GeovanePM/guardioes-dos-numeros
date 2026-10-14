export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function gcd(a, b) {
  a = Math.abs(a)
  b = Math.abs(b)
  return b === 0 ? a : gcd(b, a % b)
}

export function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b)
}

export function simplify(num, den) {
  const g = gcd(Math.abs(num), Math.abs(den))
  return { num: num / g, den: den / g }
}

export function fractionStr(num, den) {
  if (den === 1) return `${num}`
  return `${num}/${den}`
}

export function formatMoney(val) {
  return `R$${val.toFixed(2).replace('.', ',')}`
}

// Build 4 options, shuffled, deduped, returning array and correct index
export function buildOptions(correct, distractors) {
  const seen = new Set([String(correct)])
  const unique = [correct]
  for (const d of distractors) {
    if (!seen.has(String(d)) && unique.length < 4) {
      seen.add(String(d))
      unique.push(d)
    }
  }
  // Pad with numeric fallbacks if needed
  let fallback = 99
  while (unique.length < 4) {
    const fb = String(fallback++)
    if (!seen.has(fb)) { seen.add(fb); unique.push(fb) }
  }
  const shuffled = shuffle(unique)
  return { options: shuffled, correct: shuffled.indexOf(correct) }
}

// Generate unique distractors that differ from correct and from each other
export function uniqueNearby(correct, count, generator, maxTries = 50) {
  const seen = new Set([correct])
  const result = []
  let tries = 0
  while (result.length < count && tries < maxTries) {
    const v = generator()
    if (!seen.has(v)) {
      seen.add(v)
      result.push(v)
    }
    tries++
  }
  // Fill remaining with fallback if needed
  while (result.length < count) {
    const fallback = `${result.length + 100}`
    if (!seen.has(fallback)) {
      seen.add(fallback)
      result.push(fallback)
    }
  }
  return result
}
