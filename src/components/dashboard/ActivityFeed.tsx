import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { activityFeed } from "@/data";
import { FileText, MessageSquare, UserPlus } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

const iconMap = {
  quote: FileText,
  contact: MessageSquare,
  user: UserPlus,
} as const;

export function ActivityFeed() {
  const { t } = useI18n();
  return (
    <Card className="border-border/60 shadow-soft">
      <CardHeader>
        <CardTitle>{t("overview.activity")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activityFeed.map((a) => {
          const Icon = iconMap[a.type as keyof typeof iconMap] ?? FileText;
          return (
            <div key={a.id} className="group flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{a.text}</p>
                <p className="text-xs text-muted-foreground">{a.time}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
