import { site } from '@/content/site'

/** `kaique calefi■` — the square in signal. Links to the top of the page (or home, from the 404). */
export default function Wordmark({ className = 'text-h3', href = '#topo' }: { className?: string; href?: string }) {
  return (
    <a href={href} className={`pointer-events-auto font-bold tracking-title ${className}`}>
      {site.wordmark}
      <span className="text-signal">■</span>
    </a>
  )
}
