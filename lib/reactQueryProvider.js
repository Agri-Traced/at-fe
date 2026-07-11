"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function ReactQueryProvider({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // Dữ liệu cũ sau 1 phút
        retry: 1,              // Thử lại 1 lần nếu fetch lỗi
      },
    },
  }));

  return (
    <QueryClientProvider client= { queryClient } >
    { children }
    </QueryClientProvider>
  );
}