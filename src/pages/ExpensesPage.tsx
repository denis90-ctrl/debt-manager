import React, { useCallback, useEffect, useState } from 'react';
import { TransactionForm } from '../components/TransactionForm';
import { TransactionList } from '../components/TransactionList';
import { getExpenses, addExpense, deleteExpense } from '../utils/transactions';

const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState(() => getExpenses());

  const refresh = useCallback(() => {
    setExpenses(getExpenses());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="page expenses-page">
      <div className="page-content">
        <TransactionForm type="expenses" onAdd={(name, amount, category) => {
          addExpense({ name, amount, category });
          refresh();
        }} />
        <TransactionList transactions={expenses} type="expenses" onDelete={(id) => {
          deleteExpense(id);
          refresh();
        }} />
      </div>
    </div>
  );
};

export default ExpensesPage;
