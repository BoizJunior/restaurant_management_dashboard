import { calculatePOS } from '@/lib/restaurant/pos';

describe('POS Logic', () => {
  it('calculates revenue correctly for base case', () => {
    const result = calculatePOS({
      avgDailyTransactions: 100,
      avgTicketSize: 50,
      dineInPct: 50,
      deliveryPct: 30,
      takeoutPct: 20,
      peakHourMultiplier: 1.5,
      monthlyGrowthRate: 0,
      horizonMonths: 1
    });
    // 100 * 50 = 5000 / day * 30 = 150000
    expect(result.totalProjectedRevenue).toBe(150000);
    expect(result.monthlyRevenue).toHaveLength(1);
    expect(result.monthlyRevenue[0]).toBe(150000);
  });

  it('handles growth rate correctly', () => {
    const result = calculatePOS({
      avgDailyTransactions: 100,
      avgTicketSize: 10,
      dineInPct: 100,
      deliveryPct: 0,
      takeoutPct: 0,
      peakHourMultiplier: 1,
      monthlyGrowthRate: 10,
      horizonMonths: 2
    });
    // Month 1: 1000 * 30 = 30000
    // Month 2: 30000 * 1.1 = 33000
    expect(result.monthlyRevenue[0]).toBe(30000);
    expect(result.monthlyRevenue[1]).toBe(33000);
    expect(result.totalProjectedRevenue).toBe(63000);
  });

  it('identifies high risk due to peak load', () => {
    const result = calculatePOS({
        avgDailyTransactions: 2000, // 200/hr avg
        avgTicketSize: 10,
        dineInPct: 100,
        deliveryPct: 0,
        takeoutPct: 0,
        peakHourMultiplier: 1.0,
        monthlyGrowthRate: 0,
        horizonMonths: 1
      });
      // 200/hr > 150/hr threshold
      expect(result.riskLevel).toBe('High');
  });
});
