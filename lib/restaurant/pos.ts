export interface POSInputs {
  avgDailyTransactions: number;
  avgTicketSize: number;
  dineInPct: number;
  deliveryPct: number;
  takeoutPct: number;
  peakHourMultiplier: number;
  monthlyGrowthRate: number;
  horizonMonths: number;
}

export interface POSOutputs {
  monthlyRevenue: number[];
  totalProjectedRevenue: number;
  peakTransactionsPerHour: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  volatility: number; 
}

export function calculatePOS(inputs: POSInputs): POSOutputs {
  const {
    avgDailyTransactions,
    avgTicketSize,
    peakHourMultiplier,
    monthlyGrowthRate,
    horizonMonths,
  } = inputs;

  const validHorizon = Math.max(1, Math.min(24, horizonMonths));
  const dailyBaseRevenue = avgDailyTransactions * avgTicketSize;
  const monthlyRevenue: number[] = [];
  
  let currentMonthlyRevenue = dailyBaseRevenue * 30; // approx 30 days
  let totalRevenue = 0;

  for (let i = 0; i < validHorizon; i++) {
    monthlyRevenue.push(currentMonthlyRevenue);
    totalRevenue += currentMonthlyRevenue;
    currentMonthlyRevenue *= (1 + monthlyGrowthRate / 100);
  }

  // Peak load: Assume peak hour is applying multiplier to average hourly load (assuming 10 operating hours)
  const avgHourlyTransactions = avgDailyTransactions / 10;
  const peakTransactionsPerHour = avgHourlyTransactions * peakHourMultiplier;

  // Risk Rule: 
  // High: Growth > 10% (volatile) or Peak load > 150/hr (stress)
  // Medium: Growth > 5% or Peak load > 80/hr
  // Low: Else
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  if (monthlyGrowthRate > 10 || peakTransactionsPerHour > 150) riskLevel = 'High';
  else if (monthlyGrowthRate > 5 || peakTransactionsPerHour > 80) riskLevel = 'Medium';

  return {
    monthlyRevenue,
    totalProjectedRevenue: totalRevenue,
    peakTransactionsPerHour,
    riskLevel,
    volatility: Math.abs(monthlyGrowthRate),
  };
}
