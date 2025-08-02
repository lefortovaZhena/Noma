import { useState } from 'react';
import { HelpCircle, MessageCircle, Bell, Palette, ChevronRight, Settings, Info, Users, Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from './ThemeProvider';

interface SettingsSupportProps {
  onUpdateSettings: (settings: any) => void;
  onSendMessage: (message: string) => void;
}

export function SettingsSupport({ onUpdateSettings, onSendMessage }: SettingsSupportProps) {
  const [showFAQ, setShowFAQ] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  const settingsGroups = [
    {
      title: 'Уведомления',
      icon: Bell,
      items: [
        { 
          id: 'push', 
          label: 'Push-уведомления', 
          description: 'Напоминания о еде и воде',
          action: () => {
            console.log('Toggle push notifications');
            onUpdateSettings({ pushNotifications: true });
          }
        },
        { 
          id: 'achievements', 
          label: 'Достижения', 
          description: 'Уведомления о новых достижениях',
          action: () => {
            console.log('Toggle achievement notifications');
            onUpdateSettings({ achievementNotifications: true });
          }
        },
      ]
    },
    {
      title: 'Интерфейс',
      icon: Palette,
      items: [
        { 
          id: 'theme', 
          label: 'Тема оформления', 
          description: theme === 'dark' ? 'Темная тема' : 'Светлая тема',
          isThemeToggle: true,
          action: toggleTheme
        },
        { 
          id: 'language', 
          label: 'Язык', 
          description: 'Русский',
          action: () => {
            console.log('Open language settings');
            onUpdateSettings({ language: 'ru' });
          }
        },
      ]
    }
  ];
  
  const faqItems = [
    {
      question: 'Как точно подсчитываются калории?',
      answer: 'Мы используем обширную базу данных продуктов и ИИ для анализа фотографий. Все данные регулярно обновляются для максимальной точности.'
    },
    {
      question: 'Как изменить цель по калориям?',
      answer: 'Перейдите в раздел профиля и настройте свои параметры. Система автоматически рассчитает рекомендуемую норму.'
    },
    {
      question: 'Что делать, если приложение работает медленно?',
      answer: 'Попробуйте перезапустить приложение или обратиться в поддержку через Telegram.'
    },
    {
      question: 'Как синхронизировать данные?',
      answer: 'Все данные автоматически сохраняются в вашем Telegram аккаунте. Дополнительная синхронизация не требуется.'
    }
  ];

  const handleSettingClick = (item: any) => {
    if (item.action) {
      item.action();
    }
  };

  const handleSupportMessage = (type: string) => {
    const messages = {
      channel: 'Переход к каналу новостей @calorie_news',
      support: 'Переход к боту поддержки @support_bot'
    };
    onSendMessage(messages[type] || 'Обращение в поддержку');
  };

  return (
    <div className="space-y-6">
      {/* Блок настроек */}
      <div className="premium-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Settings className="w-6 h-6 text-primary flex-shrink-0" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Настройки</h3>
            <p className="text-sm text-muted-foreground">Персонализация приложения</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {settingsGroups.map((group, groupIndex) => (
            <div key={group.title} className="section-card p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <group.icon className="w-4 h-4 text-primary flex-shrink-0" />
                </div>
                <h4 className="font-semibold">{group.title}</h4>
              </div>
              
              <div className="space-y-2">
                {group.items.map((item, itemIndex) => (
                  <button
                    key={item.id}
                    onClick={() => handleSettingClick(item)}
                    className="w-full flex items-center justify-between p-3 bg-card rounded-xl transition-all duration-150 hover:scale-[1.01] active:scale-[0.99] text-left"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                    {item.isThemeToggle ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          className="w-12 h-6 rounded-full p-1 flex items-center"
                          animate={{ 
                            backgroundColor: theme === 'dark' ? '#595880' : '#E8E5F3' 
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.div
                            className="w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-sm"
                            animate={{ x: theme === 'dark' ? 20 : 0 }}
                            transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 30 }}
                          >
                            {theme === 'dark' ? (
                              <Moon className="w-2.5 h-2.5 text-primary" />
                            ) : (
                              <Sun className="w-2.5 h-2.5 text-warning" />
                            )}
                          </motion.div>
                        </motion.div>
                      </div>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Блок поддержки */}
      <div className="premium-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
            <Info className="w-6 h-6 text-info flex-shrink-0" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Поддержка</h3>
            <p className="text-sm text-muted-foreground">Помощь и контакты</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="section-card p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-warning flex-shrink-0" />
              </div>
              <h4 className="font-semibold">Часто задаваемые вопросы</h4>
            </div>
            <button
              onClick={() => setShowFAQ(!showFAQ)}
              className="text-sm text-primary font-medium transition-all duration-150 hover:scale-105 active:scale-95 px-3 py-1 rounded-lg"
            >
              {showFAQ ? 'Скрыть' : 'Показать'}
            </button>
          </div>
          
          {showFAQ && (
            <div className="space-y-3">
              {faqItems.map((faq, index) => (
                <div
                  key={index}
                  className="p-3 bg-card rounded-xl"
                >
                  <h5 className="font-medium text-sm mb-2">{faq.question}</h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Контакты */}
        <div className="section-card p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-success flex-shrink-0" />
            </div>
            <h4 className="font-semibold">Контакты</h4>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => handleSupportMessage('channel')}
              className="w-full flex items-center gap-3 p-3 bg-card rounded-xl transition-all duration-150 hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-primary flex-shrink-0" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-sm">Telegram канал</div>
                <div className="text-xs text-muted-foreground">@calorie_news - новости и обновления</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </button>
            
            <button
              onClick={() => handleSupportMessage('support')}
              className="w-full flex items-center gap-3 p-3 bg-card rounded-xl transition-all duration-150 hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-accent flex-shrink-0" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-sm">Техническая поддержка</div>
                <div className="text-xs text-muted-foreground">@support_bot - помощь и вопросы</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}