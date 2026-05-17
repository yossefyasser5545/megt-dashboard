import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Pencil,
  type LucideIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/i18n/I18nProvider";
import { toast } from "sonner";

export const Route = createFileRoute("/_dashboard/contact-info")({
  head: () => ({ meta: [{ title: "Contact Info — Megt" }] }),
  component: ContactInfoPage,
});

type ContactInfoItem = {
  id: number;
  key: "phone" | "email" | "location" | "hours";
  value: string;
  description: string;
};

const ICONS: Record<ContactInfoItem["key"], LucideIcon> = {
  phone: Phone,
  email: Mail,
  location: MapPin,
  hours: Clock,
};

function ContactInfoPage() {
  const { t } = useI18n();

  const [items, setItems] = useState<ContactInfoItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState<ContactInfoItem | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const [draftDesc, setDraftDesc] = useState("");

  // ===============================
  // 📥 GET DATA FROM LARAVEL
  // ===============================
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://ba7ary.draconiccode.com/public/api/web-data", {
          headers: {
            Accept: "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        const formatted: ContactInfoItem[] = [
          {
            id: 1,
            key: "phone",
            value: data?.phone?.value || "",
            description: data?.phone?.description || "",
          },
          {
            id: 2,
            key: "email",
            value: data?.email?.value || "",
            description: data?.email?.description || "",
          },
          {
            id: 3,
            key: "location",
            value: data?.location?.value || "",
            description: data?.location?.description || "",
          },
          {
            id: 4,
            key: "hours",
            value: data?.hours?.value || "",
            description: data?.hours?.description || "",
          },
        ];

        setItems(formatted);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // ===============================
  // ✏️ OPEN EDIT MODAL
  // ===============================
  function openEdit(item: ContactInfoItem) {
    setEditing(item);
    setDraftValue(item.value);
    setDraftDesc(item.description);
  }

  // ===============================
  // 💾 SAVE TO LARAVEL (PUT)
  // ===============================
  async function save() {
    if (!editing) return;

    try {
      const payload = {
        [editing.key]: {
          value: draftValue,
          description: draftDesc,
        },
      };

      const res = await fetch("https://ba7ary.draconiccode.com/public/api/web-data", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Update failed");

      // update UI instantly
      setItems((prev) =>
        prev.map((x) =>
          x.id === editing.id
            ? { ...x, value: draftValue, description: draftDesc }
            : x
        )
      );

      toast.success(t("contactInfo.saved"));
      setEditing(null);
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    }
  }

  // ===============================
  // LOADING STATE
  // ===============================
  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">Loading contact info...</p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {t("contactInfo.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("contactInfo.subtitle")}
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((item) => {
          const Icon = ICONS[item.key];

          return (
            <Card
              key={item.id}
              className="group border-border/60 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elegant"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-elegant">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {t(`contactInfo.cards.${item.key}`)}
                      </p>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEdit(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>

                    <p className="mt-1 text-lg font-semibold">
                      {item.value}
                    </p>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* EDIT DIALOG */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("contactInfo.edit")}{" "}
              {editing && t(`contactInfo.cards.${editing.key}`)}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("contactInfo.labelValue")}</Label>
              <Input
                value={draftValue}
                onChange={(e) => setDraftValue(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("contactInfo.labelDesc")}</Label>
              <Textarea
                rows={3}
                value={draftDesc}
                onChange={(e) => setDraftDesc(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              {t("contactInfo.cancel")}
            </Button>
            <Button onClick={save}>
              {t("contactInfo.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}