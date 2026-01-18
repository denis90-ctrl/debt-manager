import { Transaction } from '../types/transaction';

interface TransactionListProps {
  transactions: Transaction[];
  type: 'expenses' | 'income';
  onDelete: (id: string) => void;
}

export const TransactionList = ({ transactions, type, onDelete }: TransactionListProps) => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  const title = type === 'expenses' ? 'Расходы' : 'Доходы';

  return (
    <div className="debt-list">
      <h2>{title} ({transactions.length})</h2>
      {transactions.length === 0 ? (
        <p className="empty">Нет записей</p>
      ) : (
        <>
          <div className="transaction-total">
            <span>Всего: {formatAmount(total)}</span>
          </div>
          <div className="debts-container">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="debt-item">
                <div className="debt-info">
                  <div className="debt-name">{transaction.name}</div>
                  <div className={`debt-amount ${type === 'expenses' ? 'owed' : 'owed-to-me'}`}>
                    {formatAmount(transaction.amount)}
                  </div>
                  {transaction.category && (
                    <div className="debt-date">Категория: {transaction.category}</div>
                  )}
                  <div className="debt-date">Дата: {formatDate(transaction.createdAt)}</div>
                </div>
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="btn-close"
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

