import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export function Pagination({
  page,
  pageCount,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  onPageChange: (p: number) => void;
}) {
  const { t, dir } = useI18n();
  const Prev = dir === "rtl" ? ChevronRight : ChevronLeft;
  const Next = dir === "rtl" ? ChevronLeft : ChevronRight;
  const pages = Array.from({ length: Math.min(pageCount, 5) }, (_, i) => {
    const start = Math.max(1, Math.min(page - 2, pageCount - 4));
    return start + i;
  }).filter((p) => p >= 1 && p <= pageCount);

  return (
    <div className="flex items-center justify-between gap-2">
      <p className="text-sm text-muted-foreground">
        {t("common.page")} {page} {t("common.of")} {pageCount || 1}
      </p>
      <div className="flex items-center gap-1">
        <Button size="icon" variant="outline" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <Prev className="h-4 w-4" />
        </Button>
        {pages.map((p) => (
          <Button
            key={p}
            size="sm"
            variant={p === page ? "default" : "outline"}
            className="min-w-9"
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        ))}
        <Button size="icon" variant="outline" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
          <Next className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
