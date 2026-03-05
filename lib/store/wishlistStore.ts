import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "../mock-data";

type WishlistStore = {
    items: Product[];
    toggleWishlist: (product: Product) => void;
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],
            toggleWishlist: (product) =>
                set((state) => {
                    const exists = state.items.find((i) => i.id === product.id);
                    return {
                        items: exists
                            ? state.items.filter((i) => i.id !== product.id)
                            : [...state.items, product],
                    };
                }),
            isInWishlist: (productId) => get().items.some((i) => i.id === productId),
            clearWishlist: () => set({ items: [] }),
        }),
        { name: "wishlist-storage" }
    )
);
