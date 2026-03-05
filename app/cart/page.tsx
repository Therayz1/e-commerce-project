"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Minus, Plus, ArrowRight, ShieldCheck, Gift, Tag } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { useUserStore } from "@/lib/store/userStore";
import { useState } from "react";

export default function CartPage() {
    const { items, removeItem, updateQuantity, subtotal, total, clearCart } = useCartStore();
    const { currency } = useUserStore();
    const [coupon, setCoupon] = useState("");
    const [isGift, setIsGift] = useState(false);

    const shippingThreshold = 50;
    const cartSubtotal = subtotal();
    const progress = Math.min((cartSubtotal / shippingThreshold) * 100, 100);
    const isFreeShipping = cartSubtotal >= shippingThreshold;

    const estimatedTax = cartSubtotal * 0.08; // 8% mock tax
    const finalTotal = cartSubtotal + (isFreeShipping ? 0 : 9.99) + estimatedTax;

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 px-4 bg-gray-50 page-enter">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                    <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 font-serif">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 max-w-sm text-center">Looks like you haven't added anything to your cart yet. Discover our latest collections.</p>
                <Link href="/products" className="btn-gradient px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 group">
                    Keep Shopping <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-24 page-enter">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif mb-8 flex items-center gap-3">
                    Shopping Cart <span className="text-gray-400 font-sans font-medium text-xl">({items.length} items)</span>
                </h1>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* Main Cart Items */}
                    <div className="flex-1 space-y-6">

                        {/* Free Shipping Progress */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2 rounded-full ${isFreeShipping ? "bg-green-100 text-green-600" : "bg-primary-100 text-primary-600"}`}>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">
                                        {isFreeShipping ? "You've unlocked Free Standard Shipping!" : `You're ${formatPrice(shippingThreshold - cartSubtotal, currency)} away from Free Shipping!`}
                                    </h3>
                                </div>
                            </div>
                            <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className={`h-full ${isFreeShipping ? "bg-green-500" : "bg-gradient-to-r from-primary-400 to-secondary"}`}
                                />
                            </div>
                        </div>

                        {/* Cart Items List */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 bg-gray-50/50 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                <div className="col-span-6">Product</div>
                                <div className="col-span-3 text-center">Quantity</div>
                                <div className="col-span-3 text-right">Total</div>
                            </div>

                            <AnimatePresence>
                                {items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3 }}
                                        className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 p-4 sm:p-6 border-b border-gray-100 items-center last:border-b-0"
                                    >
                                        {/* Info */}
                                        <div className="col-span-1 border-b sm:border-b-0 pb-4 sm:pb-0 sm:col-span-6 flex gap-4">
                                            <Link href={`/products/${item.product.id}`} className="shrink-0">
                                                <div className="w-20 h-24 sm:w-24 sm:h-32 bg-gray-100 rounded-xl overflow-hidden relative">
                                                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                                                </div>
                                            </Link>
                                            <div className="flex flex-col">
                                                <Link href={`/products/${item.product.id}`} className="font-bold text-gray-900 hover:text-primary-600 line-clamp-2">
                                                    {item.product.name}
                                                </Link>
                                                <span className="text-gray-500 text-sm mt-1 mb-2 font-medium">{formatPrice(item.product.price, currency)} each</span>
                                                <div className="mt-auto space-y-1">
                                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                                        <span className="w-16">Color:</span>
                                                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: item.color.hex }} /> {item.color.name}</span>
                                                    </p>
                                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                                        <span className="w-16">Size:</span>
                                                        <span className="font-medium text-gray-900">{item.size}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quantity */}
                                        <div className="col-span-1 sm:col-span-3 flex justify-between sm:justify-center items-center">
                                            <span className="sm:hidden text-sm font-medium text-gray-500">Quantity</span>
                                            <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-white">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-10 text-center font-semibold text-sm">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Total & Action */}
                                        <div className="col-span-1 sm:col-span-3 flex justify-between sm:flex-col items-center sm:items-end gap-2">
                                            <span className="sm:hidden text-sm font-medium text-gray-500">Total</span>
                                            <span className="font-bold text-lg text-gray-900">
                                                {formatPrice(item.product.price * item.quantity, currency)}
                                            </span>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center gap-2 text-sm mt-auto"
                                            >
                                                <Trash2 className="w-4 h-4" /> <span className="sm:hidden">Remove</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                                <button onClick={clearCart} className="text-sm text-gray-500 font-medium hover:text-gray-900">
                                    Empty cart
                                </button>
                                <div className="text-sm text-gray-500">
                                    <ShieldCheck className="w-4 h-4 inline mr-1 text-green-600" /> Secure SSL processing
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-pink-500">
                                    <Gift className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Is this a gift?</h4>
                                    <p className="text-sm text-gray-500">Add a premium gift box and personal message.</p>
                                </div>
                            </div>
                            <label className="flex items-center cursor-pointer">
                                <div className={`w-12 h-7 rounded-full relative transition-colors ${isGift ? "bg-primary-500" : "bg-gray-200"}`}>
                                    <input type="checkbox" className="hidden" checked={isGift} onChange={(e) => setIsGift(e.target.checked)} />
                                    <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow-sm ${isGift ? "left-6" : "left-1"}`} />
                                </div>
                            </label>
                        </div>
                        {isGift && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-white p-6 rounded-2xl border border-primary-100 bg-primary-50/30">
                                <textarea className="w-full h-24 p-4 rounded-xl border border-gray-200 outline-none focus:border-primary-500 resize-none text-sm placeholder:text-gray-400" placeholder="Type your gift message here (optional)..." />
                                <p className="text-xs text-gray-500 mt-2">+ $5.00 for premium gift wrapping</p>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar Summary */}
                    <div className="lg:w-[400px] shrink-0">
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 font-serif">Order Summary</h2>

                            <div className="space-y-4 text-sm mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-medium text-gray-900">{formatPrice(cartSubtotal, currency)}</span>
                                </div>
                                {isGift && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Gift Wrap</span>
                                        <span className="font-medium text-gray-900">{formatPrice(5, currency)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-500 flex items-center gap-1">Shipping <Tag className="w-3 h-3" /></span>
                                    {isFreeShipping ? (
                                        <span className="font-medium text-green-600">Free</span>
                                    ) : (
                                        <span className="font-medium text-gray-900">{formatPrice(9.99, currency)}</span>
                                    )}
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Estimated Tax</span>
                                    <span className="font-medium text-gray-900">{formatPrice(estimatedTax, currency)}</span>
                                </div>
                            </div>

                            <div className="pb-6 border-b border-gray-100 mb-6">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={coupon}
                                        onChange={(e) => setCoupon(e.target.value)}
                                        placeholder="Enter promo code"
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary-500"
                                    />
                                    <button className="px-5 py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors">
                                        Apply
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between mb-8 items-end">
                                <div>
                                    <span className="text-gray-900 font-bold block text-lg">Total</span>
                                    <span className="text-gray-400 text-xs">Including ${estimatedTax.toFixed(2)} in taxes</span>
                                </div>
                                <span className="text-3xl font-bold text-gray-900">{formatPrice(finalTotal + (isGift ? 5 : 0), currency)}</span>
                            </div>

                            <Link href="/checkout" className="btn-gradient w-full py-4 text-center rounded-xl font-bold flex flex-col items-center justify-center gap-1 shadow-[0_8px_20px_-6px_rgba(108,58,232,0.5)] group">
                                <span className="flex items-center gap-2 text-lg">Proceed to Checkout <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
                            </Link>

                            <div className="mt-6 flex flex-wrap justify-center gap-3 opacity-50 grayscale">
                                <div className="w-12 h-6 bg-gray-200 rounded border border-gray-300 flex items-center justify-center text-[10px] font-bold">VISA</div>
                                <div className="w-12 h-6 bg-gray-200 rounded border border-gray-300 flex items-center justify-center text-[10px] font-bold">MC</div>
                                <div className="w-12 h-6 bg-gray-200 rounded border border-gray-300 flex items-center justify-center text-[10px] font-bold">AMEX</div>
                                <div className="w-12 h-6 bg-gray-200 rounded border border-gray-300 flex items-center justify-center text-[10px] font-bold">PPAL</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
