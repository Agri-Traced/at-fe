import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { I18nProvider } from "@/contexts/i18n";
import { ConfigProvider } from "antd";
import Mounting from "./components/Mouting";
import ReactQueryProvider from "@/lib/reactQueryProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const queryClient = new QueryClient();

export default async function RootLayout({
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
              <ReactQueryProvider>
                <Mounting>
                  {children}
                </Mounting>
              </ReactQueryProvider>
            </I18nProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}