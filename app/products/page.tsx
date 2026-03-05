"use client";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Grid3X3, List, ChevronDown, Check, SlidersHorizontal, X } from "lucide-react";
import { products, categories as mockCategories, brands as mockBrands } from "@/lib/mock-data";
import { ProductCard } from "@/components/ProductCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { cn } from "@/lib/utils";

const sortOptions = [
    { id: "featured", label: "Featured" },
    { id: "newest", label: "Newest Arrivals" },
    { id: "price-asc", label: "Price: Low to High" },
    { id: "price-desc", label: "Price: High to Low" },
    { id: "rating", label: "Top Rated" },
];

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get("category");

    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    // Filters state
    const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryParam ? [categoryParam] : []);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
    const [minRating, setMinRating] = useState(0);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sortBy, setSortBy] = useState("featured");

    useEffect(() => {
        // Simulate API load
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, [categoryParam, selectedCategories, selectedBrands, selectedSizes, priceRange, minRating, inStockOnly, sortBy]);

    useEffect(() => {
        if (categoryParam && !selectedCategories.includes(categoryParam)) {
            setSelectedCategories([categoryParam]);
        }
    }, [categoryParam]);

    // Derived options for filters
    const allSizes = useMemo(() => Array.from(new Set(products.flatMap(p => p.sizes))), []);

    // Filter & Sort Logic
    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (selectedCategories.length > 0) {
            result = result.filter(p => selectedCategories.includes(p.category));
        }
        if (selectedBrands.length > 0) {
            result = result.filter(p => selectedBrands.includes(p.brand));
        }
        if (selectedSizes.length > 0) {
            result = result.filter(p => p.sizes.some(s => selectedSizes.includes(s)));
        }
        if (inStockOnly) {
            result = result.filter(p => p.stock > 0);
        }
        if (minRating > 0) {
            result = result.filter(p => p.rating >= minRating);
        }
        result = result.filter(p => {
            const price = p.discount ? p.price * (1 - p.discount / 100) : p.price;
            return price >= priceRange[0] && price <= priceRange[1];
        });

        switch (sortBy) {
            case "price-asc": result.sort((a, b) => a.price - b.price); break;
            case "price-desc": result.sort((a, b) => b.price - a.price); break;
            case "rating": result.sort((a, b) => b.rating - a.rating); break;
            case "newest": result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
            // 'featured' keeps original order mostly, prioritize featured flag
            case "featured":
            default:
                result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
                break;
        }

        return result;
    }, [selectedCategories, selectedBrands, selectedSizes, inStockOnly, minRating, priceRange, sortBy]);

    const clearFilters = () => {
        setSelectedCategories([]);
        setSelectedBrands([]);
        setSelectedSizes([]);
        setPriceRange([0, 500]);
        setMinRating(0);
        setInStockOnly(false);
    };

    const activeFiltersCount = selectedCategories.length + selectedBrands.length + selectedSizes.length + (minRating > 0 ? 1 : 0) + (inStockOnly ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < 500 ? 1 : 0);

    const FilterContent = () => (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                {activeFiltersCount > 0 && (
                    <button onClick={clearFilters} className="text-sm text-primary-600 font-medium hover:underline">
                        Clear all ({activeFiltersCount})
                    </button>
                )}
            </div>

            {/* Category */}
            <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900">Category</h4>
                <div className="space-y-2">
                    {mockCategories.map((c) => (
                        <label key={c.id} className="flex items-center gap-2 cursor-pointer group">
                            <div className={cn("w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                selectedCategories.includes(c.slug) ? "bg-primary-500 border-primary-500" : "border-gray-300 group-hover:border-primary-400"
                            )}>
                                {selectedCategories.includes(c.slug) && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <input type="checkbox" className="hidden"
                                checked={selectedCategories.includes(c.slug)}
                                onChange={(e) => {
                                    if (e.target.checked) setSelectedCategories([...selectedCategories, c.slug]);
                                    else setSelectedCategories(selectedCategories.filter(sc => sc !== c.slug));
                                }}
                            />
                            <span className="text-sm text-gray-700">{c.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Brand */}
            <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900">Brand</h4>
                <div className="space-y-2 max-h-[180px] overflow-y-auto scrollbar-hide pr-2">
                    {mockBrands.map((b) => (
                        <label key={b} className="flex items-center gap-2 cursor-pointer group">
                            <div className={cn("w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                selectedBrands.includes(b) ? "bg-primary-500 border-primary-500" : "border-gray-300 group-hover:border-primary-400"
                            )}>
                                {selectedBrands.includes(b) && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <input type="checkbox" className="hidden"
                                checked={selectedBrands.includes(b)}
                                onChange={(e) => {
                                    if (e.target.checked) setSelectedBrands([...selectedBrands, b]);
                                    else setSelectedBrands(selectedBrands.filter(sb => sb !== b));
                                }}
                            />
                            <span className="text-sm text-gray-700">{b}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Size */}
            <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900">Size</h4>
                <div className="flex flex-wrap gap-2">
                    {allSizes.slice(0, 15).map((size) => (
                        <button
                            key={size}
                            onClick={() => {
                                if (selectedSizes.includes(size)) setSelectedSizes(selectedSizes.filter(s => s !== size));
                                else setSelectedSizes([...selectedSizes, size]);
                            }}
                            className={cn("px-3 py-1 text-xs border rounded-md font-medium transition-colors",
                                selectedSizes.includes(size) ? "bg-primary-500 text-white border-primary-500" : "bg-white text-gray-600 border-gray-200 hover:border-primary-500"
                            )}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Other toggles */}
            <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm font-semibold text-gray-900">In Stock Only</span>
                    <div className={cn("w-10 h-6 rounded-full relative transition-colors", inStockOnly ? "bg-primary-500" : "bg-gray-200")}>
                        <input type="checkbox" className="hidden" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
                        <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", inStockOnly ? "left-5" : "left-1")} />
                    </div>
                </label>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-24 page-enter">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumbs & Header */}
                <div className="mb-8">
                    <div className="flex text-sm text-gray-500 mb-4">
                        <Link href="/" className="hover:text-primary-600">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900">Products</span>
                        {categoryParam && (
                            <>
                                <span className="mx-2">/</span>
                                <span className="text-gray-900 capitalize">{categoryParam}</span>
                            </>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif capitalize">
                                {categoryParam ? `${categoryParam} Collection` : "All Products"}
                            </h1>
                            <p className="text-gray-500 mt-2">{filteredProducts.length} results found</p>
                        </div>

                        {/* Toolbar */}
                        <div className="flex items-center gap-3">
                            {/* Mobile Filter Toggle */}
                            <button
                                onClick={() => setIsMobileFiltersOpen(true)}
                                className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium"
                            >
                                <SlidersHorizontal className="w-4 h-4" /> Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                            </button>

                            {/* Sort */}
                            <div className="relative group/sort">
                                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium min-w-[180px] justify-between">
                                    {sortOptions.find(o => o.id === sortBy)?.label} <ChevronDown className="w-4 h-4" />
                                </button>
                                <div className="absolute right-0 top-full mt-1 w-full bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden opacity-0 invisible group-hover/sort:opacity-100 group-hover/sort:visible transition-all z-20">
                                    {sortOptions.map(option => (
                                        <button
                                            key={option.id}
                                            onClick={() => setSortBy(option.id)}
                                            className={cn("w-full text-left px-4 py-2 text-sm hover:bg-gray-50", sortBy === option.id ? "text-primary-600 font-medium bg-primary-50/50" : "text-gray-700")}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* View Toggles (Desktop only) */}
                            <div className="hidden md:flex items-center bg-white border border-gray-200 rounded-lg p-1">
                                <button onClick={() => setViewMode("grid")} className={cn("p-1.5 rounded", viewMode === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600")}>
                                    <Grid3X3 className="w-4 h-4" />
                                </button>
                                <button onClick={() => setViewMode("list")} className={cn("p-1.5 rounded", viewMode === "list" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600")}>
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-8 items-start">
                    {/* Desktop Sidebar Filters */}
                    <div className="hidden md:block w-64 shrink-0 px-4 py-6 bg-white rounded-2xl border border-gray-100 sticky top-24">
                        <FilterContent />
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1 min-w-0">
                        {isLoading ? (
                            <div className={cn("grid gap-4 sm:gap-6", viewMode === "grid" ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1")}>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                    <div key={i} className={viewMode === "list" ? "h-[200px]" : "h-[400px]"}>
                                        {viewMode === "grid" ? <SkeletonCard /> : <div className="w-full h-full bg-white rounded-2xl border border-gray-100 skeleton" />}
                                    </div>
                                ))}
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 text-center px-4">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <Filter className="w-8 h-8 text-gray-400" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">No products found</h2>
                                <p className="text-gray-500 mb-6 max-w-md">We couldn't find anything matching your current filters. Try adjusting them or clear all filters.</p>
                                <button onClick={clearFilters} className="px-6 py-2 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors">
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            <div className={cn("grid gap-4 sm:gap-6", viewMode === "grid" ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1")}>
                                {filteredProducts.map((product, i) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: Math.min(i * 0.05, 0.5) }}
                                        className={viewMode === "list" ? "col-span-1" : ""}
                                    >
                                        {viewMode === "grid" ? (
                                            <ProductCard product={product} />
                                        ) : (
                                            // Simple list view implementation
                                            <Link href={`/products/${product.id}`} className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                                                <div className="relative w-32 h-40 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                                                    <img src={product.images[0]} alt={product.name} className="object-cover w-full h-full" />
                                                </div>
                                                <div className="flex flex-col flex-1 py-2">
                                                    <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                                                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{product.description}</p>
                                                    <div className="mt-auto flex items-center justify-between">
                                                        <span className="font-bold text-lg">${product.price}</span>
                                                        <span className="text-primary-600 font-medium text-sm">View Item →</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filters Drawer */}
            <AnimatePresence>
                {isMobileFiltersOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFiltersOpen(false)}
                            className="fixed inset-0 bg-black/50 z-50 md:hidden"
                        />
                        <motion.div
                            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl z-50 overflow-y-auto md:hidden flex flex-col"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Filter className="w-5 h-5" /> Filters</h2>
                                <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="p-4 flex-1">
                                <FilterContent />
                            </div>
                            <div className="p-4 border-t border-gray-100 sticky bottom-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                                <button onClick={() => setIsMobileFiltersOpen(false)} className="w-full py-3 btn-gradient rounded-xl text-center font-bold">
                                    Apply Filters
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
