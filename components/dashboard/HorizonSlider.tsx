import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface HorizonSliderProps {
  value: number;
  onChange: (val: number) => void;
  className?: string;
}

export function HorizonSlider({ value, onChange, className }: HorizonSliderProps) {
  return (
    <div className={className}>
      <div className="flex justify-between mb-2">
         <Label className="text-sm font-medium">Projection Horizon</Label>
         <span className="text-sm font-bold text-primary">{value} Months</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(vals) => onChange(vals[0])}
        min={1}
        max={24}
        step={1}
        className="cursor-pointer"
        aria-label="Time Horizon Slider"
      />
      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
        <span>1 Month</span>
        <span>2 Years</span>
      </div>
    </div>
  );
}
