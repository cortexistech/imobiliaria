"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Settings,
  Users,
  Inbox,
} from "lucide-react";
import { Logo, TapeBar } from "@/components/brand/logo";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Quadro", icon: LayoutDashboard },
  { href: "/dashboard/properties", label: "Imóveis", icon: Building2 },
  { href: "/dashboard/leads", label: "Leads", icon: Inbox },
  { href: "/dashboard/team", label: "Equipa", icon: Users, admin: true },
  { href: "/dashboard/settings", label: "Casa", icon: Settings, admin: true },
];

export function DashboardNav({
  role,
  tenantName,
  userName,
  portalHref,
}: {
  role: "ADMIN" | "AGENT";
  tenantName: string;
  userName: string;
  portalHref: string;
}) {
  const pathname = usePathname();
  const visible = links.filter((link) => !link.admin || role === "ADMIN");

  return (
    <>
      <aside className="hidden w-[17.5rem] shrink-0 bg-ink text-paper md:flex md:flex-col">
        <TapeBar />
        <div className="border-b border-white/10 px-5 py-6">
          <Logo inverted caption="painel" name={tenantName} />
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          {visible.map((link) => {
            const active =
              link.href === "/dashboard"
                ? pathname === link.href
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold",
                  active
                    ? "bg-survey text-on-survey"
                    : "text-paper/80 hover:bg-white/5 hover:text-white",
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-5">
          <Link
            href={portalHref}
            className="mb-4 flex items-center gap-2 text-sm font-semibold text-survey"
          >
            <MapPinned className="h-4 w-4" />
            Ver vitrine
          </Link>
          <p className="text-sm font-medium text-paper">{userName}</p>
          <form action={logoutAction}>
            <button className="mt-2 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-paper/50">
              <LogOut className="h-3.5 w-3.5" />
              Sair
            </button>
          </form>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/10 bg-ink text-paper md:hidden">
        <div className="grid grid-cols-4">
          {visible.slice(0, 4).map((link) => {
            const active =
              link.href === "/dashboard"
                ? pathname === link.href
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 font-mono text-[10px] uppercase tracking-wider",
                  active ? "bg-survey text-on-survey" : "text-paper/70",
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
