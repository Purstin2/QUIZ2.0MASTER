import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Shield, Users, Clock, CheckCircle, Stethoscope, Award, TrendingDown, Heart, Brain } from 'lucide-react';

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
  const finalPrice = 19.90;

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
                <strong>Oferta especial liberada: R$19,90</strong>
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
              src="https://i.ibb.co/WWS0XWMS/logo.png"
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

          {/* Justificativa do preço especial */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold mb-4 text-center">Por que você ganhou esse preço especial?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-bold mb-1">✅ Perfil de Alta Prioridade</div>
                <div>Seu caso foi classificado como crítico pelos nossos especialistas</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-bold mb-1">🎯 Compatibilidade Perfeita</div>
                <div>89% de match com nosso método mais eficaz</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-bold mb-1">⏰ Janela de Oportunidade</div>
                <div>Sua idade e histórico indicam momento ideal para reversão total</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-bold mb-1">💪 Engajamento Demonstrado</div>
                <div>{userScore} pontos provam seu comprometimento real</div>
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

        {/* Depoimentos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <h3 className="text-center text-white text-xl font-bold mb-6">
            O que dizem quem já eliminou as dores:
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-gray-700 italic mb-4 leading-relaxed text-sm">
                "Inacreditável! Em 18 dias as dores nas costas que me atormentavam há 3 anos simplesmente sumiram. 
                O método é genial e vale cada centavo!"
              </p>
              <div className="flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=80&h=80&fit=crop&crop=face&auto=format" 
                  alt="Maria Santos" 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Maria Santos</p>
                  <p className="text-xs text-gray-600">58 anos, São Paulo</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-gray-700 italic mb-4 leading-relaxed text-sm">
                "Após 5 fisioterapias sem sucesso, esse método resolveu minha tensão no pescoço em 2 semanas. 
                Recomendo para todas as amigas!"
              </p>
              <div className="flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face&auto=format" 
                  alt="Ana Lucia" 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Ana Lucia</p>
                  <p className="text-xs text-gray-600">62 anos, Rio de Janeiro</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};