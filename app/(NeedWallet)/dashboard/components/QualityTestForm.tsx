'use client';

import { Button, Form, Input, Modal, Select, Typography, App, Result } from "antd";
import { QualityTest } from '@/generated/zod';
import { useTranslation } from "react-i18next";
import { useContract } from "@/blockchain/useContract";
import { TransactionLoading } from "./TransactionLoading";
import { useAuth } from "@/contexts/auth";
import { usePostQualityTest, usePostQualityTestConfirm } from "@/hooks/quality";

export const QualityTestForm = ({ open, onClose, id }: { open: boolean; onClose: () => void; id: string | null }) => {
  if (!id) return null;
  const { t } = useTranslation();
  const [form] = Form.useForm<QualityTest>();
  const { mutate, isPending } = usePostQualityTest()
  const { mutate: confirm, isPending: isConfirming } = usePostQualityTestConfirm()
  const { executeWrite, loading, } = useContract();
  const { modal, notification } = App.useApp();
  const { user } = useAuth();
  if (!user) {
    throw new Error('User not found');
  }
  const onFinish = async (values: QualityTest) => {
    mutate({
      ...values,
      batchId: id,
    }, {
      onSuccess: async (data) => {
        const txHash = await executeWrite('verifyQuality', [
          BigInt(data.blockchainId),
          data.isPassed ?? false,
        ]);
        confirm({
          id: data.id,
          data: { txHash: String(txHash) },
        }, {
          onSuccess: async () => {
            modal.success({
              icon: null,
              title: t('Create Quality Test Successfully'),
              content:
                <Result
                  status="success"
                  title={t('Batch Quality Tested Successfully')}
                  subTitle={t('The batch has been quality tested successfully.')}
                />
            });
            onClose();
          }, onError: (error) => {
            notification.error({
              title: t('Error'),
              description: `${t('Action failed. Please try again.')} ${error.message}`,
              showProgress: true,
              placement: 'bottomRight',
            });
          }
        });
      }, onError: (error) => {
        notification.error({
          title: t('Error'),
          description: `${t('Action failed. Please try again.')} ${error.message}`,
          showProgress: true,
          placement: 'bottomRight',
        });
      }
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
          {t('Create Quality Test')}
        </Typography.Text>}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label={t('Is Passed')}
          name="isPassed"
          rules={[{ required: true, message: t('Please select pass status') }]}
        >
          <Select placeholder={t('Select pass status')}>
            <Select.Option value={true}>Passed</Select.Option>
            <Select.Option value={false}>Failed</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item className="flex justify-center mt-6">
          <Button type="primary" htmlType="submit" className="px-8" loading={isPending || loading || isConfirming}>
            {t('Submit')}
          </Button>
        </Form.Item>
      </Form>
      <TransactionLoading loading={loading} isPending={isPending} isConfirming={isConfirming} />
    </Modal>
  )
}