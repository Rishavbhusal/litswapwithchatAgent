import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { VincentUser } from "../lib/vincent-auth";

interface AuthState {
  user: VincentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  jwt: string | null;
}

interface AuthActions {
  setUser: (user: VincentUser | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setJWT: (jwt: string | null) => void;
  logout: () => void;
  reset: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  jwt: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user) => set({ user }),

      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

      setLoading: (isLoading) => set({ isLoading }),

      setJWT: (jwt) => set({ jwt }),

      logout: () => {
        // Clear Vincent authentication data from localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("VINCENT_AUTH_JWT");
          localStorage.removeItem("vincent-auth-storage");
        }

        set({
          user: null,
          isAuthenticated: false,
          jwt: null,
          isLoading: false,
        });
      },

      reset: () => set(initialState),
    }),
    {
      name: "vincent-auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        jwt: state.jwt,
      }),
    }
  )
);
