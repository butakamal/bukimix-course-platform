import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Bukimix - 動画で学ぶ、スキルを磨く",
    template: "%s | Bukimix",
  },
  description: "体系的な動画講座で実践的なスキルを学べる無料プラットフォーム。",
  openGraph: {
    title: "Bukimix - 動画で学ぶ、スキルを磨く",
    description: "体系的な動画講座で実践的なスキルを学べる無料プラットフォーム。",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Suspense fallback={<div className="h-14 bg-[#1c1d1f]" />}>
          <Header />
        </Suspense>
        <div className="flex-1">{children}</div>
        <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
          <div className="flex items-center justify-center gap-4">
            <Link href="/terms" className="hover:underline">利用規約</Link>
            <Link href="/privacy" className="hover:underline">プライバシーポリシー</Link>
          </div>
          <p className="mt-2">© 2026 Bukimix</p>
        </footer>

        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
