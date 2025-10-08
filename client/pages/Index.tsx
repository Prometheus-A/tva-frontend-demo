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
          className="animate-btn-in will-change-transform rounded-full border border-transparent bg-white px-8 py-3 text-base font-semibold tracking-wide text-black opacity-90 transition-all duration-[1600ms] ease-in-out hover:opacity-100 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-white/60 hover:bg-black hover:text-white hover:border-white hover:shadow-[0_0_0_1px_#fff,0_0_24px_rgba(255,255,255,0.35)]"
          size="lg"
          style={{ animationDelay: "120ms" }}
        >
          commence
        </Button>
      </div>
    </div>
  );
}
