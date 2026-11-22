export const TEACHERS = {
  lucianis: {
    id: 'lucianis',
    name: 'Mestra Lucianis',
    heroId: 'mitos',
    image: '/assets/lucianis.png',
    welcome: [
      'Olá, campeão da Turma 11.501! Sou a Mestra Lucianis. Com a velocidade do raio e a força da matemática, vamos derrotar o Surto!',
      'Bem-vindo, guardião elétrico! Eu, Lucianis, treinei o Mitos para usar os números como superpoderes. Prontos para brilhar?',
      'A Turma 11.501 não tem medo de desafios! Com o Mitos ao seu lado, vamos mostrar que a matemática é nosso raio mais poderoso!'
    ]
  },
  ludmilis: {
    id: 'ludmilis',
    name: 'Mestra Ludmilis',
    heroId: 'pampee',
    image: '/assets/ludmilis.png',
    welcome: [
      'Olá, detetive da Turma 11.502! Sou a Mestra Ludmilis. A Pampee me ensinou que todo enigma tem solução — basta usar a matemática certa!',
      'Bem-vinda à investigação, guardião! Eu, Ludmilis, treinei a Pampee para decifrar qualquer labirinto com lógica e frações. Vamos nessa?',
      'A Turma 11.502 é especialista em enigmas! Com a Pampee, nenhum mistério do Impasse ficará sem resposta. Minha lupa está pronta!'
    ]
  },
  gabrielis: {
    id: 'gabrielis',
    name: 'Mestra Gabrielis',
    heroId: 'galdios',
    image: '/assets/gabrielis.png',
    welcome: [
      'Saudações, guerreiro da Turma 11.503! Sou a Mestra Gabrielis. O Galdios aprendeu comigo que a matemática é a armadura mais forte que existe!',
      'A Fortaleza da Turma 11.503 nunca cai! Eu, Gabrielis, preparei o Galdios para enfrentar o Fragmento com cálculos precisos e estratégia!',
      'Cada problema resolvido é um tijolo na nossa fortaleza! Com o Galdios e a matemática, nada nos derruba. Avante, guardião!'
    ]
  },
  claudianis: {
    id: 'claudianis',
    name: 'Mestra Claudianis',
    heroId: 'nia',
    image: '/assets/claudianis.png',
    welcome: [
      'Olá, jovem guardião da Turma 11.504! Sou a Mestre Claudianis. Eu e a Nia vamos restaurar o Céu Estelar com o poder dos números!',
      'Bem-vindo, guardião das estrelas! Fui eu quem ensinou a Nia que a matemática ilumina até o cosmos mais escuro. Vamos brilhar?',
      'Ah, um novo guardião chegou! A Turma 11.504 tem o céu como limite. Com a Nia, vamos apagar o Eclipse e restaurar cada constelação!'
    ]
  }
}

