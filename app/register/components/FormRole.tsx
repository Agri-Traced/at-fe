'use client';

import { Button, Form, FormInstance, Input, notification, Result, Segmented } from "antd"
import { User, RoleType as Role, RoleSchema as RoleValues } from "@/generated/zod";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useCompany, usePostCompanyKey } from "@/hooks/company";

const RoleForm = ({ selectedRole }: { selectedRole: Role }) => {
  const { t } = useTranslation();
  switch (selectedRole) {
    case RoleValues.enum.FARMER:
      return (
        <Form.Item
          label={t('Farm id')}
          name="companyId"
          rules={[{ required: true, message: t('Please enter your farm id') }]}
        >
          <Input placeholder={t('Enter your farm id')} />
        </Form.Item>
      );
    case RoleValues.enum.SHIPPER:
      return (
        <Form.Item
          label={t('Company Id')}
          name="companyId"
          rules={[{ required: true, message: t('Please enter your company id') }]}
        >
          <Input placeholder={t('Enter your company id')} />
        </Form.Item>
      );
    case RoleValues.enum.RETAILER:
      return (
        <Form.Item
          label={t('Store id')}
          name="storeId"
          rules={[{ required: true, message: t('Please enter your store id') }]}
        >
          <Input placeholder={t('Enter your store id')} />
        </Form.Item>
      );
  }
};

export const FormRole = ({ onBack, onNext, form }: { onBack: () => void, onNext: () => void, form: FormInstance<User> }) => {
  const { t } = useTranslation();
  const selectedRole = Form.useWatch('role', form);
  const [protectedKey, setProtectedKey] = useState('');
  const { mutate: postCompanyKey, isPending } = usePostCompanyKey();
  const handleNext = async () => {
    try {
      await form.validateFields(['companyId', 'protectedKey']);
      const companyId = form.getFieldValue('companyId');
      postCompanyKey({
        id: companyId,
        key: protectedKey
      }, {
        onSuccess: () => {
          onNext();
        },
        onError: () => {
          notification.error({
            title: t('Wrong protected key or company id'),
            showProgress: true,
            placement: 'bottomRight'
          });
          return;
        }
      });
    } catch (error) { }
  };

  const options = Object.values(RoleValues.enum).map((role) => ({
    label: t(role),
    value: role,
  }));

  return (
    <div className="flex flex-col gap-5">
      <div style={{ maxWidth: '100%', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <Form.Item
          name="role"
          initialValue="FARMER"
        >
          <Segmented<Role> options={options} block />
        </Form.Item>
      </div>
      <RoleForm selectedRole={selectedRole} />
      <Form.Item
        label={t('Protected key')}
        name="protectedKey"
        rules={[{ required: true, message: t('Please enter your protected key'), min: 6 }]}
      >
        <Input onChange={(e) => setProtectedKey(e.target.value)} placeholder={t('Enter your protected key')} />
      </Form.Item>
      <div className="flex justify-between">
        <Button size="large" onClick={onBack}>
          {t('Back')}
        </Button>
        <Form.Item >
          <Button type="primary" size="large" onClick={handleNext} loading={isPending}>
            {t('Next')}
          </Button>
        </Form.Item>
      </div>
    </div>
  )
}