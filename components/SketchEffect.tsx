"use client";

import { Effect } from "postprocessing";
import { forwardRef, useMemo } from "react";
import { Color, Uniform, Vector2 } from "three";
import { useFrame, useThree } from "@react-three/fiber";

/* ==================================================================
 * SketchEffect — a single post-process pass that unifies the look.
 *
 *   1. Luminance-driven cross-hatching   (3 stacked angle layers)
 *   2. Sobel-style edge detection         (ink outline on every edge)
 *   3. Per-frame paper jitter              (hand-drawn flicker)
 *   4. Accent preservation                 (anything chromatic stays)
 *
 * The shader treats the cream colour as "blank paper" and the dark
 * colour as "ink", and reasons about everything in between as varying
 * pencil pressure. Tunable via the uniforms below.
 * ================================================================== */

const fragmentShader = /* glsl */ `
  uniform vec3  uPaperColor;
  uniform vec3  uInkColor;
  uniform float uHatchFreq;
  uniform float uHatchIntensity;
  uniform float uEdgeStrength;
  uniform float uChromaPreserve;
  uniform vec2  uResolution;
  uniform float uTime;

  float luma(vec3 c) {
    return dot(c, vec3(0.299, 0.587, 0.114));
  }

  /* 6 fps temporal jitter on the hatch — gives a stop-motion pencil feel */
  vec2 paperJitter(vec2 p) {
    float t = floor(uTime * 6.0);
    return p + vec2(
      sin(t * 12.9898 + p.y * 0.31) * 1.3,
      cos(t * 78.2330 + p.x * 0.27) * 1.3
    );
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    float lum = luma(inputColor.rgb);

    /* --- 1. Chroma detect (preserve accents like bronze) --- */
    float maxC = max(max(inputColor.r, inputColor.g), inputColor.b);
    float minC = min(min(inputColor.r, inputColor.g), inputColor.b);
    float chroma = maxC - minC;

    /* --- 2. Cross-hatching: three diagonal layers stacked by darkness --- */
    vec2 px = paperJitter(uv * uResolution);

    float h1 = sin((px.x + px.y) * uHatchFreq);
    float h2 = sin((px.x - px.y) * uHatchFreq);
    float h3 = sin((px.x * 0.5 + px.y) * uHatchFreq * 1.18);

    float hatch = 1.0;
    hatch *= mix(1.0, smoothstep(-0.7, 0.45, h1), smoothstep(0.88, 0.62, lum));
    hatch *= mix(1.0, smoothstep(-0.7, 0.45, h2), smoothstep(0.58, 0.32, lum));
    hatch *= mix(1.0, smoothstep(-0.7, 0.45, h3), smoothstep(0.28, 0.08, lum));

    /* --- 3. Edge detection: cross-shaped luminance gradient --- */
    vec2 texel = 1.0 / uResolution;
    float lL = luma(texture2D(inputBuffer, uv - vec2(texel.x, 0.0)).rgb);
    float lR = luma(texture2D(inputBuffer, uv + vec2(texel.x, 0.0)).rgb);
    float lT = luma(texture2D(inputBuffer, uv + vec2(0.0, texel.y)).rgb);
    float lB = luma(texture2D(inputBuffer, uv - vec2(0.0, texel.y)).rgb);
    float edge = abs(lL - lR) + abs(lT - lB);
    float edgeMask = smoothstep(0.03, 0.18, edge) * uEdgeStrength;

    /* --- 4. Compose: paper tone, hatched darks, ink edges --- */
    vec3 paperPart = mix(uPaperColor * 0.95, uPaperColor, lum);
    vec3 hatched   = mix(uInkColor, paperPart, mix(1.0, hatch, uHatchIntensity));
    vec3 withEdges = mix(hatched, uInkColor, edgeMask);

    /* --- 5. Lift accents through the mono treatment --- */
    float accentMask = smoothstep(0.06, 0.22, chroma) * uChromaPreserve;
    vec3 result = mix(withEdges, inputColor.rgb, accentMask);

    outputColor = vec4(result, inputColor.a);
  }
`;

class SketchEffectImpl extends Effect {
  constructor() {
    super("SketchEffect", fragmentShader, {
      uniforms: new Map<string, Uniform<unknown>>([
        ["uPaperColor",    new Uniform(new Color("#f5f1ea"))],
        ["uInkColor",      new Uniform(new Color("#1a1614"))],
        ["uHatchFreq",     new Uniform(0.55)],
        ["uHatchIntensity",new Uniform(0.42)],
        ["uEdgeStrength",  new Uniform(0.80)],
        ["uChromaPreserve",new Uniform(1.00)],
        ["uResolution",    new Uniform(new Vector2(1, 1))],
        ["uTime",          new Uniform(0)],
      ]),
    });
  }
}

/* ------------------------------------------------------------------ */
/* React wrapper                                                      */
/* ------------------------------------------------------------------ */
export const SketchEffect = forwardRef<SketchEffectImpl>((_props, ref) => {
  const effect = useMemo(() => new SketchEffectImpl(), []);
  const { size } = useThree();

  useFrame((_state, delta) => {
    const res = effect.uniforms.get("uResolution")!.value as Vector2;
    res.set(size.width, size.height);
    const time = effect.uniforms.get("uTime")!;
    (time as Uniform<number>).value += delta;
  });

  return <primitive ref={ref} object={effect} dispose={null} />;
});

SketchEffect.displayName = "SketchEffect";
