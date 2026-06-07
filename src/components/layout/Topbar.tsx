import { Menu, Bell, Sun, Moon, Globe, LogOut, User, Settings, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/theme/ThemeProvider";
import { useI18n } from "@/i18n/I18nProvider";
import { useNavigate } from "@tanstack/react-router";

export function Topbar({
  onToggleSidebar,
  onOpenMobileSidebar,
}: {
  onToggleSidebar: () => void;
  onOpenMobileSidebar: () => void;
}) {
  const { theme, toggle } = useTheme();
  const { lang, setLang, t } = useI18n();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      <Button
        size="icon"
        variant="ghost"
        className="lg:hidden"
        onClick={onOpenMobileSidebar}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="hidden lg:inline-flex"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="ms-auto flex items-center gap-1.5">
        {/* Language */}
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5"
          onClick={() => setLang(lang === "en" ? "ar" : "en")}
        >
          <Globe className="h-4 w-4" />
          <span className="text-xs font-semibold">{lang === "en" ? "AR" : "EN"}</span>
        </Button>

        {/* Theme */}
        <Button size="icon" variant="ghost" onClick={toggle} aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </Button>

        {/* Notifications */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="relative" aria-label="Notifications">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute end-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>{t("nav.notifications")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {[
              "New quote request from Ahmed",
              "Sara Khan sent a message",
              "12 new users this morning",
            ].map((n) => (
              <DropdownMenuItem key={n} className="flex flex-col items-start gap-0.5 py-2.5">
                <span className="text-sm">{n}</span>
                <span className="text-xs text-muted-foreground">a few minutes ago</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu> */}

        {/* User */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="ms-1 gap-2 px-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">
                MA
              </div>
              <div className="hidden text-start md:block">
                <p className="text-sm font-medium leading-tight">Megt Admin</p>
                <p className="text-[11px] leading-tight text-muted-foreground">admin@megt.com</p>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Megt Admin</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><User className="me-2 h-4 w-4" />{t("nav.profile")}</DropdownMenuItem>
            <DropdownMenuItem><Settings className="me-2 h-4 w-4" />{t("nav.settings")}</DropdownMenuItem>
            <DropdownMenuSeparator />
<DropdownMenuItem
  onClick={() => {
    localStorage.removeItem("token");
    navigate({ to: "/login" });
  }}
>
  <LogOut className="me-2 h-4 w-4" />
  {t("nav.logout")}
</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
