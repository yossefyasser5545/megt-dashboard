import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  FileText,
  UserCheck,
  MessageSquare,
  Phone,
} from "lucide-react";

import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/_dashboard/")({
  component: OverviewPage,
});

function OverviewPage() {
  const { t } = useI18n();
  const navigate = useNavigate();

  const dashboardItems = [
    {
      title: t("nav.quotes"),
      description: "Manage all quote requests",
      icon: FileText,
      color:
        "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40",
      to: "/quotes",
    },
    {
      title: t("nav.agentRequests"),
      description: "Review and manage agent requests",
      icon: UserCheck,
      color:
        "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/40",
      to: "/agent-requests",
    },
    {
      title: t("nav.contactRequests"),
      description: "View contact messages and requests",
      icon: MessageSquare,
      color:
        "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/40",
      to: "/contact-requests",
    },
    {
      title: t("nav.contactInfo"),
      description: "Update company contact information",
      icon: Phone,
      color:
        "text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/40",
      to: "/contact-info",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6 transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Header */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-8 md:p-10 transition-colors duration-300">
          <div className="space-y-3">
            <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-950/40 px-4 py-1 text-sm font-medium text-blue-700 dark:text-blue-300">
              Megt Admin Panel
            </span>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
              Welcome Back 👋
            </h1>

            <p className="max-w-2xl text-slate-500 dark:text-slate-400 text-base md:text-lg">
              Manage your dashboard, requests, users, and platform settings
              from one powerful admin panel.
            </p>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {dashboardItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <Card
                key={index}
                className="group border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden bg-white dark:bg-slate-900"
              >
                <CardContent className="p-7 flex flex-col gap-5">
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color}`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>

                    <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                      0{index + 1}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </h2>

                    <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {item.description}
                    </p>
                  </div>

                  <Button
                    className="mt-auto w-full rounded-xl h-11"
                    onClick={() => navigate({ to: item.to })}
                  >
                    Open Section
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-slate-400 dark:text-slate-500 pt-2">
          © {new Date().getFullYear()} Megt Dashboard. All rights reserved.
        </div>
      </div>
    </div>
  );
}