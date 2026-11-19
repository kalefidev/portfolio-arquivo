import { Shape } from 'three'

/** Rectangle centred on the origin, with quadratic corners of size `corner`. */
export function roundedRect(width: number, height: number, corner: number) {
  const x = width / 2
  const y = height / 2
  return new Shape()
    .moveTo(-x + corner, -y)
    .lineTo(x - corner, -y)
    .quadraticCurveTo(x, -y, x, -y + corner)
    .lineTo(x, y - corner)
    .quadraticCurveTo(x, y, x - corner, y)
    .lineTo(-x + corner, y)
    .quadraticCurveTo(-x, y, -x, y - corner)
    .lineTo(-x, -y + corner)
    .quadraticCurveTo(-x, -y, -x + corner, -y)
}
