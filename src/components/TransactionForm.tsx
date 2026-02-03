import React, { useState } from 'react';

interface TransactionFormProps {
  type: 'expenses' | 'income';
  onAdd: (name: string, amount: number, category?: string) => void;
}

export const TransactionForm = ({ type, onAdd }: TransactionFormProps) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (name.trim() && numAmount > 0) {
      onAdd(name.trim(), numAmount, category.trim() || undefined);
      setName('');
      setAmount('');
      setCategory('');
    }
  };

  const title = type === 'expenses' ? 'Добавить расход' : 'Добавить доход';
  const placeholder = type === 'expenses' ? 'На что потратил' : 'Откуда получил';

  return (
    <form onSubmit={handleSubmit} className="add-debt-form">
      <h2>{title}</h2>
      <div className="form-group">
        <label htmlFor="name">Описание</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={placeholder}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="amount">Сумма (₽)</label>
        <input
          id="amount"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="category">Категория (необязательно)</label>
        <input
          id="category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Еда, Транспорт, Зарплата..."
        />
      </div>
      <button type="submit" className="btn-add">
        Добавить
      </button>
    </form>
  );
};
