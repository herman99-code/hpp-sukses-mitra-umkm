import React from 'react';
import type { CalculationState } from '../types';
import type { HPPReport } from '../utils/calculations';
import { formatRupiah } from '../utils/calculations';
import { Calculator } from 'lucide-react';


interface ResultSummaryProps {
  state: CalculationState;
  report: HPPReport;
  onStateChange: (state: CalculationState) => void;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({ state, report, onStateChange }) => {
  const setPricingMethod = (method: 'markup' | 'target') => {
    onStateChange({ ...state, pricingMethod: method });
  };

  const updateMarkup = (val: number) => {
    onStateChange({ ...state, targetMarkup: val });
  };

  const updateSellingPrice = (val: number) => {
    onStateChange({ ...state, targetSellingPrice: val });
  };

  const markupPresets = [10, 20, 30, 50, 100];

  return (
    <div className="space-y-6">
      {/* 1. Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Cost Card */}
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-indigo-500 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Biaya Produksi</span>
            <h3 className="text-2xl font-extrabold font-mono mt-1 text-white">
              {formatRupiah(report.totalProductionCost)}
            </h3>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-800 text-[11px] text-gray-500 flex justify-between">
            <span>Bahan + Tenaga Kerja + Overhead</span>
            <span className="font-mono text-gray-400">100%</span>
          </div>
        </div>

        {/* HPP per Unit Card */}
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-violet-500 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">HPP / Unit</span>
            <h3 className="text-2xl font-extrabold font-mono mt-1 text-violet-400">
              {formatRupiah(report.hppPerUnit)}
            </h3>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-800 text-[11px] text-gray-500 flex justify-between">
            <span>Ukuran Batch: <strong className="text-gray-300 font-mono">{state.batchSize} unit</strong></span>
            <span>Total / Batch</span>
          </div>
        </div>

        {/* Suggested Selling Price Card */}
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-emerald-500 flex flex-col justify-between md:col-span-2 lg:col-span-1">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Harga Jual Disarankan</span>
            <h3 className="text-2xl font-extrabold font-mono mt-1 text-emerald-400">
              {formatRupiah(report.sellingPrice)}
            </h3>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-800 text-[11px] text-gray-500 flex justify-between">
            <span>Margin Laba: <strong className="text-emerald-400 font-mono">{report.marginPercent.toFixed(1)}%</strong></span>
            <span>Markup: <strong className="text-violet-400 font-mono">{report.markupPercent.toFixed(0)}%</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Dynamic Pricing Simulator Card */}
      <div className="glass-panel rounded-2xl p-6 glass-panel-hover">
        <h2 className="text-xl font-bold font-sans tracking-tight text-white mb-6 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-400" />
          Simulasi Harga Jual & Profit
        </h2>

        {/* Toggle pricing method */}
        <div className="flex bg-gray-900/60 p-1 rounded-xl mb-6 max-w-md border border-gray-800">
          <button
            type="button"
            onClick={() => setPricingMethod('markup')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              state.pricingMethod === 'markup'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Cost-Plus Markup (%)
          </button>
          <button
            type="button"
            onClick={() => setPricingMethod('target')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              state.pricingMethod === 'target'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Target Harga Jual (Rp)
          </button>
        </div>

        {/* Input fields depending on method */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-7 space-y-4">
            {state.pricingMethod === 'markup' ? (
              <div>
                <label className="text-sm font-semibold text-gray-300 block mb-2">
                  Markup Target (%)
                </label>
                <div className="flex gap-4 items-center">
                  <div className="relative flex-grow">
                    <input
                      type="number"
                      min="0"
                      value={state.targetMarkup}
                      onChange={(e) => updateMarkup(parseFloat(e.target.value) || 0)}
                      className="w-full pr-10 pl-4 py-2.5 glass-input font-bold font-mono text-lg text-indigo-400"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-500">%</span>
                  </div>
                  <div className="flex gap-1.5 flex-wrap no-print">
                    {markupPresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => updateMarkup(preset)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                          state.targetMarkup === preset
                            ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400'
                            : 'border-gray-800 hover:border-gray-700 text-gray-400 hover:text-gray-300'
                        }`}
                      >
                        +{preset}%
                      </button>
                    ))}
                  </div>
                </div>
                {/* Markup slider */}
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="5"
                  value={state.targetMarkup}
                  onChange={(e) => updateMarkup(parseInt(e.target.value) || 0)}
                  className="w-full mt-4 h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 no-print"
                />
              </div>
            ) : (
              <div>
                <label className="text-sm font-semibold text-gray-300 block mb-2">
                  Target Harga Jual per Unit (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-500 text-sm">Rp</span>
                  <input
                    type="number"
                    min="0"
                    value={state.targetSellingPrice === 0 ? '' : state.targetSellingPrice}
                    onChange={(e) => updateSellingPrice(parseInt(e.target.value) || 0)}
                    placeholder="Masukkan target harga jual..."
                    className="w-full pl-10 pr-4 py-2.5 glass-input font-bold font-mono text-lg text-emerald-400"
                  />
                </div>
                {report.sellingPrice < report.hppPerUnit && report.sellingPrice > 0 && (
                  <p className="text-xs text-red-400 mt-2 font-medium">
                    ⚠️ Harga jual lebih kecil dari HPP! Anda akan mengalami kerugian.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Results column */}
          <div className="md:col-span-5 bg-gray-950/40 border border-gray-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-800/60">
              <span className="text-xs font-semibold text-gray-400">Laba / Unit</span>
              <span className={`text-base font-bold font-mono ${report.profitPerUnit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {report.profitPerUnit < 0 ? '-' : ''}{formatRupiah(Math.abs(report.profitPerUnit))}
              </span>
            </div>
            
            <div className="flex justify-between items-center pb-3 border-b border-gray-800/60">
              <span className="text-xs font-semibold text-gray-400">Total Profit Batch ({state.batchSize} Unit)</span>
              <span className={`text-base font-bold font-mono ${report.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {report.totalProfit < 0 ? '-' : ''}{formatRupiah(Math.abs(report.totalProfit))}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-gray-400">Profit Margin (GPM)</span>
              <div className="text-right">
                <span className={`text-base font-extrabold ${report.marginPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {report.marginPercent.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Visual Margin Bar */}
            <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  report.marginPercent >= 40
                    ? 'bg-emerald-500'
                    : report.marginPercent >= 20
                    ? 'bg-indigo-500'
                    : report.marginPercent > 0
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, report.marginPercent))}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
