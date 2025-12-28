export interface MenuInputs {
  itemPrice: number;
  itemCost: number;
  dailyUnitsSold: number;
  promoDiscountPct: number;
  priceElasticity: number; // 1.0 = unit change proportional to price change
  horizonMonths: number;
}

export interface MenuOutputs {
  grossMarginPct: number;
  projectedProfit: number;
  netPromoImpact: 'Positive' | 'Negative' | 'Neutral';
  riskLevel: 'Low' | 'Medium' | 'High';
}

export function calculateMenu(inputs: MenuInputs): MenuOutputs {
  const {
    itemPrice,
    itemCost,
    dailyUnitsSold,
    promoDiscountPct,
    priceElasticity,
    horizonMonths
  } = inputs;

  const effectivePrice = itemPrice * (1 - promoDiscountPct / 100);
  const priceChangePct = (itemPrice - effectivePrice) / itemPrice;
  
  // Elasticity effect: Drop in price -> Increase in volume
  // Volume change % = Price change % * Elasticity * -1 (but since price change is negative/drop...)
  // If price drops 10%, volume increases 10% * elasticity
  const volumeIncreasePct = (promoDiscountPct / 100) * priceElasticity;
  const effectiveUnitsSold = dailyUnitsSold * (1 + volumeIncreasePct);

  const dailyRevenue = effectiveUnitsSold * effectivePrice;
  const dailyCost = effectiveUnitsSold * itemCost;
  const dailyProfit = dailyRevenue - dailyCost;

  const projectedProfit = dailyProfit * 30 * horizonMonths;
  const grossMarginPct = (dailyProfit / dailyRevenue) * 100;

  // Base comparison
  const baseProfit = (dailyUnitsSold * itemPrice - dailyUnitsSold * itemCost);
  const netPromoImpact = dailyProfit > baseProfit ? 'Positive' : (dailyProfit < baseProfit ? 'Negative' : 'Neutral');

  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  if (grossMarginPct < 20) riskLevel = 'High';
  else if (grossMarginPct < 40) riskLevel = 'Medium';

  return {
    grossMarginPct,
    projectedProfit,
    netPromoImpact,
    riskLevel
  };
}
