"use client";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { useUIStore } from "@/lib/store/uiStore";

// The Konami Code sequence: Up, Up, Down, Down, Left, Right, Left, Right, B, A
const KONAMI_CODE = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
    "b", "a"
];

export function KonamiListener() {
    const { addToast } = useUIStore();
    const [inputSequence, setInputSequence] = useState<string[]>([]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key;

            setInputSequence((prev) => {
                const newSequence = [...prev, key];
                if (newSequence.length > KONAMI_CODE.length) {
                    newSequence.shift();
                }

                if (newSequence.join(",") === KONAMI_CODE.join(",")) {
                    // Trigger Easter Egg
                    triggerEasterEgg();
                    return []; // Reset sequence after triggering
                }

                return newSequence;
            });
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const triggerEasterEgg = () => {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
        }, 250);

        addToast({
            title: "Tarihi Şifre Çözüldü!",
            message: "Gizli %50 İndirim Kodu: KONAMI50 🎉 Sadece bu hesaba özel kullanabilirsiniz.",
            type: "success",
        });
    };

    return null; // This component doesn't render anything visible
}
