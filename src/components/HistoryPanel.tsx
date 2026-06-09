import React, { useState, useEffect } from 'react';
import type { CalculationState, HistoryTemplate } from '../types';
import { generateHPPReport, formatRupiah } from '../utils/calculations';
import { Save, FolderOpen, Trash2, Calendar } from 'lucide-react';


interface HistoryPanelProps {
  currentState: CalculationState;
  onLoadState: (state: CalculationState) => void;
}

const STORAGE_KEY = 'hpp_calculator_history';

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ currentState, onLoadState }) => {
  const [history, setHistory] = useState<HistoryTemplate[]>([]);
  const [saveName, setSaveName] = useState('');

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Gagal memuat riwayat kalkulasi', e);
      }
    }
  }, []);

  const saveToHistory = (e: React.FormEvent) => {
    e.preventDefault();
    const name = saveName.trim() || currentState.productName || 'Produk Tanpa Nama';
    const report = generateHPPReport(currentState);

    const newTemplate: HistoryTemplate = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      productName: name,
      batchSize: currentState.batchSize,
      totalMaterials: report.totalMaterials,
      totalLabor: report.totalLabor,
      totalOverhead: report.totalOverhead,
      totalProductionCost: report.totalProductionCost,
      hppPerUnit: report.hppPerUnit,
      state: {
        ...currentState,
        productName: name,
      },
    };

    const updated = [newTemplate, ...history];
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSaveName('');
  };

  const deleteFromHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Apakah Anda yakin ingin menghapus kalkulasi ini?')) {
      const updated = history.filter((item) => item.id !== id);
      setHistory(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const loadTemplate = (template: HistoryTemplate) => {
    onLoadState(template.state);
    // Smooth scroll back to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="glass-panel rounded-2xl p-6 glass-panel-hover no-print">
      <h2 className="text-xl font-bold font-sans tracking-tight text-white mb-4 flex items-center gap-2">
        <FolderOpen className="w-5 h-5 text-indigo-400" />
        Draft & Riwayat Kalkulasi
      </h2>
      <p className="text-gray-400 text-xs mb-6">
        Simpan kalkulasi aktif Anda ke penyimpanan lokal browser agar bisa diakses kembali kapan saja.
      </p>

      {/* Save Form */}
      <form onSubmit={saveToHistory} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
          placeholder="Beri nama draf (misal: Keripik Singkong V2)"
          className="flex-grow px-4 py-2.5 text-sm glass-input font-medium"
        />
        <button
          type="submit"
          className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
        >
          <Save className="w-4 h-4" /> Simpan Draf
        </button>
      </form>

      {/* History List */}
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {history.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border border-dashed border-gray-800 rounded-xl">
            <p className="text-sm">Belum ada draf yang disimpan.</p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              onClick={() => loadTemplate(item)}
              className="flex items-center justify-between p-3.5 rounded-xl bg-gray-900/40 hover:bg-gray-850/60 border border-gray-800 hover:border-indigo-500/30 transition-all cursor-pointer group"
            >
              <div className="min-w-0 pr-4">
                <h4 className="text-sm font-bold text-gray-200 group-hover:text-indigo-400 transition-colors truncate">
                  {item.productName}
                </h4>
                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {item.date}
                  </span>
                  <span>Batch: <strong className="text-gray-400 font-mono">{item.batchSize} unit</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 block">HPP / Unit</span>
                  <span className="text-sm font-bold font-mono text-indigo-400">
                    {formatRupiah(item.hppPerUnit)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => deleteFromHistory(item.id, e)}
                  className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Hapus Draf"
                >
                  <Trash2 className="w-3.8 h-3.8" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
