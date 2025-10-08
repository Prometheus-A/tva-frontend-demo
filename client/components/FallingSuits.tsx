import { useEffect, useMemo, useState } from "react";
import { Club, Diamond, Heart, Spade } from "lucide-react";

type SuitType = "heart" | "diamond" | "club" | "spade";

interface SuitSpec {
  id: number;
  left: number; // percentage
  size: number; // px
  duration: number; // seconds
  delay: number; // seconds (can be negative for desync)
  swayDuration: number; // seconds
  opacity: number; // 0..1
  suit: SuitType;
}

const SUITS: SuitType[] = ["heart", "diamond", "club", "spade"];

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function FallingSuits() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const specs = useMemo(() => {
    const width = typeof window !== "undefined" ? window.innerWidth : 1200;
    const density = width < 640 ? 0.05 : width < 1024 ? 0.07 : 0.09; // elements per px
    const count = Math.max(32, Math.min(140, Math.floor(width * density)));

    return Array.from({ length: count }).map((_, i) => {
      const size = Math.round(random(8, 16));
      return {
        id: i,
        left: Math.round(random(0, 100)),
        size,
        duration: random(10, 22),
        delay: -random(0, 22),
        swayDuration: random(4, 10),
        opacity: random(0.25, 0.6),
        suit: SUITS[Math.floor(random(0, SUITS.length))],
      } as SuitSpec;
    });
  }, [mounted]);

  if (!mounted) return null; // avoid SSR hydration mismatch

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {specs.map((s) => {
        const Icon =
          s.suit === "heart"
            ? Heart
            : s.suit === "diamond"
              ? Diamond
              : s.suit === "club"
                ? Club
                : Spade;
        return (
          <div
            key={s.id}
            className="absolute top-0 animate-sway will-change-transform"
            style={{
              left: `${s.left}%`,
              animationDuration: `${s.swayDuration}s`,
              animationDelay: `${s.delay}s`,
            }}
          >
            <div
              className="animate-fall will-change-transform"
              style={{
                animationDuration: `${s.duration}s`,
                animationDelay: `${s.delay}s`,
              }}
            >
              <Icon
                style={{ width: s.size, height: s.size, opacity: s.opacity }}
                className="stroke-white/60 text-white/60"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
