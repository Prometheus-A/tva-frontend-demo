import { useState } from "react";
import { Button } from "@/components/ui/button";
import FallingSuits from "@/components/FallingSuits";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Wallet, Shield, Gamepad2, Compass } from "lucide-react";

export default function Index() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-black text-white">
      <div className={"relative z-10 min-h-screen transition-all duration-300 " + (open ? "blur-[6px]" : "")}>
        {/* Vignette & subtle gradient overlay for depth (behind suits) */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-48 bg-gradient-to-b from-black/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-48 bg-gradient-to-t from-black/70 to-transparent" />

        {/* Falling suits background */}
        <FallingSuits speed={open ? 0.25 : 1} />

        {/* Centered Call-to-Action */}
        <div className="relative z-20 flex min-h-screen items-center justify-center">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="animate-btn-in will-change-transform rounded-full border border-transparent bg-white px-8 py-3 text-base font-semibold tracking-wide text-black opacity-10 transition-all duration-[1000ms] ease-in-out hover:opacity-100 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-white/60 hover:bg-black hover:text-white hover:border-white hover:shadow-[0_0_0_1px_#fff,0_0_24px_rgba(255,255,255,0.35)]"
                size="lg"
                style={{ animationDelay: "120ms" }}
              >
                commence
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-black/80 text-white border-white/10">
              <DialogTitle className="text-white">Choose a wallet</DialogTitle>
              <DialogDescription className="text-white/70">
                Select a wallet to commence into the app
              </DialogDescription>
              <div className="mt-2 grid gap-2">
                <button className="flex items-center gap-3 w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-left font-medium hover:bg-white/10 transition-colors"><Wallet className="h-5 w-5" /> Ready X wallet</button>
                <button className="flex items-center gap-3 w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-left font-medium hover:bg-white/10 transition-colors"><Shield className="h-5 w-5" /> Braavos</button>
                <button className="flex items-center gap-3 w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-left font-medium hover:bg-white/10 transition-colors"><Gamepad2 className="h-5 w-5" /> Cartridge</button>
                <button className="flex items-center gap-3 w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-left font-medium hover:bg-white/10 transition-colors"><Compass className="h-5 w-5" /> Explore without wallet</button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
