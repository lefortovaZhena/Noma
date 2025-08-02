import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, TrendingUp, TrendingDown, Award, Flame, Beef, Wheat, Droplet, Scale, Zap, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Area, AreaChart, CartesianGrid, ReferenceLine, Cell, LabelList } from 'recharts';

interface StatsPeriod {
  id: 'day' | 'week' | 'weight';
  label: string;
}

interface DayData {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface WeekData {
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

interface PremiumStatisticsProps {
  dailyData: DayData[];
  weeklyData: WeekData[];
  weightData: WeightData[];
}

export function PremiumStatistics({ dailyData, weeklyData, weightData }: PremiumStatisticsProps) {
  const [activePeriod, setActivePeriod] = useState<'day' | 'week' | 'weight'>('week');
  
  const periods: StatsPeriod[] = [
    { id: 'day', label: 'День' },
    { id: 'week', label: 'Неделя' },
    { id: 'weight', label: 'Вес' },
  ];

  const getCurrentData = () => {
    switch (activePeriod) {
      case 'day':
        return dailyData.slice(-1);
      case 'week':
        return weeklyData;
      case 'weight':
        return weightData;
      default:
        return weeklyData;
    }
  };

  const getStatsCards = () => {
    const data = getCurrentData();
    
    switch (activePeriod) {
      case 'day':
        const today = data[0];
        return [
          {
            title: 'Калории',
            value: today?.calories || 0,
            target: 2000,
            unit: 'ккал',
            icon: Flame,
            color: '#595880'
          },
          {
            title: 'Белки',
            value: today?.protein || 0,
            target: 120,
            unit: 'г',
            icon: Beef,
            color: '#B85450'
          },
          {
            title: 'Углеводы',
            value: today?.carbs || 0,
            target: 250,
            unit: 'г',
            icon: Wheat,
            color: '#B8860B'
          },
          {
            title: 'Жиры',
            value: today?.fats || 0,
            target: 70,
            unit: 'г',
            icon: Droplet,
            color: '#0C5460'
          }
        ];
      case 'week':
        const avgProtein = Math.round(weeklyData.reduce((sum, day) => sum + day.protein, 0) / 7);
        const avgCarbs = Math.round(weeklyData.reduce((sum, day) => sum + day.carbs, 0) / 7);
        const avgFats = Math.round(weeklyData.reduce((sum, day) => sum + day.fats, 0) / 7);
        const avgCalories = Math.round(weeklyData.reduce((sum, day) => sum + day.calories, 0) / 7);
        return [
          {
            title: 'Среднее за день',
            value: avgCalories,
            target: 2000,
            unit: 'ккал',
            icon: Flame,
            color: '#595880'
          },
          {
            title: 'Белки в среднем',
            value: avgProtein,
            target: 120,
            unit: 'г',
            icon: Beef,
            color: '#B85450'
          },
          {
            title: 'Углеводы в среднем',
            value: avgCarbs,
            target: 250,
            unit: 'г',
            icon: Wheat,
            color: '#B8860B'
          },
          {
            title: 'Жиры в среднем',
            value: avgFats,
            target: 70,
            unit: 'г',
            icon: Droplet,
            color: '#0C5460'
          }
        ];
      case 'weight':
        const currentWeight = weightData.length > 0 ? weightData[weightData.length - 1].weight : 0;
        const startWeight = weightData.length > 0 ? weightData[0].weight : 0;
        const weeklyChange = weightData.length > 1 ? 
          Math.round((weightData[weightData.length - 1].weight - weightData[weightData.length - 2].weight) * 10) / 10 : 0;
        const totalChange = Math.round((currentWeight - startWeight) * 10) / 10;
        
        // Настройки пользователя (можно вынести в пропсы)
        const targetWeight = 72; // целевой вес
        const weightGoal = 'lose'; // 'lose', 'gain', 'maintain'
        const targetBMI = 21.5; // желаемый ИМТ
        
        // Расчет ИМТ (предполагаем рост 170 см)
        const height = 1.70; // в метрах  
        const bmi = currentWeight > 0 ? Math.round((currentWeight / (height * height)) * 10) / 10 : 0;
        
        // Логика для блока "Вес"
        const weightReachedTarget = Math.abs(currentWeight - targetWeight) <= 0.5;
        const weightColor = weightReachedTarget ? '#27AE60' : '#595880';
        
        // Логика для блока "За неделю"
        let weeklyIcon = TrendingUp;
        let weeklyColor = '#595880';
        let weeklyPrefix = '';
        
        if (weeklyChange < 0) {
          weeklyIcon = TrendingDown;
          weeklyPrefix = '';
          if (weightGoal === 'lose') weeklyColor = '#27AE60';
          else if (weightGoal === 'gain') weeklyColor = '#E74C3C';
          else if (weightGoal === 'maintain') weeklyColor = '#E74C3C';
        } else if (weeklyChange > 0) {
          weeklyIcon = TrendingUp;
          weeklyPrefix = '+';
          if (weightGoal === 'lose') weeklyColor = '#E74C3C';
          else if (weightGoal === 'gain') weeklyColor = '#27AE60';
          else if (weightGoal === 'maintain') weeklyColor = '#E74C3C';
        } else {
          weeklyIcon = TrendingUp;
          weeklyPrefix = '';
          if (weightGoal === 'maintain') weeklyColor = '#27AE60';
          else weeklyColor = '#595880';
        }
        
        // Логика для блока "Общее изменение"
        let totalPrefix = '';
        let totalColor = '#595880';
        if (totalChange < 0) {
          totalPrefix = '';
          if (weightGoal === 'lose') totalColor = '#27AE60';
          else if (weightGoal === 'gain') totalColor = '#E74C3C';
          else totalColor = '#595880';
        } else if (totalChange > 0) {
          totalPrefix = '+';
          if (weightGoal === 'lose') totalColor = '#E74C3C';
          else if (weightGoal === 'gain') totalColor = '#27AE60';
          else totalColor = '#595880';
        }
        
        // Логика для ИМТ
        let bmiColor = '#E74C3C'; // красный для избыточного/низкого
        if (bmi >= 18.5 && bmi <= 24.9) {
          // Нормальный диапазон - желтый
          bmiColor = '#F39C12';
          
          // Если достиг желаемого ИМТ - зеленый
          if (Math.abs(bmi - targetBMI) <= 0.5) {
            bmiColor = '#27AE60';
          }
        }
        
        return [
          {
            title: 'Вес',
            value: currentWeight,
            target: targetWeight,
            unit: 'кг',
            icon: Scale,
            color: weightColor,
            displayValue: `${currentWeight}`,
          },
          {
            title: 'За неделю',
            value: Math.abs(weeklyChange),
            target: 0.5,
            unit: 'кг',
            icon: weeklyIcon,
            color: weeklyColor,
            displayValue: weeklyChange === 0 ? '0.0' : `${weeklyPrefix}${Math.abs(weeklyChange)}`,
          },
          {
            title: 'Общее изменение',
            value: Math.abs(totalChange),
            target: 3,
            unit: 'кг',
            icon: Award,
            color: totalColor,
            displayValue: totalChange === 0 ? '0.0' : `${totalPrefix}${Math.abs(totalChange)}`,
          },
          {
            title: 'ИМТ',
            value: bmi,
            target: targetBMI,
            unit: '',
            icon: Activity,
            color: bmiColor,
            displayValue: `${bmi}`,
          }
        ];
      default:
        return [];
    }
  };

  const renderChart = () => {
    const data = getCurrentData();
    
    switch (activePeriod) {
      case 'day':
        const todayMacros = [
          { name: 'Белки', value: data[0]?.protein || 0, goal: 120, color: '#B85450' },
          { name: 'Жиры', value: data[0]?.fats || 0, goal: 70, color: '#0C5460' },
          { name: 'Углеводы', value: data[0]?.carbs || 0, goal: 250, color: '#B8860B' }
        ];
        
        return (
          <div className="flex justify-center px-4">
            <div className="w-full max-w-sm overflow-y-auto max-h-80 scroll-container">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart 
                  data={todayMacros} 
                  margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid 
                    strokeDasharray="2 4" 
                    stroke="var(--border)" 
                    strokeOpacity={0.3}
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontWeight: 500 }}
                    tickMargin={8}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontWeight: 500 }}
                    domain={[0, 300]}
                    ticks={[0, 50, 100, 150, 200, 250, 300]}
                    width={50}
                    tickFormatter={(value) => `${value}г`}
                    tickMargin={8}
                  />
                  {todayMacros.map((macro, index) => (
                    <ReferenceLine 
                      key={index}
                      y={macro.goal} 
                      stroke={macro.color}
                      strokeDasharray="4 6"
                      strokeOpacity={0.6}
                      strokeWidth={1.5}
                      label={{ 
                        value: `Цель: ${macro.goal}г`, 
                        position: 'right',
                        style: { 
                          fontSize: '10px',
                          fontWeight: '500',
                          fill: macro.color
                        }
                      }}
                    />
                  ))}
                  <Bar 
                    dataKey="value" 
                    radius={[8, 8, 0, 0]}
                  >
                    {todayMacros.map((macro, index) => (
                      <Cell key={`cell-${index}`} fill={macro.color} />
                    ))}
                    <LabelList 
                      dataKey="value" 
                      position="top" 
                      style={{ 
                        fontSize: '12px', 
                        fontWeight: '600',
                        fill: 'var(--foreground)'
                      }}
                      formatter={(value: number) => `${value}г`}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
        
