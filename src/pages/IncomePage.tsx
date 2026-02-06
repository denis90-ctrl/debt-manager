import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransactionForm } from '../components/TransactionForm';
import { TransactionList } from '../components/TransactionList';
import { getIncome, addIncome, deleteIncome } from '../utils/transactions';

const IncomePage: React.FC = () => {
  const [income, setIncome] = useState(() => getIncome());
  const navigate = useNavigate();

  const refresh = useCallback(() => {
    setIncome(getIncome());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="page income-page">
      <div className="page-content">
        <div className="page-header">
          <button type="button" className="back-button" onClick={() => navigate(-1)}>
            Назад
          </button>
          <div className="page-title">Доходы</div>
        </div>
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
