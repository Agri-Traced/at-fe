import { usePostUser } from "@/hooks/users";
import { Button, Form, Input } from "antd"
import { User } from '@/generated/zod';
import { useTranslation } from "react-i18next";

export const FormAccount = ({ onNext }: { onNext: () => void }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<User>();
  const onFinish = (values: User) => {
    // usePostUser().mutate(values, {
    //   onSuccess: (data) => {
    //     console.log('User created successfully:', data);
    onNext();
    //   }
    // });
  };
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
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
        <Button type="primary" htmlType="submit" >
          {t('Next')}
        </Button>
      </Form.Item>
    </Form>
  )
}