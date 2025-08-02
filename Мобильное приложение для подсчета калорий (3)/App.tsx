import { useState, useEffect, useMemo } from 'react';
import { OptimizedCalendar } from './components/OptimizedCalendar';
import { OptimizedDailyStats } from './components/OptimizedDailyStats';
import { OptimizedActivity } from './components/OptimizedActivity';
import { PremiumStatistics } from './components/PremiumStatistics';
import { ProfilePage } from './components/ProfilePage';
import { ThemeProvider } from './components/ThemeProvider';
import { 
  Home, 
  BarChart3, 
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Типы данных
interface Meal {
  id: string;
  name: string;
  calories: number;
  time: string;
  dishes?: Array<{
    name: string;
    calories: number;
    image?: string;
  }>;
}

interface DailyData {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface WeeklyData {
  day: string;
  calories: number;
  goal: number;
  water: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface WeightData {
  date: string;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
}

interface ActivityData {
  id: string;
  type: string;
  duration: number;
  calories: number;
  date: string;
  distance?: number;
}

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hasTips, setHasTips] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  // Константы
  const goalCalories = 2000;
  
  // Моковые данные - оптимизированы с useMemo
  const todayMeals: Meal[] = useMemo(() => [
    { 
      id: 'breakfast', 
      name: 'Овсянка с ягодами', 
      calories: 350, 
      time: '08:30',
      dishes: [
        { name: 'Овсяные хлопья', calories: 150 },
        { name: 'Черника', calories: 85 },
        { name: 'Мед', calories: 65 },
        { name: 'Молоко 1.5%', calories: 50 }
      ]
    },
    { 
      id: 'lunch', 
      name: 'Куриная грудка с овощами', 
      calories: 450, 
      time: '13:15',
      dishes: [
        { name: 'Куриная грудка', calories: 230 },
        { name: 'Рис бурый', calories: 120 },
        { name: 'Овощи гриль', calories: 100 }
      ]
    },
  ], []);
  
  const totalCalories = useMemo(() => 
    todayMeals.reduce((sum, meal) => sum + meal.calories, 0), 
    [todayMeals]
  );
  
  const dailyData: DailyData[] = useMemo(() => [
    { date: '2024-01-15', calories: 1850, protein: 92, carbs: 180, fats: 65 },
    { date: '2024-01-16', calories: 2100, protein: 105, carbs: 210, fats: 78 },
    { date: '2024-01-17', calories: 1920, protein: 88, carbs: 195, fats: 72 },
    { date: '2024-01-18', calories: 1780, protein: 82, carbs: 170, fats: 68 },
    { date: '2024-01-19', calories: totalCalories, protein: 47, carbs: 83, fats: 26 },
  ], [totalCalories]);
  
  const weeklyData: WeeklyData[] = useMemo(() => [
    { day: 'Пн', calories: 1850, goal: 2000, water: 1800, protein: 92, carbs: 180, fats: 65 },
    { day: 'Вт', calories: 2100, goal: 2000, water: 2200, protein: 105, carbs: 210, fats: 78 },
    { day: 'Ср', calories: 1920, goal: 2000, water: 1900, protein: 88, carbs: 195, fats: 72 },
    { day: 'Чт', calories: 1780, goal: 2000, water: 2100, protein: 82, carbs: 170, fats: 68 },
    { day: 'Пт', calories: 2050, goal: 2000, water: 1750, protein: 95, carbs: 205, fats: 75 },
    { day: 'Сб', calories: 1650, goal: 2000, water: 2300, protein: 78, carbs: 158, fats: 62 },
    { day: 'Вс', calories: totalCalories, goal: 2000, water: 2000, protein: 47, carbs: 83, fats: 26 },
  ], [totalCalories]);
  
  const weightData: WeightData[] = useMemo(() => [
    { date: '2024-01-01', weight: 75.5, bodyFat: 18.2, muscleMass: 32.1 },
    { date: '2024-01-08', weight: 75.2, bodyFat: 18.0, muscleMass: 32.3 },
    { date: '2024-01-15', weight: 74.8, bodyFat: 17.8, muscleMass: 32.5 },
    { date: '2024-01-22', weight: 74.5, bodyFat: 17.5, muscleMass: 32.7 },
    { date: '2024-01-29', weight: 74.0, bodyFat: 17.2, muscleMass: 33.0 },
    { date: '2024-02-05', weight: 73.8, bodyFat: 17.0, muscleMass: 33.2 },
    { date: '2024-02-12', weight: 73.5, bodyFat: 16.8, muscleMass: 33.4 },
  ], []);

  const activities: ActivityData[] = useMemo(() => [
    { id: '1', type: 'Бег', duration: 30, calories: 360, date: '2024-01-19' },
    { id: '2', type: 'Йога', duration: 45, calories: 135, date: '2024-01-19' },
    { id: '3', type: 'Ходьба', duration: 60, calories: 240, date: '2024-01-18' },
  ], []);
  
  // Инициализация Telegram WebApp
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
    }
  }, []);
  
  // Перенаправление с недоступных разделов
  useEffect(() => {
    if (activeTab === 'activity') {
      setActiveTab('home');
    }
  }, [activeTab]);
  
  const navigationItems = useMemo(() => [
    { id: 'home', label: 'Главная', icon: Home, disabled: false },
    { id: 'statistics', label: 'Статистика', icon: BarChart3, disabled: false },
    { id: 'activity', label: 'Активность', icon: Activity, disabled: true },
  ], []);
  
  // Обработчики событий
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };
  
  const handleAddMeal = (mealType: string) => {
    console.log('Adding meal:', mealType);
  };
  
  const handleViewMeal = (meal: Meal) => {
    console.log('Viewing meal:', meal);
  };
  
  const handleTipsClick = () => {
    // Советы временно недоступны
    console.log('Tips currently unavailable');
  };
  
  const handleProfileClick = () => {
    setShowProfile(true);
  };
  
  const handleProfileBack = () => {
    setShowProfile(false);
  };
  
  const handleAddActivity = (activity: Omit<ActivityData, 'id'>) => {
    console.log('Adding activity:', activity);
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <OptimizedDailyStats
              totalCalories={totalCalories}
              goalCalories={goalCalories}
              meals={todayMeals}
              protein={{ current: 47, goal: 120 }}
              carbs={{ current: 83, goal: 250 }}
              fats={{ current: 26, goal: 70 }}
              hasTips={hasTips}
              onAddMeal={handleAddMeal}
              onViewMeal={handleViewMeal}
              onTipsClick={handleTipsClick}
            />
          </div>
        );
      case 'statistics':
        return (
          <PremiumStatistics
            dailyData={dailyData}
            weeklyData={weeklyData}
            weightData={weightData}
          />
        );
      case 'activity':
        // Активность временно недоступна - перенаправляем на главную
        setActiveTab('home');
        return null;
      default:
        return null;
    }
  };

  if (showProfile) {
    return (
      <ProfilePage
        onBack={handleProfileBack}
        weightData={weightData}
        achievements={[]}
        challenges={[]}
        onAddWeight={(weight) => console.log('Adding weight:', weight)}
        onJoinChallenge={() => {}}
        onUpdateSettings={() => {}}
        onSendMessage={() => {}}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Календарь */}
      <OptimizedCalendar
        currentDate={selectedDate}
        onDateSelect={handleDateSelect}
        onProfileClick={handleProfileClick}
      />
      
      {/* Основной контент с правильным отступом */}
      <div className="px-4 app-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Исправленная нижняя навигация */}
      <div className="bottom-navigation">
        <div className="nav-container">
          {navigationItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => !item.disabled && setActiveTab(item.id)}
              disabled={item.disabled}
              className={`nav-button ${activeTab === item.id ? 'active' : ''} ${item.disabled ? 'disabled' : ''}`}
              whileHover={!item.disabled ? { scale: 1.02 } : {}}
              whileTap={!item.disabled ? { scale: 0.98 } : {}}
            >
              <item.icon className="nav-button-icon" />
              <span className="nav-button-label">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}