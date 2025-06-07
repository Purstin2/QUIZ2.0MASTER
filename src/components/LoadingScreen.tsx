import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, CheckCircle } from 'lucide-react';

interface LoadingScreenProps {
  userScore: number;
  answers: any;
  onComplete: () => void;
  duration?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  userScore, 
  answers, 
  onComplete, 
  duration = 5000 
}) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          onComplete();
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);
    
    return () => clearInterval(interval);
  }, [duration, onComplete]);
  
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="text-text_primary text-center max-w-lg mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-accent rounded-full mx-auto mb-6 flex items-center justify-center">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Analisando Seu Caso</h2>
          <p className="text-text_secondary text-lg">
            Nossa IA está processando suas respostas para criar o método perfeito para você
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-secondary rounded-2xl p-8 mb-8"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full border-4 border-accent border-t-transparent animate-spin" />
          </div>
          
          <div className="bg-neutral/20 rounded-full h-3 mb-4 overflow-hidden">
            <motion.div
              className="bg-accent h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="text-sm text-text_secondary">
            {Math.round(progress)}% concluído
          </div>
        </motion.div>
        
        <div className="text-sm text-text_secondary">
          ✅ {userScore} pontos analisados • 🔍 {Object.keys(answers).length} parâmetros processados
        </div>
      </div>
    </div>
  );
};