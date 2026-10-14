import { randInt, pick, buildOptions } from './utils.js'

// Names pool for story problems
const NAMES = ['Ana', 'Bia', 'Carlos', 'Daniel', 'Eva', 'Felipe', 'Gabi', 'Hugo', 'Íris', 'João']
const ITEMS = [
  { name: 'balas', unit: '' },
  { name: 'figurinhas', unit: '' },
  { name: 'lápis', unit: '' },
  { name: 'borrachas', unit: '' },
  { name: 'livros', unit: '' },
  { name: 'cadernos', unit: '' }
]
const FOOD = ['laranjas', 'maçãs', 'biscoitos', 'bolinhos', 'chocolates']

function name() { return pick(NAMES) }
function item() { return pick(ITEMS).name }
function food() { return pick(FOOD) }

// === EASY (phases 1-3) ===

function easyAddition() {
  const a = randInt(10, 50)
  const b = randInt(5, 40)
  const result = a + b
  const n = name()
  const it = item()

  const correct = `${result}`
  const { options, correct: ci } = buildOptions(correct, [`${result + 5}`, `${result - 3}`, `${a - b > 0 ? a - b : a + b + 10}`])

  return {
    type: 'problem',
    question: `${n} tinha ${a} ${it} e ganhou mais ${b}. Com quantos ${it} ficou ${n}?`,
    options,
    correct: ci,
    explanation: `${a} + ${b} = ${result}. ${n} ficou com ${result} ${it}.`
  }
}

function easySubtraction() {
  const total = randInt(20, 60)
  const spent = randInt(5, total - 5)
  const result = total - spent
  const n = name()
  const it = item()

  const correct = `${result}`
  const { options, correct: ci } = buildOptions(correct, [`${total + spent}`, `${result + 4}`, `${spent}`])

  return {
    type: 'problem',
    question: `${n} tinha ${total} ${it} e deu ${spent} para um amigo. Quantos ${it} sobraram?`,
    options,
    correct: ci,
    explanation: `${total} - ${spent} = ${result}. Sobraram ${result} ${it}.`
  }
}

function easyMoney() {
  const price = randInt(2, 15)
  const qty = randInt(2, 6)
  const total = price * qty
  const n = name()
  const fd = food()

  const correct = `R$${total},00`
  const { options, correct: ci } = buildOptions(
    correct,
    [`R$${total + price},00`, `R$${total - price},00`, `R$${price + qty},00`]
  )

  return {
    type: 'problem',
    question: `${n} comprou ${qty} pacotes de ${fd} que custam R$${price},00 cada. Quanto pagou no total?`,
    options,
    correct: ci,
    explanation: `${qty} pacotes × R$${price},00 = R$${total},00.`
  }
}

function easyTime() {
  const h = randInt(1, 4)
  const startH = randInt(7, 14)
  const endH = startH + h
  const n = name()

  const correct = `${endH}h`
  const { options, correct: ci } = buildOptions(
    correct,
    [`${endH + 1}h`, `${startH - 1}h`, `${endH - 1}h`]
  )

  return {
    type: 'problem',
    question: `${n} começou a estudar às ${startH}h e estudou por ${h} hora${h > 1 ? 's' : ''}. Que horas terminou?`,
    options,
    correct: ci,
    explanation: `${startH}h + ${h}h = ${endH}h. ${n} terminou às ${endH}h.`
  }
}

// === MEDIUM (phases 4-6) ===

function mediumMultiplication() {
  const a = randInt(3, 12)
  const b = randInt(3, 12)
  const result = a * b
  const n = name()
  const it = item()

  const correct = `${result}`
  const { options, correct: ci } = buildOptions(
    correct,
    [`${result + a}`, `${result - b}`, `${a + b}`]
  )

  return {
    type: 'problem',
    question: `${n} tem ${a} caixas com ${b} ${it} cada. Quantos ${it} ao total?`,
    options,
    correct: ci,
    explanation: `${a} caixas × ${b} ${it} = ${result} ${it} no total.`
  }
}

