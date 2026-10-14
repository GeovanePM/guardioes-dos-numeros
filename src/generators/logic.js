import { randInt, pick, shuffle, buildOptions } from './utils.js'

// === EASY (phases 1-3) ===

function arithmeticSequenceMissing() {
  const start = randInt(1, 20)
  const diff = pick([2, 3, 4, 5, 10])
  const len = 5
  const missingIdx = pick([2, 3]) // index 0-4
  const seq = Array.from({ length: len }, (_, i) => start + i * diff)
  const missingVal = seq[missingIdx]

  const shown = seq.map((v, i) => i === missingIdx ? '___' : `${v}`)
  const correct = `${missingVal}`
  const { options, correct: ci } = buildOptions(
    correct,
    [`${missingVal + diff}`, `${missingVal - diff}`, `${missingVal + diff * 2}`]
  )

  return {
    type: 'logic',
    question: `Complete a sequência: ${shown.join(', ')}`,
    options,
    correct: ci,
    explanation: `A sequência aumenta de ${diff} em ${diff}. O número que falta é ${missingVal} (${seq[missingIdx - 1]} + ${diff} = ${missingVal}).`
  }
}

function continueSequence() {
  const start = randInt(1, 15)
  const diff = pick([2, 3, 5, 10])
  const seq = [start, start + diff, start + diff * 2, start + diff * 3]
  const next = start + diff * 4

  const correct = `${next}`
  const { options, correct: ci } = buildOptions(
    correct,
    [`${next + diff}`, `${next - diff}`, `${next + 1}`]
  )

  return {
    type: 'logic',
    question: `Qual é o próximo número da sequência?\n${seq.join(', ')}, ___`,
    options,
    correct: ci,
    explanation: `Cada número aumenta ${diff}. O próximo é ${seq[seq.length - 1]} + ${diff} = ${next}.`
  }
}

function evenOddMissing() {
  const isEven = Math.random() > 0.5
  const start = isEven ? randInt(1, 5) * 2 : randInt(1, 5) * 2 - 1
  const seq = [start, start + 2, start + 4, start + 6, start + 8]
  const missingIdx = pick([1, 2, 3])
  const missingVal = seq[missingIdx]

  const shown = seq.map((v, i) => i === missingIdx ? '___' : `${v}`)
  const correct = `${missingVal}`
  const { options, correct: ci } = buildOptions(
    correct,
    [`${missingVal + 1}`, `${missingVal + 2}`, `${missingVal - 2}`]
  )

  return {
    type: 'logic',
    question: `Complete a sequência de números ${isEven ? 'pares' : 'ímpares'}:\n${shown.join(', ')}`,
    options,
    correct: ci,
    explanation: `A sequência é de números ${isEven ? 'pares' : 'ímpares'} aumentando de 2 em 2. O número que falta é ${missingVal}.`
  }
}

function whichComesBefore() {
  const diff = pick([3, 4, 5, 6])
  const mid = randInt(10, 40)
  const before = mid - diff
  const after = mid + diff

  const correct = `${before}`
  const { options, correct: ci } = buildOptions(
    correct,
    [`${before + 1}`, `${before - diff}`, `${after}`]
  )

  return {
    type: 'logic',
    question: `Na sequência onde cada número aumenta ${diff}, qual número vem ANTES de ${mid}?\n___, ${mid}, ${after}`,
    options,
    correct: ci,
    explanation: `Como a sequência aumenta de ${diff} em ${diff}, o número antes de ${mid} é ${mid} - ${diff} = ${before}.`
  }
}

// === MEDIUM (phases 4-6) ===

function geometricSequence() {
  const start = pick([1, 2, 3])
  const ratio = pick([2, 3])
  const seq = [start, start * ratio, start * ratio ** 2, start * ratio ** 3]
  const next = start * ratio ** 4

  const correct = `${next}`
  const { options, correct: ci } = buildOptions(
    correct,
    [`${next + ratio}`, `${next * ratio}`, `${seq[3] + seq[2]}`]
  )

  return {
    type: 'logic',
    question: `Qual é o próximo número da sequência?\n${seq.join(', ')}, ___`,
    options,
    correct: ci,
    explanation: `Cada número é multiplicado por ${ratio}. ${seq[seq.length - 1]} × ${ratio} = ${next}.`
  }
}

