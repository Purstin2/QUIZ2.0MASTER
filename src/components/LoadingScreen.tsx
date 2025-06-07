import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

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
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-lg mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 bg-purple-600 rounded-b-xl py-8 text-white"
        >
          <div className="w-24 h-24 bg-purple-700 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Gerando Análise Personalizada</h2>
          <p className="text-white/90 text-lg">
            Por favor, aguarde enquanto preparamos seu resultado
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-100 rounded-2xl p-8 mb-8 shadow-lg"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full border-4 border-purple-800 border-t-transparent animate-spin" />
          </div>

          <div className="bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-purple-800 to-purple-900 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="text-sm text-gray-700">
            {Math.round(progress)}% concluído
          </div>
        </motion.div>
      </div>
    </div>
  );
};