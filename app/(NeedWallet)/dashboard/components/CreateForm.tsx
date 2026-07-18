'use client';

import { Button, Form, Input, InputNumber, Modal, Select, Typography, App } from "antd"
import { Batch } from '@/generated/zod';
import { useTranslation } from "react-i18next";
import { useContract } from "@/blockchain/useContract";
import { usePostBatch } from "@/hooks/batchs";
import { createIPFSHash } from "@/lib/pinata";
import { QRBlock } from "@/app/components/QRBlock";
import { useState } from "react";

export const CreateForm = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<Batch>();
  const { mutate, isPending } = usePostBatch()
  const { executeWrite, loading, } = useContract();
  const { modal } = App.useApp();
  const [loadingIPFS, setLoadingIPFS] = useState(false);
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
    setLoadingIPFS(true);
    const ipfsHash = await createIPFSHash(values);
    setLoadingIPFS(false);
    if (!ipfsHash) {
      modal.error({
        title: t('Error'),
        content: t('Failed to create IPFS hash for the batch. Please try again.'),
      });
      return;
    }
    const randomNumber = Math.floor(100 + Math.random() * 900);
    const blockchainId = `${Date.now()}${randomNumber}`;
    const txHash = await executeWrite('createBatch', [
      BigInt(blockchainId),
      [values.minTemperature, values.maxTemperature, values.minHumidity, values.maxHumidity],
      ipfsHash,
    ]);
    mutate({
      ...values,
      txHash,
      blockchainId,
      ipfsHash,
    }, {
      onSuccess: async (data: Batch) => {
        modal.success({
          icon: null,
          title: t('Batch Created Successfully'),
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
        initialValues={{
          quantity: 1,
          unit: 'kg',
        }}
      >
        <Form.Item
          label={t('Product Name')}
          name="productName"
          rules={[{ required: true, message: t('Please enter product name'), max: 100 }]}
        >
          <Input placeholder={t('Enter product name')} />
        </Form.Item>
        <div className="grid grid-cols-2 gap-4">
          {/* Tên sản phẩm */}
          <Form.Item
            label={t('Category')}
            name="category"
            rules={[{ required: true, message: t('Please select category') }]}
          >
            <Select placeholder={t('Select category')} options={CATEGORY_OPTIONS} />
          </Form.Item>
          <Form.Item
            label={t('Unit')}
            name="unit"
            rules={[{ required: true, message: t('Please select unit') }]}
          >
            <Select placeholder={t('Select unit')} options={UNIT_OPTIONS} />
          </Form.Item>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {/* Số lượng */}
          <Form.Item
            label={t('Minimum Temperature')}
            name="minTemperature"
            rules={[
              { required: true, message: t('Please enter minimum temperature') },
              { type: 'number', min: -100, max: 100, message: t('Temperature must be a valid value') }
            ]}
          >
            <InputNumber min={-100} max={100} suffix="°C" className="!w-full" />
          </Form.Item>
          <Form.Item
            className="w-full"
            label={t('Maximum Temperature')}
            name="maxTemperature"
            rules={[
              { required: true, message: t('Please enter maximum temperature') },
              { type: 'number', min: -100, max: 100, message: t('Temperature must be a valid value') }
            ]}
          >
            <InputNumber min={-100} max={100} className="!w-full" suffix="°C" />
          </Form.Item>
          <Form.Item
            className="w-full"
            label={t('Minimum Humidity')}
            name="minHumidity"
            rules={[
              { required: true, message: t('Please enter minimum humidity') },
              { type: 'number', min: 0, max: 100, message: t('Humidity must be a valid value') }
            ]}
          >
            <InputNumber min={0} max={100} className="!w-full" suffix="%" />
          </Form.Item>
          <Form.Item
            label={t('Maximum Humidity')}
            name="maxHumidity"
            rules={[
              { required: true, message: t('Please enter maximum humidity') },
              { type: 'number', min: 0, max: 100, message: t('Humidity must be a valid value') }
            ]}
          >
            <InputNumber min={0} max={100} suffix="%" className="!w-full" />
          </Form.Item>
        </div>
        {/* Nút gửi */}
        <Form.Item className="flex justify-center mt-6">
          <Button type="primary" htmlType="submit" className="px-8" loading={isPending || loading || loadingIPFS}>
            {t('Submit Batch')}
          </Button>
        </Form.Item>
      </Form>
      {loadingIPFS && <Typography.Text type="secondary" className="text-center block mt-4">{t('Uploading batch data to IPFS...')}</Typography.Text>}
      {loading && <Typography.Text type="secondary" className="text-center block mt-4">{t('Submitting transaction to blockchain...')}</Typography.Text>}
      {isPending && <Typography.Text type="secondary" className="text-center block mt-4">{t('Submitting batch to server...')}</Typography.Text>}
    </Modal>
  )
}