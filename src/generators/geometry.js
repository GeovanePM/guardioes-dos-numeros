import { randInt, pick, shuffle, buildOptions } from './utils.js'

const NAMES = ['Ana', 'Bia', 'Carlos', 'Daniel', 'Eva', 'Felipe', 'Gabi', 'Hugo', 'João', 'Letícia', 'Marcos', 'Nina']
function name() { return pick(NAMES) }

// ═══════════════════════════════════════════
// FÁCIL (fases 1-3) — Área e perímetro básicos
// ═══════════════════════════════════════════

function areaRetangulo() {
  const c = randInt(2, 12)
  const l = randInt(2, 10)
  const area = c * l
  const correct = `${area} cm²`
  const { options, correct: ci } = buildOptions(correct, [
    `${2 * (c + l)} cm²`,
    `${area + c} cm²`,
    `${area - l > 0 ? area - l : area + l} cm²`
  ])
  return {
    type: 'geometry',
    question: `Um retângulo tem ${c} cm de comprimento e ${l} cm de largura. Qual é a sua área?`,
    options, correct: ci,
    explanation: `Área do retângulo = comprimento × largura = ${c} × ${l} = ${area} cm².`
  }
}

function areaQuadrado() {
  const l = randInt(2, 10)
  const area = l * l
  const perim = 4 * l
  const correct = `${area} cm²`
  const { options, correct: ci } = buildOptions(correct, [
    `${perim} cm²`,
    `${area + l} cm²`,
    `${area - l > 0 ? area - l : area + 2} cm²`
  ])
  return {
    type: 'geometry',
    question: `Um quadrado tem ${l} cm de lado. Qual é a sua área?`,
    options, correct: ci,
    explanation: `Área do quadrado = lado × lado = ${l} × ${l} = ${area} cm².`
  }
}

function perimetroRetangulo() {
  const c = randInt(3, 12)
  const l = randInt(2, 8)
  const p = 2 * (c + l)
  const area = c * l
  const correct = `${p} cm`
  const { options, correct: ci } = buildOptions(correct, [
    `${area} cm`,
    `${p + 4} cm`,
    `${c + l} cm`
  ])
  return {
    type: 'geometry',
    question: `Um retângulo mede ${c} cm de comprimento e ${l} cm de largura. Qual é o seu perímetro?`,
    options, correct: ci,
    explanation: `Perímetro = 2 × (comprimento + largura) = 2 × (${c} + ${l}) = 2 × ${c + l} = ${p} cm.`
  }
}

function contagemAzulejos() {
  const larg = randInt(5, 12)
  const alt = randInt(4, 10)
  const total = larg * alt
  const correct = `${total} azulejos`
  const { options, correct: ci } = buildOptions(correct, [
    `${larg + alt} azulejos`,
    `${total + larg} azulejos`,
    `${total - alt} azulejos`
  ])
  return {
    type: 'geometry',
    question: `Uma parede tem ${larg} azulejos na largura e ${alt} azulejos na altura. Quantos azulejos ao total cobrem essa parede?`,
    options, correct: ci,
    explanation: `Total = largura × altura = ${larg} × ${alt} = ${total} azulejos. Essa também é a área da parede em unidades de azulejo.`
  }
}

// ═══════════════════════════════════════════
// MÉDIO (fases 4-6) — Área aplicada
// ═══════════════════════════════════════════

function areaMetroQuadrado() {
  const c = randInt(2, 10)
  const l = randInt(2, 8)
  const area = c * l
  const n = name()
  const correct = `${area} m²`
  const { options, correct: ci } = buildOptions(correct, [
    `${2 * (c + l)} m²`,
    `${area + c} m²`,
    `${area - l > 0 ? area - l : area + l} m²`
  ])
  return {
    type: 'geometry',
    question: `${n} quer calcular a área do quarto que mede ${c} m de comprimento por ${l} m de largura. Qual é a área em metros quadrados?`,
    options, correct: ci,
    explanation: `Área = comprimento × largura = ${c} × ${l} = ${area} m². O metro quadrado (m²) é a área de um quadrado de 1 m de lado.`
  }
}

