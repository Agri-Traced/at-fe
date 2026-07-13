import { usePostUser } from "@/hooks/users";
import { Button, Form, Input, Result, Segmented } from "antd"
import { User, RoleType as Role, RoleSchema as RoleValues } from "@/generated/zod";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const RoleForm = ({ selectedRole }: { selectedRole: Role }) => {
  const { t } = useTranslation();
  switch (selectedRole) {
    case RoleValues.enum.FARMER:
      return (
        <>
          <Form.Item
            label={t('Farm name')}
            name="farmName"
            rules={[{ required: true, message: t('Please enter your farm name') }]}
          >
            <Input placeholder={t('Enter your farm name')} />
          </Form.Item>
          <Form.Item
            label={t('Farm Location')}
            name="farmLocation"
            rules={[{ required: true, message: t('Please enter your farm location') }]}
          >
            <Input placeholder={t('Enter your farm location')} />
          </Form.Item>
        </>
      );
    case RoleValues.enum.SHIPPER:
      return (
        <>
          <Form.Item
            label={t('Company Id')}
            name="companyId"
            rules={[{ required: true, message: t('Please enter your company id') }]}
          >
            <Input placeholder={t('Enter your company id')} />
          </Form.Item>
          <Form.Item
            label={t('Protected key')}
            name="protectedKey"
            rules={[{ required: true, message: t('Please enter your protected key') }]}
          >
            <Input placeholder={t('Enter your protected key')} />
          </Form.Item>
        </>
      );
    case RoleValues.enum.RETAILER:
      return (
        <>
          <Form.Item
            label={t('Store id')}
            name="storeId"
            rules={[{ required: true, message: t('Please enter your store id') }]}
          >
            <Input placeholder={t('Enter your store id')} />
          </Form.Item>
          <Form.Item
            label={t('Protected key')}
            name="protectedKey"
            rules={[{ required: true, message: t('Please enter your protected key') }]}
          >
            <Input placeholder={t('Enter your protected key')} />
          </Form.Item>
        </>
      );
  }
};

export const FormRole = ({ onNext }: { onNext: () => void }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<User>();
  const [selectedRole, setSelectedRole] = useState<Role>(RoleValues.enum.FARMER);
  const onFinish = (values: User) => {
    // usePostUser().mutate(values, {
    //   onSuccess: (data) => {
    //     console.log('User created successfully:', data);
    onNext();
    //   }
    // });
  };

  const options = Object.values(RoleValues.enum).map((role) => ({
    label: t(role),
    value: role,
  }));

  return (
    <div className="flex flex-col gap-5">
      <div style={{ maxWidth: '100%', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <Segmented<Role> options={options} block onChange={(value) => setSelectedRole(value)} />
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <RoleForm selectedRole={selectedRole} />
        <Form.Item className="flex justify-center" >
          <Button type="primary" size="large" htmlType="submit" >
            {t('Next')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}