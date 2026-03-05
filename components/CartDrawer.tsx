"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { useUIStore } from "@/lib/store/uiStore";
import { useCartStore } from "@/lib/store/cartStore";
import { useUserStore } from "@/lib/store/userStore";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
    const { isCartOpen, closeCart } = useUIStore();
    const { items, removeItem, updateQuantity, total } = useCartStore();
    const { currency } = useUserStore();
    const subtotal = total();
    const shipping = subtotal >= 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const grandTotal = subtotal + shipping + tax;

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-primary-500" />
                                <h2 className="text-lg font-bold text-gray-900">
                                    My Cart ({items.reduce((s, i) => s + i.quantity, 0)})
                                </h2>
                            </div>
                            <button
                                onClick={closeCart}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                aria-label="Close cart"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                                        <ShoppingBag className="w-10 h-10 text-gray-300" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 mb-1">Your cart is empty</p>
                                        <p className="text-sm text-gray-500">Add items you love to get started</p>
                                    </div>
                                    <Link
                                        href="/products"
                                        onClick={closeCart}
                                        className="btn-gradient text-sm px-6 py-2.5 rounded-xl"
                                    >
                                        Start Shopping
                                    </Link>
                                </div>
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20, height: 0 }}
                                            className="flex gap-3 p-3 bg-gray-50 rounded-2xl"
                                        >
                                            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
                                                <Image
                                                    src={item.product.images[0]}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="64px"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.product.name}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {item.size} · <span style={{ color: item.color.hex === "#FFFFFF" ? "#999" : item.color.hex }}>■</span> {item.color.name}
                                                </p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="p-1 hover:bg-gray-50 transition-colors rounded-l-lg"
                                                            aria-label="Decrease quantity"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="text-xs font-semibold px-2 min-w-[24px] text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="p-1 hover:bg-gray-50 transition-colors rounded-r-lg"
                                                            aria-label="Increase quantity"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <p className="text-sm font-bold text-primary-500">
                                                        {formatPrice(item.product.price * item.quantity, currency)}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Summary */}
                        {items.length > 0 && (
                            <div className="p-4 border-t border-gray-100 space-y-3">
                                {/* Free shipping progress */}
                                {subtotal < 50 && (
                                    <div>
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>Add {formatPrice(50 - subtotal, currency)} for free shipping</span>
                                        </div>
                                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-primary-500 to-secondary rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
                                                transition={{ duration: 0.5 }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(subtotal, currency)}</span></div>
                                    <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : formatPrice(shipping, currency)}</span></div>
                                    <div className="flex justify-between text-gray-600"><span>Tax (8%)</span><span>{formatPrice(tax, currency)}</span></div>
                                    <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-2">
                                        <span>Total</span><span className="text-primary-500">{formatPrice(grandTotal, currency)}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Link
                                        href="/checkout"
                                        onClick={closeCart}
                                        className="block w-full text-center btn-gradient py-3 rounded-xl"
                                    >
                                        Checkout
                                    </Link>
                                    <Link
                                        href="/cart"
                                        onClick={closeCart}
                                        className="block w-full text-center py-2.5 border border-gray-200 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        View Full Cart
                                    </Link>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
