'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../generated/zod';
import { useAccount, useDisconnect } from 'wagmi';
import api from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';
import { Loading } from '@/app/components/Loading';

interface AuthContextType {
  user: User | null | undefined;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ['auth-user', address],
    queryFn: async () => {
      const token = localStorage.getItem(`token_${address?.toLowerCase()}`);

      // Nếu chưa có token, không chạy tiếp (Thực ra nhờ điều kiện enabled ở dưới kiểm soát rồi)
      if (!token) return null;

      try {
        const res = await api.get<User>('/user/profile', {
          headers: {
            // Gửi token kèm theo request
            Authorization: `Bearer ${token}`
          }
        });
        return res.data;
      } catch (error: any) {
        if (error?.status === 401 || error?.status === 403) {
          // Token hết hạn hoặc sai -> Xóa token cũ
          localStorage.removeItem(`token_${address?.toLowerCase()}`);
        }
        if (error?.status === 404) {
          return null;
        }
        disconnect();
        throw error;
      }
    },
    // ĐIỀU KIỆN CHẠY: Chỉ chạy khi đã kết nối ví VÀ trong localStorage ĐÃ CÓ token từ bước ký trước đó
    enabled: isConnected && !!address && !!localStorage.getItem(`token_${address?.toLowerCase()}`),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isConnected && address) {
      localStorage.removeItem(`token_${address.toLowerCase()}`);
    }
  }, [isConnected, address]);

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