import { calculateMenu } from '@/lib/restaurant/menu';

describe('Menu Logic', () => {
  it('reflects elasticity in profit', () => {
    const base = calculateMenu({
      itemPrice: 100,
      itemCost: 50,
      dailyUnitsSold: 10,
      promoDiscountPct: 0,
      priceElasticity: 1,
      horizonMonths: 1
    });

    const promo = calculateMenu({
      itemPrice: 100,
      itemCost: 50,
      dailyUnitsSold: 10,
      promoDiscountPct: 10, // 10% discount -> Price 90. Volume + 10%.
      priceElasticity: 1.5, // High elasticity -> Volume + 15%
      horizonMonths: 1
    });

    // Base: 10 * (100-50) = 500 profit/day
    // Promo: 11.5 * (90-50) = 11.5 * 40 = 460 profit/day
    // Profit decreased
    expect(promo.projectedProfit).toBeLessThan(base.projectedProfit);
    expect(promo.netPromoImpact).toBe('Negative');
  });

  it('calculates positive promo impact with high margin items', () => {
      // If margin is high, volume increase might outweigh price drop
      const promo = calculateMenu({
        itemPrice: 100,
        itemCost: 10, // 90% margin
        dailyUnitsSold: 10,
        promoDiscountPct: 10, // Price 90
        priceElasticity: 2.0, // Volume + 20% -> 12 units
        horizonMonths: 1
      });
      // Base: 10 * 90 = 900
      // Promo: 12 * 80 = 960
      expect(promo.netPromoImpact).toBe('Positive');
  });
});