      case 'week':
        const weeklyMacros = [
          { 
            name: 'Белки', 
            value: Math.round(weeklyData.reduce((sum, day) => sum + day.protein, 0) / 7), 
            goal: 120, 
            color: '#B85450' 
          },
          { 
            name: 'Жиры', 
            value: Math.round(weeklyData.reduce((sum, day) => sum + day.fats, 0) / 7), 
            goal: 70, 
            color: '#0C5460' 
          },
          { 
            name: 'Углеводы', 
            value: Math.round(weeklyData.reduce((sum, day) => sum + day.carbs, 0) / 7), 
            goal: 250, 
            color: '#B8860B' 
          }
        ];
        
        return (
          <div className="space-y-8">
            {/* БЖУ диаграмма */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-center">Средние БЖУ за неделю</h4>
              <div className="flex justify-center px-4">
                <div className="w-full max-w-sm overflow-y-auto max-h-80 scroll-container">
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart 
                      data={weeklyMacros} 
                      margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                      barCategoryGap="20%"
                    >
                      <CartesianGrid 
                        strokeDasharray="2 4" 
                        stroke="var(--border)" 
                        strokeOpacity={0.3}
                        horizontal={true}
                        vertical={false}
                      />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontWeight: 500 }}
                        tickMargin={8}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontWeight: 500 }}
                        domain={[0, 300]}
                        ticks={[0, 50, 100, 150, 200, 250, 300]}
                        width={50}
                        tickFormatter={(value) => `${value}г`}
                        tickMargin={8}
                      />
                      {weeklyMacros.map((macro, index) => (
                        <ReferenceLine 
                          key={index}
                          y={macro.goal} 
                          stroke={macro.color}
                          strokeDasharray="4 6"
                          strokeOpacity={0.6}
                          strokeWidth={1.5}
                          label={{ 
                            value: `Цель: ${macro.goal}г`, 
                            position: 'right',
                            style: { 
                              fontSize: '10px',
                              fontWeight: '500',
                              fill: macro.color
                            }
                          }}
                        />
                      ))}
                      <Bar 
                        dataKey="value" 
                        radius={[8, 8, 0, 0]}
                      >
                        {weeklyMacros.map((macro, index) => (
                          <Cell key={`cell-${index}`} fill={macro.color} />
                        ))}
                        <LabelList 
                          dataKey="value" 
                          position="top" 
                          style={{ 
                            fontSize: '12px', 
                            fontWeight: '600',
                            fill: 'var(--foreground)'
                          }}
                          formatter={(value: number) => `${value}г`}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Пунктирные линии показывают дневные цели БЖУ
              </p>
            </div>

            {/* Калории за неделю диаграмма */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-center">Калории за неделю</h4>
              <div className="flex justify-center px-4">
                <div className="w-full max-w-md">
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart 
                      data={weeklyData}
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
                      dataKey="day" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontWeight: 500 }}
                      tickMargin={8}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontWeight: 500 }}
                      domain={[0, 'dataMax + 200']}
                      tickMargin={8}
                      width={50}
                      tickFormatter={(value) => `${value}`}
                    />
                    
                    {/* Элегантная линия цели */}
                    <ReferenceLine 
                      y={2000} 
                      stroke="#27AE60"
                      strokeDasharray="4 6"
                      strokeOpacity={0.6}
                      strokeWidth={1.5}
                      label={{ 
                        value: "Цель", 
                        position: "topRight", 
                        fontSize: 10, 
                        fill: '#27AE60',
                        fontWeight: 500
                      }}
                    />
                    
                    {/* Градиенты для области */}
                    <defs>
                      <linearGradient id="weekGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#595880" stopOpacity={0.4}/>
                        <stop offset="50%" stopColor="#595880" stopOpacity={0.2}/>
                        <stop offset="100%" stopColor="#595880" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    
                    <Area
                      type="monotone"
                      dataKey="calories"
                      stroke="#595880"
                      strokeWidth={2.5}
                      fill="url(#weekGradient)"
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
                          filter: 'drop-shadow(0 4px 8px rgba(89, 88, 128, 0.25))'
                        }
                      }}
                      connectNulls={false}
                    />
                  </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Пунктирная линия показывает дневную цель калорий
              </p>
            </div>
          </div>
        );
        
      case 'weight':
        // Берем только последние 5 записей веса для читаемости дат
        const last5WeightData = weightData.slice(-5);
        
        // Преобразуем данные для равномерного распределения по X (всегда 5 точек)
        const processedWeightData = last5WeightData.map((item, index) => ({
          ...item,
          index: index,
          displayDate: (() => {
            const date = new Date(item.date);
            return `${date.getDate()}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
          })()
        }));
        
        // Определяем диапазон для Y оси с целыми числами
        const weights = last5WeightData.map(d => d.weight);
        const minWeight = Math.min(...weights);
        const maxWeight = Math.max(...weights);
        const yAxisMin = Math.floor(minWeight - 1);
        const yAxisMax = Math.ceil(maxWeight + 1);
        
        // Создаем массив всех целых значений для Y оси
        const integerYTicks = [];
        for (let i = yAxisMin; i <= yAxisMax; i++) {
          integerYTicks.push(i);
        }
        
        // Создаем массив половинных тиков (0.5)
        const halfYTicks = [];
        for (let i = yAxisMin; i < yAxisMax; i++) {
          halfYTicks.push(i + 0.5);
        }
        
        return (
          <div className="flex justify-center px-4">
            <div className="w-full max-w-md">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart 
                  data={processedWeightData}
                  margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                >
                {/* Минималистичная сетка */}
                <CartesianGrid 
                  strokeDasharray="2 4" 
                  stroke="var(--border)" 
                  strokeOpacity={0.3}
                  horizontal={true}
                  vertical={false}
                  horizontalPoints={integerYTicks}
                />
                
                {/* Тонкие линии на половинах без подписей */}
                {halfYTicks.map((y) => (
                  <ReferenceLine 
                    key={`half-${y}`}
                    y={y} 
                    stroke="var(--border)"
                    strokeDasharray="1 3"
                    strokeOpacity={0.2}
                  />
                ))}
                
                <XAxis 
                  dataKey="index"
                  type="number"
                  scale="point"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontWeight: 500 }}
                  ticks={[0, 1, 2, 3, 4]}
                  tickFormatter={(value) => {
                    const item = processedWeightData[value];
                    return item ? item.displayDate : '';
                  }}
                  domain={[0, 4]}
                  tickMargin={8}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontWeight: 500 }}
                  domain={[yAxisMin, yAxisMax]}
                  ticks={integerYTicks}
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
                
                {/* Градиенты для области */}
                <defs>
                  <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#595880" stopOpacity={0.3}/>
                    <stop offset="50%" stopColor="#595880" stopOpacity={0.15}/>
                    <stop offset="100%" stopColor="#595880" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="#595880"
                  strokeWidth={2.5}
                  fill="url(#weightGradient)"
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
                      filter: 'drop-shadow(0 4px 8px rgba(89, 88, 128, 0.25))'
                    }
                  }}
                  connectNulls={false}
                />
              </AreaChart>
            </ResponsiveContainer>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  const statsCards = getStatsCards();

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <motion.div
        className="premium-card p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex bg-section-bg rounded-2xl p-1">
          {periods.map((period) => (
            <motion.button
              key={period.id}
              onClick={() => setActivePeriod(period.id)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activePeriod === period.id
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'text-muted-foreground hover-secondary'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {period.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="premium-card p-4 premium-interaction"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold" style={{ color: stat.color }}>
                {stat.displayValue || stat.value}{stat.unit}
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Цель: {stat.target}{stat.unit}
                </span>
                <span 
                  className="font-semibold"
                  style={{ 
                    color: stat.value >= stat.target ? '#27AE60' : '#F39C12'
                  }}
                >
                  {Math.round((stat.value / stat.target) * 100)}%
                </span>
              </div>
              
              <div className="w-full bg-section-bg rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: stat.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((stat.value / stat.target) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        className="premium-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-xl font-semibold mb-6 text-center">
          {activePeriod === 'day' && 'БЖУ сегодня'}
          {activePeriod === 'week' && 'Статистика за неделю'}
          {activePeriod === 'weight' && 'Динамика веса'}
        </h3>
        
        {renderChart()}
        
        {activePeriod !== 'week' && (
          <div className="text-center mt-4">
            <p className="text-xs text-muted-foreground">
              {activePeriod === 'day' && 'Пунктирные линии показывают дневные цели БЖУ'}
              {activePeriod === 'weight' && 'Зелёная пунктирная линия показывает целевой вес'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}