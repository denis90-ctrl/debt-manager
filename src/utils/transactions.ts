import { Transaction } from '../types/transaction';

const EXPENSES_KEY = 'expenses';
const INCOME_KEY = 'income';

export const getExpenses = (): Transaction[] => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
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
    if (typeof window === 'undefined' || !window.localStorage) {
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
  const expenses = getExpenses();
  const filtered = expenses.filter(e => e.id !== id);
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(filtered));
};

export const deleteIncome = (id: string): void => {
  const incomeList = getIncome();
  const filtered = incomeList.filter(i => i.id !== id);
  localStorage.setItem(INCOME_KEY, JSON.stringify(filtered));
};

export const clearAllExpenses = (): void => {
  localStorage.removeItem(EXPENSES_KEY);
};

export const clearAllIncome = (): void => {
  localStorage.removeItem(INCOME_KEY);
};

