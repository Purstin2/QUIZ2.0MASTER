import React, { useState } from 'react';
import { ChevronRight, Mail, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveQuizResponse, checkEmailExists } from '../lib/supabase';
import { trackEmailCapture, trackPixelEvent } from '../lib/pixel';

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

// Componente de Commitment Escalation
const CommitmentEscalation: React.FC<{ 
  answers: any; 
  onCommitment: (commitments: string[]) => void;
}> = ({ answers, onCommitment }) => {
  const [currentCommitment, setCurrentCommitment] = useState(0);
  const [userCommitments, setUserCommitments] = useState<string[]>([]);
  
  const commitmentQuestions = [
    {
      question: "Você REALMENTE quer eliminar suas dores de vez?",
      subtext: "Não apenas diminuir, mas eliminar completamente",
      commitment: "Sim, quero eliminar minhas dores definitivamente"
    },
    {
      question: `Você se compromete a dedicar ${answers.timeAvailable || '15 minutos'} por dia?`,
      subtext: "Consistência é fundamental para o resultado",
      commitment: `Comprometo-me com ${answers.timeAvailable || '15 minutos'} diários`
    },
    {
      question: "Você acredita que é possível viver sem dores?",
      subtext: "Sua mentalidade determina 70% do resultado",
      commitment: "Acredito que posso viver sem dores"
    }
  ];
  
  const handleCommitment = (commitment: string) => {
    const newCommitments = [...userCommitments, commitment];
    setUserCommitments(newCommitments);
    
    // Track micro-commitment
    trackPixelEvent('Lead', {
      content_name: `Micro-compromisso ${currentCommitment + 1}`,
      content_category: 'Commitment Escalation',
      value: 10 * (currentCommitment + 1)
    });
    
    if (currentCommitment < commitmentQuestions.length - 1) {
      setTimeout(() => setCurrentCommitment(prev => prev + 1), 500);
    } else {
      // Todas as commitments feitas - prossegue para email
      setTimeout(() => onCommitment(newCommitments), 1000);
    }
  };
  
  if (currentCommitment >= commitmentQuestions.length) {
    return (
      <div className="text-center bg-green-50 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-green-800 mb-3">
          🎯 Perfeito! Você está 100% comprometida com sua transformação
        </h3>
        <div className="space-y-2 text-green-700 text-sm">
          {userCommitments.map((commitment, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {commitment}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  const current = commitmentQuestions[currentCommitment];
  
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-xl">
        <h3 className="text-lg font-bold text-blue-800 mb-3">
          {current.question}
        </h3>
        <p className="text-blue-600 mb-4 text-sm">
          {current.subtext}
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={() => handleCommitment(current.commitment)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold"
          >
            ✅ {current.commitment}
          </button>
        </div>
      </div>
      
      {/* Progresso dos compromissos */}
      <div className="flex justify-center gap-2">
        {commitmentQuestions.map((_, i) => (
          <div 
            key={i}
            className={`w-3 h-3 rounded-full ${
              i <= currentCommitment ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export const QuizSteps: React.FC<QuizStepsProps> = ({ 
  currentStep, 
  answers, 
  onAnswer, 
  onAnswersChange,
  userScore 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [showCommitments, setShowCommitments] = useState(false);
  const [commitments, setCommitments] = useState<string[]>([]);

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

  const handleEmailSubmit = async () => {
    if (!answers.email || !answers.email.includes('@')) {
      setEmailError('Por favor, digite um email válido');
      return;
    }

    setIsSubmitting(true);
    setEmailError('');

    try {
      // Check if email already exists
      const emailExists = await checkEmailExists(answers.email);
      
      if (emailExists) {
        setEmailError('Este email já foi usado. Tente outro email.');
        setIsSubmitting(false);
        return;
      }

      // Prepare data for Supabase
      const quizData = {
        email: answers.email,
        age: answers.age,
        pain_level: answers.painLevel,
        main_problem: answers.mainProblem,
        duration: answers.duration,
        previous_treatment: answers.previousTreatment,
        lifestyle: answers.lifestyle,
        time_available: answers.timeAvailable,
        investment: answers.investment,
        user_score: userScore
      };

      // Save to Supabase
      await saveQuizResponse(quizData);
      
      // Track email capture for Facebook Pixel
      trackEmailCapture(answers.email);
      
      // Continue with the quiz flow
      onAnswer('email', answers.email);
      
    } catch (error) {
      console.error('Error saving quiz response:', error);
      setEmailError('Erro ao salvar dados. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommitmentComplete = (userCommitments: string[]) => {
    setCommitments(userCommitments);
    setShowCommitments(false);
    // Prossegue para próxima pergunta após commitments
    setTimeout(() => {
      onAnswer(currentStep.id, answers[currentStep.id as keyof typeof answers]);
    }, 500);
  };

  // Mostrar commitment escalation após previousTreatment (pergunta 4)
  if (currentStep.id === 'previousTreatment' && showCommitments) {
    return <CommitmentEscalation answers={answers} onCommitment={handleCommitmentComplete} />;
  }

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

  // Input de email com integração Supabase
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

          {/* Mostrar commitments se existirem */}
          {commitments.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-green-800 mb-2">✅ Seus Compromissos:</h4>
              <div className="space-y-1 text-green-700 text-sm">
                {commitments.map((commitment, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {commitment}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <input
            type="email"
            value={answers.email}
            onChange={(e) => {
              onAnswersChange({ ...answers, email: e.target.value });
              if (emailError) setEmailError(''); // Clear error when user types
            }}
            placeholder="Digite seu melhor e-mail"
            className={`w-full px-6 py-4 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-lg transition-all ${
              emailError ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          
          {emailError && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
              {emailError}
            </div>
          )}
        </div>

        <button
          onClick={handleEmailSubmit}
          disabled={!answers.email.includes('@') || isSubmitting}
          className="w-full bg-purple-700 hover:bg-purple-800 disabled:bg-gray-300 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all shadow-lg flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Salvando dados...
            </>
          ) : (
            <>
              Receber Método Personalizado
              <ChevronRight className="w-6 h-6" />
            </>
          )}
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
    const handleOptionClick = (value: string) => {
      // Se for previousTreatment, mostrar commitment escalation
      if (currentStep.id === 'previousTreatment') {
        onAnswersChange({ ...answers, [currentStep.id]: value });
        setShowCommitments(true);
      } else {
        onAnswer(currentStep.id, value);
      }
    };

    return (
      <div className="space-y-4">
        {currentStep.options.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => handleOptionClick(option.value)}
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