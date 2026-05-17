import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  new: "bg-primary/10 text-primary border-primary/20",
  pending: "bg-warning/15 text-warning-foreground border-warning/30 dark:text-warning",
  reviewed: "bg-success/15 text-success border-success/30",
  closed: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status }: { status: "new" | "pending" | "reviewed" | "closed" }) {
  const { t } = useI18n();
  return (
    <Badge variant="outline" className={cn("font-medium capitalize", styles[status])}>
      {t(`common.status.${status}`)}
    </Badge>
  );
}
