import { site } from '../content/site'

/** False while the number in site.ts is still a TODO. */
export const whatsappReady = () => /^\d{10,}$/.test(site.whatsapp)

/** wa.me link, optionally with a pre-filled message. While the number is not set, it points to
 *  the contact section instead of a broken link. */
export const whatsappUrl = (message?: string) =>
  whatsappReady() ? `https://wa.me/${site.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}` : '#contato'

/** The message of the contact form, from `site.contact.dialog.template`. */
export const contactMessage = ({ name, type, message }: { name: string; type: string; message: string }) =>
  // function replacers: a "$&" typed by the visitor must not be read as a replacement pattern
  site.contact.dialog.template
    .replace('{nome}', () => name.trim())
    .replace('{tipo}', () => type)
    .replace('{mensagem}', () => message.trim())
