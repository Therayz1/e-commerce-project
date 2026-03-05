"use client";
import { useUIStore } from "@/lib/store/uiStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
};

const colors = {
    success: "border-l-green-500 bg-green-50",
    error: "border-l-red-500 bg-red-50",
    info: "border-l-blue-500 bg-blue-50",
    warning: "border-l-yellow-500 bg-yellow-50",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const { toasts, removeToast } = useUIStore();

    return (
        <>
            {children}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 100, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.9 }}
                            className={`pointer-events-auto flex items-start gap-3 p-4 pr-8 rounded-xl shadow-xl border-l-4 min-w-[300px] max-w-sm ${colors[toast.type]}`}
                        >
                            {icons[toast.type]}
                            <div className="flex-1 min-w-0">
                                {toast.title && <p className="font-semibold text-gray-900 text-sm">{toast.title}</p>}
                                <p className="text-gray-700 text-sm">{toast.message}</p>
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </>
    );
}
