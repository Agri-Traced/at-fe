'use client';

import { Button, Form, Input, Modal, Typography, Space, Result } from "antd"
import { Activity } from '@/generated/zod';
import { useTranslation } from "react-i18next";
import { usePostBatchActivityLog } from "@/hooks/batchs";

export const AddLogForm = ({ open, onClose, id }: { open: boolean; onClose: () => void; id: string | null }) => {
  if (!id) return null;
  const { t } = useTranslation();
  const [form] = Form.useForm<Activity>();
  const { mutate, isPending, isSuccess } = usePostBatchActivityLog();
  const onFinish = async (values: Activity) => {
    mutate({
      id,
      data: values
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <Typography.Text
          style={{ display: 'block', letterSpacing: '0.08em', textTransform: 'uppercase' }}
        >
          {t('Add Activity Log')}
        </Typography.Text>}
    >
      {isSuccess ? (
        <Result
          status="success"
          title={t('Log Created Successfully')}
          subTitle={t('The activity log has been created successfully.')}
          extra={[
            <Button type="primary" key="close-btn" onClick={onClose}>
              OK
            </Button>
          ]}
        />
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="max-w-xl mx-auto p-4 bg-white rounded-xl"
        >
          <Form.Item
            label={t('Activity Description')}
            name="description"
            rules={[
              { required: true, message: t('Please enter activity description') },
              { max: 500, message: t('Description cannot exceed 500 characters') }
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder={t('e.g. Fertilized with organic compost Phase 1 or Sprayed bio-pesticides')}
            />
          </Form.Item>

          {/* Hệ thống nút hành động */}
          <Form.Item className="flex justify-center mt-6 mb-0">
            <Space size="middle">
              <Button
                type="primary"
                htmlType="submit"
                loading={isPending}
              >
                {t('Submit')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
      {isPending && <Typography.Text type="secondary" className="text-center block mt-4">{t('Saving...')}</Typography.Text>}
    </Modal>
  )
}