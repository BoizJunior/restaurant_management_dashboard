export interface InventoryInputs {
  currentStock: number;
  dailyUsageRate: number;
  leadTimeDays: number;
  safetyStock: number;
  wasteRatePct: number;
  unitCost: number;
  horizonMonths: number;
}

export interface InventoryOutputs {
  daysOfCoverage: number;
  reorderPoint: number;
  stockoutRisk: boolean;
  totalWasteCost: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export function calculateInventory(inputs: InventoryInputs): InventoryOutputs {
  const {
    currentStock,
    dailyUsageRate,
    leadTimeDays,
    safetyStock,
    wasteRatePct,
    unitCost,
    horizonMonths
  } = inputs;

  const daysOfCoverage = dailyUsageRate > 0 ? currentStock / dailyUsageRate : 999;
  const reorderPoint = (dailyUsageRate * leadTimeDays) + safetyStock;
  
  // Stockout risk if coverage is getting close to lead time without buffer
  // If (Current Stock - Usage * LeadTime) < SafetyStock
  // Actually simpler: if DaysCoverage < LeadTime + (SafetyStock/Usage)
  const safeDays = safetyStock / (dailyUsageRate || 1);
  const stockoutRisk = daysOfCoverage < (leadTimeDays + safeDays * 0.5); // Risk if below half safety buffer

  // Waste cost projection
  const monthlyUsage = dailyUsageRate * 30;
  const monthlyWaste = monthlyUsage * (wasteRatePct / 100);
  const totalWasteUnits = monthlyWaste * horizonMonths;
  const totalWasteCost = totalWasteUnits * unitCost;

  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  if (stockoutRisk || daysOfCoverage < leadTimeDays) riskLevel = 'High';
  else if (daysOfCoverage < leadTimeDays + safeDays) riskLevel = 'Medium';

  return {
    daysOfCoverage,
    reorderPoint,
    stockoutRisk,
    totalWasteCost,
    riskLevel
  };
}
