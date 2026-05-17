import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, MessageSquare, Users, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "@/components/dashboard/StatCard";
import { OverviewCharts } from "@/components/dashboard/OverviewCharts";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { StatusBadge } from "@/components/common/StatusBadge";
import { contactRequests, quoteRequests, totalUsers } from "@/data";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/_dashboard/")({
  component: OverviewPage,
});

function OverviewPage() {
  const { t } = useI18n();
  const latestQuotes = quoteRequests.slice(0, 5);
  const latestContacts = contactRequests.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{t("overview.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("overview.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label={t("overview.totalContacts")} value={contactRequests.length} delta={12} hint={t("overview.vsLastMonth")} icon={MessageSquare} tone="primary" />
        <StatCard label={t("overview.totalQuotes")} value={quoteRequests.length} delta={8} hint={t("overview.vsLastMonth")} icon={FileText} tone="success" />
        <StatCard label={t("overview.totalUsers")} value={totalUsers.toLocaleString()} delta={-3} hint={t("overview.vsLastMonth")} icon={Users} tone="warning" />
      </div>

      <OverviewCharts />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="border-border/60 shadow-soft lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>{t("overview.latestQuotes")}</CardTitle>
            <Link to="/quotes" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              {t("overview.viewAll")} <ArrowRight className="h-3 w-3 rtl:rotate-180" />
            </Link>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("quotes.cols.name")}</TableHead>
                  <TableHead>{t("quotes.cols.service")}</TableHead>
                  <TableHead className="hidden md:table-cell">{t("quotes.cols.pickupCountry")}</TableHead>
                  <TableHead className="hidden md:table-cell">{t("quotes.cols.importCountry")}</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestQuotes.map((q) => (
                  <TableRow key={q.id} className="transition-colors hover:bg-muted/40">
                    <TableCell className="font-medium">{q.fullName}</TableCell>
                    <TableCell>{q.serviceType}</TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">{q.pickupCountry}</TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">{q.importCountry}</TableCell>
                    <TableCell><StatusBadge status={q.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <ActivityFeed />
      </div>

      <Card className="border-border/60 shadow-soft">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>{t("overview.latestContacts")}</CardTitle>
          <Link to="/contact-requests" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            {t("overview.viewAll")} <ArrowRight className="h-3 w-3 rtl:rotate-180" />
          </Link>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("contacts.cols.name")}</TableHead>
                <TableHead className="hidden sm:table-cell">{t("contacts.cols.email")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("contacts.cols.phone")}</TableHead>
                <TableHead>{t("contacts.cols.message")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {latestContacts.map((c) => (
                <TableRow key={c.id} className="transition-colors hover:bg-muted/40">
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">{c.email}</TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{c.phone}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">{c.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
