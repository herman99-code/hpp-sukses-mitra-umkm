import { useState } from 'react';
import type { CalculationState } from './types';
import { MaterialSection } from './components/MaterialSection';
import { LaborSection } from './components/LaborSection';
import { OverheadSection } from './components/OverheadSection';
import { ResultSummary } from './components/ResultSummary';
import { CostChart } from './components/CostChart';
import { HistoryPanel } from './components/HistoryPanel';
import { generateHPPReport } from './utils/calculations';
import { Printer, RotateCcw, Sparkles } from 'lucide-react';


const INITIAL_STATE: CalculationState = {
  productName: 'Keripik Tempe Gurih',
  batchSize: 100,
  materials: [
    {
      id: 'mat-1',
      name: 'Tempe Kedelai Murni',
      quantity: 50,
      unit: 'papan',
      pricePerUnit: 4000,
      total: 200000,
    },
    {
      id: 'mat-2',
      name: 'Minyak Goreng Kelapa',
      quantity: 5,
      unit: 'liter',
      pricePerUnit: 18000,
      total: 90000,
    },
    {
      id: 'mat-3',
      name: 'Bumbu Rempah & Garam',
      quantity: 1,
      unit: 'paket',
      pricePerUnit: 15000,
      total: 15000,
    },
  ],
  labor: [
    {
      id: 'lab-1',
      role: 'Pemotong & Penggoreng',
      workerCount: 1,
      wage: 15000,
      duration: 4,
      durationUnit: 'jam',
      total: 60000,
    },
    {
      id: 'lab-2',
      role: 'Pengemas / Packing',
      workerCount: 1,
      wage: 12000,
      duration: 3,
      durationUnit: 'jam',
      total: 36000,
    },
  ],
  overhead: [
    {
      id: 'ov-1',
      name: 'Kemasan Plastik Standing Pouch',
      amount: 45000,
    },
    {
      id: 'ov-2',
      name: 'Gas LPG 3kg',
      amount: 22000,
    },
  ],
  pricingMethod: 'markup',
  targetMarkup: 35,
  targetSellingPrice: 0,
};

function App() {
  const [state, setState] = useState<CalculationState>(INITIAL_STATE);

  // Generate HPP Report on the fly
  const report = generateHPPReport(state);

  const resetState = () => {
    if (window.confirm('Apakah Anda yakin ingin mengosongkan semua input?')) {
      setState({
        productName: '',
        batchSize: 1,
        materials: [],
        labor: [],
        overhead: [],
        pricingMethod: 'markup',
        targetMarkup: 30,
        targetSellingPrice: 0,
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 select-none">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10 pb-8 border-b border-gray-800/80">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs tracking-widest uppercase">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            UMKM Indonesia Tangguh
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-100 to-indigo-400 bg-clip-text text-transparent !my-0">
            Kalkulator HPP Produk
          </h1>
          <p className="text-gray-400 text-sm max-w-2xl !mt-1">
            Hitung Harga Pokok Penjualan (HPP) produk manufaktur, kuliner, kerajinan tangan, atau jasa Anda dengan rincian biaya real-time.
          </p>
        </div>
        
        {/* Header Actions */}
        <div className="flex gap-3 no-print">
          <button
            type="button"
            onClick={resetState}
            className="py-2.5 px-4 border border-gray-800 hover:border-gray-700 bg-gray-900/30 hover:bg-gray-900/60 active:scale-95 text-gray-300 hover:text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
            title="Kosongkan Semua Input"
          >
            <RotateCcw className="w-3.8 h-3.8" /> Reset
          </button>
          
          <button
            type="button"
            onClick={handlePrint}
            className="py-2.5 px-5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-600/25"
          >
            <Printer className="w-4 h-4" /> Cetak / Unduh PDF
          </button>
        </div>
      </header>

      {/* PRINT-ONLY HEADER */}
      <div className="hidden print-only mb-8 text-black border-b border-gray-300 pb-4">
        <h1 className="text-3xl font-extrabold">LAPORAN HARGA POKOK PENJUALAN (HPP)</h1>
        <p className="text-sm mt-1 text-gray-600">Dibuat menggunakan Kalkulator HPP - Sukses Mitra UMKM</p>
        <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
          <div>
            <span className="block text-gray-500">Nama Produk:</span>
            <span className="font-bold text-base">{state.productName || 'Produk Tanpa Nama'}</span>
          </div>
          <div>
            <span className="block text-gray-500">Ukuran Batch Produksi:</span>
            <span className="font-bold text-base">{state.batchSize} unit</span>
          </div>
        </div>
      </div>

      {/* PRODUCT CONFIGURATION BAR */}
      <div className="glass-panel rounded-2xl p-6 mb-8 flex flex-col md:flex-row gap-6">
        <div className="flex-grow">
          <label htmlFor="productNameInput" className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
            Nama Produk / Jasa
          </label>
          <input
            id="productNameInput"
            type="text"
            value={state.productName}
            onChange={(e) => setState({ ...state, productName: e.target.value })}
            placeholder="Contoh: Keripik Singkong Balado, Hijab Bergo, dll"
            className="w-full px-4 py-2.5 glass-input font-semibold text-white text-base"
          />
        </div>
        
        <div className="w-full md:w-48">
          <label htmlFor="batchSizeInput" className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
            Batch Produksi (Unit)
          </label>
          <div className="relative">
            <input
              id="batchSizeInput"
              type="number"
              min="1"
              value={state.batchSize === 0 ? '' : state.batchSize}
              onChange={(e) => setState({ ...state, batchSize: Math.max(1, parseInt(e.target.value) || 0) })}
              className="w-full px-4 py-2.5 glass-input font-bold font-mono text-base text-center text-indigo-400"
            />
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Cost Inputs (7 Columns) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Materials */}
          <MaterialSection
            items={state.materials}
            onChange={(items) => setState({ ...state, materials: items })}
          />

          {/* Section 2: Labor */}
          <LaborSection
            items={state.labor}
            onChange={(items) => setState({ ...state, labor: items })}
          />

          {/* Section 3: Overhead */}
          <OverheadSection
            items={state.overhead}
            onChange={(items) => setState({ ...state, overhead: items })}
          />
        </div>

        {/* Right Side: Calculations, Charts, and History (5 Columns) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Result / Margin Simulator */}
          <ResultSummary
            state={state}
            report={report}
            onStateChange={setState}
          />

          {/* Cost breakdown charts */}
          <CostChart report={report} />

          {/* Draft History */}
          <HistoryPanel
            currentState={state}
            onLoadState={setState}
          />
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-16 pt-8 border-t border-gray-900/60 text-center text-gray-500 text-xs no-print flex flex-col sm:flex-row justify-between gap-4">
        <div>
          &copy; {new Date().getFullYear()} Sukses Mitra UMKM - Hak Cipta Dilindungi.
        </div>
        <div className="flex gap-4 justify-center">
          <a href="#" className="hover:text-indigo-400 transition-colors">Panduan</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">Kebijakan Privasi</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">Bantuan</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
