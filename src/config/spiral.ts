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
  exitZone: number // extra scroll after the last piece, as a fraction of viewport height
  fogNear: number // view depth where pieces start fading into the paper
  fogFar: number // view depth where they are fully paper
  dpr: number // max device pixel ratio of the canvas
  camera: { fov: number; z: number } // fixed camera
}

const desktop: SpiralPreset = {
  radiusX: 3.6,
  radiusZ: 2.2,
  angleStep: deg(55),
  pitch: 1.9,
  scrollPerItem: 0.75,
  axisX: 1.2,
  baseScale: 0.78,
  activeScale: 1.2,
  visibleRange: 3.5,
  damping: 6,
  dragReturn: 0.6,
  exitZone: 0.6,
  fogNear: 10,
  fogFar: 17,
  dpr: 1.75,
  camera: { fov: 35, z: 10 },
}

const mobile: SpiralPreset = {
  radiusX: 1.15,
  radiusZ: 1.4,
  angleStep: deg(50),
  pitch: 2.3,
  scrollPerItem: 0.7,
  axisX: 0,
  baseScale: 0.6,
  activeScale: 0.9,
  visibleRange: 2.5,
  damping: 6,
  dragReturn: 0.6,
  exitZone: 0.6,
  fogNear: 11,
  fogFar: 17,
  dpr: 1.5,
  camera: { fov: 40, z: 11 },
}

export const spiralPresets = { desktop, mobile }

const MOBILE_MAX_ASPECT = 0.8 // width / height below this → mobile preset

export const pickPreset = (aspect: number): SpiralPreset =>
  aspect < MOBILE_MAX_ASPECT ? mobile : desktop

/** Progress up to which the hero is on screen; past it the active-piece panel takes its place. */
export const HERO_UNTIL = 0.35

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
  fadeFrom: 0.15, // |d| where the marks start fading; they are gone at 0.5, when the next piece takes over
  spread: 0.15, // extra scale of the corners while faded: they close in on the piece
}

/** Ambient sway of the whole helix: a slow oscillation, never a continuous rotation. */
export const AMBIENT_SWAY = { amplitude: 0.06, period: 10 } // rad, seconds

/** Lambda (THREE.MathUtils.damp) for live parameters easing toward the active preset. */
export const PRESET_LAMBDA = 4
