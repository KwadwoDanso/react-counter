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