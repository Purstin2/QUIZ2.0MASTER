import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  userScore: number;
  answers: any;
  onComplete: () => void;
  duration?: number;
}

// Loading Screen Inteligente
const IntelligentLoadingScreen: React.FC<LoadingScreenProps> = ({ 
  userScore, 
  answers, 
  onComplete, 
  duration = 5000 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Análises personalizadas baseadas nas respostas
  const getPersonalizedAnalysis = () => {
    const { age, painLevel, mainProblem, duration, previousTreatment } = answers;
    
    return [
      {
        title: "Analisando Perfil Demográfico",
        description: `Processando dados de mulher ${age} com dor nível ${painLevel}`,
        icon: "👥",
        duration: 1500
      },
      {
        title: "Consultando Base de Casos Similares", 
        description: `Buscando padrões em 15.000+ casos de ${mainProblem === 'back' ? 'dores nas costas' : mainProblem === 'neck' ? 'tensão cervical' : 'problemas articulares'}`,
        icon: "🔍",
        duration: 2000
      },
      {
        title: "Analisando Histórico Clínico",
        description: `Avaliando ${duration === 'recent' ? 'dor recente' : 'dor crônica'} e ${previousTreatment === 'none' ? 'ausência de tratamento' : 'tentativas anteriores'}`,
        icon: "📊",
        duration: 1800
      },
      {
        title: "Calculando Probabilidade de Sucesso",
        description: `Baseado no seu perfil: ${userScore > 200 ? '94%' : userScore > 150 ? '87%' : '78%'} de chance de resultado positivo`,
        icon: "🎯",
        duration: 1200
      },
      {
        title: "Personalizando Protocolo",
        description: "Adaptando exercícios e técnicas para seu caso específico",
        icon: "⚙️",
        duration: 1000
      },
      {
        title: "Finalizando Análise",
        description: "Preparando seu plano personalizado...",
        icon: "✅",
        duration: 500
      }
    ];
  };
  
  const analysisSteps = getPersonalizedAnalysis();
  const currentAnalysis = analysisSteps[currentStep];
  
  useEffect(() => {
    if (currentStep < analysisSteps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setProgress(((currentStep + 1) / analysisSteps.length) * 100);
      }, currentAnalysis.duration);
      
      return () => clearTimeout(timer);
    } else {
      // Análise completa
      setTimeout(onComplete, 800);
    }
  }, [currentStep]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
      <div className="text-white text-center max-w-lg mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold mb-4">IA Analisando Seu Caso</h2>
          <p className="text-white/80">
            Nossa inteligência artificial está processando suas respostas para criar o método perfeito para você
          </p>
        </motion.div>
        
        {/* Análise atual */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8"
        >
          <div className="text-6xl mb-4">{currentAnalysis?.icon}</div>
          <h3 className="text-xl font-bold mb-3">{currentAnalysis?.title}</h3>
          <p className="text-white/90 text-sm leading-relaxed">
            {currentAnalysis?.description}
          </p>
          
          {/* Indicador de processamento */}
          <div className="flex justify-center mt-6">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Barra de progresso detalhada */}
        <div className="bg-white/20 rounded-full h-3 mb-4 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <div className="text-sm text-white/80 mb-6">
          {Math.round(progress)}% concluído • Passo {currentStep + 1} de {analysisSteps.length}
        </div>
        
        {/* Timeline de etapas */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          {analysisSteps.map((step, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg transition-all ${
                index <= currentStep 
                  ? 'bg-green-500/20 text-green-300' 
                  : 'bg-white/10 text-white/50'
              }`}
            >
              <div className="mb-1">{step.icon}</div>
              <div className="font-medium">{step.title.split(' ')[0]}</div>
            </div>
          ))}
        </div>
        
        {/* Dados processados */}
        <div className="mt-8 text-sm text-white/70">
          ✅ {userScore} pontos analisados • 🔍 {Object.keys(answers).length} parâmetros processados
        </div>
      </div>
    </div>
  );
};

export const LoadingScreen: React.FC<LoadingScreenProps> = (props) => {
  return <IntelligentLoadingScreen {...props} />;
};