import React, { useState } from 'react';
import { CreditPurchase } from '../types';
import { generateId } from '../services/storage';
import { Plus, Edit2, Trash2, CreditCard as CreditIcon, Calendar, Clock, Sparkles } from 'lucide-react';
import { Modal } from './ui/Modal';

interface CreditCardProps {
  purchases: CreditPurchase[];
  onUpdate: (purchase: CreditPurchase) => void;
  onDelete: (id: string) => void;
}

export const CreditCard: React.FC<CreditCardProps> = ({ purchases, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [installments, setInstallments] = useState('1');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [cardName, setCardName] = useState('Principal');

  const sortedPurchases = [...purchases].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const monthlyProjection = purchases.reduce((acc, curr) => acc + curr.installmentValue, 0);

  const handleOpenModal = (p?: CreditPurchase) => {
    if (p) {
      setEditingId(p.id);
      setDescription(p.description);
      setTotalAmount(p.amount.toString());
      setInstallments(p.installments.toString());
      setDate(p.date);
      setDueDate(p.dueDate || p.date);
      setCardName(p.cardName);
    } else {
      setEditingId(null);
      setDescription('');
      setTotalAmount('');
      setInstallments('1');
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      const nextMonth = new Date();
      nextMonth.setDate(nextMonth.getDate() + 30);
      setDueDate(nextMonth.toISOString().split('T')[0]);
      setCardName('Principal');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valTotal = parseFloat(totalAmount);
    const valInst = parseInt(installments);
    
    const payload: CreditPurchase = {
      id: editingId || generateId(),
      description,
      amount: valTotal,
      installments: valInst,
      date,
      dueDate,
      cardName,
      installmentValue: valTotal / valInst
    };
    onUpdate(payload);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
       <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Cartões</h1>
          <p className="text-slate-500">Gestão de crédito e parcelas</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-violet-600 to-blue-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 font-semibold"
        >
          <Plus size={20} /> <span className="hidden md:inline">Nova Compra</span>
        </button>
      </header>

      {/* Realistic Card UI */}
      <div className="relative w-full md:w-[400px] h-[240px] rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl mx-auto md:mx-0 overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-500/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 p-8 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <CreditIcon size={32} className="text-slate-200" />
                <span className="font-mono text-lg tracking-widest opacity-80">FinanSmart</span>
            </div>
            
            <div className="space-y-1">
                <p className="text-xs text-slate-400 uppercase tracking-widest">Fatura Estimada</p>
                <h2 className="text-3xl font-bold tracking-tight">R$ {monthlyProjection.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
            </div>

            <div className="flex justify-between items-end">
                <div>
                     <p className="text-[10px] text-slate-400 uppercase">Compras Ativas</p>
                     <p className="font-medium">{purchases.length} itens</p>
                </div>
                 <div className="flex flex-col items-end">
                    <div className="flex gap-1">
                         <div className="w-8 h-8 rounded-full bg-red-500/80 mix-blend-screen"></div>
                         <div className="w-8 h-8 rounded-full bg-orange-500/80 -ml-4 mix-blend-screen"></div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedPurchases.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-400">Nenhuma compra parcelada registrada.</p>
            </div>
        ) : (
            sortedPurchases.map((p, i) => (
                <div key={p.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-slate-800 text-lg">{p.description}</h3>
                                {p.cardName && <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase font-bold">{p.cardName}</span>}
                            </div>
                            <div className="flex flex-col gap-1 mt-2">
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                    <Calendar size={12}/> {new Date(p.date).toLocaleDateString('pt-BR')} 
                                </p>
                                {p.dueDate && (
                                  <p className="text-xs text-orange-500 flex items-center gap-1 font-semibold">
                                      <Clock size={12}/> Vence: {new Date(p.dueDate).toLocaleDateString('pt-BR')}
                                  </p>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="font-bold text-xl text-violet-600">R$ {p.installmentValue.toFixed(2)}<span className="text-xs text-slate-400 font-normal">/mês</span></p>
                             <div className="flex items-center justify-end gap-1 text-xs text-slate-400 mt-1">
                                <span>{p.installments}x</span>
                                <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-violet-500 rounded-full" style={{width: '100%'}}></div>
                                </div>
                             </div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-50 pt-4 mt-2">
                        <span className="text-xs font-semibold text-slate-500">Total: R$ {p.amount.toFixed(2)}</span>
                        <div className="flex gap-2">
                             <button onClick={() => handleOpenModal(p)} className="p-2 hover:bg-violet-50 rounded-lg text-slate-400 hover:text-violet-600 transition-colors"><Edit2 size={16}/></button>
                             <button onClick={() => onDelete(p.id)} className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={16}/></button>
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Compra Parcelada">
        <form onSubmit={handleSubmit} className="space-y-5">
             <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Descrição da Compra</label>
                <input required type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none" placeholder="Ex: iPhone 15" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Valor Total</label>
                    <input required type="number" step="0.01" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none" placeholder="0,00" />
                </div>
                 <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Parcelas</label>
                    <input required type="number" min="1" max="48" value={installments} onChange={e => setInstallments(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Data da Compra</label>
                    <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none" />
                </div>
                 <div>
                    <label className="block text-sm font-semibold text-orange-600 mb-2">Vencimento Fatura</label>
                    <input required type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full p-3 bg-orange-50 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
            </div>
             <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Apelido do Cartão</label>
                <input type="text" value={cardName} onChange={e => setCardName(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none" placeholder="Ex: Nubank, Inter..." />
            </div>
             <button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:shadow-lg hover:shadow-blue-500/25 py-4 rounded-xl font-bold text-white mt-4 transition-all">Salvar Compra</button>
        </form>
      </Modal>
    </div>
  );
};