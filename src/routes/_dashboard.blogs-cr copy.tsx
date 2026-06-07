import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash, ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// التعديل المهم هنا: تأكد أن المسار يطابق اسم الملف تماماً ليعمل تحت الـ دشبورد
export const Route = createFileRoute("/_dashboard/blogs-cr copy")({
  component: CreateBlogPage,
});

interface LocalParagraph {
  title: { ar: string; en: string; fr: string; es: string; tr: string };
  content: { ar: string; en: string; fr: string; es: string; tr: string };
  imageFile: File | null;
}

const LANGUAGES = [
  { code: "ar", name: "Arabic" },
  { code: "en", name: "English" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "tr", name: "Turkish" },
];

function CreateBlogPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [blogTitle, setBlogTitle] = useState({ ar: "", en: "", fr: "", es: "", tr: "" });
  const [bannerImage, setBannerImage] = useState<File | null>(null);

  const [paragraphs, setParagraphs] = useState<LocalParagraph[]>([
    {
      title: { ar: "", en: "", fr: "", es: "", tr: "" },
      content: { ar: "", en: "", fr: "", es: "", tr: "" },
      imageFile: null,
    },
  ]);

  const handleAddParagraph = () => {
    setParagraphs([
      ...paragraphs,
      {
        title: { ar: "", en: "", fr: "", es: "", tr: "" },
        content: { ar: "", en: "", fr: "", es: "", tr: "" },
        imageFile: null,
      },
    ]);
  };

  const handleRemoveParagraph = (index: number) => {
    setParagraphs(paragraphs.filter((_, i) => i !== index));
  };

  const updateParagraphText = (index: number, field: "title" | "content", langCode: string, value: string) => {
    setParagraphs((prev) =>
      prev.map((p, i) => {
        if (i !== index) return p;
        return { ...p, [field]: { ...p[field], [langCode]: value } };
      })
    );
  };

  const updateParagraphImage = (index: number, file: File | null) => {
    setParagraphs((prev) =>
      prev.map((p, i) => (i === index ? { ...p, imageFile: file } : p))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerImage) {
      alert("Please upload a main banner image");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();

      LANGUAGES.forEach((lang) => {
        formData.append(`title[${lang.code}]`, blogTitle[lang.code as keyof typeof blogTitle]);
      });
      formData.append("banner_image", bannerImage);

      paragraphs.forEach((p, index) => {
        LANGUAGES.forEach((lang) => {
          formData.append(`paragraphs[${index}][title][${lang.code}]`, p.title[lang.code as keyof typeof p.title]);
          formData.append(`paragraphs[${index}][content][${lang.code}]`, p.content[lang.code as keyof typeof p.content]);
        });
        if (p.imageFile) {
          formData.append(`paragraphs[${index}][image]`, p.imageFile);
        }
      });

      const response = await fetch("https://ba7ary.draconiccode.com/public/api/v1/blogs", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Something went wrong");

      alert("Blog created successfully!");
      router.history.push("/_dashboard/blogs"); // يوجهك لجدول المدونات بعد الحفظ
    } catch (error) {
      console.error(error);
      alert("Failed to submit blog.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <Button variant="outline" type="button" onClick={() => router.history.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button type="submit" disabled={submitting} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
          <Save className="h-4 w-4" /> {submitting ? "Saving..." : "Save Blog"}
        </Button>
      </div>

      {/* 1. MAIN BLOG */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-primary">1. Main Blog Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LANGUAGES.map((lang) => (
              <div key={lang.code} className="space-y-2">
                <label className="text-sm font-medium">Blog Title ({lang.name}) *</label>
                <Input
                  required
                  value={blogTitle[lang.code as keyof typeof blogTitle]}
                  onChange={(e) => setBlogTitle({ ...blogTitle, [lang.code]: e.target.value })}
                  placeholder={`Enter title in ${lang.name}`}
                  className={lang.code === "ar" ? "direction-rtl" : ""}
                />
              </div>
            ))}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Main Banner Image *</label>
              <Input type="file" accept="image/*" required onChange={(e) => setBannerImage(e.target.files?.[0] || null)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. PARAGRAPHS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">2. Blog Paragraphs Setup</h2>
          <Button type="button" onClick={handleAddParagraph} variant="secondary" className="gap-1 text-xs">
            <Plus className="h-4 w-4" /> Add Next Paragraph
          </Button>
        </div>

        {paragraphs.map((paragraph, index) => (
          <Card key={index} className="border-l-4 border-l-primary shadow-sm relative">
            <CardHeader className="flex flex-row items-center justify-between bg-muted/20 pb-2">
              <CardTitle className="text-sm font-bold text-muted-foreground">Paragraph Form #{index + 1}</CardTitle>
              {paragraphs.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveParagraph(index)} className="text-destructive hover:bg-destructive/10 p-1 h-8">
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Paragraph Image (Optional)</label>
                <Input type="file" accept="image/*" onChange={(e) => updateParagraphImage(index, e.target.files?.[0] || null)} />
              </div>
              <div className="space-y-6 border-t pt-4">
                {LANGUAGES.map((lang) => (
                  <div key={lang.code} className="p-3 rounded-lg bg-slate-50/50 border space-y-3">
                    <span className="text-xs font-bold text-indigo-600 block">{lang.name} Content Layer</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1 space-y-1">
                        <label className="text-xs">Title ({lang.code.toUpperCase()})</label>
                        <Input required value={paragraph.title[lang.code as keyof typeof paragraph.title]} onChange={(e) => updateParagraphText(index, "title", lang.code, e.target.value)} placeholder="Subheading" className={lang.code === "ar" ? "direction-rtl text-xs" : "text-xs"} />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-xs">Content Text ({lang.code.toUpperCase()})</label>
                        <Textarea required value={paragraph.content[lang.code as keyof typeof paragraph.content]} onChange={(e) => updateParagraphText(index, "content", lang.code, e.target.value)} placeholder="Write paragraph body..." className={lang.code === "ar" ? "direction-rtl text-xs" : "text-xs"} rows={2} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </form>
  );
}