"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScenarioTabs } from "@/components/dashboard/ScenarioTabs";
import { HorizonSlider } from "@/components/dashboard/HorizonSlider";
import { RiskGauge } from "@/components/dashboard/RiskGauge";
import { KPICard } from "@/components/dashboard/KPICard";
import { SaveControls } from "@/components/shared/SaveControls";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { MENU_PRESETS, ScenarioType } from "@/lib/presets";
import { calculateMenu, MenuInputs } from "@/lib/restaurant/menu";
import { Tag, TrendingUp, Percent } from "lucide-react";

export default function MenuPricingDashboard() {
  const [scenario, setScenario] = useState<ScenarioType>('Base');
  const [inputs, setInputs] = useLocalStorage<MenuInputs>('menu_inputs', MENU_PRESETS.Base);
  
  const handleScenarioChange = (val: ScenarioType) => {
      setScenario(val);
      setInputs(MENU_PRESETS[val]);
  };

  const outputs = calculateMenu(inputs);

  const handleInputChange = (field: keyof MenuInputs, val: string) => {
      const num = parseFloat(val);
      if (!isNaN(num)) {
          setInputs(prev => ({ ...prev, [field]: num }));
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Menu Engineering</h2>
          <p className="text-muted-foreground">Simulate pricing strategies and promo impacts.</p>
        </div>
        <SaveControls 
            onSave={() => alert("Settings saved!")}
            onRestore={() => {}}
            onReset={() => setInputs(MENU_PRESETS[scenario])}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Pricing Model</CardTitle>
            <ScenarioTabs value={scenario} onValueChange={handleScenarioChange} className="mt-4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Item Price ($)</Label>
                 <Input type="number" value={inputs.itemPrice} onChange={e => handleInputChange('itemPrice', e.target.value)} />
               </div>
               <div className="space-y-2">
                 <Label>Item Cost (COGS)</Label>
                 <Input type="number" value={inputs.itemCost} onChange={e => handleInputChange('itemCost', e.target.value)} />
               </div>
            </div>

            <div className="space-y-2">
                 <Label>Daily Units Sold (Base)</Label>
                 <Input type="number" value={inputs.dailyUnitsSold} onChange={e => handleInputChange('dailyUnitsSold', e.target.value)} />
            </div>

            <div className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label>Promo Discount (%)</Label>
                        <span className="font-bold">{inputs.promoDiscountPct}%</span>
                    </div>
                    <Slider 
                        value={[inputs.promoDiscountPct]} 
                        min={0} max={50} step={1}
                        onValueChange={(vals) => setInputs(prev => ({...prev, promoDiscountPct: vals[0]}))}
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label>Price Elasticity</Label>
                        <span className="font-bold">{inputs.priceElasticity.toFixed(1)}</span>
                    </div>
                    <Slider 
                        value={[inputs.priceElasticity]} 
                        min={0} max={3.0} step={0.1}
                        onValueChange={(vals) => setInputs(prev => ({...prev, priceElasticity: vals[0]}))}
                    />
                    <p className="text-xs text-muted-foreground">Higher = volume more sensitive to price drops.</p>
                </div>
            </div>

            <div className="pt-4 border-t">
                 <HorizonSlider 
                    value={inputs.horizonMonths} 
                    onChange={(val) => setInputs(prev => ({...prev, horizonMonths: val}))} 
                 />
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-1 lg:col-span-4 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <KPICard 
                    title="Gross Margin" 
                    value={`${outputs.grossMarginPct.toFixed(1)}%`}
                    icon={<Percent className="h-4 w-4" />}
                    trend={outputs.grossMarginPct > 50 ? "up" : "down"}
                />
                <KPICard 
                    title="Projected Profit" 
                    value={`$${outputs.projectedProfit.toLocaleString()}`}
                    icon={<TrendingUp className="h-4 w-4" />}
                />
            </div>

            <RiskGauge 
                type="Risk" 
                level={outputs.riskLevel} 
                description={`Margin is ${outputs.grossMarginPct < 30 ? 'Low' : 'Healthy'}`}
            />

            <Card>
                <CardHeader>
                    <CardTitle>Promo Impact Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center p-6">
                        <Tag className="h-12 w-12 mx-auto text-primary mb-2" />
                        <h3 className="text-xl font-bold">{outputs.netPromoImpact} Outcome</h3>
                        <p className="text-muted-foreground mt-2">
                            {outputs.netPromoImpact === 'Positive' 
                                ? "Volume increase outweighs price cut. Good promo."
                                : outputs.netPromoImpact === 'Negative'
                                ? "Price cut erodes margin more than volume compensates."
                                : "No significant impact."}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
