import { Transaction } from '../types/transaction';

const EXPENSES_KEY = 'expenses';
const INCOME_KEY = 'income';

const hasStorage = () => {
  return typeof window !== 'undefined' && !!window.localStorage;
};

export const getExpenses = (): Transaction[] => {
  try {
    if (!hasStorage()) {
      console.warn('localStorage is not available');
      return [];
    }
    const stored = localStorage.getItem(EXPENSES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting expenses:', error);
    return [];
  }
};

export const getIncome = (): Transaction[] => {
  try {
    if (!hasStorage()) {
      console.warn('localStorage is not available');
      return [];
    }
    const stored = localStorage.getItem(INCOME_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting income:', error);
    return [];
  }
};

export const addExpense = (expense: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
  if (!hasStorage()) {
    console.warn('localStorage is not available');
    return {
      ...expense,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
  }
  const expenses = getExpenses();
  const newExpense: Transaction = {
    ...expense,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  expenses.push(newExpense);
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  return newExpense;
};

export const addIncome = (income: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
  if (!hasStorage()) {
    console.warn('localStorage is not available');
    return {
      ...income,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
  }
  const incomeList = getIncome();
  const newIncome: Transaction = {
    ...income,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  incomeList.push(newIncome);
  localStorage.setItem(INCOME_KEY, JSON.stringify(incomeList));
  return newIncome;
};

export const deleteExpense = (id: string): void => {
  if (!hasStorage()) return;
  const expenses = getExpenses();
  const filtered = expenses.filter(e => e.id !== id);
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(filtered));
};

export const deleteIncome = (id: string): void => {
  if (!hasStorage()) return;
  const incomeList = getIncome();
  const filtered = incomeList.filter(i => i.id !== id);
  localStorage.setItem(INCOME_KEY, JSON.stringify(filtered));
};

export const clearAllExpenses = (): void => {
  if (!hasStorage()) return;
  localStorage.removeItem(EXPENSES_KEY);
};

export const clearAllIncome = (): void => {
  if (!hasStorage()) return;
  localStorage.removeItem(INCOME_KEY);
};
