import React from 'react';
import { TransactionForm } from '../components/TransactionForm';
import { TransactionList } from '../components/TransactionList';
import { getIncome, addIncome, deleteIncome } from '../utils/transactions';

const IncomePage: React.FC = () => {
  const income = getIncome();

  return (
    <div className="page income-page">
      <div className="page-content">
        <TransactionForm type="income" onAdd={(name, amount, category) => {
          addIncome({ name, amount, category });
        }} />
        <TransactionList transactions={income} type="income" onDelete={(id) => {
          deleteIncome(id);
        }} />
      </div>
    </div>
  );
};

export default IncomePage;
