"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Volume1, Volume2, VolumeX } from "lucide-react";


const TRACK_HEIGHT = 216;
const TRACK_PADDING = 0;
const THUMB_SIZE = 92;

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const getVolumeLabel = (value: number) => {
    if (value === 0) return "Muted";
    if (value < 35) return "Quiet";
    if (value < 70) return "Comfortable";
    return "Loud";
};

function VolumeIcon({ value, active }: { value: number; active: boolean }) {
    const normalized = value / 100;
    const Icon = value === 0 ? VolumeX : value < 50 ? Volume1 : Volume2;
    const barBaseHeights = [14, 22, 32];

    return (
        <div className="flex flex-col items-center gap-3">
            <motion.div
                className="relative rounded-[26px] bg-white/10 p-5 shadow-[0_25px_60px_-30px_rgba(15,23,42,1)]"
                animate={{
                    backgroundColor: active ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.12)",
                }}
                transition={{ duration: 0.2 }}
            >
                <Icon className="h-10 w-10 text-white" strokeWidth={1.6} />
                <motion.div
                    className="pointer-events-none absolute inset-0 rounded-[26px] border border-white/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: active ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                />
            </motion.div>

            <div className="flex items-end gap-1.5">
                {[0.3, 0.65, 1].map((level, index) => (
                    <motion.span
                        key={level}
                        className="w-1.5 rounded-full bg-white"
                        animate={{
                            height: barBaseHeights[index] + normalized * 26,
                            opacity: normalized >= level ? 1 : Math.max(0.18, normalized + 0.1),
                        }}
                        transition={{ duration: 0.2, delay: index * 0.04 }}
                    />
                ))}
            </div>
        </div>
    );
}

function VolumeSlider() {
    const [value, setValue] = useState(60);
    const [isDragging, setIsDragging] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();

    const updateFromPointer = useCallback(
        (clientY: number) => {
            if (!trackRef.current) return;
            const rect = trackRef.current.getBoundingClientRect();
            const minY = rect.top + TRACK_PADDING;
            const maxY = rect.bottom - TRACK_PADDING;
            const clampedY = Math.min(Math.max(clientY, minY), maxY);
            const progress = (clampedY - minY) / (maxY - minY);
            const next = clamp(Math.round(100 - progress * 100));
            setValue(next);
        },
        []
    );

    const handlePointerMove = useCallback(
        (event: PointerEvent) => {
            if (!isDragging) return;
            event.preventDefault();
            updateFromPointer(event.clientY);
        },
        [isDragging, updateFromPointer]
    );

    const handlePointerUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (!isDragging) return;

        window.addEventListener("pointermove", handlePointerMove, { passive: false });
        window.addEventListener("pointerup", handlePointerUp);

        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
        };
    }, [handlePointerMove, handlePointerUp, isDragging]);

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
        updateFromPointer(event.clientY);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        let delta = 0;

        switch (event.key) {
            case "ArrowUp":
            case "ArrowRight":
                delta = event.shiftKey ? 10 : 5;
                break;
            case "ArrowDown":
            case "ArrowLeft":
                delta = event.shiftKey ? -10 : -5;
                break;
            case "Home":
                delta = 100 - value;
                break;
            case "End":
                delta = -value;
                break;
            case "PageUp":
                delta = 15;
                break;
            case "PageDown":
                delta = -15;
                break;
            default:
                return;
        }

        event.preventDefault();
        setValue((current) => clamp(current + delta));
    };

    const trackDistance = TRACK_HEIGHT - TRACK_PADDING * 2;
    const knobTravel = trackDistance - THUMB_SIZE;
    const knobOffset = TRACK_PADDING + ((100 - value) / 100) * knobTravel;
    const percent = value / 100;
    const sliderTransition = prefersReducedMotion
        ? { duration: 0 }
        : { type: "spring", stiffness: 240, damping: 32 };

    const volumeLabel = useMemo(() => getVolumeLabel(value), [value]);

    return (
        <div className="relative flex flex-col items-center gap-6">
            <div className="text-xs uppercase tracking-[0.35em] text-white/60">Volume</div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={volumeLabel}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 shadow-[0_15px_40px_-18px_rgba(15,23,42,0.45)]"
                >
                    {volumeLabel}
                </motion.div>
            </AnimatePresence>

            <div
                ref={trackRef}
                className="relative h-[216px] w-[96px] cursor-pointer touch-none select-none rounded-[36px] bg-white/12 p-3"
                role="slider"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={value}
                aria-valuetext={`${value}% volume`}
                tabIndex={0}
                onPointerDown={handlePointerDown}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            >
                <div className="absolute inset-3 rounded-[100px] bg-gradient-to-b from-white/25 via-white/10 to-white/5 shadow-[inset_0_8px_18px_rgba(255,255,255,0.28)]" />
                <motion.div
                    className="absolute inset-x-3 bottom-3 rounded-[28px] bg-gradient-to-b from-[#60a5fa] via-[#2563eb] to-[#1d4ed8]"
                    style={{ transformOrigin: "center bottom" }}
                    animate={{ scaleY: percent }}
                    transition={sliderTransition}
                />
                <motion.div
                    className="absolute left-1/2 h-[64px] w-[64px] -translate-x-1/2 rounded-[32px]"
                    animate={{ y: knobOffset, x: "-50%" }}
                    transition={sliderTransition}
                >
                    <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white via-white/85 to-white/70" />
                    <div className="absolute inset-[10px] rounded-[22px] bg-gradient-to-br from-slate-100 via-white to-slate-200 shadow-[inset_0_3px_6px_rgba(255,255,255,0.6)]" />
                </motion.div>
              {/*   <motion.div
                    className="pointer-events-none absolute inset-0 rounded-[36px] ring-2 ring-blue-400/70"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isFocused || isDragging ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                /> */}
            </div>

            <VolumeIcon value={value} active={isDragging || isFocused} />

            <motion.div
                key={value}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="text-sm font-semibold text-white/85"
            >
                {value}%
            </motion.div>
        </div>
    );
}

export default function VolumePage() {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent px-6 text-white">
            
                <VolumeSlider />
        </div>
    );
}
