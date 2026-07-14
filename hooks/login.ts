import api from '@/lib/axios';
import { useDisconnect, useSignMessage } from '@ant-design/web3-ethers/wagmi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { App } from 'antd'
import { useRouter } from 'next/navigation';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { signMessageAsync } = useSignMessage(); // Thư viện wagmi của bạn
  const { disconnect } = useDisconnect();
  const { t } = useTranslation();
  const { notification } = App.useApp();
  const router = useRouter();

  return useMutation({
    mutationFn: async (address: string) => {
      const message = `${t('Verify access for your wallet to login')}: ${address}`;
      const signature = await signMessageAsync({ message });

      // Gọi API đăng nhập để lấy JWT Token
      const res = await api.post<{ token: string }>('/user/login', {
        address,
        message,
        signature
      });

      return res.data; // Trả về { token: 'ey...' }
    },
    onSuccess: (address) => {
      queryClient.invalidateQueries({ queryKey: ['auth-user', address] });
    },
    onError: (error: any) => {
      if (error.status === 404) {
        router.replace('/register');
        return;
      }
      disconnect()
      notification.error({
        title: t('Login failed.'),
        showProgress: true,
        placement: 'bottomRight'
      })
    }
  });
};