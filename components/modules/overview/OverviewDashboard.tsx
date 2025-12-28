"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InsightPanel } from '@/components/dashboard/InsightPanel';
import { RiskGauge } from '@/components/dashboard/RiskGauge';
import { calculatePOS } from '@/lib/restaurant/pos';
import { calculateInventory } from '@/lib/restaurant/inventory';
import { calculateStaff } from '@/lib/restaurant/staff';
import { calculateMenu } from '@/lib/restaurant/menu';
import { POS_PRESETS, INVENTORY_PRESETS, STAFF_PRESETS, MENU_PRESETS } from '@/lib/presets';
import { ArrowRight, ShoppingCart, Archive, Users, Menu as MenuIcon } from 'lucide-react';

export default function OverviewDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Client-side hydration of data
    if (typeof window !== 'undefined') {
        const getStore = (key: string, preset: any) => {
            try {
                const item = window.localStorage.getItem(key);
                return item ? JSON.parse(item) : preset;
            } catch { return preset; }
        };
        setData({
            pos: getStore('pos_inputs', POS_PRESETS.Base),
            inv: getStore('inventory_inputs', INVENTORY_PRESETS.Base),
            staff: getStore('staff_inputs', STAFF_PRESETS.Base),
            menu: getStore('menu_inputs', MENU_PRESETS.Base),
        });
    }
  }, []);

  if (!data) return <div className="p-8">Loading dashboard...</div>;

  const posOut = calculatePOS(data.pos);
  const invOut = calculateInventory(data.inv);
  const staffOut = calculateStaff(data.staff);
  const menuOut = calculateMenu(data.menu);

  // Generate Insights
  const insights = [];
  if (posOut.riskLevel === 'High') insights.push({ module: 'POS', message: 'High peak load or volatility detected.', type: 'warning' as const });
  if (invOut.stockoutRisk) insights.push({ module: 'Inventory', message: 'Potential stockouts in current horizon.', type: 'warning' as const });
  if (staffOut.riskLevel === 'High') insights.push({ module: 'Staff', message: 'Labor costs exceeding targets relative to sales.', type: 'warning' as const });
  if (menuOut.netPromoImpact === 'Negative') insights.push({ module: 'Menu', message: 'Promotions are eroding profits.', type: 'info' as const });
  
  if (insights.length === 0) insights.push({ module: 'System', message: 'All systems operating within normal parameters.', type: 'success' as const });

  const modules = [
      { name: 'POS & Sales', href: '/pos-sales', icon: ShoppingCart, kpi: 'Projected Sales', val: `$${posOut.totalProjectedRevenue.toLocaleString()}`, risk: posOut.riskLevel },
      { name: 'Inventory', href: '/inventory', icon: Archive, kpi: 'Days Coverage', val: invOut.daysOfCoverage.toFixed(1), risk: invOut.riskLevel },
      { name: 'Staff', href: '/staff', icon: Users, kpi: 'Labor Cost', val: `$${staffOut.weeklyLaborCost.toLocaleString()}/wk`, risk: staffOut.riskLevel },
      { name: 'Menu', href: '/menu-pricing', icon: MenuIcon, kpi: 'Gross Margin', val: `${menuOut.grossMarginPct.toFixed(1)}%`, risk: menuOut.riskLevel },
  ];

  return (
    <div className="space-y-8">
        <section className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Executive Overview</h1>
            <p className="text-muted-foreground">Aggregated health check of your restaurant modules.</p>
        </section>

        <InsightPanel insights={insights} />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {modules.map((m) => (
                <Card key={m.name} className="flex flex-col justify-between hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{m.name}</CardTitle>
                        <m.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{m.val}</div>
                        <p className="text-xs text-muted-foreground">{m.kpi}</p>
                        <div className="mt-4">
                            <RiskGauge level={m.risk as any} type="Risk" />
                        </div>
                        <Button asChild variant="ghost" className="w-full mt-4 justify-between group">
                            <Link href={m.href}>
                                Manage <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>

        <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
                <CardTitle>Welcome to Antigravity Restaurant Manager</CardTitle>
                <CardDescription>Select a module to begin simulation.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>This dashboard simulates 4 core business areas. Calculations are local and deterministic. 
                   Data persists in your browser. Use the <strong>Scenario Tabs</strong> to test "Conservative" vs "Aggressive" strategies.
                </p>
            </CardContent>
        </Card>
    </div>
  );
}
