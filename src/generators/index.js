import { generateFractionQuestion } from './fractions.js'
import { generateProblemQuestion } from './problems.js'
import { generateLogicQuestion } from './logic.js'
import { shuffle } from './utils.js'

const TYPES = ['fraction', 'problem', 'logic']

const FOCUS_TO_TYPE = { fracoes: 'fraction', problemas: 'problem', logica: 'logic' }

const DISTRIBUTIONS = [
  ['fraction', 'problem', 'logic', 'fraction', 'problem'],
  ['fraction', 'logic', 'problem', 'fraction', 'logic'],
  ['problem', 'fraction', 'logic', 'problem', 'fraction'],
  ['logic', 'fraction', 'problem', 'logic', 'fraction'],
  ['fraction', 'problem', 'fraction', 'logic', 'problem']
]

function makeQuestion(type, phase) {
  if (type === 'fraction') return { ...generateFractionQuestion(phase), questionType: type }
  if (type === 'problem')  return { ...generateProblemQuestion(phase),  questionType: type }
  return { ...generateLogicQuestion(phase), questionType: type }
}

export function generateBattle(phase) {
  return shuffle(DISTRIBUTIONS)[0].map(type => makeQuestion(type, phase))
}

// focus: string[] de 'fracoes' | 'problemas' | 'logica' — pesa 3x os tipos focados
export function generateFocusedBattle(phase, focus = []) {
  if (!focus || focus.length === 0) return generateBattle(phase)

  const focusedTypes = focus.map(f => FOCUS_TO_TYPE[f]).filter(Boolean)
  const otherTypes   = TYPES.filter(t => !focusedTypes.includes(t))

  // Weighted pool: focused 3x, others 1x
  const pool = [...focusedTypes, ...focusedTypes, ...focusedTypes, ...otherTypes]
  const picked = []
  const used   = shuffle([...pool])

  for (let i = 0; i < 5; i++) {
    picked.push(used[i % used.length])
  }

  return picked.map(type => makeQuestion(type, phase))
}

export function generateSingleQuestion(type, phase) {
  if (type === 'fraction') return generateFractionQuestion(phase)
  if (type === 'problem') return generateProblemQuestion(phase)
  return generateLogicQuestion(phase)
}

export { TYPES }
