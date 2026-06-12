"use client";

import { Html, Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";

const INK = "#1a1614";
const BRONZE = "#8b5e34";
const W = 8; // hallway width — must match Hallway

type Tuple3 = [number, number, number];

/* ------------------------------------------------------------------ */
/* Doorway — a hand-drawn rectangle cut into a side wall.             */
/* Hover: ink → bronze, label scales. Click: triggers onEnter.        */
/* ------------------------------------------------------------------ */
export function Doorway({
  position,
  side,
  label,
  onEnter,
}: {
  position: number;       // z along the hallway
  side: "left" | "right";
  label: string;
  onEnter?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  // Door dimensions
  const DW = 1.8;
  const DH = 2.6;
  const wallX = side === "left" ? -W / 2 + 0.001 : W / 2 - 0.001;
  const rotY = side === "left" ? Math.PI / 2 : -Math.PI / 2;

  // The rectangle outline — three sides + a hand-drawn floor sketch
  const frame = useMemo<Tuple3[]>(() => [
    [-DW / 2, -1,         0],
    [-DW / 2, -1 + DH,    0],
    [ DW / 2, -1 + DH,    0],
    [ DW / 2, -1,         0],
  ], [DW, DH]);

  // A faint inner "doorway shadow" suggesting a room beyond
  const interior = useMemo(() => (
    <mesh position={[0, -1 + DH / 2, -0.02]}>
      <planeGeometry args={[DW - 0.05, DH - 0.05]} />
      <meshBasicMaterial
        color={hovered ? BRONZE : INK}
        opacity={hovered ? 0.18 : 0.08}
        transparent
      />
    </mesh>
  ), [hovered, DW, DH]);

  // Gentle handwriting bob on the label
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 0.8 + position) * 0.015;
  });

  return (
    <group position={[wallX, 0, position]} rotation={[0, rotY, 0]}>
      {interior}

      {/* Hand-drawn frame */}
      <Line points={frame} color={hovered ? BRONZE : INK} lineWidth={hovered ? 2.8 : 2.2} />

      {/* Threshold scribble at the floor */}
      <Line
        points={[
          [-DW / 2 - 0.05, -0.99, 0.01],
          [-DW / 2 + 0.1,  -1.01, 0.01],
          [ 0,             -0.99, 0.01],
          [ DW / 2 - 0.1,  -1.01, 0.01],
          [ DW / 2 + 0.05, -0.99, 0.01],
        ]}
        color={INK}
        lineWidth={1.4}
      />

      {/* Floating sketched label above the door */}
      <group ref={groupRef} position={[0, -1 + DH + 0.45, 0.02]}>
        <Html center distanceFactor={6} transform sprite>
          <button
            type="button"
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            onClick={(e) => {
              e.stopPropagation();
              onEnter?.();
            }}
            className={`handwritten select-none whitespace-nowrap text-5xl transition-all cursor-pointer ${
              hovered ? "scale-110 text-bronze" : "text-ink"
            }`}
            style={{
              textShadow: "0 1px 0 rgba(255,255,255,0.5)",
              padding: "0.2rem 0.8rem",
            }}
          >
            {label}
          </button>
        </Html>
      </group>

      {/* Invisible mesh to catch clicks across the whole door area */}
      <mesh
        position={[0, -1 + DH / 2, 0.04]}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onEnter?.();
        }}
      >
        <planeGeometry args={[DW, DH]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}