function lajotas() {
  const c = randInt(3, 9)
  const l = randInt(3, 7)
  const area = c * l
  const correct = `${area} lajotas`
  const { options, correct: ci } = buildOptions(correct, [
    `${2 * (c + l)} lajotas`,
    `${area + l} lajotas`,
    `${c * (l + 1)} lajotas`
  ])
  return {
    type: 'geometry',
    question: `Um piso mede ${c} lajotas de comprimento e ${l} lajotas de largura. Quantas lajotas são necessárias para cobrir o piso inteiro?`,
    options, correct: ci,
    explanation: `Área = ${c} × ${l} = ${area} lajotas. Para cobrir uma superfície: multiplique o comprimento pela largura.`
  }
}

function perimetroVsArea() {
  const c = randInt(4, 10)
  const l = randInt(2, c - 1)
  const p = 2 * (c + l)
  const area = c * l
  const correct = `Perímetro: ${p} cm e Área: ${area} cm²`
  const { options, correct: ci } = buildOptions(correct, [
    `Perímetro: ${area} cm e Área: ${p} cm²`,
    `Perímetro: ${c + l} cm e Área: ${c * l + 2} cm²`,
    `Perímetro: ${p + 2} cm e Área: ${area - l} cm²`
  ])
  return {
    type: 'geometry',
    question: `Um retângulo mede ${c} cm × ${l} cm. Qual é o seu perímetro E a sua área?`,
    options, correct: ci,
    explanation: `Perímetro = 2×(${c}+${l}) = ${p} cm. Área = ${c}×${l} = ${area} cm². Perímetro mede o contorno; área mede a superfície.`
  }
}

function azulejosFaltam() {
  const total = randInt(20, 60)
  const colocados = randInt(5, total - 5)
  const faltam = total - colocados
  const correct = `${faltam}`
  const { options, correct: ci } = buildOptions(correct, [
    `${total}`,
    `${colocados}`,
    `${faltam + 5}`
  ])
  return {
    type: 'geometry',
    question: `Uma parede precisa de ${total} azulejos no total. Já foram colocados ${colocados}. Quantos azulejos ainda faltam para completar?`,
    options, correct: ci,
    explanation: `${total} − ${colocados} = ${faltam} azulejos faltam.`
  }
}

// ═══════════════════════════════════════════
// DIFÍCIL (fases 7-9) — Volume e triângulo
// ═══════════════════════════════════════════

function volumeParalelepipedo() {
  const c = randInt(2, 8)
  const l = randInt(2, 6)
  const a = randInt(2, 5)
  const vol = c * l * a
  const correct = `${vol} cm³`
  const { options, correct: ci } = buildOptions(correct, [
    `${c * l + a} cm³`,
    `${2 * (c * l + l * a + c * a)} cm³`,
    `${vol + c} cm³`
  ])
  return {
    type: 'geometry',
    question: `Uma caixa tem ${c} cm de comprimento, ${l} cm de largura e ${a} cm de altura. Qual é o seu volume?`,
    options, correct: ci,
    explanation: `Volume do paralelepípedo = comprimento × largura × altura = ${c} × ${l} × ${a} = ${vol} cm³.`
  }
}

function volumeCubo() {
  const l = pick([2, 3, 4, 5])
  const vol = l * l * l
  const correct = `${vol} cm³`
  const { options, correct: ci } = buildOptions(correct, [
    `${l * l} cm³`,
    `${l * l * (l + 1)} cm³`,
    `${vol + l} cm³`
  ])
  return {
    type: 'geometry',
    question: `Um cubo tem ${l} cm de aresta (todos os lados iguais). Qual é o seu volume?`,
    options, correct: ci,
    explanation: `Volume do cubo = aresta × aresta × aresta = ${l} × ${l} × ${l} = ${vol} cm³.`
  }
}

