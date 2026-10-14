import type { Metadata, Viewport } from "next";
import { MotionProvider } from "@/components/motion";
import { SiteNav } from "@/components/nav";
import { fontVariables } from "./fonts";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: site.url,
  title: {
    default: `${site.name} · ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} · ${site.role}`,
    description: site.description,
  },
  // Previews stay out of search results until production is ready (flipped in M5).
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#EFEDE6",
  colorScheme: "light",
};

export default function RootLayout({ children, modal }: LayoutProps<"/">) {
  return (
    <html lang="en" id="top" className={fontVariables}>
      <body>
        <a
          href="#main"
          className="sr-only z-50 rounded-pill bg-ink px-5 py-3 text-paper focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3"
        >
          Skip to content
        </a>
        <MotionProvider>
          <SiteNav />
          <main id="main" tabIndex={-1} className="pt-16 outline-none lg:pt-20">
            {children}
          </main>
          {modal}
        </MotionProvider>
      </body>
    </html>
  );
}
