/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    User, Package, Heart, MapPin, Search, ChevronRight, LogOut,
    CreditCard, Bell, Shield, Clock
} from "lucide-react";
import { useUserStore } from "@/lib/store/userStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { products, Product } from "@/lib/mock-data";
import { formatPrice, formatDate } from "@/lib/utils";
import { ProductCard } from "@/components/ProductCard";

type TabType = "profile" | "orders" | "wishlist" | "addresses" | "payment";

const mockOrders = [
    {
        id: "ord_12345",
        userId: "u1",
        status: "processing",
        date: "2025-05-15",
        total: 249.98,
        items: [
            { productId: "p1", quantity: 1, price: 79.99, size: "M", color: "White" },
            { productId: "p19", quantity: 1, price: 169.99, size: "10", color: "Orange/Grey" }
        ]
    },
    {
        id: "ord_67890",
        userId: "u1",
        status: "delivered",
        date: "2024-11-20",
        total: 109.99,
        items: [
            { productId: "p3", quantity: 1, price: 109.99, size: "S", color: "Floral Pink" }
        ]
    }
];

export default function AccountPage({ searchParams }: { searchParams: { tab?: string } }) {
    const { user, currency } = useUserStore();
    const { items: wishlistItems } = useWishlistStore();
    const [activeTab, setActiveTab] = useState<TabType>((searchParams.tab as TabType) || "profile");

    const activeOrders = mockOrders.filter((o: any) => o.status === "processing" || o.status === "shipped");
    const pastOrders = mockOrders.filter((o: any) => o.status === "delivered");

    const tabs = [
        { id: "profile", label: "My Profile", icon: User },
        { id: "orders", label: "Orders", icon: Package },
        { id: "wishlist", label: "Wishlist", icon: Heart },
        { id: "addresses", label: "Addresses", icon: MapPin },
        { id: "payment", label: "Payment Methods", icon: CreditCard },
    ];

    if (!user) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 page-enter">
                <h2 className="text-2xl font-bold mb-4 font-serif">Please log in to view your account</h2>
                <button className="btn-gradient px-8 py-3 rounded-xl font-bold">Sign In</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-24 page-enter">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-gray-200 pb-8">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-secondary rounded-2xl flex items-center justify-center border-4 border-white shadow-md shadow-primary-500/20 text-white font-bold text-3xl shrink-0">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 font-serif mb-1">Welcome back, {user.name.split(" ")[0]}!</h1>
                            <p className="text-gray-500">Member since {formatDate("2023-01-15")} • {user.email}</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:text-red-600 transition-colors">
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Sidebar Nav */}
                    <div className="md:col-span-1 space-y-2 sticky top-24 self-start">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl font-semibold transition-all ${activeTab === tab.id
                                    ? "bg-primary-500 text-white shadow-md shadow-primary-500/20 translate-x-1"
                                    : "bg-white text-gray-600 border border-transparent hover:bg-gray-50 hover:border-gray-200"
                                    }`}
                            >
                                <span className="flex items-center gap-3"><tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : "text-gray-400"}`} /> {tab.label}</span>
                                {tab.id === "wishlist" && wishlistItems.length > 0 && (
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-primary-100 text-primary-600"}`}>
                                        {wishlistItems.length}
                                    </span>
                                )}
                                {tab.id === "orders" && activeOrders.length > 0 && (
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-orange-100 text-orange-600"}`}>
                                        {activeOrders.length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <div className="md:col-span-3">

                        {/* PROFILE CONTENT */}
                        {activeTab === "profile" && (
                            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 font-serif">Personal Information</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Full Name</label>
                                            <input type="text" defaultValue={user.name} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none transition-colors" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                                            <input type="email" defaultValue={user.email} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none transition-colors" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                                            <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none transition-colors" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Date of Birth</label>
                                            <input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none transition-colors text-gray-700" />
                                        </div>
                                    </div>
                                    <div className="mt-8">
                                        <button className="btn-gradient px-8 py-3 rounded-xl font-bold shadow-[0_8px_20px_-6px_rgba(108,58,232,0.5)]">Save Changes</button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 font-serif">Preferences</h2>
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between py-4 border-b border-gray-100">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-900 flex items-center gap-2"><Bell className="w-4 h-4 text-primary-500" /> Order Notifications</span>
                                                <span className="text-sm text-gray-500 mt-1">Receive updates about your order status via email and SMS.</span>
                                            </div>
                                            <div className="w-12 h-7 bg-primary-500 rounded-full relative cursor-pointer"><div className="absolute top-1 left-6 w-5 h-5 bg-white rounded-full shadow-sm" /></div>
                                        </div>
                                        <div className="flex items-center justify-between py-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-900 flex items-center gap-2"><Shield className="w-4 h-4 text-green-500" /> Privacy & Security</span>
                                                <span className="text-sm text-gray-500 mt-1">Manage what information you share with StyleAI.</span>
                                            </div>
                                            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50">Manage</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ORDERS CONTENT */}
                        {activeTab === "orders" && (
                            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">

                                {/* Search / Filter */}
                                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                    <div className="relative flex-1">
                                        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                        <input type="text" placeholder="Search orders by ID or item..." className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-primary-500 outline-none transition-colors" />
                                    </div>
                                    <select className="px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-primary-500 text-gray-700 font-medium">
                                        <option>All Orders</option>
                                        <option>Last 30 Days</option>
                                        <option>Last 6 Months</option>
                                        <option>2023</option>
                                    </select>
                                </div>

                                {mockOrders.length === 0 ? (
                                    <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm text-center">
                                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
                                        <p className="text-gray-500 mb-6">You haven't placed any orders. Start browsing our collections!</p>
                                        <Link href="/products" className="btn-gradient px-8 py-3 rounded-xl font-bold">Start Shopping</Link>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {activeOrders.map((order: any) => (
                                            <div key={order.id} className="bg-white rounded-3xl border border-primary-100 shadow-sm overflow-hidden ring-1 ring-primary-500/10">
                                                <div className="bg-gradient-to-r from-primary-50 to-pink-50 p-6 flex flex-wrap justify-between items-center gap-4 border-b border-primary-100/50">
                                                    <div>
                                                        <p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-1">In Progress</p>
                                                        <h3 className="font-bold text-gray-900 text-lg">Order #{order.id.slice(0, 8)}</h3>
                                                        <p className="text-sm text-gray-500 mt-1">Placed on {formatDate(order.date)}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-xl text-gray-900 mb-1">{formatPrice(order.total, currency)}</p>
                                                        <Link href={`#`} className="text-sm font-semibold text-primary-600 hover:text-primary-700 underline">View Invoice</Link>
                                                    </div>
                                                </div>
                                                <div className="p-6">
                                                    <div className="relative pt-8 pb-10">
                                                        {/* Progress bar mock */}
                                                        <div className="absolute top-10 left-0 right-0 h-1 bg-gray-100 z-0" />
                                                        <div className="absolute top-10 left-0 w-2/3 h-1 bg-gradient-to-r from-primary-500 to-secondary z-0" />
                                                        <div className="relative z-10 flex justify-between">
                                                            <div className="flex flex-col items-center"><div className="w-4 h-4 rounded-full bg-primary-500 mb-2 ring-4 ring-primary-50" /> <span className="text-xs font-semibold text-primary-700">Processing</span></div>
                                                            <div className="flex flex-col items-center"><div className="w-4 h-4 rounded-full bg-primary-500 mb-2 ring-4 ring-primary-50" /> <span className="text-xs font-semibold text-primary-700">Shipped</span></div>
                                                            <div className="flex flex-col items-center"><div className="w-4 h-4 rounded-full bg-gray-200 mb-2" /> <span className="text-xs font-semibold text-gray-400">Out for delivery</span></div>
                                                            <div className="flex flex-col items-center"><div className="w-4 h-4 rounded-full bg-gray-200 mb-2" /> <span className="text-xs font-semibold text-gray-400">Delivered</span></div>
                                                        </div>
                                                    </div>
                                                    <div className="border-t border-gray-100 pt-6 mt-2 space-y-4">
                                                        {order.items.map((oItem: any) => {
                                                            const p = products.find(prod => prod.id === oItem.productId);
                                                            if (!p) return null;
                                                            return (
                                                                <div key={oItem.productId} className="flex gap-4">
                                                                    <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden relative shrink-0">
                                                                        <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className="font-semibold text-gray-900 line-clamp-1">{p.name}</p>
                                                                        <p className="text-sm text-gray-500 mt-1">Qty: {oItem.quantity} • {formatPrice(oItem.price, currency)}</p>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Past Orders */}
                                        {pastOrders.length > 0 && (
                                            <div className="pt-8">
                                                <h3 className="text-lg font-bold text-gray-900 font-serif mb-6 flex items-center gap-2"><Clock className="w-5 h-5 text-gray-400" /> Order History</h3>
                                                <div className="space-y-4">
                                                    {pastOrders.map((order: any) => (
                                                        <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                                                            <div className="flex gap-6 items-center flex-1">
                                                                <div className="w-12 h-12 bg-gray-50 rounded-full flex gap-1 items-center justify-center p-2">
                                                                    {order.items.slice(0, 2).map((oi: any, i: number) => {
                                                                        const p = products.find(prod => prod.id === oi.productId);
                                                                        if (!p) return null;
                                                                        return <div key={i} className="w-8 h-8 rounded-full overflow-hidden relative -ml-3 first:ml-0 border-2 border-white"><Image src={p.images[0]} alt="" fill className="object-cover" /></div>
                                                                    })}
                                                                    {order.items.length > 2 && <span className="text-xs text-gray-500 ml-1">+{order.items.length - 2}</span>}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <h4 className="font-bold text-gray-900 mb-1">Order #{order.id.slice(0, 8)}</h4>
                                                                    <p className="text-sm text-gray-500 text-sm truncate">Delivered on {formatDate(order.date)} • {order.items.length} items</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                                                                <span className="font-bold text-gray-900 w-20 text-right">{formatPrice(order.total, currency)}</span>
                                                                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 text-gray-700 whitespace-nowrap">Buy Again</button>
                                                                <button className="p-2 text-gray-400 hover:text-gray-900 rounded-lg shrink-0"><ChevronRight className="w-5 h-5" /></button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* WISHLIST CONTENT */}
                        {activeTab === "wishlist" && (
                            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 font-serif">Your Wishlist</h2>
                                    <span className="text-gray-500 font-medium">{wishlistItems.length} items</span>
                                </div>

                                {wishlistItems.length === 0 ? (
                                    <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm text-center">
                                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
                                        <p className="text-gray-500 mb-6">Save items you love to review them later.</p>
                                        <Link href="/products" className="btn-gradient px-8 py-3 rounded-xl font-bold">Discover Fashion</Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                                        {wishlistItems.map(item => (
                                            <ProductCard key={item.id} product={item} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
