import { calculateInventory } from '@/lib/restaurant/inventory';

describe('Inventory Logic', () => {
  it('calculates correct ROP', () => {
    const result = calculateInventory({
      currentStock: 100,
      dailyUsageRate: 10,
      leadTimeDays: 5,
      safetyStock: 20,
      wasteRatePct: 0,
      unitCost: 1,
      horizonMonths: 1
    });
    // ROP = usage(10)*lead(5) + safety(20) = 70
    expect(result.reorderPoint).toBe(70);
  });

  it('flags stockout risk when coverage is low', () => {
    const result = calculateInventory({
      currentStock: 40,
      dailyUsageRate: 10,
      leadTimeDays: 5,
      safetyStock: 10,
      wasteRatePct: 0,
      unitCost: 1,
      horizonMonths: 1
    });
    // Coverage = 4 days. Lead Time = 5 days.
    // Stockout risk should be true
    expect(result.stockoutRisk).toBe(true);
    expect(result.riskLevel).toBe('High');
  });

  it('calculates waste cost', () => {
    const result = calculateInventory({
        currentStock: 1000,
        dailyUsageRate: 100,
        leadTimeDays: 1,
        safetyStock: 10,
        wasteRatePct: 5, // 5%
        unitCost: 10,
        horizonMonths: 1
      });
      // MUsage = 3000. Waste = 150 units. Cost = 1500.
      expect(result.totalWasteCost).toBe(1500);
  });
});
