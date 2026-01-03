import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { BackToTop } from "@/components/navigation/BackToTop";

const fontDisplay = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fontBody = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Heinz Mwamachi",
    default: "Heinz Mwamachi | Brand & Digital Designer",
  },
  description: "Multidisciplinary designer creating sophisticated brand experiences and websites at the intersection of brand and digital design.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Heinz Mwamachi",
    title: "Heinz Mwamachi | Brand & Digital Designer",
    description: "Multidisciplinary designer creating sophisticated brand experiences and websites at the intersection of brand and digital design.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Heinz Mwamachi | Brand & Digital Designer",
    description: "Multidisciplinary designer creating sophisticated brand experiences and websites at the intersection of brand and digital design.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontBody.variable}`}>
      <body
        className="antialiased"
        suppressHydrationWarning
      >
        <SmoothScrollProvider>
          <CustomCursor />
          <BackToTop />
          <Navbar />
          {children}
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
