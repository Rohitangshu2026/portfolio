"use client";

import { Line } from "@react-three/drei";
import { useMemo } from "react";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Geometry constants                                                 */
/* ------------------------------------------------------------------ */
const W = 8;     // hallway width
const H = 4;     // hallway height
const FY = -1;   // floor y
const CY = FY + H;

const INK = "#1a1614";
const INK_SOFT = "#c9c0af";
const PAPER = "#fbf7f0";
const PAPER_FLOOR = "#efe7d6";

type Tuple3 = [number, number, number];

/* ------------------------------------------------------------------ */
/* Hallway — floor, ceiling, two side walls, and the hand-drawn lines */
/* that read as paper ruling and corner ink edges.                    */
/* ------------------------------------------------------------------ */
export function Hallway({ length = 60 }: { length?: number }): ReactNode {
  const start = 6;
  const end = start - length;
  const mid = (start + end) / 2;

  /* --- Notebook-style ruling lines on both side walls --- */
  const wallRulings = useMemo(() => {
    const ys = [-0.4, 0.1, 0.6, 1.1, 1.6, 2.1, 2.6];
    return ys.flatMap((y) => [
      { points: [[-W / 2, y, start], [-W / 2, y, end]] as Tuple3[], side: "left" },
      { points: [[ W / 2, y, start], [ W / 2, y, end]] as Tuple3[], side: "right" },
    ]);
  }, [start, end]);

  /* --- Vertical "page break" markers every ~10 units --- */
  const breaks = useMemo(() => {
    const zs: number[] = [];
    for (let z = start - 5; z >= end + 2; z -= 10) zs.push(z);
    return zs;
  }, [start, end]);

  return (
    <group>
      {/* Floor — slightly warmer cream */}
      <mesh position={[0, FY, mid]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W, length]} />
        <meshBasicMaterial color={PAPER_FLOOR} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, CY, mid]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W, length]} />
        <meshBasicMaterial color={PAPER} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-W / 2, (FY + CY) / 2, mid]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[length, H]} />
        <meshBasicMaterial color={PAPER} />
      </mesh>

      {/* Right wall */}
      <mesh position={[ W / 2, (FY + CY) / 2, mid]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[length, H]} />
        <meshBasicMaterial color={PAPER} />
      </mesh>

      {/* --- Ink corner lines — give the hallway its sketched edges --- */}
      <CornerLine a={[-W / 2, FY, start]} b={[-W / 2, FY, end]} width={2.2} />
      <CornerLine a={[ W / 2, FY, start]} b={[ W / 2, FY, end]} width={2.2} />
      <CornerLine a={[-W / 2, CY, start]} b={[-W / 2, CY, end]} width={1.6} />
      <CornerLine a={[ W / 2, CY, start]} b={[ W / 2, CY, end]} width={1.6} />

      {/* Centre line down the floor — like a page seam */}
      <Line
        points={[[0, FY + 0.01, start], [0, FY + 0.01, end]]}
        color={INK_SOFT}
        lineWidth={1}
        dashed
        dashSize={0.25}
        gapSize={0.18}
      />

      {/* Wall ruling */}
      {wallRulings.map((r, i) => (
        <Line
          key={`r-${i}`}
          points={r.points}
          color={INK_SOFT}
          lineWidth={1}
          transparent
          opacity={0.65}
        />
      ))}

      {/* Vertical page-break ticks at intervals */}
      {breaks.map((z) => (
        <group key={`b-${z}`}>
          <Line
            points={[[-W / 2, FY + 0.02, z], [-W / 2, CY - 0.02, z]]}
            color={INK_SOFT}
            lineWidth={1}
            transparent
            opacity={0.45}
          />
          <Line
            points={[[ W / 2, FY + 0.02, z], [ W / 2, CY - 0.02, z]]}
            color={INK_SOFT}
            lineWidth={1}
            transparent
            opacity={0.45}
          />
        </group>
      ))}

      {/* Vanishing-point backdrop — a sketchy "end of the corridor" */}
      <mesh position={[0, (FY + CY) / 2, end + 0.02]}>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial color={PAPER} />
      </mesh>
      <Line
        points={[
          [-W / 2, FY, end + 0.02],
          [ W / 2, FY, end + 0.02],
          [ W / 2, CY, end + 0.02],
          [-W / 2, CY, end + 0.02],
          [-W / 2, FY, end + 0.02],
        ]}
        color={INK}
        lineWidth={1.8}
      />
      {/* "to be continued" sketch on the far wall */}
      <Line
        points={[
          [-0.9, 0.6, end + 0.05],
          [-0.4, 0.7, end + 0.05],
          [ 0.2, 0.55, end + 0.05],
          [ 0.7, 0.7, end + 0.05],
        ]}
        color={INK}
        lineWidth={1.5}
      />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* CornerLine — a slightly wavy ink stroke for a hand-drawn feel      */
/* ------------------------------------------------------------------ */
function CornerLine({
  a, b, width = 2, color = INK,
}: {
  a: Tuple3;
  b: Tuple3;
  width?: number;
  color?: string;
}): ReactNode {
  // Subdivide and offset slightly for a pencil-line wobble
  const pts = useMemo(() => {
    const n = 24;
    const out: Tuple3[] = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const wobble = Math.sin(t * Math.PI * 8) * 0.012 + (Math.random() - 0.5) * 0.008;
      out.push([
        a[0] + (b[0] - a[0]) * t + (a[0] !== b[0] ? 0 : wobble),
        a[1] + (b[1] - a[1]) * t + wobble * 0.6,
        a[2] + (b[2] - a[2]) * t,
      ]);
    }
    return out;
  }, [a, b]);

  return <Line points={pts} color={color} lineWidth={width} />;
}
