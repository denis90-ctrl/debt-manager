import { Debt } from '../types/debt';

const STORAGE_KEY = 'debts';

export const getDebts = (): Debt[] => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('localStorage is not available');
      return [];
    }
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const debts: Debt[] = JSON.parse(stored);
    if (!Array.isArray(debts)) return [];
    
    // Миграция: для старых долгов без initialAmount устанавливаем его равным текущему amount
    let needsSave = false;
    const migrated = debts.map(debt => {
      if (!debt || typeof debt !== 'object') return null;
      // Проверяем, что initialAmount отсутствует (undefined или null, но не 0)
      if (debt.initialAmount === undefined || debt.initialAmount === null) {
        needsSave = true;
        return { ...debt, initialAmount: Number(debt.amount) || 0 };
      }
      return debt;
    }).filter(d => d !== null) as Debt[];
    
    // Сохраняем мигрированные данные, если были изменения (только один раз)
    if (needsSave && migrated.length > 0) {
      // Используем прямую запись, чтобы избежать рекурсии
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    }
    return migrated;
  } catch (error) {
    console.error('Error parsing debts from localStorage:', error);
    return [];
  }
};

export const saveDebts = (debts: Debt[]): void => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('localStorage is not available');
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(debts));
  } catch (error) {
    console.error('Error saving debts:', error);
  }
};

export const addDebt = (debt: Omit<Debt, 'id' | 'createdAt' | 'initialAmount'>): Debt => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('localStorage is not available');
      throw new Error('localStorage is not available');
    }
    
    const stored = localStorage.getItem(STORAGE_KEY);
    let debts: Debt[] = [];
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          debts = parsed.filter(d => d && typeof d === 'object');
        }
      } catch (e) {
        console.error('Error parsing debts:', e);
        debts = [];
      }
    }
    
    // НЕ обнуляем прогресс существующих долгов - сохраняем их initialAmount
    // Только убеждаемся, что у всех есть initialAmount
    const updatedDebts = debts.map(d => {
      if (!d || typeof d !== 'object') return null;
      // Если initialAmount отсутствует, устанавливаем его равным текущей сумме
      if (d.initialAmount === undefined || d.initialAmount === null) {
        return { 
          ...d, 
          initialAmount: Number(d.amount) || 0,
          amount: Number(d.amount) || 0
        };
      }
      return d;
    }).filter(d => d !== null) as Debt[];
    
    const newDebt: Debt = {
      name: String(debt.name || ''),
      amount: Number(debt.amount) || 0,
      initialAmount: Number(debt.amount) || 0,
      isOwed: Boolean(debt.isOwed),
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    
    updatedDebts.push(newDebt);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDebts));
    return newDebt;
  } catch (error) {
    console.error('Error adding debt:', error);
    throw error;
  }
};

export const updateDebt = (id: string, updates: Partial<Debt>): void => {
  const debts = getDebts();
  const index = debts.findIndex(d => d.id === id);
  if (index !== -1) {
    const debt = debts[index];
    // Убеждаемся, что initialAmount всегда установлен (только если его нет)
    const initialAmount = updates.initialAmount !== undefined 
      ? updates.initialAmount 
      : (debt.initialAmount !== undefined && debt.initialAmount !== null 
          ? debt.initialAmount 
          : debt.amount);
    debts[index] = { 
      ...debt, 
      ...updates,
      initialAmount: initialAmount
    };
    saveDebts(debts);
  }
};

export const closeDebt = (id: string): void => {
  updateDebt(id, { closedAt: new Date().toISOString() });
};

export const reduceDebtAmount = (id: string, amount: number): void => {
  const debts = getDebts();
  const debt = debts.find(d => d.id === id);
  if (debt) {
    const newAmount = Math.max(0, debt.amount - amount);
    // Убеждаемся, что initialAmount установлен (для старых долгов)
    const initialAmount = debt.initialAmount !== undefined && debt.initialAmount !== null 
      ? debt.initialAmount 
      : debt.amount;
    updateDebt(id, { 
      amount: newAmount,
      initialAmount: initialAmount // сохраняем initialAmount
    });
    if (newAmount === 0) {
      closeDebt(id);
    }
  }
};

export const increaseDebtAmount = (id: string, amount: number): void => {
  const debts = getDebts();
  const debt = debts.find(d => d.id === id);
  if (debt && !debt.closedAt) {
    const newAmount = debt.amount + amount;
    // initialAmount остается прежним - это базовая сумма для расчета прогресса
    // При увеличении долга прогресс автоматически уменьшится
    const initialAmount = debt.initialAmount !== undefined && debt.initialAmount !== null 
      ? debt.initialAmount 
      : debt.amount;
    updateDebt(id, { 
      amount: newAmount,
      initialAmount: initialAmount // сохраняем initialAmount без изменений
    });
  }
};

export const setDebtAmount = (id: string, amount: number): void => {
  const debts = getDebts();
  const index = debts.findIndex(d => d.id === id);
  if (index !== -1) {
    const debt = debts[index];
    const newAmount = Math.max(0, amount);
    // Если initialAmount отсутствует (старые долги), устанавливаем его равным текущей сумме
    const initialAmount = debt.initialAmount || debt.amount;
    debts[index] = {
      ...debt,
      amount: newAmount,
      initialAmount: initialAmount,
      closedAt: newAmount === 0 ? new Date().toISOString() : undefined,
    };
    saveDebts(debts);
  }
};

export const reorderDebts = (debts: Debt[]): void => {
  saveDebts(debts);
};

export const clearAllDebts = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const clearClosedDebtsAndResetProgress = (): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    
    const debts: Debt[] = JSON.parse(stored);
    // Удаляем закрытые долги
    const activeDebts = debts.filter(d => !d.closedAt);
    // Сбрасываем прогресс: устанавливаем initialAmount равным текущей сумме
    const resetDebts = activeDebts.map(debt => ({
      ...debt,
      initialAmount: Number(debt.amount) || 0
    }));
    // Используем прямую запись, чтобы избежать рекурсии
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resetDebts));
  } catch (error) {
    console.error('Error clearing closed debts:', error);
  }
};
