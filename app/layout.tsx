'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import ReactQueryProvider from "@/lib/reactQueryProvider";
import { AuthProvider } from "@/contexts/auth";
import { WagmiWeb3ConfigProvider, Sepolia, MetaMask, TokenPocket, OkxWallet } from '@ant-design/web3-wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http } from 'wagmi';
import { I18nProvider } from "@/contexts/i18n";
import { App, ConfigProvider } from "antd";

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
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#1dad55',
              },
            }}
          >
            <I18nProvider>
              <WagmiWeb3ConfigProvider
                eip6963={{
                  autoAddInjectedWallets: true,
                }}
                ens
                transports={{
                  [Sepolia.id]: http(),
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
                        {children}
                      </AuthProvider>
                    </App>
                  </ReactQueryProvider>
                </QueryClientProvider>
              </WagmiWeb3ConfigProvider>
            </I18nProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html >
  );
}
