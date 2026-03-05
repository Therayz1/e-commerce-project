import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockUsers, User } from "../mock-data";

type UserStore = {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string) => Promise<boolean>;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
    currency: "USD" | "EUR" | "GBP";
    setCurrency: (c: "USD" | "EUR" | "GBP") => void;
};

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            user: mockUsers[0],
            isAuthenticated: true,
            currency: "USD",
            login: async (email) => {
                await new Promise((r) => setTimeout(r, 800));
                const found = mockUsers.find((u) => u.email === email);
                if (found) {
                    set({ user: found, isAuthenticated: true });
                    return true;
                }
                return false;
            },
            logout: () => set({ user: null, isAuthenticated: false }),
            updateUser: (updates) =>
                set((state) => ({ user: state.user ? { ...state.user, ...updates } : null })),
            setCurrency: (currency) => set({ currency }),
        }),
        { name: "user-storage" }
    )
);
