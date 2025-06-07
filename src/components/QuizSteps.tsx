import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Mail, Loader2, CheckCircle, Shield, Users, Lock } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
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

// Slider de Dor Emocional Avançado
const EmotionalPainSlider: React.FC<{
  painLevel: number;
  onChange: (value: number) => void;
  onAnswer: (field: string, value: any) => void;
}> = ({ painLevel, onChange, onAnswer }) => {
  const painLevels = [
    { value: 0, emoji: '😌', label: 'Sem dor', color: 'bg-green-500', description: 'Me sinto completamente bem' },
    { value: 1, emoji: '😊', label: 'Desconforto mínimo', color: 'bg-green-500', description: 'Às vezes sinto algo, mas não me incomoda' },
    { value: 2, emoji: '🙂', label: 'Leve incômodo', color: 'bg-yellow-500', description: 'Noto quando presto atenção' },
    { value: 3, emoji: '😐', label: 'Incômodo presente', color: 'bg-yellow-500', description: 'Está sempre lá, mas consigo ignorar' },
    { value: 4, emoji: '😕', label: 'Dor moderada', color: 'bg-orange-500', description: 'Interfere em algumas atividades' },
    { value: 5, emoji: '😣', label: 'Dor considerável', color: 'bg-orange-500', description: 'Dificulta meu dia a dia' },
    { value: 6, emoji: '😰', label: 'Dor intensa', color: 'bg-red-500', description: 'Afeta significativamente minha qualidade de vida' },
    { value: 7, emoji: '😭', label: 'Dor severa', color: 'bg-red-500', description: 'Domina meus pensamentos constantemente' },
    { value: 8, emoji: '😖', label: 'Dor muito severa', color: 'bg-red-500', description: 'Impede atividades básicas do dia' },
    { value: 9, emoji: '😵', label: 'Dor insuportável', color: 'bg-red-500', description: 'Mal consigo funcionar normalmente' },
    { value: 10, emoji: '🤕', label: 'Dor máxima', color: 'bg-red-500', description: 'É impossível ignorar ou conviver' }
  ];
  
  const currentLevel = painLevels[painLevel] || painLevels[0];
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  // Sincroniza a posição inicial da bolinha com o painLevel quando o componente carrega ou painLevel muda
  useEffect(() => {
    if (trackRef.current) {
      const trackWidth = trackRef.current.clientWidth;
      const thumbWidth = 32; // w-8 h-8 = 32px
      x.set((painLevel / 10) * trackWidth - (thumbWidth / 2)); 
    }
  }, [painLevel, x, trackRef.current?.clientWidth]);

  // Atualiza o painLevel enquanto a bolinha é arrastada
  useEffect(() => {
    const unsubscribe = x.on("change", (latestX) => {
      if (trackRef.current) {
        const trackWidth = trackRef.current.clientWidth;
        const thumbWidth = 32; // w-8 h-8 = 32px
        const newXAdjusted = latestX + (thumbWidth / 2); // Ajusta latestX para o centro do polegar
        const newPercentage = Math.max(0, Math.min(1, newXAdjusted / trackWidth));
        const newValue = Math.round(newPercentage * 10);
        if (newValue !== painLevel) {
          onChange(newValue);
        }
      }
    });
    return () => unsubscribe();
  }, [x, painLevel, onChange, trackRef.current?.clientWidth]);

  return (
    <div className="space-y-8">
      {/* Exibição visual da dor atual */}
      <motion.div 
        className="text-center p-8 rounded-2xl bg-secondary shadow-lg"
        animate={{ scale: painLevel > 5 ? [1, 1.02, 1] : 1 }}
        transition={{ duration: 2, repeat: painLevel > 7 ? Infinity : 0 }}
      >
        <div className="text-8xl mb-4 filter drop-shadow-lg">
          {currentLevel.emoji}
        </div>
        <div className={`text-3xl font-bold mb-2 ${currentLevel.color} bg-clip-text text-transparent`}>
          Nível {painLevel}: {currentLevel.label}
        </div>
        <p className="text-text_secondary text-lg italic">
          "{currentLevel.description}"
        </p>
      </motion.div>
      
      {/* Slider interativo com zonas de cor */}
      <div className="relative px-4">
        <div ref={trackRef} className="relative h-8 bg-neutral rounded-full shadow-inner">
          {/* A bolinha com o emoji AGORA é o único elemento arrastável e visível */}
          <motion.div
            className="absolute top-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-4 border-accent transform -translate-y-1/2 flex items-center justify-center cursor-grab" // Removendo -translate-x-1/2
            style={{ x }} // Controla a posição X diretamente com o motion value
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            drag="x"
            dragConstraints={trackRef} // Restrições de arraste na trilha
            dragElastic={0}
            dragMomentum={false}
          >
            <span className="text-sm">{currentLevel.emoji}</span>
          </motion.div>
        </div>
        
        {/* Marcadores nas extremidades */}
        <div className="flex justify-between text-sm text-text_secondary mt-3 px-2">
          <span className="flex items-center gap-1">
            <span>😌</span> Sem dor
          </span>
          <span className="flex items-center gap-1">
            <span>🤕</span> Dor máxima
          </span>
        </div>
      </div>
      
      {/* Contextualização baseada na dor */}
      {painLevel >= 7 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-danger/10 border border-danger p-4 rounded-lg"
        >
          <p className="text-danger font-medium text-center">
            ⚠️ Dor nível {painLevel} indica necessidade de atenção imediata
          </p>
        </motion.div>
      )}
      
      <button
        onClick={() => onAnswer('painLevel', painLevel)}
        className={`w-full bg-accent text-white font-bold py-4 px-8 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105`}
      >
         {currentLevel.label}
      </button>

      <style>{`
        .slider-thumb-hidden::-webkit-slider-thumb {
          appearance: none;
          width: 0;
          height: 0;
          background: transparent;
          border: 0;
        }
        .slider-thumb-hidden::-moz-range-thumb {
          appearance: none;
          width: 0;
          height: 0;
          background: transparent;
          border: 0;
        }
        .slider-thumb-hidden::-ms-thumb {
          appearance: none;
          width: 0;
          height: 0;
          background: transparent;
          border: 0;
        }
      `}</style>
    </div>
  );
};

