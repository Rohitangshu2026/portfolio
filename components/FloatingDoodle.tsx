"use client";

import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const INK = "#1a1614";
const INK_SOFT = "#3a342c";

type Tuple3 = [number, number, number];

/* ------------------------------------------------------------------ */
/* FloatingDoodle — a tiny hand-drawn shape that bobs and slowly      */
/* spins in place. Three variants: paper plane, spiral, star.         */
/* ------------------------------------------------------------------ */
export function FloatingDoodle({
  variant,
  position,
  bobSpeed = 0.6,
  baseRotation = 0,
}: {
  variant: "plane" | "spiral" | "star";
  position: Tuple3;
  bobSpeed?: number;
  baseRotation?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const seed = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * bobSpeed + seed) * 0.18;
    ref.current.position.x = position[0] + Math.cos(t * bobSpeed * 0.6 + seed) * 0.06;
    ref.current.rotation.z = baseRotation + Math.sin(t * 0.4 + seed) * 0.12;
    ref.current.rotation.y = Math.sin(t * 0.3 + seed) * 0.18;
  });

  return (
    <group ref={ref} position={position} scale={0.45}>
      {variant === "plane"  && <PaperPlane />}
      {variant === "spiral" && <Spiral />}
      {variant === "star"   && <Star />}
    </group>
  );
}

/* ------------------------------------------------------------------ */

function PaperPlane() {
  // A simple paper airplane silhouette in two stroked passes
  const outline: Tuple3[] = [
    [-0.55, -0.05, 0],
    [ 0.55,  0.10, 0],
    [-0.45,  0.18, 0],
    [-0.55, -0.05, 0],
    [-0.30, -0.12, 0],
  ];
  const fold: Tuple3[] = [
    [-0.45,  0.18, 0],
    [-0.10,  0.02, 0],
  ];
  return (
    <>
      <Line points={outline} color={INK} lineWidth={1.6} />
      <Line points={fold} color={INK_SOFT} lineWidth={1.2} />
    </>
  );
}

function Spiral() {
  const pts = useMemo<Tuple3[]>(() => {
    const out: Tuple3[] = [];
    const turns = 2.6;
    const samples = 48;
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const angle = t * Math.PI * 2 * turns;
      const r = 0.05 + t * 0.4;
      out.push([Math.cos(angle) * r, Math.sin(angle) * r, 0]);
    }
    return out;
  }, []);
  return <Line points={pts} color={INK} lineWidth={1.4} />;
}

function Star() {
  // 5-point star with the classic "kid's doodle" stroke order
  const pts = useMemo<Tuple3[]>(() => {
    const outer = 0.5;
    const a0 = -Math.PI / 2;
    const verts: Tuple3[] = [];
    for (let i = 0; i < 5; i++) {
      const a = a0 + (i * 2 * Math.PI) / 5;
      verts.push([Math.cos(a) * outer, Math.sin(a) * outer, 0]);
    }
    // 0 → 2 → 4 → 1 → 3 → 0 (kid's drawing path)
    const order = [0, 2, 4, 1, 3, 0];
    return order.map((i) => verts[i]);
  }, []);
  return <Line points={pts} color={INK} lineWidth={1.6} />;
}
