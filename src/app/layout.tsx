import ReactQueryProvider from "@/providers/react-query-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Potti Kadai",
  description:
    "PottiKadai is your favorite street-side shop reimagined for the digital world. Inspired by the warmth and hustle of local potti kadais, this modern eCommerce platform brings you trending, affordable fashion with a desi twist. From everyday essentials to festival fits, discover handpicked clothing for men, women, and kids — all delivered to your doorstep.",
  keywords: [
    "Potti Kadai",
    "potti kadai online shopping",
    "affordable fashion India",
    "desi fashion",
    "budget clothing",
    "trending clothes",
    "festival outfits",
    "menswear",
    "womenswear",
    "kids clothing",
    "street style India",
    "ethnic wear",
    "casual wear",
    "online clothing store India",
    "cheap fashion online",
  ],
  icons: {
    icon: [
      { url: "/images/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/images/apple-touch-icon.png",
  },
  manifest: "/images/site.webmanifest",
  openGraph: {
    title: "Potti Kadai",
    description:
      "Shop trending and affordable fashion for men, women, and kids. Inspired by your favorite local street-side potti kadais.",
    url: "https://potti-kadai.vercel.app",
    siteName: "Potti Kadai",
    images: [
      {
        url: "/images/og/potti-kadai-og.png", // Path to your generated OG image
        width: 1200,
        height: 630,
        alt: "Potti Kadai Online Shopping for Clothing & Footwear",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider> {children}</ReactQueryProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
