import localFont from "next/font/local";

/**
 * Self-hosted fonts (SIL OFL, see src/fonts/licenses).
 * Vendored as Latin-subset woff2 so builds never depend on a font CDN.
 */

export const anton = localFont({
  src: "../fonts/anton-latin.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-anton",
  adjustFontFallback: "Arial",
  preload: true,
});

export const instrumentSerif = localFont({
  src: [
    { path: "../fonts/instrument-serif-latin.woff2", weight: "400", style: "normal" },
    { path: "../fonts/instrument-serif-latin-italic.woff2", weight: "400", style: "italic" },
  ],
  display: "swap",
  variable: "--font-instrument-serif",
  adjustFontFallback: "Times New Roman",
  preload: false,
});

export const schibstedGrotesk = localFont({
  src: "../fonts/schibsted-grotesk-latin-var.woff2",
  weight: "400 900",
  style: "normal",
  display: "swap",
  variable: "--font-schibsted",
  adjustFontFallback: "Arial",
  preload: true,
});

export const jetbrainsMono = localFont({
  src: "../fonts/jetbrains-mono-latin-var.woff2",
  weight: "100 800",
  style: "normal",
  display: "swap",
  variable: "--font-jetbrains",
  adjustFontFallback: false,
  preload: false,
});

export const fontVariables = [
  anton.variable,
  instrumentSerif.variable,
  schibstedGrotesk.variable,
  jetbrainsMono.variable,
].join(" ");
