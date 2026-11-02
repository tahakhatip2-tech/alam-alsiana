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

  // If user is already on auth page explicitly, allow standard flow
  const isAuthPage = pathname.startsWith("/auth/");

  // During SSR or before client hydration completes, render children so Next.js static shell and instant navigation validate without dropping segments
  if (!mounted) {
    return <>{children}</>;
  }

  // If not logged in and not on auth page -> FORCE Mandatory Login Modal with background content rendered (blurred)
  if (!sessionUser && !isAuthPage) {
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
