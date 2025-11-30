import React, { useState } from 'react';
import { Bill } from '../types';
import { generateId } from '../services/storage';
import { Plus, Edit2, Trash2, CheckSquare, Square, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { Modal } from './ui/Modal';

interface BillsProps {
  bills: Bill[];
  onUpdate: (bill: Bill) => void;
  onDelete: (id: string) => void;
}

export const Bills: React.FC<BillsProps> = ({ bills, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  const sortedBills = [...bills].sort((a, b) => {
    if (a.isPaid === b.isPaid) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return a.isPaid ? 1 : -1;
  });

  const totalAmount = bills.reduce((acc, b) => acc + b.amount, 0);
  const totalPaid = bills.filter(b => b.isPaid).reduce((acc, b) => acc + b.amount, 0);
  const totalPending = totalAmount - totalPaid;

  const handleOpenModal = (b?: Bill) => {
    if (b) {
      setEditingId(b.id);
      setDescription(b.description);
      setAmount(b.amount.toString());
      setDueDate(b.dueDate);
    } else {
      setEditingId(null);
      setDescription('');
      setAmount('');
      const date = new Date();
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      setDueDate(lastDay.toISOString().split('T')[0]);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existingBill = bills.find(b => b.id === editingId);
    const payload: Bill = {
      id: editingId || generateId(),
      description,
      amount: parseFloat(amount),
      dueDate,
      isPaid: existingBill ? existingBill.isPaid : false
    };
    onUpdate(payload);
    setIsModalOpen(false);
  };

  const togglePaid = (bill: Bill) => {
    onUpdate({ ...bill, isPaid: !bill.isPaid });
  };

  const isOverdue = (dateStr: string) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    return new Date(dateStr) < today;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Contas</h1>
          <p className="text-slate-500">Controle mensal de boletos</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-3 rounded-xl flex items-center gap-2 shadow-xl transition-all hover:scale-105 active:scale-95 font-semibold"
        >
          <Plus size={20} /> <span className="hidden md:inline">Nova Conta</span>
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-rose-500 to-pink-500 p-6 rounded-[1.5rem] text-white shadow-lg shadow-rose-500/20">
            <p className="text-rose-100 font-medium text-sm">A Pagar</p>
            <h3 className="text-3xl font-bold mt-1">
                R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h3>
        </div>
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm">
            <p className="text-emerald-500 font-bold text-sm">Já Pago</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">
                R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h3>
        </div>
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm">
            <p className="text-slate-400 font-bold text-sm">Total do Mês</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">
                R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h3>
        </div>
      </div>

      <div className="space-y-3">
        {sortedBills.length === 0 ? (
          <div className="text-center py-16 text-slate-400 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            Nenhuma conta cadastrada este mês.
          </div>
        ) : (
          sortedBills.map((b, i) => {
            const overdue = !b.isPaid && isOverdue(b.dueDate);
            return (
                <div key={b.id} className={`group relative p-5 rounded-2xl border transition-all animate-fade-in ${b.isPaid ? 'bg-slate-50 border-transparent opacity-70' : 'bg-white border-slate-100 shadow-sm hover:shadow-lg hover:border-violet-200'}`} style={{animationDelay: `${i*50}ms`}}>
                    {b.isPaid && (
                        <div className="absolute top-4 right-4 text-emerald-500 opacity-20">
                            <CheckCircle size={40} />
                        </div>
                    )}
                    <div className="flex items-center gap-5 relative z-10">
                        <button 
                            onClick={() => togglePaid(b)} 
                            className={`p-1 rounded-lg transition-colors ${b.isPaid ? 'text-emerald-500' : 'text-slate-300 hover:text-emerald-500'}`}
                        >
                            {b.isPaid ? <CheckSquare size={28} /> : <Square size={28} strokeWidth={1.5} />}
                        </button>
                        
                        <div className="flex-1">
                            <h4 className={`font-bold text-lg ${b.isPaid ? 'line-through text-slate-400' : 'text-slate-800'}`}>{b.description}</h4>
                            <div className="flex items-center gap-3 text-xs mt-1">
                                <span className={`flex items-center gap-1 font-medium ${overdue ? 'text-rose-500' : 'text-slate-400'}`}>
                                    <Calendar size={14}/> {new Date(b.dueDate).toLocaleDateString('pt-BR')}
                                    {overdue && <span className="flex items-center gap-1 ml-2 bg-rose-100 px-2 py-0.5 rounded-md text-rose-600 font-bold"><AlertCircle size={10}/> Vencido</span>}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <span className={`font-bold text-lg ${b.isPaid ? 'text-slate-400' : 'text-slate-800'}`}>
                            R$ {b.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleOpenModal(b)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => onDelete(b.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )
          })
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Editar Conta' : 'Nova Conta'}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Descrição</label>
            <input required type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 outline-none" placeholder="Ex: Conta de Luz" />
          </div>
          <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Valor</label>
                <input required type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 outline-none" placeholder="0,00" />
            </div>
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Data de Vencimento</label>
                <input required type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 outline-none" />
            </div>
          <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white py-4 rounded-xl font-bold mt-4 shadow-lg">
            Salvar Conta
          </button>
        </form>
      </Modal>
    </div>
  );
};