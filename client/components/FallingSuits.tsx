import { useEffect, useMemo, useRef, useState } from "react";
import { Club, Diamond, Heart, Spade } from "lucide-react";

type SuitType = "heart" | "diamond" | "club" | "spade";

interface Suit {
  id: number;
  x: number; // px
  y: number; // px
  baseX: number; // px
  size: number; // px
  vy: number; // px/s
  swayAmp: number; // px
  swayFreq: number; // Hz
  swayPhase: number; // rad
  opacity: number; // 0..1
  suit: SuitType;
}

const SUITS: SuitType[] = ["heart", "diamond", "club", "spade"];

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function FallingSuits({ speed = 1 }: { speed?: number }) {
  const [mounted, setMounted] = useState(false);
  const [frame, setFrame] = useState(0);
  const itemsRef = useRef<Suit[]>([]);
  const dimsRef = useRef({ w: 1200, h: 800 });
  const lastRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const updateDims = () => {
      dimsRef.current = {
        w: window.innerWidth,
        h: window.innerHeight,
      };
    };
    updateDims();
    window.addEventListener("resize", updateDims);

    const { w } = dimsRef.current;
    const density = w < 640 ? 0.28 : w < 1024 ? 0.36 : 0.44; // doubled density
    const count = Math.max(128, Math.min(480, Math.floor(w * density)));

    const init: Suit[] = Array.from({ length: count }).map((_, i) => {
      const size = Math.round(rand(6, 22));
      const baseX = rand(0, dimsRef.current.w);
      return {
        id: i,
        x: baseX,
        y: rand(-dimsRef.current.h, 0),
        baseX,
        size,
        vy: rand(35, 120),
        swayAmp: rand(6, 26),
        swayFreq: rand(0.12, 0.5),
        swayPhase: rand(0, Math.PI * 2),
        opacity: rand(0.65, 1),
        suit: SUITS[Math.floor(rand(0, SUITS.length))],
      };
    });
    itemsRef.current = init;

    let raf = 0;
    const tick = (ts: number) => {
      const prev = lastRef.current ?? ts;
      let dt = (ts - prev) / 1000; // seconds
      lastRef.current = ts;
      // clamp dt for tab switches
      if (dt > 0.05) dt = 0.05;

      simulate(dt * speed);
      // batch re-render ~30fps
      setFrame((f) => (f + 1) % 2);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateDims);
    };
  }, [mounted, speed]);

  const simulate = (dt: number) => {
    const items = itemsRef.current;
    const { w, h } = dimsRef.current;

    // spatial hash for collisions
    const cell = 32;
    const grid = new Map<string, number[]>();
    const keyOf = (x: number, y: number) => `${Math.floor(x / cell)}_${Math.floor(y / cell)}`;

    const t = performance.now() / 1000;

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      // sway
      it.x = it.baseX + Math.sin(t * it.swayFreq + it.swayPhase) * it.swayAmp;
      // fall
      it.y += it.vy * dt;

      // wrap
      if (it.y - it.size > h + 16) {
        it.y = -rand(0, h * 0.6);
        it.baseX = rand(0, w);
        it.vy = rand(35, 120);
        it.swayAmp = rand(6, 26);
        it.swayFreq = rand(0.12, 0.5);
        it.swayPhase = rand(0, Math.PI * 2);
      }

      const k = keyOf(it.x, it.y);
      if (!grid.has(k)) grid.set(k, []);
      grid.get(k)!.push(i);
    }

    // collisions
    const neighbors = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
      [-1, 0],
      [0, -1],
      [-1, -1],
      [1, -1],
      [-1, 1],
    ];

    for (let i = 0; i < items.length; i++) {
      const a = items[i];
      const ax = Math.floor(a.x / cell);
      const ay = Math.floor(a.y / cell);
      const rA = a.size * 0.48;

      for (const [dx, dy] of neighbors) {
        const k = `${ax + dx}_${ay + dy}`;
        const bucket = grid.get(k);
        if (!bucket) continue;
        for (const j of bucket) {
          if (j <= i) continue;
          const b = items[j];
          const rB = b.size * 0.48;
          const dxp = a.x - b.x;
          const dyp = a.y - b.y;
          const dist2 = dxp * dxp + dyp * dyp;
          const minDist = rA + rB;
          if (dist2 < minDist * minDist) {
            const dist = Math.sqrt(dist2) || 0.001;
            const nx = dxp / dist;
            const ny = dyp / dist;
            const overlap = minDist - dist;
            // push apart to exactly touch
            const push = overlap * 0.5;
            a.x += nx * push;
            a.y += ny * push;
            b.x -= nx * push;
            b.y -= ny * push;
            // simple bounce by exchanging small vertical component
            const vSwap = (a.vy - b.vy) * 0.3;
            a.vy -= vSwap;
            b.vy += vSwap;
          }
        }
      }
    }
  };

  const items = itemsRef.current;
  const width = typeof window !== "undefined" ? window.innerWidth : 1200;
  const height = typeof window !== "undefined" ? window.innerHeight : 800;

  const IconOf: Record<SuitType, any> = { heart: Heart, diamond: Diamond, club: Club, spade: Spade };

  // render
  return (
    <div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
      {items.map((s) => {
        const Icon = IconOf[s.suit];
        return (
          <div
            key={s.id}
            className="absolute will-change-transform"
            style={{
              transform: `translate(${s.x}px, ${s.y}px)`,
              width: s.size,
              height: s.size,
            }}
          >
            <Icon
              className="text-transparent stroke-white"
              strokeWidth={1.6}
              style={{ width: s.size, height: s.size, opacity: s.opacity }}
            />
          </div>
        );
      })}
    </div>
  );
}
