"use client";

import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { calculatePOS, POSInputs } from "@/lib/restaurant/pos";
import { calculateInventory, InventoryInputs } from "@/lib/restaurant/inventory";
import { calculateStaff, StaffInputs } from "@/lib/restaurant/staff";
import { calculateMenu, MenuInputs } from "@/lib/restaurant/menu";
import { POS_PRESETS, INVENTORY_PRESETS, STAFF_PRESETS, MENU_PRESETS } from "@/lib/presets";
import { GitCompare } from "lucide-react";

type ModuleType = 'POS' | 'Inventory' | 'Staff' | 'Menu';

export function CompareSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [moduleA, setModuleA] = useState<ModuleType>('POS');
  const [moduleB, setModuleB] = useState<ModuleType>('Staff');
  const [data, setData] = useState<any>({});

  const loadData = () => {
    if (typeof window !== 'undefined') {
        const getStore = (key: string, preset: any) => {
            try {
                const item = window.localStorage.getItem(key);
                return item ? JSON.parse(item) : preset;
            } catch { return preset; }
        };

        setData({
            POS: getStore('pos_inputs', POS_PRESETS.Base),
            Inventory: getStore('inventory_inputs', INVENTORY_PRESETS.Base),
            Staff: getStore('staff_inputs', STAFF_PRESETS.Base),
            Menu: getStore('menu_inputs', MENU_PRESETS.Base),
        });
    }
  };

  useEffect(() => {
    if (isOpen) {
        loadData();
    }
  }, [isOpen]);

  const renderModuleStats = (type: ModuleType) => {
    const inputs = data[type];
    if (!inputs) return null;

    let kpis = [];
    if (type === 'POS') {
        const out = calculatePOS(inputs as POSInputs);
        kpis = [
            { label: 'Revenue', val: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: "compact", maximumFractionDigits: 2 }).format(out.totalProjectedRevenue) },
            { label: 'Risk', val: out.riskLevel },
            { label: 'Peak Load', val: Math.round(out.peakTransactionsPerHour) }
        ];
    } else if (type === 'Inventory') {
        const out = calculateInventory(inputs as InventoryInputs);
        kpis = [
            { label: 'Days Coverage', val: out.daysOfCoverage.toFixed(1) },
            { label: 'Stockout Risk', val: out.stockoutRisk ? 'Yes' : 'No' },
            { label: 'Waste', val: `$${out.totalWasteCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}` }
        ];
    } else if (type === 'Staff') {
        const out = calculateStaff(inputs as StaffInputs);
        kpis = [
            { label: 'Labor Cost', val: `$${out.weeklyLaborCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}` },
            { label: 'Rec. Staff', val: out.recommendedStaff },
            { label: 'Risk', val: out.riskLevel }
        ];
    } else {
        const out = calculateMenu(inputs as MenuInputs);
        kpis = [
            { label: 'Margin', val: `${out.grossMarginPct.toFixed(1)}%` },
            { label: 'Impact', val: out.netPromoImpact },
            { label: 'Profit', val: `$${out.projectedProfit.toLocaleString()}` }
        ];
    }

    return (
        <div className="space-y-4">
            {kpis.map((k, i) => (
                <div key={i} className="flex justify-between items-center border-b pb-2">
                    <span className="text-sm text-muted-foreground">{k.label}</span>
                    <span className="font-bold">{k.val}</span>
                </div>
            ))}
        </div>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="hidden md:flex">
             <GitCompare className="mr-2 h-4 w-4" />
             Compare
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Cross-Module Comparison</SheetTitle>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="space-y-4">
                <Select value={moduleA} onValueChange={(v: ModuleType) => setModuleA(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="POS">POS & Sales</SelectItem>
                        <SelectItem value="Inventory">Inventory</SelectItem>
                        <SelectItem value="Staff">Staff</SelectItem>
                        <SelectItem value="Menu">Menu</SelectItem>
                    </SelectContent>
                </Select>
                <Card><CardContent className="pt-6">{renderModuleStats(moduleA)}</CardContent></Card>
            </div>

            <div className="space-y-4">
                <Select value={moduleB} onValueChange={(v: ModuleType) => setModuleB(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="POS">POS & Sales</SelectItem>
                        <SelectItem value="Inventory">Inventory</SelectItem>
                        <SelectItem value="Staff">Staff</SelectItem>
                        <SelectItem value="Menu">Menu</SelectItem>
                    </SelectContent>
                </Select>
                <Card><CardContent className="pt-6">{renderModuleStats(moduleB)}</CardContent></Card>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
