import React, { useState } from 'react';
import { Plus } from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="card sticky top-20 h-fit">
      <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
        <Plus className="w-5 h-5 text-primary" />
        Добавить долг
      </h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Имя / Описание
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Кому/от кого"
            className="input"
            required
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Сумма (₽)
          </label>
          <input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="input"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Тип долга</label>
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                checked={isOwed}
                onChange={() => setIsOwed(true)}
                className="w-4 h-4 text-primary"
              />
              <span className="ml-3 text-gray-700 dark:text-gray-300">Я должен</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                checked={!isOwed}
                onChange={() => setIsOwed(false)}
                className="w-4 h-4 text-primary"
              />
              <span className="ml-3 text-gray-700 dark:text-gray-300">Мне должны</span>
            </label>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full">
          <Plus className="w-4 h-4 inline mr-2" />
          Добавить
        </button>
      </div>
    </form>
  );
};

