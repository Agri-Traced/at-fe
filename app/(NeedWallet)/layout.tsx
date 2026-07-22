'use client';

import AuthWrapper from '../components/AuthWrapper';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <AuthWrapper>
        {children}
      </AuthWrapper>
  )
}