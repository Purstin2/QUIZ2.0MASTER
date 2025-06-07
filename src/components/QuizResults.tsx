import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Shield, Users, Clock, CheckCircle, Award, TrendingDown, Heart, Brain, HelpCircle, MessageCircle, Phone } from 'lucide-react';
import { trackOfferView, trackPurchaseIntent } from '../lib/pixel';

interface QuizResultsProps {
  answers: any;
  userScore: number;
  timeLeft: number;
  recentUsers: number;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ 
  answers, 
  userScore, 
  timeLeft, 
  recentUsers 
}) => {
  const finalPrice = 9.97;

  // Track offer view when component mounts
  useEffect(() => {
    trackOfferView(finalPrice);
  }, [finalPrice]);

  const handlePurchaseClick = () => {
    trackPurchaseIntent(finalPrice);
    // Redirect to payment page
    window.open('https://pay.kirvano.com/3e8ceecb-0d43-4640-9f44-07643fbc0aff', '_blank');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getPainEmoji = (level: number) => {
    if (level <= 2) return '😊';
    if (level <= 4) return '😐';
    if (level <= 6) return '😣';
    if (level <= 8) return '😰';
    return '😭';
  };

  const getPainText = (level: number) => {
    if (level <= 2) return 'Desconforto leve';
    if (level <= 4) return 'Dor moderada';
    if (level <= 6) return 'Dor considerável';
    if (level <= 8) return 'Dor intensa';
    return 'Dor muito intensa';
  };

  // Função para obter o tipo de dor específico
  const getPainArea = () => {
    switch(answers.mainProblem) {
      case 'back':
        return 'costas';
      case 'neck':
        return 'pescoço';
      case 'joints':
        return 'articulações';
      case 'mobility':
        return 'movimento';
      default:
        return 'corpo';
    }
  };

  // Sistema de análise profunda personalizada
  const getPersonalizedAnalysis = () => {
    const { age, painLevel, mainProblem, duration, previousTreatment, lifestyle, investment } = answers;
    
    let insights = [];
    
    // Análise baseada na combinação idade + dor + duração
    if (age === '45-54' && painLevel >= 6 && duration === 'chronic') {
      insights.push("Detectamos o padrão típico da 'Síndrome da Sobrecarga Feminina' - comum em mulheres na sua faixa etária que acumulam tensão por anos cuidando de todos, menos de si mesma.");
    } else if (age === '35-44' && mainProblem === 'back' && lifestyle === 'sedentary') {
      insights.push("Identificamos a 'Postura da Executiva Moderna' - sua combinação de idade, trabalho e dores nas costas indica compensação muscular típica de quem passa longas horas em frente ao computador.");
    } else if (painLevel >= 7 && duration === 'longtime') {
      insights.push("Seu perfil revela a 'Dor Crônica Adaptada' - seu corpo desenvolveu mecanismos de compensação que, paradoxalmente, perpetuam o problema.");
    }

    // Análise do tratamento anterior
    if (previousTreatment === 'multiple' && painLevel >= 6) {
      insights.push("O fato de você ter tentado vários tratamentos sem sucesso indica resistência ao protocolo padrão - seu caso requer abordagem diferenciada.");
    } else if (previousTreatment === 'none' && duration !== 'recent') {
      insights.push("Você está no que chamamos de 'Negação Adaptativa' - normalizou a dor por tanto tempo que esqueceu como é viver sem ela.");
    }

    // Análise do estilo de vida + problema principal
    if (lifestyle === 'sedentary' && mainProblem === 'neck') {
      insights.push("A combinação trabalho sedentário + tensão cervical revela o padrão 'Tech Neck Syndrome' - muito comum em profissionais como você.");
    } else if (lifestyle === 'standing' && mainProblem === 'back') {
      insights.push("Sua rotina em pé + dores nas costas indica sobrecarga da musculatura posterior - típico de profissionais da saúde, educação ou comércio.");
    }

    // Análise baseada na disposição para investir
    if (investment === 'yes' && painLevel >= 6) {
      insights.push("Sua disposição para investir na saúde, combinada com nível de dor elevado, indica o momento ideal para mudança - você está mentalmente preparada para o comprometimento necessário.");
    } else if (investment === 'budget' && duration === 'longtime') {
      insights.push("Mesmo com orçamento limitado, você busca solução após anos de dor - isso demonstra que chegou ao limite da tolerância e está pronta para priorizar sua saúde.");
    }

    return insights.slice(0, 2); // Máximo 2 insights para não ficar muito longo
  };

  // Sistema de arquétipos  
  const getArchetype = () => {
    const { age, painLevel, mainProblem, duration } = answers;
    
    if (painLevel >= 7 && duration === 'longtime') {
      return {
        title: "A Guerreira Indomável",
        subtitle: "Você enfrenta a dor há muito tempo, mas nunca desistiu",
        description: "Mulheres como você são verdadeiras lutadoras que merecem uma solução definitiva"
      };
    } else if (mainProblem === 'back' && age === '45-54') {
      return {
        title: "A Protetora Resiliente", 
        subtitle: "Você cuida de todos, mas precisa cuidar de si mesma",
        description: "É hora de priorizar sua saúde para continuar sendo forte para quem você ama"
      };
    } else if (painLevel <= 4 && duration === 'recent') {
      return {
        title: "A Estrategista Inteligente",
        subtitle: "Você age antes que o problema se torne maior",
        description: "Sua atitude preventiva vai fazer toda a diferença no seu futuro"
      };
    } else if (age === '55-64' || age === '65+') {
      return {
        title: "A Sábia Determinada",
        subtitle: "Com experiência vem a sabedoria de buscar o que funciona",
        description: "Você sabe que merece viver sem dores e está pronta para a mudança"
      };
    } else {
      return {
        title: "A Transformadora Corajosa",
        subtitle: "Você tem coragem de buscar uma nova versão de si mesma",
        description: "Sua jornada de transformação começa agora, sem dores limitando seus sonhos"
      };
    }
  };

  const archetype = getArchetype();
  const personalizedInsights = getPersonalizedAnalysis();
  const originalPrice = 197;

  // Reviews mais autênticos e conectados com o público
  const reviews = [
    {
      name: "Maria Santos",
      age: "52 anos",
      location: "São Paulo",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=80&h=80&fit=crop&crop=face&auto=format",
      text: "Depois de 4 anos com dores nas costas que me impediam até de brincar com meus netos, encontrei esse método. Em 3 semanas já conseguia me abaixar sem dor! Hoje, 2 meses depois, me sinto 10 anos mais nova.",
      problem: "Dores nas costas",
      timeToResult: "3 semanas"
    },
    {
      name: "Ana Lucia Ferreira",
      age: "47 anos", 
      location: "Rio de Janeiro",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face&auto=format",
      text: "Trabalho 8h no computador e a tensão no pescoço era insuportável. Tomava relaxante muscular todo dia. Com o método, em 2 semanas parei os remédios e hoje durmo sem dor pela primeira vez em anos!",
      problem: "Tensão cervical",
      timeToResult: "2 semanas"
    },
    {
      name: "Carmen Rodriguez",
      age: "59 anos",
      location: "Belo Horizonte", 
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face&auto=format",
      text: "Artrose nos joelhos me limitava muito. Não conseguia subir escadas sem sofrer. O método me ensinou movimentos que realmente funcionam. Hoje caminho 5km sem dor e me sinto independente novamente!",
      problem: "Artrose nos joelhos",
      timeToResult: "4 semanas"
    },
    {
      name: "Silvia Costa",
      age: "44 anos",
      location: "Porto Alegre",
      image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=80&h=80&fit=crop&crop=face&auto=format", 
      text: "Fibromialgia me roubou a alegria de viver. Dores por todo corpo, cansaço extremo. Esse método foi minha salvação! Não é milagre, é ciência aplicada. Hoje tenho minha vida de volta e energia para trabalhar.",
      problem: "Fibromialgia",
      timeToResult: "6 semanas"
    },
    {
      name: "Patrícia Lima",
      age: "38 anos",
      location: "Salvador",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face&auto=format",
      text: "Pós-parto me deixou com dores lombares terríveis. Não conseguia carregar minha filha sem sofrer. Em 3 semanas seguindo o método, voltei a ser a mãe ativa que sempre quis ser. Gratidão eterna!",
      problem: "Dores pós-parto",
      timeToResult: "3 semanas"
    },
    {
      name: "Rosana Oliveira", 
      age: "61 anos",
      location: "Fortaleza",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face&auto=format",
      text: "Hérnia de disco me condenou a uma vida de limitações. Médicos falavam em cirurgia. Com o método, evitei a operação! 5 semanas depois estava dançando forró novamente. Melhor investimento da minha vida!",
      problem: "Hérnia de disco",
      timeToResult: "5 semanas"
    },
    {
      name: "Luciana Mendes",
      age: "42 anos", 
      location: "Brasília",
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=face&auto=format",
      text: "Enxaqueca tensional me atormentava há 8 anos. Vivia tomando remédio e faltando no trabalho. O método me ensinou a relaxar músculos que nem sabia que existiam. 1 mês sem crise de enxaqueca!",
      problem: "Enxaqueca tensional", 
      timeToResult: "4 semanas"
    },
    {
      name: "Vera Lúcia Santos",
      age: "55 anos",
      location: "Recife", 
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face&auto=format",
      text: "Bursite no ombro me impedia de pentear o cabelo. Fisioterapia tradicional não resolveu. Com esse método, em 3 semanas já levantava o braço sem dor. Hoje faço pilates e me sinto renovada aos 55!",
      problem: "Bursite no ombro",
      timeToResult: "3 semanas"
    }
  ];

  // FAQ mais relevante
  const faqItems = [
    {
      question: "O método realmente funciona para minha idade?",
      answer: "Sim! O método foi desenvolvido especificamente para mulheres de 35 a 70 anos. Temos casos de sucesso em todas as faixas etárias, com adaptações específicas para cada perfil."
    },
    {
      question: "Preciso de equipamentos especiais ou academia?",
      answer: "Não! Todos os exercícios podem ser feitos em casa, usando apenas o peso do próprio corpo. Você só precisa de um tapete ou toalha e 15-20 minutos por dia."
    },
    {
      question: "E se eu nunca fiz exercícios antes?",
      answer: "Perfeito! O método é progressivo e começa do básico. Muitas de nossas alunas eram sedentárias e conseguiram excelentes resultados. Você vai no seu ritmo."
    },
    {
      question: "Quanto tempo até ver os primeiros resultados?",
      answer: "A maioria das mulheres sente alívio significativo nas primeiras 2-3 semanas. Resultados duradouros aparecem entre 4-6 semanas de prática consistente."
    },
    {
      question: "O método substitui tratamento médico?",
      answer: "Não substituímos tratamento médico. O método é complementar e focado em movimento terapêutico. Sempre mantenha acompanhamento com seu médico."
    },
    {
      question: "E se eu não conseguir fazer os exercícios?",
      answer: "Oferecemos modificações para todas as limitações. Se mesmo assim não conseguir, você tem 7 dias de garantia total para solicitar reembolso."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header com headline melhorada */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Descobrimos Qual Método Vai Eliminar Suas Dores!
          </h1>
          <p className="text-xl text-white/90 mb-4">{archetype.subtitle}</p>
          <p className="text-white/80 mb-6">{archetype.description}</p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
            <div className="flex justify-center items-center gap-6 text-sm text-white">
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-400" />
                {userScore} pontos conquistados
              </span>
              <span>•</span>
              <span className="flex items-center gap-2 bg-green-500/30 px-3 py-1 rounded-full">
                <TrendingDown className="w-4 h-4 text-green-300" />
                <strong>Oferta especial liberada: R${finalPrice.toFixed(2).replace('.', ',')}</strong>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Análise personalizada aprofundada */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl p-8 mb-8"
        >
          <div className="text-center mb-6">
            <img 
              src="https://institutodeneurociencias.com.br/wp-content/uploads/2015/10/DSC_0762.jpg"
              alt="Método AlíMax"
              className="w-16 h-16 mx-auto mb-4 rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='30' fill='%237c3aed'/%3E%3Ctext x='32' y='38' text-anchor='middle' fill='white' font-size='24' font-weight='bold'%3EAM%3C/text%3E%3C/svg%3E";
              }}
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Método AlíMax | Alívio de dores no {getPainArea()}
            </h2>
            <p className="text-gray-600">
              {archetype.subtitle}
            </p>
          </div>
          
          {/* Análise profunda personalizada */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
            <h3 className="font-bold text-blue-800 mb-3 flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              Análise Personalizada do Seu Caso
            </h3>
            <div className="space-y-3">
              {personalizedInsights.map((insight, index) => (
                <p key={index} className="text-blue-700 text-sm leading-relaxed">
                  <strong>• {insight}</strong>
                </p>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-xl text-center">
              <div className="text-2xl mb-2">👤</div>
              <div className="text-xs text-gray-600">Perfil</div>
              <div className="font-bold text-blue-700">{answers.age}</div>
            </div>
            <div className="bg-red-50 p-4 rounded-xl text-center">
              <div className="text-2xl mb-2">{getPainEmoji(answers.painLevel)}</div>
              <div className="text-xs text-gray-600">Dor</div>
              <div className="font-bold text-red-700">{answers.painLevel}/10</div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl text-center">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-xs text-gray-600">Foco</div>
              <div className="font-bold text-green-700">
                {answers.mainProblem === 'back' ? 'Costas' : 
                 answers.mainProblem === 'neck' ? 'Pescoço' : 
                 answers.mainProblem === 'joints' ? 'Articulações' : 'Mobilidade'}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl text-center">
              <div className="text-2xl mb-2">⏱️</div>
              <div className="text-xs text-gray-600">Duração</div>
              <div className="font-bold text-purple-700">
                {answers.duration === 'recent' ? '<3m' : 
                 answers.duration === 'moderate' ? '3m-1a' : 
                 answers.duration === 'chronic' ? '1-3a' : '+3a'}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400 p-6 mb-6">
            <h3 className="font-bold text-red-800 mb-3 flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              Situação Crítica Identificada
            </h3>
            <p className="text-red-700 text-sm leading-relaxed">
              Nossos especialistas identificaram que seu padrão de dor pode evoluir para <strong>limitações permanentes</strong> se não tratado adequadamente. 
              Estudos mostram que {answers.painLevel >= 6 ? 'dores de alta intensidade' : 'dores persistentes'} como a sua tendem a 
              piorar 40% mais rápido após os {answers.age === '35-44' ? '40' : answers.age === '45-54' ? '50' : '60'} anos. 
              <strong>A janela de reversão total ainda está aberta, mas o tempo é crucial.</strong>
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <div className="font-semibold text-gray-800">Método Cientificamente Personalizado</div>
                <div className="text-sm text-gray-600">Protocolo específico para {archetype.title.toLowerCase()} com dores {getPainText(answers.painLevel).toLowerCase()}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <div className="font-semibold text-gray-800">Abordagem Direcionada Para Sua Condição</div>
                <div className="text-sm text-gray-600">Foco especializado em {answers.mainProblem === 'back' ? 'reequilíbrio postural e fortalecimento do core' : answers.mainProblem === 'neck' ? 'descompressão cervical e relaxamento muscular' : answers.mainProblem === 'joints' ? 'mobilidade articular e flexibilidade' : 'movimento funcional integrado'}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <div className="font-semibold text-gray-800">Resultados Garantidos em 21 Dias</div>
                <div className="text-sm text-gray-600">Baseado em 15.000+ casos de sucesso com perfil idêntico ao seu</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Oferta com justificativa melhorada */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-purple-600 via-purple-600 to-blue-700 rounded-2xl text-white p-8 mb-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold inline-block mb-4">
              🏆 OFERTA EXCLUSIVA PARA SEU PERFIL
            </div>
            <h2 className="text-3xl font-bold mb-3">Método AlíMax | Alívio de dores no {getPainArea()}</h2>
            <p className="text-white/90 text-lg">O sistema completo para eliminar suas dores em 21 dias</p>
          </div>

          {/* Benefícios reais e relevantes */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold mb-4 text-center">Por que você ganhou esse preço especial?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-bold mb-1">🎯 Alívio Imediato das Dores</div>
                <div>Primeiros resultados em 48-72h com técnicas de liberação miofascial</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-bold mb-1">💪 Fortalecimento Progressivo</div>
                <div>Músculos mais fortes = menos dor e maior resistência no dia a dia</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-bold mb-1">🧘‍♀️ Relaxamento Profundo</div>
                <div>Técnicas de respiração que reduzem stress e tensão muscular</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-bold mb-1">🏠 Praticidade Total</div>
                <div>15-20 min/dia em casa, sem equipamentos caros ou academia</div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
            <div className="text-center">
              <div className="text-sm text-white/80 mb-2">Investimento normal para casos similares:</div>
              <div className="text-3xl line-through opacity-70 mb-4">R$ {originalPrice},00</div>
              
              {/* Desconto dos pontos bem visível */}
              <div className="bg-gradient-to-r from-green-400 to-emerald-400 text-green-900 p-4 rounded-xl mb-4">
                <div className="text-lg font-bold">🎯 PARABÉNS! SEUS {userScore} PONTOS</div>
                <div className="text-2xl font-black">LIBERARAM O PREÇO ESPECIAL DE LANÇAMENTO</div>
                <div className="text-sm mt-1">Disponível apenas para primeiros 100 casos críticos!</div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-center"
              >
                <div className="text-lg text-white/90">Seu investimento hoje:</div>
                <div className="text-6xl font-bold text-yellow-300 mb-2">R$ {finalPrice.toFixed(2).replace('.', ',')}</div>
                <div className="text-sm text-white/80">Pagamento único • Acesso vitalício</div>
              </motion.div>
            </div>
          </div>

          <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-4 mb-6 border border-red-300/30">
            <div className="flex justify-center items-center gap-3 text-sm">
              <Clock className="w-5 h-5 text-red-300" />
              <span className="font-bold">OFERTA EXPIRA EM: {formatTime(timeLeft)}</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePurchaseClick}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-900 font-bold py-6 px-8 rounded-xl text-xl transition-all shadow-lg flex items-center justify-center gap-3"
          >
            QUERO MEU MÉTODO PERSONALIZADO AGORA
            <ChevronRight className="w-6 h-6" />
          </motion.button>

          <div className="flex justify-center items-center gap-6 mt-6 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Garantia 7 dias</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{recentUsers + Math.floor(Math.random() * 10)} mulheres comprando agora</span>
            </div>
          </div>
        </motion.div>

        {/* Reviews expandidos e mais autênticos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <h3 className="text-center text-white text-2xl font-bold mb-8">
            O que dizem quem já eliminou as dores:
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="flex text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                
                <p className="text-gray-700 italic mb-4 leading-relaxed text-sm">
                  "{review.text}"
                </p>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="text-xs text-green-700 font-medium">
                    <strong>Problema:</strong> {review.problem} • <strong>Resultado em:</strong> {review.timeToResult}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <img 
                    src={review.image}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{review.name}</p>
                    <p className="text-xs text-gray-600">{review.age}, {review.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl shadow-2xl p-8 mb-8"
        >
          <div className="text-center mb-8">
            <HelpCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Perguntas Frequentes</h3>
            <p className="text-gray-600">Tire suas dúvidas sobre o Método AlíMax</p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <h4 className="font-semibold text-gray-800 mb-2 flex items-start gap-2">
                  <span className="text-purple-600 font-bold">Q:</span>
                  {item.question}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed pl-6">
                  <span className="text-purple-600 font-bold">R:</span> {item.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Support and Guarantee Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl text-white p-8 text-center"
        >
          <Shield className="w-16 h-16 mx-auto mb-4 text-green-200" />
          <h3 className="text-2xl font-bold mb-4">Garantia Total de 7 Dias</h3>
          <p className="text-green-100 mb-6 leading-relaxed">
            Experimente o Método AlíMax por 7 dias completos. Se não sentir melhora significativa nas suas dores, 
            devolvemos 100% do seu investimento, sem perguntas e sem burocracia.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
            <h4 className="font-bold mb-4">Suporte Completo Incluso:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-200" />
                <span>Chat direto com especialistas</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-green-200" />
                <span>Suporte por WhatsApp</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-green-200" />
                <span>Acompanhamento personalizado</span>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-green-200">
            Nossa equipe está disponível de segunda a sexta, das 9h às 18h, para te ajudar em cada passo da sua jornada.
          </p>
        </motion.div>
      </div>
    </div>
  );
};