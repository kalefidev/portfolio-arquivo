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

export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.hero.sub,
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
