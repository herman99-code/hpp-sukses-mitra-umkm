import React from 'react';
import type { HPPReport } from '../utils/calculations';
import { formatRupiah } from '../utils/calculations';
import { PieChart, Info } from 'lucide-react';


interface CostChartProps {
  report: HPPReport;
}

export const CostChart: React.FC<CostChartProps> = ({ report }) => {
  const { totalMaterials, totalLabor, totalOverhead, totalProductionCost } = report;

  const pctMaterials = totalProductionCost > 0 ? (totalMaterials / totalProductionCost) * 100 : 0;
  const pctLabor = totalProductionCost > 0 ? (totalLabor / totalProductionCost) * 100 : 0;
  const pctOverhead = totalProductionCost > 0 ? (totalOverhead / totalProductionCost) * 100 : 0;

  // SVG Donut calculation
  const radius = 50;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius; // ~314.16

  const dashMaterials = (pctMaterials / 100) * circumference;
  const dashLabor = (pctLabor / 100) * circumference;
  const dashOverhead = (pctOverhead / 100) * circumference;

  // Offsets
  const offsetMaterials = 0;
  const offsetLabor = -dashMaterials;
  const offsetOverhead = -(dashMaterials + dashLabor);

  return (
    <div className="glass-panel rounded-2xl p-6 glass-panel-hover flex flex-col h-full">
      <h2 className="text-xl font-bold font-sans tracking-tight text-white mb-6 flex items-center gap-2">
        <PieChart className="w-5 h-5 text-indigo-400" />
        Struktur Biaya Produksi
      </h2>

      {totalProductionCost === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center py-12 text-gray-500">
          <Info className="w-8 h-8 mb-2 text-gray-600" />
          <p className="text-sm">Isi komponen biaya di samping untuk melihat grafik struktur HPP.</p>
        </div>
      ) : (
        <div className="flex-grow flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
          {/* Donut Chart */}
          <div className="relative w-40 h-40">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 120 120"
            >
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="transparent"
                stroke="rgba(31, 41, 55, 0.5)"
                strokeWidth={strokeWidth}
              />
              
              {/* Materials segment */}
              {pctMaterials > 0 && (
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke="#6366f1" // indigo-500
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${dashMaterials} ${circumference - dashMaterials}`}
                  strokeDashoffset={offsetMaterials}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out"
                />
              )}

              {/* Labor segment */}
              {pctLabor > 0 && (
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke="#ec4899" // pink-500
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${dashLabor} ${circumference - dashLabor}`}
                  strokeDashoffset={offsetLabor}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out"
                />
              )}

              {/* Overhead segment */}
              {pctOverhead > 0 && (
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke="#10b981" // emerald-500
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${dashOverhead} ${circumference - dashOverhead}`}
                  strokeDashoffset={offsetOverhead}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out"
                />
              )}
            </svg>
            
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">HPP Unit</span>
              <span className="text-xs font-bold text-gray-300 font-mono mt-0.5">
                {formatRupiah(report.hppPerUnit)}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-grow space-y-4 w-full sm:w-auto">
            {/* Materials Legend */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-md bg-indigo-500 inline-block"></span>
                <div>
                  <span className="text-xs font-semibold text-gray-300 block">Bahan Baku</span>
                  <span className="text-[10px] text-gray-400 font-medium font-mono">
                    {formatRupiah(totalMaterials)}
                  </span>
                </div>
              </div>
              <span className="text-sm font-extrabold text-indigo-400 font-mono">{pctMaterials.toFixed(1)}%</span>
            </div>

            {/* Labor Legend */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-pink-500/5 border border-pink-500/10">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-md bg-pink-500 inline-block"></span>
                <div>
                  <span className="text-xs font-semibold text-gray-300 block">Tenaga Kerja</span>
                  <span className="text-[10px] text-gray-400 font-medium font-mono">
                    {formatRupiah(totalLabor)}
                  </span>
                </div>
              </div>
              <span className="text-sm font-extrabold text-pink-400 font-mono">{pctLabor.toFixed(1)}%</span>
            </div>

            {/* Overhead Legend */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 inline-block"></span>
                <div>
                  <span className="text-xs font-semibold text-gray-300 block">Overhead</span>
                  <span className="text-[10px] text-gray-400 font-medium font-mono">
                    {formatRupiah(totalOverhead)}
                  </span>
                </div>
              </div>
              <span className="text-sm font-extrabold text-emerald-400 font-mono">{pctOverhead.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
