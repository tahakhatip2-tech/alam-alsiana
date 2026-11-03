"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getSession, isMaintenanceRole, UserSession } from "@/lib/auth";
import {
  Home,
  ShoppingBag,
  MessageSquare,
  Stethoscope,
  ShieldCheck,
  User,
} from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserSession | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUser(getSession());
  }, [pathname]);

  // Don't show bottom nav inside print views
  const isMaintenance = mounted && isMaintenanceRole(user?.role);

  const navItems = [
    {
      href: "/",
      label: "الرئيسية",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      href: "/market",
      label: "السوق",
      icon: ShoppingBag,
      isActive: pathname.startsWith("/market"),
    },
    {
      href: "/chat",
      label: "المحادثات",
      icon: MessageSquare,
      isActive: pathname.startsWith("/chat"),
    },
    {
      href: "/hospital",
      label: "الدكتور",
      icon: Stethoscope,
      isActive: pathname.startsWith("/hospital") || pathname.startsWith("/schematic"),
    },
    {
      href: isMaintenance ? "/vault" : "/track",
      label: isMaintenance ? "الخزنة" : "حسابي",
      icon: isMaintenance ? ShieldCheck : User,
      isActive: isMaintenance ? pathname.startsWith("/vault") : pathname.startsWith("/track"),
    },
  ];

  return (
    <nav
      aria-label="شريط التنقل السفلي للهاتف"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-[#222222] px-2 py-1 print:hidden"
      style={{ paddingBottom: "max(0.35rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center justify-around h-14 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-all group relative ${
                active ? "text-[#FFC400]" : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {/* Active top glow indicator */}
              {active && (
                <span className="absolute -top-1 w-8 h-1 bg-[#FFC400] rounded-full shadow-[0_0_10px_#FFC400]" />
              )}

              <div
                className={`p-1.5 rounded-xl transition-all ${
                  active
                    ? "bg-[#FFC400]/15 border border-[#FFC400]/30 shadow-[0_0_15px_rgba(255,196,0,0.2)]"
                    : "group-hover:bg-neutral-900"
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${active ? "scale-110" : "scale-100"}`} />
              </div>

              <span
                className={`text-[10px] mt-0.5 font-bold tracking-tight ${
                  active ? "text-[#FFC400] font-black" : "text-neutral-400"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

