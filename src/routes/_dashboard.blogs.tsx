import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Eye, Trash2, Plus, Edit } from "lucide-react";

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { SearchInput } from "@/components/common/SearchInput";
import { Pagination } from "@/components/common/Pagination";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/_dashboard/blogs")({
  head: () => ({
    meta: [{ title: "Blogs Management — Megt" }],
  }),
  component: BlogsPage,
});

interface MultilingualText {
  en: string;
  ar: string;
  fr?: string;
  de?: string;
  tr?: string;
  [key: string]: string | undefined;
}

interface BlogParagraph {
  id: number;
  title: MultilingualText;
  content: MultilingualText;
  image: string | null;
}

interface Blog {
  id: number;
  title: MultilingualText;
  banner_image: string;
  paragraphs?: BlogParagraph[];
  created_at: string;
}

const PAGE_SIZE = 8;

function BlogsPage() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<Blog | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("https://ba7ary.draconiccode.com/public/api/blogs", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch blogs");
      const result = await response.json();
      setBlogs(result.data || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://ba7ary.draconiccode.com/public/api/blogs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) throw new Error("Failed to delete blog");
      
      setBlogs((prev) => prev.filter((blog) => blog.id !== id));
      if (active?.id === id) setActive(null);
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const fetchSingleBlogDetails = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://ba7ary.draconiccode.com/public/api/blogs/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch blog details");
      const result = await response.json();
      setActive(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const filtered = useMemo(() => {
    const s = search.toLowerCase().trim();
    if (!s) return blogs;

    return blogs.filter((b) => {
      return Object.values(b.title)
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(s);
    });
  }, [search, blogs]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t("blogs.title", "Blogs Management")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("blogs.subtitle", "Manage your multi-language blogs and content paragraphs.")}
          </p>
        </div>
        <Link to="/blogs-cr">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
              {t("blogs.addNew", "Add New Blog")}
          </Button>
        </Link>
      </div>

      <Card className="border-border/60 shadow-soft">
        <CardHeader>
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder={t("blogs.searchPlaceholder", "Search blogs by title...")}
          />
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-[100px]">
                    {t("blogs.table.banner", "Banner")}
                  </TableHead>
                  
                  <TableHead>
                    {t("blogs.table.titleAr", "Title (Arabic)")}
                  </TableHead>

                  <TableHead>
                    {t("blogs.table.titleEn", "Title (English)")}
                  </TableHead>

                  <TableHead>
                    {t("blogs.table.createdAt", "Created At")}
                  </TableHead>

                  <TableHead className="text-end">
                    {t("blogs.table.actions", "Actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center">
                      Loading Blogs...
                    </TableCell>
                  </TableRow>
                )}

                {!loading && currentData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                      No Blogs Found
                    </TableCell>
                  </TableRow>
                )}

                {!loading &&
                  currentData.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell>
                        <img
                          src={blog.banner_image}
                          alt="Banner"
                          className="h-10 w-16 rounded object-cover border"
                        />
                      </TableCell>
                      <TableCell className="font-medium direction-rtl">
                        {blog.title.ar || "-"}
                      </TableCell>
                      <TableCell>{blog.title.en || "-"}</TableCell>
                      <TableCell>
                        {new Date(blog.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-end space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => fetchSingleBlogDetails(blog.id)}
                        >
                          <Eye className="h-4 w-4 text-sky-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteBlog(blog.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
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
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Blog Details</DialogTitle>
            <DialogDescription>Viewing full information for Blog #{active?.id}</DialogDescription>
          </DialogHeader>

          {active && (
            <div className="space-y-6">
              {/* Main Banner */}
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Main Banner</p>
                <img
                  src={active.banner_image}
                  alt="Blog Banner"
                  className="w-full h-64 object-cover rounded-xl border"
                />
              </div>

              {/* Main Titles */}
              <div className="rounded-xl border bg-muted/30 p-4">
                <p className="text-sm font-bold border-b pb-2 mb-3">Blog Titles (5 Languages)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Arabic (EN):</strong> <span className="block p-2 bg-background rounded border mt-1">{active.title.en}</span></div>
                  <div><strong>English (EN):</strong> <span className="block p-2 bg-background rounded border mt-1">{active.title.ar}</span></div>
                  <div><strong>French (FR):</strong> <span className="block p-2 bg-background rounded border mt-1">{active.title.fr || "-"}</span></div>
                  <div><strong>Spanish (DE):</strong> <span className="block p-2 bg-background rounded border mt-1">{active.title.de || "-"}</span></div>
                  <div><strong>Turkish (TR):</strong> <span className="block p-2 bg-background rounded border mt-1">{active.title.tr || "-"}</span></div>
                </div>
              </div>

              {/* Paragraphs Area */}
              <div className="space-y-4">
                <p className="text-md font-bold text-primary">Dynamic Paragraphs ({active.paragraphs?.length || 0})</p>
                
                {active.paragraphs?.map((p, index) => (
                  <div key={p.id} className="p-4 border rounded-xl space-y-4 bg-background">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="font-semibold text-sm bg-primary/10 text-primary px-2 py-1 rounded">Paragraph #{index + 1}</span>
                    </div>

                    {p.image && (
                      <div className="w-48">
                        <p className="text-xs text-muted-foreground mb-1">Paragraph Image</p>
                        <img src={p.image} alt="Paragraph" className="h-24 w-full object-cover rounded border" />
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-2 border-r pr-2">
                        <p className="font-bold text-muted-foreground">Titles per Language:</p>
                        <p><strong>EN:</strong> {p.title.en}</p>
                        <p><strong>AR:</strong> {p.title.ar}</p>
                        <p><strong>FR:</strong> {p.title.fr || "-"}</p>
                        <p><strong>DE:</strong> {p.title.de || "-"}</p>
                        <p><strong>TR:</strong> {p.title.tr || "-"}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-bold text-muted-foreground">Content per Language:</p>
                        <p><strong>EN:</strong> {p.content.en}</p>
                        <p><strong>AR:</strong> {p.content.ar}</p>
                        <p><strong>FR:</strong> {p.content.fr || "-"}</p>
                        <p><strong>DE:</strong> {p.content.de || "-"}</p>
                        <p><strong>TR:</strong> {p.content.tr || "-"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}