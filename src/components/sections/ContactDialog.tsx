'use client'

import { useEffect, useRef } from 'react'
import PrimaryCta from '@/components/ui/PrimaryCta'
import { site } from '@/content/site'
import { getLenis } from '@/lib/scroll'
import { contactMessage, whatsappReady, whatsappUrl } from '@/lib/whatsapp'

const { title, fields, types, submit, close, notReady } = site.contact.dialog

const field =
  'mt-2 block w-full border border-line bg-paper px-3 py-2 text-ink placeholder:text-ink-2 focus-visible:border-ink'

/** Contact form in a modal <dialog> (the browser gives the focus trap and Esc). No backend: sending
 *  opens wa.me with the message built from the fields. While the number in site.ts is a TODO the
 *  send button is off and says why. Lenis stops while it is open; looks: `dialog.contact` in globals.css. */
export default function ContactDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const ready = whatsappReady()

  useEffect(() => {
    if (!open) return
    const element = dialog.current!
    element.showModal()
    element.focus() // the dialog itself (its title is read), not "Fechar" with a ring every time it opens
    getLenis()?.stop() // without Lenis (reduced motion) the lock is CSS: `html:has(dialog.contact[open])`
    return () => {
      element.close()
      getLenis()?.start()
    }
  }, [open])

  return (
    <dialog
      ref={dialog}
      aria-labelledby="contact-title"
      tabIndex={-1}
      className="contact"
      data-lenis-prevent
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialog.current?.close() // the click on the backdrop
      }}
    >
      <form
        className="flex flex-col gap-6 p-6"
        onSubmit={(event) => {
          event.preventDefault()
          if (!ready) return
          const data = new FormData(event.currentTarget)
          const message = contactMessage({
            name: String(data.get('name')),
            type: String(data.get('type')),
            message: String(data.get('message')),
          })
          window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer')
          dialog.current?.close()
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="contact-title" className="text-h3">
            {title}
          </h2>
          <button
            type="button"
            className="label -mt-1 -mr-2 flex h-10 shrink-0 items-center gap-3 px-3 transition-[color,background-color,scale] duration-(--duration-micro) hover:bg-paper active:scale-[0.97] active:bg-paper"
            onClick={() => dialog.current?.close()}
          >
            {close}
            <kbd aria-hidden className="border border-line px-1.5 py-0.5 font-mono text-ink-2 pointer-coarse:hidden">
              Esc
            </kbd>
          </button>
        </div>

        <label className="label block">
          {fields.name}
          <input name="name" required autoComplete="name" className={`${field} text-body normal-case tracking-normal`} />
        </label>

        <fieldset className="min-w-0">
          <legend className="label">{fields.type}</legend>
          <div className="mt-2 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
            {types.map((type, index) => (
              <label
                key={type}
                className="label flex h-10 cursor-pointer items-center justify-center bg-paper-2 transition-colors duration-(--duration-micro) hover:bg-paper active:bg-paper has-checked:bg-ink has-checked:text-paper has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink"
              >
                <input type="radio" name="type" value={type} defaultChecked={index === 0} className="sr-only" />
                {type}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="label block">
          {fields.message}
          <textarea
            name="message"
            required
            rows={4}
            className={`${field} resize-y text-body normal-case tracking-normal`}
          />
        </label>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <PrimaryCta type="submit" disabled={!ready}>
            {submit}
          </PrimaryCta>
          {!ready && (
            <p role="status" className="label text-ink-2">
              {notReady}
            </p>
          )}
        </div>
      </form>
    </dialog>
  )
}
