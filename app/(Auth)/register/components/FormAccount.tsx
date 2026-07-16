'use client';

import { Button, Form, FormInstance, Input } from "antd"
import { User } from '@/generated/zod';
import { useTranslation } from "react-i18next";

export const FormAccount = ({ onNext, form }: { onNext: () => void, form: FormInstance<User> }) => {
  const { t } = useTranslation();
  const handleNext = async () => {
    try {
      await form.validateFields(['fullName', 'email', 'phone']);
      onNext();
    } catch (error) { }
  };
  return (
    <>
      <Form.Item
        label={t('Full Name')}
        name="fullName"
        rules={[{ required: true, message: t('Please enter your full name') }]}
      >
        <Input placeholder={t('Enter your full name')} />
      </Form.Item>

      < Form.Item
        label={t('Email')}
        name="email"
        rules={
          [
            { required: true, message: t('Please enter your email') },
            { type: 'email', message: t('Please enter a valid email') }
          ]}
      >
        <Input placeholder={t('Enter your email')} />
      </Form.Item>

      < Form.Item
        label={t('Phone Number')}
        name="phone"
        rules={
          [
            { required: true, message: t('Please enter your phone number') },
            { pattern: /^(\+84|84|0)[0-9]{9}$/, message: t('Please enter a valid phone number') }
          ]}
      >
        <Input placeholder={t('Enter your phone number')} />
      </Form.Item>


      < Form.Item className="flex justify-center" >
        <Button type="primary" onClick={handleNext} >
          {t('Next')}
        </Button>
      </Form.Item>
    </>
  )
}