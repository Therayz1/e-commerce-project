"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { useUIStore } from "@/lib/store/uiStore";
import { useUserStore } from "@/lib/store/userStore";
import { Product } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
    const { toggleWishlist, isInWishlist } = useWishlistStore();
    const { addItem, isLoading: isCartLoading } = useCartStore();
    const { currency } = useUserStore();
    const { addToast } = useUIStore();
    const [isHovered, setIsHovered] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const isWished = isInWishlist(product.id);

    // 3D Tilt Effect
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (!cardRef.current) return;
        cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.stock === 0) return;

        setAddingToCart(true);
        // Add default variant (first size, first color)
        await addItem(product, product.sizes[0] || "One Size", product.colors[0] || { name: "Default", hex: "#000" }, 1);
        addToast({
            type: "success",
            title: "Added to Cart",
            message: `${product.name} was added to your cart.`,
        });
        setAddingToCart(false);
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
        addToast({
            type: isWished ? "info" : "success",
            message: isWished ? "Removed from Wishlist" : "Added to Wishlist",
        });
    };

    return (
        <Link href={`/products/${product.id}`} className="group block h-full">
            <div
                ref={cardRef}
                className="tilt-card relative bg-white rounded-2xl p-3 h-full flex flex-col hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                onMouseEnter={() => setIsHovered(true)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {/* Badges */}
                <div className="absolute top-5 left-5 z-10 flex flex-col gap-2">
                    {product.isNew && (
                        <span className="bg-primary-500 text-white text-[10px] font-bold px-2 py-1 rounded tracking-wider uppercase">New</span>
                    )}
                    {product.discount && (
                        <span className="bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded tracking-wider uppercase">-{product.discount}%</span>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlist}
                    className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                    aria-label="Wishlist"
                >
                    <Heart className={`w-4 h-4 transition-colors ${isWished ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"}`} />
                </button>

                {/* Image Container */}
                <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-gray-100 mb-4">
                    <Image
                        src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
                        alt={product.name}
                        fill
                        className={`object-cover transition-transform duration-700 ${isHovered ? "scale-110" : "scale-100"}`}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    {/* Quick Actions Overlay */}
                    <div className={`absolute inset-x-0 bottom-0 p-3 flex gap-2 transition-all duration-300 ${isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                        {product.stock > 0 ? (
                            <button
                                onClick={handleAddToCart}
                                disabled={addingToCart}
                                className="flex-1 bg-white/90 backdrop-blur text-gray-900 font-semibold py-2 rounded-lg text-sm hover:bg-white hover:text-primary-600 transition-colors shadow-sm flex items-center justify-center gap-1.5"
                            >
                                {addingToCart ? (
                                    <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <ShoppingCart className="w-4 h-4" /> Add
                                    </>
                                )}
                            </button>
                        ) : (
                            <button disabled className="flex-1 bg-gray-200/90 backdrop-blur text-gray-500 font-medium py-2 rounded-lg text-sm cursor-not-allowed">
                                Out of Stock
                            </button>
                        )}
                        <button className="w-10 h-10 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center text-gray-700 hover:bg-white hover:text-primary-600 transition-colors shadow-sm shrink-0">
                            <Eye className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col flex-1 px-1">
                    <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
                        {product.name}
                    </h3>

                    <div className="flex items-center gap-1 mb-2">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium text-gray-700">{product.rating}</span>
                        <span className="text-xs text-gray-400">({product.reviewCount})</span>
                    </div>

                    <div className="mt-auto flex items-end gap-2">
                        <span className="text-base font-bold text-gray-900">
                            {formatPrice(product.price, currency)}
                        </span>
                        {product.originalPrice && (
                            <span className="text-xs text-gray-400 line-through mb-0.5">
                                {formatPrice(product.originalPrice, currency)}
                            </span>
                        )}
                    </div>

                    {/* Colors */}
                    <div className="flex gap-1 mt-3">
                        {product.colors.slice(0, 4).map((c) => (
                            <div
                                key={c.name}
                                className="w-3.5 h-3.5 rounded-full border border-gray-200"
                                style={{ backgroundColor: c.hex }}
                                title={c.name}
                            />
                        ))}
                        {product.colors.length > 4 && (
                            <span className="text-[10px] text-gray-500 ml-1">+{product.colors.length - 4}</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
