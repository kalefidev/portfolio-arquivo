'use client'

import { useState } from 'react'
import PrimaryCta from '@/components/ui/PrimaryCta'
import SectionHead from '@/components/ui/SectionHead'
import { site } from '@/content/site'
import ContactDialog from './ContactDialog'

const { eyebrow, h2, sub, ctas } = site.contact

/** `#contato`: title, the WhatsApp CTA (opens the form dialog) and the e-mail, always visible. */
export default function Contact() {
  const [open, setOpen] = useState(false)

  return (
    <section id="contato" className="scroll-mt-16 px-gutter py-section">
      <SectionHead eyebrow={eyebrow} title={h2} sub={sub} />

      <div data-reveal="stagger" className="mt-12 flex flex-col items-start gap-8 md:flex-row md:items-center md:gap-12">
        <PrimaryCta onClick={() => setOpen(true)}>{ctas.whatsapp}</PrimaryCta>
        <p className="label flex flex-col gap-1 text-ink-2">
          {ctas.email}
          <a
            href={`mailto:${site.email}`}
            className="text-body font-normal tracking-normal text-ink normal-case underline decoration-line underline-offset-4 transition-colors duration-(--duration-micro) hover:decoration-ink"
          >
            {site.email}
          </a>
        </p>
      </div>

      <ContactDialog open={open} onClose={() => setOpen(false)} />
    </section>
  )
}
