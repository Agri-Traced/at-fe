'use client';

import { useAuth } from '@/contexts/auth';
import { useTranslation } from 'react-i18next';
import { Card, Steps, Result, Image } from 'antd';
import { useEffect, useState } from 'react';
import { Container } from '@/app/components';
import { FormAccount } from './components/FormAccount';
import { FormRole } from './components/FormRole';
import ConnectWalletButton from '@/app/components/ConnectWalletButton';

const FormStep = ({ step, onNext }: { step: number; onNext: () => void }) => {
  const { t } = useTranslation();
  switch (step) {
    case 0:
      return <FormAccount onNext={onNext} />;
    case 1:
      return <FormRole onNext={onNext} />;
    case 2:
      return <Result status="success" title={t('Registration Complete')} subTitle={t('You have successfully registered.')} />;
    default:
      return null;
  }
};

export default function RegisterPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (user) {
      if (user.email) {
        setStep(1);
      }
      if (user.role) {
        setStep(2);
      }
    }
  }, [user]);

  const items = [
    {
      title: t('Account information'),
    },
    {
      title: t('Pick your role'),
    },
    {
      title: t('Finish'),
    },
  ];

  return (
    <Container>
      <div className="flex flex-col gap-4">
        <Image src="/logo.png" alt="Logo" width={200} height={200} className="mx-auto mb-8" />
        <ConnectWalletButton />
        <Steps current={step} titlePlacement="vertical" items={items} />
        <Card>
          <FormStep step={step} onNext={() => setStep(step + 1)} />
        </Card>
      </div>
    </Container>
  )
}