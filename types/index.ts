// TypeScript型定義をここにエクスポート

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description?: string;
  date: Date;
}

export interface Category {
  id: string;
  name: string;
  color?: string;
}