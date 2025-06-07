import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Users } from 'lucide-react';
import { QuizSteps } from './components/QuizSteps';
import { QuizAnalysis } from './components/QuizAnalysis';
import { QuizResults } from './components/QuizResults';
import { LoadingScreen } from './components/LoadingScreen';
import { quizSteps } from './components/QuizData';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [answers, setAnswers] = useState({
    age: null,
    painLevel: 0,
    mainProblem: null,
    duration: null,
    previousTreatment: null,
    email: '',
    timeAvailable: null,
    lifestyle: null,
    investment: null
  });
  const [showResults, setShowResults] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600);
  const [recentUsers] = useState(Math.floor(Math.random() * 50) + 200);

  // Timer para atualizar usuários online
  useEffect(() => {
    const interval = setInterval(() => {
      const variation = Math.floor(Math.random() * 10) - 5; // -5 a +5
      const newCount = Math.max(180, Math.min(280, recentUsers + variation));
      // Simula mudança sutil no número
    }, 15000);
    return () => clearInterval(interval);
  }, [recentUsers]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep, showAnalysis, showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Sistema de gamificação com confetti
  const addPoints = (points: number, achievement?: string) => {
    setUserScore(prev => prev + points);
    if (achievement && !achievements.includes(achievement)) {
      setAchievements(prev => [...prev, achievement]);
      
      setTimeout(() => {
        createConfetti();
      }, 200);
    }
  };

  const createConfetti = () => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      color: string;
    }> = [];
    
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -10,
        size: Math.random() * 8 + 4,
        speed: Math.random() * 3 + 2,
        color: ['#7c3aed', '#a855f7', '#c084fc'][Math.floor(Math.random() * 3)]
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, index) => {
        particle.y += particle.speed;
        particle.x += Math.sin(particle.y * 0.01) * 0.5;
        
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
        
        if (particle.y > canvas.height) {
          particles.splice(index, 1);
        }
      });

      if (particles.length > 0) {
        requestAnimationFrame(animate);
      } else {
        document.body.removeChild(canvas);
      }
    };
    
    animate();
  };

  const handleAnswer = (field: string, value: any) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
    
    // Sistema de pontos progressivo
    const pointsMap: Record<string, number> = {
      age: 15,
      painLevel: 20,
      mainProblem: 25,
      duration: 20,
      previousTreatment: 30,
      email: 35,
      lifestyle: 25,
      timeAvailable: 30,
      investment: 40
    };
    
    const achievementsMap: Record<string, string> = {
      age: '🎯 Perfil Identificado',
      painLevel: '📊 Dor Mapeada', 
      mainProblem: '🔍 Problema Localizado',
      duration: '⏰ Histórico Analisado',
      previousTreatment: '💡 Experiência Avaliada',
      email: '📧 Conectado ao Sistema',
      lifestyle: '🏢 Rotina Mapeada',
      timeAvailable: '⚡ Disponibilidade Configurada',
      investment: '👑 Avaliação Completa'
    };

    addPoints(pointsMap[field], achievementsMap[field]);
    
    // Trigger análise no meio do quiz (após previousTreatment - pergunta 4)
    if (field === 'previousTreatment' && currentStep === 4) {
      setTimeout(() => {
        setShowAnalysis(true);
        runAnalysis();
      }, 300);
    } else if (currentStep === 8) {
      // Última pergunta - vai para loading e depois resultados
      setTimeout(() => {
        setShowLoading(true);
      }, 300);
    } else {
      // Avança para próxima pergunta
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 300);
    }
  };

  const runAnalysis = () => {
    let step = 0;
    const interval = setInterval(() => {
      setAnalysisStep(step);
      step++;
      if (step >= 5) {
        clearInterval(interval);
        setTimeout(() => {
          setShowAnalysis(false);
          setCurrentStep(5); // Vai para o email (índice 5)
        }, 1000);
      }
    }, 1200);
  };

  const handleLoadingComplete = () => {
    setShowLoading(false);
    setShowResults(true);
  };

  if (showLoading) {
    return (
      <LoadingScreen 
        userScore={userScore} 
        onComplete={handleLoadingComplete}
        duration={5000} // 5 segundos
      />
    );
  }

  if (showAnalysis) {
    return <QuizAnalysis answers={answers} analysisStep={analysisStep} userScore={userScore} />;
  }

  if (showResults) {
    return (
      <QuizResults 
        answers={answers} 
        userScore={userScore} 
        timeLeft={timeLeft}
        recentUsers={recentUsers}
      />
    );
  }

  const currentStepData = quizSteps[currentStep];

  if (!currentStepData) {
    // Se não há mais perguntas, mostra loading
    return (
      <LoadingScreen 
        userScore={userScore} 
        onComplete={handleLoadingComplete}
        duration={5000}
      />
    );
  }

  // Array de fotos de perfil para o social proof
  const profilePictures = [
    "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face&auto=format",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face&auto=format",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face&auto=format",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face&auto=format",
    "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=40&h=40&fit=crop&crop=face&auto=format",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face&auto=format",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face&auto=format",
    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=40&h=40&fit=crop&crop=face&auto=format"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header compacto */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Pergunta {currentStep + 1} de 9</div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-purple-600 font-bold">🎯 {userScore} pontos</div>
              <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Plano personalizado
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / 9) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          {timeLeft < 300 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-2 mt-2">
              <div className="flex items-center justify-center gap-2 text-red-700 text-xs">
                <Clock className="w-3 h-3" />
                <span className="font-medium">Oferta expira em: {formatTime(timeLeft)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl p-8 md:p-12"
          >
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {currentStepData.title}
              </h1>
              <p className="text-gray-600 text-lg">{currentStepData.subtitle}</p>
              
              {achievements.length > 0 && (
                <div className="flex justify-center gap-1 mt-6 flex-wrap px-4">
                  {achievements.map((achievement, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium"
                    >
                      {achievement}
                    </motion.span>
                  ))}
                </div>
              )}
            </div>

            <QuizSteps
              currentStep={currentStepData}
              answers={answers}
              onAnswer={handleAnswer}
              onAnswersChange={setAnswers}
              userScore={userScore}
            />
          </motion.div>
        </AnimatePresence>

        {/* Social proof com fotos de perfil */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-white"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-5 h-5" />
              <span className="font-medium">{recentUsers + Math.floor(Math.random() * 10)} pessoas fazendo a avaliação agora</span>
            </div>
            
            {/* Fotos de perfil em vez de estrelas */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="flex -space-x-2">
                {profilePictures.slice(0, 6).map((pic, i) => (
                  <motion.img
                    key={i}
                    src={pic}
                    alt={`Usuária ${i + 1}`}
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  />
                ))}
              </div>
              <span className="ml-3 font-medium">4.9/5 ⭐ (8.247 avaliações)</span>
            </div>
          </div>
          <div className="text-sm text-white/70">
            💡 Desenvolvido por especialistas em dor e movimento • Resultados cientificamente comprovados
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 28px;
          width: 28px;
          border-radius: 50%;
          background: #7c3aed;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(124, 58, 237, 0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 28px;
          width: 28px;
          border-radius: 50%;
          background: #7c3aed;
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 8px rgba(124, 58, 237, 0.3);
        }
      `}</style>
    </div>
  );
}

export default App;