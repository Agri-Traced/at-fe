import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { I18nProvider } from "@/contexts/i18n";
import { ConfigProvider } from "antd";
import Mounting from "./components/Mouting";
import ReactQueryProvider from "@/contexts/reactQueryProvider";
import { App } from "antd";
import { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Agri-Trace",
  description: "Agri-Trace is a blockchain-based traceability system for agricultural products.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

import Wrapper from "./components/Wrapper";

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
                <Wrapper>
                  <App>
                    <Mounting>
                      {children}
                    </Mounting>
                  </App>
                </Wrapper>
              </ReactQueryProvider>
            </I18nProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}