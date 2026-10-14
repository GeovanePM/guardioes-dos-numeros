import { randInt, pick, gcd, lcm, simplify, fractionStr, buildOptions, uniqueNearby } from './utils.js'

const SMALL_DENS = [2, 3, 4, 5, 6, 8, 10, 12]

function randomFraction(maxDen = 8, maxNum = null) {
  const den = pick(SMALL_DENS.filter(d => d <= maxDen))
  const num = randInt(1, maxNum || den - 1)
  return { num, den }
}

// === EASY (phases 1-3) ===

function compareSameDenominator() {
  const den = pick([4, 6, 8, 10])
  const n1 = randInt(1, den - 2)
  const n2 = randInt(n1 + 1, den - 1)
  const [smaller, bigger] = [n1, n2]
  const askBigger = Math.random() > 0.5

  const correctFrac = askBigger ? `${bigger}/${den}` : `${smaller}/${den}`
  const wrongFrac = askBigger ? `${smaller}/${den}` : `${bigger}/${den}`
  const mid = randInt(1, den - 1)
  const other1 = mid !== n1 && mid !== n2 ? `${mid}/${den}` : `${randInt(1,den-1)}/${den}`
  const other2 = `${randInt(1, den-1)}/${den}`

  const { options, correct } = buildOptions(correctFrac, [wrongFrac, other1, other2])

  return {
    type: 'fraction',
    question: `Qual fração é ${askBigger ? 'MAIOR' : 'MENOR'}?\n(Denominador: ${den} — em ${den} partes iguais)`,
    visual: { type: 'compare', fracs: [{num: n1, den}, {num: n2, den}] },
    options,
    correct,
    explanation: `${correctFrac} é ${askBigger ? 'maior' : 'menor'} porque ${askBigger ? bigger : smaller} partes ${askBigger ? '>' : '<'} ${askBigger ? smaller : bigger} partes no mesmo todo dividido em ${den}.`
  }
}

function identifyFractionOfParts() {
  const den = pick([4, 6, 8])
  const num = randInt(1, den - 1)
  const correctAnswer = `${num}/${den}`

  const distractors = uniqueNearby(
    correctAnswer,
    3,
    () => { const n = randInt(1, den - 1); return `${n}/${den}` }
  )

  const { options, correct } = buildOptions(correctAnswer, distractors)

  const context = pick([
    `Uma pizza foi dividida em ${den} fatias iguais. ${num} ${num===1?'fatia foi comida':'fatias foram comidas'}.`,
    `Um bolo foi cortado em ${den} pedaços iguais. ${num} ${num===1?'pedaço foi servido':'pedaços foram servidos'}.`,
    `Uma barra de chocolate tem ${den} quadradinhos. ${num} ${num===1?'quadradinho foi comido':'quadradinhos foram comidos'}.`
  ])

  return {
    type: 'fraction',
    question: `${context}\nQual fração representa ${num===1?'a parte comida':'as partes comidas'}?`,
    visual: { type: 'fraction-bar', num, den },
    options,
    correct,
    explanation: `${num} ${num===1?'parte':'partes'} de ${den} partes iguais = fração ${num}/${den}. O denominador (${den}) diz o total de partes iguais, o numerador (${num}) diz quantas partes temos.`
  }
}

function equivalentFraction() {
  const baseFracs = [
    { num: 1, den: 2 }, { num: 1, den: 3 }, { num: 2, den: 3 },
    { num: 1, den: 4 }, { num: 3, den: 4 }, { num: 1, den: 5 },
    { num: 2, den: 5 }
  ]
  const base = pick(baseFracs)
  const mult = pick([2, 3, 4])
  const equiv = { num: base.num * mult, den: base.den * mult }

  const correctAnswer = `${equiv.num}/${equiv.den}`
  const distractors = [
    `${equiv.num + 1}/${equiv.den}`,
    `${equiv.num}/${equiv.den + 1}`,
    `${base.num + 1}/${base.den}`
  ]
  const { options, correct } = buildOptions(correctAnswer, distractors)

  return {
    type: 'fraction',
    question: `Qual fração é equivalente a ${base.num}/${base.den}?\n(Equivalente = representa a mesma quantidade)`,
    visual: { type: 'fraction-bar', num: base.num, den: base.den },
    options,
    correct,
    explanation: `${base.num}/${base.den} = ${equiv.num}/${equiv.den} porque multiplicamos numerador e denominador por ${mult}. As duas frações representam a mesma parte do todo!`
  }
}