function mediumDivision() {
  const people = pick([2, 3, 4, 5, 6])
  const result = pick([3, 4, 5, 6, 7, 8, 9])
  const qty = people * result
  const n = name()
  const it = item()

  const correct = `${result}`
  const { options, correct: ci } = buildOptions(
    correct,
    [`${result + 1}`, `${result * 2}`, `${result - 1}`]
  )

  return {
    type: 'problem',
    question: `${n} quer dividir ${qty} ${it} igualmente entre ${people} amigos. Quantos cada um recebe?`,
    options,
    correct: ci,
    explanation: `${qty} ÷ ${people} = ${result}. Cada amigo recebe ${result} ${it}.`
  }
}

function mediumDistance() {
  const speed = randInt(2, 8) * 5
  const time = randInt(2, 5)
  const dist = speed * time
  const n = name()

  const correct = `${dist} km`
  const { options, correct: ci } = buildOptions(
    correct,
    [`${dist + speed} km`, `${dist - speed} km`, `${speed + time} km`]
  )

  return {
    type: 'problem',
    question: `${n} anda de bicicleta a ${speed} km por hora. Em ${time} horas, quantos quilômetros percorre?`,
    options,
    correct: ci,
    explanation: `${speed} km/h × ${time} h = ${dist} km. ${n} percorre ${dist} km.`
  }
}

function mediumChange() {
  const price = randInt(5, 25)
  const paid = price % 5 === 0 ? price + pick([5, 10, 20]) : Math.ceil(price / 10) * 10 + pick([0, 10])
  const change = paid - price
  const n = name()
  const fd = food()

  const correct = `R$${change},00`
  const { options, correct: ci } = buildOptions(
    correct,
    [`R$${change + 5},00`, `R$${change - 2},00`, `R$${paid},00`]
  )

  return {
    type: 'problem',
    question: `${n} comprou uma caixa de ${fd} por R$${price},00 e pagou com R$${paid},00. Qual é o troco?`,
    options,
    correct: ci,
    explanation: `Troco = R$${paid},00 - R$${price},00 = R$${change},00.`
  }
}

// === HARD (phases 7-9) ===

function hardTwoStep() {
  const priceA = randInt(3, 8)
  const qtyA = randInt(2, 5)
  const priceB = randInt(2, 6)
  const qtyB = randInt(2, 4)
  const total = priceA * qtyA + priceB * qtyB
  const budget = (Math.ceil(total / 10) + 1) * 10
  const change = budget - total
  const n = name()
  const fdA = food()
  const fdB = food() !== fdA ? food() : 'biscoitos'

  const correct = `R$${change},00`
  const { options, correct: ci } = buildOptions(
    correct,
    [`R$${total},00`, `R$${change + 5},00`, `R$${priceA * qtyA},00`]
  )

  return {
    type: 'problem',
    question: `${n} comprou ${qtyA} pacotes de ${fdA} a R$${priceA},00 e ${qtyB} pacotes de ${fdB} a R$${priceB},00. Pagou com R$${budget},00. Qual foi o troco?`,
    options,
    correct: ci,
    explanation: `Passo 1: ${qtyA}×R$${priceA} + ${qtyB}×R$${priceB} = R$${priceA*qtyA} + R$${priceB*qtyB} = R$${total}. Passo 2: R$${budget} - R$${total} = R$${change} de troco.`
  }
}

function hardFractionProblem() {
  const total = pick([20, 24, 30, 36])
  const [num, den] = pick([[1,4],[3,4],[1,3],[2,3],[1,2]])
  const part = (total / den) * num
  const rest = total - part
  const n = name()

  const correct = `${rest}`
  const { options, correct: ci } = buildOptions(
    correct,
    [`${part}`, `${total}`, `${rest + num}`]
  )

  return {
    type: 'problem',
    question: `Em uma turma de ${total} alunos, ${num}/${den} participaram do passeio. Quantos NÃO participaram?`,
    options,
    correct: ci,
    explanation: `${num}/${den} de ${total} = ${part} alunos participaram. Os que não participaram: ${total} - ${part} = ${rest}.`
  }
}

