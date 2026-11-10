import { site } from '@/content/site'

/** wa.me link, optionally with a pre-filled message. While the number in site.ts is still a
 *  TODO, it points to the contact section instead of a broken link. */
export const whatsappUrl = (message?: string) =>
  /^\d{10,}$/.test(site.whatsapp)
    ? `https://wa.me/${site.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}`
    : '#contato'
