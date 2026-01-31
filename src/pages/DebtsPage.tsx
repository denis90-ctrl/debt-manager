import React from 'react';
import { AddDebtForm } from '../components/AddDebtForm';
import { DebtList } from '../components/DebtList';
import useDebts from '../hooks/useDebts';

const DebtsPage: React.FC = () => {
  const { debts, loadDebts } = useDebts();

  // The handlers are in App for persistence; keep local placeholders
  return (
    <div className="page debts-page">
      <div className="page-content">
        <AddDebtForm onAdd={async (name, amount, isOwed) => {
          // use existing storage utilities to add and reload
          const { addDebt } = await import('../utils/storage');
          addDebt({ name, amount, isOwed });
          await loadDebts(true);
        }} />
        <DebtList debts={debts} onReduce={async (id, amount) => {
          const { reduceDebtAmount } = await import('../utils/storage');
          reduceDebtAmount(id, amount);
          await loadDebts(true);
        }} onIncrease={async (id, amount) => {
          const { increaseDebtAmount } = await import('../utils/storage');
          increaseDebtAmount(id, amount);
          await loadDebts(true);
        }} onClose={async (id) => {
          const { closeDebt } = await import('../utils/storage');
          closeDebt(id);
          await loadDebts(true);
        }} />
      </div>
    </div>
  );
};

export default DebtsPage;
