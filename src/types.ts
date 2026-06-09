export interface MaterialItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  total: number;
}

export interface LaborItem {
  id: string;
  role: string;
  workerCount: number;
  wage: number;
  duration: number; // e.g. 5 hours, or 1 day
  durationUnit: 'jam' | 'hari' | 'borongan';
  total: number;
}

export interface OverheadItem {
  id: string;
  name: string;
  amount: number;
}

export interface CalculationState {
  productName: string;
  batchSize: number;
  materials: MaterialItem[];
  labor: LaborItem[];
  overhead: OverheadItem[];
  pricingMethod: 'markup' | 'target';
  targetMarkup: number; // in percentage, e.g. 30 for 30%
  targetSellingPrice: number; // custom selling price
}

export interface HistoryTemplate {
  id: string;
  date: string;
  productName: string;
  batchSize: number;
  totalMaterials: number;
  totalLabor: number;
  totalOverhead: number;
  totalProductionCost: number;
  hppPerUnit: number;
  state: CalculationState;
}
