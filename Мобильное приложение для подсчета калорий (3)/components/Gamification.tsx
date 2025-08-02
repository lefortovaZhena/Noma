import { useState } from 'react';
import { Trophy, Star, Target, Flame, Award, Users, Calendar, Gift, Crown, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
  category: 'daily' | 'weekly' | 'monthly' | 'special';
  reward: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  daysLeft: number;
  progress: number;
  maxProgress: number;
  reward: string;
}

interface GamificationProps {
  achievements: Achievement[];
  challenges: Challenge[];
  currentLevel: number;
  currentXP: number;
  nextLevelXP: number;
  streak: number;
  onJoinChallenge: (id: string) => void;
}

export function Gamification({ 
  achievements, 
  challenges, 
  currentLevel, 
  currentXP, 
  nextLevelXP, 
  streak,
  onJoinChallenge 
}: GamificationProps) {
  const [activeTab, setActiveTab] = useState<'achievements' | 'challenges'>('achievements');
  
  const levelProgress = (currentXP / nextLevelXP) * 100;
  const completedAchievements = achievements.filter(a => a.completed).length;
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'daily': return { bg: '#F39C12', text: '#FFFFFF' };
      case 'weekly': return { bg: '#7B7BA8', text: '#FFFFFF' };
      case 'monthly': return { bg: '#595880', text: '#FFFFFF' };
      case 'special': return { bg: '#27AE60', text: '#FFFFFF' };
      default: return { bg: '#E0E0E0', text: '#666666' };
    }
  };
  
  const getCategoryText = (category: string) => {
    switch (category) {
      case 'daily': return 'Ежедневно';
      case 'weekly': return 'Еженедельно';
      case 'monthly': return 'Ежемесячно';
      case 'special': return 'Особые';
      default: return '';
    }
  };

  const mockAchievements = [
    {
      id: '1',
      title: 'Первый шаг',
      description: 'Записать первый прием пищи',
      icon: '🍎',
      progress: 1,
      maxProgress: 1,
      completed: true,
      category: 'daily' as const,
      reward: 50
    },
    {
      id: '2',
      title: 'Неделя контроля',
      description: 'Ведите дневник питания 7 дней подряд',
      icon: '📅',
      progress: 5,
      maxProgress: 7,
      completed: false,
      category: 'weekly' as const,
      reward: 200
    },
    {
      id: '3',
      title: 'Гуру воды',
      description: 'Выпить норму воды 30 дней подряд',
      icon: '💧',
      progress: 12,
      maxProgress: 30,
      completed: false,
      category: 'monthly' as const,
      reward: 500
    }
  ];

  const mockChallenges = [
    {
      id: '1',
      title: 'Январский марафон',
      description: 'Достигните своей цели калорий каждый день января',
      participants: 1247,
      daysLeft: 12,
      progress: 18,
      maxProgress: 31,
      reward: 'Особый значок'
    },
    {
      id: '2',
      title: 'Здоровый завтрак',
      description: 'Завтракайте каждый день в течение недели',
      participants: 523,
      daysLeft: 3,
      progress: 4,
      maxProgress: 7,
      reward: '100 XP'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Блок уровня и статистики */}
      <div className="premium-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
            <Crown className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">Уровень {currentLevel}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {currentXP} / {nextLevelXP} XP до следующего уровня
            </p>
            <div className="w-full bg-section-bg rounded-full h-2">
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              <Flame className="w-4 h-4 text-warning" />
              <span className="text-lg font-bold text-warning">{streak}</span>
            </div>
            <div className="text-xs text-muted-foreground">дней подряд</div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-section-bg/50 rounded-xl">
            <div className="text-2xl font-bold text-primary">{completedAchievements}</div>
            <div className="text-xs text-muted-foreground">Достижения</div>
          </div>
          <div className="text-center p-4 bg-section-bg/50 rounded-xl">
            <div className="text-2xl font-bold text-accent">{currentLevel}</div>
            <div className="text-xs text-muted-foreground">Уровень</div>
          </div>
          <div className="text-center p-4 bg-section-bg/50 rounded-xl">
            <div className="text-2xl font-bold text-success">{currentXP}</div>
            <div className="text-xs text-muted-foreground">Опыт</div>
          </div>
        </div>
      </div>
      
      {/* Навигация по вкладкам */}
      <div className="premium-card p-6">
        <div className="flex bg-section-bg rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'achievements' 
                ? 'bg-primary text-white shadow-lg' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Trophy className="w-4 h-4 inline mr-2" />
            Достижения
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`flex-1 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'challenges' 
                ? 'bg-primary text-white shadow-lg' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Target className="w-4 h-4 inline mr-2" />
            Вызовы
          </button>
        </div>
        
        {activeTab === 'achievements' ? (
          <div className="space-y-4">
            {mockAchievements.map((achievement, index) => {
              const categoryColor = getCategoryColor(achievement.category);
              return (
                <motion.div
                  key={achievement.id}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                    achievement.completed 
                      ? 'border-success/30 bg-success/5' 
                      : 'border-border bg-section-bg/20'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl flex-shrink-0">{achievement.icon}</div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-base leading-tight">{achievement.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {achievement.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <div 
                            className="px-1.5 py-0.5 rounded-md text-xs font-medium whitespace-nowrap"
                            style={{ 
                              backgroundColor: categoryColor.bg,
                              color: categoryColor.text
                            }}
                          >
                            {getCategoryText(achievement.category)}
                          </div>
                          
                          {achievement.completed && (
                            <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center flex-shrink-0">
                              <Award className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Прогресс</span>
                          <span className="font-medium">{achievement.progress} / {achievement.maxProgress}</span>
                        </div>
                        <div className="w-full bg-background rounded-full h-1.5">
                          <motion.div
                            className={`h-1.5 rounded-full ${achievement.completed ? 'bg-success' : 'bg-primary'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-warning flex-shrink-0" />
                            <span className="text-xs text-muted-foreground">
                              +{achievement.reward} XP
                            </span>
                          </div>
                          {achievement.completed && (
                            <div className="flex items-center gap-1 text-success">
                              <Gift className="w-3 h-3 flex-shrink-0" />
                              <span className="text-xs font-medium">Получено</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {mockChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                className="p-4 bg-section-bg/20 rounded-xl border border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">{challenge.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {challenge.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{challenge.participants} участников</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{challenge.daysLeft} дней осталось</span>
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={() => onJoinChallenge(challenge.id)}
                    className="px-4 py-2 bg-primary text-white rounded-xl premium-button flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Zap className="w-4 h-4" />
                    Участвовать
                  </motion.button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Ваш прогресс</span>
                    <span className="font-medium">{challenge.progress} / {challenge.maxProgress}</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <motion.div
                      className="h-2 rounded-full bg-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${(challenge.progress / challenge.maxProgress) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-warning" />
                    <span className="text-sm text-muted-foreground">
                      Награда: {challenge.reward}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}