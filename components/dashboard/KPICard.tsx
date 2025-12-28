import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number; // percentage
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
  description?: string;
}

export function KPICard({ title, value, change, trend, icon, className, description }: KPICardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(change !== undefined || description) && (
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            {change !== undefined && (
               <span className={cn("flex items-center mr-2", 
                  change > 0 ? "text-green-500" : change < 0 ? "text-red-500" : "text-gray-500"
               )}>
                  {change > 0 ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : change < 0 ? <ArrowDownIcon className="h-3 w-3 mr-1" /> : <MinusIcon className="h-3 w-3 mr-1" />}
                  {Math.abs(change)}%
               </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
