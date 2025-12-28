import { InventoryInputs } from "./restaurant/inventory";
import { MenuInputs } from "./restaurant/menu";
import { POSInputs } from "./restaurant/pos";
import { StaffInputs } from "./restaurant/staff";

export type ScenarioType = 'Conservative' | 'Base' | 'Aggressive';

export const POS_PRESETS: Record<ScenarioType, POSInputs> = {
  Conservative: {
    avgDailyTransactions: 80,
    avgTicketSize: 45,
    dineInPct: 60,
    deliveryPct: 20,
    takeoutPct: 20,
    peakHourMultiplier: 1.2,
    monthlyGrowthRate: 2,
    horizonMonths: 12
  },
  Base: {
    avgDailyTransactions: 100,
    avgTicketSize: 50,
    dineInPct: 50,
    deliveryPct: 30,
    takeoutPct: 20,
    peakHourMultiplier: 1.5,
    monthlyGrowthRate: 5,
    horizonMonths: 12
  },
  Aggressive: {
    avgDailyTransactions: 120,
    avgTicketSize: 55,
    dineInPct: 40,
    deliveryPct: 40,
    takeoutPct: 20,
    peakHourMultiplier: 2.0,
    monthlyGrowthRate: 10,
    horizonMonths: 12
  }
};

export const INVENTORY_PRESETS: Record<ScenarioType, InventoryInputs> = {
  Conservative: {
    currentStock: 1000,
    dailyUsageRate: 50,
    leadTimeDays: 7,
    safetyStock: 200, // High safety
    wasteRatePct: 2,
    unitCost: 10,
    horizonMonths: 12
  },
  Base: {
    currentStock: 800,
    dailyUsageRate: 50,
    leadTimeDays: 5,
    safetyStock: 100,
    wasteRatePct: 5,
    unitCost: 10,
    horizonMonths: 12
  },
  Aggressive: {
    currentStock: 400, // Lean inventory
    dailyUsageRate: 60,
    leadTimeDays: 3,
    safetyStock: 50,
    wasteRatePct: 8, // Higher waste risk w/ aggressive sales?
    unitCost: 10,
    horizonMonths: 12
  }
};

export const STAFF_PRESETS: Record<ScenarioType, StaffInputs> = {
    Conservative: {
        staffPerShift: 4,
        shiftsPerDay: 2,
        avgOrdersPerStaffPerHour: 8,
        wagePerHour: 15,
        hoursPerShift: 8,
        daysPerWeekOpen: 7,
        overtimeEnabled: false,
        overtimeMultiplier: 1.5
    },
    Base: {
        staffPerShift: 3,
        shiftsPerDay: 2,
        avgOrdersPerStaffPerHour: 10, // Higher efficiency
        wagePerHour: 18,
        hoursPerShift: 8,
        daysPerWeekOpen: 7,
        overtimeEnabled: true,
        overtimeMultiplier: 1.5
    },
    Aggressive: {
        staffPerShift: 2, // Minimal staff
        shiftsPerDay: 2,
        avgOrdersPerStaffPerHour: 15, // Pushing limits
        wagePerHour: 20,
        hoursPerShift: 8,
        daysPerWeekOpen: 7,
        overtimeEnabled: true,
        overtimeMultiplier: 1.5
    }
};

export const MENU_PRESETS: Record<ScenarioType, MenuInputs> = {
    Conservative: {
        itemPrice: 20,
        itemCost: 8,
        dailyUnitsSold: 30,
        promoDiscountPct: 0,
        priceElasticity: 0.5,
        horizonMonths: 12
    },
    Base: {
        itemPrice: 20,
        itemCost: 8,
        dailyUnitsSold: 40,
        promoDiscountPct: 10,
        priceElasticity: 1.2,
        horizonMonths: 12
    },
    Aggressive: {
        itemPrice: 18, // Lower price to drive volume
        itemCost: 8,
        dailyUnitsSold: 60,
        promoDiscountPct: 20,
        priceElasticity: 2.0,
        horizonMonths: 12
    }
}
