// Spiral parameters — DESIGN.md §4. The only place to tune the spiral (calibrate in /?debug).

const deg = (d: number) => (d * Math.PI) / 180

export interface SpiralPreset {
  radiusX: number // horizontal half-width of the helix (world units)
  radiusZ: number // depth of the helix: pieces behind the active one go back by this much
  angleStep: number // rad of turn per piece
  pitch: number // vertical distance per piece (world units)
  scrollPerItem: number // scroll distance per piece, as a fraction of viewport height
  axisX: number // x of the helix axis (world units)
  baseScale: number // scale of a piece away from focus
  activeScale: number // scale of the active piece
  visibleRange: number // |d| (in pieces) beyond which a piece is hidden
  damping: number // lambda for THREE.MathUtils.damp on the progress the pieces follow
  dragReturn: number // how fast the drag rotation returns to 0 (unused on mobile: drag off)
  heroZone: number // scroll before the spiral starts turning (hero → panel of piece 01), as a fraction of viewport height
  exitZone: number // extra scroll after the last piece, as a fraction of viewport height
  fogNear: number // view depth where pieces start fading into the paper
  fogFar: number // view depth where they are fully paper
  dpr: number // max device pixel ratio of the canvas
  stageX: number // where the open piece goes (focus mode): fraction of the screen width, from the left
  stageY: number // …and of the screen height, from the top
  stageScale: number // scale of the piece on the stage
  camera: { fov: number; z: number } // fixed camera
}

const desktop: SpiralPreset = {
  radiusX: 3.6,
  radiusZ: 2.2,
  angleStep: deg(55),
  pitch: 1.9,
  scrollPerItem: 0.6,
  axisX: 1.2,
  baseScale: 0.78,
  activeScale: 1.2,
  visibleRange: 3.5,
  damping: 6,
  dragReturn: 0.6,
  heroZone: 0.15,
  exitZone: 0.3,
  fogNear: 10,
  fogFar: 17,
  dpr: 1.75,
  stageX: 0.28, // middle of what the 44vw overlay leaves free
  stageY: 0.5,
  stageScale: 1.7,
  camera: { fov: 35, z: 10 },
}

const mobile: SpiralPreset = {
  radiusX: 1.15,
  radiusZ: 1.4,
  angleStep: deg(50),
  pitch: 2.3,
  scrollPerItem: 0.6,
  axisX: 0,
  baseScale: 0.6,
  activeScale: 0.9,
  visibleRange: 2.5,
  damping: 6,
  dragReturn: 0.6,
  heroZone: 0.15,
  exitZone: 0.3,
  fogNear: 11,
  fogFar: 17,
  dpr: 1.5,
  stageX: 0.5,
  stageY: 0.19, // middle of what the bottom sheet leaves free (a little high: the "arraste" hint sits at the bottom of the stage)
  stageScale: 1.0,
  camera: { fov: 40, z: 11 },
}

export const spiralPresets = { desktop, mobile }

const MOBILE_MAX_ASPECT = 0.8 // width / height below this → mobile preset

export const pickPreset = (aspect: number): SpiralPreset =>
  aspect < MOBILE_MAX_ASPECT ? mobile : desktop

/** Fraction of the hero zone after which the hero gives way to the active-piece panel. Piece 01
 *  is still centred then: its panel gets the rest of the zone plus its own half step. */
export const HERO_UNTIL = 0.4

/** heroProgress where the hero starts to leave (opacity + lift follow the scroll up to `HERO_UNTIL`). */
export const HERO_FADE_FROM = 0.15

/** Label of each piece (DESIGN.md §3). */
export const CALLOUT = {
  anchor: 0.62, // local x / y where the leader line starts: just off the object, up and to the side
  fadeFrom: 1, // |d| where the label starts fading…
  hideAt: 2, // …and where it is gone
  flipAt: 0.45, // side of the helix (sin θ) past which the label goes to the bottom left, away from the right edge
  flipFade: 0.15, // the label fades out around the flip instead of jumping
}

