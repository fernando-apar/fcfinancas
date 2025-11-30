import React, { useState } from 'react';
import { SavingsRecord } from '../types';
import { generateId } from '../services/storage';
import { Plus, Minus, Edit2, Trash2, PiggyBank, History, Sparkles } from 'lucide-react';
import { Modal } from './ui/Modal';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface SavingsProps {
  records: SavingsRecord[];
  onUpdate: (record: SavingsRecord) => void;
  onDelete: (id: string) => void;
}

export const Savings: React.FC<SavingsProps> = ({ records, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [type, setType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const sortedRecords = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const totalBalance = records.reduce((acc, curr) => {
    return curr.type === 'deposit' ? acc + curr.amount : acc - curr.amount;
  }, 0);

  const chartData = [...records]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc: any[], curr) => {
        const lastBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0;
        const newBalance = curr.type === 'deposit' ? lastBalance + curr.amount : lastBalance - curr.amount;
        acc.push({ date: curr.date, balance: newBalance });
        return acc;
    }, []);

  const handleOpenModal = (r?: SavingsRecord, defaultType: 'deposit' | 'withdrawal' = 'deposit') => {
    if (r) {
      setEditingId(r.id);
      setType(r.type);
      setAmount(r.amount.toString());
      setDescription(r.description);
      setDate(r.date);
    } else {
      setEditingId(null);
      setType(defaultType);
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: SavingsRecord = {
      id: editingId || generateId(),
      type,
      amount: parseFloat(amount),
      description,
      date
    };
    onUpdate(payload);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
       <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Cofre</h1>
          <p className="text-slate-500">Reserva de emergência & Sonhos</p>
        </div>
        <div className="flex gap-3">
             <button 
                onClick={() => handleOpenModal(undefined, 'deposit')}
                className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-violet-500/30 transition-transform active:scale-95 font-semibold"
            >
            <Plus size={20} /> Guardar
            </button>
             <button 
                onClick={() => handleOpenModal(undefined, 'withdrawal')}
                className="bg-white border border-slate-200 text-slate-700 px-5 py-3 rounded-xl flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors font-semibold"
            >
            <Minus size={20} /> Resgatar
            </button>
        </div>
      </header>

      {/* Main Card */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-8 rounded-[2rem] text-white shadow-2xl shadow-indigo-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center relative z-10">
            <div className="text-center md:text-left">
                <div className="flex items-center gap-2 text-violet-200 mb-2 justify-center md:justify-start">
                    <PiggyBank size={24} />
                    <span className="font-medium">Saldo Atual</span>
                </div>
                <p className="text-5xl font-bold tracking-tight">R$ {totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            
            <div className="mt-8 md:mt-0 w-full md:w-1/2 h-24">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#fff" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#fff" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Tooltip contentStyle={{background: 'rgba(255,255,255,0.9)', borderRadius: '12px', border: 'none', color: '#000'}} itemStyle={{color: '#000'}} formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                        <Area type="monotone" dataKey="balance" stroke="#fff" strokeWidth={3} fillOpacity={1} fill="url(#colorBal)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="flex items-center gap-2 font-bold text-slate-800 text-lg"><History size={20}/> Histórico de Movimentações</h3>
        {sortedRecords.length === 0 ? (
            <div className="text-center py-10 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
                <Sparkles size={32} className="mx-auto mb-2 opacity-50"/>
                <p>Comece a guardar dinheiro hoje!</p>
            </div>
        ) : (
            sortedRecords.map(r => (
                <div key={r.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center transition-transform hover:-translate-y-1">
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${r.type === 'deposit' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                            {r.type === 'deposit' ? <Plus size={20}/> : <Minus size={20}/>}
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">{r.description || (r.type === 'deposit' ? 'Depósito' : 'Resgate')}</p>
                            <p className="text-xs text-slate-400 font-medium">{new Date(r.date).toLocaleDateString('pt-BR')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className={`font-bold text-lg ${r.type === 'deposit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {r.type === 'deposit' ? '+' : '-'} R$ {r.amount.toFixed(2)}
                        </span>
                        <div className="flex gap-2">
                            <button onClick={() => handleOpenModal(r)} className="text-slate-300 hover:text-blue-500"><Edit2 size={16}/></button>
                            <button onClick={() => onDelete(r.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={type === 'deposit' ? 'Guardar Dinheiro' : 'Resgatar Dinheiro'}>
        <form onSubmit={handleSubmit} className="space-y-5">
             <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Valor</label>
                <input required type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none" placeholder="0,00"/>
            </div>
             <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Descrição</label>
                <input required type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none" placeholder="Motivo"/>
            </div>
             <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Data</label>
                <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"/>
            </div>
             <button type="submit" className={`w-full py-4 rounded-xl font-bold text-white mt-4 shadow-lg ${type === 'deposit' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'}`}>
                Confirmar {type === 'deposit' ? 'Depósito' : 'Resgate'}
            </button>
        </form>
      </Modal>
    </div>
  );
};