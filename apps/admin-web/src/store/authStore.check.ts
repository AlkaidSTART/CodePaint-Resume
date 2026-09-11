import { useAuthStore } from "./authStore";

// ponytail: basic runtime invariants for store state transitions; upgrade to vitest if admin test suite expanded.
function assert(condition: unknown, msg: string) {
  if (!condition) throw new Error(`[AuthStore Check Failed] ${msg}`);
}

export async function checkAuthStoreInvariants() {
  const store = useAuthStore.getState();
  assert(typeof store.isAuthenticated === "boolean", "isAuthenticated must be boolean");
  assert(typeof store.login === "function", "login must be function");
  assert(typeof store.register === "function", "register must be function");
  assert(typeof store.logout === "function", "logout must be function");
}
