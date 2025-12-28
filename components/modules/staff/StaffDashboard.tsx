"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"; 
import { ScenarioTabs } from "@/components/dashboard/ScenarioTabs";
import { RiskGauge } from "@/components/dashboard/RiskGauge";
import { KPICard } from "@/components/dashboard/KPICard";
import { SaveControls } from "@/components/shared/SaveControls";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { STAFF_PRESETS, ScenarioType } from "@/lib/presets";
import { calculateStaff, StaffInputs } from "@/lib/restaurant/staff";
import { Users, Clock, DollarSign } from "lucide-react";

export default function StaffDashboard() {
  const [scenario, setScenario] = useState<ScenarioType>('Base');
  const [inputs, setInputs] = useLocalStorage<StaffInputs>('staff_inputs', STAFF_PRESETS.Base);
  
  const handleScenarioChange = (val: ScenarioType) => {
      setScenario(val);
      setInputs(STAFF_PRESETS[val]);
  };

  const outputs = calculateStaff(inputs);

  const handleInputChange = (field: keyof StaffInputs, val: string | number | boolean) => {
      const num = typeof val === 'string' ? parseFloat(val) : val;
      if (typeof num === 'number' && !isNaN(num)) {
          setInputs(prev => ({ ...prev, [field]: num }));
      } else if (typeof val === 'boolean') {
          setInputs(prev => ({ ...prev, [field]: val }));
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Staffing Logic</h2>
          <p className="text-muted-foreground">Manage shifts, labor costs, and coverage risks.</p>
        </div>
        <SaveControls 
            onSave={() => alert("Settings saved!")}
            onRestore={() => {}}
            onReset={() => setInputs(STAFF_PRESETS[scenario])}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Staff Parameters</CardTitle>
            <ScenarioTabs value={scenario} onValueChange={handleScenarioChange} className="mt-4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Staff Per Shift</Label>
                 <Input type="number" value={inputs.staffPerShift} onChange={e => handleInputChange('staffPerShift', e.target.value)} />
               </div>
               <div className="space-y-2">
                 <Label>Shifts / Day</Label>
                 <Input type="number" value={inputs.shiftsPerDay} onChange={e => handleInputChange('shiftsPerDay', e.target.value)} />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Wage ($/hr)</Label>
                 <Input type="number" value={inputs.wagePerHour} onChange={e => handleInputChange('wagePerHour', e.target.value)} />
               </div>
               <div className="space-y-2">
                 <Label>Capacity (Orders/Hr)</Label>
                 <Input type="number" value={inputs.avgOrdersPerStaffPerHour} onChange={e => handleInputChange('avgOrdersPerStaffPerHour', e.target.value)} />
               </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                    <Label>Overtime Enabled</Label>
                    <p className="text-xs text-muted-foreground">Apply multiplier to extra hours</p>
                </div>
                <Switch 
                    checked={inputs.overtimeEnabled} 
                    onCheckedChange={(checked) => handleInputChange('overtimeEnabled', checked)} 
                />
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-1 lg:col-span-4 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <KPICard 
                    title="Weekly Labor Cost" 
                    value={`$${outputs.weeklyLaborCost.toLocaleString()}`}
                    icon={<DollarSign className="h-4 w-4" />}
                />
                <KPICard 
                    title="Recommended Staff" 
                    value={outputs.recommendedStaff}
                    icon={<Users className="h-4 w-4" />}
                    description="Based on capacity"
                />
            </div>

            <RiskGauge 
                type="Risk" 
                level={outputs.riskLevel} 
                description={outputs.laborPctOfSales ? `Labor is ${outputs.laborPctOfSales.toFixed(1)}% of sales` : "No sales baseline linked."}
            />

            <Card>
                <CardHeader>
                    <CardTitle>Shift Coverage Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <Clock className="h-8 w-8 text-primary" />
                        <div>
                            <p className="text-sm font-medium">Total Weekly Hours</p>
                            <p className="text-2xl font-bold">{inputs.staffPerShift * inputs.shiftsPerDay * inputs.hoursPerShift * inputs.daysPerWeekOpen}</p>
                        </div>
                        <div className="ml-auto text-right">
                             <p className="text-sm font-medium">Overtime Impact</p>
                             <p className="text-lg">{inputs.overtimeEnabled ? "Active" : "Disabled"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
