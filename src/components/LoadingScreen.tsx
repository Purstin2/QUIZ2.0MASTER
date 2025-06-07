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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
      <div className="text-white text-center max-w-lg mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Analisando Seu Caso</h2>
          <p className="text-white/80 text-lg">
            Nossa IA está processando suas respostas para criar o método perfeito para você
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
          </div>
          
          <div className="bg-white/20 rounded-full h-3 mb-4 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="text-sm text-white/80">
            {Math.round(progress)}% concluído
          </div>
        </motion.div>
        
        <div className="text-sm text-white/70">
          ✅ {userScore} pontos analisados • 🔍 {Object.keys(answers).length} parâmetros processados
        </div>
      </div>
    </div>
  );
};