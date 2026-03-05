"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, Sparkles, RefreshCw } from "lucide-react";
import { useQuizStore } from "@/lib/store/quizStore";
import confetti from "canvas-confetti";
import { products } from "@/lib/mock-data";
import { ProductCard } from "@/components/ProductCard";

// Define Quiz Steps
const quizSteps = [
    {
        id: "gender",
        question: "Who are you shopping for?",
        type: "single",
        required: true,
        options: [
            { id: "womens", label: "Women's Fashion" },
            { id: "mens", label: "Men's Fashion" },
            { id: "unisex", label: "Gender Neutral" }
        ]
    },
    {
        id: "style",
        question: "Which of these best describes your aesthetic?",
        type: "single",
        required: true,
        options: [
            { id: "minimalist", label: "Modern Minimalist" },
            { id: "streetwear", label: "Streetwear / Edgy" },
            { id: "classic", label: "Classic & Preppy" },
            { id: "bohemian", label: "Bohemian / Free Spirit" }
        ]
    },
    {
        id: "colors",
        question: "What color palettes are you drawn to? (Select all that apply)",
        type: "multiple",
        required: true,
        options: [
            { id: "neutrals", label: "Neutrals (Black, White, Beige, Gray)" },
            { id: "earth", label: "Earth Tones (Olive, Rust, Brown)" },
            { id: "pastels", label: "Pastels (Soft Pink, Mint, Baby Blue)" },
            { id: "jewel", label: "Jewel Tones (Emerald, Sapphire, Burgundy)" }
        ]
    },
    {
        id: "fit",
        question: "Let's talk about fit. How do you prefer your clothes to feel?",
        type: "single",
        required: true,
        options: [
            { id: "oversized", label: "Oversized & Relaxed" },
            { id: "tailored", label: "Tailored & Form-fitting" },
            { id: "regular", label: "Standard / True to size" }
        ]
    }
] as const;

