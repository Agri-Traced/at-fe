'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../generated/zod';
import { useSignMessage, useAccount, useDisconnect } from 'wagmi';
import api from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';
import { Loading } from '@/app/components/Loading';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null | undefined;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const { data: user, isLoading } = useQuery({
    queryKey: ['auth-user', address],
    queryFn: async () => {
      try {
        const message = `Xác thực quyền truy cập dữ liệu cho ví: ${address?.toLowerCase()}`;
        const signature = await signMessageAsync({ message });
        const res = await api.post<User>('/api/user/profile', {
          address,
          message,
          signature
        });
        return res.data;
      } catch (error: any) {
        if (error?.status === 404) {
          return null; // User chưa đăng ký thông tin, không cần throw error
        }
        disconnect();
        throw error;
      }
    },
    enabled: isConnected && !!address,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};