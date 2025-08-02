import { useState } from 'react';
import { Plus, Activity, Clock, Flame, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ActivityData {
  id: string;
  type: string;
  duration: number;
  calories: number;
  date: string;
  distance?: number;
}

interface OptimizedActivityProps {
  activities: ActivityData[];
  dailyGoal: number;
  onAddActivity: (activity: Omit<ActivityData, 'id'>) => void;
}

export function OptimizedActivity({ activities, dailyGoal, onAddActivity }: OptimizedActivityProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newActivity, setNewActivity] = useState({
    type: '',
    duration: 30,
    calories: 0,
    distance: 0
  });

  const todayActivities = activities.filter(a => 
    new Date(a.date).toDateString() === new Date().toDateString()
  );
  
  const totalCalories = todayActivities.reduce((sum, a) => sum + a.calories, 0);
  const progressPercentage = (totalCalories / dailyGoal) * 100;

  const activityTypes = [
    { name: 'Бег', calories: 12 },
    { name: 'Ходьба', calories: 4 },
    { name: 'Велосипед', calories: 8 },
    { name: 'Плавание', calories: 10 },
    { name: 'Йога', calories: 3 },
    { name: 'Силовая', calories: 6 }
  ];

  const handleSubmit = () => {
    if (newActivity.type && newActivity.duration > 0) {
      onAddActivity({
        type: newActivity.type,
        duration: newActivity.duration,
        calories: newActivity.calories,
        date: new Date().toISOString(),
        distance: newActivity.distance || undefined
      });
      setShowAddModal(false);
      setNewActivity({ type: '', duration: 30, calories: 0, distance: 0 });
    }
  };

  const calculateCalories = (type: string, duration: number) => {
    const activityType = activityTypes.find(a => a.name === type);
    return activityType ? activityType.calories * duration : 0;
  };

  return (
    <div className="space-y-6">
      {/* Статистика */}
      <div className="premium-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 success-gradient rounded-2xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Активность</h3>
              <p className="text-muted-foreground text-sm">
                Цель: {dailyGoal} ккал в день
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">{totalCalories} ккал</span>
            <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}%</span>
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill bg-success" 
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Активности за сегодня */}
        <div className="space-y-3">
          {todayActivities.length > 0 ? (
            todayActivities.map((activity) => (
              <div key={activity.id} className="section-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 success-gradient rounded-xl flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{activity.type}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {activity.duration} мин
                        {activity.distance && (
                          <>
                            <MapPin className="w-4 h-4" />
                            {activity.distance} км
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-success">{activity.calories}</div>
                    <div className="text-xs text-muted-foreground">ккал</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Нет активности за сегодня</p>
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно добавления активности */}
      <AnimatePresence>
        {showAddModal && (
          <div className="modal-overlay">
            <motion.div
              className="premium-card p-6 m-4 w-full max-w-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <h3 className="text-xl font-semibold mb-6">Добавить активность</h3>
              
              <div className="space-y-4">
                {/* Тип активности */}
                <div>
                  <label className="block text-sm font-medium mb-2">Тип активности</label>
                  <div className="grid grid-cols-2 gap-2">
                    {activityTypes.map((type) => (
                      <button
                        key={type.name}
                        onClick={() => {
                          setNewActivity(prev => ({
                            ...prev,
                            type: type.name,
                            calories: calculateCalories(type.name, prev.duration)
                          }));
                        }}
                        className={`p-3 rounded-xl text-sm font-medium transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] ${
                          newActivity.type === type.name
                            ? 'bg-primary text-white'
                            : 'bg-section-bg'
                        }`}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Продолжительность */}
                <div>
                  <label className="block text-sm font-medium mb-2">Продолжительность (мин)</label>
                  <input
                    type="number"
                    value={newActivity.duration}
                    onChange={(e) => {
                      const duration = parseInt(e.target.value) || 0;
                      setNewActivity(prev => ({
                        ...prev,
                        duration,
                        calories: calculateCalories(prev.type, duration)
                      }));
                    }}
                    className="w-full p-3 bg-section-bg rounded-xl border-0 outline-none"
                    placeholder="30"
                  />
                </div>

                {/* Калории (автоматически рассчитывается) */}
                <div>
                  <label className="block text-sm font-medium mb-2">Сожжено калорий</label>
                  <div className="p-3 bg-section-bg rounded-xl text-muted-foreground">
                    {newActivity.calories} ккал
                  </div>
                </div>

                {/* Кнопки */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 bg-section-bg rounded-xl transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 py-3 bg-primary text-white rounded-xl transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                    disabled={!newActivity.type || newActivity.duration <= 0}
                  >
                    Добавить
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}