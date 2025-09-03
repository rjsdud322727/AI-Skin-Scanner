import type { Metadata, Viewport } from "next";
import "./globals.css";
import ThemeInitializer from '@/components/ThemeInitializer';

export const metadata: Metadata = {
  title: "Skancer - AI 피부 진단 서비스",
  description: "AI 기술로 피부 상태를 분석하고 전문의 진료 예약까지 도와드리는 스마트 헬스케어 앱",
  keywords: "피부진단, AI, 헬스케어, 피부과, 진료예약",
  authors: [{ name: "Skancer Team" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Skancer",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="font-noto antialiased h-full">
        <ThemeInitializer />
        <div id="root" className="h-full">
        {children}
        </div>
      </body>
    </html>
  );
}
