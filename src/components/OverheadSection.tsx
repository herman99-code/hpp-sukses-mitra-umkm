import React from 'react';
import type { OverheadItem } from '../types';
import { formatRupiah } from '../utils/calculations';

import { Trash2, Plus } from 'lucide-react';

interface OverheadSectionProps {
  items: OverheadItem[];
  onChange: (items: OverheadItem[]) => void;
}

export const OverheadSection: React.FC<OverheadSectionProps> = ({ items, onChange }) => {
  const addItem = () => {
    const newItem: OverheadItem = {
      id: crypto.randomUUID(),
      name: '',
      amount: 0,
    };
    onChange([...items, newItem]);
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof OverheadItem, value: any) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onChange(updated);
  };

  const grandTotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div className="glass-panel rounded-2xl p-6 glass-panel-hover flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold font-sans tracking-tight text-white flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-full bg-emerald-500 inline-block"></span>
            3. Biaya Overhead Pabrik
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            Biaya pendukung produksi (kemasan, gas, sewa alat, penyusutan, dll).
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-400 block font-medium">Subtotal</span>
          <span className="text-lg font-bold text-emerald-400">{formatRupiah(grandTotal)}</span>
        </div>
      </div>

      <div className="overflow-x-auto -mx-6 px-6 flex-grow">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500 border border-dashed border-gray-800 rounded-xl">
            <p className="text-sm mb-2">Belum ada biaya overhead.</p>
            <button
              type="button"
              onClick={addItem}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Overhead Pertama
            </button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                <th className="pb-3 pr-2 w-2/3">Nama Biaya</th>
                <th className="pb-3 px-2 text-right">Jumlah Biaya</th>
                <th className="pb-3 pl-4 w-10 text-center no-print"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {items.map((item) => (
                <tr key={item.id} className="group hover:bg-gray-800/10">
                  <td className="py-2.5 pr-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      placeholder="Contoh: Kemasan, Gas LPG, Air & Listrik"
                      className="w-full px-3 py-1.5 text-sm glass-input font-medium"
                      required
                    />
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <div className="relative inline-block w-full max-w-[200px]">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-semibold">Rp</span>
                      <input
                        type="number"
                        min="0"
                        value={item.amount === 0 ? '' : item.amount}
                        onChange={(e) => updateItem(item.id, 'amount', parseInt(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full pl-8 pr-2 py-1.5 text-sm text-right glass-input font-mono font-medium"
                        required
                      />
                    </div>
                  </td>
                  <td className="py-2.5 pl-4 text-center no-print">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {items.length > 0 && (
        <button
          type="button"
          onClick={addItem}
          className="mt-4 no-print flex items-center justify-center gap-1.5 py-2 px-4 border border-emerald-500/30 hover:border-emerald-500 rounded-xl bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-400 hover:text-emerald-300 text-xs font-bold transition-all"
        >
          <Plus className="w-4 h-4" />
          Tambah Baris Overhead
        </button>
      )}
    </div>
  );
};
