import { ImageResponse } from 'next/og'

// Touch icon for the home screen (icon.svg scaled up). Static, built once.
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <svg width="180" height="180" viewBox="0 0 32 32">
        <rect x="2" y="2" width="28" height="28" fill="#FF4D1A" />
        <path d="M11 7v18M12 18.5 21.5 8M15.5 15.5 23 25" fill="none" stroke="#fff" strokeWidth="4.4" />
      </svg>
    ),
    size,
  )
}
