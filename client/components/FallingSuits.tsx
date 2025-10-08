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
  easing: string; // CSS timing function
}

const SUITS: SuitType[] = ["heart", "diamond", "club", "spade"];

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function FallingSuits({ speed = 1 }: { speed?: number }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const specs = useMemo(() => {
    const width = typeof window !== "undefined" ? window.innerWidth : 1200;
    const density = width < 640 ? 0.16 : width < 1024 ? 0.2 : 0.24; // proportional to width
    const count = Math.max(64, Math.min(260, Math.floor(width * density)));

    const clusters = Math.floor(random(3, 7));
    const centers = Array.from({ length: clusters }).map(() => random(5, 95)); // left% centers

    const pickLeft = () => {
      if (Math.random() < 0.7) {
        const c = centers[Math.floor(random(0, centers.length))];
        return Math.max(0, Math.min(100, c + random(-7, 7)));
      }
      return Math.max(0, Math.min(100, random(0, 100)));
    };

    const easings = [
      "linear",
      "cubic-bezier(.2,.8,.2,1)", // standard ease-out
      "cubic-bezier(.3,.7,.4,1)",
      "cubic-bezier(.1,.9,.2,1)",
      "cubic-bezier(.4,0,.2,1)", // standard ease
    ];

    return Array.from({ length: count }).map((_, i) => {
      const size = Math.round(random(6, 14));
      return {
        id: i,
        left: Math.round(pickLeft()),
        size,
        duration: random(6, 36),
        delay: -random(0, 42),
        swayDuration: random(4.5, 12.5),
        opacity: random(0.25, 0.55),
        suit: SUITS[Math.floor(random(0, SUITS.length))],
        easing: easings[Math.floor(random(0, easings.length))],
      } as SuitSpec;
    });
  }, [mounted]);

  if (!mounted) return null; // avoid SSR hydration mismatch

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden>
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
              animationDuration: `${s.swayDuration * speed}s`,
              animationDelay: `${s.delay}s`,
            }}
          >
            <div
              className="animate-fall will-change-transform"
              style={{
                animationDuration: `${s.duration * speed}s`,
                animationDelay: `${s.delay}s`,
                animationTimingFunction: s.easing,
              }}
            >
              <Icon
                style={{ width: s.size, height: s.size, opacity: s.opacity }}
                className="stroke-white/70 text-transparent"
                strokeWidth={1.25}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
