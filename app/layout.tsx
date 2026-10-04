import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { OaiPageView } from "@/components/OaiPageView";
import { AGENCY } from "@/lib/constants";
import { OAI_PIXEL_ID } from "@/lib/oai-hash";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://acor-landing.vercel.app"),
  title: "Combien vaut votre bien en Valais\u00A0? | ACOR Immobilier",
  description:
    "Un courtier ACOR se déplace et vous remet une estimation écrite, gratuite et sans engagement. Agence à Sion, Valais.",
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <Script id="openai-pixel" strategy="beforeInteractive">
          {`!function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");oaiq("init",${JSON.stringify({ pixelId: OAI_PIXEL_ID, ...(process.env.NODE_ENV !== "production" ? { debug: true } : {}) })});`}
        </Script>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","ysn6d1qrfs");`}
        </Script>
        <OaiPageView />
        <a className="skip-link" href="#contenu">
          Aller au contenu
        </a>
        {children}
        <Footer />
        <p className="sr-only">
          {AGENCY.name}, {AGENCY.street}, {AGENCY.zip} {AGENCY.city}
        </p>
        <Analytics />
      </body>
    </html>
  );
}
