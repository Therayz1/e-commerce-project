"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Star, Heart, Share2, Minus, Plus, ShoppingBag,
    ChevronRight, ArrowLeft, Truck, ShieldCheck, RefreshCw, ZoomIn, Info, X, ChevronLeft, Sparkles
} from "lucide-react";
import { products, reviews as mockReviews } from "@/lib/mock-data";
import { ProductCard } from "@/components/ProductCard";
import { useCartStore } from "@/lib/store/cartStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { useUIStore } from "@/lib/store/uiStore";
import { useUserStore } from "@/lib/store/userStore";
import { formatPrice, getStarsArray, formatDate } from "@/lib/utils";
import { SkeletonCard } from "@/components/SkeletonCard";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    const [product, setProduct] = useState(products.find(p => p.id === params.id) || products[0]);
    const [isLoading, setIsLoading] = useState(true);

    // Gallery State
    const [activeImage, setActiveImage] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Selection State
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState(product?.colors[0]);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("description");
    const [showAiDesc, setShowAiDesc] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);

    // Stores
    const { addItem } = useCartStore();
    const { toggleWishlist, isInWishlist } = useWishlistStore();
    const { addToast, addRecentlyViewed, recentlyViewed } = useUIStore();
    const { currency } = useUserStore();

    const isWished = isInWishlist(product?.id);
    const productReviews = mockReviews.filter(r => r.productId === product.id);
    const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
    const recentlyViewedProducts = recentlyViewed.map(id => products.find(p => p.id === id)).filter(Boolean) as typeof products;

    useEffect(() => {
        // Simulate API fetch delay
        setIsLoading(true);
        const p = products.find(p => p.id === params.id) || products[0];
        setProduct(p);
        setSelectedColor(p.colors[0]);
        addRecentlyViewed(p.id);
        const t = setTimeout(() => setIsLoading(false), 600);
        return () => clearTimeout(t);
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-16 page-enter">
                <div className="grid md:grid-cols-2 gap-10">
                    <div className="aspect-[3/4] skeleton rounded-3xl" />
                    <div className="space-y-6 pt-4">
                        <div className="w-1/4 h-4 skeleton rounded" />
                        <div className="w-3/4 h-10 skeleton rounded" />
                        <div className="w-1/3 h-6 skeleton rounded" />
                        <div className="w-full h-24 skeleton rounded" />
                        <div className="w-1/2 h-10 skeleton rounded" />
                        <div className="w-full h-14 skeleton rounded-xl mt-8" />
                    </div>
                </div>
            </div>
        );
    }

    const currentVariantKey = `${selectedSize}-${selectedColor?.name}`;
    const stockForVariant = product.stockPerVariant[currentVariantKey] ?? (selectedSize ? 0 : product.stock); // fallback for mock
    const isOutOfStock = stockForVariant === 0 && selectedSize !== "";

    const handleAddToCart = async () => {
        if (!selectedSize && product.sizes.length > 0) {
            addToast({ type: "warning", title: "Select a size", message: "Please select a size to continue." });
            return;
        }
        if (isOutOfStock) return;

        setAddingToCart(true);
        await addItem(product, selectedSize || "One Size", selectedColor!, quantity);
        addToast({ type: "success", title: "Added to Cart", message: `${quantity}x ${product.name} added to your cart.` });
        setAddingToCart(false);
    };

    const handleWishlist = () => {
        toggleWishlist(product);
        addToast({ type: isWished ? "info" : "success", message: isWished ? "Removed from Wishlist" : "Added to Wishlist" });
    };

    return (
        <div className="min-h-screen bg-white pt-8 pb-24 page-enter">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 mt-16">
                    <Link href="/" className="hover:text-primary-600">Home</Link> <ChevronRight className="w-3 h-3" />
                    <Link href={`/products?category=${product.category}`} className="hover:text-primary-600 capitalize">{product.category}</Link> <ChevronRight className="w-3 h-3" />
                    <span className="text-gray-900 font-medium truncate">{product.name}</span>
                </div>

                <div className="grid md:grid-cols-12 gap-10 lg:gap-16">

                    {/* LEFT: IMAGE GALLERY */}
                    <div className="md:col-span-6 lg:col-span-7 flex flex-col md:flex-row-reverse gap-4">
                        {/* Main Image */}
                        <div className="flex-1 relative aspect-[4/5] md:aspect-auto md:h-[700px] bg-gray-50 rounded-3xl overflow-hidden group cursor-zoom-in" onClick={() => setIsLightboxOpen(true)}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full h-full"
                                >
                                    <Image
                                        src={product.images[activeImage]}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        priority
                                    />
                                </motion.div>
                            </AnimatePresence>
                            {/* Badges */}
                            <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                                {product.isNew && <span className="bg-primary-500 text-white text-xs font-bold px-3 py-1.5 rounded-md tracking-wider uppercase">New</span>}
                                {product.discount && <span className="bg-secondary text-white text-xs font-bold px-3 py-1.5 rounded-md tracking-wider uppercase">-{product.discount}%</span>}
                            </div>
                            <button className="absolute bottom-6 right-6 w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-700 hover:text-primary-600 hover:scale-110 transition-all shadow-md">
                                <ZoomIn className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Thumbnails */}
                        <div className="flex md:flex-col gap-4 overflow-x-auto scrollbar-hide shrink-0 md:w-24 pb-2 md:pb-0">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative w-20 h-24 md:w-full md:h-32 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === idx ? "border-primary-500 shadow-md" : "border-transparent opacity-70 hover:opacity-100"}`}
                                >
                                    <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" sizes="100px" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: DETAILS */}
                    <div className="md:col-span-6 lg:col-span-5 flex flex-col pt-2 md:pt-6">
                        <div className="mb-2">
                            <Link href={`/products?brand=${product.brand}`} className="text-primary-600 font-semibold text-sm hover:underline uppercase tracking-wide">
                                {product.brand}
                            </Link>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif mb-3 leading-tight">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-1">
                                {getStarsArray(product.rating).map((star, i) => (
                                    <Star key={i} className={`w-4 h-4 ${star === "full" ? "fill-yellow-400 text-yellow-400" : star === "half" ? "fill-yellow-400/50 text-yellow-400" : "text-gray-300"}`} />
                                ))}
                            </div>
                            <button onClick={() => setActiveTab("reviews")} className="text-sm text-gray-500 hover:text-primary-600 underline-offset-4 hover:underline">
                                {product.reviewCount} Reviews
                            </button>
                        </div>

                        {/* Price */}
                        <div className="flex items-end gap-3 mb-6">
                            <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price, currency)}</span>
                            {product.originalPrice && (
                                <span className="text-lg text-gray-400 line-through mb-1">{formatPrice(product.originalPrice, currency)}</span>
                            )}
                        </div>

                        {/* Short Description */}
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            {product.shortDescription}
                        </p>

                        <div className="w-full h-px bg-gray-100 mb-8" />

                        {/* AI Enhanced Description Toggle */}
                        <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-primary-50 via-purple-50 to-pink-50 border border-primary-100/50 relative overflow-hidden group">
                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary-200/40 rounded-full blur-2xl group-hover:bg-primary-300/40 transition-colors" />
                            <button onClick={() => setShowAiDesc(!showAiDesc)} className="flex items-center justify-between w-full text-left relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-xl shadow-sm"><Sparkles className="w-4 h-4 text-primary-500" /></div>
                                    <span className="font-semibold text-gray-900 text-sm">AI Stylist Notes</span>
                                </div>
                                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showAiDesc ? "rotate-90" : ""}`} />
                            </button>
                            <AnimatePresence>
                                {showAiDesc && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                        <p className="text-sm text-gray-700 mt-4 leading-relaxed relative z-10 pl-11">
                                            This {product.name.toLowerCase()} is exceptionally versatile. The {product.material?.toLowerCase()} provides a structured yet comfortable fit that flatters the silhouette. Pair it with dark denim and minimalist sneakers for a casual look, or dress it up with tailored trousers for evening events. The color palette aligns perfectly with this season's Earth tone trends.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Colors */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-sm font-semibold text-gray-900">Color: <span className="text-gray-500 font-normal ml-1">{selectedColor?.name}</span></h3>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {product.colors.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-10 h-10 rounded-full border-2 focus:outline-none transition-all flex items-center justify-center ${selectedColor?.name === color.name ? "border-primary-500 scale-110 shadow-sm" : "border-transparent hover:scale-105"}`}
                                        title={color.name}
                                    >
                                        <span className="w-8 h-8 rounded-full border border-gray-200 block" style={{ backgroundColor: color.hex }} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sizes */}
                        {product.sizes.length > 0 && (
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-sm font-semibold text-gray-900">Size</h3>
                                    <button className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1">
                                        <Info className="w-4 h-4" /> Size Guide
                                    </button>
                                </div>
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                    {product.sizes.map((size) => {
                                        const varStock = product.stockPerVariant[`${size}-${selectedColor?.name}`];
                                        const isOut = selectedColor ? (varStock === 0) : false; // mockup logic

                                        return (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                disabled={isOut}
                                                className={`py-3 rounded-xl text-sm font-medium transition-all focus:outline-none ${selectedSize === size
                                                    ? "bg-gray-900 text-white shadow-md"
                                                    : isOut
                                                        ? "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100"
                                                        : "bg-white text-gray-900 border border-gray-200 hover:border-gray-900"
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        )
                                    })}
                                </div>
                                {selectedSize && (
                                    <p className="text-xs mt-3 flex items-center gap-1.5">
                                        <span className={`w-2 h-2 rounded-full ${isOutOfStock ? "bg-red-500" : stockForVariant && stockForVariant < 5 ? "bg-orange-500" : "bg-green-500"}`} />
                                        {isOutOfStock ? <span className="text-red-600 font-medium">Out of stock in this size/color</span> :
                                            stockForVariant && stockForVariant < 5 ? <span className="text-orange-600 font-medium">Only {stockForVariant} left in stock - order soon!</span> :
                                                <span className="text-green-600 font-medium">In stock and ready to ship</span>}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="mt-auto space-y-4 pt-4">
                            <div className="flex gap-4">
                                {/* Quantity */}
                                <div className="flex items-center justify-between border border-gray-200 rounded-xl px-2 w-32 h-14 bg-white shrink-0">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-50 rounded-lg text-gray-600 transition-colors" disabled={quantity <= 1}>
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="font-semibold text-lg w-8 text-center">{quantity}</span>
                                    <button onClick={() => setQuantity(Math.min(stockForVariant || product.stock, quantity + 1))} className="p-2 hover:bg-gray-50 rounded-lg text-gray-600 transition-colors" disabled={isOutOfStock || quantity >= (stockForVariant || product.stock)}>
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Add to Cart */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isOutOfStock || addingToCart}
                                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl text-white font-bold h-14 transition-all ${isOutOfStock
                                        ? "bg-gray-300 cursor-not-allowed text-gray-500"
                                        : "btn-gradient shadow-[0_8px_20px_-6px_rgba(108,58,232,0.5)]"
                                        }`}
                                >
                                    {addingToCart ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><ShoppingBag className="w-5 h-5" /> Add to Cart</>}
                                </button>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={handleWishlist} className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl border font-semibold transition-colors ${isWished ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                    }`}>
                                    <Heart className={`w-4 h-4 ${isWished ? "fill-red-600" : ""}`} /> {isWished ? "Saved" : "Save"}
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                                    <Share2 className="w-4 h-4" /> Share
                                </button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-4 mt-8 py-6 border-t border-b border-gray-100">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-gray-50 rounded-lg text-gray-600"><Truck className="w-5 h-5" /></div>
                                <div><p className="text-sm font-semibold text-gray-900">Free Shipping</p><p className="text-xs text-gray-500 mt-0.5">On orders over $50</p></div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-gray-50 rounded-lg text-gray-600"><RefreshCw className="w-5 h-5" /></div>
                                <div><p className="text-sm font-semibold text-gray-900">30-Day Returns</p><p className="text-xs text-gray-500 mt-0.5">Hassle-free return policy</p></div>
                            </div>
                            <div className="flex items-start gap-3 col-span-2">
                                <div className="p-2 bg-gray-50 rounded-lg text-gray-600"><ShieldCheck className="w-5 h-5" /></div>
                                <div><p className="text-sm font-semibold text-gray-900">Secure Checkout</p><p className="text-xs text-gray-500 mt-0.5">Your payment information is encrypted and secure</p></div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* TABS SECTION */}
                <div className="mt-24">
                    <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200 gap-8 mb-8">
                        {["description", "specifications", "reviews", "shipping"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-base font-medium whitespace-nowrap capitalize transition-colors relative ${activeTab === tab ? "text-primary-600" : "text-gray-500 hover:text-gray-900"}`}
                            >
                                {tab}
                                {tab === "reviews" && <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">{product.reviewCount}</span>}
                                {activeTab === tab && <motion.div layoutId="activetab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />}
                            </button>
                        ))}
                    </div>

                    <div className="py-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === "description" && (
                                    <div className="max-w-3xl prose prose-gray">
                                        <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
                                        <p className="text-gray-600 leading-relaxed text-lg mt-4">Crafted with attention to detail and premium materials, this piece represents the perfect balance of StyleAI's commitment to quality and contemporary design. Whether you're upgrading your daily rotation or looking for a statement piece, this versatile addition will serve you well across seasons.</p>
                                    </div>
                                )}
                                {activeTab === "specifications" && (
                                    <div className="max-w-3xl">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                            {product.specifications && Object.entries(product.specifications).map(([k, v]) => (
                                                <div key={k} className="flex justify-between py-3 border-b border-gray-100">
                                                    <span className="text-gray-500">{k}</span>
                                                    <span className="font-medium text-gray-900 text-right">{v}</span>
                                                </div>
                                            ))}
                                            <div className="flex justify-between py-3 border-b border-gray-100">
                                                <span className="text-gray-500">SKU</span>
                                                <span className="font-medium text-gray-900 text-right">SAI-{product.id.toUpperCase()}-25</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === "reviews" && (
                                    <div className="max-w-4xl">
                                        <div className="flex flex-col md:flex-row gap-8 md:items-center mb-12 p-8 bg-gray-50 rounded-3xl">
                                            <div className="text-center md:text-left flex-shrink-0">
                                                <h3 className="text-5xl font-bold text-gray-900 mb-2">{product.rating}</h3>
                                                <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
                                                    {getStarsArray(product.rating).map((star, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                                                </div>
                                                <p className="text-sm text-gray-500">Based on {product.reviewCount} reviews</p>
                                            </div>
                                            <div className="flex-1 space-y-2 border-l-0 md:border-l border-gray-200 md:pl-8">
                                                {[5, 4, 3, 2, 1].map(stars => (
                                                    <div key={stars} className="flex items-center gap-4">
                                                        <span className="text-sm font-medium text-gray-600 flex items-center gap-1 w-8">{stars} <Star className="w-3 h-3 fill-gray-400 text-gray-400" /></span>
                                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 5 : 0}%` }} />
                                                        </div>
                                                        <span className="text-xs text-gray-400 w-8">{stars === 5 ? '70%' : stars === 4 ? '20%' : stars === 3 ? '5%' : '0%'}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="text-center md:text-right">
                                                <button className="btn-gradient px-8 py-3 rounded-xl">Write a Review</button>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            {productReviews.length > 0 ? productReviews.map((review) => (
                                                <div key={review.id} className="border-b border-gray-100 pb-8">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex items-center gap-4">
                                                            <Image src={review.avatar} alt={review.userName} width={48} height={48} className="rounded-full bg-gray-100" />
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <div className="flex">{getStarsArray(review.rating).map((s, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}</div>
                                                                    <span className="text-xs text-gray-500">{formatDate(review.date)}</span>
                                                                    {review.verified && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">Verified Buyer</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h5 className="font-bold text-gray-900 mb-2">{review.title}</h5>
                                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{review.comment}</p>
                                                    <button className="text-xs font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1">
                                                        Helpful ({review.helpful})
                                                    </button>
                                                </div>
                                            )) : (
                                                <p className="text-gray-500 italic py-8 text-center">No reviews yet for this product. Be the first to review!</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {activeTab === "shipping" && (
                                    <div className="max-w-3xl prose prose-gray">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">Delivery Options</h3>
                                        <ul className="space-y-4 list-none pl-0">
                                            <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                                <Truck className="w-6 h-6 text-gray-400 shrink-0 mt-0.5" />
                                                <div><p className="font-semibold text-gray-900 m-0">Standard Delivery — FREE on orders over $50</p><p className="text-sm text-gray-600 m-0 mt-1">3-5 business days. Ships via USPS/UPS.</p></div>
                                            </li>
                                            <li className="flex items-start gap-3 p-4 border border-gray-100 rounded-xl">
                                                <Truck className="w-6 h-6 text-primary-500 shrink-0 mt-0.5" />
                                                <div><p className="font-semibold text-gray-900 m-0">Express Delivery — $9.99</p><p className="text-sm text-gray-600 m-0 mt-1">1-2 business days. Order before 2 PM EST.</p></div>
                                            </li>
                                        </ul>
                                        <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Returns Policy</h3>
                                        <p className="text-gray-600">We offer a 30-day return window from the date of delivery. Items must be unworn, unwashed, and have original tags attached. Final sale items cannot be returned.</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* RELATED PRODUCTS */}
                {relatedProducts.length > 0 && (
                    <div className="mt-24 pt-16 border-t border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 font-serif mb-8">You May Also Like</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                            {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </div>
                )}

            </div>

            {/* LIGHTBOX MODAL */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md">
                        <button onClick={() => setIsLightboxOpen(false)} className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors z-10"><X className="w-8 h-8" /></button>
                        <button onClick={() => setActiveImage(prev => prev > 0 ? prev - 1 : product.images.length - 1)} className="absolute left-6 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white transition-colors z-10"><ChevronLeft className="w-10 h-10" /></button>
                        <button onClick={() => setActiveImage(prev => prev < product.images.length - 1 ? prev + 1 : 0)} className="absolute right-6 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white transition-colors z-10"><ChevronRight className="w-10 h-10" /></button>

                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-[90vw] h-[90vh]">
                            <Image src={product.images[activeImage]} alt={product.name} fill className="object-contain" sizes="100vw" quality={100} />
                        </motion.div>

                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                            {product.images.map((img, idx) => (
                                <button key={idx} onClick={() => setActiveImage(idx)} className={`w-2 h-2 rounded-full transition-all ${activeImage === idx ? "bg-white w-6" : "bg-white/30 hover:bg-white/50"}`} />
                            ))}
                        </div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}

// Ensure lucide icon 'X' is available
// It is available from lucide-react. I'll import it replacing 'Info' locally.
// Actually I forgot to import X from lucide-react at the top. Let me add it.
