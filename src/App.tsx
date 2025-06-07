import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Users, Award, Star, TrendingUp, CheckCircle, Lock } from 'lucide-react';
import { QuizSteps } from './components/QuizSteps';
import { QuizAnalysis } from './components/QuizAnalysis';
import { QuizResults } from './components/QuizResults';
import { LoadingScreen } from './components/LoadingScreen';
import { quizSteps } from './components/QuizData';
import { trackQuizStart, trackQuizProgress, trackQuizComplete, retryPendingEvents, checkPixelStatus, trackPixelEvent } from './lib/pixel';

// Sistema de Gamificação Avançado
interface GamificationState {
  level: number;
  experiencePoints: number;
  badges: string[];
  streak: number;
  milestones: string[];
  powerUps: string[];
}

const GamificationSystem = {
  levels: [
    { level: 1, name: "Iniciante Determinada", minXP: 0, color: "gray" },
    { level: 2, name: "Exploradora Corajosa", minXP: 50, color: "blue" },
    { level: 3, name: "Guerreira em Formação", minXP: 120, color: "purple" },
    { level: 4, name: "Especialista em Autocuidado", minXP: 200, color: "gold" },
    { level: 5, name: "Mestre da Transformação", minXP: 300, color: "diamond" }
  ],
  
  badges: [
    { id: 'first_step', name: '👣 Primeiro Passo', description: 'Iniciou sua jornada', trigger: 'quiz_start' },
    { id: 'pain_warrior', name: '⚔️ Guerreira da Dor', description: 'Enfrentou suas dores', trigger: 'pain_level_high' },
    { id: 'truth_seeker', name: '🔍 Buscadora da Verdade', description: 'Respondeu honestamente', trigger: 'quiz_middle' },
    { id: 'commitment_master', name: '🎯 Mestre do Compromisso', description: 'Comprometeu-se totalmente', trigger: 'all_commitments' },
    { id: 'transformation_ready', name: '🦋 Pronta para Transformar', description: 'Completou toda avaliação', trigger: 'quiz_complete' },
    { id: 'action_taker', name: '⚡ Mulher de Ação', description: 'Investiu na sua saúde', trigger: 'purchase' }
  ],

  calculateLevel: (xp: number) => {
    return [...GamificationSystem.levels].reverse().find(level => xp >= level.minXP) || GamificationSystem.levels[0];
  },

  awardBadge: (badgeId: string, currentBadges: string[]) => {
    if (!currentBadges.includes(badgeId)) {
      const badge = GamificationSystem.badges.find(b => b.id === badgeId);
      if (badge) {
        return [...currentBadges, badgeId];
      }
    }
    return currentBadges;
  }
};

