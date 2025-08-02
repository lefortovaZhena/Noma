import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, Coffee, Soup, Cookie, Flame, Lightbulb, Beef, Wheat, Droplet, ChevronDown } from 'lucide-react';

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

interface OptimizedDailyStatsProps {
  totalCalories: number;
  goalCalories: number;
  meals: Meal[];
  protein: { current: number; goal: number };
  carbs: { current: number; goal: number };
  fats: { current: number; goal: number };
  hasTips: boolean;
  onAddMeal: (mealType: string) => void;
  onViewMeal: (meal: Meal) => void;
  onTipsClick: () => void;
}

export function OptimizedDailyStats({ 
  totalCalories, 
  goalCalories, 
  meals,
  protein,
  carbs,
  fats,
  hasTips,
  onAddMeal,
  onViewMeal,
  onTipsClick
}: OptimizedDailyStatsProps) {
  const [showMealDetails, setShowMealDetails] = useState(false);
  const [expandedMeals, setExpandedMeals] = useState<string[]>([]);
  
  const toggleMealExpansion = (mealId: string) => {
    setExpandedMeals(prev => 
      prev.includes(mealId) 
        ? prev.filter(id => id !== mealId)
        : [...prev, mealId]
    );
  };
  
  const progressPercentage = (totalCalories / goalCalories) * 100;
  const remainingCalories = goalCalories - totalCalories;

  const mealTypes = [
    { id: 'breakfast', name: 'Завтрак', icon: Coffee, color: 'warning-gradient', iconColor: '#F39C12' },
    { id: 'lunch', name: 'Обед', icon: Soup, color: 'success-gradient', iconColor: '#27AE60' },
    { id: 'dinner', name: 'Ужин', icon: Utensils, color: 'info-gradient', iconColor: '#3498DB' },
    { id: 'snack', name: 'Перекус', icon: Cookie, color: 'secondary-gradient', iconColor: '#9B59B6' },
  ];

  const CircularProgress = ({ 
    percentage, 
    size = 120, 
    strokeWidth = 8, 
    color = '#595880',
    children 
  }: {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    children?: React.ReactNode;
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke="rgba(0,0,0,0.08)"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={color}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      </div>
    );
  };

  const MacroCard = ({ 
    label, 
    current, 
    goal, 
    color, 
    bgColor,
    textColor,
    icon: Icon 
  }: {
    label: string;
    current: number;
    goal: number;
    color: string;
    bgColor: string;
    textColor: string;
    icon: any;
  }) => {
    const percentage = Math.min((current / goal) * 100, 100);
    
    return (
      <div className="premium-card p-4">
        <div className="flex flex-col items-center text-center">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mb-2"
            style={{ backgroundColor: bgColor }}
          >
            <Icon className="w-5 h-5 flex-shrink-0" style={{ color: textColor }} />
          </div>
          
          <h4 className="font-semibold text-xs mb-2" style={{ color: textColor }}>{label}</h4>
          
          <div className="mb-2">
            <CircularProgress 
              percentage={percentage} 
              size={56}
              strokeWidth={5}
              color={color}
            >
              <div className="text-center">
                <div className="text-base font-bold" style={{ color: textColor }}>{current}</div>
              </div>
            </CircularProgress>
          </div>
          
          <p className="text-xs text-muted-foreground">
            {current}г из {goal}г
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Главная карточка калорий */}
      <div className="premium-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #595880 0%, #7B7BA8 100%)' }}
            >
              <Flame className="w-6 h-6 text-white flex-shrink-0" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Калории</h3>
              <p className="text-muted-foreground text-sm">
                Сегодня, {new Date().toLocaleDateString('ru-RU', { 
                  day: 'numeric', 
                  month: 'short' 
                })}
              </p>
            </div>
          </div>
          
          {/* Кнопка советов */}
          <button
            onClick={hasTips ? onTipsClick : undefined}
            disabled={!hasTips}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-150 flex-shrink-0 ${
              hasTips 
                ? 'bg-warning text-white tips-bulb has-tips hover:scale-105 active:scale-95 cursor-pointer' 
                : 'bg-section-bg text-muted-foreground opacity-50 cursor-not-allowed'
            }`}
          >
            <Lightbulb className="w-6 h-6 flex-shrink-0" />
          </button>
        </div>

        <div className="flex items-center gap-6">
          <CircularProgress 
            percentage={progressPercentage} 
            color="url(#calorieGradient)"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{remainingCalories > 0 ? remainingCalories : 0}</div>
              <div className="text-xs text-muted-foreground">осталось</div>
            </div>
          </CircularProgress>

          <div className="flex-1">
            <div className="text-3xl font-bold mb-1">{totalCalories}</div>
            <div className="text-muted-foreground mb-4">из {goalCalories} ккал</div>
          </div>
        </div>

        <svg width="0" height="0">
          <defs>
            <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#595880" />
              <stop offset="100%" stopColor="#7B7BA8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* БЖУ блоки */}
      <div className="grid grid-cols-3 gap-4">
        <MacroCard
          label="Белки"
          current={protein.current}
          goal={protein.goal}
          color="var(--macro-protein-text)"
          bgColor="var(--macro-protein)"
          textColor="var(--macro-protein-text)"
          icon={Beef}
        />
        <MacroCard
          label="Углеводы"
          current={carbs.current}
          goal={carbs.goal}
          color="var(--macro-carbs-text)"
          bgColor="var(--macro-carbs)"
          textColor="var(--macro-carbs-text)"
          icon={Wheat}
        />
        <MacroCard
          label="Жиры"
          current={fats.current}
          goal={fats.goal}
          color="var(--macro-fats-text)"
          bgColor="var(--macro-fats)"
          textColor="var(--macro-fats-text)"
          icon={Droplet}
        />
      </div>

      {/* Приемы пищи - только просмотр */}
      <div className="premium-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold">Приемы пищи</h3>
            <p className="text-sm text-muted-foreground">Добавление через бота</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {mealTypes.map((mealType) => {
            const meal = meals.find(m => m.id === mealType.id);
            const isExpanded = expandedMeals.includes(mealType.id);
            
            return (
              <div key={mealType.id} className="section-card p-4">
                <div 
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => toggleMealExpansion(mealType.id)}
                >
                  <div className="w-12 h-12 bg-section-bg/50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-border/30">
                    <mealType.icon className="w-6 h-6 flex-shrink-0" style={{ color: mealType.iconColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-lg">{mealType.name}</div>
                    {meal ? (
                      <div className="text-sm text-muted-foreground">
                        {meal.calories} ккал • {meal.time}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">Не добавлено</div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {meal && (
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{meal.calories}</div>
                        <div className="text-xs text-muted-foreground">ккал</div>
                      </div>
                    )}
                    <motion.div
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-section-bg/30"
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </motion.div>
                  </div>
                </div>

                {/* Раскрывающийся контент */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4">
                        {meal?.dishes && meal.dishes.length > 0 ? (
                          <div className="space-y-2">
                            {meal.dishes.map((dish, index) => (
                              <motion.div
                                key={index}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center justify-between bg-section-bg/30 rounded-xl p-3"
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  {dish.image && (
                                    <img 
                                      src={dish.image} 
                                      alt={dish.name}
                                      className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">{dish.name}</div>
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0 ml-2">
                                  <div className="font-semibold text-sm">{dish.calories}</div>
                                  <div className="text-xs text-muted-foreground">ккал</div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-muted-foreground">
                            <mealType.icon className="w-8 h-8 mx-auto mb-2 opacity-40" style={{ color: mealType.iconColor }} />
                            <p className="text-sm">Блюда не добавлены</p>
                            <p className="text-xs mt-1">Добавьте через бот-помощник</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}