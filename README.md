# Rohitangshu's Sketchbook

> An interactive hand-drawn portfolio. The viewer walks down a 3D notebook hallway and steps inside doorways that open into rooms of the creator's mind.

Built with **Next.js 15 (App Router) + React Three Fiber + Three.js + GSAP + Tailwind v4**, static-exportable, paper-grain aesthetic, monochrome with a single warm bronze accent.

> The previous editorial-serif portfolio lives in git history at commit [`8a8f8c1`](https://github.com/Rohitangshu2026/portfolio/commit/8a8f8c1) — recover with `git checkout 8a8f8c1 -- index.html` if you want it back.

---

## What's in this slice

A focused vertical slice of the larger sketchbook world:

- **A 3D hand-drawn hallway** with notebook-ruled walls, ink-line corners, and a faint paper-seam centre line down the floor.
- **Five sketched doorways** along the corridor — *About · Skills · Education · Projects · Contact* — alternating left and right with hand-written labels.
- **Scroll-driven camera** that walks you forward with a subtle bob and a head-turn as you pass each door.
- **All five rooms are wired up** — every doorway opens a GSAP zoom-in card with real hand-written content:
  - *About* — a note on the work, written in three short paragraphs.
  - *Skills* — five paper-bobbing category cards (Languages, Backend, Data & Storage, Systems, Tools).
  - *Education* — a two-entry vertical timeline with bronze dots, the MTech entry filled to mark "current".
  - *Projects* — all nine projects as a numbered editorial list with tech chips, descriptions, and GitHub links.
  - *Contact* — five tiles (Email, Phone, GitHub, LinkedIn, LeetCode) with hover state and a closing line in handwriting.
- **A guide orb** — a tiny sketchy companion that spring-follows the camera. Placeholder for the fully animated character.
- **Floating doodles** — paper planes, spirals, and kid-doodle stars drift in the corridor as parallax.
- **HUD** in handwritten Caveat — sketchbook seal, chapter indicator with progress beads, scroll hint, and a "Made by hand · Bangalore" tag.
- **Vintage paper grain** + **vignette** overlays for that sketchbook feel.
- **Cross-hatching post-process** — a custom `@react-three/postprocessing` Effect that runs over the final image: luminance-driven hatching at three stacked diagonals, Sobel-style edge detection drawing ink outlines, a 6 fps paper jitter for hand-drawn flicker, and chroma preservation so the bronze accents survive the mono treatment.
- **Static export friendly** (`output: 'export'`) so it can deploy to GitHub Pages or any CDN.

## What's still ahead

Honest list of what the slice does *not* yet do, ordered roughly by how much they'd raise the experience:

1. **The real animated guide character** — currently a placeholder orb. Needs a rigged sketchy doodle (paper child / pencil sprite) with idle, walk, point, surprise.
2. **Per-room scenography inside the 3D world** — every room is currently a 2D DOM overlay. The next leap is making each room a fully sketched 3D space the camera flies *into* (book-shelf for Skills, lecture hall for Education, gallery for Projects, mailbox alcove for Contact).
3. **Easter eggs** — tucked-away interactive doodles, a hidden door, an "underline this to reveal" mechanic.
4. **Ambient sound** — paper rustle on scroll, pencil scratch when a door label hovers, distant page-turn when entering a room.
5. **WASD + click-to-walk** as a secondary navigation alongside scroll.
6. **Mobile gestures** — pinch-zoom on rooms, swipe-up to see the chapter index.
7. **Performance polish** — InstancedMesh for the doodles, frustum culling for off-screen doorways, frameloop="demand" on idle.
8. **Shader depth-pass** — currently the hatching keys off luminance; sampling the depth buffer would let far surfaces darken automatically for atmospheric perspective.

---

## Run it locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

Production build (static):

```bash
npm run build
# output goes to ./out — ready to deploy
```

### Deploying to GitHub Pages

The repo is `Rohitangshu2026/portfolio`, so GitHub Pages would serve it at `https://rohitangshu2026.github.io/portfolio/`. Set the basePath when building:

```bash
NEXT_PUBLIC_BASE_PATH=/portfolio npm run build
```

Then push the contents of `out/` to the `gh-pages` branch. (A workflow that does this on every push to `main` would be a nice next step.)

---

## Structure

```
app/
  layout.tsx        Root layout — loads Caveat + Inter, sets body theme
  page.tsx          Mounts the world + paper overlays + HUD
  globals.css       Tailwind v4 theme tokens, paper grain + vignette CSS

components/
  SketchbookWorld.tsx   The <Canvas>, ScrollControls, camera glide, room dispatch
  Hallway.tsx           Floor / walls / ceiling, ruling lines, page-break ticks
  Doorway.tsx           Hand-drawn door rectangle + label + hover/click
  FloatingDoodle.tsx    Paper plane / spiral / star variants
  GuideOrb.tsx          The tiny spring-following companion (placeholder)
  HUD.tsx               Sketchbook seal, chapter indicator, scroll hint
  PaperOverlay.tsx      Two DOM layers — grain + vignette
  RoomOverlay.tsx       GSAP-driven card that appears when you enter a door
  SketchEffect.tsx      Custom post-process: hatching + edges + accent preserve

next.config.mjs   output:'export', basePath via env, three transpile flags
tsconfig.json     Strict TS, "@/*" path alias
postcss.config.mjs Tailwind v4 PostCSS
package.json
```

---

## Design tokens

The whole world keys off six colours and two fonts, defined once in `app/globals.css` via Tailwind v4's `@theme` block:

```
paper        #f5f1ea  — the page
paper-light  #fbf7f0  — surfaces, cards
paper-edge   #e7ddc8  — folds, shadows
ink          #1a1614  — strokes, text
ink-soft     #6a615a  — secondary text, faint lines
bronze       #8b5e34  — single accent (hover, signal pings, signature)

font-display Caveat   — every handwritten word
font-body    Inter    — body copy where readability matters
```

If you want to change the whole feel of the world, change those values.

---

## Notes on the move from the editorial portfolio

The previous incarnation of this repo was a single-file editorial-serif site (warm cream, Instrument Serif headings, tobacco-bronze accent, editorial project list, a dynamic time-of-day palette). The aesthetic carried over here — same palette, same warmth — but the **format** is now an immersive 3D scene instead of a scrollable single-page document.

If you ever want to restore the editorial version, it's a single `git checkout` away:

```bash
git checkout 8a8f8c1 -- index.html
```

…and you've got the previous portfolio back as a static `index.html`.
