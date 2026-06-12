"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/* ------------------------------------------------------------------ */
/* RoomOverlay — when a doorway is entered, this DOM card zooms in    */
/* and shows the hand-written "room" contents. Click outside or press */
/* Esc to step back into the hallway.                                 */
/* ------------------------------------------------------------------ */
export function RoomOverlay({
  slug,
  onClose,
}: {
  slug: string | null;
  onClose: () => void;
}) {
  const scrim = useRef<HTMLDivElement>(null);
  const card  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;
    if (scrim.current) gsap.fromTo(scrim.current, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power2.out" });
    if (card.current) {
      gsap.fromTo(
        card.current,
        { scale: 0.85, opacity: 0, rotate: -1.2, y: 30 },
        { scale: 1, opacity: 1, rotate: 0, y: 0, duration: 0.7, ease: "power3.out" }
      );
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slug, onClose]);

  if (!slug) return null;
  const content = ROOM_CONTENT[slug] ?? ROOM_CONTENT.about;

  return (
    <div
      ref={scrim}
      className="fixed inset-0 z-40 flex items-center justify-center bg-paper/70 backdrop-blur-[2px] p-4"
      onClick={(e) => { if (e.target === scrim.current) onClose(); }}
    >
      <div
        ref={card}
        className="relative max-w-2xl w-full bg-paper-light border border-ink/15 rounded-[18px] shadow-[0_30px_70px_-30px_rgba(26,22,20,0.45)] px-8 py-10 paper-bob"
        style={{ animationDuration: "9s" }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-5 handwritten text-2xl text-ink-soft hover:text-bronze transition-colors"
          aria-label="Close room"
        >
          ✕ back
        </button>

        <p className="text-[0.65rem] tracking-[0.22em] uppercase text-bronze mb-2">
          — Room
        </p>
        <h2 className="handwritten text-5xl text-ink mb-4 leading-none">
          {content.title}
        </h2>
        <p className="font-body text-ink-soft leading-relaxed mb-5">
          {content.lede}
        </p>
        <div className="space-y-3 font-body text-ink/90">
          {content.body.map((para, i) => (
            <p key={i} className="leading-relaxed">{para}</p>
          ))}
        </div>

        {content.hint && (
          <p className="mt-6 handwritten text-xl text-bronze">{content.hint}</p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hand-written "room" copy                                            */
/* ------------------------------------------------------------------ */
const ROOM_CONTENT: Record<string, {
  title: string;
  lede: string;
  body: string[];
  hint?: string;
}> = {
  about: {
    title: "About",
    lede: "A backend & systems engineer who keeps notebooks full of half-finished storage engines.",
    body: [
      "I build for the layers closest to the operating system, the network, and storage — places where correctness, concurrency, and behaviour under partial failure decide whether a system is actually reliable.",
      "My favourite kind of week is one where I ship something small that earns its keep under load, and learn one thing from first principles that I used to take for granted.",
    ],
    hint: "tip — the other doors are still being inked.",
  },
  skills:    { title: "Skills",    lede: "Coming soon.", body: ["This room is still being sketched."] },
  education: { title: "Education", lede: "Coming soon.", body: ["This room is still being sketched."] },
  projects:  { title: "Projects",  lede: "Coming soon.", body: ["This room is still being sketched."] },
  contact:   { title: "Contact",   lede: "Coming soon.", body: ["This room is still being sketched."] },
};
