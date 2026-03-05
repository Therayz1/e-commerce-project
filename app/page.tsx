"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { products, categories } from "@/lib/mock-data";
import { ProductCard } from "@/components/ProductCard";

// Typing effect hook
function useTypingText(text: string, speed = 50) {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return displayedText;
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Parallax for Hero
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const typedText = useTypingText("Discover Your Style with AI", 70);

  // Mouse trail effect (Easter egg / subtle detail)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const trail = document.createElement("div");
      trail.className = "cursor-trail";
      trail.style.left = `${e.clientX}px`;
      trail.style.top = `${e.clientY}px`;
      document.body.appendChild(trail);

      setTimeout(() => {
        trail.style.transform = "scale(0)";
        trail.style.opacity = "0";
      }, 50);

      setTimeout(() => {
        document.body.removeChild(trail);
      }, 500);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const trendingProducts = products
    .filter(p => p.isBestSeller && (activeCategory === "All" || p.category === activeCategory))
    .slice(0, visibleProducts);

  const aiRecommendations = products.filter(p => p.isFeatured).slice(0, 10);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleProducts(prev => prev + 4);
      setIsLoadingMore(false);
    }, 800);
  };

  const scrollCarousel = (dir: "left" | "right") => {
    if (!carouselRef.current) return;
    const clientWidth = carouselRef.current.clientWidth;
    const scrollAmount = clientWidth > 768 ? clientWidth / 2 : clientWidth;
    carouselRef.current.scrollBy({ left: dir === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen pt-0 page-enter overflow-hidden">

      {/* 1. HERO SECTION */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center bg-gradient-hero overflow-hidden">
        {/* Parallax Elements */}
        <motion.div style={{ y: y1, opacity }} className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/30 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] mix-blend-screen" />
        </motion.div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphism text-white/90 text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>AI-Powered Recommendations Live</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white font-serif mb-6 leading-tight min-h-[2em] md:min-h-[1.2em]">
            {typedText}
            <span className="animate-pulse ml-1 text-primary-400">|</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-lg md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto font-light"
          >
            Elevate your wardrobe with personalized fashion curated just for you by our advanced AI stylist.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/products" className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-green-500/30 font-semibold px-8 py-3 rounded-xl w-full sm:w-auto text-lg flex items-center justify-center gap-2 group transition-all">
              Shop Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/style-quiz" className="w-full sm:w-auto px-8 py-3 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors text-lg flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" /> Take Style Quiz
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center flex flex-col items-center animate-[float_3s_ease-in-out_infinite]"
        >
          <span className="text-white/60 text-xs mb-2 uppercase tracking-widest font-semibold">Scroll</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1.5 h-3 bg-white rounded-full animate-[bounce-scroll_2s_infinite]" />
          </div>
        </motion.div>
      </section>

      {/* 2. FEATURED CATEGORIES */}
      <section className="py-24 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif mb-4">Shop by Category</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative block h-[300px] md:h-[400px] rounded-2xl overflow-hidden cursor-pointer"
              >
                <Link href={`/products?category=${category.slug}`} className="block h-full w-full">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/90" />

                  <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-center text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                    <p className="text-white/80 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      {category.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-white uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                      Explore <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-2" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TRENDING NOW */}
      <section className="py-24 bg-gray-50 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif mb-4">Trending Now</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary rounded-full" />
            </div>

            {/* Filter Chips */}
            <div className="flex bg-white p-1 rounded-full shadow-sm overflow-x-auto scrollbar-hide">
              {["All", "men", "women", "kids"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setVisibleProducts(8); }}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {trendingProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (index % 4) * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          {visibleProducts < products.filter(p => p.isBestSeller && (activeCategory === "All" || p.category === activeCategory)).length && (
            <div className="mt-12 text-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="px-8 py-3 bg-white border border-gray-200 text-gray-900 font-semibold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
              >
                {isLoadingMore ? (
                  <><div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" /> Loading...</>
                ) : "Load More"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. AI RECOMMENDATIONS CAROUSEL */}
      <section className="py-24 bg-white relative z-20 overflow-hidden">
        {/* Background Decorative Blob */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-50/50 rounded-l-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-xs font-bold mb-3 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> AI Curated
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif mb-4">Picked Just For You</h2>
              <p className="text-gray-600 max-w-lg">Based on your browsing history and our global style trends, we think you'll love these pieces.</p>
            </div>

            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scrollCarousel("left")}
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-colors shadow-sm"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollCarousel("right")}
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-colors shadow-sm"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-8 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {aiRecommendations.map((product) => (
              <div key={product.id} className="min-w-[280px] sm:min-w-[300px] max-w-[320px] shrink-0 snap-start">
                <ProductCard product={product} />
              </div>
            ))}

            {/* View All Card */}
            <div className="min-w-[280px] sm:min-w-[300px] shrink-0 snap-start flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary-50 to-pink-50 rounded-2xl border border-primary-100 text-center h-[calc(100%-2rem)] my-auto h-[400px]">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-primary-500">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Want more personalization?</h3>
              <p className="text-sm text-gray-600 mb-6">Take our AI Style Quiz to get better recommendations.</p>
              <Link href="/style-quiz" className="btn-gradient px-6 py-2.5 text-sm rounded-xl">
                Take Quiz
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
