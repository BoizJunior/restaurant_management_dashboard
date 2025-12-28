import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface RiskGaugeProps {
  level: 'Low' | 'Medium' | 'High';
  volatility?: number;
  type: 'Risk' | 'Volatility';
  description?: string;
}

export function RiskGauge({ level, volatility, type, description }: RiskGaugeProps) {
  const color = {
    Low: "bg-green-500",
    Medium: "bg-yellow-500",
    High: "bg-red-500"
  }[level];

  const labelColor = {
      Low: "text-green-500",
      Medium: "text-yellow-500",
      High: "text-red-500"
  }[level];

  return (
    <div className="flex flex-col space-y-2 p-4 border rounded-lg bg-card/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">{type} Level</span>
            {description && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="max-w-xs text-xs">{description}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
        <Badge variant="outline" className={cn("capitalize", labelColor, "border-current")}>
          {level}
        </Badge>
      </div>
      
      {/* Gauge Visual */}
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden flex">
        <div className={cn("h-full transition-all duration-500 ease-out", 
            level === 'Low' ? "w-1/3 bg-green-500" : 
            level === 'Medium' ? "w-2/3 bg-yellow-500" : 
            "w-full bg-red-500"
        )} />
      </div>

      {volatility !== undefined && (
          <div className="text-xs text-right text-muted-foreground mt-1">
              Volatility: {volatility.toFixed(1)}%
          </div>
      )}
    </div>
  );
}
