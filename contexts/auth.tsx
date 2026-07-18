'use client';

import { createContext, useContext, useEffect } from 'react';
import type { User } from '../generated/zod';
import { Account, useAccount } from '@ant-design/web3';
import api from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';
import { useLogin } from '@/hooks/login';
import { usePathname } from 'next/navigation';
import { Loading } from '@/app/components/Loading';
import { useTranslation } from 'react-i18next';
import { useLogout } from '@/hooks/logout';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null | undefined;
  isLoading: boolean;
  account: Account | undefined
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { account } = useAccount();
  const { mutate: login, isPending } = useLogin();
  const { mutate: logout } = useLogout();
  const pathname = usePathname();
  const { t } = useTranslation();
  const router = useRouter();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      try {
        const res = await api.get<User, User>('/user/profile');
        return res;
      } catch (error: any) {
        const statusCode = error?.response?.status;
        if (statusCode === 404) {
          return null; // Trả về null để UI biết đường điều hướng sang trang Đăng ký (Register)
        }
        throw error;
      }
    },
    enabled: !!account,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const isAuthError = error && ((error as any)?.response?.status === 401 || (error as any)?.response?.status === 403);

  useEffect(() => {
    if (account && isAuthError && pathname === '/login') {
      login(account.address);
    }
  }, [account, isAuthError, pathname, login]);

  useEffect(() => {
    if (!account) {
      logout();
    }
  }, [account, logout]);

    useEffect(() => {
      if (account && user === null) {
        router.push('/register');
      }
    }, [account, user]);
  

  if (isLoading || isPending) {
    return <Loading message={t('Connecting to your wallet...')} />
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, account }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};