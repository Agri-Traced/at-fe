'use client';

import { Typography } from 'antd';
import ConnectWalletButton from '@/app/components/ConnectWalletButton';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth';
import { Loading } from '../components/Loading';

const { Title } = Typography;

export default function LoginPage() {
  const { t } = useTranslation()
  const { isConnected } = useAccount();
  const { user } = useAuth();
  const router = useRouter();

  if (isConnected && !user) {
    router.replace('/register');
    return <Loading message={t('Authenicating...')} />;
  }

  return (
    <div className="min-h-screen bg-[url('/login-background.png')]">
      <div className="ml-auto h-screen w-screen md:w-[40%] bg-white shadow-2xl p-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-87.5">
          <Image src="/logo.png" alt="Logo" width={200} height={200} className="mx-auto mb-8" />
          <Title level={3} className="text-center mb-8">
            {t('Connect to your wallet')}
          </Title>
          <div className="flex flex-col justify-center">
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    </div>
  );
}