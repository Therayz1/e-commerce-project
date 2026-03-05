"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, Globe } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { useUIStore } from "@/lib/store/uiStore";
import { useUserStore } from "@/lib/store/userStore";
import { products } from "@/lib/mock-data";
import { useRouter } from "next/navigation";

const navLinks = [
    { label: "Men", href: "/products?category=men" },
    { label: "Women", href: "/products?category=women" },
    { label: "Kids", href: "/products?category=kids" },
    { label: "Shoes", href: "/products?category=shoes" },
    { label: "Accessories", href: "/products?category=accessories" },
    { label: "Sale", href: "/products?category=sale" },
];

export function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);

    const itemCount = useCartStore((s) => s.itemCount());
    const wishlistCount = useWishlistStore((s) => s.items.length);
    const { isCartOpen, isMenuOpen, toggleCart, toggleMenu, closeCart } = useUIStore();
    const { currency, setCurrency } = useUserStore();

    useEffect(() => {
        const stored = localStorage.getItem("recent-searches");
        if (stored) setRecentSearches(JSON.parse(stored));
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isHomepage = pathname === "/";
    const isTransparent = isHomepage && !isScrolled && !isMenuOpen;

    const suggestions = searchQuery.length > 1
        ? products.filter((p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some((t) => t.includes(searchQuery.toLowerCase()))
        ).slice(0, 5)
        : [];

    const handleSearch = (q: string) => {
        if (!q.trim()) return;
        const updated = [q, ...recentSearches.filter((s) => s !== q)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem("recent-searches", JSON.stringify(updated));
        router.push(`/search?q=${encodeURIComponent(q)}`);
        setShowSuggestions(false);
        setSearchQuery("");
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isTransparent
                        ? "bg-transparent text-white"
                        : "bg-white/95 backdrop-blur-md text-gray-900 shadow-sm border-b border-gray-100"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16 gap-4">
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                <span className="text-white font-bold text-sm">S</span>
                            </div>
                            <span className="font-bold text-xl font-serif hidden sm:block">
                                <span className="text-gradient">Style</span>
                                <span className={isTransparent ? "text-white" : "text-gray-900"}>AI</span>
                            </span>
                        </Link>

                        {/* Nav Links - Desktop */}
                        <nav className="hidden lg:flex items-center gap-6 ml-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-sm font-medium transition-colors hover:text-primary-500 ${isTransparent ? "text-white/90 hover:text-white" : "text-gray-600 hover:text-primary-500"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Search Bar */}
                        <div ref={searchRef} className="flex-1 max-w-md mx-auto relative">
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${isTransparent
                                    ? "bg-white/10 border-white/30 text-white placeholder:text-white/60"
                                    : "bg-gray-50 border-gray-200 text-gray-900"
                                }`}>
                                <Search className="w-4 h-4 flex-shrink-0 opacity-60" />
                                <input
                                    type="text"
                                    placeholder="Search styles, brands..."
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                                    onFocus={() => setShowSuggestions(true)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
                                    className="bg-transparent outline-none text-sm w-full"
                                    aria-label="Search products"
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery("")} aria-label="Clear search">
                                        <X className="w-3 h-3 opacity-60 hover:opacity-100" />
                                    </button>
                                )}
                            </div>

                            {/* Suggestions Dropdown */}
                            <AnimatePresence>
                                {showSuggestions && (searchQuery.length > 1 || recentSearches.length > 0) && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                                    >
                                        {searchQuery.length > 1 && suggestions.length > 0 ? (
                                            <div className="p-2">
                                                <p className="text-xs font-semibold text-gray-400 px-3 py-1 uppercase tracking-wide">Products</p>
                                                {suggestions.map((p) => (
                                                    <button
                                                        key={p.id}
                                                        onClick={() => { router.push(`/products/${p.id}`); setShowSuggestions(false); setSearchQuery(""); }}
                                                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-xl text-left transition-colors"
                                                    >
                                                        <Search className="w-4 h-4 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{p.name}</p>
                                                            <p className="text-xs text-gray-500">{p.category} · ${p.price}</p>
                                                        </div>
                                                    </button>
                                                ))}
                                                <button
                                                    onClick={() => handleSearch(searchQuery)}
                                                    className="w-full text-left px-3 py-2 text-sm text-primary-500 font-medium hover:bg-primary-50 rounded-xl transition-colors"
                                                >
                                                    See all results for &quot;{searchQuery}&quot; →
                                                </button>
                                            </div>
                                        ) : recentSearches.length > 0 && (
                                            <div className="p-2">
                                                <p className="text-xs font-semibold text-gray-400 px-3 py-1 uppercase tracking-wide">Recent</p>
                                                {recentSearches.map((s) => (
                                                    <button
                                                        key={s}
                                                        onClick={() => handleSearch(s)}
                                                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-xl text-left transition-colors"
                                                    >
                                                        <Search className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-700">{s}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Right Icons */}
                        <div className="flex items-center gap-1 sm:gap-2">
                            {/* Currency */}
                            <div className="hidden md:flex items-center gap-1">
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value as "USD" | "EUR" | "GBP")}
                                    className={`text-xs bg-transparent border-none outline-none cursor-pointer font-medium ${isTransparent ? "text-white/80" : "text-gray-600"
                                        }`}
                                    aria-label="Select currency"
                                >
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                </select>
                            </div>

                            {/* Wishlist */}
                            <Link href="/account?tab=wishlist" className="relative p-2 rounded-full hover:bg-gray-100/20 transition-colors" aria-label="Wishlist">
                                <Heart className="w-5 h-5" />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>

                            {/* Cart */}
                            <button
                                onClick={toggleCart}
                                className="relative p-2 rounded-full hover:bg-gray-100/20 transition-colors"
                                aria-label="Shopping cart"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {itemCount > 0 && (
                                    <motion.span
                                        key={itemCount}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                                    >
                                        {itemCount > 9 ? "9+" : itemCount}
                                    </motion.span>
                                )}
                            </button>

                            {/* Account */}
                            <Link href="/account" className="p-2 rounded-full hover:bg-gray-100/20 transition-colors hidden sm:block" aria-label="My account">
                                <User className="w-5 h-5" />
                            </Link>

                            {/* Hamburger */}
                            <button
                                onClick={toggleMenu}
                                className="lg:hidden p-2 rounded-full hover:bg-gray-100/20 transition-colors"
                                aria-label="Toggle menu"
                            >
                                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "-100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "-100%" }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="fixed inset-0 z-40 bg-white pt-16 lg:hidden overflow-y-auto"
                    >
                        <div className="p-6 space-y-1">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={toggleMenu}
                                        className="block py-3 px-4 text-lg font-semibold text-gray-800 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}
                            <div className="border-t border-gray-100 pt-4 mt-4 space-y-1">
                                <Link href="/style-quiz" onClick={toggleMenu} className="block py-3 px-4 text-gray-600 hover:text-primary-500 hover:bg-primary-50 rounded-xl">
                                    ✨ Style Quiz
                                </Link>
                                <Link href="/account" onClick={toggleMenu} className="block py-3 px-4 text-gray-600 hover:text-primary-500 hover:bg-primary-50 rounded-xl">
                                    My Account
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Spacer */}
            <div className="h-16" />
        </>
    );
}
