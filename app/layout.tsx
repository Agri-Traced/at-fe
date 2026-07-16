// app/layout.tsx
'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { I18nProvider } from "@/contexts/i18n";
import { ConfigProvider } from "antd";
import dynamic from 'next/dynamic';

// Khai báo dynamic import tắt SSR cho Web3
const Web3ProviderWrapper = dynamic(
  () => import('./components/Web3Wrapper'), // Chỉnh lại đúng đường dẫn file của bạn
  { ssr: false }
);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <head>
        <link rel="icon" href="/icon.png" sizes="any" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body className="min-h-screen flex flex-col">
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#1dad55',
              },
            }}
          >
            <I18nProvider>
              <Web3ProviderWrapper>
                {children}
              </Web3ProviderWrapper>
            </I18nProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}