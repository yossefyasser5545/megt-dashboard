import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SearchInput } from "@/components/common/SearchInput";
import { Pagination } from "@/components/common/Pagination";
import { useI18n } from "@/i18n/I18nProvider";
import { toast } from "sonner";

export const Route = createFileRoute("/_dashboard/contact-requests")({
  head: () => ({ meta: [{ title: "Contact Requests — Megt" }] }),
  component: ContactsPage,
});

const PAGE_SIZE = 8;

function ContactsPage() {
  const { t } = useI18n();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [view, setView] = useState<any | null>(null);
  const [del, setDel] = useState<any | null>(null);

  // =========================
  // GET DATA FROM API
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch("https://ba7ary.draconiccode.com/public/api/contact-requests", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        // لو الـ API بيرجع data مباشرة أو داخل data.data
        setItems(data.data ?? data);
      } catch (err) {
        toast.error("Failed to fetch contact requests");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const s = search.toLowerCase().trim();
    if (!s) return items;

    return items.filter((c) =>
      [c.name, c.email, c.phone, c.message]
        .join(" ")
        .toLowerCase()
        .includes(s)
    );
  }, [items, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // =========================
  // DELETE (if backend supports it)
  // =========================
const handleDelete = async (id: number) => {
  try {
    const res = await fetch(
      `https://ba7ary.draconiccode.com/public/api/contact-requests/${id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Delete failed");
    }

    // حذف من الواجهة مباشرة
    setItems((prev) => prev.filter((item) => item.id !== id));

    toast.success("Contact request deleted successfully");
  } catch (error) {
    toast.error("Failed to delete contact request");
  }
};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">{t("contacts.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("contacts.subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder={t("contacts.search")}
          />
        </CardHeader>

        <CardContent className="space-y-4">
          {loading ? (
            <p className="text-center py-10 text-muted-foreground">Loading...</p>
          ) : (
            <div className="overflow-x-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead className="text-end">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {current.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        No results
                      </TableCell>
                    </TableRow>
                  )}

                  {current.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>{c.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">{c.email}</TableCell>
                      <TableCell className="hidden md:table-cell">{c.phone}</TableCell>
                      <TableCell className="truncate max-w-xs">{c.message}</TableCell>

                      <TableCell className="text-end">
                        <div className="flex justify-end gap-2">
                          <Button size="icon" variant="ghost" onClick={() => setView(c)}>
                            <Eye className="w-4 h-4" />
                          </Button>

                          <Button
  size="icon"
  variant="ghost"
  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
  onClick={() => setDel(c)}
>
  <Trash2 className="h-4 w-4" />
</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
        </CardContent>
      </Card>

      {/* VIEW */}
      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{view?.name}</DialogTitle>
            <DialogDescription>
              {view?.email} · {view?.phone}
            </DialogDescription>
          </DialogHeader>

          <p className="p-4 bg-muted rounded-lg">{view?.message}</p>
        </DialogContent>
      </Dialog>

      {/* DELETE */}
      <Dialog open={!!del} onOpenChange={(o) => !o && setDel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm delete</DialogTitle>
            <DialogDescription>Are you sure?</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDel(null)}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                if (del) handleDelete(del.id);
                setDel(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}