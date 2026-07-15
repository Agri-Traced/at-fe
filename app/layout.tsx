'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import ReactQueryProvider from "@/lib/reactQueryProvider";
import { AuthProvider } from "@/contexts/auth";
import { EthWeb3jsConfigProvider, MetaMask, OkxWallet, TokenPocket } from '@ant-design/web3-eth-web3js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nProvider } from "@/contexts/i18n";
import { App, ConfigProvider } from "antd";
import { useEffect, useState } from "react";
import { Sepolia } from "@ant-design/web3-assets";
import { Web3ConfigProvider } from '@ant-design/web3';

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (<html><body></body></html>);
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <link rel="icon" href="/icon.png" sizes="any" />
      <link rel="apple-touch-icon" href="/icon.png" />
      <body className="min-h-full flex flex-col">
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#1dad55',
              },
            }}
          >
            <I18nProvider>
              <EthWeb3jsConfigProvider
                eip6963={{
                  autoAddInjectedWallets: true,
                }}
                chains={[Sepolia]}
                wallets={[
                  MetaMask(),
                  TokenPocket({
                    group: 'Popular',
                  }),
                  OkxWallet(),
                ]}
                queryClient={queryClient}
              >
                <QueryClientProvider client={queryClient}>
                  <ReactQueryProvider>
                    <App>
                      <AuthProvider>
                        <div className="h-screen">
                          {children}
                        </div>
                      </AuthProvider>
                    </App>
                  </ReactQueryProvider>
                </QueryClientProvider>
              </EthWeb3jsConfigProvider>
            </I18nProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html >
  );
}
