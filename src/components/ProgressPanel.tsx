import { useMemo } from 'react';
import { Debt } from '../types/debt';
import { TrendingUp, Zap } from 'lucide-react';

interface ProgressPanelProps {
  debts: Debt[];
}

export const ProgressPanel = ({ debts }: ProgressPanelProps) => {
  if (!Array.isArray(debts)) {
    return (
      <div className="card sticky top-20 h-fit">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          Your progress
        </h2>
        <p className="text-gray-500 text-center py-8">Loading...</p>
      </div>
    );
  }
  
  const { progress } = useMemo(() => {
    const activeDebts = debts.filter(d => d && !d.closedAt);
    const activeAmount = activeDebts.reduce((sum, d) => {
      if (!d) return sum;
      return sum + (Number(d.amount) || 0);
    }, 0);
    const activeInitial = activeDebts.reduce((sum, d) => {
      if (!d) return sum;
      const initial = d.initialAmount !== undefined && d.initialAmount !== null ? d.initialAmount : d.amount;
      return sum + (Number(initial) || 0);
    }, 0);
    const paid = Math.max(0, activeInitial - activeAmount);
    const percent = activeInitial > 0 ? Math.min(100, Math.max(0, (paid / activeInitial) * 100)) : 0;
    return { progress: percent };
  }, [debts]);

  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="card sticky top-20 h-fit">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Zap className="w-6 h-6 text-amber-500" />
        Your progress
      </h2>
      
      <div className="progress-ring relative mx-auto mb-8">
        <svg className="progress-circle w-full h-full transform -rotate-90" viewBox="0 0 320 320">
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          <circle cx="160" cy="160" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="20" />
          <circle
            cx="160"
            cy="160"
            r={radius}
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="20"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-800"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-6xl font-black bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent mb-2">
            {progress.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};
