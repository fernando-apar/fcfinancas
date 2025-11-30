import React, { useState } from 'react';
import { Transaction } from '../types';
import { generateId } from '../services/storage';
import { Plus, Edit2, Trash2, Calendar, Tag, DollarSign, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Modal } from './ui/Modal';

interface TransactionsProps {
  type: 'income' | 'expense';
  transactions: Transaction[];
  onUpdate: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export const Transactions: React.FC<TransactionsProps> = ({ type, transactions, onUpdate, onDelete }) => {
  const isIncome = type === 'income';
  const themeColor = isIncome ? 'emerald' : 'rose'; // Used for dynamic classes logic
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState(isIncome ? 'Salário' : 'Alimentação');

  const filteredTransactions = transactions
    .filter(t => t.type === type)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const total = filteredTransactions.reduce((acc, t) => acc + t.amount, 0);

  const handleOpenModal = (t?: Transaction) => {
    if (t) {
      setEditingId(t.id);
      setDescription(t.description);
      setAmount(t.amount.toString());
      setDate(t.date);
      setCategory(t.category);
    } else {
      setEditingId(null);
      setDescription('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setCategory(isIncome ? 'Salário' : 'Alimentação');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Transaction = {
      id: editingId || generateId(),
      description,
      amount: parseFloat(amount),
      date,
      category,
      type
    };
    onUpdate(payload);
    setIsModalOpen(false);
  };

  const categories = isIncome 
    ? ['Salário', 'Extras', 'Vendas', 'Investimentos', 'Outros']
    : ['Alimentação', 'Lazer', 'Contas', 'Compras', 'Transporte', 'Saúde', 'Moradia', 'Educação', 'Outros'];

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{isIncome ? 'Receitas' : 'Despesas'}</h1>
          <p className="text-slate-500">Gestão de {isIncome ? 'entradas' : 'saídas'}</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className={`px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-${themeColor}-500/30 transition-all hover:-translate-y-1 active:scale-95 text-white font-semibold ${isIncome ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-rose-500 to-pink-500'}`}
        >
          <Plus size={20} strokeWidth={2.5} /> <span className="hidden md:inline">Adicionar</span>
        </button>
      </header>

      {/* Total Card */}
      <div className={`p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center relative overflow-hidden`}>
         <div className={`absolute top-0 right-0 w-64 h-64 bg-${themeColor}-400/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none`}></div>
         <div>
            <span className="text-slate-500 font-medium text-sm uppercase tracking-wider">Total Acumulado</span>
            <h2 className={`text-4xl md:text-5xl font-bold mt-2 ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
                R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h2>
         </div>
         <div className={`hidden md:flex p-4 rounded-full ${isIncome ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
            {isIncome ? <ArrowUpCircle size={40} /> : <ArrowDownCircle size={40} />}
         </div>
      </div>

      {/* List */}
      <div className="grid gap-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-16 text-slate-400 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                 <Tag size={32} />
            </div>
            <p>Nenhum lançamento encontrado.</p>
          </div>
        ) : (
          filteredTransactions.map((t, i) => (
            <div 
                key={t.id} 
                className="group bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center transition-all hover:shadow-lg hover:shadow-slate-200/50 hover:border-transparent hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${isIncome ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    {t.description.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-lg">{t.description}</span>
                    <div className="flex gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-lg"><Calendar size={12}/> {new Date(t.date).toLocaleDateString('pt-BR')}</span>
                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-lg"><Tag size={12}/> {t.category}</span>
                    </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className={`font-bold text-lg ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isIncome ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal(t)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 size={18} />
                    </button>
                    <button onClick={() => onDelete(t.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                    </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Editar Lançamento' : 'Novo Lançamento'}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Descrição</label>
            <input required type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" placeholder="Ex: Salário Mensal" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Valor</label>
                <div className="relative">
                    <span className="absolute left-3 top-3.5 text-slate-400"><DollarSign size={16} /></span>
                    <input required type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="w-full pl-9 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" placeholder="0,00" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Data</label>
                <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Categoria</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button type="submit" className={`w-full py-4 rounded-xl font-bold text-white shadow-lg mt-4 transition-transform active:scale-95 ${isIncome ? 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/20' : 'bg-gradient-to-r from-rose-500 to-pink-600 shadow-rose-500/20'}`}>
            Salvar
          </button>
        </form>
      </Modal>
    </div>
  );
};