function whichDoesntBelong() {
  const types = [
    () => {
      const evens = [2, 4, 6, 8, 10, 12, 14, 16]
      const odds = [1, 3, 5, 7, 9, 11, 13]
      const mainSet = shuffle(evens).slice(0, 3)
      const intruder = pick(odds)
      const all = shuffle([...mainSet, intruder])
      return {
        items: all,
        correct: `${intruder}`,
        explanation: `${intruder} é o único número ÍMPAR. Os outros (${mainSet.join(', ')}) são todos pares.`
      }
    },
    () => {
      const multiples5 = [5, 10, 15, 20, 25, 30, 35]
      const mainSet = shuffle(multiples5).slice(0, 3)
      const candidates = [7, 11, 13, 17, 22, 23, 28]
      const intruder = pick(candidates)
      const all = shuffle([...mainSet, intruder])
      return {
        items: all,
        correct: `${intruder}`,
        explanation: `${intruder} não é múltiplo de 5. Os outros (${mainSet.join(', ')}) são todos múltiplos de 5.`
      }
    },
    () => {
      const base = pick([2, 3, 4, 5, 6])
      const multiples = [base * 2, base * 3, base * 4, base * 5, base * 6, base * 7]
      const mainSet = shuffle(multiples).slice(0, 3)
      const intruder = mainSet[0] + 1
      const all = shuffle([...mainSet, intruder])
      return {
        items: all,
        correct: `${intruder}`,
        explanation: `${intruder} não é múltiplo de ${base}. Os outros (${mainSet.join(', ')}) são múltiplos de ${base}.`
      }
    },
    () => {
      const primes = [2, 3, 5, 7, 11, 13, 17, 19]
      const notPrimes = [4, 6, 8, 9, 10, 12, 14, 15]
      const mainSet = shuffle(primes).slice(0, 3)
      const intruder = pick(notPrimes)
      const all = shuffle([...mainSet, intruder])
      return {
        items: all,
        correct: `${intruder}`,
        explanation: `${intruder} não é primo (tem divisores além de 1 e ele mesmo). Os outros (${mainSet.join(', ')}) são números primos.`
      }
    }
  ]

  const { items, correct, explanation } = pick(types)()
  const { options, correct: ci } = buildOptions(correct, items.filter(v => `${v}` !== correct).map(v => `${v}`))

  return {
    type: 'logic',
    question: `Qual número NÃO pertence ao grupo?\n${items.join(', ')}`,
    options,
    correct: ci,
    explanation
  }
}

function alternatingPattern() {
  const a_diff = pick([1, 2, 3])
  const b_diff = pick([2, 4, 5])
  const a_start = randInt(1, 10)
  const b_start = randInt(a_start + 2, a_start + 10)

  // Alternating: a1, b1, a2, b2, a3, b3
  const seq = [
    a_start,
    b_start,
    a_start + a_diff,
    b_start + b_diff,
    a_start + a_diff * 2,
    b_start + b_diff * 2
  ]
  const missingIdx = pick([2, 3, 4, 5])
  const missingVal = seq[missingIdx]

  const shown = seq.map((v, i) => i === missingIdx ? '___' : `${v}`)
  const correct = `${missingVal}`
  const { options, correct: ci } = buildOptions(
    correct,
    [`${missingVal + a_diff}`, `${missingVal - b_diff}`, `${missingVal + 1}`]
  )

  return {
    type: 'logic',
    question: `Complete a sequência de dois padrões:\n${shown.join(', ')}`,
    options,
    correct: ci,
    explanation: `Esta sequência tem dois padrões alternados: posições ímpares (${a_start}, ${a_start+a_diff}, ...) aumentam de ${a_diff} e posições pares (${b_start}, ${b_start+b_diff}, ...) aumentam de ${b_diff}. O valor que falta é ${missingVal}.`
  }
}