export const TEACHER_TIPS = {
  fraction: {
    firstTime: 'Frações representam partes de um todo! O número de baixo (denominador) diz em quantas partes iguais o todo foi dividido. O número de cima (numerador) diz quantas partes você tem. Exemplo: 3/4 = 3 partes de um todo dividido em 4!',
    hints: [
      'Lembre: o denominador (número de baixo) diz o total de partes iguais.',
      'Para comparar frações com mesmo denominador, o maior numerador vence!',
      'Para somar frações com mesmo denominador, some só os numeradores.',
      'Para frações com denominadores diferentes, encontre o mínimo múltiplo comum!',
      'Para calcular a fração de um número, multiplique e divida. Ex: 3/4 de 20 = (20÷4)×3 = 15.',
      'Número misto: parte inteira + fração. Para converter, multiplique o inteiro pelo denominador e some o numerador.',
      'Para simplificar, divida numerador e denominador pelo maior número que divide os dois.'
    ]
  },
  problem: {
    firstTime: 'Leia o problema com calma! Primeiro entenda o que está sendo pedido, depois identifique os números importantes. Pense: o que tenho? O que preciso encontrar? Que operação preciso usar?',
    hints: [
      'Sublinhe os números importantes e o que está sendo pedido.',
      'Palavras como "total", "juntos", "ao todo" geralmente indicam adição.',
      'Palavras como "sobrou", "restou", "a mais" geralmente indicam subtração.',
      'Quando tem "cada", "por", "em partes iguais", pense em multiplicação ou divisão.',
      'Em problemas de dois passos, resolva um passo de cada vez.',
      'Confira se sua resposta faz sentido com a situação do problema.',
      'Em problemas de dinheiro, lembre: troco = valor pago - valor da compra.'
    ]
  },
  logic: {
    firstTime: 'Em sequências numéricas, procure o padrão! Veja a diferença entre os números consecutivos — pode ser uma soma, subtração ou multiplicação constante. Tente: segundo número menos o primeiro = diferença!',
    hints: [
      'Na sequência, calcule a diferença entre números vizinhos. Se for igual, é adição!',
      'Se cada número é o dobro (ou triplo) do anterior, é uma sequência de multiplicação.',
      'Em "qual não pertence", procure a regra que une a maioria. O estranho quebra essa regra.',
      'Números pares sempre terminam em 0, 2, 4, 6 ou 8. Ímpares terminam em 1, 3, 5, 7 ou 9.',
      'Em deduções com pistas, organize as informações em ordem (maior→menor, ou vice-versa).',
      'Leia todas as pistas antes de responder. Às vezes a última pista é a chave!',
      'Em problemas de "quem é o mais alto/pesado", desenhe uma linha e posicione cada pessoa.'
    ]
  },

  // ── Capítulo 11 — Medidas de Superfície e Volume ──────────────────
  geometry: {
    firstTime: '📐 Capítulo 11 do livro: Medidas de Superfície e Volume! Aprendemos que ÁREA mede o espaço de uma superfície (em cm² ou m²) e VOLUME mede o espaço dentro de um sólido (em cm³). Fórmulas principais: Área do retângulo = comprimento × largura | Área do quadrado = lado × lado | Volume = comprimento × largura × altura.',
    hints: [
      '📖 Livro Cap. 11 — Área do retângulo = comprimento × largura. Ex: 5 cm × 3 cm = 15 cm².',
      '📖 Livro Cap. 11 — Área do quadrado = lado × lado. Lembre: todos os lados são iguais!',
      '📖 Livro Cap. 11 — Perímetro = soma de todos os lados. Retângulo: P = 2 × (comprimento + largura).',
      '📖 Livro Cap. 11 — 1 metro quadrado (m²) é a área de um quadrado de 1 m de lado. Área de quarto e sala se mede em m².',
      '📖 Livro Cap. 11 — Azulejos e lajotas: calcule a área = comprimento × largura. O resultado é a quantidade de peças necessárias.',
      '📖 Livro Cap. 11 — Volume do paralelepípedo (caixa) = comprimento × largura × altura. Resultado em cm³.',
      '📖 Livro Cap. 11 — Volume do cubo = aresta × aresta × aresta. Todos os 6 lados são iguais!',
      '📖 Livro Cap. 11 — Cubinhos empilhados: o total é comprimento × largura × altura (cada cubinho tem 1 cm³).',
      '📖 Livro Cap. 11 — Área do triângulo = (base × altura) ÷ 2. Não esqueça de dividir por 2 no final!'
    ]
  },

  // ── Capítulo 10 — Probabilidade e Estatística ─────────────────────
  statistics: {
    firstTime: '📊 Capítulo 10 do livro: Probabilidade e Estatística! Aprendemos a coletar dados, ler tabelas e gráficos de barras, calcular amplitude e entender probabilidade. Palavras-chave: Amplitude = maior valor − menor valor | Probabilidade = casos favoráveis ÷ total de casos possíveis.',
    hints: [
      '📖 Livro Cap. 10 — Em tabelas, leia o título e os cabeçalhos antes de responder. Encontre o dado pedido na linha ou coluna certa.',
      '📖 Livro Cap. 10 — Amplitude = maior valor − menor valor do conjunto de dados.',
      '📖 Livro Cap. 10 — Gráfico de barras: a altura da barra mostra o valor. Compare as barras para responder.',
      '📖 Livro Cap. 10 — Pesquisa censitária entrevista TODOS. Pesquisa amostral entrevista apenas uma parte do grupo.',
      '📖 Livro Cap. 10 — Total da pesquisa = some todos os valores da tabela ou de todas as barras do gráfico.',
      '📖 Livro Cap. 10 — Probabilidade = número de casos favoráveis ÷ total de casos possíveis. Resultado é uma fração!',
      '📖 Livro Cap. 10 — Dado tem 6 faces (1 a 6). Probabilidade de qualquer número = 1/6.',
      '📖 Livro Cap. 10 — Moeda tem 2 faces: cara (C) e coroa (X). Probabilidade de cara = 1/2.',
      '📖 Livro Cap. 10 — Roleta: veja quantas partes iguais tem. Prob. de cada cor = partes dessa cor ÷ total de partes.',
      '📖 Livro Cap. 10 — Bolinhas numa urna: probabilidade = bolinhas da cor pedida ÷ total de bolinhas.'
    ]
  }
}
