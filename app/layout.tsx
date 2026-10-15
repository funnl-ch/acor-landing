import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { OaiPageView } from "@/components/OaiPageView";
import { TrackingConsent } from "@/components/TrackingConsent";
import { AGENCY } from "@/lib/constants";

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
    "Décrivez votre bien en quelques minutes. Un courtier ACOR vous transmet l’estimation sous 48 heures ouvrables. Demande gratuite et sans engagement.",
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
        <OaiPageView />
        <a className="skip-link" href="#contenu">
          Aller au contenu
        </a>
        {children}
        <Footer />
        <TrackingConsent />
        <p className="sr-only">
          {AGENCY.name}, {AGENCY.street}, {AGENCY.zip} {AGENCY.city}
        </p>
        <Analytics />
      </body>
    </html>
  );
}
