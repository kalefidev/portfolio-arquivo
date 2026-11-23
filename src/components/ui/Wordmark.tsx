import { site } from '@/content/site'

/** `kaique calefi■` — the square in signal. Links to the top of the page. */
export default function Wordmark({ className = 'text-h3' }: { className?: string }) {
  return (
    <a href="#topo" className={`pointer-events-auto font-bold tracking-title ${className}`}>
      {site.wordmark}
      <span className="text-signal">■</span>
    </a>
  )
}
