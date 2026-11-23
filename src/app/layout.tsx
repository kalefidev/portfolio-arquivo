import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import Grain from "@/components/layout/Grain";
import SmoothScroll from "@/components/layout/SmoothScroll";
import { site } from "@/content/site";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Absolute URLs (canonical, Open Graph image) resolve against the domain in site.ts.
// The canonical itself lives in page.tsx: the 404 must not claim to be the home page.
export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: { default: site.seo.title, template: `%s — ${site.name}` },
  description: site.seo.description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    title: site.seo.title,
    description: site.seo.description,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>
        <SmoothScroll />
        <Grain />
        {children}
      </body>
    </html>
  );
}
