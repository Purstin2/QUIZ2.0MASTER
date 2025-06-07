import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Shield, Award, TrendingDown, Heart, Brain, HelpCircle, MessageCircle, Phone } from 'lucide-react';
import { trackOfferView, trackPurchaseIntent } from '../lib/pixel';

interface QuizResultsProps {
  answers: any;
  userScore: number;
  timeLeft: number;
}

// Componente de Ancoragem Progressiva de Preços
const PricingAnchorage: React.FC<{ userScore: number }> = ({ userScore }) => {
  const [currentPrice, setCurrentPrice] = useState(197.00);
  const [currentText, setCurrentText] = useState("Valor de mercado para casos similares");
  const [showFinalPrice, setShowFinalPrice] = useState(false);
  
  useEffect(() => {
    // Ancoragem progressiva - mostrar preços em sequência
    const sequence = [
      { price: 197.00, delay: 0, text: "Valor de mercado para casos similares" },
      { price: 97.00, delay: 2000, text: "Preço promocional de lançamento" },
      { price: 47.00, delay: 4000, text: "Desconto para primeiras 100 vagas" },
      { price: 9.97, delay: 6000, text: "SEU PREÇO FINAL com pontuação máxima", final: true }
    ];
    
    sequence.forEach(({ price, delay, text, final }) => {
      setTimeout(() => {
        setCurrentPrice(price);
        setCurrentText(text);
        if (final) setShowFinalPrice(true);
      }, delay);
    });
  }, []);
  
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
      <div className="text-center mb-6">
        <h3 className="text-white/90 text-lg mb-2">{currentText}</h3>
        <p className="text-5xl font-bold text-white leading-tight">
          R${currentPrice.toFixed(2).replace('.', ',')}
        </p>
      </div>
      {showFinalPrice && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-4 text-white/70 text-sm"
        >
          Preço para o seu perfil: <span className="font-bold text-yellow-300">R$9,97</span>
        </motion.div>
      )}
    </div>
  );
};