// === MEDIUM (phases 4-6) ===

function addSameDenominator() {
  const den = pick([4, 6, 8, 10, 12])
  const n1 = randInt(1, Math.floor(den / 2))
  const n2 = randInt(1, Math.floor(den / 2))
  const sumNum = n1 + n2

  const { num: sNum, den: sDen } = simplify(sumNum, den)
  const correctAnswer = sDen === 1 ? `${sNum}` : `${sNum}/${sDen}`
  const rawAnswer = `${sumNum}/${den}`

  const distractors = [
    rawAnswer !== correctAnswer ? rawAnswer : `${sumNum + 1}/${den}`,
    `${n1 + n2}/${den * 2}`,
    `${Math.abs(n1 - n2)}/${den}`
  ]
  const { options, correct } = buildOptions(correctAnswer, distractors)

  return {
    type: 'fraction',
    question: `Quanto é ${n1}/${den} + ${n2}/${den}?`,
    options,
    correct,
    explanation: `${n1}/${den} + ${n2}/${den} = ${sumNum}/${den}${sNum !== sumNum || sDen !== den ? ` = ${correctAnswer} (simplificando dividindo por ${gcd(sumNum, den)})` : ''}. Para somar frações com mesmo denominador, some os numeradores!`
  }
}

function addDifferentDenominators() {
  const pairs = [
    [2, 4], [2, 3], [3, 6], [4, 8], [2, 6], [3, 4], [4, 6], [2, 8], [3, 12], [4, 12]
  ]
  const [d1, d2] = pick(pairs)
  const n1 = randInt(1, d1 - 1)
  const n2 = randInt(1, d2 - 1)
  const l = lcm(d1, d2)
  const sumNum = n1 * (l / d1) + n2 * (l / d2)
  const { num: sNum, den: sDen } = simplify(sumNum, l)
  const correctAnswer = sDen === 1 ? `${sNum}` : `${sNum}/${sDen}`

  const distractors = [
    `${n1 + n2}/${d1 + d2}`,
    `${sumNum + 1}/${l}`,
    `${sNum}/${sDen + 1}`
  ].filter(d => d !== correctAnswer)

  const { options, correct } = buildOptions(correctAnswer, distractors)

  return {
    type: 'fraction',
    question: `Quanto é ${n1}/${d1} + ${n2}/${d2}?`,
    options,
    correct,
    explanation: `Para somar ${n1}/${d1} + ${n2}/${d2}, encontramos o mínimo múltiplo comum de ${d1} e ${d2} = ${l}. Assim: ${n1 * (l/d1)}/${l} + ${n2 * (l/d2)}/${l} = ${sumNum}/${l}${correctAnswer !== `${sumNum}/${l}` ? ` = ${correctAnswer}` : ''}.`
  }
}

function subtractFractions() {
  const pairs = [[2, 4], [3, 6], [4, 8], [4, 12], [6, 12], [3, 4]]
  const [d1, d2] = pick(pairs)
  const l = lcm(d1, d2)
  // Ensure positive result
  let n1, n2, diffNum
  do {
    n1 = randInt(1, d1)
    n2 = randInt(1, d2 - 1)
    diffNum = n1 * (l / d1) - n2 * (l / d2)
  } while (diffNum <= 0)

  const { num: sNum, den: sDen } = simplify(diffNum, l)
  const correctAnswer = sDen === 1 ? `${sNum}` : `${sNum}/${sDen}`

  const distractors = [
    `${Math.abs(n1 - n2)}/${d1}`,
    `${diffNum + 1}/${l}`,
    `${sNum}/${sDen + 2}`
  ].filter(d => d !== correctAnswer)

  const { options, correct } = buildOptions(correctAnswer, distractors)

  return {
    type: 'fraction',
    question: `Quanto é ${n1}/${d1} - ${n2}/${d2}?`,
    options,
    correct,
    explanation: `Para subtrair ${n1}/${d1} - ${n2}/${d2}, encontramos o MMC de ${d1} e ${d2} = ${l}. Assim: ${n1*(l/d1)}/${l} - ${n2*(l/d2)}/${l} = ${diffNum}/${l}${correctAnswer !== `${diffNum}/${l}` ? ` = ${correctAnswer}` : ''}.`
  }
}

