import React, { useMemo } from 'react';
import { AppData, Bill } from '../types';
import { TrendingUp, TrendingDown, Wallet, CreditCard, Droplet, PiggyBank, CheckCircle2, Calendar, AlertCircle, ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DashboardProps {
  data: AppData;
  onUpdateBill: (bill: Bill) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onUpdateBill }) => {
  
  const summary = useMemo(() => {
    const totalIncome = data.transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = data.transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    const currentMonthCredit = data.creditPurchases.reduce((acc, curr) => acc + curr.installmentValue, 0);
    const savingsBalance = data.savingsRecords.reduce((acc, curr) => curr.type === 'deposit' ? acc + curr.amount : acc - curr.amount, 0);
    
    return {
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense,
      credit: currentMonthCredit,
      savings: savingsBalance
    };
  }, [data]);

  const pendingBills = useMemo(() => {
      if (!data.bills) return [];
      return data.bills
        .filter(b => !b.isPaid)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 5);
  }, [data.bills]);

  const chartData = [
    { name: 'Receitas', value: summary.income, color: '#8b5cf6' }, // Violet
    { name: 'Despesas', value: summary.expense, color: '#ef4444' }, // Red
    { name: 'Poupança', value: summary.savings > 0 ? summary.savings : 0, color: '#3b82f6' }, // Blue
  ].filter(d => d.value > 0);

  const isOverdue = (dateStr: string) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    return new Date(dateStr) < today;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <header className="flex justify-between items-end">
        <div>
           <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Visão Geral</h2>
           <h1 className="text-3xl font-bold text-slate-800">Olá, Bem-vindo de volta! 👋</h1>
        </div>
        <div className="hidden md:block text-sm text-slate-500 bg-white px-3 py-1 rounded-full border shadow-sm">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </header>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Balance Card - Gradient Style */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 text-white p-8 shadow-2xl shadow-indigo-500/30 hover:scale-[1.01] transition-transform duration-500">
             {/* Decorative Circles */}
             <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
             <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 rounded-full bg-blue-400 opacity-20 blur-2xl"></div>
             
             <div className="relative z-10 flex flex-col justify-between h-full min-h-[180px]">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-indigo-100 font-medium mb-1">Saldo Total Disponível</p>
                        <h2 className="text-5xl font-bold tracking-tight">R$ {summary.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
                    </div>
                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                        <Wallet className="text-white" size={28} />
                    </div>
                </div>
                
                <div className="flex gap-8 mt-8">
                    <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                        <div className="bg-emerald-400/20 p-1.5 rounded-full text-emerald-300">
                            <ArrowUpRight size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-indigo-100">Receitas</p>
                            <p className="font-semibold">R$ {summary.income.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                        <div className="bg-rose-400/20 p-1.5 rounded-full text-rose-300">
                            <ArrowDownRight size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-indigo-100">Despesas</p>
                            <p className="font-semibold">R$ {summary.expense.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</p>
                        </div>
                    </div>
                </div>
             </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-rows-3 gap-4 h-full">
             <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between hover-card cursor-pointer group">
                 <div className="flex items-center gap-4">
                    <div className="bg-orange-50 p-3 rounded-2xl text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Fatura Cartão</p>
                        <h3 className="text-xl font-bold text-slate-800">R$ {summary.credit.toLocaleString('pt-BR')}</h3>
                    </div>
                 </div>
             </div>

             <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between hover-card cursor-pointer group">
                 <div className="flex items-center gap-4">
                    <div className="bg-purple-50 p-3 rounded-2xl text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                        <PiggyBank size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Reserva</p>
                        <h3 className="text-xl font-bold text-slate-800">R$ {summary.savings.toLocaleString('pt-BR')}</h3>
                    </div>
                 </div>
             </div>

             <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between hover-card cursor-pointer group">
                 <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-2xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <Droplet size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Combustível</p>
                        <h3 className="text-xl font-bold text-slate-800">Ver Média</h3>
                    </div>
                 </div>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">Estrutura Financeira</h3>
                <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal /></button>
            </div>
            <div className="h-64 w-full flex items-center justify-center">
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={10}
                    >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
                    />
                </PieChart>
                </ResponsiveContainer>
            ) : (
                <div className="text-center text-slate-400">
                    <PieChart size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Sem dados suficientes</p>
                </div>
            )}
            </div>
            <div className="flex justify-center gap-6 mt-4">
                {chartData.map(d => (
                    <div key={d.name} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        <span className="w-3 h-3 rounded-full shadow-sm" style={{backgroundColor: d.color}}></span>
                        {d.name}
                    </div>
                ))}
            </div>
        </div>

        {/* Pending Bills Section */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col h-full">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex justify-between items-center">
                Contas a Pagar
                {pendingBills.length > 0 && <span className="text-xs bg-rose-100 text-rose-600 px-2.5 py-1 rounded-full font-bold">{pendingBills.length}</span>}
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                {pendingBills.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
                        <div className="bg-emerald-50 p-4 rounded-full text-emerald-500">
                             <CheckCircle2 size={32} />
                        </div>
                        <p className="text-sm font-medium">Você está em dia!</p>
                    </div>
                ) : (
                    pendingBills.map((bill, i) => {
                        const overdue = isOverdue(bill.dueDate);
                        return (
                            <div key={bill.id} className={`group flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 hover:border-transparent animate-fade-in`} style={{animationDelay: `${i * 100}ms`}}>
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => onUpdateBill({...bill, isPaid: true})} 
                                        className="w-6 h-6 rounded-full border-2 border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 text-transparent hover:text-emerald-500 flex items-center justify-center transition-all"
                                        title="Marcar como pago"
                                    >
                                        <CheckCircle2 size={16} />
                                    </button>
                                    <div>
                                        <p className="font-bold text-slate-700 text-sm">{bill.description}</p>
                                        <p className={`text-xs flex items-center gap-1 mt-0.5 ${overdue ? 'text-rose-500 font-bold' : 'text-slate-400'}`}>
                                            <Calendar size={10}/> {new Date(bill.dueDate).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})}
                                            {overdue && <span className="flex items-center gap-1 bg-rose-100 px-1.5 py-0.5 rounded text-[10px] ml-1">Atrasado</span>}
                                        </p>
                                    </div>
                                </div>
                                <span className="font-bold text-slate-800 text-sm">R$ {bill.amount.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</span>
                            </div>
                        );
                    })
                )}
            </div>
            <button onClick={() => {}} className="mt-4 w-full py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-colors border border-dashed border-slate-200">
                Ver todas as contas
            </button>
        </div>
      </div>
    </div>
  );
};