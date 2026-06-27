import type { Metadata } from "next";
import localFont from "next/font/local";
import { Amiri } from "next/font/google";
import "./globals.css";

const urbanist = localFont({
  src: [
    { path: "../font/Urbanist/static/Urbanist-Light.ttf", weight: "300", style: "normal" },
    { path: "../font/Urbanist/static/Urbanist-Regular.ttf", weight: "400", style: "normal" },
    { path: "../font/Urbanist/static/Urbanist-Medium.ttf", weight: "500", style: "normal" },
    { path: "../font/Urbanist/static/Urbanist-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../font/Urbanist/static/Urbanist-Bold.ttf", weight: "700", style: "normal" },
    { path: "../font/Urbanist/static/Urbanist-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "../font/Urbanist/static/Urbanist-Italic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--next-font-urbanist",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--next-font-amiri",
});

const cairo = localFont({
  src: [
    { path: "../font/Cairo/static/Cairo-Light.ttf", weight: "300", style: "normal" },
    { path: "../font/Cairo/static/Cairo-Regular.ttf", weight: "400", style: "normal" },
    { path: "../font/Cairo/static/Cairo-Medium.ttf", weight: "500", style: "normal" },
    { path: "../font/Cairo/static/Cairo-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../font/Cairo/static/Cairo-Bold.ttf", weight: "700", style: "normal" },
    { path: "../font/Cairo/static/Cairo-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "../font/Cairo/static/Cairo-Black.ttf", weight: "900", style: "normal" },
  ],
  variable: "--next-font-cairo",
});

export const metadata: Metadata = {
  title: "Araby — Your Islamic Companion",
  description:
    "Know your next Salah before it arrives. Read the Quran in 40+ editions. Live by the Hijri calendar. Discover a new name of Allah every day.",
  keywords: [
    "Islamic app",
    "Prayer times",
    "Quran",
    "Hijri calendar",
    "Asma Al Husna",
    "Muslim",
    "Salah",
  ],
  authors: [{ name: "Araby" }],
  openGraph: {
    title: "Araby — Your Islamic Companion",
    description: "Everything your faith needs, in one place.",
    type: "website",
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
      className={`${urbanist.variable} ${cairo.variable} ${amiri.variable} antialiased`}
    >
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
