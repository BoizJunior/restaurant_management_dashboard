import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScenarioType } from "@/lib/presets";

interface ScenarioTabsProps {
  value: ScenarioType;
  onValueChange: (val: ScenarioType) => void;
  className?: string;
}

export function ScenarioTabs({ value, onValueChange, className }: ScenarioTabsProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onValueChange(v as ScenarioType)} className={className}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="Conservative">Conservative</TabsTrigger>
        <TabsTrigger value="Base">Base</TabsTrigger>
        <TabsTrigger value="Aggressive">Aggressive</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
