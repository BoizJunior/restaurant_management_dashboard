"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScenarioTabs } from "@/components/dashboard/ScenarioTabs";
import { HorizonSlider } from "@/components/dashboard/HorizonSlider";
import { RiskGauge } from "@/components/dashboard/RiskGauge";
import { KPICard } from "@/components/dashboard/KPICard";
import { SaveControls } from "@/components/shared/SaveControls";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { INVENTORY_PRESETS, ScenarioType } from "@/lib/presets";
import { calculateInventory, InventoryInputs } from "@/lib/restaurant/inventory";
import { Archive, AlertTriangle, Trash2 } from "lucide-react";

export default function InventoryDashboard() {
  const [scenario, setScenario] = useState<ScenarioType>('Base');
  const [inputs, setInputs] = useLocalStorage<InventoryInputs>('inventory_inputs', INVENTORY_PRESETS.Base);
  
  const handleScenarioChange = (val: ScenarioType) => {
      setScenario(val);
      setInputs(INVENTORY_PRESETS[val]);
  };

  const outputs = calculateInventory(inputs);

  const handleInputChange = (field: keyof InventoryInputs, val: string) => {
      const num = parseFloat(val);
      if (!isNaN(num)) {
          setInputs(prev => ({ ...prev, [field]: num }));
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
          <p className="text-muted-foreground">Optimize stock levels and minimize waste.</p>
        </div>
        <SaveControls 
            onSave={() => alert("Settings saved!")}
            onRestore={() => {}}
            onReset={() => setInputs(INVENTORY_PRESETS[scenario])}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Inventory Controls</CardTitle>
            <ScenarioTabs value={scenario} onValueChange={handleScenarioChange} className="mt-4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Current Stock</Label>
                 <Input type="number" value={inputs.currentStock} onChange={e => handleInputChange('currentStock', e.target.value)} />
               </div>
               <div className="space-y-2">
                 <Label>Daily Usage</Label>
                 <Input type="number" value={inputs.dailyUsageRate} onChange={e => handleInputChange('dailyUsageRate', e.target.value)} />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Lead Time (Days)</Label>
                 <Input type="number" value={inputs.leadTimeDays} onChange={e => handleInputChange('leadTimeDays', e.target.value)} />
               </div>
               <div className="space-y-2">
                 <Label>Safety Stock</Label>
                 <Input type="number" value={inputs.safetyStock} onChange={e => handleInputChange('safetyStock', e.target.value)} />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Waste Rate (%)</Label>
                 <Input type="number" value={inputs.wasteRatePct} onChange={e => handleInputChange('wasteRatePct', e.target.value)} />
               </div>
               <div className="space-y-2">
                 <Label>Unit Cost ($)</Label>
                 <Input type="number" value={inputs.unitCost} onChange={e => handleInputChange('unitCost', e.target.value)} />
               </div>
            </div>

            <div className="pt-4">
                 <HorizonSlider 
                    value={inputs.horizonMonths} 
                    onChange={(val) => setInputs(prev => ({...prev, horizonMonths: val}))} 
                 />
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-1 lg:col-span-4 space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <KPICard 
                    title="Days Coverage" 
                    value={outputs.daysOfCoverage.toFixed(1)}
                    icon={<Archive className="h-4 w-4" />}
                    description={`Lead time: ${inputs.leadTimeDays}d`}
                />
                <KPICard 
                    title="Reorder Point" 
                    value={Math.round(outputs.reorderPoint)}
                    icon={<AlertTriangle className="h-4 w-4" />}
                    description="Units"
                />
                <KPICard 
                    title="Est. Waste Cost" 
                    value={`$${outputs.totalWasteCost.toLocaleString()}`}
                    icon={<Trash2 className="h-4 w-4" />}
                    description={`Over ${inputs.horizonMonths} months`}
                />
            </div>

            <RiskGauge 
                type="Risk" 
                level={outputs.riskLevel} 
                description={outputs.stockoutRisk ? "High stockout risk detected!" : "Coverage adequate."}
            />

            <Card>
                <CardHeader>
                    <CardTitle>Stock Status</CardTitle>
                    <CardDescription>
                        {outputs.stockoutRisk 
                            ? "CRITICAL: Current stock is insufficient to cover lead time." 
                            : "Stock levels are healthy relative to lead time and usage."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-4 w-full bg-secondary rounded-full overflow-hidden relative">
                        {/* Visual bar of stock vs reorder point */}
                        <div 
                            className="h-full bg-primary transition-all" 
                            style={{ width: `${Math.min(100, (inputs.currentStock / 2000) * 100)}%` }} // Visual approximation
                        />
                        <div 
                             className="absolute top-0 bottom-0 w-1 bg-red-500"
                             style={{ left: `${Math.min(100, (outputs.reorderPoint / 2000) * 100)}%` }}
                             title="Reorder Point"
                        />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>0</span>
                        <span>ROP: {outputs.reorderPoint}</span>
                        <span>Max Capacity (est)</span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
