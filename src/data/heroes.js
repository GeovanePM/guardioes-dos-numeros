export const HEROES = {
  mitos: {
    id: 'mitos',
    name: 'Mitos',
    className: '11.501',
    color: '#00BFFF',
    colorDark: '#0066CC',
    colorLight: '#B0E8FF',
    colorGlow: 'rgba(0,191,255,0.4)',
    theme: 'Vale Elétrico',
    themeIcon: '⚡',
    villain: 'surto',
    bgClass: 'bg-mitos',
    phrases: {
      correct: [
        'Isso aí! Raio certeiro! ⚡',
        'Veloz e preciso! Incrível!',
        'O Vale Elétrico agradece! ⚡',
        'Energia total! Mandou bem!',
        'Bzzzt! Acertou em cheio!',
        'Corrente contínua de acertos!',
        'Velocidade máxima! Sim!',
        'Tá na veia! Eletrizante!'
      ],
      wrong: [
        'Curto-circuito... mas não desisto!',
        'Chiiii... vamos tentar de novo!',
        'Até o raio erra às vezes...',
        'Recarregando a energia!',
        'Falha no sistema... corrigindo!',
        'Descarga baixa... mas voltarei mais forte!'
      ],
      beforePhase: [
        'Vamos com tudo! ⚡',
        'A velocidade do raio é minha!',
        'Prontos para o Vale Elétrico?',
        'Energia máxima ativada! Bora!'
      ]
    }
  },
  pampee: {
    id: 'pampee',
    name: 'Pampee',
    className: '11.502',
    color: '#FFD700',
    colorDark: '#CC8800',
    colorLight: '#FFF9C4',
    colorGlow: 'rgba(255,215,0,0.4)',
    theme: 'Selva dos Enigmas',
    themeIcon: '🔍',
    villain: 'impasse',
    bgClass: 'bg-pampee',
    phrases: {
      correct: [
        'Caso resolvido! 🔍',
        'A detetive não falha!',
        'Pista certa, resposta certa!',
        'Elementar, meu caro vilão!',
        'Enigma decifrado! Brilhante!',
        'Minha lupa nunca mente! ✨',
        'Análise concluída com sucesso!',
        'Selva dos Enigmas, desvendada!'
      ],
      wrong: [
        'Pista falsa... vou investigar melhor!',
        'Hm, preciso revisar as evidências...',
        'Até a melhor detetive erra uma pista!',
        'De volta ao início da investigação!',
        'Nova abordagem necessária!',
        'O Impasse não vai me parar! 🔍'
      ],
      beforePhase: [
        'A aventura começa! 🔍',
        'Minha lupa está pronta!',
        'Vamos resolver este enigma!',
        'Detetive Pampee em ação!'
      ]
    }
  },
  galdios: {
    id: 'galdios',
    name: 'Galdios',
    className: '11.503',
    color: '#FF4444',
    colorDark: '#AA0000',
    colorLight: '#FFD700',
    colorGlow: 'rgba(255,68,68,0.4)',
    theme: 'Fortaleza Blindada',
    themeIcon: '🛡️',
    villain: 'fragmento',
    bgClass: 'bg-galdios',
    phrases: {
      correct: [
        'A fortaleza resiste! 🛡️',
        'Blindagem total! Perfeito!',
        'Nenhum fragmento pode me parar!',
        'Armadura inabalável! Sim!',
        'A proteção é completa! ✨',
        'Escudo da matemática levantado!',
        'Impenetrável! Mandou demais!',
        'A Fortaleza Blindada permanece!'
      ],
      wrong: [
        'Uma rachadura... mas não cai!',
        'A armadura absorve o golpe!',
        'Fortalezas se fortalecem com os erros!',
        'Reparando a blindagem...',
        'Um guerreiro aprende com cada batalha!',
        'Fragmento não vai me quebrar! 🛡️'
      ],
      beforePhase: [
        'A fortaleza não cai! 🛡️',
        'Armadura, ativar!',
        'Proteção máxima ativada!',
        'Pela Fortaleza Blindada!'
      ]
    }
  },
  nia: {
    id: 'nia',
    name: 'Nia',
    className: '11.504',
    color: '#CC44FF',
    colorDark: '#6600AA',
    colorLight: '#FFB3FF',
    colorGlow: 'rgba(204,68,255,0.4)',
    theme: 'Céu Estelar',
    themeIcon: '⭐',
    villain: 'eclipse',
    bgClass: 'bg-nia',
    phrases: {
      correct: [
        'As estrelas brilham! ⭐',
        'Constelação restaurada! Lindo!',
        'O céu agradece! ✨',
        'Luz cósmica total!',
        'Estrela em ascensão! ⭐',
        'O universo está com a gente!',
        'Brilho estelar máximo! Incrível!',
        'O Céu Estelar está salvo! 💫'
      ],
      wrong: [
        'Uma estrela apagada... mas há mais!',
        'O cosmos me guia de volta! ✨',
        'Até as estrelas piscam às vezes...',
        'Recalibrando a rota cósmica!',
        'Nova constelação, nova chance!',
        'Eclipse não vai apagar minha luz! ⭐'
      ],
      beforePhase: [
        'Pelo Céu Estelar! ⭐',
        'As estrelas me guiam!',
        'Luz e poder cósmico!',
        'A jornada estelar continua! ✨'
      ]
    }
  }
}

export const VILLAINS = {
  surto: {
    id: 'surto',
    name: 'Surto',
    title: 'General do Caos Elétrico',
    description: 'Energia elétrica descontrolada que causa curto-circuito nos números!',
    taunt: 'Seus números são apenas estática para mim! Bzzt!',
    color: '#00FF88',
    colorDark: '#004422',
    heroId: 'mitos'
  },
  impasse: {
    id: 'impasse',
    name: 'Impasse',
    title: 'General dos Labirintos',
    description: 'Embaralha pistas e charadas, criando becos sem saída!',
    taunt: 'Você nunca vai encontrar a saída do meu labirinto!',
    color: '#FF8800',
    colorDark: '#441100',
    heroId: 'pampee'
  },
  fragmento: {
    id: 'fragmento',
    name: 'Fragmento',
    title: 'General da Destruição',
    description: 'Quebra frações e blindagens em pedaços soltos!',
    taunt: 'Vou quebrar tudo em pedaços irreconstruíveis!',
    color: '#FF2200',
    colorDark: '#440000',
    heroId: 'galdios'
  },
  eclipse: {
    id: 'eclipse',
    name: 'Eclipse',
    title: 'General das Trevas',
    description: 'Apaga as constelações e embaralha as sequências lógicas do céu!',
    taunt: 'Sua luz jamais brilhará mais que minha escuridão!',
    color: '#8800CC',
    colorDark: '#220033',
    heroId: 'nia'
  }
}

export const HERO_ORDER = ['mitos', 'pampee', 'galdios', 'nia']
