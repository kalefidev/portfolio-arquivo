import type { MetadataRoute } from 'next'
import { site } from '@/content/site'

export const dynamic = 'force-static' // keeps `output: 'export'` possible

/** One page: everything lives on the home (the pieces open over it, `#peca-<slug>`). */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `https://${site.domain}/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 }]
}
