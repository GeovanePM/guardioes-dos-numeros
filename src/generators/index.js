import { generateFractionQuestion } from './fractions.js'
import { generateProblemQuestion } from './problems.js'
import { generateLogicQuestion } from './logic.js'
import { generateGeometryQuestion } from './geometry.js'
import { generateStatisticsQuestion } from './statistics.js'
import { shuffle } from './utils.js'

// Tipos ativos — alinhados com as provas do 4º bimestre (Cap. 10 e 11)
const TYPES = ['geometry', 'statistics', 'problem']

// Mapeamento de foco (usado na batalha focada)
const FOCUS_TO_TYPE = {
  geometria:   'geometry',
  estatistica: 'statistics',
  problemas:   'problem',
  // compatibilidade com mapeamentos antigos
  fracoes:     'geometry',
  logica:      'statistics',
}

function makeQuestion(type, phase) {
  if (type === 'geometry')   return { ...generateGeometryQuestion(phase),   questionType: type }
  if (type === 'statistics') return { ...generateStatisticsQuestion(phase), questionType: type }
  if (type === 'problem')    return { ...generateProblemQuestion(phase),    questionType: type }
  if (type === 'fraction')   return { ...generateFractionQuestion(phase),   questionType: type }
  return { ...generateLogicQuestion(phase), questionType: type }
}

export function generateBattle(phase) {
  // Fases 1-5 = Cap. 10 (Estatística) | Fases 6-10 = Cap. 11 (Geometria)
  const type = phase <= 5 ? 'statistics' : 'geometry'
  return Array.from({ length: 5 }, () => makeQuestion(type, phase))
}

// focus: string[] de 'geometria' | 'estatistica' | 'problemas'
export function generateFocusedBattle(phase, focus = []) {
  if (!focus || focus.length === 0) return generateBattle(phase)

  const focusedTypes = focus.map(f => FOCUS_TO_TYPE[f]).filter(Boolean)
  const otherTypes   = TYPES.filter(t => !focusedTypes.includes(t))

  // Tipos focados com peso 3×, outros com 1×
  const pool = [...focusedTypes, ...focusedTypes, ...focusedTypes, ...otherTypes]
  const used  = shuffle([...pool])
  const picked = Array.from({ length: 5 }, (_, i) => used[i % used.length])

  return picked.map(type => makeQuestion(type, phase))
}

export function generateSingleQuestion(type, phase) {
  if (type === 'geometry')   return generateGeometryQuestion(phase)
  if (type === 'statistics') return generateStatisticsQuestion(phase)
  if (type === 'problem')    return generateProblemQuestion(phase)
  if (type === 'fraction')   return generateFractionQuestion(phase)
  return generateLogicQuestion(phase)
}

export { TYPES }
