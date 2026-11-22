import { randInt, pick, shuffle, buildOptions } from './utils.js'

// ═══════════════════════════════════════════
// FÁCIL (fases 1-3) — Leitura de tabelas
// ═══════════════════════════════════════════

function lerTabelaMaiorMenor() {
  const temas = [
    { categorias: ['Cachorro', 'Gato', 'Coelho', 'Peixe', 'Tartaruga'], contexto: 'animais de estimação da turma' },
    { categorias: ['Futebol', 'Vôlei', 'Basquete', 'Natação', 'Outros'], contexto: 'esporte favorito dos alunos' },
    { categorias: ['Banana', 'Maçã', 'Morango', 'Uva', 'Laranja'], contexto: 'fruta preferida da turma' },
  ]
  const tema = pick(temas)
  const n = pick([3, 4])
  const selecionadas = shuffle(tema.categorias).slice(0, n)
  const valores = selecionadas.map(() => randInt(2, 20))
  const maxIdx = valores.indexOf(Math.max(...valores))
  const minIdx = valores.indexOf(Math.min(...valores))
  const askMax = Math.random() > 0.5
  const correct = askMax ? selecionadas[maxIdx] : selecionadas[minIdx]
  const others = selecionadas.filter(c => c !== correct)
  const { options, correct: ci } = buildOptions(correct, others)

  const tabela = selecionadas.map((c, i) => `${c}: ${valores[i]}`).join(' | ')
  return {
    type: 'statistics',
    question: `Tabela de ${tema.contexto}:\n${tabela}\nQual categoria tem ${askMax ? 'MAIS' : 'MENOS'} votos?`,
    options, correct: ci,
    explanation: `${askMax ? 'O maior valor' : 'O menor valor'} é ${askMax ? Math.max(...valores) : Math.min(...valores)}, que corresponde a ${correct}.`
  }
}

function amplitudeDados() {
  const n = randInt(4, 6)
  const vals = Array.from({ length: n }, () => randInt(2, 25))
  const max = Math.max(...vals)
  const min = Math.min(...vals)
  const amp = max - min
  const correct = `${amp}`
  const { options, correct: ci } = buildOptions(correct, [
    `${max}`, `${amp + 3}`, `${min}`
  ])
  return {
    type: 'statistics',
    question: `Veja os dados coletados: ${vals.join(', ')}.\nQual é a AMPLITUDE desses dados?`,
    options, correct: ci,
    explanation: `Amplitude = maior valor − menor valor = ${max} − ${min} = ${amp}. A amplitude mostra o quanto os dados variam.`
  }
}

function totalDaPesquisa() {
  const temas = [
    ['Futebol', 'Vôlei', 'Basquete', 'Natação'],
    ['Quebra-cabeça', 'Boneca', 'Carrinho', 'Bola'],
    ['Cachorro', 'Gato', 'Coelho', 'Peixe'],
  ]
  const cats = pick(temas).slice(0, pick([3, 4]))
  const valores = cats.map(() => randInt(3, 15))
  const total = valores.reduce((a, b) => a + b, 0)
  const correct = `${total} alunos`
  const { options, correct: ci } = buildOptions(correct, [
    `${total + 5} alunos`, `${Math.max(...valores)} alunos`, `${total - 3} alunos`
  ])
  const tabela = cats.map((c, i) => `${c}: ${valores[i]}`).join(' | ')
  return {
    type: 'statistics',
    question: `Pesquisa na turma:\n${tabela}\nQuantos alunos participaram da pesquisa ao total?`,
    options, correct: ci,
    explanation: `Total = ${valores.join(' + ')} = ${total} alunos.`
  }
}

function amplitudeSimples() {
  const max = randInt(15, 50)
  const min = randInt(2, max - 5)
  const amp = max - min
  const contextos = [
    `Em uma semana, o maior número de visitantes foi ${max} e o menor foi ${min}.`,
    `Em uma pesquisa, o maior valor foi ${max} e o menor foi ${min}.`,
    `Em um campeonato, a maior pontuação foi ${max} e a menor foi ${min}.`,
  ]
  const correct = `${amp}`
  const { options, correct: ci } = buildOptions(correct, [
    `${max}`, `${amp + 4}`, `${min}`
  ])
  return {
    type: 'statistics',
    question: `${pick(contextos)}\nQual é a amplitude dos dados?`,
    options, correct: ci,
    explanation: `Amplitude = maior − menor = ${max} − ${min} = ${amp}.`
  }
}

