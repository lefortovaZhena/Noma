import { useState, useEffect } from 'react';
import { User, ArrowLeft, Weight, Trophy, Settings, Calendar, Zap, Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { WeightTracker } from './WeightTracker';
import { Gamification } from './Gamification';
import { SettingsSupport } from './SettingsSupport';
import { useTheme } from './ThemeProvider';

interface ProfilePageProps {
  onBack: () => void;
  weightData: any[];
  achievements: any[];
  challenges: any[];
  onAddWeight: (weight: number) => void;
  onJoinChallenge: (id: string) => void;
  onUpdateSettings: (settings: any) => void;
  onSendMessage: (message: string) => void;
}

export function ProfilePage({ 
  onBack, 
  weightData, 
  achievements, 
  challenges,
  onAddWeight,
  onJoinChallenge,
  onUpdateSettings,
  onSendMessage
}: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'weight' | 'achievements'>('weight');
  const [showSettings, setShowSettings] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  // Переключение на доступную вкладку, если текущая недоступна
  useEffect(() => {
    const currentTab = tabs.find(tab => tab.id === activeTab);
    if (currentTab?.disabled) {
      const firstAvailableTab = tabs.find(tab => !tab.disabled);
      if (firstAvailableTab) {
        setActiveTab(firstAvailableTab.id as any);
      }
    }
  }, [activeTab]);
  
  const profileData = {
    name: 'Анна Петрова',
    username: 'anna_petrova',
    avatar: null,
    joinDate: '15 января 2024',
    currentWeight: 74.0,
    goalWeight: 70.0,
    height: 170,
    age: 28,
    activityLevel: 'Средняя',
    currentLevel: 5,
    currentXP: 1250,
    nextLevelXP: 1500,
    streak: 7,
    totalDays: 45,
    avgCalories: 1850,
    bmi: 25.6
  };

  const tabs = [
    { id: 'weight', label: 'Вес', icon: Weight, disabled: false },
    { id: 'achievements', label: 'Достижения', icon: Trophy, disabled: true },
  ];





  const renderTabContent = () => {
    switch (activeTab) {
      case 'weight':
        return (
          <WeightTracker
            weightData={weightData}
            onAddWeight={onAddWeight}
          />
        );
      case 'achievements':
        return (
          <Gamification
            achievements={achievements}
            challenges={challenges}
            currentLevel={profileData.currentLevel}
            currentXP={profileData.currentXP}
            nextLevelXP={profileData.nextLevelXP}
            streak={profileData.streak}
            onJoinChallenge={onJoinChallenge}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Элегантный хедер */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between p-4">
          <motion.button
            onClick={onBack}
            className="w-11 h-11 rounded-xl bg-section-bg/50 flex items-center justify-center premium-button flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 flex-shrink-0" />
          </motion.button>
          
          <h1 className="text-xl font-semibold">Профиль</h1>
          
          <motion.button
            onClick={() => setShowSettings(!showSettings)}
            disabled={true}
            className="w-11 h-11 rounded-xl flex items-center justify-center premium-button flex-shrink-0 bg-section-bg/30 opacity-40 cursor-not-allowed"
            whileHover={{}}
            whileTap={{}}
          >
            <Settings className="w-5 h-5 flex-shrink-0 text-muted-foreground/60" />
          </motion.button>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-32">
        {/* Компактная профильная карточка */}
        <motion.div
          className="premium-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-shrink-0">
              {profileData.avatar ? (
                <img 
                  src={profileData.avatar} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-xl object-cover"
                />
              ) : (
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #595880 0%, #7B7BA8 100%)' }}
                >
                  <User className="w-8 h-8 text-white flex-shrink-0" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-lg font-semibold">{profileData.name}</h2>
                <motion.button
                  onClick={toggleTheme}
                  className="w-8 h-8 rounded-lg bg-section-bg/50 flex items-center justify-center flex-shrink-0 hover:bg-section-bg/80 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={theme === 'light' ? 'Переключить на тёмную тему' : 'Переключить на светлую тему'}
                >
                  {theme === 'light' ? (
                    <Moon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <Sun className="w-4 h-4 text-warning flex-shrink-0" />
                  )}
                </motion.button>
              </div>
              <p className="text-muted-foreground text-sm">@{profileData.username}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">{profileData.totalDays} дней</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-warning flex-shrink-0" />
                  <span className="text-xs text-warning font-medium">{profileData.streak} подряд</span>
                </div>
              </div>
            </div>
          </div>


        </motion.div>

        {/* Настройки (показывается при нажатии на иконку) */}
        {showSettings && false && (
          <motion.div
            className="premium-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Настройки</h3>
                <p className="text-sm text-muted-foreground">Персонализация и поддержка</p>
              </div>
            </div>
            <SettingsSupport
              onUpdateSettings={onUpdateSettings}
              onSendMessage={onSendMessage}
            />
          </motion.div>
        )}

        {/* Центрированная навигация по вкладкам */}
        <div className="premium-card p-4">
          <div className="profile-tabs-centered mb-4">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => {
                  if (!tab.disabled) {
                    setActiveTab(tab.id as any);
                    setShowSettings(false);
                  }
                }}
                disabled={tab.disabled}
                className={`profile-tab-centered ${activeTab === tab.id ? 'active' : ''} ${tab.disabled ? 'disabled' : ''}`}
                whileHover={!tab.disabled ? { scale: 1.02 } : {}}
                whileTap={!tab.disabled ? { scale: 0.98 } : {}}
              >
                <tab.icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">{tab.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Контент вкладок */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}