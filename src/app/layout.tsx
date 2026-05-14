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
      "ViolationAlert — NYC Building Violation Monitor & Resolution Platform",
  },
  description:
    "Monitor DOB, HPD, ECB, FDNY, DSNY, DOT, LPC, DEP violations for all your NYC properties. Get instant alerts, AI-powered resolution guides, and connect with licensed contractors. Free for 3 properties.",
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
      "ViolationAlert — NYC Building Violation Monitor & Resolution Platform",
    description:
      "Monitor DOB, HPD, ECB violations for all your NYC properties. Instant alerts via email, SMS, or WhatsApp. Free for 3 properties.",
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
      "ViolationAlert — NYC Building Violation Monitor & Resolution Platform",
    description:
      "Monitor DOB, HPD, ECB violations for all your NYC properties. Instant alerts via email, SMS, or WhatsApp.",
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
