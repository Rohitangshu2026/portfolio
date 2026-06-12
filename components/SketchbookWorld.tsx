"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ScrollControls, useScroll } from "@react-three/drei";
import { EffectComposer } from "@react-three/postprocessing";
import { useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { Hallway } from "./Hallway";
import { Doorway } from "./Doorway";
import { FloatingDoodle } from "./FloatingDoodle";
import { GuideOrb } from "./GuideOrb";
import { RoomOverlay } from "./RoomOverlay";
import { SketchEffect } from "./SketchEffect";

/* ------------------------------------------------------------------ */
/* Section catalogue                                                  */
/* ------------------------------------------------------------------ */
const ROOMS = [
  { slug: "about",     label: "About →",      z: -8,  side: "left"  as const },
  { slug: "skills",    label: "Skills →",     z: -18, side: "right" as const },
  { slug: "education", label: "Education →",  z: -28, side: "left"  as const },
  { slug: "projects",  label: "Projects →",   z: -38, side: "right" as const },
  { slug: "contact",   label: "Contact →",    z: -48, side: "left"  as const },
];

/* ------------------------------------------------------------------ */
/* Public component                                                   */
/* ------------------------------------------------------------------ */
export function SketchbookWorld() {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);

  return (
    <>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        camera={{ position: [0, 0.45, 6], fov: 55, near: 0.1, far: 200 }}
        style={{ background: "#f5f1ea" }}
      >
        {/* Soft warm ambient — we lean on basic materials so no real lighting math */}
        <ambientLight intensity={1.0} />

        <ScrollControls pages={6} damping={0.22} maxSpeed={0.6}>
          <Scene onEnterRoom={setActiveRoom} />
        </ScrollControls>

        {/* Hint of distance fog matching the paper colour */}
        <fog attach="fog" args={["#f0e9d8", 18, 56]} />

        {/* The single post-process pass that gives everything the pencil look */}
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <SketchEffect />
        </EffectComposer>
      </Canvas>

      <RoomOverlay slug={activeRoom} onClose={() => setActiveRoom(null)} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Scene — receives scroll progress + dispatches room enter events    */
/* ------------------------------------------------------------------ */
function Scene({ onEnterRoom }: { onEnterRoom: (slug: string) => void }) {
  const scroll = useScroll();
  const swayRef = useRef(0);

  useFrame((state, delta) => {
    const cam = state.camera;
    const t = scroll.offset; // 0 → 1 down the hallway

    // Glide camera forward along -Z
    const targetZ = 6 - t * 56;
    cam.position.z += (targetZ - cam.position.z) * 0.12;

    // Subtle walking bob + sway
    swayRef.current += delta;
    cam.position.y = 0.45 + Math.sin(swayRef.current * 1.6) * 0.04;
    cam.position.x = Math.sin(swayRef.current * 0.7) * 0.05;
    cam.rotation.z = Math.sin(swayRef.current * 0.9) * 0.006;

    // Look forward, with a hint of head-turn as you approach each doorway
    const nearest = ROOMS.reduce(
      (acc, r) => {
        const d = Math.abs(cam.position.z - r.z);
        return d < acc.d ? { d, r } : acc;
      },
      { d: Infinity, r: ROOMS[0] }
    );
    const lookAtX =
      nearest.d < 4
        ? (nearest.r.side === "left" ? -1.2 : 1.2) * (1 - nearest.d / 4) * 0.4
        : 0;
    const targetLook = new THREE.Vector3(
      lookAtX,
      cam.position.y - 0.05,
      cam.position.z - 4
    );
    cam.lookAt(targetLook);
  });

  return (
    <>
      <Hallway length={62} />

      {ROOMS.map((r) => (
        <Doorway
          key={r.slug}
          position={r.z}
          side={r.side}
          label={r.label}
          onEnter={() => onEnterRoom(r.slug)}
        />
      ))}

      <FloatingDoodles />
      <GuideOrb />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* A scatter of parallax sketches drifting in the corridor            */
/* ------------------------------------------------------------------ */
function FloatingDoodles(): ReactNode {
  // Seeded-feeling deterministic scatter so it doesn't reshuffle on every render
  const items = [
    { type: "plane",   pos: [-1.6, 1.4,  -4 ], speed: 0.7, rot: 0.2 },
    { type: "spiral",  pos: [ 1.8, 0.9,  -9 ], speed: 0.5, rot: -0.3 },
    { type: "star",    pos: [-2.2, 2.2, -14 ], speed: 0.9, rot: 0.1 },
    { type: "plane",   pos: [ 2.4, 1.6, -19 ], speed: 0.6, rot: -0.2 },
    { type: "spiral",  pos: [-1.0, 2.1, -24 ], speed: 0.4, rot: 0.4 },
    { type: "star",    pos: [ 1.5, 2.3, -31 ], speed: 0.8, rot: -0.1 },
    { type: "plane",   pos: [-2.6, 1.0, -37 ], speed: 0.5, rot: 0.3 },
    { type: "spiral",  pos: [ 1.0, 1.8, -43 ], speed: 0.6, rot: -0.4 },
    { type: "star",    pos: [-1.4, 2.4, -50 ], speed: 0.7, rot: 0.2 },
  ] as const;

  return (
    <>
      {items.map((it, i) => (
        <FloatingDoodle
          key={i}
          variant={it.type}
          position={it.pos as [number, number, number]}
          bobSpeed={it.speed}
          baseRotation={it.rot}
        />
      ))}
    </>
  );
}
