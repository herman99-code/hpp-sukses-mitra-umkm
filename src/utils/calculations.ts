import type { CalculationState } from '../types';


export const calculateMaterialTotal = (quantity: number, pricePerUnit: number): number => {
  const q = quantity || 0;
  const p = pricePerUnit || 0;
  return q * p;
};

export const calculateLaborTotal = (
  workerCount: number,
  wage: number,
  duration: number,
  durationUnit: 'jam' | 'hari' | 'borongan'
): number => {
  const count = workerCount || 0;
  const rate = wage || 0;
  const time = duration || 0;

  if (durationUnit === 'borongan') {
    return rate; // Flat fee
  }
  return count * rate * time;
};

export const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export interface HPPReport {
  totalMaterials: number;
  totalLabor: number;
  totalOverhead: number;
  totalProductionCost: number;
  hppPerUnit: number;
  sellingPrice: number;
  profitPerUnit: number;
  totalProfit: number;
  marginPercent: number;
  markupPercent: number;
}

export const generateHPPReport = (state: CalculationState): HPPReport => {
  const batchSize = Math.max(1, state.batchSize || 1);

  // Sum Materials
  const totalMaterials = state.materials.reduce((sum, item) => sum + (item.total || 0), 0);

  // Sum Labor
  const totalLabor = state.labor.reduce((sum, item) => sum + (item.total || 0), 0);

  // Sum Overhead
  const totalOverhead = state.overhead.reduce((sum, item) => sum + (item.amount || 0), 0);

  // Total Production Cost
  const totalProductionCost = totalMaterials + totalLabor + totalOverhead;

  // HPP per unit
  const hppPerUnit = totalProductionCost / batchSize;

  let sellingPrice = 0;
  let markupPercent = 0;
  let marginPercent = 0;

  if (state.pricingMethod === 'markup') {
    markupPercent = state.targetMarkup || 0;
    sellingPrice = hppPerUnit * (1 + markupPercent / 100);
    const profit = sellingPrice - hppPerUnit;
    marginPercent = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
  } else {
    sellingPrice = state.targetSellingPrice || 0;
    const profit = sellingPrice - hppPerUnit;
    markupPercent = hppPerUnit > 0 ? (profit / hppPerUnit) * 100 : 0;
    marginPercent = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
  }

  const profitPerUnit = sellingPrice - hppPerUnit;
  const totalProfit = profitPerUnit * (state.batchSize || 0);

  return {
    totalMaterials,
    totalLabor,
    totalOverhead,
    totalProductionCost,
    hppPerUnit,
    sellingPrice,
    profitPerUnit,
    totalProfit,
    marginPercent,
    markupPercent,
  };
};
