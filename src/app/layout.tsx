import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, OG_IMAGE, KEYWORDS } from "@/lib/site";

const TITLE = `${SITE_NAME} | Global Courier, Freight & Logistics`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { telephone: false },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: { canonical: "/" },
};

const EXTENSION_ERROR_FILTER = `
  (function () {
    var extRe = /^(chrome|moz|ms-browser|safari|edge|brave|opera|vivaldi)-extension:/i;
    function isExtensionError(e) {
      if (!e) return false;
      var r = e.reason || e.error || e;
      var stack = String((r && (r.stack || r.message)) || r || '');
      var src = (e.target && e.target.src) || (e.srcElement && e.srcElement.src) || '';
      var filename = e.filename || '';
      var hay = stack + ' ' + src + ' ' + filename;
      return extRe.test(hay) || /failed to connect to metamask/i.test(hay);
    }
    function onRejection(e) {
      if (isExtensionError(e)) { e.preventDefault(); e.stopImmediatePropagation(); }
    }
    function onError(e) {
      if (isExtensionError(e)) { e.preventDefault(); e.stopImmediatePropagation(); }
    }
    window.addEventListener('unhandledrejection', onRejection, true);
    window.addEventListener('error', onError, true);
  })();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="antialiased" style={{ backgroundColor: '#F5F7FA' }}>
      <body style={{ backgroundColor: '#F5F7FA' }}>
        <Script id="suppress-extension-errors" strategy="beforeInteractive">
          {EXTENSION_ERROR_FILTER}
        </Script>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
            logo: `${SITE_URL}/favicon.svg`,
            description: SITE_DESCRIPTION,
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
            potentialAction: {
              "@type": "SearchAction",
              target: `${SITE_URL}/track?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
