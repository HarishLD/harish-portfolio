import type { Metadata, Viewport } from "next";
import { MotionProvider } from "@/components/motion";
import { SiteNav } from "@/components/nav";
import { fontVariables } from "./fonts";
import { indexable, site } from "@/lib/site";
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
    url: "/",
    siteName: site.name,
    title: `${site.name} · ${site.role}`,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  // Only the production deployment is indexed; previews and local builds stay out.
  robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
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
