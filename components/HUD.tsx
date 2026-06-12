"use client";

import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/* HUD — handwritten chrome above the canvas.                         */
/* Top-left: sketchbook stamp. Top-right: page indicator.             */
/* Bottom: scroll hint with bobbing pencil.                           */
/* ------------------------------------------------------------------ */
export function HUD() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setScrollProgress(total > 0 ? h.scrollTop / total : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Map scroll progress 0..1 to chapter label
  const chapter =
    scrollProgress < 0.05  ? "Threshold" :
    scrollProgress < 0.22  ? "About"     :
    scrollProgress < 0.40  ? "Skills"    :
    scrollProgress < 0.58  ? "Education" :
    scrollProgress < 0.78  ? "Projects"  :
                             "Contact";

  return (
    <>
      {/* Top-left stamp */}
      <div
        className="pointer-events-none fixed left-6 top-5 z-30 flex items-center gap-3"
        aria-hidden
      >
        <SketchbookSeal />
        <div className="leading-tight">
          <p className="handwritten text-2xl text-ink">Rohitangshu&rsquo;s</p>
          <p className="handwritten text-2xl text-ink -mt-1">Sketchbook</p>
        </div>
      </div>

      {/* Top-right chapter indicator */}
      <div className="pointer-events-none fixed right-6 top-6 z-30 text-right">
        <p className="text-[0.65rem] tracking-[0.22em] uppercase text-ink-soft">
          Chapter
        </p>
        <p className="handwritten text-3xl text-ink leading-none">{chapter}</p>
        <div className="mt-2 flex items-center justify-end gap-1">
          {["Threshold","About","Skills","Education","Projects","Contact"].map((c) => (
            <span
              key={c}
              className={`block h-[3px] rounded-full transition-all duration-500 ${
                c === chapter ? "w-7 bg-bronze" : "w-2 bg-ink-soft/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom-centre scroll hint */}
      <div
        className={`pointer-events-none fixed bottom-7 left-1/2 z-30 -translate-x-1/2 text-center transition-opacity duration-500 ${
          scrollProgress > 0.06 ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden
      >
        <p className="handwritten text-2xl text-ink paper-bob">
          scroll to wander deeper
        </p>
        <PencilArrow />
      </div>

      {/* Bottom-left "made by hand" tag */}
      <div className="pointer-events-none fixed bottom-5 left-6 z-30 text-[0.62rem] tracking-[0.22em] uppercase text-ink-soft">
        Made by hand · Bangalore
      </div>

      {/* The invisible scroll spacer that ScrollControls reads from.
          ScrollControls actually injects its own spacer, but we keep
          this DOM element so native scroll progress works for the HUD. */}
      <div className="scroll-spacer h-[600vh]" aria-hidden />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Tiny inline SVG decorations                                        */
/* ------------------------------------------------------------------ */
function SketchbookSeal() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden>
      <path
        d="M5 22 C6 8 36 6 39 22 C40 36 8 38 5 22 Z"
        stroke="#1a1614"
        strokeWidth="1.5"
        fill="#fbf7f0"
      />
      <path
        d="M14 18 L22 26 L30 16"
        stroke="#8b5e34"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="22" cy="22" r="19" stroke="#1a1614" strokeWidth="0.6" strokeDasharray="1 3" fill="none" />
    </svg>
  );
}

function PencilArrow() {
  return (
    <svg
      width="28" height="44"
      viewBox="0 0 28 44"
      className="mx-auto mt-2"
      aria-hidden
    >
      <path d="M14 4 C13 14 15 24 14 38" stroke="#1a1614" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M9 32 L14 40 L19 32" stroke="#1a1614" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
