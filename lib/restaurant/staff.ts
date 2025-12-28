export interface StaffInputs {
  staffPerShift: number;
  shiftsPerDay: number;
  avgOrdersPerStaffPerHour: number; // Capacity
  wagePerHour: number;
  hoursPerShift: number; // typically 8
  daysPerWeekOpen: number; // typically 7
  overtimeEnabled: boolean;
  overtimeMultiplier: number; // e.g. 1.5
  salesBaselineDaily?: number; // Optional link to POS
  targetLaborPct?: number; // e.g. 25%
}

export interface StaffOutputs {
  weeklyLaborCost: number;
  recommendedStaff: number; // based on capacity vs sales (if sales provided)
  laborPctOfSales: number | null;
  riskLevel: 'Low' | 'Medium' | 'High';
  coverageGap: boolean;
}

export function calculateStaff(inputs: StaffInputs): StaffOutputs {
  const {
    staffPerShift,
    shiftsPerDay,
    wagePerHour,
    hoursPerShift,
    daysPerWeekOpen,
    overtimeEnabled,
    overtimeMultiplier,
    salesBaselineDaily,
    targetLaborPct,
    avgOrdersPerStaffPerHour
  } = inputs;

  const totalWeeklyHours = staffPerShift * shiftsPerDay * hoursPerShift * daysPerWeekOpen;
  
  // Simple overtime logic: if > 40 hours/person/week? taking simplistic view here
  // Instead, assume overtime applied to 10% of hours if enabled for modeling
  const effectiveWage = overtimeEnabled 
    ? wagePerHour * (0.9 + 0.1 * overtimeMultiplier) 
    : wagePerHour;

  const weeklyLaborCost = totalWeeklyHours * effectiveWage;

  let laborPctOfSales: number | null = null;
  let recommendedStaff = staffPerShift;

  if (salesBaselineDaily && salesBaselineDaily > 0) {
    const weeklySales = salesBaselineDaily * 7;
    laborPctOfSales = (weeklyLaborCost / weeklySales) * 100;
  }

  // Coverage Risk
  // If sales baseline exists, calculate needed staff based on capacity
  // Orders/Day approx Sales/Ticket? 
  // Let's assume we don't have ticket size here, so use a simple heuristic if labor % is high
  
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  let coverageGap = false;

  if (laborPctOfSales !== null) {
      if (laborPctOfSales > (targetLaborPct || 30) + 5) {
          riskLevel = 'High'; // High cost
      } else if (laborPctOfSales > (targetLaborPct || 30)) {
          riskLevel = 'Medium';
      }
  }

  return {
    weeklyLaborCost,
    recommendedStaff,
    laborPctOfSales,
    riskLevel,
    coverageGap
  };
}
