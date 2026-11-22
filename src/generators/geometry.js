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

function perimetroQuadrado() {
  const l = randInt(2, 12)
  const p = 4 * l
  const area = l * l
  const correct = `${p} cm`
  const { options, correct: ci } = buildOptions(correct, [
    `${area} cm`, `${2 * l} cm`, `${p + 4} cm`
  ])
  return {
    type: 'geometry',
    question: `Um quadrado tem ${l} cm de lado. Qual é o seu PERÍMETRO?`,
    options, correct: ci,
    explanation: `Perímetro do quadrado = 4 × lado = 4 × ${l} = ${p} cm. (A área seria ${l}² = ${area} cm².)`
  }
}

function comparaAreas() {
  const c1 = randInt(3, 10), l1 = randInt(2, 8)
  let c2, l2
  do { c2 = randInt(3, 10); l2 = randInt(2, 8) } while (c1 * l1 === c2 * l2)
  const a1 = c1 * l1, a2 = c2 * l2
  const maiorLabel = a1 > a2 ? `Retângulo A (${c1}×${l1} = ${a1} cm²)` : `Retângulo B (${c2}×${l2} = ${a2} cm²)`
  const menorLabel = a1 > a2 ? `Retângulo B (${c2}×${l2} = ${a2} cm²)` : `Retângulo A (${c1}×${l1} = ${a1} cm²)`
  const { options, correct: ci } = buildOptions(maiorLabel, [menorLabel, 'São iguais', `Retângulo A (${c1}×${l1} = ${a1 + 2} cm²)`])
  return {
    type: 'geometry',
    question: `Dois retângulos:\nRetângulo A: ${c1} cm × ${l1} cm\nRetângulo B: ${c2} cm × ${l2} cm\nQual tem MAIOR área?`,
    options, correct: ci,
    explanation: `Área A = ${c1}×${l1} = ${a1} cm². Área B = ${c2}×${l2} = ${a2} cm². ${a1 > a2 ? 'A' : 'B'} é maior.`
  }
}

function ladoFaltante() {
  const pares = [[2,6],[2,8],[2,10],[3,4],[3,5],[3,6],[3,8],[4,4],[4,5],[4,6],[5,5],[5,6]]
  const [lado1, lado2] = pick(pares)
  const area = lado1 * lado2
  const [conhecido, desconhecido] = Math.random() > 0.5 ? [lado1, lado2] : [lado2, lado1]
  const correct = `${desconhecido} cm`
  const { options, correct: ci } = buildOptions(correct, [
    `${desconhecido + 2} cm`, `${area} cm`, `${desconhecido - 1 > 0 ? desconhecido - 1 : desconhecido + 3} cm`
  ])
  return {
    type: 'geometry',
    question: `Um retângulo tem área de ${area} cm² e um dos lados mede ${conhecido} cm. Qual é a medida do OUTRO lado?`,
    options, correct: ci,
    explanation: `Área = comprimento × largura → lado desconhecido = ${area} ÷ ${conhecido} = ${desconhecido} cm.`
  }
}

// ═══════════════════════════════════════════
// MÉDIO (fases 7-8) — Área aplicada
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

function areaDescoberta() {
  const c = randInt(4, 10), l = randInt(3, 8)
  const totalArea = c * l
  const coberto = randInt(2, totalArea - 2)
  const descoberto = totalArea - coberto
  const n = name()
  const correct = `${descoberto} m²`
  const { options, correct: ci } = buildOptions(correct, [
    `${coberto} m²`, `${totalArea} m²`, `${descoberto + 2} m²`
  ])
  return {
    type: 'geometry',
    question: `${n} tem um quarto de ${c} m × ${l} m (área total = ${totalArea} m²). Um tapete cobre ${coberto} m² do chão. Qual é a área do chão que ficou DESCOBERTA?`,
    options, correct: ci,
    explanation: `Área descoberta = área total − área coberta = ${totalArea} − ${coberto} = ${descoberto} m².`
  }
}

function quantasLajotasM2() {
  const c = randInt(3, 8), l = randInt(2, 6)
  const area = c * l
  const n = name()
  const correct = `${area} lajotas`
  const { options, correct: ci } = buildOptions(correct, [
    `${2 * (c + l)} lajotas`, `${area + c} lajotas`, `${area - l > 0 ? area - l : area + l} lajotas`
  ])
  return {
    type: 'geometry',
    question: `${n} quer cobrir o piso de uma sala de ${c} m × ${l} m com lajotas de 1 m². Quantas lajotas são necessárias?`,
    options, correct: ci,
    explanation: `Área = ${c} × ${l} = ${area} m². Como cada lajota tem 1 m², são necessárias ${area} lajotas.`
  }
}