function hardPercentage() {
  const price = pick([20, 30, 40, 50, 60, 80, 100])
  const pct = pick([10, 20, 25, 50])
  const discount = price * pct / 100
  const final = price - discount

  const n = name()
  const correct = `R$${final},00`
  const { options, correct: ci } = buildOptions(
    correct,
    [`R$${discount},00`, `R$${final + 10},00`, `R$${price - pct},00`]
  )

  return {
    type: 'problem',
    question: `Um produto custa R$${price},00. Com desconto de ${pct}%, qual o preço final?`,
    options,
    correct: ci,
    explanation: `${pct}% de R$${price} = R$${discount}. Preço final: R$${price} - R$${discount} = R$${final}. Lembre: ${pct}% = ${pct}/100.`
  }
}

function hardTimeCalc() {
  const h1 = randInt(6, 10)
  const m1 = pick([0, 15, 30, 45])
  const addH = randInt(1, 3)
  const addM = pick([0, 15, 30, 45])
  let endM = m1 + addM
  let endH = h1 + addH + Math.floor(endM / 60)
  endM = endM % 60

  const pad = (n) => n.toString().padStart(2, '0')
  const correct = `${pad(endH)}h${pad(endM)}`
  const { options, correct: ci } = buildOptions(
    correct,
    [
      `${pad(endH + 1)}h${pad(endM)}`,
      `${pad(endH)}h${pad((endM + 15) % 60)}`,
      `${pad(h1 + addH)}h${pad(m1)}`
    ]
  )

  const n = name()
  return {
    type: 'problem',
    question: `${n} saiu de casa às ${pad(h1)}h${pad(m1)} e o trajeto durou ${addH}h${addM > 0 ? ` e ${addM} min` : ''}. Que horas chegou?`,
    options,
    correct: ci,
    explanation: `${pad(h1)}h${pad(m1)} + ${addH}h${addM}min = ${correct}.`
  }
}

// === BOSS (phase 10) ===

function bossComplex() {
  const nStudents = pick([25, 30, 40])
  const pctPresent = pick([60, 80, 100])
  const present = nStudents * pctPresent / 100
  const absent = nStudents - present
  const n = name()

  const correct = `${absent}`
  const { options, correct: ci } = buildOptions(
    correct,
    [`${present}`, `${nStudents}`, `${absent + 5}`]
  )

  return {
    type: 'problem',
    question: `Uma turma tem ${nStudents} alunos. ${pctPresent}% estavam presentes em um dia. Quantos faltaram?`,
    options,
    correct: ci,
    explanation: `${pctPresent}% de ${nStudents} = ${present} presentes. Faltaram: ${nStudents} - ${present} = ${absent} alunos.`,
    isBoss: true
  }
}

export function generateProblemQuestion(phase) {
  const difficulty = phase <= 3 ? 'easy' : phase <= 6 ? 'medium' : phase <= 9 ? 'hard' : 'boss'

  const easyTypes = [easyAddition, easySubtraction, easyMoney, easyTime]
  const mediumTypes = [mediumMultiplication, mediumDivision, mediumDistance, mediumChange]
  const hardTypes = [hardTwoStep, hardFractionProblem, hardPercentage, hardTimeCalc]
  const bossTypes = [hardTwoStep, hardFractionProblem, hardPercentage, bossComplex]

  const typeMap = { easy: easyTypes, medium: mediumTypes, hard: hardTypes, boss: bossTypes }
  const generators = typeMap[difficulty]
  const gen = generators[Math.floor(Math.random() * generators.length)]

  try {
    return gen()
  } catch {
    return easyAddition()
  }
}
