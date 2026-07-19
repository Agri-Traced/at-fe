"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: (failureCount, error: any) => {
          const isUserRejected = error?.code === 4001 || error?.message?.includes('rejected');
          if (isUserRejected) return false;
          const status = error?.status || error?.response?.status;
          if (status === 404 || status === 401) return false;
          if (failureCount < 2) return true;
          return false;
        },
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient} >
      {children}
    </QueryClientProvider>
  );
}