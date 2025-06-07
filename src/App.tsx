import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Users, Award, Star, TrendingUp } from 'lucide-react';
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
  const [hasTrackedStart, setHasTrackedStart] = useState(false);

  // Estado da gamificação
  const [gamificationState, setGamificationState] = useState<GamificationState>({
    level: 1,
    experiencePoints: 0,
    badges: [],
    streak: 0,
    milestones: [],
    powerUps: []
  });

  // Behavioral tracking
  const { trackQuestionStart, trackQuestionEnd, insights } = useBehavioralTracking();

  // Track quiz start and check pixel status
  useEffect(() => {
    if (!hasTrackedStart) {
      const timer = setTimeout(() => {
        checkPixelStatus();
        trackQuizStart();
        retryPendingEvents();
        setHasTrackedStart(true);
        
        // Award first badge
        addExperience(25, 'quiz_start');
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [hasTrackedStart]);

  // Timer para atualizar usuários online
  useEffect(() => {
    const interval = setInterval(() => {
      const variation = Math.floor(Math.random() * 10) - 5;
      const newCount = Math.max(180, Math.min(280, recentUsers + variation));
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
    trackQuestionStart(currentStep.toString());
  }, [currentStep, showAnalysis, showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Função para adicionar XP e badges
  const addExperience = (points: number, trigger?: string) => {
    setGamificationState(prev => {
      const newXP = prev.experiencePoints + points;
      const newLevel = GamificationSystem.calculateLevel(newXP);
      let newBadges = [...prev.badges];
      
      // Verifica se ganhou novo badge
      if (trigger) {
        newBadges = GamificationSystem.awardBadge(trigger, newBadges);
      }
      
      // Verifica se subiu de nível
      const leveledUp = newLevel.level > GamificationSystem.calculateLevel(prev.experiencePoints).level;
      if (leveledUp) {
        createLevelUpAnimation();
      }
      
      return {
        ...prev,
        experiencePoints: newXP,
        badges: newBadges
      };
    });
  };

  // Animação de level up
  const createLevelUpAnimation = () => {
    createConfetti();
    
    const notification = document.createElement('div');
    notification.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-xl shadow-2xl z-50 animate-bounce';
    notification.innerHTML = `
      <div class="text-center">
        <div class="text-3xl mb-2">🎉</div>
        <div class="font-bold text-xl">LEVEL UP!</div>
        <div class="text-sm">Você evoluiu de nível!</div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  // Sistema de gamificação com confetti
  const addPoints = (points: number, achievement?: string) => {
    setUserScore(prev => prev + points);
    addExperience(points);
    
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
    
    // Track question end
    trackQuestionEnd(currentStep.toString());
    
    // Track progress
    trackQuizProgress(currentStep + 1, 9);
    
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
    
    // Award badges based on answers
    if (field === 'painLevel' && value >= 7) {
      addExperience(10, 'pain_warrior');
    }
    
    if (currentStep === 4) { // Middle of quiz
      addExperience(15, 'truth_seeker');
    }
    
    // Trigger análise no meio do quiz (após previousTreatment - pergunta 4)
    if (field === 'previousTreatment' && currentStep === 4) {
      setTimeout(() => {
        setShowAnalysis(true);
        runAnalysis();
      }, 300);
    } else if (currentStep === 8) {
      // Última pergunta - vai para loading e depois resultados
      addExperience(25, 'quiz_complete');
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
    // Track quiz completion
    trackQuizComplete(userScore);
  };

  if (showLoading) {
    return (
      <LoadingScreen 
        userScore={userScore} 
        answers={answers}
        onComplete={handleLoadingComplete}
        duration={5000}
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
    return (
      <LoadingScreen 
        userScore={userScore} 
        answers={answers}
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
      {/* Header com gamificação */}
      <div className="bg-gradient-to-r from-slate-800/90 via-blue-800/90 to-slate-700/90 backdrop-blur-sm border-b border-white/10 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Gamification Display */}
          <GamificationDisplay 
            state={gamificationState} 
            onUpdate={setGamificationState}
          />
          
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-white/80">Pergunta {currentStep + 1} de 9</div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-yellow-300 font-bold flex items-center gap-1">
                <span className="text-yellow-400">🎯</span>
                {userScore} pontos
              </div>
              <div className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-400/30">
                Plano personalizado
              </div>
            </div>
          </div>
          
          {/* Barra de progresso com gradiente */}
          <div className="w-full bg-white/10 rounded-full h-3 mb-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500 h-3 rounded-full shadow-lg"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / 9) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          {/* Timer de urgência */}
          {timeLeft < 300 && (
            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-300/30 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 text-red-200 text-sm">
                <Clock className="w-4 h-4 text-red-300" />
                <span className="font-medium">Oferta expira em: <span className="text-red-100 font-bold">{formatTime(timeLeft)}</span></span>
              </div>
            </div>
          )}

          {/* Behavioral insights (debug - remover em produção) */}
          {insights && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mt-3 text-xs text-white/70">
              <div>Sessão: {Math.round(insights.sessionDuration / 1000)}s | Dispositivo: {insights.deviceType}</div>
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