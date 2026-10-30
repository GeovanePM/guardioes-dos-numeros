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
  }
}
