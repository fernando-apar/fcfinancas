import React, { useState, useEffect } from 'react';
import { LayoutDashboard, TrendingUp, TrendingDown, CreditCard as CreditIcon, Droplet, PiggyBank, Receipt, Menu, X, Wallet } from 'lucide-react';
import { loadData, saveData } from './services/storage';
import { AppData, Transaction, FuelRecord, CreditPurchase, SavingsRecord, Bill } from './types';

// Components
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Fuel } from './components/Fuel';
import { CreditCard } from './components/CreditCard';
import { Savings } from './components/Savings';
import { Bills } from './components/Bills';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState<AppData>(loadData());

  useEffect(() => {
    saveData(data);
  }, [data]);

  // --- HANDLERS (Same logic, passed down) ---
  const handleTransactionUpdate = (t: Transaction) => {
    setData(prev => {
      const exists = prev.transactions.find(item => item.id === t.id);
      const newTransactions = exists ? prev.transactions.map(item => item.id === t.id ? t : item) : [...prev.transactions, t];
      return { ...prev, transactions: newTransactions };
    });
  };
  const deleteTransaction = (id: string) => {
    if(confirm('Tem certeza?')) setData(prev => ({ ...prev, transactions: prev.transactions.filter(t => t.id !== id) }));
  };
  const handleFuelUpdate = (r: FuelRecord) => {
    setData(prev => {
        const exists = prev.fuelRecords.find(item => item.id === r.id);
        const list = exists ? prev.fuelRecords.map(item => item.id === r.id ? r : item) : [...prev.fuelRecords, r];
        return { ...prev, fuelRecords: list };
    });
  };
  const deleteFuel = (id: string) => {
     if(confirm('Tem certeza?')) setData(prev => ({ ...prev, fuelRecords: prev.fuelRecords.filter(r => r.id !== id) }));
  };
  const handleCreditUpdate = (p: CreditPurchase) => {
     setData(prev => {
        const exists = prev.creditPurchases.find(item => item.id === p.id);
        const list = exists ? prev.creditPurchases.map(item => item.id === p.id ? p : item) : [...prev.creditPurchases, p];
        return { ...prev, creditPurchases: list };
    });
  };
  const deleteCredit = (id: string) => {
      if(confirm('Tem certeza?')) setData(prev => ({ ...prev, creditPurchases: prev.creditPurchases.filter(p => p.id !== id) }));
  };
  const handleSavingsUpdate = (s: SavingsRecord) => {
     setData(prev => {
        const exists = prev.savingsRecords.find(item => item.id === s.id);
        const list = exists ? prev.savingsRecords.map(item => item.id === s.id ? s : item) : [...prev.savingsRecords, s];
        return { ...prev, savingsRecords: list };
    });
  };
  const deleteSavings = (id: string) => {
      if(confirm('Tem certeza?')) setData(prev => ({ ...prev, savingsRecords: prev.savingsRecords.filter(s => s.id !== id) }));
  };
  const handleBillUpdate = (b: Bill) => {
    setData(prev => {
        const exists = prev.bills ? prev.bills.find(item => item.id === b.id) : false;
        const currentBills = prev.bills || [];
        const list = exists ? currentBills.map(item => item.id === b.id ? b : item) : [...currentBills, b];
        return { ...prev, bills: list };
    });
  };
  const deleteBill = (id: string) => {
      if(confirm('Tem certeza?')) setData(prev => ({ ...prev, bills: (prev.bills || []).filter(b => b.id !== id) }));
  };

  const navItems = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'income', label: 'Receitas', icon: TrendingUp },
    { id: 'expenses', label: 'Despesas', icon: TrendingDown },
    { id: 'bills', label: 'Contas', icon: Receipt },
    { id: 'credit', label: 'Cartão', icon: CreditIcon },
    { id: 'fuel', label: 'Carro', icon: Droplet },
    { id: 'savings', label: 'Cofre', icon: PiggyBank },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard data={data} onUpdateBill={handleBillUpdate} />;
      case 'income': return <Transactions type="income" transactions={data.transactions} onUpdate={handleTransactionUpdate} onDelete={deleteTransaction} />;
      case 'expenses': return <Transactions type="expense" transactions={data.transactions} onUpdate={handleTransactionUpdate} onDelete={deleteTransaction} />;
      case 'bills': return <Bills bills={data.bills || []} onUpdate={handleBillUpdate} onDelete={deleteBill} />;
      case 'fuel': return <Fuel records={data.fuelRecords} onUpdate={handleFuelUpdate} onDelete={deleteFuel} />;
      case 'credit': return <CreditCard purchases={data.creditPurchases} onUpdate={handleCreditUpdate} onDelete={deleteCredit} />;
      case 'savings': return <Savings records={data.savingsRecords} onUpdate={handleSavingsUpdate} onDelete={deleteSavings} />;
      default: return <Dashboard data={data} onUpdateBill={handleBillUpdate} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-800">
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex flex-col w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 z-20">
        <div className="p-8 pb-4">
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-gradient-to-br from-violet-600 to-blue-600 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-500/30">
                    <Wallet size={20} />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent tracking-tight">FinanSmart</h1>
            </div>
            
            <nav className="space-y-1.5">
            {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                    isActive 
                        ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-blue-500/20 translate-x-1' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-violet-600'
                    }`}
                >
                    <Icon size={20} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span className="font-medium">{item.label}</span>
                </button>
                );
            })}
            </nav>
        </div>
        
        <div className="mt-auto p-6 m-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl text-white relative overflow-hidden shadow-xl">
             <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500 blur-[40px] opacity-30"></div>
             <p className="relative z-10 text-sm font-medium opacity-80">Versão Pro</p>
             <p className="relative z-10 text-xs opacity-50 mt-1">Sincronização ativada</p>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Top Bar (Just Logo) */}
        <div className="md:hidden pt-safe-top px-6 py-4 flex justify-between items-center z-10 bg-slate-50/90 backdrop-blur-md sticky top-0">
             <div className="flex items-center gap-2">
                 <div className="bg-gradient-to-r from-violet-600 to-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white">
                    <Wallet size={16} />
                 </div>
                 <h1 className="font-bold text-slate-800 text-lg">FinanSmart</h1>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
            </div>
        </div>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto w-full">
                {renderContent()}
            </div>
        </div>

        {/* --- MOBILE BOTTOM NAVIGATION --- */}
        <div className="md:hidden fixed bottom-4 left-4 right-4 bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl shadow-slate-300/50 rounded-2xl z-50 flex justify-between px-2 py-2">
             {navItems.slice(0, 5).map(item => { // Show first 5 items on mobile bar
                 const isActive = activeTab === item.id;
                 return (
                     <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl w-full transition-all duration-300 ${
                            isActive ? 'text-violet-600 bg-violet-50' : 'text-gray-400 hover:text-gray-600'
                        }`}
                     >
                         <item.icon size={22} className={isActive ? 'fill-current' : ''} strokeWidth={isActive ? 2.5 : 2} />
                         <span className={`text-[10px] font-medium mt-1 transition-all ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 hidden'}`}>
                             {item.label}
                         </span>
                     </button>
                 )
             })}
             {/* More Button (if needed, simplified here to show max 5) */}
        </div>
      </main>
    </div>
  );
}

export default App;