import React, { useState } from 'react';

interface AddDebtFormProps {
  onAdd: (name: string, amount: number, isOwed: boolean) => void;
}

export const AddDebtForm = ({ onAdd }: AddDebtFormProps) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [isOwed, setIsOwed] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (name.trim() && numAmount > 0) {
      onAdd(name.trim(), numAmount, isOwed);
      setName('');
      setAmount('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-debt-form">
      <h2>Добавить долг</h2>
      <div className="form-group">
        <label htmlFor="name">Имя / Описание</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Кому/от кого"
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
        <label>
          <input
            type="radio"
            checked={isOwed}
            onChange={() => setIsOwed(true)}
          />
          Я должен
        </label>
        <label>
          <input
            type="radio"
            checked={!isOwed}
            onChange={() => setIsOwed(false)}
          />
          Мне должны
        </label>
      </div>
      <button type="submit" className="btn-add">
        Добавить
      </button>
    </form>
  );
};