export default function StyleQuizPage() {
    const router = useRouter();
    const { currentStep, answers, isCompleted, saveAnswer, resetQuiz } = useQuizStore();
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        if (isCompleted && currentStep === quizSteps.length) {
            setIsAnalyzing(true);
            const timer = setTimeout(() => {
                setIsAnalyzing(false);
                triggerConfetti();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isCompleted, currentStep]);

    const triggerConfetti = () => {
        const duration = 3 * 1000;
        const end = Date.now() + duration;
        const frame = () => {
            confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#6366f1', '#ec4899', '#06b6d4'] });
            confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#6366f1', '#ec4899', '#06b6d4'] });
            if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
    };

    const currentQuizStep = quizSteps[currentStep];
    const progress = ((currentStep) / quizSteps.length) * 100;

    const handleOptionSelect = (optionId: string) => {
        if (currentQuizStep.type === "multiple") {
            const currentAnswers = (answers as any)[currentQuizStep.id] || [];
            const isSelected = currentAnswers.includes(optionId);
            const newAnswers = isSelected
                ? currentAnswers.filter((id: string) => id !== optionId)
                : [...currentAnswers, optionId];
            saveAnswer(currentQuizStep.id as any, newAnswers);
        } else {
            saveAnswer(currentQuizStep.id as any, optionId);
        }
    };

    const handleNext = () => {
        if (currentStep < quizSteps.length - 1) {
            useQuizStore.setState({ currentStep: currentStep + 1 });
        } else {
            useQuizStore.setState({ isCompleted: true, currentStep: quizSteps.length });
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            useQuizStore.setState({ currentStep: currentStep - 1 });
        }
    };

    const handleRetake = () => {
        resetQuiz();
    };

    const recommendedProducts = products.filter(p => p.isFeatured).slice(0, 4);

    if (isAnalyzing) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 relative overflow-hidden page-enter">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/30 rounded-full blur-[120px] animate-pulse"></div>

                <div className="relative z-10 text-center max-w-md">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-[0_0_50px_rgba(99,102,241,0.5)]">
                        <Sparkles className="w-10 h-10 text-white animate-[spin_3s_linear_infinite]" />
                    </div>
                    <h2 className="text-3xl font-bold font-serif text-white mb-4">Analyzing Your Style DNA</h2>
                    <div className="space-y-4 text-white/70 text-sm font-mono flex flex-col">
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>Processing preferences...</motion.span>
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>Evaluating fit requirements...</motion.span>
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}>Curating perfect matches...</motion.span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full mt-8 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 3, ease: "linear" }} className="h-full bg-gradient-to-r from-primary-400 to-secondary" />
                    </div>
                </div>
            </div>
        );
    }

    if (isCompleted && !isAnalyzing) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 pb-24 page-enter">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-bold text-sm mb-6 uppercase tracking-wider backdrop-blur-sm">
                            <Sparkles className="w-4 h-4" /> AI Style Profile Complete
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 font-serif mb-6 leading-tight">
                            Your Personalized <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary">Style Wardrobe</span>
                        </h1>
                        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                            Based on your answers, our AI has determined you lean towards a <strong>"Modern Minimalist"</strong> aesthetic with touches of <strong>"Athleisure."</strong> Here is your curated collection to elevate your everyday look.
                        </p>
                        <button onClick={handleRetake} className="text-sm font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-2 mx-auto justify-center transition-colors">
                            <RefreshCw className="w-4 h-4" /> Retake Quiz
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recommendedProducts.map((p, i) => (
                            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                <ProductCard product={p} />
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Link href="/products" className="btn-gradient px-8 py-4 rounded-xl text-lg font-bold shadow-xl shadow-primary-500/20 inline-flex items-center gap-2 group">
                            Shop Full Collection <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const answerValue = (answers as any)[currentQuizStep?.id];
    const isNextDisabled = currentQuizStep?.required && (!answerValue || (Array.isArray(answerValue) && answerValue.length === 0));

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-16 page-enter">
            <div className="w-full h-1.5 bg-gray-200 fixed top-16 left-0 z-40">
                <motion.div
                    className="h-full bg-gradient-to-r from-primary-500 to-secondary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 sm:px-6 py-12">
                <div className="mb-8 flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className={`p-2 rounded-full border border-gray-200 transition-colors ${currentStep === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 text-gray-700"}`}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-bold text-gray-400 font-mono tracking-widest uppercase">
                        Step {currentStep + 1} of {quizSteps.length}
                    </span>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 flex flex-col"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif mb-8 text-center sm:text-left leading-tight">
                            {currentQuizStep?.question}
                        </h2>

                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                            {currentQuizStep?.options.map(option => {
                                const isSelected = currentQuizStep.type === "multiple"
                                    ? ((answers as any)[currentQuizStep.id] || []).includes(option.id)
                                    : (answers as any)[currentQuizStep.id] === option.id;

                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => handleOptionSelect(option.id)}
                                        className={`relative text-left rounded-2xl overflow-hidden border-2 transition-all p-4 py-6 ${isSelected ? "border-primary-500 ring-4 ring-primary-50" : "border-gray-200 hover:border-gray-300"
                                            }`}
                                    >
                                        <span className={`block font-semibold ${isSelected ? "text-primary-700" : "text-gray-900"}`}>{option.label}</span>
                                        {isSelected && (
                                            <div className="absolute top-1/2 -translate-y-1/2 right-4 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
                                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
                    <button onClick={handleRetake} className="text-sm font-semibold text-gray-500 hover:text-gray-900 underline underline-offset-4">
                        Start Over
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={isNextDisabled}
                        className={`btn-gradient px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 group transition-all ${isNextDisabled ? "opacity-50 cursor-not-allowed grayscale" : ""
                            }`}
                    >
                        {currentStep === quizSteps.length - 1 ? "Submit & Analyze" : "Next Step"} <ArrowRight className={`w-5 h-5 ${isNextDisabled ? "" : "group-hover:translate-x-1 transition-transform"}`} />
                    </button>
                </div>
            </div>
        </div>
    );
}
