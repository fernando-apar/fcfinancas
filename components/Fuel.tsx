import React, { useState } from 'react';
import { FuelRecord } from '../types';
import { generateId } from '../services/storage';
import { Plus, Edit2, Trash2, Droplet, Gauge, Car } from 'lucide-react';
import { Modal } from './ui/Modal';

interface FuelProps {
  records: FuelRecord[];
  onUpdate: (record: FuelRecord) => void;
  onDelete: (id: string) => void;
}

export const Fuel: React.FC<FuelProps> = ({ records, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [amount, setAmount] = useState('');
  const [liters, setLiters] = useState('');
  const [kmDriven, setKmDriven] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const sortedRecords = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const averageConsumption = records.length > 0
    ? records.reduce((acc, curr) => acc + curr.kmPerLiter, 0) / records.length
    : 0;

  const handleOpenModal = (r?: FuelRecord) => {
    if (r) {
      setEditingId(r.id);
      setAmount(r.amount.toString());
      setLiters(r.liters.toString());
      setKmDriven(r.kmDriven.toString());
      setDate(r.date);
    } else {
      setEditingId(null);
      setAmount('');
      setLiters('');
      setKmDriven('');
      setDate(new Date().toISOString().split('T')[0]);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valAmount = parseFloat(amount);
    const valLiters = parseFloat(liters);
    const valKm = parseFloat(kmDriven);

    const payload: FuelRecord = {
      id: editingId || generateId(),
      date,
      amount: valAmount,
      liters: valLiters,
      kmDriven: valKm,
      pricePerLiter: valAmount / valLiters,
      kmPerLiter: valKm / valLiters
    };
    onUpdate(payload);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Veículo</h1>
          <p className="text-slate-500">Métricas de consumo</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-transform active:scale-95 font-semibold"
        >
          <Plus size={20} /> <span className="hidden md:inline">Abastecer</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-32 h-32 bg-amber-100/50 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-amber-200/50 transition-colors"></div>
            <div className="bg-amber-50 p-4 rounded-2xl text-amber-500 z-10">
                <Gauge size={32} />
            </div>
            <div className="z-10">
                <p className="text-slate-500 font-medium text-sm">Média Geral</p>
                <h3 className="text-4xl font-bold text-slate-800">{averageConsumption.toFixed(1)} <span className="text-lg text-slate-400 font-normal">Km/L</span></h3>
            </div>
        </div>
         <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-32 h-32 bg-blue-100/50 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-blue-200/50 transition-colors"></div>
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-500 z-10">
                <Droplet size={32} />
            </div>
            <div className="z-10">
                <p className="text-slate-500 font-medium text-sm">Último Preço/L</p>
                <h3 className="text-4xl font-bold text-slate-800">
                    R$ {sortedRecords[0]?.pricePerLiter.toFixed(2) || '0.00'}
                </h3>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-800 font-bold">
                <tr>
                <th className="p-5">Data</th>
                <th className="p-5">Valor</th>
                <th className="p-5">Litros</th>
                <th className="p-5">KM Rodados</th>
                <th className="p-5">Média</th>
                <th className="p-5 text-right">Ações</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
                {sortedRecords.length === 0 ? (
                    <tr><td colSpan={6} className="p-10 text-center text-slate-400">Sem registros</td></tr>
                ) : (
                    sortedRecords.map(r => (
                        <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-5 font-medium">{new Date(r.date).toLocaleDateString('pt-BR')}</td>
                            <td className="p-5 font-bold text-slate-800">R$ {r.amount.toFixed(2)}</td>
                            <td className="p-5">{r.liters.toFixed(2)} L</td>
                            <td className="p-5">{r.kmDriven} Km</td>
                            <td className="p-5"><span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-lg font-bold">{r.kmPerLiter.toFixed(1)} Km/L</span></td>
                            <td className="p-5 text-right">
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => handleOpenModal(r)} className="text-slate-400 hover:text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Edit2 size={16}/></button>
                                    <button onClick={() => onDelete(r.id)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16}/></button>
                                </div>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
            </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registro de Abastecimento">
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Valor Total (R$)</label>
                    <input required type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Litros</label>
                    <input required type="number" step="0.01" value={liters} onChange={e => setLiters(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">KM Rodados (desde último)</label>
                <input required type="number" step="0.1" value={kmDriven} onChange={e => setKmDriven(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Data</label>
                <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/20 py-4 rounded-xl font-bold text-white mt-4 transition-all">Salvar Registro</button>
        </form>
      </Modal>
    </div>
  );
};