"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { products } from "@/lib/mock-data";
import { ProductCard } from "@/components/ProductCard";
import { SkeletonCard } from "@/components/SkeletonCard";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, [query]);

    // Basic mock search logic
    const searchResults = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-24 page-enter">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">

                <div className="mb-12 border-b border-gray-200 pb-8 text-center sm:text-left">
                    <p className="text-gray-500 font-medium mb-2 uppercase tracking-wide text-sm">Search Results</p>
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 font-serif mb-4">
                        "{query}"
                    </h1>
                    <p className="text-gray-600">{searchResults.length} products found matching your search.</p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="h-[400px]"><SkeletonCard /></div>)}
                    </div>
                ) : searchResults.length > 0 ? (
                    <div>
                        <div className="flex justify-end mb-6">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
                                <SlidersHorizontal className="w-4 h-4" /> Filter & Sort
                            </button>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {searchResults.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 mt-8 text-center max-w-2xl mx-auto">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                            <Search className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif">We couldn't find any matches</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">Your search for "{query}" did not yield any results. Please check your spelling or try different keywords.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/products" className="btn-gradient px-8 py-3 rounded-xl font-bold flex-1 sm:flex-none">Browse All Products</Link>
                            <Link href="/" className="px-8 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors flex-1 sm:flex-none">Go Home</Link>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
