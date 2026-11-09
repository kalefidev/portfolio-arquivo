'use client'

import dynamic from 'next/dynamic'

// `ssr: false` is only allowed inside a Client Component (Next 16).
export default dynamic(() => import('./Scene'), { ssr: false })
