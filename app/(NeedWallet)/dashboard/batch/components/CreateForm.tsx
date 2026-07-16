'use client';

import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, Typography, App } from "antd"
import { Batch } from '@/generated/zod';
import { useTranslation } from "react-i18next";
import { useContract } from "@/blockchain/useContract";
import { usePostBatch } from "@/hooks/batchs";
import LoadingTranparent from "@/app/components/LoadingTranparent";
import { createBatchIPFSHash } from "@/lib/pinata";
import BatchQRCode from "@/app/components/BatchQrCode";

export const CreateForm = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<Batch>();
  const { mutate, isPending } = usePostBatch()
  const { executeWrite, loading } = useContract();
  const { modal } = App.useApp();
  const UNIT_OPTIONS = [
    { label: t('Kilogram (kg)'), value: 'kg' },
    { label: t('Gram (g)'), value: 'g' },
    { label: t('Ton (t)'), value: 't' },
    { label: t('Liter (l)'), value: 'l' },
    { label: t('Milliliter (ml)'), value: 'ml' },
  ];

  const CATEGORY_OPTIONS = [
    { label: t('Vegetable'), value: 'VEGETABLE' },
    { label: t('Fruit'), value: 'FRUIT' },
    { label: t('Grain'), value: 'GRAIN' },
    { label: t('Bean'), value: 'BEAN' },
    { label: t('Herb'), value: 'HERB' },
    { label: t('Other'), value: 'OTHER' },
  ];

  const onFinish = async (values: Batch) => {
    const ipfsHash = await createBatchIPFSHash(values);
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
      const tx = await contract.createBatch(
        BigInt(blockchainId),
        values.expiryDate ? Math.floor(new Date(values.expiryDate).getTime() / 1000) : 0,
        values.harvestDate ? Math.floor(new Date(values.harvestDate).getTime() / 1000) : 0,
        ipfsHash
      );
      return tx.hash
    });
    mutate({
      ...values,
      txHash: '123456',
      blockchainId,
      ipfsHash,
    }, {
      onSuccess: async (data: Batch) => {
        modal.success({
          title: t('Batch Created Successfully'),
          content:
            <div className="flex flex-col gap-2">
              <BatchQRCode id={data.id} />
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

  if (loading) {
    return <LoadingTranparent />
  }

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
      <div style={{ marginBottom: 16 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="m-auto p-10!"
          initialValues={{
            quantity: 1,
            unit: 'kg',
          }}
        >
          <h2 className="text-xl font-bold mb-6 text-center">{t('Create New Harvest Batch')}</h2>

          {/* Tên sản phẩm */}
          <Form.Item
            label={t('Product Name')}
            name="productName"
            rules={[{ required: true, message: t('Please enter product name') }]}
          >
            <Input placeholder={t('Enter product name (e.g. Organic Tomato)')} />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            {/* Số lượng */}
            <Form.Item
              label={t('Quantity')}
              name="quantity"
              rules={[
                { required: true, message: t('Please enter quantity') },
                { type: 'number', min: 1, message: t('Quantity must be greater than 0') }
              ]}
            >
              <InputNumber className="w-full" placeholder={t('Enter quantity')} />
            </Form.Item>

            {/* Đơn vị tính */}
            <Form.Item
              label={t('Unit')}
              name="unit"
              rules={[{ required: true, message: t('Please select unit') }]}
            >
              <Select placeholder={t('Select unit')} options={UNIT_OPTIONS} />
            </Form.Item>
            <Form.Item
              label={t('Category')}
              name="category"
              rules={[{ required: true, message: t('Please select category') }]}
            >
              <Select placeholder={t('Select category')} options={CATEGORY_OPTIONS} />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Ngày thu hoạch */}
            <Form.Item
              label={t('Harvest Date (estimate)')}
              name="harvestDate"
              rules={[{ required: true, message: t('Please select harvest date') }]}
            >
              <DatePicker className="w-full" placeholder={t('Select date')} format="YYYY-MM-DD" />
            </Form.Item>

            {/* Hạn sử dụng (Có thể Null theo Zod) */}
            <Form.Item
              label={t('Expiry Date (estimate)')}
              name="expiryDate"
            >
              <DatePicker className="w-full" placeholder={t('Select date')} format="YYYY-MM-DD" />
            </Form.Item>
          </div>
          {/* Nút gửi */}
          <Form.Item className="flex justify-center mt-6">
            <Button type="primary" htmlType="submit" className="px-8" loading={isPending}>
              {t('Submit Batch')}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}