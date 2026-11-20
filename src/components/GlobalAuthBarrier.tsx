"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getSession, UserSession } from "@/lib/auth";
import RolePickerModal from "./RolePickerModal";

export default function GlobalAuthBarrier({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [sessionUser, setSessionUser] = useState<UserSession | null>(null);

  const checkAuth = () => {
    const s = getSession();
    setSessionUser(s);
  };

  useEffect(() => {
    setMounted(true);
    checkAuth();

    // Listen to storage changes across tabs or windows
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "alam_user") {
        checkAuth();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [pathname]);

  // Public pages accessible without login
  const isAuthPage = pathname.startsWith("/auth/");
  const isPublicPage =
    pathname === "/" ||
    pathname.startsWith("/track") ||
    pathname.startsWith("/centers") ||
    pathname.startsWith("/market");

  // During SSR or before client hydration completes, render children so Next.js static shell is always rendered
  if (!mounted) {
    return <>{children}</>;
  }

  // Public pages and auth pages -> always render without barrier
  if (isAuthPage || isPublicPage) {
    return <>{children}</>;
  }

  // If not logged in on a protected page -> FORCE Mandatory Login Modal
  if (!sessionUser) {
    return (
      <>
        {/* Render the background content in locked blurred view so DOM and segments are always rendered */}
        <div className="fixed inset-0 overflow-hidden filter blur-lg pointer-events-none select-none opacity-20">
          {children}
        </div>

        {/* Forced Fullscreen Portal Lock */}
        <RolePickerModal
          isForced={true}
          onSuccess={() => checkAuth()}
        />
      </>
    );
  }

  // Authenticated user -> Render full app
  return <>{children}</>;
}