// Componente de Display da Gamificação
const GamificationDisplay: React.FC<{ 
  state: GamificationState; 
  onUpdate: (state: GamificationState) => void;
}> = ({ state }) => {
  const currentLevel = GamificationSystem.calculateLevel(state.experiencePoints);
  const nextLevel = GamificationSystem.levels.find(l => l.level === currentLevel.level + 1);
  const progressToNext = nextLevel ? 
    ((state.experiencePoints - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100 : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-xl mb-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-bold text-lg">{currentLevel.name}</h3>
          <p className="text-purple-100 text-sm">Nível {currentLevel.level}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{state.experiencePoints} XP</div>
          {nextLevel && (
            <div className="text-xs text-purple-200">
              Faltam {nextLevel.minXP - state.experiencePoints} para o próximo nível
            </div>
          )}
        </div>
      </div>
      
      {/* Barra de progresso para próximo nível */}
      {nextLevel && (
        <div className="w-full bg-white/20 rounded-full h-2 mb-3">
          <motion.div
            className="bg-yellow-400 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressToNext}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      )}
      
      {/* Badges conquistados */}
      {state.badges.length > 0 && (
        <div className="flex gap-2 mb-3">
          <span className="text-sm text-purple-200">Conquistas:</span>
          {state.badges.slice(-3).map(badgeId => {
            const badge = GamificationSystem.badges.find(b => b.id === badgeId);
            return badge ? (
              <motion.span
                key={badgeId}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-white/20 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                title={badge.description}
              >
                {badge.name}
              </motion.span>
            ) : null;
          })}
          {state.badges.length > 3 && (
            <span className="text-xs text-purple-200">+{state.badges.length - 3} mais</span>
          )}
        </div>
      )}
    </motion.div>
  );
};

// Barra de Progresso Gamificada
const GamifiedProgress: React.FC<{ currentStep: number; totalSteps: number; userScore: number }> = ({ 
  currentStep, 
  totalSteps, 
  userScore 
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;
  
  const milestones = [
    { step: 2, icon: '🎯', title: 'Perfil Mapeado', xp: 25 },
    { step: 4, icon: '🔍', title: 'Problema Identificado', xp: 50 },
    { step: 6, icon: '📧', title: 'Conectada ao Sistema', xp: 75 },
    { step: 8, icon: '⚡', title: 'Avaliação Completa', xp: 100 },
    { step: 9, icon: '👑', title: 'Método Desbloqueado', xp: 150 }
  ];
  
  return (
    <div className="mb-6">
      {/* Barra de progresso com marcos */}
      <div className="relative">
        <div className="w-full bg-white/10 rounded-full h-4 mb-4 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500 h-4 rounded-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Efeito de brilho */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          </motion.div>
        </div>
        
        {/* Marcos de conquista */}
        <div className="absolute top-0 w-full flex justify-between items-center h-4">
          {milestones.map((milestone, index) => {
            const isCompleted = currentStep >= milestone.step;
            const isActive = currentStep === milestone.step;
            
            return (
              <motion.div
                key={index}
                className={`relative flex flex-col items-center`}
                style={{ left: `${(milestone.step / totalSteps) * 100}%` }}
                initial={{ scale: 0 }}
                animate={{ scale: isCompleted ? 1 : 0.7 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all ${
                  isCompleted 
                    ? 'bg-yellow-400 border-yellow-300 text-gray-800 shadow-lg' 
                    : 'bg-gray-600 border-gray-500 text-gray-300'
                }`}>
                  {milestone.icon}
                </div>
                
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-10 bg-white/90 text-gray-800 px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap shadow-lg"
                  >
                    {milestone.title}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/90 rotate-45" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Status atual */}
      <div className="flex justify-between items-center text-sm text-white/80">
        <span>Passo {currentStep} de {totalSteps}</span>
        <span className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400" />
          {userScore} XP conquistados
        </span>
      </div>
    </div>
  );
};

// Behavioral Tracking System
const BehavioralTracker = {
  data: {
    startTime: Date.now(),
    questionTimes: [] as any[],
    scrollPatterns: [] as any[],
    clickHesitations: [] as any[],
    mouseMovements: [] as any[],
    deviceInfo: {} as any,
    abandonmentPoints: [] as any[]
  },
  
  init: () => {
    BehavioralTracker.trackDeviceInfo();
    BehavioralTracker.trackScrollBehavior();
    BehavioralTracker.trackMouseMovement();
    BehavioralTracker.trackClickHesitations();
  },
  
  trackDeviceInfo: () => {
    BehavioralTracker.data.deviceInfo = {
      screen: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      userAgent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      touchDevice: 'ontouchstart' in window
    };
  },
  
  trackScrollBehavior: () => {
    let lastScrollTime = Date.now();
    let scrollDirection = 'down';
    
    window.addEventListener('scroll', () => {
      const currentTime = Date.now();
      const timeSinceLastScroll = currentTime - lastScrollTime;
      const scrollY = window.scrollY;
      
      BehavioralTracker.data.scrollPatterns.push({
        timestamp: currentTime,
        position: scrollY,
        direction: scrollDirection,
        speed: timeSinceLastScroll,
        percentage: (scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      });
      
      lastScrollTime = currentTime;
    });
  },
  
  trackMouseMovement: () => {
    if (!('ontouchstart' in window)) {
      let mouseData: any[] = [];
      
      document.addEventListener('mousemove', (e) => {
        mouseData.push({
          x: e.clientX,
          y: e.clientY,
          timestamp: Date.now()
        });
        
        if (mouseData.length > 50) {
          mouseData = mouseData.slice(-50);
        }
      });
      
      setInterval(() => {
        if (mouseData.length > 10) {
          const analysis = BehavioralTracker.analyzeMousePattern(mouseData);
          BehavioralTracker.data.mouseMovements.push(analysis);
        }
      }, 5000);
    }
  },
  
  analyzeMousePattern: (data: any[]) => {
    const avgSpeed = data.reduce((acc, curr, i) => {
      if (i === 0) return 0;
      const distance = Math.sqrt(
        Math.pow(curr.x - data[i-1].x, 2) + 
        Math.pow(curr.y - data[i-1].y, 2)
      );
      const time = curr.timestamp - data[i-1].timestamp;
      return acc + (distance / time);
    }, 0) / (data.length - 1);
    
    return {
      timestamp: Date.now(),
      averageSpeed: avgSpeed,
      pattern: avgSpeed > 5 ? 'confident' : avgSpeed > 2 ? 'normal' : 'hesitant',
      coverage: data.length
    };
  },
  
  trackClickHesitations: () => {
    document.addEventListener('mousedown', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const startTime = Date.now();
        
        const handleMouseUp = () => {
          const duration = Date.now() - startTime;
          
          BehavioralTracker.data.clickHesitations.push({
            element: target.textContent || target.className,
            duration: duration,
            timestamp: Date.now(),
            type: duration > 200 ? 'hesitation' : 'confident'
          });
          
          document.removeEventListener('mouseup', handleMouseUp);
        };
        
        document.addEventListener('mouseup', handleMouseUp);
      }
    });
  },
  
  trackQuestionTime: (questionId: string, startTime: number) => {
    const duration = Date.now() - startTime;
    
    BehavioralTracker.data.questionTimes.push({
      questionId,
      duration,
      timestamp: Date.now(),
      pattern: duration > 15000 ? 'slow' : duration > 5000 ? 'normal' : 'fast'
    });
    
    trackPixelEvent('QuestionTiming', {
      content_name: `Pergunta ${questionId}`,
      content_category: 'Question Analytics',
      value: duration,
      custom_parameter_1: duration > 15000 ? 'slow_decision' : 'fast_decision'
    });
  },
  
  getInsights: () => {
    const data = BehavioralTracker.data;
    
    return {
      sessionDuration: Date.now() - data.startTime,
      avgQuestionTime: data.questionTimes.reduce((acc, q) => acc + q.duration, 0) / data.questionTimes.length,
      scrollEngagement: data.scrollPatterns.length > 10 ? 'high' : 'low',
      mouseConfidence: data.mouseMovements.filter(m => m.pattern === 'confident').length / data.mouseMovements.length,
      clickConfidence: data.clickHesitations.filter(c => c.type === 'confident').length / data.clickHesitations.length,
      deviceType: data.deviceInfo.touchDevice ? 'mobile' : 'desktop'
    };
  }
};

// Hook para behavioral tracking
const useBehavioralTracking = () => {
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [insights, setInsights] = useState<any>(null);
  
  useEffect(() => {
    BehavioralTracker.init();
    
    const interval = setInterval(() => {
      setInsights(BehavioralTracker.getInsights());
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  const trackQuestionStart = (questionId: string) => {
    setQuestionStartTime(Date.now());
  };
  
  const trackQuestionEnd = (questionId: string) => {
    BehavioralTracker.trackQuestionTime(questionId, questionStartTime);
  };
  
  return {
    trackQuestionStart,
    trackQuestionEnd,
    insights
  };
};

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [userScore, setUserScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutos
  const [showResults, setShowResults] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [gamificationState, setGamificationState] = useState({
    experiencePoints: 0,
    badges: [] as string[],
    level: 1
  });
  const [recentUsers, setRecentUsers] = useState(Math.floor(Math.random() * 50) + 200); // Contador de usuários simulados

  // Behavioral tracking
  const { trackQuestionStart, trackQuestionEnd, insights } = useBehavioralTracking();

  // Track quiz start and check pixel status
  useEffect(() => {
    checkPixelStatus();
    trackQuizStart();
    retryPendingEvents();
  }, []);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Timer para atualizar usuários online
  useEffect(() => {
    const interval = setInterval(() => {
      const variation = Math.floor(Math.random() * 10) - 5;
      setRecentUsers(prev => Math.max(180, Math.min(280, prev + variation)));
    }, 15000);
    return () => clearInterval(interval);
  }, [recentUsers]);

  // Auto scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackQuestionStart(currentStep.toString());
  }, [currentStep, showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAnswer = (field: string, value: any) => {
    setAnswers((prev: any) => ({ ...prev, [field]: value }));
    
    // Atualizar pontuação
    const newScore = userScore + 10;
    setUserScore(newScore);
    
    // Atualizar gamificação
    setGamificationState(prev => ({
      ...prev,
      experiencePoints: prev.experiencePoints + 10
    }));
    
    // Próxima pergunta
    if (currentStep < quizSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowLoading(true);
      setTimeout(() => {
        setShowLoading(false);
        setShowResults(true);
      }, 5000);
    }
  };

  if (showLoading) {
    return (
      <LoadingScreen 
        userScore={userScore} 
        answers={answers}
        onComplete={() => {}}
        duration={5000}
      />
    );
  }

  if (showResults) {
    return (
      <QuizResults 
        answers={answers} 
        userScore={userScore} 
        timeLeft={timeLeft}
      />
    );
  }

  const currentStepData = quizSteps[currentStep];

  if (!currentStepData) {
    return (
      <LoadingScreen 
        userScore={userScore} 
        answers={answers}
        onComplete={() => {}}
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
      {/* Header simplificado */}
      <div className="bg-gradient-to-r from-slate-800/90 via-blue-800/90 to-slate-700/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-2">
          {/* Nível e XP */}
          <div className="flex items-center justify-between mb-2">
            <div className="text-white">
              <h3 className="font-bold">{GamificationSystem.calculateLevel(gamificationState.experiencePoints).name}</h3>
              <p className="text-sm text-white/80">Nível {GamificationSystem.calculateLevel(gamificationState.experiencePoints).level}</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-yellow-300">{userScore} XP</div>
            </div>
          </div>
          
          {/* Barra de progresso única */}
          <div className="w-full bg-white/10 rounded-full h-2 mb-3">
            <motion.div
              className="bg-yellow-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / 9) * 100}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>

          {/* Status atual */}
          <div className="flex items-center justify-between text-sm text-white/80">
            <span>Pergunta {currentStep + 1} de 9</span>
          </div>

          {/* Timer de urgência */}
          {timeLeft < 300 && (
            <div className="mt-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-300/30 rounded-lg p-2">
              <div className="flex items-center justify-center gap-2 text-red-200 text-sm">
                <Clock className="w-4 h-4 text-red-300" />
                <span>Oferta expira em: <span className="font-bold">{formatTime(timeLeft)}</span></span>
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
            <div className="flex items-center justify-center gap-3 mb-2">
              <Users className="w-5 h-5" />
              <span className="font-medium">{recentUsers + Math.floor(Math.random() * 10)} pessoas fazendo a avaliação agora</span>
            </div>
            {/* Estrelas para credibilidade */}
            <div className="flex items-center justify-center gap-1 text-yellow-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
              <span className="ml-1 font-bold text-white">4.9/5</span>
              <span className="text-white/80">(8.247 avaliações)</span>
            </div>
            
            {/* Fotos de perfil */}
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
            </div>
          </div>
          <div className="text-sm text-white/70">
            💡 Desenvolvido por especialistas em dor e movimento • Resultados cientificamente comprovados
          </div>
        </motion.div>
      </div>

      <style>{`
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