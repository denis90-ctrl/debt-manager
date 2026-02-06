import { useState, useEffect, useMemo } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { getTheme, onThemeChange, showAlert, showConfirm, isTelegramWebApp } from './utils/telegram';

import './App.css';
import useDebts from './hooks/useDebts';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import Home from './pages/Home';
import DebtsPage from './pages/DebtsPage';
import ExpensesPage from './pages/ExpensesPage';
import IncomePage from './pages/IncomePage';

function App() {
  const { debts, loadDebts } = useDebts();
  const [theme, setTheme] = useState<'light' | 'dark'>(getTheme());


  useEffect(() => {
    // Проверяем доступность localStorage
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('localStorage is not available');
      return;
    }

    // Подписка на изменение темы Telegram (только один раз)
    if (isTelegramWebApp()) {
      onThemeChange((newTheme) => {
        setTheme(newTheme);
      });
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    // Применяем тему к body для CSS переменных
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const { totalOwed, totalOwedToMe } = useMemo(() => {
    if (!Array.isArray(debts)) {
      return { totalOwed: 0, totalOwedToMe: 0 };
    }
    const active = debts.filter(d => d && !d.closedAt);
    const owed = active
      .filter(d => d.isOwed)
      .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
    const owedToMe = active
      .filter(d => !d.isOwed)
      .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
    return { totalOwed: owed, totalOwedToMe: owedToMe };
  }, [debts]);

  const currencyFormatter = useMemo(() => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' });
  }, []);


  

  return (
    <ErrorBoundary>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className={`app ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
        <header className="app-header">
        <div className="header-title-pill">
          <h1>Finance department</h1>
        </div>
        <button
          onClick={async () => {
            const confirmed = await showConfirm('Вы уверены? Это действие нельзя отменить.');
            if (!confirmed) return;
            try {
              const { clearAllDebts } = await import('./utils/storage');
              const { clearAllExpenses, clearAllIncome } = await import('./utils/transactions');
              clearAllDebts();
              clearAllExpenses();
              clearAllIncome();
              await loadDebts(true);
            } catch (e) {
              console.error(e);
              showAlert('Не удалось очистить данные.');
            }
          }}
          className="btn-clear"
          type="button"
        >
          Очистить историю
        </button>
        <div className="summary">
          <div className="summary-item">
            <span className="summary-label">Debit</span>
            <span className="summary-value">{currencyFormatter.format(totalOwed)}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Credit</span>
            <span className="summary-value">{currencyFormatter.format(totalOwedToMe)}</span>
          </div>
        </div>
      </header>

      {/* Main Routes */}
      <main className="app-main">
        <div className="app-content-left">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/debts" element={<DebtsPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/income" element={<IncomePage />} />
          </Routes>
        </div>

        <div className="app-content-right">
          {/* Right column remains for context (e.g., additional info or details) */}
          <div className="right-stub">{/* kept for symmetry */}</div>
        </div>
      </main>
      </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