// === HARD (phases 7-9) ===

function fibonacciLike() {
  const a = randInt(1, 5)
  const b = randInt(a, a + 4)
  const seq = [a, b]
  for (let i = 2; i < 7; i++) seq.push(seq[i-1] + seq[i-2])
  const missingIdx = pick([4, 5, 6])
  const missingVal = seq[missingIdx]

  const shown = seq.slice(0, missingIdx + 1).map((v, i) => i === missingIdx ? '___' : `${v}`)
  const correct = `${missingVal}`
  const { options, correct: ci } = buildOptions(
    correct,
    [`${missingVal + seq[missingIdx - 1]}`, `${missingVal - 1}`, `${missingVal + 2}`]
  )

  return {
    type: 'logic',
    question: `Complete a sequência (cada número é a soma dos dois anteriores):\n${shown.join(', ')}`,
    options,
    correct: ci,
    explanation: `Cada número = soma dos dois anteriores. ${seq[missingIdx-2]} + ${seq[missingIdx-1]} = ${missingVal}.`
  }
}

function deductionHeight() {
  const names4 = shuffle(['Ana', 'Bia', 'Carol', 'Duda', 'Eva', 'Fabi', 'Gabi'])
    .slice(0, pick([3, 4]))
  const heights = names4.map((_, i) => 140 + i * 5 + randInt(0, 3))
  const sorted = [...heights].sort((a, b) => b - a)
  const pairedSorted = names4.map((n, i) => ({ name: n, h: heights[i] }))
    .sort((a, b) => b.h - a.h)

  const tallest = pairedSorted[0].name
  const shortest = pairedSorted[pairedSorted.length - 1].name

  const clues = []
  for (let i = 0; i < pairedSorted.length - 1; i++) {
    clues.push(`${pairedSorted[i].name} é mais alta que ${pairedSorted[i+1].name}.`)
  }
  const shuffledClues = shuffle(clues)

  const askTallest = Math.random() > 0.5
  const correct = askTallest ? tallest : shortest
  const others = pairedSorted.map(p => p.name).filter(n => n !== correct)
  const { options, correct: ci } = buildOptions(correct, others)

  return {
    type: 'logic',
    question: `Com as pistas abaixo, quem é ${askTallest ? 'a mais alta' : 'a mais baixa'}?\n\n${shuffledClues.join('\n')}`,
    options,
    correct: ci,
    explanation: `Ordenando do mais alto para o mais baixo: ${pairedSorted.map(p => p.name).join(' > ')}. ${askTallest ? 'A mais alta' : 'A mais baixa'} é ${correct}.`
  }
}

function deductionAge() {
  const names3 = shuffle(['Pedro', 'Lucas', 'Mateus', 'João', 'Rafael', 'André']).slice(0, 3)
  const baseAge = randInt(8, 12)
  const ages = [baseAge, baseAge + 2, baseAge + 4]
  const shuffledNames = shuffle(names3)
  const people = shuffledNames.map((n, i) => ({ name: n, age: ages[i] }))
    .sort((a, b) => b.age - a.age)

  const oldest = people[0].name
  const youngest = people[2].name

  const clues = []
  for (let i = 0; i < people.length - 1; i++) {
    clues.push(`${people[i].name} é mais velho que ${people[i+1].name}.`)
  }
  const shuffledClues = shuffle(clues)

  const askOldest = Math.random() > 0.5
  const correct = askOldest ? oldest : youngest
  const others = people.map(p => p.name).filter(n => n !== correct)
  const { options, correct: ci } = buildOptions(correct, others)

  return {
    type: 'logic',
    question: `Com as pistas abaixo, quem é ${askOldest ? 'o mais velho' : 'o mais novo'}?\n\n${shuffledClues.join('\n')}`,
    options,
    correct: ci,
    explanation: `Ordenando do mais velho ao mais novo: ${people.map(p => p.name).join(' > ')}. ${askOldest ? 'O mais velho' : 'O mais novo'} é ${correct}.`
  }
}

