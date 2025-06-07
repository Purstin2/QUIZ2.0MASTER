import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  userScore: number;
  onComplete: () => void;
  duration?: number; // Duration in milliseconds, default 5000
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  userScore, 
  onComplete, 
  duration = 5000 
}) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Processando dados...');

  useEffect(() => {
    // Mensagens que mudam durante o loading
    const messages = [
      'Processando dados...',
      'Analisando seu perfil...',
      'Identificando padrões...',
      'Personalizando método...',
      'Finalizando análise...'
    ];
    
    // Calcula o intervalo baseado na duração desejada
    const totalSteps = 100;
    const intervalTime = duration / totalSteps;
    
    // Atualiza progresso e mensagens
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + 1;
        
        // Muda mensagem baseada no progresso
        if (newProgress >= 80) setLoadingMessage(messages[4]);
        else if (newProgress >= 60) setLoadingMessage(messages[3]);
        else if (newProgress >= 40) setLoadingMessage(messages[2]);
        else if (newProgress >= 20) setLoadingMessage(messages[1]);
        else setLoadingMessage(messages[0]);
        
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          // Pequeno delay antes de chamar onComplete
          setTimeout(() => {
            onComplete();
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, intervalTime);
    
    // Cleanup
    return () => clearInterval(progressInterval);
  }, [duration, onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
      <div className="text-white text-center max-w-md mx-auto px-4">
        <div className="text-2xl font-bold mb-6">Finalizando sua avaliação...</div>
        
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        
        <div className="text-lg mb-4">{loadingMessage}</div>
        
        {/* Barra de progresso */}
        <div className="w-full bg-white/20 rounded-full h-2 mb-4">
          <motion.div 
            className="bg-white rounded-full h-2"
            initial={{ width: 0 }}
            animate={{ width: `${loadingProgress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        
        <div className="text-sm text-white/80">
          {userScore} pontos coletados • {Math.round(loadingProgress)}% concluído
        </div>
      </div>
    </div>
  );
};