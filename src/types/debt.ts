export interface Debt {
  id: string;
  name: string;
  amount: number;
  initialAmount: number; // изначальная сумма долга для расчета прогресса
  isOwed: boolean; // true = я должен, false = мне должны
  createdAt: string;
  closedAt?: string;
}