/** Registration marks + ring around the active piece (DESIGN.md §3). Local units: a piece fits a sphere of radius 1. */
export const FOCUS_MARKS = {
  half: 1.12, // half-side of the square the four corners sit on
  arm: 0.2, // length of each corner stroke
  lineWidth: 1.5, // px
  ringRadius: 0.85,
  ringY: -1.08,
  ringSegments: 64,
  ringWidth: 1, // px
  fadeFrom: 0.15, // |d| where the marks start fading; they are gone at 0.5, when the next piece takes over
  spread: 0.15, // extra scale of the corners while faded: they close in on the piece
}

/** Dashed axis with a ruler tick per piece + dotted rail of the helix (DESIGN.md §4 › Desenho). */
export const AXIS = {
  opacity: 0.3,
  halfSpan: 8, // pitches drawn above and below the active piece (covers the view in any preset)
  dashesPerPitch: 8,
  tick: 0.18, // world units
  railOpacity: 0.18,
  railDotsPerPiece: 36,
  railGap: 0.3, // fraction of a step left empty on each side of a piece: the rail never crosses an object
  railDot: 2, // px
}

/** Focus mode (a piece open in the overlay): the piece travels to the stage, the others sink into the fog. */
export const FOCUS_MODE = {
  recede: 8, // world units the other pieces go back: past `fogFar`, so they are paper
  lambda: 9, // damping of the trip to the stage and back (applied twice in series: slower than one pass of the same value)
}

/** Mouse drag: on empty space it turns the helix, on a piece it turns the piece. */
export const DRAG = {
  spiral: 0.002, // rad per px — the piece in front follows the pointer about 1:1
  object: 0.01, // rad per px
  friction: 3, // 1/s — how fast the spin left by a throw dies out
  maxTilt: 1.2, // rad — a piece never tips further than this toward or away from the camera
  stillMs: 80, // pointer held still this long before release: no throw
  clickSlop: 5, // px — the pointer moved less than this between down and up: a click, not a drag
  resetLambda: 6, // damping of "Resetar posições"
}

/** Settling on the nearest piece once the scroll stops (DESIGN.md §7). Mouse / trackpad only: on touch
 *  a programmatic glide would fight the finger. Off with prefers-reduced-motion. */
export const SNAP = {
  idleMs: 150, // the page has been still this long (Lenis' own glide included) before it settles
  tolerance: 0.02, // |progress − nearest piece| under this is already settled
}

/** Lambda that replaces `damping` and `FOCUS_MODE.lambda` with prefers-reduced-motion: things
 *  land almost at once instead of gliding (DESIGN.md §7). */
export const REDUCED_DAMPING = 30

/** Ambient sway of the whole helix: a slow oscillation, never a continuous rotation. */
export const AMBIENT_SWAY = { amplitude: 0.06, period: 10 } // rad, seconds

/** Lambda (THREE.MathUtils.damp) for live parameters easing toward the active preset. */
export const PRESET_LAMBDA = 4

/** Exit of the spiral through the exit zone (DESIGN.md §7). `exit` = exitProgress, 0 … 1. */
export const EXIT = {
  stagger: 0.5, // share of the exit the pieces are spread over: the highest one leaves first, the active one last
  vanishFrom: 0.4, // a piece's own exit progress where it starts to shrink away (never by opacity: shared materials)
  lieFrom: 0.3, // exit progress where the axis starts to lie down
  uiOut: 0.5, // exit progress from which the spiral UI is gone (discrete: `pastSpiral` in the store)
  restY: 0.5, // fraction of the screen height where the lying axis waits for the line of the next section
  handoff: 0.08, // fraction of the screen height over which the 3D line hands over to the HTML one
  lineId: 'linha', // id of the HTML line (Reach)
}