function riddleNumber() {
  const templates = [
    () => {
      const n = pick([2, 3, 4, 5, 6])
      return {
        clues: [
          `Sou um número par.`,
          `Sou maior que ${n * 2} e menor que ${n * 2 + 6}.`,
          `Não sou ${n * 2 + 2}.`
        ],
        correct: `${n * 2 + 4}`,
        explanation: `Números pares entre ${n*2} e ${n*2+6}: ${n*2+2} e ${n*2+4}. Como não é ${n*2+2}, a resposta é ${n*2+4}.`,
        distractors: [`${n*2+2}`, `${n*2+1}`, `${n*2+6}`]
      }
    },
    () => {
      const mult = pick([3, 4, 5])
      const base = randInt(2, 5)
      const n = base * mult
      return {
        clues: [
          `Sou múltiplo de ${mult}.`,
          `Tenho dois algarismos.`,
          `Sou menor que ${n + mult * 2}.`,
          `Sou maior que ${n - mult}.`
        ],
        correct: `${n}`,
        explanation: `Múltiplos de ${mult} entre ${n - mult} e ${n + mult * 2}: ${n} (pois ${n-mult} < ${n} < ${n + mult * 2}).`,
        distractors: [`${n + mult}`, `${n - mult}`, `${n + 1}`]
      }
    }
  ]

  const { clues, correct, explanation, distractors } = pick(templates)()
  const { options, correct: ci } = buildOptions(correct, distractors)

  return {
    type: 'logic',
    question: `Descubra o número com as pistas:\n\n${clues.join('\n')}`,
    options,
    correct: ci,
    explanation
  }
}

function complexWhichDoesntBelong() {
  const items = [
    () => {
      const squares = [1, 4, 9, 16, 25, 36, 49, 64]
      const set3 = shuffle(squares).slice(0, 3)
      const intruder = pick([6, 8, 10, 12, 15, 18, 20, 24])
      const all = shuffle([...set3, intruder])
      return {
        items: all.map(v => `${v}`),
        correct: `${intruder}`,
        explanation: `${intruder} não é quadrado perfeito. Os outros (${set3.join(', ')}) são quadrados perfeitos (${set3.map(v => `${Math.sqrt(v)}²`).join(', ')}).`
      }
    },
    () => {
      const cubeNums = [1, 8, 27, 64]
      const mainSet = shuffle(cubeNums).slice(0, 2)
      const intruder = pick([6, 12, 18, 20])
      const filler = pick(cubeNums.filter(v => !mainSet.includes(v)))
      const all = shuffle([...mainSet, intruder, filler])
      return {
        items: all.map(v => `${v}`),
        correct: `${intruder}`,
        explanation: `${intruder} não é cubo perfeito. Os cubos são: 1=1³, 8=2³, 27=3³, 64=4³.`
      }
    }
  ]

  const { items: its, correct, explanation } = pick(items)()
  const { options, correct: ci } = buildOptions(correct, its.filter(v => v !== correct))

  return {
    type: 'logic',
    question: `Qual número NÃO pertence ao grupo (pense em propriedades matemáticas)?\n${its.join(', ')}`,
    options,
    correct: ci,
    explanation
  }
}

export function generateLogicQuestion(phase) {
  const difficulty = phase <= 3 ? 'easy' : phase <= 6 ? 'medium' : phase <= 9 ? 'hard' : 'boss'

  const easyTypes = [arithmeticSequenceMissing, continueSequence, evenOddMissing, whichComesBefore]
  const mediumTypes = [geometricSequence, whichDoesntBelong, alternatingPattern]
  const hardTypes = [fibonacciLike, deductionHeight, deductionAge, riddleNumber, complexWhichDoesntBelong]
  const bossTypes = [fibonacciLike, deductionHeight, riddleNumber, complexWhichDoesntBelong]

  const typeMap = { easy: easyTypes, medium: mediumTypes, hard: hardTypes, boss: bossTypes }
  const generators = typeMap[difficulty]
  const gen = generators[Math.floor(Math.random() * generators.length)]

  try {
    return gen()
  } catch {
    return continueSequence()
  }
}
