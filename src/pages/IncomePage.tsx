import React, { useCallback, useEffect, useState } from 'react';
import { TransactionForm } from '../components/TransactionForm';
import { TransactionList } from '../components/TransactionList';
import { getIncome, addIncome, deleteIncome } from '../utils/transactions';

const IncomePage: React.FC = () => {
  const [income, setIncome] = useState(() => getIncome());

  const refresh = useCallback(() => {
    setIncome(getIncome());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="page income-page">
      <div className="page-content">
        <TransactionForm type="income" onAdd={(name, amount, category) => {
          addIncome({ name, amount, category });
          refresh();
        }} />
        <TransactionList transactions={income} type="income" onDelete={(id) => {
          deleteIncome(id);
          refresh();
        }} />
      </div>
    </div>
  );
};

export default IncomePage;
