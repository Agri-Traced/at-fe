'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../generated/zod';
import { useAccount, useDisconnect } from 'wagmi';
import api from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';
import { Loading } from '@/app/components/Loading';
import { useLogin } from '@/hooks/login';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null | undefined;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);
  const { mutate: login } = useLogin();
  const pathname = usePathname();

  const { data: user, isLoading } = useQuery({
    queryKey: ['auth-user', address],
    queryFn: async () => {
      try {
        // KHÔNG cần đọc localStorage hay set Header Authorization nữa!
        // axios với `withCredentials: true` sẽ tự động đính kèm Cookie 'auth_token'.
        const res = await api.get<User>('/user/profile');
        return res.data;
      } catch (error: any) {
        const statusCode = error?.response?.status;

        // 1. Nếu Token hết hạn hoặc không hợp lệ (401/403)
        if (statusCode === 401 || statusCode === 403) {
          throw error;
        }

        // 2. Nếu User chưa đăng ký thông tin trong hệ thống (404)
        if (statusCode === 404) {
          return null; // Trả về null để UI biết đường điều hướng sang trang Đăng ký (Register)
        }

        // 3. Các lỗi hệ thống khác (500, rớt mạng...)
        disconnect();
        throw error;
      }
    },

    enabled: isConnected && !!address, // Chỉ chạy query khi đã kết nối ví
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected && address && !user && pathname !== '/register') {
      login(address);
    }
  }, [isConnected, address, login]);

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