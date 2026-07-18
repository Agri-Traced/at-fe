'use client';

import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, Typography, App, Space } from "antd"
import { ActivityLog, Batch } from '@/generated/zod';
import { useTranslation } from "react-i18next";
import { useContract } from "@/blockchain/useContract";
import { postBatchActivityLog, usePostBatch } from "@/hooks/batchs";
import { createIPFSHash } from "@/lib/pinata";
import { QRBlock } from "@/app/components/QRBlock";

export const AddLogForm = ({ open, onClose, id }: { open: boolean; onClose: () => void; id: string | null }) => {
  if (!id) return null;
  const { t } = useTranslation();
  const [form] = Form.useForm<ActivityLog>();
  const { mutate, isPending } = postBatchActivityLog()
  const { executeWrite, loading, } = useContract();
  const { modal } = App.useApp();
  const onFinish = async (values: ActivityLog) => {
    const ipfsHash = await createIPFSHash(values);
    if (!ipfsHash) {
      modal.error({
        title: t('Error'),
        content: t('Failed to create IPFS hash for the batch. Please try again.'),
      });
      return;
    }
    const randomNumber = Math.floor(100 + Math.random() * 900);
    const blockchainId = `${Date.now()}${randomNumber}`;
    const txHash = await executeWrite(async (contract) => {
      const tx = await contract.functions.createActivityLog(
        BigInt(blockchainId),
        ipfsHash,
      );
      await tx.wait();
      return tx.hash
    });
    mutate({
      id,
      data: {
        ...values,
        txHash,
      }
    }, {
      onSuccess: async (data: ActivityLog) => {
        modal.success({
          icon: null,
          title: t('Activity Log Created Successfully'),
          content:
            <div className="flex flex-col gap-2">
              <QRBlock id={data.id} />
              <Typography.Text copyable>ipfsHash: {data.ipfsHash}</Typography.Text>
            </div>,
        });
        onClose();
      }, onError: (error) => {
        modal.error({
          title: t('Error'),
          content: t('Failed to create batch. Please try again.', { error: error.message }),
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
          {t('Create New Batch')}
        </Typography.Text>}
    >

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="max-w-xl mx-auto p-4 bg-white rounded-xl"
      >
        <h2 className="text-xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          {t('Create Activity Log')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Thời gian thực hiện */}
          <Form.Item
            label={t('Log Timestamp')}
            name="timestamp"
            rules={[{ required: true, message: t('Please select timestamp') }]}
          >
            <DatePicker
              className="w-full"
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder={t('Select date & time')}
            />
          </Form.Item>
        </div>

        {/* Nội dung hoạt động */}
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
              loading={isPending || loading}
            >
              {t('Submit Log')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
      {loading && <Typography.Text type="secondary" className="text-center block mt-4">{t('Submitting transaction to blockchain... Please wait.')}</Typography.Text>}
      {isPending && <Typography.Text type="secondary" className="text-center block mt-4">{t('Submitting batch to server... Please wait.')}</Typography.Text>}
    </Modal>
  )
}