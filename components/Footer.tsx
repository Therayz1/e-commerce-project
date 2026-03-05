"use client";
import Link from "next/link";
import {
    Instagram, Twitter, Facebook, Youtube, CreditCard,
    MapPin, Phone, Mail, ArrowRight
} from "lucide-react";
import { useState } from "react";
import { useUIStore } from "@/lib/store/uiStore";

const footerLinks = {
    About: [
        { label: "Our Story", href: "#" },
        { label: "Sustainability", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Press", href: "#" },
        { label: "Style Quiz", href: "/style-quiz" },
    ],
    Shop: [
        { label: "Men", href: "/products?category=men" },
        { label: "Women", href: "/products?category=women" },
        { label: "Kids", href: "/products?category=kids" },
        { label: "Accessories", href: "/products?category=accessories" },
        { label: "Sale", href: "/products?category=sale" },
    ],
    Support: [
        { label: "Help Center", href: "#" },
        { label: "Track Order", href: "/account?tab=orders" },
        { label: "Returns & Exchanges", href: "#" },
        { label: "Size Guide", href: "#" },
        { label: "Contact Us", href: "#" },
    ],
};

const socials = [
    { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-500" },
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-blue-400" },
    { icon: Facebook, href: "#", label: "Facebook", color: "hover:text-blue-600" },
    { icon: Youtube, href: "#", label: "YouTube", color: "hover:text-red-500" },
];

export function Footer() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const { addToast } = useUIStore();

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setSubscribed(true);
        addToast({ type: "success", title: "Subscribed!", message: "Welcome to StyleAI newsletter 🎉" });
        setEmail("");
        setTimeout(() => setSubscribed(false), 3000);
    };

    return (
        <footer className="bg-gray-950 text-gray-300">
            {/* Newsletter Banner */}
            <div className="bg-gradient-to-r from-primary-600 via-purple-600 to-secondary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1">Get exclusive offers</h3>
                            <p className="text-white/80 text-sm">Subscribe for style tips, new arrivals & 20% off your first order</p>
                        </div>
                        <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto md:min-w-[380px]">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 outline-none focus:border-white/50 text-sm"
                                required
                            />
                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-1.5 text-sm"
                            >
                                {subscribed ? "✓" : <><span>Subscribe</span><ArrowRight className="w-4 h-4" /></>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4 group">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary rounded-lg flex items-center justify-center shadow-glow">
                                <span className="text-white font-bold text-sm">S</span>
                            </div>
                            <span className="font-bold text-xl text-white font-serif">StyleAI</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
                            AI-powered fashion platform helping you discover your perfect style. Personalized recommendations, curated collections.
                        </p>
                        {/* Socials */}
                        <div className="flex items-center gap-3 mb-6">
                            {socials.map(({ icon: Icon, href, label, color }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className={`w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-gray-700 ${color}`}
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                        {/* Contact */}
                        <div className="space-y-2 text-sm text-gray-400">
                            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary-400" /><span>hello@styleai.com</span></div>
                            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary-400" /><span>+1 (555) 000-0000</span></div>
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="text-white font-semibold mb-4">{title}</h4>
                            <ul className="space-y-2">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-xs">© 2025 StyleAI. All rights reserved.</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <a href="#" className="hover:text-gray-300">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-300">Terms of Service</a>
                        <a href="#" className="hover:text-gray-300">Cookie Policy</a>
                    </div>
                    {/* Payment logos */}
                    <div className="flex items-center gap-2">
                        {["VISA", "MC", "AMEX", "PP"].map((p) => (
                            <div key={p} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400 font-mono border border-gray-700">
                                {p}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
