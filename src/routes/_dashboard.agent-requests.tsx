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

import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/_dashboard/agent-requests")({
  head: () => ({
    meta: [{ title: "Agent Requests — Megt" }],
  }),
  component: AgentsPage,
});

interface AgentRequest {
  id: number;

  company_address: string;
  city: string;

  phone: string;
  email: string;
  website: string | null;

  legal_name: string;
  job_title: string;

  personal_phone: string;
  personal_email: string;

  has_shipping_experience: boolean;
  shipping_types: string[];

  covered_countries: string | null;
  experience_years: number | null;

  commercial_register: string | null;
  license: string | null;
  tax_number: string | null;
  other_documents: string | null;

  agreement: boolean;

  applicant_name: string;

  status: string;

  created_at: string;
  updated_at: string;
}

const PAGE_SIZE = 8;

const normalizeStatus = (status: string) => {
  const map: Record<string, string> = {
    pending: "pending",
    approved: "approved",
    rejected: "rejected",
    archived: "archived",

    جديد: "pending",
    موافق_عليه: "approved",
    مرفوض: "rejected",
    مؤرشف: "archived",
  };

  return map[status] ?? "pending";
};

function AgentsPage() {
  const { t } = useI18n();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [agentRequests, setAgentRequests] = useState<AgentRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const [active, setActive] = useState<AgentRequest | null>(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://ba7ary.draconiccode.com/public/api/agent-requests",
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch agent requests");
      }

      const data = await response.json();

      setAgentRequests(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Error fetching agent requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://ba7ary.draconiccode.com/public/api/agent-requests/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) throw new Error("Failed to update status");

      setAgentRequests((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status } : q))
      );

      if (active?.id === id) {
        setActive({
          ...active,
          status,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = useMemo(() => {
    const s = search.toLowerCase().trim();

    return agentRequests.filter((q) => {
      if (
        statusFilter !== "all" &&
        normalizeStatus(q.status) !== statusFilter
      ) {
        return false;
      }

      if (!s) return true;

      return [
        q.legal_name,
        q.applicant_name,
        q.email,
        q.personal_email,
        q.phone,
        q.personal_phone,
        q.city,
        q.job_title,
      ]
        .join(" ")
        .toLowerCase()
        .includes(s);
    });
  }, [search, statusFilter, agentRequests]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const current = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {t("agentRequests.title")}
        </h1>

        <p className="text-sm text-muted-foreground">
          {t("agentRequests.subtitle")}
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
            placeholder="Search..."
          />

          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Company Name</TableHead>
                  <TableHead>Company Email</TableHead>

                  <TableHead className="hidden md:table-cell">
                    Applicant
                  </TableHead>

                  <TableHead className="hidden lg:table-cell">
                    City
                  </TableHead>

                  <TableHead className="hidden lg:table-cell">
                    Job Title
                  </TableHead>

                  <TableHead>Status</TableHead>

                  <TableHead className="text-end">
                    Details
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                )}

                {!loading && current.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-12 text-center text-muted-foreground"
                    >
                      No Results
                    </TableCell>
                  </TableRow>
                )}

                {!loading &&
                  current.map((q) => (
                    <TableRow key={q.id}>
                      <TableCell className="font-medium">
                        {q.legal_name}
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {q.email}
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        {q.applicant_name}
                      </TableCell>

                      <TableCell className="hidden lg:table-cell">
                        {q.city}
                      </TableCell>

                      <TableCell className="hidden lg:table-cell">
                        {q.job_title}
                      </TableCell>

                      <TableCell>
                        <Select
                          value={normalizeStatus(q.status)}
                          onValueChange={(value) =>
                            updateStatus(q.id, value)
                          }
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="pending">
                              Pending
                            </SelectItem>

                            <SelectItem value="approved">
                              Approved
                            </SelectItem>

                            <SelectItem value="rejected">
                              Rejected
                            </SelectItem>

                            <SelectItem value="archived">
                              Archived
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>

                      <TableCell className="text-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setActive(q)}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />

                          <span className="hidden sm:inline">
                            View
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
{/* DETAILS MODAL */}
<Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
  <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
    <DialogHeader>
      <DialogTitle className="text-2xl">
        Agent Request #{active?.id}
      </DialogTitle>

      <DialogDescription>
        Full request details for {active?.legal_name}
      </DialogDescription>
    </DialogHeader>

    {active && (
      <div className="space-y-8">
        {/* =========================
            BASIC INFO
        ========================= */}
        <div>
          <h3 className="mb-4 text-lg font-bold">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field
              label="Company Name"
              value={active.legal_name}
            />

            <Field
              label="Applicant Name"
              value={active.applicant_name}
            />

            <Field
              label="Company Email"
              value={active.email}
            />

            <Field
              label="Personal Email"
              value={active.personal_email}
            />

            <Field
              label="Company Phone"
              value={active.phone}
            />

            <Field
              label="Personal Phone"
              value={active.personal_phone}
            />

            <Field label="City" value={active.city} />

            <Field
              label="Company Address"
              value={active.company_address}
            />

            <Field
              label="Job Title"
              value={active.job_title}
            />

            <Field
              label="Website"
              value={active.website || "-"}
            />

            <Field
              label="Covered Countries"
              value={active.covered_countries || "-"}
            />

            <Field
              label="Experience Years"
              value={
                active.experience_years
                  ? `${active.experience_years} Years`
                  : "-"
              }
            />

            <Field
              label="Shipping Experience"
              value={
                active.has_shipping_experience
                  ? "Yes"
                  : "No"
              }
            />

            <Field
              label="Agreement"
              value={active.agreement ? "Accepted" : "No"}
            />

            <Field
              label="Created At"
              value={new Date(
                active.created_at
              ).toLocaleString()}
            />

            <Field
              label="Updated At"
              value={new Date(
                active.updated_at
              ).toLocaleString()}
            />
          </div>
        </div>

        {/* =========================
            SHIPPING TYPES
        ========================= */}
        <div>
          <h3 className="mb-4 text-lg font-bold">
            Shipping Types
          </h3>

          <div className="flex flex-wrap gap-2">
            {active.shipping_types?.length ? (
              active.shipping_types.map((type, index) => (
                <div
                  key={index}
                  className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium"
                >
                  {type}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">
                No shipping types
              </p>
            )}
          </div>
        </div>

        {/* =========================
            DOCUMENTS
        ========================= */}
        <div>
          <h3 className="mb-4 text-lg font-bold">
            Documents
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Commercial Register */}
            <DocumentCard
              title="Commercial Register"
              file={active.commercial_register}
            />

            {/* License */}
            <DocumentCard
              title="License"
              file={active.license}
            />

            {/* Other Documents */}
            <DocumentCard
              title="Other Documents"
              file={active.other_documents}
            />
          </div>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>
    </div>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border bg-background p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold">
        {value || "-"}
      </p>
    </div>
  );
}

function DocumentCard({
  title,
  file,
}: {
  title: string;
  file: string | null;
}) {
  if (!file) {
    return (
      <div className="rounded-2xl border p-4">
        <p className="font-semibold">{title}</p>

        <p className="mt-2 text-sm text-muted-foreground">
          No file uploaded
        </p>
      </div>
    );
  }

  const fileUrl = `https://ba7ary.draconiccode.com/public/storage/${file}`;

  const isImage =
    file.endsWith(".png") ||
    file.endsWith(".jpg") ||
    file.endsWith(".jpeg") ||
    file.endsWith(".webp");

  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-semibold">{title}</p>

        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-primary underline"
        >
          Open
        </a>
      </div>

      {isImage ? (
        <img
          src={fileUrl}
          alt={title}
          className="h-64 w-full rounded-xl object-cover border"
        />
      ) : (
        <div className="flex h-64 items-center justify-center rounded-xl border bg-muted text-sm">
          File Preview Not Supported
        </div>
      )}
    </div>
  );
}