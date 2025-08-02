import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { User } from 'lucide-react';

interface OptimizedCalendarProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  onProfileClick: () => void;
}

export function OptimizedCalendar({ currentDate, onDateSelect, onProfileClick }: OptimizedCalendarProps) {
  const [dragProgress, setDragProgress] = useState(0); // 0 = collapsed, 1 = fully expanded
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const maxDragDistance = 100; // Maximum drag distance for full expansion
  
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  
  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  
  // Текущая дата
  const today = useMemo(() => new Date(), []);
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const getWeekDates = useCallback(() => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [currentDate]);
  
  const getMonthDates = useCallback(() => {
    const dates = [];
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    
    // Находим начало первой недели месяца
    const firstDayOfWeek = firstDay.getDay();
    const daysToAdd = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    startDate.setDate(startDate.getDate() - daysToAdd);
    
    // Собираем недели, которые содержат даты текущего месяца
    const weeks = [];
    let currentWeekStart = new Date(startDate);
    
    while (currentWeekStart <= lastDay) {
      const week = [];
      let hasCurrentMonthDate = false;
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeekStart);
        date.setDate(currentWeekStart.getDate() + i);
        week.push(date);
        
        if (date.getMonth() === currentMonth) {
          hasCurrentMonthDate = true;
        }
      }
      
      // Добавляем неделю только если в ней есть даты текущего мес��ца
      if (hasCurrentMonthDate) {
        weeks.push(week);
      }
      
      // Переходим к следующей неделе
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }
    
    // Объединяем все недели в один массив
    return weeks.flat();
  }, [currentMonth, currentYear]);
  
  const weekDates = useMemo(() => getWeekDates(), [getWeekDates]);
  const monthDates = useMemo(() => getMonthDates(), [getMonthDates]);
  
  const isToday = useCallback((date: Date) => {
    return date.toDateString() === today.toDateString();
  }, [today]);
  
  const isCurrentMonth = useCallback((date: Date) => {
    return date.getMonth() === currentMonth;
  }, [currentMonth]);
  
  const isSelected = useCallback((date: Date) => {
    return date.toDateString() === currentDate.toDateString();
  }, [currentDate]);
  
  // Проверка, является ли дата будущей (более чем на 1 день в будущем)
  const isFutureDate = useCallback((date: Date) => {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return date >= tomorrow;
  }, [today]);
  
  // Проверка, можно ли выбрать дату (все даты можно выбирать)
  const canSelectDate = useCallback((date: Date) => {
    return true;
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    // Поддержка как touch, так и mouse событий
    if ('touches' in e) {
      startYRef.current = e.touches[0].clientY;
    } else {
      startYRef.current = e.clientY;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    
    let currentY: number;
    if ('touches' in e) {
      currentY = e.touches[0].clientY;
    } else {
      currentY = e.clientY;
    }
    
    const deltaY = currentY - startYRef.current;
    
    // Calculate drag progress (0 to 1)
    let newProgress = dragProgress + (deltaY / maxDragDistance);
    newProgress = Math.max(0, Math.min(1, newProgress)); // Clamp between 0 and 1
    
    setDragProgress(newProgress);
    startYRef.current = currentY; // Update start position for smooth dragging
  }, [isDragging, dragProgress, maxDragDistance]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    
    // Smooth snap to nearest state based on drag progress
    setTimeout(() => {
      if (dragProgress < 0.3) {
        setDragProgress(0); // Snap to collapsed
      } else if (dragProgress > 0.7) {
        setDragProgress(1); // Snap to expanded
      }
      // If between 0.3 and 0.7, keep current position for partial expansion
    }, 50); // Small delay to ensure smooth transition
  }, [dragProgress]);

  // Добавляем глобальные обработчики для mouse событий
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        const deltaY = e.clientY - startYRef.current;
        
        // Calculate drag progress (0 to 1)
        let newProgress = dragProgress + (deltaY / maxDragDistance);
        newProgress = Math.max(0, Math.min(1, newProgress)); // Clamp between 0 and 1
        
        setDragProgress(newProgress);
        startYRef.current = e.clientY; // Update start position for smooth dragging
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      
      // Smooth snap to nearest state based on drag progress
      setTimeout(() => {
        if (dragProgress < 0.3) {
          setDragProgress(0); // Snap to collapsed
        } else if (dragProgress > 0.7) {
          setDragProgress(1); // Snap to expanded
        }
        // If between 0.3 and 0.7, keep current position for partial expansion
      }, 50); // Small delay to ensure smooth transition
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragProgress, maxDragDistance]);



  const handleDateSelect = useCallback((date: Date) => {
    onDateSelect(date);
  }, [onDateSelect]);

  // Interpolate between week and month dates based on drag progress
  const displayDates = useMemo(() => {
    if (dragProgress === 0) {
      return weekDates;
    } else if (dragProgress === 1) {
      return monthDates;
    } else {
      // Interpolate: start with week dates and gradually add month dates
      const totalWeekDates = weekDates.length;
      const totalMonthDates = monthDates.length;
      const additionalDates = Math.floor((totalMonthDates - totalWeekDates) * dragProgress);
      
      // Create a smooth transition by adding dates in a logical order
      const weekDateStrings = new Set(weekDates.map(d => d.toDateString()));
      const additionalMonthDates = monthDates
        .filter(d => !weekDateStrings.has(d.toDateString()))
        .slice(0, additionalDates);
        
      return [...weekDates, ...additionalMonthDates];
    }
  }, [weekDates, monthDates, dragProgress]);

  // Динамическая высота календаря с плавной интерполяцией
  const calendarHeight = useMemo(() => {
    const baseHeight = 220;
    const expandedHeight = 180 + (Math.ceil(monthDates.length / 7) * 50);
    return baseHeight + (expandedHeight - baseHeight) * dragProgress;
  }, [dragProgress, monthDates.length]);

  return (
    <div className="mx-4 mt-4 mb-6">
      <div
        ref={containerRef}
        className="calendar-container gpu-accelerated"
        style={{
          height: `${calendarHeight}px`,
          transition: isDragging ? 'none' : 'height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">
              {monthNames[currentMonth]}
            </h2>
            <p className="text-white/70 text-sm">{currentYear}</p>
          </div>
          <button
            onClick={onProfileClick}
            className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95"
          >
            <User className="w-6 h-6 text-white" />
          </button>
        </div>
        
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-3 px-6">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-white/60 py-1">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="px-6 pb-2 overflow-hidden">
          <div 
            className="grid grid-cols-7 gap-2"
            style={{
              transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          >
            {displayDates.map((date, index) => {
              const futureDate = isFutureDate(date);
              const otherMonth = !isCurrentMonth(date) && dragProgress > 0.3;
              const isWeekDate = weekDates.some(wd => wd.toDateString() === date.toDateString());
              
              // Calculate opacity for smooth appearance of additional dates
              let opacity = 1;
              if (!isWeekDate) {
                // This is an additional month date
                const weekDatesCount = weekDates.length;
                const additionalIndex = index - weekDatesCount;
                const maxAdditionalDates = monthDates.length - weekDatesCount;
                const expectedAdditionalDates = Math.floor(maxAdditionalDates * dragProgress);
                
                if (additionalIndex >= expectedAdditionalDates) {
                  opacity = 0;
                } else {
                  // Fade in effect for dates at the edge of the reveal
                  const fadeProgress = (expectedAdditionalDates - additionalIndex) / Math.max(1, expectedAdditionalDates * 0.2);
                  opacity = Math.min(1, fadeProgress);
                }
              }
              
              return (
                <button
                  key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
                  onClick={() => handleDateSelect(date)}
                  className={`
                    calendar-day
                    ${isSelected(date) 
                      ? 'selected' 
                      : isToday(date)
                        ? 'today'
                        : futureDate
                          ? 'future'
                          : otherMonth
                            ? 'other-month'
                            : ''
                    }
                  `}
                  style={{
                    opacity,
                    transform: opacity < 1 ? `scale(${0.8 + opacity * 0.2})` : 'scale(1)',
                    transition: isDragging ? 'none' : 'all 0.2s ease-out'
                  }}
                >
                  {date.getDate()}
                  {isToday(date) && !isSelected(date) && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* iOS-style Drag Handle */}
        <div className="flex flex-col items-center pb-4 pt-2">
          <div
            className="calendar-drag-area-compact"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={(e) => {
              e.preventDefault();
              setIsDragging(true);
              startYRef.current = e.clientY;
            }}
          >
            <div 
              className="calendar-ios-slider"
              style={{
                transform: `scaleY(${1 + dragProgress * 0.5}) scaleX(${1 + dragProgress * 0.2})`,
                background: `rgba(255, 255, 255, ${0.4 + dragProgress * 0.4})`,
                transition: isDragging ? 'none' : 'all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}