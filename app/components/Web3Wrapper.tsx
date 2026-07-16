// components/Web3ProviderWrapper.tsx
'use client';

import React from 'react';
import { EthWeb3jsConfigProvider, MetaMask, OkxWallet, TokenPocket } from '@ant-design/web3-eth-web3js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Sepolia } from "@ant-design/web3-assets";
import ReactQueryProvider from "@/lib/reactQueryProvider";
import { AuthProvider } from "@/contexts/auth";
import { App } from "antd";

// Khởi tạo QueryClient bên trong Wrapper
const queryClient = new QueryClient();

export default function Web3ProviderWrapper({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null; // Tránh render server-side
  }
  return (
    <EthWeb3jsConfigProvider
      eip6963={{
        autoAddInjectedWallets: true,
      }}
      chains={[Sepolia]}
      wallets={[
        MetaMask(),
        TokenPocket({ group: 'Popular' }),
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
    </EthWeb3jsConfigProvider>
  );
}