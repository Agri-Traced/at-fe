'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import ReactQueryProvider from "@/lib/reactQueryProvider";
import { AuthProvider } from "@/contexts/auth";
import { Sepolia } from '@ant-design/web3-assets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EthersWeb3ConfigProvider, MetaMask } from "@ant-design/web3-ethers";
import { I18nProvider } from "@/contexts/i18n";
import { AuthGuard } from "./components/AuthGuard";
import { App } from "antd";

const queryClient = new QueryClient();

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
      <body className="min-h-full flex flex-col">
        <AntdRegistry>
          <I18nProvider>
            <EthersWeb3ConfigProvider
              chains={[Sepolia]}
              wallets={[MetaMask()]}
            >
              <QueryClientProvider client={queryClient}>
                <ReactQueryProvider>
                  <App>
                    <AuthProvider>
                      <AuthGuard>
                        {children}
                      </AuthGuard>
                    </AuthProvider>
                  </App>
                </ReactQueryProvider>
              </QueryClientProvider>
            </EthersWeb3ConfigProvider>
          </I18nProvider>
        </AntdRegistry>
      </body>
    </html >
  );
}
