import React from 'react';
import type { MaterialItem } from '../types';
import { calculateMaterialTotal, formatRupiah } from '../utils/calculations';
import { Trash2, Plus } from 'lucide-react';


interface MaterialSectionProps {
  items: MaterialItem[];
  onChange: (items: MaterialItem[]) => void;
}

export const MaterialSection: React.FC<MaterialSectionProps> = ({ items, onChange }) => {
  const addItem = () => {
    const newItem: MaterialItem = {
      id: crypto.randomUUID(),
      name: '',
      quantity: 1,
      unit: 'pcs',
      pricePerUnit: 0,
      total: 0,
    };
    onChange([...items, newItem]);
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof MaterialItem, value: any) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'pricePerUnit') {
          const qty = field === 'quantity' ? Number(value) : item.quantity;
          const price = field === 'pricePerUnit' ? Number(value) : item.pricePerUnit;
          updatedItem.total = calculateMaterialTotal(qty, price);
        }
        return updatedItem;
      }
      return item;
    });
    onChange(updated);
  };

  const grandTotal = items.reduce((sum, item) => sum + (item.total || 0), 0);

  return (
    <div className="glass-panel rounded-2xl p-6 glass-panel-hover flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold font-sans tracking-tight text-white flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-full bg-indigo-500 inline-block"></span>
            1. Biaya Bahan Baku
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            Bahan baku utama dan pembantu yang digunakan dalam produksi.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-400 block font-medium">Subtotal</span>
          <span className="text-lg font-bold text-indigo-400">{formatRupiah(grandTotal)}</span>
        </div>
      </div>

      <div className="overflow-x-auto -mx-6 px-6 flex-grow">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500 border border-dashed border-gray-800 rounded-xl">
            <p className="text-sm mb-2">Belum ada bahan baku.</p>
            <button
              type="button"
              onClick={addItem}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Bahan Pertama
            </button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                <th className="pb-3 pr-2 w-1/3">Bahan / Material</th>
                <th className="pb-3 px-2 text-right">Jumlah</th>
                <th className="pb-3 px-2">Satuan</th>
                <th className="pb-3 px-2 text-right">Harga Satuan</th>
                <th className="pb-3 pl-2 text-right">Total</th>
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
                      placeholder="Contoh: Bahan A, Tepung"
                      className="w-full px-3 py-1.5 text-sm glass-input font-medium"
                      required
                    />
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={item.quantity === 0 ? '' : item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-20 px-2 py-1.5 text-sm text-right glass-input font-medium"
                      required
                    />
                  </td>
                  <td className="py-2.5 px-2">
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                      placeholder="kg/pcs"
                      className="w-16 px-2 py-1.5 text-sm text-center glass-input font-medium text-gray-300"
                      required
                    />
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <div className="relative inline-block w-28">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-semibold">Rp</span>
                      <input
                        type="number"
                        min="0"
                        value={item.pricePerUnit === 0 ? '' : item.pricePerUnit}
                        onChange={(e) => updateItem(item.id, 'pricePerUnit', parseInt(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full pl-8 pr-2 py-1.5 text-sm text-right glass-input font-mono font-medium"
                        required
                      />
                    </div>
                  </td>
                  <td className="py-2.5 pl-2 text-right font-mono text-sm font-semibold text-gray-300">
                    {formatRupiah(item.total)}
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
          className="mt-4 no-print flex items-center justify-center gap-1.5 py-2 px-4 border border-indigo-500/30 hover:border-indigo-500 rounded-xl bg-indigo-500/5 hover:bg-indigo-500/15 text-indigo-400 hover:text-indigo-300 text-xs font-bold transition-all"
        >
          <Plus className="w-4 h-4" />
          Tambah Baris Bahan Baku
        </button>
      )}
    </div>
  );
};
