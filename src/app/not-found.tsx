import type { Metadata } from 'next'
import SecondaryCta from '@/components/ui/SecondaryCta'
import Wordmark from '@/components/ui/Wordmark'
import { site } from '@/content/site'

const { title, label, h1, text, back } = site.notFound

export const metadata: Metadata = { title }

/** 404 — same paper, grid and type as the archive; one way out. */
export default function NotFound() {
  return (
    <div className="relative z-[var(--z-ui)] flex min-h-svh flex-col px-gutter">
      <header className="flex h-16 items-center">
        <Wordmark href="/" />
      </header>
      <main className="flex flex-1 flex-col items-start justify-center gap-6 pb-16">
        <p className="label text-ink-2">{label}</p>
        <h1 className="max-w-[14ch] text-display">{h1}</h1>
        <p className="max-w-[48ch] text-ink-2">{text}</p>
        <SecondaryCta href="/">{back}</SecondaryCta>
      </main>
    </div>
  )
}
