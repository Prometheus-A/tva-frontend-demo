import { Button } from "@/components/ui/button";
import FallingSuits from "@/components/FallingSuits";

export default function Index() {
  return (
    <div className="relative min-h-screen w-full bg-black text-white">
      {/* Vignette & subtle gradient overlay for depth (behind suits) */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-48 bg-gradient-to-b from-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-48 bg-gradient-to-t from-black/70 to-transparent" />

      {/* Falling suits background */}
      <FallingSuits />

      {/* Centered Call-to-Action */}
      <div className="relative z-20 flex min-h-screen items-center justify-center">
        <Button
          variant="ghost"
          className="group rounded-full border-2 border-white/0 bg-white px-8 py-3 text-base font-semibold tracking-wide text-black transition-colors transition-shadow transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-white/60 hover:bg-black hover:text-white hover:border-white hover:shadow-[0_0_0_2px_rgba(255,255,255,1),0_0_24px_rgba(255,255,255,0.35)]"
          size="lg"
        >
          <span className="relative">
            commence
            <span className="absolute -inset-x-1 -bottom-1 block h-px w-[120%] translate-x-1/2 translate-y-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          </span>
        </Button>
      </div>
    </div>
  );
}
