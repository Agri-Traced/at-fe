'use client';

import api from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { App } from 'antd'
import { useRouter } from 'next/navigation';
import { useConnection } from '@ant-design/web3';
import { useSignMessage } from 'wagmi';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { notification } = App.useApp();
  const router = useRouter();
  const { disconnect } = useConnection();
  const { signMessageAsync } = useSignMessage();

  return useMutation({
    mutationFn: async (address: string) => {
      const message = `${t('Verify access for your wallet to login')}`;
      const signature = await signMessageAsync({ message });
      const res = await api.post<{ token: string }>('/user/login', {
        address,
        message,
        signature
      });
      notification.success({
        title: t('Welcome to Agri-Trace.'),
        showProgress: true,
        placement: 'bottomRight'
      })
      return res.data; // Trả về { token: 'ey...' }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      router.push('/dashboard');
    },
    onError: (error: any) => {
      if (error?.status === 404 || error.response?.status === 404) {
        router.replace('/register');
        return;
      }

      if (disconnect) disconnect();
      router.replace('/login');
      notification.error({
        title: t('Login failed.'),
        description: error?.response?.data?.message || error?.message,
        showProgress: true,
        placement: 'bottomRight'
      })
    }
  });
};