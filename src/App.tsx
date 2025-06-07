import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizSteps } from './components/QuizSteps';
import { QuizAnalysis } from './components/QuizAnalysis';
import { QuizResults } from './components/QuizResults';
import { LoadingScreen } from './components/LoadingScreen';
import { quizSteps } from './components/QuizData';
import { trackQuizStart, trackQuizProgress, trackQuizComplete, retryPendingEvents, checkPixelStatus, trackPixelEvent } from './lib/pixel';
import confetti from 'canvas-confetti';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [userScore, setUserScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  // Track quiz start and check pixel status
  useEffect(() => {
        checkPixelStatus();
        trackQuizStart();
        retryPendingEvents();
  }, []);

  // Auto scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep, showResults]);

  const handleAnswer = (field: string, value: any) => {
    setAnswers((prev: any) => ({ ...prev, [field]: value }));
    
    // Atualizar pontuação (ainda necessária para QuizResults e LoadingScreen)
    const newScore = userScore + 10;
    setUserScore(newScore);
    
    // Próxima pergunta
    if (currentStep < quizSteps.length - 1) {
      // Disparar confetes roxos
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#9333ea', '#7e22ce', '#6b21a8']
      });
      
      setCurrentStep(prev => prev + 1);
      console.log('Moving to next step:', currentStep + 1);
    } else {
      console.log('Last step reached, showing loading screen...');
      setShowLoading(true);
      setTimeout(() => {
        console.log('Timeout finished, showing results.');
        setShowLoading(false);
        setShowResults(true);
      }, 5000);
    }
  };

  useEffect(() => {
    console.log('App State Changed: currentStep =', currentStep, 'showLoading =', showLoading, 'showResults =', showResults);
  }, [currentStep, showLoading, showResults]);

  if (showLoading) {
    return (
      <LoadingScreen 
        userScore={userScore} 
        answers={answers}
        onComplete={() => {
          console.log('LoadingScreen onComplete called.');
          setShowLoading(false);
          setShowResults(true);
        }}
        duration={5000}
      />
    );
  }

  if (showResults) {
    return (
      <QuizResults 
        answers={answers} 
        userScore={userScore} 
        timeLeft={0} // Tempo restante não é mais exibido
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <motion.div
        key={currentStep + '-header'}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-3xl text-center mb-8 bg-purple-600 rounded-b-xl py-8 shadow-lg text-white"
      >
        <h1 className="text-3xl font-bold mb-3">{quizSteps[currentStep].title}</h1>
        <p className="text-xl text-white/90">{quizSteps[currentStep].subtitle}</p>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 md:p-8"
        >
          <QuizSteps
            currentStep={quizSteps[currentStep]}
            answers={answers}
            onAnswer={handleAnswer}
            onAnswersChange={setAnswers}
            userScore={userScore}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;