export type Category = 'Salário' | 'Extras' | 'Vendas' | 'Alimentação' | 'Lazer' | 'Contas' | 'Compras' | 'Transporte' | 'Saúde' | 'Outros';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string; // ISO string YYYY-MM-DD
  category: string;
  type: 'income' | 'expense';
}

export interface FuelRecord {
  id: string;
  date: string;
  amount: number; // Total cost
  liters: number;
  kmDriven: number; // KM since last fill
  pricePerLiter: number; // Calculated
  kmPerLiter: number; // Calculated
}

export interface CreditPurchase {
  id: string;
  description: string;
  amount: number; // Total purchase value
  installments: number;
  date: string; // Purchase date
  dueDate: string; // Invoice due date
  cardName: string;
  installmentValue: number; // Calculated
}

export interface Bill {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
}

export interface SavingsRecord {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  date: string;
  description: string;
}

export interface AppData {
  transactions: Transaction[];
  fuelRecords: FuelRecord[];
  creditPurchases: CreditPurchase[];
  bills: Bill[];
  savingsRecords: SavingsRecord[];
}