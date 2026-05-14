import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastProvider } from "@/components/toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://violationalert.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#dc2626",
};

export const metadata: Metadata = {
  title: {
    template: "%s | ViolationAlert",
    default:
      "ViolationAlert — Your Buildings, Protected",
  },
  description:
    "Every NYC agency that can fine your building, watched around the clock. Instant alerts, step-by-step resolution guides, and contractor matching. Free for 3 properties, forever.",
  keywords: [
    "NYC violation monitoring",
    "building violation alerts",
    "DOB violation checker",
    "HPD violation lookup",
    "ECB penalties",
    "property violation tracker",
    "NYC building violations",
    "DOB violations NYC",
    "HPD violations NYC",
    "landlord violation alerts",
    "property management NYC",
  ],
  authors: [{ name: "ViolationAlert" }],
  creator: "ViolationAlert",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "ViolationAlert",
    title:
      "ViolationAlert — Your Buildings, Protected",
    description:
      "Ten NYC agencies, one dashboard. Violation alerts, resolution guides, and contractor matching. Free for 3 properties.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ViolationAlert — NYC Building Violation Monitor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "ViolationAlert — Your Buildings, Protected",
    description:
      "Ten NYC agencies, one dashboard. Alerts, resolution guides, and contractors. Free for 3 properties.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
