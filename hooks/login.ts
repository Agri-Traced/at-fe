'use client';

import api from '@/lib/axios';
import { useWeb3js } from '@ant-design/web3-eth-web3js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { App } from 'antd'
import { useRouter } from 'next/navigation';
import { useConnection } from '@ant-design/web3';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const web3 = useWeb3js();
  const { t } = useTranslation();
  const { notification } = App.useApp();
  const router = useRouter();
  const { disconnect } = useConnection();

  return useMutation({
    mutationFn: async (address: string) => {
      if (!web3) return
      const message = `${t('Verify access for your wallet to login')}`;
      const signature = await web3.eth.personal.sign(web3.utils.utf8ToHex(message), address, '');
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
        showProgress: true,
        placement: 'bottomRight'
      })
    }
  });
};