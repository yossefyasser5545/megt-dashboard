import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Truck, Mail, Lock, Globe, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useI18n } from "@/i18n/I18nProvider";
import { useTheme } from "@/theme/ThemeProvider";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Megt Logistics" },
      {
        name: "description",
        content: "Sign in to the Megt Logistics admin dashboard.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { t, lang, setLang } = useI18n();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const [remember, setRemember] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://ba7ary.draconiccode.com/public/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // حفظ التوكين
      localStorage.setItem("token", data.token);

      // حفظ بيانات الأدمن لو موجودة
      if (data.admin) {
        localStorage.setItem("admin", JSON.stringify(data.admin));
      }

      // التحويل للداش بورد
      navigate({ to: "/" });

    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-brand-gradient lg:flex">
        <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_70%,white,transparent_45%)]" />

        <div className="relative z-10 flex w-full flex-col justify-between p-12 text-white">
          <svg
            width="100"
            height="60"
            viewBox="0 0 78 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* SVG */}
          </svg>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight">
              {t("login.heroTitle")}
            </h1>

            <p className="max-w-md text-base opacity-90">
              {t("login.heroSub")}
            </p>
          </div>

          <p className="text-xs opacity-70">
            © {new Date().getFullYear()} Megt Logistics. All rights reserved.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex w-full flex-1 flex-col px-6 py-8 lg:w-1/2 lg:px-12">
        <div className="ms-auto flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
          >
            <Globe className="h-4 w-4" />

            <span className="text-xs font-semibold">
              {lang === "en" ? "AR" : "EN"}
            </span>
          </Button>

          <Button size="icon" variant="ghost" onClick={toggle}>
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white">
              <Truck className="h-6 w-6" />
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight">
                Megt Logistics
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              {t("login.title")}
            </h2>

            <p className="text-sm text-muted-foreground">
              {t("login.subtitle")}
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleLogin}>
            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-500 bg-red-500/10 p-3 text-sm text-red-500">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">{t("login.email")}</Label>

              <div className="relative">
                <Mail className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="email"
                  type="email"
                  required
                  placeholder={t("login.emailPh")}
                  className="ps-9 h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">
                  {t("login.password")}
                </Label>

                <button
                  type="button"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  {t("login.forgot")}
                </button>
              </div>

              <div className="relative">
                <Lock className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="password"
                  type="password"
                  required
                  placeholder={t("login.passwordPh")}
                  className="ps-9 h-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Remember */}
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={remember}
                onCheckedChange={(c) => setRemember(!!c)}
              />

              <span>{t("login.remember")}</span>
            </label>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full bg-brand-gradient text-base font-semibold shadow-elegant transition-transform hover:-translate-y-0.5"
            >
              {loading ? "Loading..." : t("login.submit")}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:underline">
              Continue as guest →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}