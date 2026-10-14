import { generateFractionQuestion } from './fractions.js'
import { generateProblemQuestion } from './problems.js'
import { generateLogicQuestion } from './logic.js'
import { shuffle } from './utils.js'

const TYPES = ['fraction', 'problem', 'logic']

// Generate 5 questions for a battle, mixing all 3 types
// Distribution: 2 fractions, 2 problems, 1 logic (or rotate)
const DISTRIBUTIONS = [
  ['fraction', 'problem', 'logic', 'fraction', 'problem'],
  ['fraction', 'logic', 'problem', 'fraction', 'logic'],
  ['problem', 'fraction', 'logic', 'problem', 'fraction'],
  ['logic', 'fraction', 'problem', 'logic', 'fraction'],
  ['fraction', 'problem', 'fraction', 'logic', 'problem']
]

export function generateBattle(phase) {
  const dist = shuffle(DISTRIBUTIONS)[0]

  return dist.map(type => {
    let q
    if (type === 'fraction') q = generateFractionQuestion(phase)
    else if (type === 'problem') q = generateProblemQuestion(phase)
    else q = generateLogicQuestion(phase)
    return { ...q, questionType: type }
  })
}

export function generateSingleQuestion(type, phase) {
  if (type === 'fraction') return generateFractionQuestion(phase)
  if (type === 'problem') return generateProblemQuestion(phase)
  return generateLogicQuestion(phase)
}

export { TYPES }
