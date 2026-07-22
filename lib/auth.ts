// Simple client-side gate for this template. In production this is replaced by
// Supabase auth: each client gets a row in a `clients` table with a
// unique slug + hashed password (or magic-link), checked server-side
// via a Supabase Edge Function / Route Handler before the dashboard
// route ever renders, with the session stored in an httpOnly cookie.

export const SAMPLE_CLIENT = {
  name: "Pinnacle Pursuit SEO",
  slug: "pinnacle-pursuit-seo",
  // Change this before sharing the link with Dillon — this is just a
  // placeholder. Update it here, then redeploy.
  password: "Pinnacle-2026",
};

const SESSION_KEY = "dashboard_unlocked";

export function unlockSession() {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(SESSION_KEY, "1");
  }
}

export function isUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function lockSession() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(SESSION_KEY);
  }
}
