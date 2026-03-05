import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "../mock-data";

export type CartItem = {
    id: string;
    product: Product;
    quantity: number;
    size: string;
    color: { name: string; hex: string };
};

type CartStore = {
    items: CartItem[];
    isLoading: boolean;
    addItem: (product: Product, size: string, color: { name: string; hex: string }, quantity?: number) => Promise<void>;
    removeItem: (itemId: string) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    clearCart: () => void;
    total: () => number;
    itemCount: () => number;
    subtotal: () => number;
};

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isLoading: false,

            addItem: async (product, size, color, quantity = 1) => {
                set({ isLoading: true });
                await new Promise((r) => setTimeout(r, 300));
                set((state) => {
                    const existingId = `${product.id}-${size}-${color.name}`;
                    const existing = state.items.find((i) => i.id === existingId);
                    if (existing) {
                        return {
                            isLoading: false,
                            items: state.items.map((i) =>
                                i.id === existingId ? { ...i, quantity: i.quantity + quantity } : i
                            ),
                        };
                    }
                    return {
                        isLoading: false,
                        items: [...state.items, { id: existingId, product, quantity, size, color }],
                    };
                });
            },

            removeItem: async (itemId) => {
                set({ isLoading: true });
                await new Promise((r) => setTimeout(r, 200));
                set((state) => ({
                    isLoading: false,
                    items: state.items.filter((i) => i.id !== itemId),
                }));
            },

            updateQuantity: async (itemId, quantity) => {
                set({ isLoading: true });
                await new Promise((r) => setTimeout(r, 300));
                if (quantity < 1) {
                    set((state) => ({
                        isLoading: false,
                        items: state.items.filter((i) => i.id !== itemId),
                    }));
                    return;
                }
                set((state) => ({
                    isLoading: false,
                    items: state.items.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
                }));
            },

            clearCart: () => set({ items: [] }),

            total: () => {
                const { items } = get();
                return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
            },

            subtotal: () => {
                const { items } = get();
                return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
            },

            itemCount: () => {
                const { items } = get();
                return items.reduce((sum, item) => sum + item.quantity, 0);
            },
        }),
        { name: "cart-storage" }
    )
);
