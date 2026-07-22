"use client";

import {
  MetaMask,
  OkxWallet,
  TokenPocket,
  WagmiWeb3ConfigProvider,
} from "@ant-design/web3-wagmi";
import { createConfig, http, injected, WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import { useQueryClient } from "@tanstack/react-query";

const config = createConfig({
  chains: [sepolia],
  connectors: [injected()], // Kích hoạt bộ lắng nghe ví được cài trên trình duyệt
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
  },
});

export default function Web3ProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  return (
    <WagmiProvider config={config}>
      <WagmiWeb3ConfigProvider
        config={config}
        chains={[sepolia]}
        eip6963={{
          autoAddInjectedWallets: true,
        }}
        wallets={[MetaMask(), TokenPocket({ group: "Popular" }), OkxWallet()]}
        queryClient={queryClient}
      >
        {children}
      </WagmiWeb3ConfigProvider>
    </WagmiProvider>
  );
}
