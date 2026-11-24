import { ImageResponse } from 'next/og'

// PNG twin of icon.svg (browsers that skip SVG favicons, and the touch icon). Static, built once.
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <rect x="2" y="2" width="28" height="28" fill="#FF4D1A" />
        <path d="M11 7v18M12 18.5 21.5 8M15.5 15.5 23 25" fill="none" stroke="#fff" strokeWidth="4.4" />
      </svg>
    ),
    size,
  )
}
