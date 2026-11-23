import Wordmark from '@/components/ui/Wordmark'
import { site } from '@/content/site'

const { copyright, backToTop } = site.footer

/** End of the page: big wordmark, e-mail, © and back to the top. */
export default function Footer() {
  return (
    <footer className="border-t border-line px-gutter pt-16 pb-8">
      <Wordmark className="block text-[clamp(2.5rem,9vw,8rem)] leading-none" />

      <div className="label mt-16 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 text-ink-2">
        <a href={`mailto:${site.email}`} className="transition-colors duration-(--duration-micro) hover:text-ink">
          {site.email}
        </a>
        <p>{copyright}</p>
        <a href="#topo" className="transition-colors duration-(--duration-micro) hover:text-ink">
          {backToTop}
        </a>
      </div>
    </footer>
  )
}
