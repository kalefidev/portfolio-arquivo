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
  damping: number // lambda for THREE.MathUtils.damp on position/scale
  dragReturn: number // how fast the drag rotation returns to 0 (unused on mobile: drag off)
  exitZone: number // extra scroll after the last piece, as a fraction of viewport height
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
  camera: { fov: 40, z: 11 },
}

export const spiralPresets = { desktop, mobile }

const MOBILE_MAX_ASPECT = 0.8 // width / height below this → mobile preset

export const pickPreset = (aspect: number): SpiralPreset =>
  aspect < MOBILE_MAX_ASPECT ? mobile : desktop
