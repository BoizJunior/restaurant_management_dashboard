import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, ArrowRight } from "lucide-react";

interface Insight {
  module: string;
  message: string;
  type: 'warning' | 'success' | 'info';
}

interface InsightPanelProps {
  insights: Insight[];
}

export function InsightPanel({ insights }: InsightPanelProps) {
  if (insights.length === 0) return null;

  return (
    <Card className="bg-muted/50">
       <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Actionable Insights
            </CardTitle>
       </CardHeader>
       <CardContent className="space-y-2">
          {insights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2 bg-background rounded border text-sm">
                  <ArrowRight className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <div>
                      <span className="font-semibold mr-1">{insight.module}:</span>
                      {insight.message}
                  </div>
              </div>
          ))}
       </CardContent>
    </Card>
  );
}
