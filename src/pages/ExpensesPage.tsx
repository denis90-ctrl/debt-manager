import React from 'react';
import { TransactionForm } from '../components/TransactionForm';
import { TransactionList } from '../components/TransactionList';
import { getExpenses, addExpense, deleteExpense } from '../utils/transactions';

const ExpensesPage: React.FC = () => {
  const expenses = getExpenses();

  return (
    <div className="page expenses-page">
      <div className="page-content">
        <TransactionForm type="expenses" onAdd={(name, amount, category) => {
          addExpense({ name, amount, category });
        }} />
        <TransactionList transactions={expenses} type="expenses" onDelete={(id) => {
          deleteExpense(id);
        }} />
      </div>
    </div>
  );
};

export default ExpensesPage;
