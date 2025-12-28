import { calculateStaff } from '@/lib/restaurant/staff';

describe('Staff Logic', () => {
  it('increases cost when overtime enabled', () => {
    const baseInput = {
      staffPerShift: 5,
      shiftsPerDay: 2,
      avgOrdersPerStaffPerHour: 10,
      wagePerHour: 20,
      hoursPerShift: 8,
      daysPerWeekOpen: 7,
      overtimeEnabled: false,
      overtimeMultiplier: 1.5,
    };

    const normal = calculateStaff(baseInput);
    const overtime = calculateStaff({ ...baseInput, overtimeEnabled: true });

    expect(overtime.weeklyLaborCost).toBeGreaterThan(normal.weeklyLaborCost);
  });

  it('calculates labor percent of sales', () => {
    const result = calculateStaff({
        staffPerShift: 1,
        shiftsPerDay: 1,
        avgOrdersPerStaffPerHour: 10,
        wagePerHour: 10,
        hoursPerShift: 10, // 10 hours * $10 = $100/day = $700/week
        daysPerWeekOpen: 7,
        overtimeEnabled: false,
        overtimeMultiplier: 1.5,
        salesBaselineDaily: 2800, // $2800/week -> $400/day
      });
      // Labor Cost = 700. Sales = 2800. Ratio = 25%
      expect(result.laborPctOfSales).toBeCloseTo(25, 1);
  });
});
