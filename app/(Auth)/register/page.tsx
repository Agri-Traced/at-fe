'use client';

import { useAuth } from '@/contexts/auth';
import { useTranslation } from 'react-i18next';
import { Card, Steps, Result, Form, Button, Radio, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Container } from '@/app/components';
import { FormAccount } from './components/FormAccount';
import { FormRole } from './components/FormRole';
import ConnectWalletButton from '@/app/components/ConnectWalletButton';
import Image from 'next/image';
import { User } from '@/generated/zod';
import { usePostUser } from '@/hooks/users';
import { Loading } from '@/app/components/Loading';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const { t } = useTranslation()
  const { user, account } = useAuth()
  const [step, setStep] = useState(0);
  const [form] = Form.useForm<User>();
  const [term, setTerm] = useState(false);
  const { mutate, isError, isPending, isSuccess } = usePostUser();
  const router = useRouter();

  useEffect(() => {
    if (!account) {
      router.replace('/login');
    }
  }, [user, router]);

  if (!account) {
    return <Loading message={t('Connecting to wallet...')} />;
  }

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

  const onFinish = (values: User) => {
    setStep(step + 1)
    mutate({
      ...values,
      walletAddress: account.address
    });
  }

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
        <div className="flex flex-col">
          <Image src="/logo.png" alt="Logo" width={200} height={200} priority className='h-auto' />
          <Typography.Title level={3} className="text-center mb-8">
            {t('Welcome new user! Please register your account')}
          </Typography.Title>
        </div>
        <ConnectWalletButton />
        <Steps current={step} titlePlacement="vertical" items={items} />
        <Card>
          <Form form={form} onFinish={onFinish} layout="vertical">
            <div className={step === 0 ? 'block' : 'hidden'}><FormAccount onNext={() => setStep(step + 1)} form={form} /></div>
            <div className={step === 1 ? 'block' : 'hidden'}><FormRole onBack={() => setStep(step - 1)} onNext={() => setStep(step + 1)} form={form} /></div>
            <div className={step === 2 ? 'block' : 'hidden'}>
              <div className="flex flex-col items-center justify-center">
                <Form.Item>
                  <Radio onChange={(e) => setTerm(e.target.checked)}>
                    {t('I agree to the terms and conditions')}
                  </Radio>
                </Form.Item>
                <Form.Item className="flex justify-center gap-3" >
                  <Button size="large" onClick={() => setStep(step - 1)}>
                    {t('Back')}
                  </Button>
                  <Button disabled={!term} type="primary" size="large" htmlType="submit" >
                    {t('Register')}
                  </Button>
                </Form.Item>
              </div>
            </div>
            {isError ? (
              <Result status="error" title={t('Registration Failed')} subTitle={t('Registration failed.')} />
            ) : isPending ? (
              <Loading message={t('Processing registration...')} />
            ) : isSuccess ? (
              <Result status="success" title={t('Registration Complete')} subTitle={t('You have successfully registered.')} />
            ) : null}
          </Form>
        </Card>
      </div>
    </Container>
  )
}