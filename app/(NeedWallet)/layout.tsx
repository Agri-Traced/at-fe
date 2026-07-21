'use client';

import dynamic from 'next/dynamic';

const Web3ProviderWrapper = dynamic(
  () => import('../components/Web3Wrapper'), // Chỉnh lại đúng đường dẫn file của bạn
  { ssr: false }
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Web3ProviderWrapper>
      {children}
    </Web3ProviderWrapper>
  )
}