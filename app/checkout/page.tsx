"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, Lock, MapPin, CreditCard, ChevronDown } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useUserStore } from "@/lib/store/userStore";
import { formatPrice } from "@/lib/utils";
import confetti from "canvas-confetti";

type CheckoutStep = "shipping" | "payment" | "review";

export default function CheckoutPage() {
    const router = useRouter();
    const { items, subtotal, clearCart } = useCartStore();
    const { currency, user } = useUserStore();
    const [step, setStep] = useState<CheckoutStep>("shipping");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Form State
    const [shippingInfo, setShippingInfo] = useState({
        firstName: user?.name?.split(" ")[0] || "",
        lastName: user?.name?.split(" ")[1] || "",
        email: user?.email || "",
        address: "123 Style Avenue",
        city: "New York",
        state: "NY",
        zip: "10001",
        country: "United States"
    });

    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: "",
        expiry: "",
        cvc: "",
        nameOnCard: ""
    });

    const cartSubtotal = subtotal();
    const estimatedTax = cartSubtotal * 0.08;
    const shippingCost = cartSubtotal > 50 ? 0 : 9.99;
    const finalTotal = cartSubtotal + shippingCost + estimatedTax;

    if (items.length === 0 && !isSuccess) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 page-enter">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <Link href="/products" className="btn-gradient px-6 py-2 rounded-xl">Continue Shopping</Link>
            </div>
        );
    }

    const handleNextStep = (current: CheckoutStep) => {
        if (current === "shipping") {
            setStep("payment");
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (current === "payment") {
            setStep("review");
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handlePlaceOrder = () => {
        setIsProcessing(true);
        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            clearCart();
            window.scrollTo({ top: 0, behavior: "smooth" });

            // Confetti effect
            const duration = 3 * 1000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#6366f1', '#ec4899', '#06b6d4'] });
                confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#6366f1', '#ec4899', '#06b6d4'] });
                if (Date.now() < end) requestAnimationFrame(frame);
            };
            frame();

        }, 2000);
    };

    const StepIndicator = () => (
        <div className="flex items-center justify-between relative mb-12 max-w-2xl mx-auto">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10 -translate-y-1/2" />
            <div className="absolute top-1/2 left-0 h-0.5 bg-primary-500 -z-10 -translate-y-1/2 transition-all duration-500"
                style={{ width: step === "shipping" ? "0%" : step === "payment" ? "50%" : "100%" }} />

            {[
                { id: "shipping", label: "Shipping", icon: MapPin },
                { id: "payment", label: "Payment", icon: CreditCard },
                { id: "review", label: "Review", icon: CheckCircle2 }
            ].map((s, i) => {
                const isActive = step === s.id;
                const isPast = (step === "payment" && i === 0) || (step === "review" && i < 2) || isSuccess;

                return (
                    <div key={s.id} className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border-2 ${isActive ? "bg-primary-500 border-primary-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]" :
                            isPast ? "bg-white border-primary-500 text-primary-500" :
                                "bg-white border-gray-200 text-gray-400"
                            }`}>
                            {isPast && !isActive ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                        </div>
                        <span className={`text-sm font-semibold ${isActive ? "text-gray-900" : isPast ? "text-primary-600" : "text-gray-400"}`}>{s.label}</span>
                    </div>
                );
            })}
        </div>
    );

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4 page-enter">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center border border-gray-100"
                >
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 shadow-inner">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h1 className="text-3xl font-bold font-serif text-gray-900 mb-4">Order Confirmed!</h1>
                    <p className="text-gray-600 mb-8">Thank you for your purchase. We've received your order and are getting it ready to ship. Your order number is <strong>#SAI-{Math.floor(Math.random() * 100000)}</strong>.</p>
                    <div className="space-y-4">
                        <Link href="/account?tab=orders" className="btn-gradient w-full py-4 rounded-xl font-bold block">
                            Track Order
                        </Link>
                        <Link href="/products" className="block w-full py-4 text-gray-600 font-semibold hover:text-gray-900 transition-colors">
                            Continue Shopping
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-24 page-enter">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16">

                <StepIndicator />

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* Main Form Area */}
                    <div className="flex-1">
                        <AnimatePresence mode="wait">

                            {/* SHIPPING STEP */}
                            {step === "shipping" && (
                                <motion.div key="shipping" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-8 font-serif">Shipping Details</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">First Name</label>
                                            <input type="text" value={shippingInfo.firstName} onChange={e => setShippingInfo({ ...shippingInfo, firstName: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none transition-colors" placeholder="John" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Last Name</label>
                                            <input type="text" value={shippingInfo.lastName} onChange={e => setShippingInfo({ ...shippingInfo, lastName: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none transition-colors" placeholder="Doe" />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                                            <input type="email" value={shippingInfo.email} onChange={e => setShippingInfo({ ...shippingInfo, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none transition-colors" placeholder="john@example.com" />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-semibold text-gray-700">Street Address</label>
                                            <input type="text" value={shippingInfo.address} onChange={e => setShippingInfo({ ...shippingInfo, address: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none transition-colors" placeholder="123 Main St" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">City</label>
                                            <input type="text" value={shippingInfo.city} onChange={e => setShippingInfo({ ...shippingInfo, city: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none transition-colors" placeholder="New York" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">State</label>
                                                <input type="text" value={shippingInfo.state} onChange={e => setShippingInfo({ ...shippingInfo, state: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none transition-colors" placeholder="NY" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">Zip</label>
                                                <input type="text" value={shippingInfo.zip} onChange={e => setShippingInfo({ ...shippingInfo, zip: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none transition-colors" placeholder="10001" />
                                            </div>
                                        </div>
                                    </div>

                                    <button onClick={() => handleNextStep("shipping")} className="btn-gradient w-full md:w-auto md:px-12 py-4 rounded-xl font-bold flex items-center justify-center gap-2 ml-auto">
                                        Continue to Payment <ChevronRight className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            )}

                            {/* PAYMENT STEP */}
                            {step === "payment" && (
                                <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-8 font-serif">Payment Method</h2>

                                    <div className="mb-8 space-y-4">
                                        <label className="flex items-center gap-4 p-4 border-2 border-primary-500 rounded-2xl bg-primary-50/30 cursor-pointer">
                                            <input type="radio" name="payment" className="w-5 h-5 text-primary-600 focus:ring-primary-500" defaultChecked />
                                            <div className="flex-1 flex justify-between items-center">
                                                <span className="font-semibold text-gray-900">Credit / Debit Card</span>
                                                <div className="flex gap-1">
                                                    <div className="w-8 h-5 bg-gray-200 rounded shrink-0"></div>
                                                    <div className="w-8 h-5 bg-gray-200 rounded shrink-0"></div>
                                                </div>
                                            </div>
                                        </label>
                                        <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-2xl hover:border-gray-300 cursor-pointer transition-colors">
                                            <input type="radio" name="payment" className="w-5 h-5 text-primary-600 focus:ring-primary-500" />
                                            <div className="flex-1 flex justify-between items-center">
                                                <span className="font-medium text-gray-700">PayPal</span>
                                                <div className="w-12 h-5 bg-gray-200 rounded shrink-0"></div>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="space-y-6 mb-8">
                                        <div className="space-y-2 relative">
                                            <label className="text-sm font-semibold text-gray-700">Card Number</label>
                                            <div className="relative">
                                                <input type="text" value={paymentInfo.cardNumber} onChange={e => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none transition-colors" placeholder="0000 0000 0000 0000" />
                                                <CreditCard className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Name on Card</label>
                                            <input type="text" value={paymentInfo.nameOnCard} onChange={e => setPaymentInfo({ ...paymentInfo, nameOnCard: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none transition-colors" placeholder="John Doe" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">Expiration Date</label>
                                                <input type="text" value={paymentInfo.expiry} onChange={e => setPaymentInfo({ ...paymentInfo, expiry: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none transition-colors" placeholder="MM/YY" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700 flex justify-between items-center">
                                                    CVC <span className="w-4 h-4 rounded-full bg-gray-200 text-[10px] flex items-center justify-center text-gray-500">?</span>
                                                </label>
                                                <input type="text" value={paymentInfo.cvc} onChange={e => setPaymentInfo({ ...paymentInfo, cvc: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none transition-colors" placeholder="123" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4">
                                        <button onClick={() => setStep("shipping")} className="text-gray-500 font-medium hover:text-gray-900 transition-colors w-full md:w-auto text-center py-4">
                                            Back to Shipping
                                        </button>
                                        <button onClick={() => handleNextStep("payment")} className="btn-gradient w-full md:w-auto md:px-12 py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                                            Review Order <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* REVIEW STEP */}
                            {step === "review" && (
                                <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">

                                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 text-primary-500 pointer-events-none">
                                            <CheckCircle2 className="w-32 h-32 -mt-10 -mr-10" />
                                        </div>
                                        <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-6">
                                            <h3 className="text-xl font-bold text-gray-900 font-serif">Shipping Address</h3>
                                            <button onClick={() => setStep("shipping")} className="text-sm font-semibold text-primary-600 hover:underline">Edit</button>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed font-medium">
                                            {shippingInfo.firstName} {shippingInfo.lastName}<br />
                                            {shippingInfo.address}<br />
                                            {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}<br />
                                            {shippingInfo.country}
                                        </p>
                                    </div>

                                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-6">
                                            <h3 className="text-xl font-bold text-gray-900 font-serif">Payment Method</h3>
                                            <button onClick={() => setStep("payment")} className="text-sm font-semibold text-primary-600 hover:underline">Edit</button>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-8 bg-gray-100 rounded border border-gray-200 flex items-center justify-center shrink-0">
                                                <CreditCard className="w-5 h-5 text-gray-500" />
                                            </div>
                                            <p className="text-gray-900 font-semibold text-lg tracking-wide">
                                                <span className="opacity-50 tracking-widest mr-2">•••• •••• ••••</span> {paymentInfo.cardNumber.slice(-4) || "4242"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mt-6 lg:hidden">
                                        {/* Render order summary for mobile inside the flow */}
                                        <h3 className="text-xl font-bold text-gray-900 font-serif mb-4">Order Items ({items.length})</h3>
                                        <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6 pr-2">
                                            {items.map(item => (
                                                <div key={item.product.id} className="flex gap-4 items-center">
                                                    <div className="relative w-16 h-16 rounded overflow-hidden shadow-sm shrink-0">
                                                        <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-gray-900 truncate">{item.product.name}</p>
                                                        <p className="text-xs text-gray-500">Qty: {item.quantity} | {item.size}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-sm">{formatPrice(item.product.price * item.quantity, currency)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            onClick={handlePlaceOrder}
                                            disabled={isProcessing}
                                            className="btn-gradient w-full py-4 text-center rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_8px_20px_-6px_rgba(108,58,232,0.5)]"
                                        >
                                            {isProcessing ? (
                                                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
                                            ) : (
                                                <><Lock className="w-4 h-4" /> Place Order ({formatPrice(finalTotal, currency)})</>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>

                    {/* Sidebar Summary (Desktop) */}
                    <div className="hidden lg:block lg:w-[420px] shrink-0">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 font-serif">In Your Bag</h2>

                            <div className="space-y-6 max-h-[300px] overflow-y-auto mb-6 pr-4 scrollbar-hide">
                                {items.map(item => (
                                    <div key={`${item.product.id}-${item.size}-${item.color.name}`} className="flex gap-4">
                                        <div className="relative w-20 h-24 rounded-lg overflow-hidden shadow-sm shrink-0">
                                            <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col pt-1">
                                            <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight mb-1">{item.product.name}</p>
                                            <p className="text-xs text-gray-500 mb-2">{item.color.name} / {item.size}</p>
                                            <div className="mt-auto flex justify-between items-center w-full">
                                                <span className="text-xs text-gray-500 font-medium">Qty: {item.quantity}</span>
                                                <span className="font-bold text-sm text-gray-900">{formatPrice(item.product.price * item.quantity, currency)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-6 space-y-4 text-sm mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-medium text-gray-900">{formatPrice(cartSubtotal, currency)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Shipping</span>
                                    {shippingCost === 0 ? (
                                        <span className="font-medium text-green-600">Free</span>
                                    ) : (
                                        <span className="font-medium text-gray-900">{formatPrice(shippingCost, currency)}</span>
                                    )}
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Estimated Tax</span>
                                    <span className="font-medium text-gray-900">{formatPrice(estimatedTax, currency)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between mb-8 items-end border-t border-gray-100 pt-6">
                                <div>
                                    <span className="text-gray-900 font-bold block text-lg">Total</span>
                                </div>
                                <span className="text-3xl font-bold text-gray-900">{formatPrice(finalTotal, currency)}</span>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={step === "review" ? handlePlaceOrder : () => handleNextStep(step)}
                                    disabled={isProcessing}
                                    className="btn-gradient w-full py-4 text-center rounded-xl font-bold flex flex-col items-center justify-center gap-1 shadow-[0_8px_20px_-6px_rgba(108,58,232,0.5)] group h-[60px]"
                                >
                                    {isProcessing ? (
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <span className="flex items-center gap-2 text-lg">
                                            {step === "review" ? <><Lock className="w-5 h-5" /> Place Order</> : `Continue to ${step === "shipping" ? "Payment" : "Review"}`}
                                        </span>
                                    )}
                                </button>
                                <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1.5 mt-4">
                                    <Lock className="w-3 h-3" /> Payments are secure and encrypted
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