function simplifyFraction() {
  const pairs = [
    [2,4],[3,6],[4,8],[6,12],[4,12],[6,9],[8,12],[4,6],[6,8],[10,12],[2,6],[3,9]
  ]
  const [num, den] = pick(pairs)
  const { num: sNum, den: sDen } = simplify(num, den)
  const correctAnswer = sDen === 1 ? `${sNum}` : `${sNum}/${sDen}`
  const g = gcd(num, den)

  const distractors = [
    `${num}/${den}`,
    `${sNum + 1}/${sDen}`,
    `${sNum}/${sDen + 1}`
  ].filter(d => d !== correctAnswer)

  const { options, correct } = buildOptions(correctAnswer, distractors)

  return {
    type: 'fraction',
    question: `Simplifique a fração ${num}/${den}:`,
    options,
    correct,
    explanation: `${num}/${den}: o MDC de ${num} e ${den} é ${g}. Dividindo os dois por ${g}: ${num}÷${g}=${sNum} e ${den}÷${g}=${sDen}. Resultado: ${correctAnswer}.`
  }
}

// === HARD (phases 7-9) ===

function fractionOfQuantity() {
  const cases = [
    [1, 2, 20], [3, 4, 20], [2, 5, 25], [3, 5, 20], [1, 4, 16],
    [3, 4, 16], [2, 3, 18], [1, 3, 18], [5, 8, 24], [3, 8, 24],
    [2, 5, 30], [3, 10, 20], [1, 4, 24], [3, 4, 24]
  ]
  const [num, den, whole] = pick(cases)
  const result = (whole / den) * num

  const correctAnswer = `${result}`
  const distractors = [
    `${result + den}`,
    `${result + 1}`,
    `${whole - result}`,
    `${result * 2}`
  ].filter(d => d !== correctAnswer).slice(0, 3)

  const { options, correct } = buildOptions(correctAnswer, distractors)

  const contexts = [
    `Uma escola tem ${whole} alunos. ${num}/${den} deles praticam esportes.`,
    `Em uma caixa há ${whole} laranjas. ${num}/${den} das laranjas estão maduras.`,
    `Uma fazenda tem ${whole} animais. ${num}/${den} são vacas.`,
    `Em uma festa há ${whole} pessoas. ${num}/${den} são crianças.`
  ]

  return {
    type: 'fraction',
    question: `${pick(contexts)}\nQuantos são ${num}/${den} de ${whole}?`,
    options,
    correct,
    explanation: `Para calcular ${num}/${den} de ${whole}: dividimos ${whole} por ${den} (= ${whole/den}) e multiplicamos por ${num}. Resultado: ${whole/den} × ${num} = ${result}.`
  }
}

function mixedToImproper() {
  const whole = randInt(1, 4)
  const den = pick([2, 3, 4, 5, 6])
  const num = randInt(1, den - 1)
  const improperNum = whole * den + num

  const correctAnswer = `${improperNum}/${den}`
  const distractors = [
    `${improperNum + 1}/${den}`,
    `${whole + num}/${den}`,
    `${improperNum}/${den + 1}`
  ]
  const { options, correct } = buildOptions(correctAnswer, distractors)

  return {
    type: 'fraction',
    question: `Converta o número misto ${whole} e ${num}/${den} em fração imprópria:`,
    options,
    correct,
    explanation: `Para converter ${whole} ${num}/${den}: multiplicamos a parte inteira (${whole}) pelo denominador (${den}): ${whole}×${den}=${whole*den}. Depois somamos o numerador: ${whole*den}+${num}=${improperNum}. Resultado: ${correctAnswer}.`
  }
}

function improperToMixed() {
  const den = pick([3, 4, 5, 6])
  const whole = randInt(1, 3)
  const remainder = randInt(1, den - 1)
  const num = whole * den + remainder

  const correctAnswer = `${whole} e ${remainder}/${den}`
  const distractors = [
    `${whole + 1} e ${remainder}/${den}`,
    `${whole} e ${remainder + 1}/${den}`,
    `${num - den} e ${den - remainder}/${den}`
  ]
  const { options, correct } = buildOptions(correctAnswer, distractors)

  return {
    type: 'fraction',
    question: `Converta a fração imprópria ${num}/${den} em número misto:`,
    options,
    correct,
    explanation: `${num}÷${den}: a parte inteira é ${whole} (${whole}×${den}=${whole*den}), e o resto é ${remainder}. Resultado: ${whole} e ${remainder}/${den}.`
  }
}

