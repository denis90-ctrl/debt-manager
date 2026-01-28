import { useState, useEffect } from 'react';
import { DebtList } from './components/DebtList';
import { AddDebtForm } from './components/AddDebtForm';
import { ProgressPanel } from './components/ProgressPanel';
import { Tabs, TabType } from './components/Tabs';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { ErrorBoundary } from './components/ErrorBoundary';
import { getDebts, addDebt, reduceDebtAmount, increaseDebtAmount, closeDebt, clearAllDebts, clearClosedDebtsAndResetProgress } from './utils/storage';
import { getExpenses, getIncome, addExpense, addIncome, deleteExpense, deleteIncome, clearAllExpenses, clearAllIncome } from './utils/transactions';
import { getTheme, onThemeChange, showAlert, showConfirm, isTelegramWebApp, triggerHaptic } from './utils/telegram';
import { Debt } from './types/debt';
import { Transaction } from './types/transaction';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('debts');
  const [debts, setDebts] = useState<Debt[]>([]);
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [income, setIncome] = useState<Transaction[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(getTheme());

  useEffect(() => {
    // Проверяем доступность localStorage
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('localStorage is not available');
      return;
    }

    try {
      const loadedDebts = getDebts();
      const loadedExpenses = getExpenses();
      const loadedIncome = getIncome();
      
      console.log('Loaded data:', { 
        debts: loadedDebts.length, 
        expenses: loadedExpenses.length, 
        income: loadedIncome.length 
      });
      
      setDebts(loadedDebts);
      setExpenses(loadedExpenses);
      setIncome(loadedIncome);
    } catch (error) {
      console.error('Error loading data:', error);
      setDebts([]);
      setExpenses([]);
      setIncome([]);
    }

    // Подписка на изменение темы Telegram
    if (isTelegramWebApp()) {
      onThemeChange((newTheme) => {
        setTheme(newTheme);
        // Применяем тему к body для CSS переменных
        document.body.setAttribute('data-theme', newTheme);
      });
      // Устанавливаем начальную тему
      document.body.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const handleAdd = (name: string, amount: number, isOwed: boolean) => {
    try {
      if (!name || !name.trim() || amount <= 0 || isNaN(amount)) {
        showAlert('Пожалуйста, заполните все поля корректно.');
        return;
      }
      addDebt({ name: name.trim(), amount: Number(amount), isOwed: Boolean(isOwed) });
      // Обновляем состояние сразу после добавления
      const updatedDebts = getDebts();
      console.log('Updated debts after add:', updatedDebts.length);
      if (Array.isArray(updatedDebts)) {
        setDebts(updatedDebts);
        triggerHaptic('success'); // Вибрация при успешном добавлении
      }
    } catch (error) {
      console.error('Error adding debt:', error);
      showAlert('Произошла ошибка при добавлении долга. Попробуйте еще раз.');
      triggerHaptic('error');
    }
  };

  const handleReduce = (id: string, amount: number) => {
    try {
      reduceDebtAmount(id, amount);
      setDebts(getDebts());
      triggerHaptic('light');
    } catch (error) {
      console.error('Error reducing debt:', error);
      showAlert('Произошла ошибка. Попробуйте еще раз.');
    }
  };

  const handleIncrease = (id: string, amount: number) => {
    try {
      increaseDebtAmount(id, amount);
      setDebts(getDebts());
      triggerHaptic('light');
    } catch (error) {
      console.error('Error increasing debt:', error);
      showAlert('Произошла ошибка. Попробуйте еще раз.');
    }
  };

  const handleClose = (id: string) => {
    try {
      closeDebt(id);
      setDebts(getDebts());
      triggerHaptic('medium');
    } catch (error) {
      console.error('Error closing debt:', error);
      showAlert('Произошла ошибка. Попробуйте еще раз.');
    }
  };

  const handleClear = async () => {
    const message = activeTab === 'debts' 
      ? 'Вы уверены, что хотите очистить всю историю долгов?'
      : activeTab === 'expenses'
      ? 'Вы уверены, что хотите очистить всю историю расходов?'
      : 'Вы уверены, что хотите очистить всю историю доходов?';
    
    const confirmed = await showConfirm(message + ' Это действие нельзя отменить.');
    if (confirmed) {
      if (activeTab === 'debts') {
        clearAllDebts();
        setDebts([]);
      } else if (activeTab === 'expenses') {
        clearAllExpenses();
        setExpenses([]);
      } else {
        clearAllIncome();
        setIncome([]);
      }
    }
  };

  const handleClearClosedAndReset = async () => {
    const confirmed = await showConfirm('Очистить историю закрытых долгов и обнулить прогресс? Это действие нельзя отменить.');
    if (confirmed) {
      try {
        clearClosedDebtsAndResetProgress();
        // Небольшая задержка перед обновлением, чтобы избежать проблем с состоянием
        setTimeout(() => {
          setDebts(getDebts());
        }, 100);
      } catch (error) {
        console.error('Error clearing closed debts:', error);
        showAlert('Произошла ошибка при очистке. Попробуйте обновить страницу.');
      }
    }
  };

  const handleAddExpense = (name: string, amount: number, category?: string) => {
    try {
      addExpense({ name, amount, category });
      const updatedExpenses = getExpenses();
      console.log('Updated expenses after add:', updatedExpenses.length);
      setExpenses(updatedExpenses);
    } catch (error) {
      console.error('Error adding expense:', error);
      showAlert('Произошла ошибка при добавлении расхода.');
    }
  };

  const handleAddIncome = (name: string, amount: number, category?: string) => {
    try {
      addIncome({ name, amount, category });
      const updatedIncome = getIncome();
      console.log('Updated income after add:', updatedIncome.length);
      setIncome(updatedIncome);
    } catch (error) {
      console.error('Error adding income:', error);
      showAlert('Произошла ошибка при добавлении дохода.');
    }
  };

  const handleDeleteExpense = (id: string) => {
    deleteExpense(id);
    setExpenses(getExpenses());
  };

  const handleDeleteIncome = (id: string) => {
    deleteIncome(id);
    setIncome(getIncome());
  };

  const totalOwed = Array.isArray(debts)
    ? debts.filter(d => d && !d.closedAt && d.isOwed).reduce((sum, d) => sum + (Number(d.amount) || 0), 0)
    : 0;
  
  const totalOwedToMe = Array.isArray(debts)
    ? debts.filter(d => d && !d.closedAt && !d.isOwed).reduce((sum, d) => sum + (Number(d.amount) || 0), 0)
    : 0;

  const hasClosedDebts = Array.isArray(debts) && debts.some(d => d && d && d.closedAt);
  const hasDebts = Array.isArray(debts) && debts.length > 0;
  const hasExpenses = Array.isArray(expenses) && expenses.length > 0;
  const hasIncome = Array.isArray(income) && income.length > 0;
  
  const hasData = activeTab === 'debts' 
    ? hasDebts
    : activeTab === 'expenses'
    ? hasExpenses
    : hasIncome;

  return (
    <ErrorBoundary>
      <div className={`app ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
        <header className="app-header">
        <div className="header-top">
          <h1>Управление финансами</h1>
          <div className="header-buttons">
            {(() => {
              try {
                if (activeTab === 'debts' && hasClosedDebts) {
                  return (
                    <button 
                      onClick={handleClearClosedAndReset} 
                      className="btn-clear-secondary"
                      type="button"
                    >
                      Очистить закрытые и обнулить прогресс
                    </button>
                  );
                }
                return null;
              } catch (e) {
                console.error('Error rendering clear closed button:', e);
                return null;
              }
            })()}
            {(() => {
              try {
                if (hasData) {
                  return (
                    <button 
                      onClick={handleClear} 
                      className="btn-clear"
                      type="button"
                    >
                      Очистить историю
                    </button>
                  );
                }
                return null;
              } catch (e) {
                console.error('Error rendering clear button:', e);
                return null;
              }
            })()}
          </div>
        </div>
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="summary">
          <div className="summary-item owed">
            Я должен: {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(totalOwed)}
          </div>
          <div className="summary-item owed-to-me">
            Мне должны: {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(totalOwedToMe)}
          </div>
          <div className="summary-item balance">
            Баланс: {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(totalOwedToMe - totalOwed)}
          </div>
        </div>
      </header>
      <main className="app-main">
        <ProgressPanel debts={debts} />
        <div className="app-content-right">
          {activeTab === 'debts' && (
            <>
              <AddDebtForm onAdd={handleAdd} />
              <DebtList debts={debts} onReduce={handleReduce} onIncrease={handleIncrease} onClose={handleClose} />
            </>
          )}
          {activeTab === 'expenses' && (
            <>
              <TransactionForm type="expenses" onAdd={handleAddExpense} />
              <TransactionList transactions={expenses} type="expenses" onDelete={handleDeleteExpense} />
            </>
          )}
          {activeTab === 'income' && (
            <>
              <TransactionForm type="income" onAdd={handleAddIncome} />
              <TransactionList transactions={income} type="income" onDelete={handleDeleteIncome} />
            </>
          )}
        </div>
      </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;

