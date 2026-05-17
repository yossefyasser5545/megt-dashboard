import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  hint,
  tone = "primary",
}: {
  label: string;
  value: string | number;
  delta?: number;
  icon: LucideIcon;
  hint?: string;
  tone?: "primary" | "success" | "warning";
}) {
  const isUp = (delta ?? 0) >= 0;
  const toneBg = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
  }[tone];

  return (
    <Card className="group overflow-hidden border-border/60 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elegant">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
          </div>
          <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110", toneBg)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {(delta !== undefined || hint) && (
          <div className="mt-4 flex items-center gap-2 text-xs">
            {delta !== undefined && (
              <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold", isUp ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive")}>
                {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {isUp ? "+" : ""}
                {delta}%
              </span>
            )}
            {hint && <span className="text-muted-foreground">{hint}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
