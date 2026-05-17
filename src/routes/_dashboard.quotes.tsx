import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Eye } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { SearchInput } from "@/components/common/SearchInput";
import { Pagination } from "@/components/common/Pagination";
import { StatusBadge } from "@/components/common/StatusBadge";

import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/_dashboard/quotes")({
  head: () => ({
    meta: [{ title: "Quote Requests — Megt" }],
  }),
  component: QuotesPage,
});

interface QuoteRequest {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  pickup_country: string;
  import_country: string;
  pickup_city: string;
  service_type: string;
  details: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const PAGE_SIZE = 8;

/* =========================
   STATUS NORMALIZATION
========================= */
const normalizeStatus = (status: string) => {
  const map: Record<string, string> = {
    جديد: "new",
    new: "new",
    pending: "pending",
    مكتمل: "completed",
    completed: "completed",
  };

  return map[status] ?? "new";
};

/* =========================
   TRANSLATED STATUS LABEL
========================= */
const getStatusLabel = (t: any, status: string) => {
  const normalized = normalizeStatus(status);
  return t(`common.status.${normalized}`, normalized);
};

function QuotesPage() {
  const { t } = useI18n();

  const [search, setSearch] = useState("");
  const [service, setService] = useState<string>("all");
  const [page, setPage] = useState(1);

  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const [active, setActive] = useState<QuoteRequest | null>(null);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://ba7ary.draconiccode.com/public/api/admin/quote-requests",
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch quote requests");
      }

      const data = await response.json();
      setQuoteRequests(data.data || []);
    } catch (error) {
      console.error("Error fetching quote requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `https://ba7ary.draconiccode.com/public/api/admin/quote-requests/${id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!res.ok) throw new Error("Failed to update status");

    // تحديث UI محليًا بدون إعادة fetch
    setQuoteRequests((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, status } : q
      )
    );
  } catch (err) {
    console.error(err);
  }
};

  const filtered = useMemo(() => {
    const s = search.toLowerCase().trim();

    return quoteRequests.filter((q) => {
      if (service !== "all" && q.service_type !== service) return false;

      if (!s) return true;

      return [
        q.full_name,
        q.email,
        q.phone,
        q.pickup_country,
        q.import_country,
        q.pickup_city,
        q.service_type,
      ]
        .join(" ")
        .toLowerCase()
        .includes(s);
    });
  }, [search, service, quoteRequests]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const services = [
    "Air Freight",
    "Sea Freight",
    "Land Shipping",
    "Express",
    "Warehousing",
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {t("quotes.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("quotes.subtitle")}
        </p>
      </div>

      <Card className="border-border/60 shadow-soft">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder={t("quotes.search")}
          />

          {/* <Select
            value={service}
            onValueChange={(v) => {
              setService(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                {t("quotes.filterAll")}
              </SelectItem>

              {services.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>{t("quotes.cols.name")}</TableHead>
                  <TableHead>{t("quotes.cols.email")}</TableHead>
                  <TableHead className="hidden md:table-cell">
                    {t("quotes.cols.phone")}
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    {t("quotes.cols.pickupCountry")}
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    {t("quotes.cols.importCountry")}
                  </TableHead>
                  <TableHead className="hidden xl:table-cell">
                    {t("quotes.cols.pickupCity")}
                  </TableHead>
                  <TableHead>{t("quotes.cols.service")}</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-end">
                    {t("quotes.cols.details")}
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={9} className="py-12 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                )}

                {!loading && current.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="py-12 text-center text-muted-foreground"
                    >
                      {t("common.noResults")}
                    </TableCell>
                  </TableRow>
                )}

                {!loading &&
                  current.map((q) => (
                    <TableRow key={q.id}>
                      <TableCell className="font-medium">
                        {q.full_name}
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {q.email}
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        {q.phone}
                      </TableCell>

                      <TableCell className="hidden lg:table-cell">
                        {q.pickup_country}
                      </TableCell>

                      <TableCell className="hidden lg:table-cell">
                        {q.import_country}
                      </TableCell>

                      <TableCell className="hidden xl:table-cell">
                        {q.pickup_city}
                      </TableCell>

                      <TableCell>{q.service_type}</TableCell>

                      <Select
  value={q.status}
  onValueChange={(value) => updateStatus(q.id, value)}
>
  <SelectTrigger className="w-[140px]">
    <SelectValue />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="جديد">جديد</SelectItem>
    <SelectItem value="قيد الانتظار">قيد الانتظار</SelectItem>
    <SelectItem value="تمت المراجعة">تمت المراجعة</SelectItem>
    <SelectItem value="مغلق">مغلق</SelectItem>
  </SelectContent>
</Select>

                      <TableCell className="text-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setActive(q)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="hidden sm:inline">
                            {t("quotes.details")}
                          </span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          <Pagination
            page={page}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>

      {/* DETAILS MODAL */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {t("quotes.detailsTitle")} · {active?.id}
            </DialogTitle>
            <DialogDescription>{active?.full_name}</DialogDescription>
          </DialogHeader>

          {active && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Field label={t("quotes.cols.email")} value={active.email} />
              <Field label={t("quotes.cols.phone")} value={active.phone} />
              <Field
                label={t("quotes.cols.pickupCountry")}
                value={active.pickup_country}
              />
              <Field
                label={t("quotes.cols.importCountry")}
                value={active.import_country}
              />
              <Field
                label={t("quotes.cols.pickupCity")}
                value={active.pickup_city}
              />
              <Field
                label={t("quotes.cols.service")}
                value={active.service_type}
              />

              <div className="col-span-2">
                <p className="text-xs font-medium text-muted-foreground">
                  {t("quotes.cols.details")}
                </p>
                <p className="mt-1 rounded-lg bg-muted p-3 text-sm">
                  {active.details}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-medium">{value}</p>
    </div>
  );
}