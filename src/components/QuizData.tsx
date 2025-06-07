export const quizSteps = [
  {
    id: 'age',
    title: 'Qual sua faixa etária?',
    subtitle: 'Diferentes idades requerem abordagens específicas',
    options: [
      { value: '35-44', label: '35-44 anos', emoji: '💪', desc: 'Fase de prevenção ativa' },
      { value: '45-54', label: '45-54 anos', emoji: '🌟', desc: 'Período de manutenção' },
      { value: '55-64', label: '55-64 anos', emoji: '✨', desc: 'Cuidado especializado' },
      { value: '65+', label: '65+ anos', emoji: '👑', desc: 'Abordagem gentil e eficaz' }
    ]
  },
  {
    id: 'painLevel',
    title: 'Qual a intensidade das suas dores?',
    subtitle: 'Avalie de 0 (sem dor) a 10 (dor insuportável)',
    type: 'slider'
  },
  {
    id: 'mainProblem',
    title: 'Onde você sente mais desconforto?',
    subtitle: 'Identifique a região que mais te incomoda no dia a dia',
    options: [
      { value: 'back', label: 'Região das costas', emoji: '🔥', desc: 'Lombar, torácica ou cervical' },
      { value: 'neck', label: 'Pescoço e ombros', emoji: '💢', desc: 'Tensão e rigidez' },
      { value: 'joints', label: 'Articulações', emoji: '⚡', desc: 'Joelhos, quadris, punhos' },
      { value: 'mobility', label: 'Mobilidade geral', emoji: '🚫', desc: 'Dificuldade de movimento' }
    ]
  },
  {
    id: 'duration',
    title: 'Há quanto tempo sente essas dores?',
    subtitle: 'O tempo influencia diretamente no método de tratamento',
    options: [
      { value: 'recent', label: 'Menos de 3 meses', emoji: '🆕', desc: 'Dor aguda - resposta rápida' },
      { value: 'moderate', label: '3 meses a 1 ano', emoji: '⏳', desc: 'Dor subaguda - tratamento focado' },
      { value: 'chronic', label: '1 a 3 anos', emoji: '📅', desc: 'Dor crônica - abordagem intensiva' },
      { value: 'longtime', label: 'Mais de 3 anos', emoji: '🔄', desc: 'Dor persistente - método especializado' }
    ]
  },
  {
    id: 'previousTreatment',
    title: 'Já tentou algum tratamento antes?',
    subtitle: 'Isso nos ajuda a entender melhor seu caso',
    options: [
      { value: 'none', label: 'Nenhum tratamento', emoji: '🆕', desc: 'Primeira busca por solução' },
      { value: 'some', label: 'Alguns tratamentos', emoji: '💊', desc: 'Tentativas anteriores' },
      { value: 'multiple', label: 'Vários tratamentos', emoji: '🔄', desc: 'Busca por solução definitiva' },
      { value: 'surgery', label: 'Cirurgia', emoji: '🔪', desc: 'Caso mais complexo' }
    ]
  },
  {
    id: 'lifestyle',
    title: 'Como é seu estilo de vida?',
    subtitle: 'Sua rotina influencia diretamente no tratamento',
    options: [
      { value: 'sedentary', label: 'Sedentário', emoji: '💺', desc: 'Muito tempo sentado' },
      { value: 'active', label: 'Ativo', emoji: '🏃', desc: 'Movimento regular' },
      { value: 'standing', label: 'Em pé', emoji: '👣', desc: 'Muito tempo em pé' },
      { value: 'mixed', label: 'Variado', emoji: '🔄', desc: 'Combinação de atividades' }
    ]
  },
  {
    id: 'timeAvailable',
    title: 'Quanto tempo você tem disponível por dia?',
    subtitle: 'Vamos ajustar a intensidade do seu programa',
    options: [
      { value: '10min', label: '10 minutos', emoji: '⚡', desc: 'Rotina express para dias corridos' },
      { value: '15min', label: '15 minutos', emoji: '🎯', desc: 'Tempo ideal para resultados consistentes' },
      { value: '20min', label: '20 minutos', emoji: '💪', desc: 'Dedicação para resultados acelerados' },
      { value: '30min', label: '30+ minutos', emoji: '🔥', desc: 'Máximo comprometimento e transformação' }
    ]
  },
  {
    id: 'investment',
    title: 'Você estaria disposta a investir um valor simbólico para eliminar suas dores definitivamente?',
    subtitle: 'Queremos entender se nossa solução faz sentido para seu momento atual',
    options: [
      { value: 'yes', label: 'Sim, se for algo acessível', emoji: '💚', desc: 'Priorizo minha saúde e bem-estar' },
      { value: 'maybe', label: 'Depende do valor', emoji: '🤔', desc: 'Preciso avaliar custo x benefício' },
      { value: 'budget', label: 'Tenho orçamento limitado', emoji: '💰', desc: 'Busco algo muito em conta' },
      { value: 'unsure', label: 'Preciso pensar melhor', emoji: '⏰', desc: 'Ainda estou decidindo' }
    ]
  }
];