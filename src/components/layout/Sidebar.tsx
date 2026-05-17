import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, FileText, MessageSquare, Phone, X } from "lucide-react";
import { Logo } from "./Logo";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NavItem = {
  to: "/" | "/quotes" | "/contact-requests" | "/contact-info";
  labelKey: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const items: NavItem[] = [
  { to: "/", labelKey: "nav.overview", icon: LayoutDashboard, exact: true },
  { to: "/quotes", labelKey: "nav.quotes", icon: FileText },
  { to: "/contact-requests", labelKey: "nav.contactRequests", icon: MessageSquare },
  { to: "/contact-info", labelKey: "nav.contactInfo", icon: Phone },
];

export function Sidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const nav = (
    <nav className="flex flex-col gap-1 p-3">
      {items.map(({ to, labelKey, icon: Icon, exact }) => {
        const active = exact ? pathname === to : pathname.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            onClick={onCloseMobile}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-soft"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
              collapsed && "justify-center px-2",
            )}
          >
            {active && (
              <span className="absolute inset-y-2 start-0 w-1 rounded-full bg-primary" aria-hidden />
            )}
            <Icon className={cn("h-[18px] w-[18px] shrink-0 transition-transform group-hover:scale-110", active && "text-primary")} />
            {!collapsed && <span className="truncate">{t(labelKey)}</span>}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className={cn(
          "hidden lg:flex shrink-0 flex-col border-e border-sidebar-border bg-sidebar transition-[width] duration-300",
          collapsed ? "w-[76px]" : "w-64",
        )}
      >
        <div className={cn("flex h-16 items-center border-b border-sidebar-border px-4", collapsed && "justify-center px-2")} style={{ justifyContent: 'center', paddingBlock: '2.5em' }}>
          <Logo collapsed={collapsed} />
        </div>
        {nav}
        <div className="mt-auto p-3">
          {!collapsed && (
            <div className="rounded-xl bg-brand-gradient p-4 text-white shadow-elegant">
              <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Megt</p>
              <p className="mt-1 text-sm font-medium">Logistics simplified.</p>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-fade-in"
            onClick={onCloseMobile}
          />
          <aside className="absolute inset-y-0 start-0 flex w-72 flex-col border-e border-sidebar-border bg-sidebar shadow-elegant animate-fade-in">
            <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
              <Logo />
              <Button size="icon" variant="ghost" onClick={onCloseMobile}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
