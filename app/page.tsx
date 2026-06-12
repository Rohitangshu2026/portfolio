import { SketchbookWorld } from "@/components/SketchbookWorld";
import { HUD } from "@/components/HUD";
import { PaperOverlay } from "@/components/PaperOverlay";

export default function Page() {
  return (
    <>
      {/* The 3D world fills the viewport behind everything else */}
      <div className="world-root">
        <SketchbookWorld />
      </div>

      {/* Sketch-paper texture sits above the canvas but below the HUD */}
      <PaperOverlay />

      {/* Hand-drawn HUD: title, scroll hint, chapter indicator */}
      <HUD />
    </>
  );
}