// Indicadores de Confiança e Segurança
const TrustIndicators: React.FC = () => {
  return (
    <div className="mt-8 space-y-4">
      {/* Selos de segurança */}
      <div className="flex justify-center items-center gap-6 text-sm text-text_secondary">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-success" />
          <span>SSL Seguro</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-accent" />
          <span>CNPJ Verificado</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-accent" />
          <span>15.000+ Clientes</span>
        </div>
      </div>
      
      {/* Indicador de privacidade */}
      <div className="bg-secondary/70 backdrop-blur-sm rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Lock className="w-5 h-5 text-success" />
          <span className="font-medium text-text_primary">Seus dados estão protegidos</span>
        </div>
        <p className="text-text_secondary text-xs">
          Utilizamos criptografia SSL 256-bits e não compartilhamos informações pessoais
        </p>
      </div>
      
      {/* Certificações */}
      <div className="flex justify-center gap-4">
        <div className="bg-secondary/70 px-3 py-2 rounded-lg text-xs text-text_secondary">
          🏥 Método Aprovado por Fisioterapeutas
        </div>
        <div className="bg-secondary/70 px-3 py-2 rounded-lg text-xs text-text_secondary">
          📜 Registro CNPJ: 12.345.678/0001-90
        </div>
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

  // Slider para dor com versão emocional avançada
  if (currentStep.type === 'slider') {
    return (
      <EmotionalPainSlider 
        painLevel={answers.painLevel}
        onChange={(value) => onAnswersChange({ ...answers, painLevel: value })}
        onAnswer={onAnswer}
      />
    );
  }

  // Input de email com integração Supabase
  if (currentStep.type === 'email') {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-accent rounded-full mx-auto mb-6 flex items-center justify-center">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <div className="bg-neutral/20 border border-neutral/50 rounded-lg p-4 mb-6">
            <p className="text-text_primary font-medium text-center">
              🎯 Baseado em suas respostas, você tem <strong>89% de compatibilidade</strong> com nosso método mais eficaz
            </p>
            <div className="text-center mt-3">
              <span className="bg-neutral/30 text-text_secondary px-3 py-1 rounded-full text-sm font-bold">
                ✨ {userScore} pontos na avaliação • Análise personalizada desbloqueada
              </span>
            </div>
          </div>

          {/* Mostrar commitments se existirem */}
          {commitments.length > 0 && (
            <div className="bg-success/10 border border-success text-success p-4 rounded-lg">
              <h4 className="font-bold text-success mb-2">✅ Seus Compromissos:</h4>
              <div className="space-y-1 text-success text-sm">
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
            className={`w-full px-6 py-4 border-2 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none text-lg transition-all bg-secondary/70 text-text_primary ${emailError ? 'border-danger' : 'border-secondary/50'}`}
            disabled={isSubmitting}
          />
          
          {emailError && (
            <div className="text-danger text-sm text-center bg-danger/10 p-3 rounded-lg">
              {emailError}
            </div>
          )}
        </div>

        <button
          onClick={handleEmailSubmit}
          disabled={!answers.email.includes('@') || isSubmitting}
          className="w-full bg-accent hover:bg-accent/90 disabled:bg-neutral/50 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all shadow-lg flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Salvando dados...
            </>
          ) : (
            <>
              Receber Análise Personalizada
              <ChevronRight className="w-6 h-6" />
            </>
          )}
        </button>

        {/* Indicadores de Confiança */}
        <TrustIndicators />
      </div>
    );
  }

  // Opções de resposta
  if (currentStep.options) {
    const handleOptionClick = (value: string) => {
      // Se for previousTreatment, apenas avança normalmente
      onAnswer(currentStep.id, value);
    };

    return (
      <div className="space-y-4">
        {currentStep.options.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => handleOptionClick(option.value)}
            className="w-full flex items-center gap-4 p-4 border-2 border-secondary/50 rounded-xl hover:border-accent hover:bg-accent/10 transition-all group shadow-sm bg-secondary/70 text-text_primary"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="w-12 h-12 rounded-xl bg-neutral/20 group-hover:bg-accent/70 group-hover:text-white flex items-center justify-center text-2xl transition-all flex-shrink-0">
              {option.emoji}
            </div>
            <div className="text-left flex-1">
              <div className="font-bold text-text_primary text-base mb-1">{option.label}</div>
              {option.desc && (
                <div className="text-text_secondary text-sm">{option.desc}</div>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-text_secondary group-hover:text-accent flex-shrink-0" />
          </motion.button>
        ))}
      </div>
    );
  }

  return <div>Carregando...</div>;
};