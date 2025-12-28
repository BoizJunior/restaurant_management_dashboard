"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScenarioTabs } from "@/components/dashboard/ScenarioTabs";
import { HorizonSlider } from "@/components/dashboard/HorizonSlider";
import { RiskGauge } from "@/components/dashboard/RiskGauge";
import { KPICard } from "@/components/dashboard/KPICard";
import { SaveControls } from "@/components/shared/SaveControls";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { POS_PRESETS, ScenarioType } from "@/lib/presets";
import { calculatePOS, POSInputs } from "@/lib/restaurant/pos";
import { DollarSign, TrendingUp, Activity } from "lucide-react";

export default function POSDashboard() {
  const [scenario, setScenario] = useState<ScenarioType>('Base');
  const [inputs, setInputs] = useLocalStorage<POSInputs>('pos_inputs', POS_PRESETS.Base);
  
  // Update inputs when scenario changes (but don't overwrite user tweaks unless they explicitly reset?)
  // Actually, UI pattern: Tabs usually switch to that preset.
  const handleScenarioChange = (val: ScenarioType) => {
      setScenario(val);
      setInputs(POS_PRESETS[val]);
  };

  const outputs = calculatePOS(inputs);

  const handleInputChange = (field: keyof POSInputs, val: string) => {
      const num = parseFloat(val);
      if (!isNaN(num)) {
          setInputs(prev => ({ ...prev, [field]: num }));
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">POS & Sales Forecast</h2>
          <p className="text-muted-foreground">Project revenue and analyze peak load stress.</p>
        </div>
        <SaveControls 
            onSave={() => alert("Settings saved!")} // In real app, maybe toast
            onRestore={() => { /* Handled by hook init, but maybe re-read? */ }}
            onReset={() => setInputs(POS_PRESETS[scenario])}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* INPUTS COLUMN */}
        <Card className="md:col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Adjust drivers to see impact.</CardDescription>
            <ScenarioTabs value={scenario} onValueChange={handleScenarioChange} className="mt-4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Avg Daily Trans.</Label>
                 <Input 
                    type="number" 
                    value={inputs.avgDailyTransactions} 
                    onChange={e => handleInputChange('avgDailyTransactions', e.target.value)} 
                 />
               </div>
               <div className="space-y-2">
                 <Label>Avg Ticket ($)</Label>
                 <Input 
                    type="number" 
                    value={inputs.avgTicketSize} 
                    onChange={e => handleInputChange('avgTicketSize', e.target.value)} 
                 />
               </div>
            </div>

            <div className="space-y-2">
                <Label>Channel Mix (%)</Label>
                <div className="grid grid-cols-3 gap-2">
                    <div>
                        <Label className="text-xs text-muted-foreground">Dine-in</Label>
                        <Input type="number" value={inputs.dineInPct} onChange={e => handleInputChange('dineInPct', e.target.value)} />
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground">Delivery</Label>
                        <Input type="number" value={inputs.deliveryPct} onChange={e => handleInputChange('deliveryPct', e.target.value)} />
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground">Takeout</Label>
                        <Input type="number" value={inputs.takeoutPct} onChange={e => handleInputChange('takeoutPct', e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Peak Multiplier</Label>
                    <Input type="number" step="0.1" value={inputs.peakHourMultiplier} onChange={e => handleInputChange('peakHourMultiplier', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Monthly Growth (%)</Label>
                    <Input type="number" value={inputs.monthlyGrowthRate} onChange={e => handleInputChange('monthlyGrowthRate', e.target.value)} />
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

        {/* OUTPUTS COLUMN */}
        <div className="md:col-span-1 lg:col-span-4 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <KPICard 
                    title="Total Projected Revenue" 
                    value={`$${outputs.totalProjectedRevenue.toLocaleString()}`}
                    icon={<DollarSign className="h-4 w-4" />}
                    trend={inputs.monthlyGrowthRate > 0 ? "up" : "neutral"}
                    change={inputs.monthlyGrowthRate}
                />
                <KPICard 
                    title="Peak Transactions/Hr" 
                    value={Math.round(outputs.peakTransactionsPerHour)}
                    icon={<Activity className="h-4 w-4" />}
                    description="Max stress on staff/kitchen"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <RiskGauge 
                    type="Risk" 
                    level={outputs.riskLevel} 
                    description="Based on growth volatility and peak load stress."
                />
                <RiskGauge
                    type="Volatility"
                    level={outputs.volatility > 5 ? 'High' : outputs.volatility > 2 ? 'Medium' : 'Low'}
                    volatility={outputs.volatility}
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Revenue Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                    <RevenueChart data={outputs.monthlyRevenue} />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
