import React from 'react';
import { ChevronRight, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuizStep {
  id: string;
  title: string;
  subtitle: string;
  type?: string;
  options?: Array<{
    value: string;
    label: string;
    emoji: string;
    desc: string;
  }>;
}

interface QuizStepsProps {
  currentStep: QuizStep;
  answers: any;
  onAnswer: (field: string, value: any) => void;
  onAnswersChange: (answers: any) => void;
  userScore: number;
}

export const QuizSteps: React.FC<QuizStepsProps> = ({ 
  currentStep, 
  answers, 
  onAnswer, 
  onAnswersChange,
  userScore 
}) => {
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

  // Slider para dor
  if (currentStep.type === 'slider') {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="text-8xl mb-4">{getPainEmoji(answers.painLevel)}</div>
          <div className="text-3xl font-bold text-purple-600 mb-2">{answers.painLevel}/10</div>
          <div className="text-lg text-gray-600">{getPainText(answers.painLevel)}</div>
        </div>
        
        <div className="relative px-4">
          <input
            type="range"
            min="0"
            max="10"
            value={answers.painLevel}
            onChange={(e) => onAnswersChange({ ...answers, painLevel: parseInt(e.target.value) })}
            className="w-full h-4 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
        
        <div className="flex justify-between text-sm text-gray-500 px-4">
          <span>😊 Sem dor</span>
          <span>😭 Dor máxima</span>
        </div>

        <button
          onClick={() => onAnswer('painLevel', answers.painLevel)}
          className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all shadow-lg"
        >
          Continuar Avaliação
        </button>
      </div>
    );
  }

  // Input de email
  if (currentStep.type === 'email') {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <p className="text-purple-800 font-medium text-center">
              🎯 Baseado em suas respostas, você tem <strong>89% de compatibilidade</strong> com nosso método mais eficaz
            </p>
            <div className="text-center mt-3">
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold">
                ✨ {userScore} pontos conquistados • Oferta especial desbloqueada
              </span>
            </div>
          </div>
        </div>

        <input
          type="email"
          value={answers.email}
          onChange={(e) => onAnswersChange({ ...answers, email: e.target.value })}
          placeholder="Digite seu melhor e-mail"
          className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-lg"
        />

        <button
          onClick={() => onAnswer('email', answers.email)}
          disabled={!answers.email.includes('@')}
          className="w-full bg-purple-700 hover:bg-purple-800 disabled:bg-gray-300 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all shadow-lg flex items-center justify-center gap-3"
        >
          Receber Método Personalizado
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            🔒 Seus dados estão protegidos por criptografia SSL
          </p>
        </div>
      </div>
    );
  }

  // Opções de resposta
  if (currentStep.options) {
    return (
      <div className="space-y-4">
        {currentStep.options.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => onAnswer(currentStep.id, option.value)}
            className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-600 hover:bg-purple-50 transition-all group shadow-sm"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-100 to-purple-200 group-hover:from-purple-600 group-hover:to-purple-700 group-hover:text-white flex items-center justify-center text-2xl transition-all flex-shrink-0">
              {option.emoji}
            </div>
            <div className="text-left flex-1">
              <div className="font-bold text-gray-800 text-base mb-1">{option.label}</div>
              {option.desc && (
                <div className="text-gray-600 text-sm">{option.desc}</div>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 flex-shrink-0" />
          </motion.button>
        ))}
      </div>
    );
  }

  return <div>Carregando...</div>;
};