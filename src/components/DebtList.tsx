import { useState } from 'react';
import { Debt } from '../types/debt';

interface DebtListProps {
  debts: Debt[];
  onReduce: (id: string, amount: number) => void;
  onIncrease: (id: string, amount: number) => void;
  onClose: (id: string) => void;
}

interface DebtItemProps {
  debt: Debt;
  onReduce: (id: string, amount: number) => void;
  onIncrease: (id: string, amount: number) => void;
  onClose: (id: string) => void;
}

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU');
};

const DebtItem = ({ debt, onReduce, onIncrease, onClose }: DebtItemProps) => {
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState<'reduce' | 'increase'>('reduce');

  const handleAction = () => {
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      if (action === 'reduce' && numAmount <= debt.amount) {
        onReduce(debt.id, numAmount);
      } else if (action === 'increase') {
        onIncrease(debt.id, numAmount);
      }
      setAmount('');
    }
  };

  return (
    <div className={`debt-item ${debt.closedAt ? 'closed' : ''}`}>
      <div className="debt-info">
        <div className="debt-name">{debt.name}</div>
        <div className={`debt-amount ${debt.isOwed ? 'owed' : 'owed-to-me'}`}>
          {debt.isOwed ? 'Я должен' : 'Мне должны'}: {formatAmount(debt.amount)}
        </div>
        <div className="debt-date">Создан: {formatDate(debt.createdAt)}</div>
        {debt.closedAt && (
          <div className="debt-closed">Закрыт: {formatDate(debt.closedAt)}</div>
        )}
      </div>
      {!debt.closedAt && (
        <div className="debt-actions">
          <div className="amount-control">
            <div className="action-toggle">
              <button
                type="button"
                className={`toggle-btn ${action === 'reduce' ? 'active' : ''}`}
                onClick={() => setAction('reduce')}
              >
                Уменьшить
              </button>
              <button
                type="button"
                className={`toggle-btn ${action === 'increase' ? 'active' : ''}`}
                onClick={() => setAction('increase')}
              >
                Увеличить
              </button>
            </div>
            <div className="amount-input-group">
              <input
                type="number"
                min="0"
                max={action === 'reduce' ? debt.amount : undefined}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Сумма"
                className="amount-input"
              />
              <button
                type="button"
                onClick={handleAction}
                disabled={!amount || parseFloat(amount) <= 0 || (action === 'reduce' && parseFloat(amount) > debt.amount)}
                className={action === 'reduce' ? 'btn-action btn-reduce' : 'btn-action btn-increase'}
              >
                {action === 'reduce' ? 'Уменьшить' : 'Увеличить'}
              </button>
            </div>
          </div>
          <button type="button" onClick={() => onClose(debt.id)} className="btn-close">
            Закрыть долг
          </button>
        </div>
      )}
    </div>
  );
};

export const DebtList = ({ debts, onReduce, onIncrease, onClose }: DebtListProps) => {
  if (!Array.isArray(debts)) {
    return <div className="debt-list"><p className="empty">Ошибка загрузки данных</p></div>;
  }
  
  const activeDebts = debts.filter(d => d && !d.closedAt);
  const closedDebts = debts.filter(d => d && d.closedAt);

  return (
    <div className="debt-list">
      <h2>Активные долги ({activeDebts.length})</h2>
      {activeDebts.length === 0 ? (
        <p className="empty">Нет активных долгов</p>
      ) : (
        <div className="debts-container">
          {activeDebts.map(debt => (
            <DebtItem
              key={debt.id}
              debt={debt}
              onReduce={onReduce}
              onIncrease={onIncrease}
              onClose={onClose}
            />
          ))}
        </div>
      )}

      {closedDebts.length > 0 && (
        <>
          <h2>Закрытые долги ({closedDebts.length})</h2>
          <div className="debts-container">
            {closedDebts.map(debt => (
              <DebtItem
                key={debt.id}
                debt={debt}
                onReduce={onReduce}
                onIncrease={onIncrease}
                onClose={onClose}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

