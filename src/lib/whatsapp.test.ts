import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { site } from '../content/site'
import { contactMessage, whatsappReady, whatsappUrl } from './whatsapp'

const FAKE = '5561999990000' // not a real number: swapped in only inside the test
const original = site.whatsapp
beforeEach(() => {
  site.whatsapp = FAKE
})
afterEach(() => {
  site.whatsapp = original
})

describe('whatsapp', () => {
  const input = { name: ' Ana ', type: 'Automação', message: 'Preciso de um bot & mais $& 100%' }

  it('fills the template', () => {
    expect(contactMessage(input)).toBe('Olá, Kaique! Sou Ana. Assunto: Automação.\n\nPreciso de um bot & mais $& 100%')
  })

  it('builds the wa.me link with the message encoded', () => {
    const message = contactMessage(input)
    const url = whatsappUrl(message)
    expect(url).toBe(`https://wa.me/${FAKE}?text=${encodeURIComponent(message)}`)
    expect(new URL(url).searchParams.get('text')).toBe(message)
    expect(whatsappUrl()).toBe(`https://wa.me/${FAKE}`)
  })

  it('points to #contato while the number is a TODO', () => {
    site.whatsapp = 'TODO: WhatsApp'
    expect(whatsappReady()).toBe(false)
    expect(whatsappUrl('oi')).toBe('#contato')
  })
})