function compareDifferentDenominators() {
  const pairs = [[2,3],[3,4],[2,5],[3,5],[4,5],[2,7],[3,8],[5,6]]
  const [d1, d2] = pick(pairs)
  const n1 = randInt(1, d1 - 1)
  const n2 = randInt(1, d2 - 1)

  const val1 = n1 / d1
  const val2 = n2 / d2
  const askBigger = Math.random() > 0.5
  const correctFrac = askBigger
    ? (val1 >= val2 ? `${n1}/${d1}` : `${n2}/${d2}`)
    : (val1 <= val2 ? `${n1}/${d1}` : `${n2}/${d2}`)

  const wrongFrac = correctFrac === `${n1}/${d1}` ? `${n2}/${d2}` : `${n1}/${d1}`
  const l = lcm(d1, d2)

  const distractors = [wrongFrac, `${n1}/${d2}`, `${n2}/${d1}`]
  const { options, correct } = buildOptions(correctFrac, distractors)

  return {
    type: 'fraction',
    question: `Qual fração é ${askBigger ? 'MAIOR' : 'MENOR'}: ${n1}/${d1} ou ${n2}/${d2}?`,
    options,
    correct,
    explanation: `Para comparar, usamos o MMC de ${d1} e ${d2} = ${l}. ${n1}/${d1} = ${n1*(l/d1)}/${l} e ${n2}/${d2} = ${n2*(l/d2)}/${l}. Como ${n1*(l/d1)} ${n1*(l/d1) > n2*(l/d2) ? '>' : '<'} ${n2*(l/d2)}, a ${askBigger ? 'maior' : 'menor'} é ${correctFrac}.`
  }
}

// === BOSS (phase 10) ===
function bossWordProblem() {
  const cases = [
    { q: () => {
        const total = pick([20, 24, 30])
        const f1 = pick([[1,4],[1,3],[3,4],[2,3]])
        const [n,d] = f1
        const part = Math.floor(total * n / d)
        const absent = total - part
        return {
          question: `Em uma turma de ${total} alunos, ${n}/${d} fizeram a prova e os demais ficaram de recuperação. Quantos ficaram de recuperação?`,
          correct: `${absent}`,
          explanation: `${n}/${d} de ${total} = ${part} fizeram a prova. ${total} - ${part} = ${absent} ficaram de recuperação.`,
          distractors: [`${absent + 2}`, `${total}`, `${part}`].filter(d => d !== `${absent}`).slice(0, 3)
        }
      }
    },
    { q: () => {
        const den = pick([4, 5, 6])
        const num = randInt(1, den - 1)
        const whole = den * randInt(2, 5)
        const res = (whole / den) * num
        return {
          question: `Uma piscina tem capacidade para ${whole} litros. Está com ${num}/${den} de sua capacidade. Quantos litros tem na piscina?`,
          correct: `${res}`,
          explanation: `${num}/${den} de ${whole} = (${whole}÷${den})×${num} = ${whole/den}×${num} = ${res} litros.`,
          distractors: [`${res + 5}`, `${whole - res}`, `${res - den}`]
        }
      }
    }
  ]
  const chosen = pick(cases).q()
  const { options, correct } = buildOptions(chosen.correct, chosen.distractors)
  return {
    type: 'fraction',
    question: chosen.question,
    options,
    correct,
    explanation: chosen.explanation,
    isBoss: true
  }
}

export function generateFractionQuestion(phase) {
  const difficulty = phase <= 3 ? 'easy' : phase <= 6 ? 'medium' : phase <= 9 ? 'hard' : 'boss'

  const easyTypes = [compareSameDenominator, identifyFractionOfParts, equivalentFraction]
  const mediumTypes = [addSameDenominator, addDifferentDenominators, subtractFractions, simplifyFraction]
  const hardTypes = [fractionOfQuantity, mixedToImproper, improperToMixed, compareDifferentDenominators]
  const bossTypes = [fractionOfQuantity, mixedToImproper, bossWordProblem, compareDifferentDenominators]

  const typeMap = { easy: easyTypes, medium: mediumTypes, hard: hardTypes, boss: bossTypes }
  const generators = typeMap[difficulty]
  const gen = generators[Math.floor(Math.random() * generators.length)]

  try {
    return gen()
  } catch {
    return compareSameDenominator()
  }
}
