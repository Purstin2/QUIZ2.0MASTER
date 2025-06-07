import React from 'react';
import { motion } from 'framer-motion';
import { Search, Database, Brain, Stethoscope, Heart, CheckCircle } from 'lucide-react';

interface QuizAnalysisProps {
  answers: any;
  analysisStep: number;
  userScore: number;
}

export const QuizAnalysis: React.FC<QuizAnalysisProps> = ({ answers, analysisStep, userScore }) => {
  const { age, painLevel, mainProblem, duration } = answers;
  
  const analysisSteps = [
    { icon: Search, text: `Analisando perfil: mulher ${age} anos com dor nível ${painLevel}...`, color: "text-blue-600" },
    { icon: Database, text: `Consultando casos similares de dores em ${mainProblem === 'back' ? 'costas' : mainProblem === 'neck' ? 'pescoço' : mainProblem === 'joints' ? 'articulações' : 'mobilidade'}...`, color: "text-purple-600" },
    { icon: Brain, text: `Identificando padrão: dor ${duration === 'recent' ? 'recente' : duration === 'moderate' ? 'moderada' : duration === 'chronic' ? 'crônica' : 'persistente'} requer abordagem específica...`, color: "text-indigo-600" },
    { icon: Stethoscope, text: "Definindo protocolo ideal para seu perfil único...", color: "text-green-600" },
    { icon: Heart, text: "Personalizando método baseado em 15.000+ casos similares...", color: "text-red-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 text-center"
        >
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Análise Inteligente em Andamento
            </h2>
            <p className="text-gray-600">
              Nossa IA está processando suas respostas para identificar o método ideal
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {analysisSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === analysisStep;
              const isCompleted = index < analysisStep;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: isActive || isCompleted ? 1 : 0.3,
                    x: 0,
                    scale: isActive ? 1.05 : 1
                  }}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                    isActive ? 'bg-purple-50 border border-purple-200' : 
                    isCompleted ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-100' : isActive ? 'bg-purple-100' : 'bg-gray-100'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <Icon className={`w-6 h-6 ${isActive ? step.color : 'text-gray-400'}`} />
                    )}
                  </div>
                  <span className={`font-medium ${
                    isActive ? 'text-purple-800' : 
                    isCompleted ? 'text-green-800' : 'text-gray-500'
                  }`}>
                    {step.text}
                  </span>
                  {isActive && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="ml-auto"
                    >
                      <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-lg">
            <p className="text-sm font-medium">
              🎯 {userScore} pontos conquistados • Parabéns !
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};