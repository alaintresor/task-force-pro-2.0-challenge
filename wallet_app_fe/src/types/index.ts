export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  token: string;
}
export interface Account {
  _id: string;
  name: string;
  type: string;
  balance: number;
  created_at: string;
}

export interface Category {
  _id: string;
  name: string;
  type: 'expense' | 'income';
  created_at: string;
}

export interface Subcategory {
  _id: string;
  categoryId: Category;
  name: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  account_id: string;
  category_id: string;
  subcategory_id?: string;
  amount: number;
  type: 'expense' | 'income';
  description?: string;
  date: string;
}

export interface Budget {
  _id: string;
  categoryId: Category;
  amount: number;
  period: 'monthly' | 'yearly';
  start_date: string;
  end_date: string;
}