function cubinhosEmpilhados() {
  const c = randInt(2, 5)
  const l = randInt(2, 4)
  const a = randInt(2, 4)
  const vol = c * l * a
  const n = name()
  const correct = `${vol} cubinhos`
  const { options, correct: ci } = buildOptions(correct, [
    `${c * l + a} cubinhos`,
    `${c + l + a} cubinhos`,
    `${vol + c} cubinhos`
  ])
  return {
    type: 'geometry',
    question: `${n} empilhou cubinhos formando um bloco com ${c} de comprimento, ${l} de largura e ${a} de altura. Quantos cubinhos foram usados no total?`,
    options, correct: ci,
    explanation: `Total = comprimento × largura × altura = ${c} × ${l} × ${a} = ${vol} cubinhos. Cada cubinho de 1 cm de aresta ocupa 1 cm³, então o volume também é ${vol} cm³.`
  }
}

function areaTriangulo() {
  const base = pick([4, 6, 8, 10, 12])
  const altura = pick([3, 4, 5, 6, 8])
  const area = (base * altura) / 2
  const correct = `${area} cm²`
  const { options, correct: ci } = buildOptions(correct, [
    `${base * altura} cm²`,
    `${area + base} cm²`,
    `${base + altura} cm²`
  ])
  return {
    type: 'geometry',
    question: `Um triângulo tem base de ${base} cm e altura de ${altura} cm. Qual é a sua área?`,
    options, correct: ci,
    explanation: `Área do triângulo = (base × altura) ÷ 2 = (${base} × ${altura}) ÷ 2 = ${base * altura} ÷ 2 = ${area} cm².`
  }
}

// ═══════════════════════════════════════════
// CHEFE (fase 10)
// ═══════════════════════════════════════════

function bossVolume() {
  const c = randInt(3, 6)
  const l = randInt(2, 5)
  const a = randInt(2, 4)
  const vol = c * l * a
  const n = name()
  const correct = `${vol} cm³`
  const { options, correct: ci } = buildOptions(correct, [
    `${c * l + a} cm³`,
    `${2 * (c + l + a)} cm³`,
    `${vol + l * a} cm³`
  ])
  return {
    type: 'geometry',
    question: `${n} usou cubinhos de 1 cm³ para montar uma caixa com ${c} cm de comprimento, ${l} cm de largura e ${a} cm de altura. Quantos cubinhos foram usados? (= qual é o volume?)`,
    options, correct: ci,
    explanation: `Volume = comprimento × largura × altura = ${c} × ${l} × ${a} = ${vol} cm³. Cada cubinho = 1 cm³, logo o número de cubinhos = volume.`,
    isBoss: true
  }
}

function bossAreaPerimetro() {
  const c = randInt(5, 12)
  const l = randInt(3, c - 1)
  const area = c * l
  const perim = 2 * (c + l)
  const n = name()
  const correct = `${area} cm²`
  const { options, correct: ci } = buildOptions(correct, [
    `${perim} cm²`,
    `${area + l} cm²`,
    `${area - c} cm²`
  ])
  return {
    type: 'geometry',
    question: `A sala de ${n} mede ${c} m de comprimento por ${l} m de largura. O perímetro é ${perim} m. Qual é a área da sala?`,
    options, correct: ci,
    explanation: `Área = comprimento × largura = ${c} × ${l} = ${area} m². (O perímetro — ${perim} m — mede o contorno, não a área.)`,
    isBoss: true
  }
}

export function generateGeometryQuestion(phase) {
  const difficulty = phase <= 3 ? 'easy' : phase <= 6 ? 'medium' : phase <= 9 ? 'hard' : 'boss'

  const easyTypes   = [areaRetangulo, areaQuadrado, perimetroRetangulo, contagemAzulejos]
  const mediumTypes = [areaMetroQuadrado, lajotas, perimetroVsArea, azulejosFaltam]
  const hardTypes   = [volumeParalelepipedo, volumeCubo, cubinhosEmpilhados, areaTriangulo]
  const bossTypes   = [bossVolume, bossAreaPerimetro, volumeParalelepipedo, areaTriangulo]

  const typeMap = { easy: easyTypes, medium: mediumTypes, hard: hardTypes, boss: bossTypes }
  const generators = typeMap[difficulty]
  const gen = generators[Math.floor(Math.random() * generators.length)]

  try {
    return gen()
  } catch {
    return areaRetangulo()
  }
}
