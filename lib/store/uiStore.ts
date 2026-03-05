import { create } from "zustand";

type Toast = {
    id: string;
    type: "success" | "error" | "info" | "warning";
    message: string;
    title?: string;
};

type UIStore = {
    isCartOpen: boolean;
    isMenuOpen: boolean;
    isSearchOpen: boolean;
    compareItems: string[];
    recentlyViewed: string[];
    toasts: Toast[];
    toggleCart: () => void;
    toggleMenu: () => void;
    toggleSearch: () => void;
    openCart: () => void;
    closeCart: () => void;
    addToCompare: (id: string) => void;
    removeFromCompare: (id: string) => void;
    clearCompare: () => void;
    addRecentlyViewed: (id: string) => void;
    addToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;
};

export const useUIStore = create<UIStore>((set) => ({
    isCartOpen: false,
    isMenuOpen: false,
    isSearchOpen: false,
    compareItems: [],
    recentlyViewed: [],
    toasts: [],

    toggleCart: () => set((s) => ({ isCartOpen: !s.isCartOpen, isMenuOpen: false })),
    toggleMenu: () => set((s) => ({ isMenuOpen: !s.isMenuOpen, isCartOpen: false })),
    toggleSearch: () => set((s) => ({ isSearchOpen: !s.isSearchOpen })),
    openCart: () => set({ isCartOpen: true }),
    closeCart: () => set({ isCartOpen: false }),

    addToCompare: (id) =>
        set((s) => {
            if (s.compareItems.includes(id) || s.compareItems.length >= 3) return s;
            return { compareItems: [...s.compareItems, id] };
        }),
    removeFromCompare: (id) =>
        set((s) => ({ compareItems: s.compareItems.filter((i) => i !== id) })),
    clearCompare: () => set({ compareItems: [] }),

    addRecentlyViewed: (id) =>
        set((s) => {
            const filtered = s.recentlyViewed.filter((i) => i !== id);
            return { recentlyViewed: [id, ...filtered].slice(0, 10) };
        }),

    addToast: (toast) => {
        const id = Math.random().toString(36).slice(2);
        set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
        setTimeout(() => {
            set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
        }, 3500);
    },
    removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
