import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Dancing_Script,
  Geist,
  Geist_Mono,
} from "next/font/google";

import ThemeRegistry from "@/providers/ThemeRegistry";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const scriptFont = Dancing_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Interiano Bloom Studio",
    template: "%s | Interiano Bloom Studio",
  },
  description:
    "Arreglos florales personalizados para cualquier ocasión.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${displayFont.variable}
          ${scriptFont.variable}
        `}
      >
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}