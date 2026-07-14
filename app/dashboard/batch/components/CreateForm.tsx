'use client';

import { Button, DatePicker, Form, Input, InputNumber, Select } from "antd"
import { Batch } from '@/generated/zod';
import { useTranslation } from "react-i18next";
import { useContract } from "@/blockchain/useContract";
import { usePostBatch } from "@/hooks/batchs";

export const CreateForm = ({ onNext }: { onNext: () => void }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<Batch>();
  const { mutate } = usePostBatch()
  const { executeWrite, loading } = useContract();
  const UNIT_OPTIONS = [
    { label: t('Kilogram (kg)'), value: 'kg' },
    { label: t('Gram (g)'), value: 'g' },
    { label: t('Ton (t)'), value: 't' },
    { label: t('Liter (l)'), value: 'l' },
    { label: t('Milliliter (ml)'), value: 'ml' },
  ];

  const onFinish = async (values: any) => {
    mutate(values, {
      onSuccess: async (data) => {
        try {
          await executeWrite(async (contract) => {
            const tx = await contract.createBatch(
              data.id,
              data.productName,
              data.quantity,
              data.unit,
              Math.floor(new Date(data.harvestDate).getTime() / 1000),
              data.expiryDate ? Math.floor(new Date(data.expiryDate).getTime() / 1000) : 0,
              data.ipfsHash
            );
            await tx.wait(); // Chờ giao dịch được xác nhận
          });
          onNext();
        } catch (error) {
          console.log("Error interacting with blockchain:", error);
        }
      }
    });
  };

  return (
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Ngày thu hoạch */}
        <Form.Item
          label={t('Harvest Date')}
          name="harvestDate"
          rules={[{ required: true, message: t('Please select harvest date') }]}
        >
          <DatePicker className="w-full" placeholder={t('Select date')} format="YYYY-MM-DD" />
        </Form.Item>

        {/* Hạn sử dụng (Có thể Null theo Zod) */}
        <Form.Item
          label={t('Expiry Date (Optional)')}
          name="expiryDate"
        >
          <DatePicker className="w-full" placeholder={t('Select date')} format="YYYY-MM-DD" />
        </Form.Item>
      </div>

      {/* Mã IPFS Hash (Thông tin lưu trữ phi tập trung) */}
      <Form.Item
        label={t('IPFS Hash')}
        name="ipfsHash"
        rules={[{ required: true, message: t('Please enter IPFS Hash metadata') }]}
      >
        <Input placeholder={t('Enter Qm... IPFS metadata hash')} />
      </Form.Item>

      {/* Nút gửi */}
      <Form.Item className="flex justify-center mt-6">
        <Button type="primary" htmlType="submit" className="px-8">
          {t('Submit Batch')}
        </Button>
      </Form.Item>
    </Form>
  )
}