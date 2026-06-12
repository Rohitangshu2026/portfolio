"use client";

import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const INK = "#1a1614";
const BRONZE = "#8b5e34";

type Tuple3 = [number, number, number];

/* ------------------------------------------------------------------ */
/* GuideOrb — a tiny sketchy companion that spring-follows the camera */
/* and bobs along like a friendly pencil-eye. Placeholder for the     */
/* fully animated guide character.                                    */
/* ------------------------------------------------------------------ */
export function GuideOrb() {
  const groupRef = useRef<THREE.Group>(null);
  const target = useRef(new THREE.Vector3(0.7, 0.85, 3));

  const ringPoints = useMemo<Tuple3[]>(() => {
    const out: Tuple3[] = [];
    const n = 40;
    const radius = 0.13;
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * Math.PI * 2;
      // Slight wobble so the circle reads as hand-drawn
      const r = radius + Math.sin(a * 5) * 0.006;
      out.push([Math.cos(a) * r, Math.sin(a) * r, 0]);
    }
    return out;
  }, []);

  // A little pupil arc that suggests eyes
  const browPoints = useMemo<Tuple3[]>(() => {
    const out: Tuple3[] = [];
    const n = 16;
    const radius = 0.06;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const a = Math.PI + t * Math.PI; // top half-arc
      out.push([Math.cos(a) * radius, Math.sin(a) * radius + 0.025, 0]);
    }
    return out;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const cam = state.camera;
    const t = state.clock.elapsedTime;

    // Offset relative to camera — slightly to the right, slightly up, ahead
    target.current.set(
      cam.position.x + 0.85,
      cam.position.y + 0.45,
      cam.position.z - 2.4
    );

    // Spring follow
    groupRef.current.position.lerp(target.current, 0.06);

    // Idle bob
    groupRef.current.position.y += Math.sin(t * 2.2) * 0.025;
    groupRef.current.position.x += Math.cos(t * 1.1) * 0.012;

    // Face the camera
    groupRef.current.lookAt(cam.position);
  });

  return (
    <group ref={groupRef}>
      <Line points={ringPoints} color={INK} lineWidth={1.8} />
      <Line points={browPoints} color={INK} lineWidth={1.4} />
      <mesh>
        <circleGeometry args={[0.025, 14]} />
        <meshBasicMaterial color={BRONZE} />
      </mesh>
    </group>
  );
}
