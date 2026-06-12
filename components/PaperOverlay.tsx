"use client";

/**
 * Two thin DOM layers above the WebGL canvas:
 *   1. paper-grain — faint film-paper texture (SVG noise, multiply blend)
 *   2. paper-vignette — gentle corner darkening to suggest a notebook page
 *
 * Both are pointer-events: none so they never intercept clicks on the 3D world.
 */
export function PaperOverlay() {
  return (
    <>
      <div className="paper-grain" aria-hidden />
      <div className="paper-vignette" aria-hidden />
    </>
  );
}