function diferencaTabela() {
  const temas = [
    { categorias: ['Cachorro', 'Gato', 'Coelho', 'Peixe'], contexto: 'animal preferido' },
    { categorias: ['Futebol', 'Vôlei', 'Basquete', 'Natação'], contexto: 'esporte favorito' },
    { categorias: ['Chocolate', 'Morango', 'Baunilha', 'Limão'], contexto: 'sabor de sorvete' },
  ]
  const tema = pick(temas)
  const [catA, catB] = shuffle(tema.categorias).slice(0, 2)
  const valA = randInt(8, 20)
  const valB = randInt(2, valA - 2)
  const diff = valA - valB
  const correct = `${diff} alunos`
  const { options, correct: ci } = buildOptions(correct, [
    `${diff + 3} alunos`, `${valA} alunos`, `${valB} alunos`
  ])
  return {
    type: 'statistics',
    question: `Pesquisa de ${tema.contexto}:\n${catA}: ${valA} votos | ${catB}: ${valB} votos\nQuantos alunos a mais votaram em ${catA} do que em ${catB}?`,
    options, correct: ci,
    explanation: `Diferença = ${catA} − ${catB} = ${valA} − ${valB} = ${diff} alunos.`
  }
}

function somaCategoriasTabela() {
  const temas = [
    { cats: ['Banana', 'Maçã', 'Morango', 'Uva'], ctx: 'fruta preferida' },
    { cats: ['Gato', 'Cachorro', 'Coelho', 'Peixe'], ctx: 'animal favorito' },
    { cats: ['Futebol', 'Vôlei', 'Basquete', 'Natação'], ctx: 'esporte favorito' },
  ]
  const tema = pick(temas)
  const [catA, catB, catC] = shuffle(tema.cats)
  const valA = randInt(4, 15), valB = randInt(4, 15), valC = randInt(4, 15)
  const total = valA + valB
  const correct = `${total} alunos`
  const { options, correct: ci } = buildOptions(correct, [
    `${total + valC} alunos`, `${valA} alunos`, `${total + 3} alunos`
  ])
  return {
    type: 'statistics',
    question: `Tabela de ${tema.ctx}:\n${catA}: ${valA} | ${catB}: ${valB} | ${catC}: ${valC}\nQuantos alunos escolheram ${catA} OU ${catB}?`,
    options, correct: ci,
    explanation: `${catA} + ${catB} = ${valA} + ${valB} = ${total} alunos. Para juntar duas categorias, some os valores.`
  }
}

