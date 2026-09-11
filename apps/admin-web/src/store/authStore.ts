import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ApiError, api } from "../lib/api-client";
import type { Role, User } from "../lib/types";

export type AuthStatus = "idle" | "loading" | "authenticated" | "anonymous";

type AuthState = {
  user: User | null;
  status: AuthStatus;
  error: string | null;
  /** True once the first session restore attempt has finished. */
  bootstrapped: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (input: { email: string; name: string; password: string }) => Promise<User>;
  logout: () => Promise<void>;
  bootstrap: () => Promise<void>;
  clearError: () => void;
};

function messageOf(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function normalizeUser(user: User): User {
  return {
    ...user,
    roles: (user.roles ?? []).filter((role): role is Role => Boolean(role)),
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      status: "idle",
      error: null,
      bootstrapped: false,

      clearError: () => set({ error: null }),

      login: async (email, password) => {
        set({ status: "loading", error: null });
        try {
          const { user } = await api.login({ email, password });
          const next = normalizeUser(user);
          set({ user: next, status: "authenticated", error: null, bootstrapped: true });
          return next;
        } catch (error) {
          set({
            status: "anonymous",
            error: messageOf(error, "登录失败，请稍后重试"),
          });
          throw error;
        }
      },

      register: async (input) => {
        set({ status: "loading", error: null });
        try {
          const { user } = await api.register(input);
          const next = normalizeUser(user);
          set({ user: next, status: "authenticated", error: null, bootstrapped: true });
          return next;
        } catch (error) {
          set({
            status: "anonymous",
            error: messageOf(error, "注册失败，请检查填写的信息"),
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await api.logout();
        } catch {
          // Logging out locally must still succeed if the network call fails.
        }
        set({ user: null, status: "anonymous", error: null, bootstrapped: true });
      },

      bootstrap: async () => {
        // Already authenticated in this tab's lifetime; don't refetch.
        if (get().status === "authenticated" && get().user) {
          set({ bootstrapped: true });
          return;
        }
        set({ status: "loading", error: null });
        try {
          const principal = await api.getPrincipal();
          const cached = get().user;
          const merged: User = normalizeUser({
            id: principal.id,
            roles: principal.roles,
            email: cached?.email ?? "",
            name: cached?.name ?? "招新成员",
            status: cached?.status ?? "active",
          });
          set({ user: merged, status: "authenticated", error: null, bootstrapped: true });
        } catch (error) {
          if (error instanceof ApiError && error.isAuthError) {
            set({ user: null, status: "anonymous", error: null, bootstrapped: true });
            return;
          }
          // Network/backend unavailable: keep any persisted session info.
          const cached = get().user;
          set({
            status: cached ? "authenticated" : "anonymous",
            error: cached ? null : messageOf(error, "无法连接服务器"),
            bootstrapped: true,
          });
        }
      },
    }),
    {
      name: "codepaint-admin-auth",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

export const authActions = {
  login: (email: string, password: string) => useAuthStore.getState().login(email, password),
  logout: () => useAuthStore.getState().logout(),
  bootstrap: () => useAuthStore.getState().bootstrap(),
};
