import { notFound } from 'next/navigation'
import LabLoader from '@/three/lab/LabLoader'

export const metadata = { title: 'Laboratório de objetos' }

// Dev tool: only served by `next dev`, or by a build made with NEXT_PUBLIC_LAB=1.
export default function LabPage() {
  if (process.env.NODE_ENV !== 'development' && process.env.NEXT_PUBLIC_LAB !== '1') notFound()
  return <LabLoader />
}