export const QuizResults: React.FC<QuizResultsProps> = ({
  answers,
  userScore,
  timeLeft,
}) => {
  useEffect(() => {
    trackOfferView();
  }, []);

  const handlePurchaseClick = () => {
    trackPurchaseIntent();
    // Lógica para ir para a página de compra
    window.location.href = "https://pay.hotmart.com/E92931448L?off=bwmj3805";
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}min`;
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

  const getPainArea = () => {
    const problem = answers.mainProblem;
    switch (problem) {
      case 'back': return 'costas';
      case 'neck': return 'pescoço';
      case 'shoulders': return 'ombros';
      case 'joints': return 'articulações';
      case 'head': return 'cabeça';
      default: return 'geral';
    }
  };

  const getDynamicCTA = (answers: any) => {
    const painLevel = answers.painLevel;
    const investment = answers.investment;

    if (painLevel >= 7 && investment === 'Invisto regularmente') {
      return {
        primary: "Garantir meu acesso agora",
        secondary: "Últimas vagas com desconto para o seu perfil"
      };
    } else if (painLevel < 5 && investment === 'Não tenho certeza') {
      return {
        primary: "Quero saber mais sobre o método",
        secondary: "Tire suas dúvidas antes de começar"
      };
    } else {
      return {
        primary: "Quero Eliminar Minhas Dores Agora",
        secondary: "Clique aqui e transforme sua vida"
      };
    }
  };

  const ctaText = getDynamicCTA(answers);

  const getPersonalizedAnalysis = () => {
    const { painLevel, mainProblem, age, duration, investment } = answers;
    const analysis = [];

    // Análise da dor e impacto
    if (painLevel >= 7) {
      analysis.push(`Seu nível de dor (${painLevel}/10) é alto, indicando impacto significativo na sua vida diária. Isso exige uma abordagem focada em alívio rápido e duradouro.`);
    } else if (painLevel >= 4) {
      analysis.push(`Sua dor moderada (${painLevel}/10) pode progredir se não tratada. Nosso protocolo visa prevenir o agravamento e restaurar seu bem-estar.`);
    } else {
      analysis.push(`Com dor de nível ${painLevel}/10, você está em um estágio inicial. A intervenção precoce é crucial para evitar que o problema se torne crônico.`);
    }

    // Análise da área principal do problema
    switch (mainProblem) {
      case 'back':
        analysis.push("A dor nas costas é frequentemente ligada a má postura e fraqueza muscular. Nosso método foca em fortalecer o core e realinhar a coluna.");
        break;
      case 'neck':
        analysis.push("Tensão no pescoço e ombros é comum com o uso de telas. Nossos exercícios visam liberar essa tensão e melhorar a mobilidade.");
        break;
      case 'shoulders':
        analysis.push("Dores nos ombros podem indicar problemas de mobilidade ou inflamação. O protocolo inclui técnicas para restaurar a função e reduzir a dor.");
        break;
      case 'joints':
        analysis.push("Dores nas articulações, como joelhos ou quadris, podem ser aliviadas com exercícios de baixo impacto que fortalecem a musculatura de suporte.");
        break;
      case 'head':
        analysis.push("Dores de cabeça tensionais muitas vezes se originam no pescoço e ombros. Nosso método aborda essas causas raiz para alívio.");
        break;
    }

    // Análise da idade e duração
    if (age === '65+' || age === '55-64') {
      analysis.push("Considerando sua idade, o foco será em técnicas suaves que respeitem seu corpo, com ênfase na longevidade e prevenção de novas dores.");
    } else if (age === '45-54') {
      analysis.push("Para sua faixa etária, combinamos técnicas de recuperação com fortalecimento para manter a vitalidade e prevenir dores futuras.");
    }

    if (duration === 'longtime') {
      analysis.push("Sua dor crônica exige uma abordagem abrangente que desative os padrões de dor e reconstrua a função corporal de forma duradoura.");
    } else {
      analysis.push("Sua dor recente responde bem a intervenções rápidas. Nosso protocolo acelerará sua recuperação e evitará a cronicidade.");
    }

    // Análise do investimento em saúde
    if (investment === 'Invisto regularmente') {
      analysis.push("Seu compromisso com a saúde é um ponto forte. Vamos direcionar esse investimento para resultados ainda mais efetivos e personalizados.");
    } else if (investment === 'Investimento básico') {
      analysis.push("Entendemos suas prioridades. Nosso protocolo oferece o máximo de resultado com um investimento acessível, focando no que realmente importa para sua recuperação.");
    } else {
      analysis.push("É compreensível ter dúvidas sobre investimento em saúde. Nosso objetivo é mostrar o valor real de viver sem dor, com um plano claro e acessível.");
    }

    return analysis;
  };

  const personalizedInsights = getPersonalizedAnalysis();

  // Sistema de arquétipos  
const getArchetype = () => {
  const { age, painLevel, mainProblem, duration } = answers;
  
  if (painLevel >= 7 && duration === 'longtime') {
    return {
      title: "Caso de Dor Crônica",
      subtitle: "Identificamos um padrão de dor persistente que requer atenção especializada",
      description: "Nossa equipe médica está preparada para oferecer o tratamento mais adequado ao seu caso"
    };
  } else if (mainProblem === 'back' && age === '45-54') {
    return {
      title: "Problema Lombar", 
      subtitle: "Sua condição requer uma abordagem específica para a região lombar",
      description: "Nossos especialistas desenvolveram um protocolo específico para seu caso"
    };
  } else if (painLevel <= 4 && duration === 'recent') {
    return {
      title: "Dor Recente",
      subtitle: "Identificamos um padrão de dor recente que pode ser tratado de forma preventiva",
      description: "A intervenção precoce é fundamental para evitar complicações futuras"
    };
  } else if (age === '55-64' || age === '65+') {
    return {
      title: "Acompanhamento Especializado",
      subtitle: "Seu caso requer atenção especial considerando sua faixa etária",
      description: "Nossa equipe está preparada para oferecer o tratamento mais adequado"
    };
  } else {
    return {
      title: "Tratamento Personalizado",
      subtitle: "Identificamos o melhor protocolo para seu caso específico",
      description: "Nossa equipe médica está pronta para iniciar seu tratamento"
    };
  }
};

  const archetype = getArchetype();
  const finalPrice = userScore < 50 ? 47.00 : 9.97; // Preço final baseado na pontuação

  const faqItems = [
    {
      question: "O Protocolo AlíMax funciona para qualquer tipo de dor?",
      answer: "Sim, o Protocolo AlíMax foi desenvolvido para abordar diversas causas de dor, desde dores crônicas nas costas e pescoço até dores nas articulações e dores de cabeça tensionais. Nossa análise personalizada garante que o tratamento seja adaptado ao seu caso específico."
    },
    {
      question: "Preciso de equipamentos especiais para seguir o Protocolo?",
      answer: "Não. O Protocolo AlíMax é baseado em exercícios e técnicas que podem ser realizados no conforto da sua casa, utilizando apenas o peso do seu corpo ou objetos comuns do dia a dia. Você não precisará de nenhum equipamento caro ou incomum."
    },
    {
      question: "Quanto tempo leva para ver os resultados?",
      answer: "Muitas de nossas pacientes relatam alívio significativo nas primeiras semanas de aplicação do Protocolo. No entanto, os resultados podem variar de pessoa para pessoa, dependendo da intensidade e cronicidade da dor. O importante é a consistência e seguir as orientações personalizadas."
    },
    {
      question: "Tenho garantia de resultados?",
      answer: "Sim, oferecemos uma garantia de satisfação de 7 dias. Se por qualquer motivo você não estiver satisfeita com o Protocolo AlíMax, basta nos contatar dentro desse período que devolveremos 100% do seu investimento, sem burocracia. Nosso compromisso é com a sua saúde e bem-estar."
    },
    {
      question: "O Protocolo AlíMax substitui o tratamento médico?",
      answer: "Não. O Protocolo AlíMax é um complemento, não um substituto para a avaliação e tratamento médico adequado. Ele oferece ferramentas e técnicas para o manejo da dor e a melhora da qualidade de vida, mas sempre recomendamos que você consulte um profissional de saúde para um diagnóstico preciso e acompanhamento."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header com headline profissional */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 bg-purple-600 rounded-b-xl py-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Análise Completa do Seu Caso
          </h1>
          <p className="text-xl text-white/90 mb-4">{archetype.subtitle}</p>
          <p className="text-white/80 mb-6">{archetype.description}</p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
            <div className="flex justify-center items-center gap-6 text-sm text-white">
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-400" />
                {userScore} pontos na avaliação
              </span>
              <span>•</span>
              <span className="flex items-center gap-2 bg-green-500/30 px-3 py-1 rounded-full">
                <TrendingDown className="w-4 h-4 text-green-300" />
                <strong>Valor do tratamento: R${finalPrice.toFixed(2).replace('.', ',')}</strong>
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
              alt="Dr. AlíMax"
              className="w-16 h-16 mx-auto mb-4 rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='30' fill='%237c3aed'/%3E%3Ctext x='32' y='38' text-anchor='middle' fill='white' font-size='24' font-weight='bold'%3EAM%3C/text%3E%3C/svg%3E";
              }}
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Protocolo AlíMax | Tratamento para {getPainArea()}
            </h2>
            <p className="text-gray-600">
              Desenvolvido por especialistas em dor e movimento
            </p>
          </div>
          
          {/* Análise profunda personalizada */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
            <h3 className="font-bold text-blue-800 mb-3 flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              Análise Clínica do Seu Caso
            </h3>
            <div className="space-y-3">
              {personalizedInsights.map((insight, index) => (
                <p key={index} className="text-blue-700 text-sm leading-relaxed">
                  <strong>• {insight}</strong>
                </p>
              ))}
            </div>
          </div>

          {/* Oferta com tom profissional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl text-white p-8 mb-8 shadow-2xl"
          >
            <div className="text-center mb-8">
              <div className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-bold inline-block mb-4">
                TRATAMENTO PERSONALIZADO
              </div>
              <h2 className="text-3xl font-bold mb-3">Protocolo AlíMax | Tratamento para {getPainArea()}</h2>
              <p className="text-white/90 text-lg">Protocolo completo desenvolvido por especialistas</p>
            </div>

            {/* Ancoragem de Preços */}
            <PricingAnchorage userScore={userScore} />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePurchaseClick}
              className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold py-6 px-8 rounded-xl text-lg transition-all shadow-lg flex items-center justify-center gap-3"
            >
              Iniciar Tratamento
              <ChevronRight className="w-6 h-6" />
            </motion.button>

            <div className="text-center mt-3 text-white/80 text-sm">
              Garantia de satisfação de 7 dias
            </div>
          </motion.div>

          {/* Garantia com tom profissional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl mt-6 mb-6"
          >
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-3 text-blue-200" />
              <h3 className="text-xl font-bold mb-3">
                Garantia de Satisfação
              </h3>
              <p className="text-blue-100 mb-4 leading-relaxed">
                <strong>Não satisfeita com os resultados?</strong><br/>
                Devolvemos 100% do valor investido.<br/>
                Sem burocracia.
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
                <h4 className="font-bold mb-4">Suporte Especializado:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-blue-200" />
                    <span>Atendimento com especialistas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-blue-200" />
                    <span>Suporte por WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-blue-200" />
                    <span>Acompanhamento personalizado</span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-blue-200">
                Nossa equipe está disponível de segunda a sexta, das 9h às 18h.
              </p>
            </div>
          </motion.div>

          {/* FAQ com tom profissional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl shadow-2xl p-8 mb-8"
          >
            <div className="text-center mb-8">
              <HelpCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Perguntas Frequentes</h3>
              <p className="text-gray-600">Tire suas dúvidas sobre o Protocolo AlíMax</p>
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
                    <span className="text-blue-600 font-bold">Q:</span>
                    {item.question}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed pl-6">
                    <span className="text-blue-600 font-bold">R:</span> {item.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};