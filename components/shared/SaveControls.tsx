import { Button } from "@/components/ui/button";
import { Save, RotateCcw, ArchiveRestore } from "lucide-react";

interface SaveControlsProps {
  onSave: () => void;
  onRestore: () => void;
  onReset: () => void;
}

export function SaveControls({ onSave, onRestore, onReset }: SaveControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onRestore}>
        <ArchiveRestore className="mr-2 h-4 w-4" />
        Restore Last
      </Button>
      <Button variant="outline" size="sm" onClick={onReset}>
         <RotateCcw className="mr-2 h-4 w-4" />
         Reset
      </Button>
      <Button size="sm" onClick={onSave}>
        <Save className="mr-2 h-4 w-4" />
        Save Settings
      </Button>
    </div>
  );
}
