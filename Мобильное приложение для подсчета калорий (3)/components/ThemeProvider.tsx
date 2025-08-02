import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('light');

  // Загружаем тему из localStorage при инициализации
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme);
    } else {
      // Определяем тему по системным настройкам
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(systemTheme);
    }
  }, []);

  // Применяем тему к документу и сохраняем в localStorage
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Сохраняем в localStorage
    localStorage.setItem('theme', theme);

    // Обновляем цвета Telegram WebApp
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      if (theme === 'dark') {
        // Темная тема - темный фон
        tg.setHeaderColor('#7B7BA8');
        tg.setBackgroundColor('#1A1A1A');
        // Дополнительно можем установить цвет темы
        tg.MainButton.color = '#7B7BA8';
        tg.MainButton.textColor = '#FFFFFF';
      } else {
        // Светлая тема
        tg.setHeaderColor('#595880');
        tg.setBackgroundColor('#F8F9FA');
        tg.MainButton.color = '#595880';
        tg.MainButton.textColor = '#FFFFFF';
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(current => current === 'light' ? 'dark' : 'light');
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}