function valorNaTabela() {
  const temas = [
    { categorias: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'], contexto: 'alunos presentes por dia' },
    { categorias: ['Ana', 'Bruno', 'Carlos', 'Diana'], contexto: 'pontos no jogo' },
    { categorias: ['Manhã', 'Tarde', 'Noite'], contexto: 'alunos por turno' },
  ]
  const tema = pick(temas)
  const n = Math.min(tema.categorias.length, pick([3, 4]))
  const cats = tema.categorias.slice(0, n)
  const valores = cats.map(() => randInt(5, 30))
  const idx = randInt(0, cats.length - 1)
  const correct = `${valores[idx]}`
  const outros = valores.filter((_, i) => i !== idx).map(v => `${v}`)
  const { options, correct: ci } = buildOptions(correct, outros)
  const tabela = cats.map((c, i) => `${c}: ${valores[i]}`).join(' | ')
  return {
    type: 'statistics',
    question: `Tabela de ${tema.contexto}:\n${tabela}\nQual é o valor registrado para "${cats[idx]}"?`,
    options, correct: ci,
    explanation: `Na tabela, ${cats[idx]} tem o valor ${valores[idx]}.`
  }
}

// ═══════════════════════════════════════════
// MÉDIO (fases 3-4) — Gráficos e pesquisa
// ═══════════════════════════════════════════

function lerGraficoBarras() {
  const conjuntos = [
    { itens: ['Quebra-cabeça', 'Boneca', 'Carrinho', 'Bola'], contexto: 'brinquedos mais vendidos' },
    { itens: ['João', 'Pedro', 'Pablo', 'Miguel'], contexto: 'pontuação do jogo' },
    { itens: ['Campo das Cerejeiras', 'Horizonte', 'Campestre', 'Lagoinha'], contexto: 'alunos por bairro' },
  ]
  const conj = pick(conjuntos)
  const n = pick([3, 4])
  const itens = conj.itens.slice(0, n)
  const valores = itens.map(() => randInt(2, 10) * 10)
  const idx = randInt(0, itens.length - 1)
  const correct = `${valores[idx]}`
  const outros = valores.filter((_, i) => i !== idx).map(v => `${v}`)
  const { options, correct: ci } = buildOptions(correct, outros)
  const dados = itens.map((it, i) => `${it}: ${valores[i]}`).join(' | ')
  return {
    type: 'statistics',
    question: `Gráfico de barras — ${conj.contexto}:\n${dados}\nQual é o valor da categoria "${itens[idx]}"?`,
    options, correct: ci,
    explanation: `No gráfico, a barra de "${itens[idx]}" chega até ${valores[idx]}.`
  }
}

function amplitudeGrafico() {
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho']
  const n = randInt(4, 6)
  const sel = meses.slice(0, n)
  const valores = sel.map(() => randInt(3, 15) * 10)
  const max = Math.max(...valores)
  const min = Math.min(...valores)
  const amp = max - min
  const correct = `${amp}`
  const { options, correct: ci } = buildOptions(correct, [
    `${amp + 10}`, `${max}`, `${amp - 10 > 0 ? amp - 10 : amp + 20}`
  ])
  const dados = sel.map((m, i) => `${m}: ${valores[i]}`).join(' | ')
  return {
    type: 'statistics',
    question: `Gráfico de vendas mensais:\n${dados}\nQual é a amplitude dos dados?`,
    options, correct: ci,
    explanation: `Amplitude = maior − menor = ${max} − ${min} = ${amp}.`
  }
}

function censitariaOuAmostral() {
  const casos = [
    { situacao: 'Uma professora perguntou a opinião de TODOS os alunos da sua turma sobre a excursão.', correto: 'Censitária', wrong: ['Amostral', 'Parcial', 'Incompleta'], expl: 'Censitária: pesquisou TODOS os elementos da população (a turma inteira).' },
    { situacao: 'Um pesquisador entrevistou apenas algumas pessoas para saber a opinião da cidade sobre um novo produto.', correto: 'Amostral', wrong: ['Censitária', 'Total', 'Completa'], expl: 'Amostral: pesquisou apenas uma AMOSTRA (parte) da população.' },
    { situacao: 'O veterinário examinou todos os cachorros de um canil para saber se tinham pulgas.', correto: 'Censitária', wrong: ['Amostral', 'Parcial', 'Incompleta'], expl: 'Censitária: examinou TODOS os cachorros do canil.' },
    { situacao: 'Uma pesquisa de intenção de voto entrevistou 2.000 eleitores de um total de 1 milhão de votantes.', correto: 'Amostral', wrong: ['Censitária', 'Total', 'Completa'], expl: 'Amostral: só 2.000 de 1 milhão participaram — uma amostra da população.' },
    { situacao: 'A diretora perguntou a todos os estudantes da escola qual seria a melhor data para a festa junina.', correto: 'Censitária', wrong: ['Amostral', 'Parcial', 'Incompleta'], expl: 'Censitária: todos os estudantes (a população inteira) participaram.' },
  ]
  const c = pick(casos)
  const { options, correct: ci } = buildOptions(c.correto, c.wrong)
  return {
    type: 'statistics',
    question: `${c.situacao}\nEssa pesquisa é censitária ou amostral?`,
    options, correct: ci,
    explanation: c.expl
  }
}

function diferencaBarras() {
  const contextos = [
    { itens: ['Manga', 'Laranja', 'Maçã'], ctx: 'frutas vendidas' },
    { itens: ['Turma A', 'Turma B', 'Turma C'], ctx: 'acertos por turma' },
    { itens: ['Março', 'Abril', 'Maio'], ctx: 'livros emprestados' },
  ]
  const c = pick(contextos)
  const [a, b] = c.itens.slice(0, 2)
  const valA = randInt(3, 10) * 10
  const valB = randInt(1, valA / 10 - 1) * 10
  const diff = valA - valB
  const correct = `${diff}`
  const { options, correct: ci } = buildOptions(correct, [
    `${diff + 10}`, `${valA}`, `${diff - 10 > 0 ? diff - 10 : diff + 20}`
  ])
  return {
    type: 'statistics',
    question: `Gráfico de ${c.ctx}:\n${a}: ${valA} | ${b}: ${valB}\nQual é a diferença entre ${a} e ${b}?`,
    options, correct: ci,
    explanation: `${a} − ${b} = ${valA} − ${valB} = ${diff}.`
  }
}

function totalGrafico() {
  const temas = [
    { itens: ['Segunda', 'Terça', 'Quarta', 'Quinta'], ctx: 'alunos por dia' },
    { itens: ['Ana', 'Bruno', 'Carla', 'Diego'], ctx: 'pontos no torneio' },
  ]
  const tema = pick(temas)
  const n = pick([3, 4])
  const itens = tema.itens.slice(0, n)
  const valores = itens.map(() => randInt(2, 9) * 10)
  const total = valores.reduce((a, b) => a + b, 0)
  const correct = `${total}`
  const { options, correct: ci } = buildOptions(correct, [
    `${total + 10}`, `${Math.max(...valores)}`, `${total - 20 > 0 ? total - 20 : total + 30}`
  ])
  const dados = itens.map((it, i) => `${it}: ${valores[i]}`).join(' | ')
  return {
    type: 'statistics',
    question: `Gráfico de ${tema.ctx}:\n${dados}\nQual é o TOTAL somando todos os valores?`,
    options, correct: ci,
    explanation: `Total = ${valores.join(' + ')} = ${total}.`
  }
}

function afirmacaoVerdadeira() {
  const times = shuffle(['Futebol', 'Vôlei', 'Basquete', 'Natação']).slice(0, 3)
  const valores = times.map(() => randInt(5, 25))
  const max = Math.max(...valores)
  const min = Math.min(...valores)
  const timeMax = times[valores.indexOf(max)]
  const timeMin = times[valores.indexOf(min)]
  const amp = max - min
  const verdadeira = `${timeMax} teve mais votos que ${timeMin}`
  const { options, correct: ci } = buildOptions(verdadeira, [
    `${timeMin} teve mais votos que ${timeMax}`,
    `A amplitude é ${amp + 5}`,
    `Todos tiveram o mesmo número de votos`,
  ])
  const tabela = times.map((t, i) => `${t}: ${valores[i]}`).join(' | ')
  return {
    type: 'statistics',
    question: `Tabela de esporte favorito:\n${tabela}\nQual afirmação é VERDADEIRA?`,
    options, correct: ci,
    explanation: `${timeMax} teve ${max} votos e ${timeMin} teve ${min} votos. A amplitude é ${max} − ${min} = ${amp}.`
  }
}

// ═══════════════════════════════════════════
// DIFÍCIL (fase 5) — Probabilidade
// ═══════════════════════════════════════════

function probabilidadeBolinhas() {
  const paleta = [
    { cor: 'vermelha', plural: 'vermelhas' },
    { cor: 'azul', plural: 'azuis' },
    { cor: 'verde', plural: 'verdes' },
    { cor: 'amarela', plural: 'amarelas' },
    { cor: 'preta', plural: 'pretas' },
  ]
  const sel = shuffle(paleta).slice(0, randInt(3, 4))
  const qtds = sel.map(() => randInt(1, 5))
  const total = qtds.reduce((a, b) => a + b, 0)
  const idx = randInt(0, sel.length - 1)
  const { cor, plural } = sel[idx]
  const fav = qtds[idx]
  const correct = `${fav}/${total}`
  const { options, correct: ci } = buildOptions(correct, [
    `${total - fav}/${total}`,
    `${fav}/${total + 1}`,
    `${fav + 1}/${total}`
  ])
  const desc = sel.map((c, i) => `${qtds[i]} ${qtds[i] > 1 ? c.plural : c.cor}`).join(', ')
  return {
    type: 'statistics',
    question: `Em uma sacola há ${desc} (${total} bolinhas ao total). Qual é a probabilidade de sortear uma bolinha ${cor}?`,
    options, correct: ci,
    explanation: `Probabilidade = casos favoráveis ÷ total de possibilidades = ${fav}/${total}. Há ${fav} bolin${fav > 1 ? 'has' : 'ha'} ${cor} em ${total}.`
  }
}

function probabilidadeDado() {
  const casos = [
    { perg: 'sair um número PAR', fav: 3, expl: 'Pares em um dado: 2, 4, 6 → 3 casos favoráveis em 6.' },
    { perg: 'sair um número ÍMPAR', fav: 3, expl: 'Ímpares em um dado: 1, 3, 5 → 3 casos favoráveis em 6.' },
    { perg: 'sair o número 1', fav: 1, expl: 'Só existe um lado com o número 1 → 1 caso favorável em 6.' },
    { perg: 'sair um número MAIOR que 4', fav: 2, expl: 'Maiores que 4: 5 e 6 → 2 casos favoráveis em 6.' },
    { perg: 'sair um número MENOR que 3', fav: 2, expl: 'Menores que 3: 1 e 2 → 2 casos favoráveis em 6.' },
    { perg: 'sair o número 6', fav: 1, expl: 'Só existe um lado com o número 6 → 1 caso favorável em 6.' },
  ]
  const c = pick(casos)
  const correct = `${c.fav}/6`
  const { options, correct: ci } = buildOptions(correct, [
    `${6 - c.fav}/6`,
    `${c.fav}/12`,
    `1/${c.fav > 1 ? c.fav : 3}`
  ])
  return {
    type: 'statistics',
    question: `Ao lançar um dado comum (faces numeradas de 1 a 6), qual é a probabilidade de ${c.perg}?`,
    options, correct: ci,
    explanation: `${c.expl} Probabilidade = ${c.fav}/6.`
  }
}

function combinacoesMoedas() {
  const { options, correct: ci } = buildOptions('4 combinações (CC, CX, XC, XX)', [
    '2 combinações', '3 combinações', '6 combinações'
  ])
  return {
    type: 'statistics',
    question: `Ao lançar 2 moedas ao mesmo tempo (cada uma pode cair Cara — C ou Coroa — X), quantas combinações de resultados são possíveis?`,
    options, correct: ci,
    explanation: `Combinações: Cara-Cara (CC), Cara-Coroa (CX), Coroa-Cara (XC), Coroa-Coroa (XX) → 4 combinações possíveis.`
  }
}

function probabilidadeRoleta() {
  const partes = pick([4, 6, 8])
  const cores = ['azul', 'amarela', 'vermelha', 'verde']
  const corFav = pick(cores)
  const qtdFav = pick([1, 2])
  const correct = `${qtdFav}/${partes}`
  const { options, correct: ci } = buildOptions(correct, [
    `${partes - qtdFav}/${partes}`,
    `${qtdFav}/${partes + 2}`,
    `1/${partes}`
  ])
  return {
    type: 'statistics',
    question: `Uma roleta está dividida em ${partes} partes iguais, e ${qtdFav} ${qtdFav > 1 ? 'delas são' : 'delas é'} da cor ${corFav}. Qual é a probabilidade de a roleta parar na cor ${corFav}?`,
    options, correct: ci,
    explanation: `Probabilidade = partes ${corFav}${qtdFav > 1 ? 's' : ''} ÷ total de partes = ${qtdFav}/${partes}.`
  }
}

function probabilidadeComplementar() {
  const total = pick([4, 5, 6, 8, 10])
  const fav = randInt(1, total - 1)
  const naoFav = total - fav
  const cor = pick(['azul', 'vermelha', 'verde', 'amarela'])
  const correct = `${naoFav}/${total}`
  const { options, correct: ci } = buildOptions(correct, [
    `${fav}/${total}`, `${naoFav}/${total + 1}`, `${fav + 1}/${total}`
  ])
  return {
    type: 'statistics',
    question: `Em uma sacola com ${total} bolinhas, ${fav} ${fav > 1 ? 'são' : 'é'} da cor ${cor}. Qual é a probabilidade de sortear uma bolinha que NÃO seja ${cor}?`,
    options, correct: ci,
    explanation: `Bolinhas que NÃO são ${cor}: ${total} − ${fav} = ${naoFav}. Probabilidade = ${naoFav}/${total}.`
  }
}

function probabilidadeMoeda() {
  const casos = [
    { perg: 'cair CARA', correct: '1/2', expl: 'Moeda tem 2 faces: Cara e Coroa. Probabilidade de Cara = 1/2.' },
    { perg: 'cair COROA', correct: '1/2', expl: 'Moeda tem 2 faces: Cara e Coroa. Probabilidade de Coroa = 1/2.' },
  ]
  const c = pick(casos)
  const { options, correct: ci } = buildOptions(c.correct, ['1/4', '2/3', '1/3'])
  return {
    type: 'statistics',
    question: `Ao lançar uma moeda, qual é a probabilidade de ${c.perg}?`,
    options, correct: ci,
    explanation: c.expl
  }
}

function eventoImpossivel() {
  const casos = [
    {
      perg: 'Um dado tem faces numeradas de 1 a 6. Qual resultado é IMPOSSÍVEL de acontecer?',
      correct: 'Tirar o número 7',
      wrong: ['Tirar o número 6', 'Tirar um número par', 'Tirar o número 1'],
      expl: 'O dado só tem faces de 1 a 6. Tirar 7 é impossível — probabilidade = 0.'
    },
    {
      perg: 'Uma sacola tem apenas bolinhas vermelhas e azuis. Qual resultado é IMPOSSÍVEL?',
      correct: 'Sortear uma bolinha verde',
      wrong: ['Sortear uma bolinha azul', 'Sortear uma bolinha vermelha', 'Sortear qualquer bolinha'],
      expl: 'Não há bolinhas verdes. Sortear verde é impossível — probabilidade = 0.'
    },
    {
      perg: 'Uma moeda tem cara e coroa. Qual resultado é IMPOSSÍVEL?',
      correct: 'A moeda não cair em nenhuma face',
      wrong: ['Cair cara', 'Cair coroa', 'Cair cara ou coroa'],
      expl: 'Uma moeda sempre cai em cara ou coroa — a probabilidade de nenhuma face é 0.'
    }
  ]
  const c = pick(casos)
  const { options, correct: ci } = buildOptions(c.correct, c.wrong)
  return {
    type: 'statistics',
    question: c.perg,
    options, correct: ci,
    explanation: c.expl
  }
}

// ═══════════════════════════════════════════
// CHEFE (não usado — estatística só vai até fase 5)
// ═══════════════════════════════════════════

function bossEstatistica() {
  const times = shuffle(['Futebol', 'Vôlei', 'Basquete', 'Handebol', 'Outros']).slice(0, 4)
  const valores = times.map(() => randInt(4, 15))
  const max = Math.max(...valores)
  const min = Math.min(...valores)
  const amp = max - min
  const timeMax = times[valores.indexOf(max)]
  const total = valores.reduce((a, b) => a + b, 0)

  const correct = `${amp}`
  const { options, correct: ci } = buildOptions(correct, [
    `${max}`, `${amp + 4}`, `${min}`
  ])
  const tabela = times.map((t, i) => `${t}: ${valores[i]}`).join(' | ')
  return {
    type: 'statistics',
    question: `Pesquisa de esporte favorito (${total} alunos no total):\n${tabela}\nQual é a AMPLITUDE dos dados?`,
    options, correct: ci,
    explanation: `Amplitude = maior − menor = ${max} (${timeMax}) − ${min} = ${amp}. A amplitude mostra a diferença entre o maior e o menor dado.`,
    isBoss: true
  }
}

function bossProbabilidade() {
  const total = pick([6, 8, 10, 12])
  const fav = pick([1, 2, 3])
  const correto = `${fav}/${total}`
  const contextos = [
    `Em uma caixa há ${total} papéis com nomes. ${fav} ${fav > 1 ? 'têm' : 'tem'} o nome "Ana". Qual é a probabilidade de sortear o nome "Ana"?`,
    `Uma sacola tem ${total} bolinhas. ${fav} ${fav > 1 ? 'são' : 'é'} azul. Qual é a probabilidade de sortear uma bolinha azul?`,
  ]
  const { options, correct: ci } = buildOptions(correto, [
    `${total - fav}/${total}`,
    `${fav}/${total + 2}`,
    `1/${total}`
  ])
  return {
    type: 'statistics',
    question: pick(contextos),
    options, correct: ci,
    explanation: `Probabilidade = casos favoráveis ÷ total = ${fav}/${total}.`,
    isBoss: true
  }
}

export function generateStatisticsQuestion(phase) {
  // Fases 1-2: fácil | 3-4: médio | 5: difícil
  const difficulty = phase <= 2 ? 'easy' : phase <= 4 ? 'medium' : 'hard'

  const easyTypes   = [lerTabelaMaiorMenor, amplitudeDados, totalDaPesquisa, amplitudeSimples, diferencaTabela, somaCategoriasTabela, valorNaTabela]
  const mediumTypes = [lerGraficoBarras, amplitudeGrafico, censitariaOuAmostral, diferencaBarras, totalGrafico, afirmacaoVerdadeira]
  const hardTypes   = [probabilidadeBolinhas, probabilidadeDado, combinacoesMoedas, probabilidadeRoleta, probabilidadeComplementar, probabilidadeMoeda, eventoImpossivel]

  const typeMap = { easy: easyTypes, medium: mediumTypes, hard: hardTypes }
  const generators = typeMap[difficulty]
  const gen = generators[Math.floor(Math.random() * generators.length)]

  try {
    return gen()
  } catch {
    return lerTabelaMaiorMenor()
  }
}
