import { Debt } from '../types/debt';

interface ProgressPanelProps {
  debts: Debt[];
}

export const ProgressPanel = ({ debts }: ProgressPanelProps) => {
  if (!Array.isArray(debts)) {
    return (
      <div className="progress-panel">
        <h2>Твой прогресс 🎯</h2>
        <p className="empty">Загрузка...</p>
      </div>
    );
  }
  
  const activeDebts = debts.filter(d => d && !d.closedAt);

  // Используем initialAmount для правильного расчета прогресса
  // initialAmount - это базовая сумма долга для расчета прогресса
  // Для активных долгов: initialAmount - это сумма на момент начала отсчета прогресса
  // Для закрытых долгов: initialAmount - это сумма на момент закрытия (сколько было выплачено)
  
  // Текущая сумма только активных долгов
  const totalActiveAmount = activeDebts.reduce((sum, d) => {
    if (!d) return sum;
    return sum + (Number(d.amount) || 0);
  }, 0);
  
  // Выплачено = изначальная сумма активных долгов - текущая сумма активных долгов
  // Для активных долгов: initialAmount - это базовая сумма, от которой считаем прогресс
  const totalActiveInitial = activeDebts.reduce((sum, d) => {
    if (!d) return sum;
    const initial = d.initialAmount !== undefined && d.initialAmount !== null ? d.initialAmount : d.amount;
    return sum + (Number(initial) || 0);
  }, 0);
  
  const totalPaidAmount = Math.max(0, totalActiveInitial - totalActiveAmount);

  // Прогресс считаем только по активным долгам
  const progress = totalActiveInitial > 0 ? Math.min(100, Math.max(0, (totalPaidAmount / totalActiveInitial) * 100)) : 0;
  const radius = 140; // увеличенный радиус
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
    }).format(amount);
  };

  const getMotivationalMessage = () => {
    if (progress === 0) return { emoji: '💪', text: 'Начни свой путь к свободе!' };
    if (progress < 25) return { emoji: '🌱', text: 'Отличное начало! Продолжай!' };
    if (progress < 50) return { emoji: '🚀', text: 'Ты на правильном пути!' };
    if (progress < 75) return { emoji: '⭐', text: 'Почти на финише!' };
    if (progress < 100) return { emoji: '🎯', text: 'Осталось совсем немного!' };
    return { emoji: '🎉', text: 'Ты свободен! Поздравляем!' };
  };

  const motivation = getMotivationalMessage();

  return (
    <div className="progress-panel">
      <h2>Твой прогресс 🎯</h2>
      <div className="progress-circle-container">
        <svg className="progress-circle" viewBox="0 0 320 320">
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <circle
            className="progress-circle-bg"
            cx="160"
            cy="160"
            r={radius}
            fill="none"
            strokeWidth="20"
          />
          <circle
            className="progress-circle-fill"
            cx="160"
            cy="160"
            r={radius}
            fill="none"
            strokeWidth="20"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            filter={progress > 0 ? "url(#glow)" : undefined}
          />
        </svg>
        <div className="progress-circle-content">
          <div className="progress-emoji">{motivation.emoji}</div>
          <div className="progress-percentage-large">
            {progress.toFixed(1)}%
          </div>
          <div className="progress-label-small">{motivation.text}</div>
        </div>
      </div>
      <div className="progress-info">
        <div className="progress-total">
          <span className="progress-label">Изначальная сумма:</span>
          <span className="progress-value">{formatAmount(totalActiveInitial)}</span>
        </div>
        <div className="progress-closed">
          <span className="progress-label">Выплачено:</span>
          <span className="progress-value">{formatAmount(totalPaidAmount)}</span>
        </div>
        <div className="progress-active">
          <span className="progress-label">Осталось:</span>
          <span className="progress-value">{formatAmount(totalActiveAmount)}</span>
        </div>
      </div>
    </div>
  );
};

