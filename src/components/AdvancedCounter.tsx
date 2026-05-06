// AdvancedCounter.tsx — counter with history, auto-save, keyboard, reset, and step input
//
// IMPORT RULES (prevents verbatimModuleSyntax errors):
// - "import { ... }" for runtime values (hooks, functions)
// - "import type { ... }" for type-only imports
// Here we only need runtime hooks, no type-only imports needed.

import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";

function AdvancedCounter() {
    // ===== STATE =====
    // Load saved count from localStorage, default to 0
    const [count, setCount] = useState<number>(() => {
        const saved = localStorage.getItem("counter-value");
        return saved ? Number(saved) : 0;
    });

    // History of all count values
    const [history, setHistory] = useState<number[]>([0]);

    // Custom step value (how much to increment/decrement by)
    const [step, setStep] = useState<number>(1);

    // ===== DERIVED STATE =====
    // console.log("Render — count:", count, "step:", step);

    // ===== HANDLERS =====
    // Using functional updates (prevCount =>) so we always get the latest value,
    // even if React batches multiple updates together (lesson 1 concept)

    const increment = () => {
        setCount((prev) => prev + step);
    };

    const decrement = () => {
        setCount((prev) => prev - step);
    };

    const reset = () => {
        setCount(0);
        setHistory([0]);
    };

    const handleStepChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        // Only update if it's a valid positive number
        if (!isNaN(val) && val > 0) setStep(val);
    };

    // ===== EFFECTS =====

    // 1. History tracking — add count to history whenever it changes
    useEffect(() => {
        // console.log("Effect: count changed to", count);
        setHistory((prev) => [...prev, count]);
    }, [count]);

    // 2. Auto-save to localStorage whenever count changes
    useEffect(() => {
        // console.log("Effect: saving count to localStorage", count);
        const timeoutId = setTimeout(() => {
            localStorage.setItem("counter-value", String(count));
        }, 300);

        // Cleanup: cancel the pending save if count changes again before 300ms
        // This prevents race conditions from rapid clicks
        return () => {
            // console.log("Cleanup: clearing save timeout");
            clearTimeout(timeoutId);
        };
    }, [count]);

    // 3. Keyboard listeners — ArrowUp to increment, ArrowDown to decrement
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowUp") {
                // console.log("Keyboard: ArrowUp pressed");
                setCount((prev) => prev + step);
            }
            if (e.key === "ArrowDown") {
                // console.log("Keyboard: ArrowDown pressed");
                setCount((prev) => prev - step);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        // Cleanup: remove the listener when component unmounts or step changes
        return () => {
            // console.log("Cleanup: removing keyboard listener");
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [step]); // Re-attach listener when step changes so closure captures new step