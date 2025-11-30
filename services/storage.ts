import { AppData, Transaction, FuelRecord, CreditPurchase, SavingsRecord, Bill } from '../types';

const STORAGE_KEY = 'finansmart_data_v1';

const initialData: AppData = {
  transactions: [],
  fuelRecords: [],
  creditPurchases: [],
  bills: [],
  savingsRecords: []
};

export const loadData = (): AppData => {
  try {
    const dataStr = localStorage.getItem(STORAGE_KEY);
    if (!dataStr) return initialData;
    
    const data = JSON.parse(dataStr);
    
    // Ensure new fields exist for backward compatibility
    if (!data.bills) data.bills = [];
    
    return data;
  } catch (error) {
    console.error('Error loading data', error);
    return initialData;
  }
};

export const saveData = (data: AppData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data', error);
  }
};

export const generateId = () => Math.random().toString(36).substr(2, 9);