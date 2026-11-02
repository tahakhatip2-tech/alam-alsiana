// ─────────────────────────────────────────────────────
// auth.ts — Session helpers for عالم الصيانة
// ─────────────────────────────────────────────────────

export type UserRole = "TECH" | "TRADER" | "CUSTOMER" | "ADMIN";

export interface UserSession {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  city: string;
  shopName?: string;
}

const SESSION_KEY = "alam_user";

/** Read the current session from localStorage (client-only) */
export function getSession(): UserSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as UserSession) : null;
  } catch {
    return null;
  }
}

/** Persist a session to localStorage */
export function saveSession(user: UserSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

/** Clear the session */
export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

/** Returns true if the role belongs to a maintenance center */
export function isMaintenanceRole(role?: UserRole): boolean {
  return role === "TECH" || role === "TRADER" || role === "ADMIN";
}

/** Returns true if the role is a regular customer */
export function isCustomerRole(role?: UserRole): boolean {
  return role === "CUSTOMER";
}

/** Map role to Arabic label */
export function roleLabel(role?: UserRole): string {
  switch (role) {
    case "TECH":
      return "فني صيانة";
    case "TRADER":
      return "تاجر / محل";
    case "CUSTOMER":
      return "مستخدم عادي";
    case "ADMIN":
      return "مدير النظام";
    default:
      return "زائر";
  }
}

/** Map role to emoji */
export function roleEmoji(role?: UserRole): string {
  switch (role) {
    case "TECH":
      return "🔧";
    case "TRADER":
      return "🏬";
    case "CUSTOMER":
      return "👤";
    case "ADMIN":
      return "⚙️";
    default:
      return "👋";
  }
}