function perimetroVsAreaQuadrado() {
  const l = randInt(3, 9)
  const area = l * l
  const perim = 4 * l
  const perguntar = Math.random() > 0.5 ? 'área' : 'perímetro'
  const correct = perguntar === 'área' ? `${area} cm²` : `${perim} cm`
  const { options, correct: ci } = buildOptions(correct, [
    perguntar === 'área' ? `${perim} cm²` : `${area} cm`,
    perguntar === 'área' ? `${area + l} cm²` : `${perim + 4} cm`,
    perguntar === 'área' ? `${4 * l} cm²` : `${l * l} cm`
  ])
  return {
    type: 'geometry',
    question: `Um quadrado tem ${l} cm de lado. Qual é a ${perguntar === 'área' ? 'ÁREA' : 'PERÍMETRO'} desse quadrado?`,
    options, correct: ci,
    explanation: perguntar === 'área'
      ? `Área do quadrado = lado × lado = ${l} × ${l} = ${area} cm².`
      : `Perímetro do quadrado = 4 × lado = 4 × ${l} = ${perim} cm.`
  }
}

// ═══════════════════════════════════════════
// DIFÍCIL (fase 9) — Volume e triângulo
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

function volumeComparacao() {
  const c1 = randInt(2, 6), l1 = randInt(2, 5), a1 = randInt(2, 4)
  let c2, l2, a2
  do { c2 = randInt(2, 6); l2 = randInt(2, 5); a2 = randInt(2, 4) } while (c1 * l1 * a1 === c2 * l2 * a2)
  const v1 = c1 * l1 * a1, v2 = c2 * l2 * a2
  const maiorLabel = v1 > v2 ? `Caixa A (${v1} cm³)` : `Caixa B (${v2} cm³)`
  const menorLabel = v1 > v2 ? `Caixa B (${v2} cm³)` : `Caixa A (${v1} cm³)`
  const { options, correct: ci } = buildOptions(maiorLabel, [menorLabel, 'São iguais', v1 > v2 ? `Caixa A (${v1 + 2} cm³)` : `Caixa B (${v2 + 2} cm³)`])
  return {
    type: 'geometry',
    question: `Duas caixas:\nCaixa A: ${c1} cm × ${l1} cm × ${a1} cm\nCaixa B: ${c2} cm × ${l2} cm × ${a2} cm\nQual tem MAIOR volume?`,
    options, correct: ci,
    explanation: `Volume A = ${c1}×${l1}×${a1} = ${v1} cm³. Volume B = ${c2}×${l2}×${a2} = ${v2} cm³. ${v1 > v2 ? 'A' : 'B'} é maior.`
  }
}

function areaTotalDoisQuartos() {
  const c1 = randInt(3, 8), l1 = randInt(2, 6)
  const c2 = randInt(3, 7), l2 = randInt(2, 5)
  const a1 = c1 * l1, a2 = c2 * l2
  const total = a1 + a2
  const correct = `${total} m²`
  const { options, correct: ci } = buildOptions(correct, [
    `${a1} m²`, `${total + 4} m²`, `${Math.max(a1, a2)} m²`
  ])
  return {
    type: 'geometry',
    question: `Dois quartos de uma casa:\nQuarto 1: ${c1} m × ${l1} m\nQuarto 2: ${c2} m × ${l2} m\nQual é a área TOTAL dos dois quartos juntos?`,
    options, correct: ci,
    explanation: `Quarto 1 = ${c1}×${l1} = ${a1} m². Quarto 2 = ${c2}×${l2} = ${a2} m². Total = ${a1} + ${a2} = ${total} m².`
  }
}

function cubinhosParaEncher() {
  const c = randInt(2, 6), l = randInt(2, 5), a = randInt(2, 4)
  const vol = c * l * a
  const n = name()
  const correct = `${vol} cubinhos`
  const { options, correct: ci } = buildOptions(correct, [
    `${c + l + a} cubinhos`, `${c * l + a} cubinhos`, `${vol + l} cubinhos`
  ])
  return {
    type: 'geometry',
    question: `${n} tem uma caixa de ${c} cm de comprimento, ${l} cm de largura e ${a} cm de altura. Quantos cubinhos de 1 cm³ são necessários para ENCHER a caixa?`,
    options, correct: ci,
    explanation: `Volume = ${c} × ${l} × ${a} = ${vol} cm³. Como cada cubinho tem 1 cm³, são necessários ${vol} cubinhos.`
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
  // Fases 6: fácil | 7-8: médio | 9: difícil | 10: chefe
  const difficulty = phase <= 6 ? 'easy' : phase <= 8 ? 'medium' : phase <= 9 ? 'hard' : 'boss'

  const easyTypes   = [areaRetangulo, areaQuadrado, perimetroRetangulo, contagemAzulejos, perimetroQuadrado, comparaAreas, ladoFaltante]
  const mediumTypes = [areaMetroQuadrado, lajotas, perimetroVsArea, azulejosFaltam, areaDescoberta, quantasLajotasM2, perimetroVsAreaQuadrado]
  const hardTypes   = [volumeParalelepipedo, volumeCubo, cubinhosEmpilhados, areaTriangulo, volumeComparacao, areaTotalDoisQuartos, cubinhosParaEncher]
  const bossTypes   = [bossVolume, bossAreaPerimetro, volumeParalelepipedo, areaTriangulo, volumeComparacao]

  const typeMap = { easy: easyTypes, medium: mediumTypes, hard: hardTypes, boss: bossTypes }
  const generators = typeMap[difficulty]
  const gen = generators[Math.floor(Math.random() * generators.length)]

  try {
    return gen()
  } catch {
    return areaRetangulo()
  }
}
