// components/Web3ProviderWrapper.tsx
'use client';

import React, { useEffect } from 'react';
import { EthWeb3jsConfigProvider, MetaMask, OkxWallet, TokenPocket } from '@ant-design/web3-eth-web3js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Sepolia } from "@ant-design/web3-assets";
import ReactQueryProvider from "@/lib/reactQueryProvider";
import { AuthProvider } from "@/contexts/auth";
import { App } from "antd";

const queryClient = new QueryClient();

export default function Web3ProviderWrapper({ children }: { children: React.ReactNode }) {
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
      <App>
        <AuthProvider>
          {children}
        </AuthProvider>
      </App>
    </EthWeb3jsConfigProvider>
  );
}