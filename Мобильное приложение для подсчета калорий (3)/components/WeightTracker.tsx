import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { Scale, TrendingUp, TrendingDown, Edit3, Target, Activity, Calendar, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WeightData {
  date: string;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
}

interface WeightTrackerProps {
  weightData: WeightData[];
  onAddWeight: (weight: number) => void;
}

export function WeightTracker({ weightData, onAddWeight }: WeightTrackerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempWeight, setTempWeight] = useState('');
  
  // Моковые данные для демонстрации
  const mockWeightData = weightData.length > 0 ? weightData : [
    { date: '2024-01-01', weight: 75.5, bodyFat: 18.2, muscleMass: 32.1 },
    { date: '2024-01-08', weight: 75.2, bodyFat: 18.0, muscleMass: 32.3 },
    { date: '2024-01-15', weight: 74.8, bodyFat: 17.8, muscleMass: 32.5 },
    { date: '2024-01-22', weight: 74.5, bodyFat: 17.5, muscleMass: 32.7 },
    { date: '2024-01-29', weight: 74.0, bodyFat: 17.2, muscleMass: 33.0 },
  ];
  
  const currentWeight = mockWeightData[mockWeightData.length - 1]?.weight || 0;
  const previousWeight = mockWeightData.length > 1 ? mockWeightData[mockWeightData.length - 2].weight : currentWeight;
  const weightChange = currentWeight - previousWeight;
  const goalWeight = 72;
  
  // Вычисляем ИМТ (рост 170см для демо)
  const height = 1.70;
  const currentBMI = currentWeight / (height * height);
  
  // Определяем категорию ИМТ
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Недовес', color: 'text-warning' };
    if (bmi < 25) return { text: 'Норма', color: 'text-success' };
    if (bmi < 30) return { text: 'Избыток', color: 'text-warning' };
    return { text: 'Ожирение', color: 'text-destructive' };
  };
  
  const bmiCategory = getBMICategory(currentBMI);
  const weightTrend = weightChange > 0.1 ? 'up' : weightChange < -0.1 ? 'down' : 'stable';
  const remainingToGoal = Math.abs(currentWeight - goalWeight);
  const isGoalReached = Math.abs(currentWeight - goalWeight) <= 0.5;
  
  // Обработчики
  const handleEditClick = () => {
    setTempWeight(currentWeight.toString());
    setIsEditing(true);
  };
  
  const handleSave = () => {
    const newWeight = parseFloat(tempWeight);
    if (newWeight && newWeight > 0 && newWeight < 300) {
      onAddWeight(newWeight);
      setIsEditing(false);
      setTempWeight('');
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setTempWeight('');
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="space-y-4">
      {/* Основная карточка веса */}
      <motion.div 
        className="premium-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Scale className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Мой вес</h3>
              <p className="text-sm text-muted-foreground">
                Сегодня, {new Date().toLocaleDateString('ru-RU')}
              </p>
            </div>
          </div>
          
          <motion.button
            onClick={handleEditClick}
            className="w-11 h-11 rounded-2xl bg-section-bg hover:bg-hover flex items-center justify-center transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isEditing}
          >
            <Edit3 className="w-5 h-5 text-primary" />
          </motion.button>
        </div>
        
        {/* Вес и редактирование */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Текущий вес */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="editing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-4"
                >
                  <div className="flex-1">
                    <div className="bg-section-bg/50 rounded-2xl p-4 border-2 border-primary/10 focus-within:border-primary/30 transition-all duration-200">
                      <input
                        type="number"
                        value={tempWeight}
                        onChange={(e) => setTempWeight(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="w-full text-4xl font-bold bg-transparent border-none outline-none text-foreground placeholder-placeholder"
                        placeholder="0.0"
                        step="0.1"
                        min="1"
                        max="300"
                        autoFocus
                      />
                      <span className="text-2xl font-medium text-muted-foreground">кг</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      onClick={handleSave}
                      className="w-12 h-12 rounded-2xl bg-success text-success-foreground flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-success/90"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Check className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      onClick={handleCancel}
                      className="w-12 h-12 rounded-2xl bg-section-bg text-muted-foreground flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-hover"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="display"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-4xl font-bold text-foreground">{currentWeight}</span>
                    <span className="text-2xl font-medium text-muted-foreground">кг</span>
                  </div>
                  
                  {/* Изменение веса */}
                  <div className="flex items-center gap-2">
                    {weightTrend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-warning" />
                    ) : weightTrend === 'down' ? (
                      <TrendingDown className="w-4 h-4 text-success" />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-muted-foreground/20" />
                    )}
                    <span className={`text-sm font-medium ${
                      weightTrend === 'up' ? 'text-warning' : 
                      weightTrend === 'down' ? 'text-success' : 
                      'text-muted-foreground'
                    }`}>
                      {weightChange === 0 ? 'Без изменений' : 
                       `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} кг за неделю`}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Статистика */}
          <div className="space-y-4">
            {/* Цель */}
            <div className="weight-info-block rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className={`w-4 h-4 ${isGoalReached ? 'text-success' : 'text-warning'}`} />
                <span className="text-sm text-muted-foreground">До цели</span>
              </div>
              {isGoalReached ? (
                <div>
                  <div className="text-2xl font-semibold text-success">Достигнута!</div>
                  <div className="text-xs text-success/80 font-medium">Цель: {goalWeight} кг</div>
                </div>
              ) : (
                <div>
                  <div className="text-2xl font-semibold text-foreground">{remainingToGoal.toFixed(1)} кг</div>
                  <div className="text-xs text-muted-foreground">Цель: {goalWeight} кг</div>
                </div>
              )}
            </div>
            
            {/* ИМТ */}
            <div className="weight-info-block rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">ИМТ</span>
              </div>
              <div className="text-2xl font-semibold text-foreground">{currentBMI.toFixed(1)}</div>
              <div className={`text-xs font-medium ${bmiCategory.color}`}>
                {bmiCategory.text}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* График динамики */}
      <motion.div 
        className="premium-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-info" />
          </div>
          <div>
            <h4 className="text-lg font-semibold">Динамика веса</h4>
            <p className="text-sm text-muted-foreground">Последние измерения</p>
          </div>
        </div>
        
        <div className="flex justify-center px-4">
          <div className="w-full max-w-md">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart 
                data={mockWeightData.slice(-5).map((item, index) => ({
                  ...item,
                  index: index,
                  displayDate: (() => {
                    const date = new Date(item.date);
                    return `${date.getDate()}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                  })()
                }))}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                {/* Минималистичная сетка */}
                <CartesianGrid 
                  strokeDasharray="2 4" 
                  stroke="var(--border)" 
                  strokeOpacity={0.3}
                  horizontal={true}
                  vertical={false}
                />
                
                <XAxis 
                  dataKey="index"
                  type="number"
                  scale="point"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontWeight: 500 }}
                  ticks={[0, 1, 2, 3, 4]}
                  tickFormatter={(value) => {
                    const processedData = mockWeightData.slice(-5);
                    const item = processedData[value];
                    if (item) {
                      const date = new Date(item.date);
                      return `${date.getDate()}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                    }
                    return '';
                  }}
                  domain={[0, 4]}
                  tickMargin={8}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontWeight: 500 }}
                  tickFormatter={(value) => `${value}кг`}
                  tickMargin={8}
                  width={45}
                />
                
                {/* Элегантная линия цели */}
                <ReferenceLine 
                  y={72} 
                  stroke="#27AE60"
                  strokeDasharray="4 6"
                  strokeOpacity={0.6}
                  strokeWidth={1.5}
                />
                
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#595880"
                  strokeWidth={2.5}
                  dot={{ 
                    fill: '#FFFFFF', 
                    stroke: '#595880', 
                    strokeWidth: 2.5, 
                    r: 4
                  }}
                  activeDot={{ 
                    r: 6, 
                    stroke: '#595880', 
                    strokeWidth: 3, 
                    fill: '#FFFFFF',
                    style: { 
                      cursor: 'pointer',
                      filter: 'drop-shadow(0 3px 6px rgba(89, 88, 128, 0.2))'
                    }
                  }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Зелёная пунктирная линия показывает целевой вес
          </p>
        </div>
      </motion.div>
    </div>
  );
}