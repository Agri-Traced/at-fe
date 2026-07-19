'use client';

import { Button, Form, Input, InputNumber, Modal, Select, Typography, App, DatePicker } from "antd"
import { Batch } from '@/generated/zod';
import { useTranslation } from "react-i18next";
import { useContract } from "@/blockchain/useContract";
import { BatchHarvest, usePostBatchConfirm, usePostBatchHarvest } from "@/hooks/batchs";
import { createIPFSHash } from "@/lib/pinata";
import { QRBlock } from "@/app/components/QRBlock";
import { useState } from "react";
import { useCompaniesRetail } from "@/hooks/company";
import { TransactionLoading } from "./TransactionLoading";

export const HarvestForm = ({ open, onClose, id }: { open: boolean; onClose: () => void; id: string | null }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<BatchHarvest>();
  const { mutate, isPending } = usePostBatchHarvest()
  const { executeWrite, loading, } = useContract();
  const { modal } = App.useApp();
  const [loadingIPFS, setLoadingIPFS] = useState(false);
  const { data: companies } = useCompaniesRetail();
  const { mutate: confirm, isPending: isConfirming } = usePostBatchConfirm();

  const RETAIL_COMPANY_OPTIONS = companies?.map((company) => ({
    label: company.companyName,
    value: company.id,
  })) || [];

  const onFinish = async (values: BatchHarvest) => {
    if (!id) return null;
    const randomNumber = Math.floor(100 + Math.random() * 900);
    const blockchainId = `${Date.now()}${randomNumber}`;
    mutate({ id, data: values }, {
      onSuccess: async (data: Batch) => {
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
        const txHash = await executeWrite('harvestBatch', [
          BigInt(blockchainId),
          Math.floor(new Date(data.expiryDate!).getTime() / 1000),
          data.retailCompanyId!,
          ipfsHash,
        ]);
        confirm({
          id: data.id,
          data: txHash,
        }, {
          onSuccess: async (data: Batch) => {
            modal.success({
              icon: null,
              title: t('Batch Created Successfully'),
              content:
                <div className="flex flex-col gap-2">
                  <QRBlock id={data.id} />
                  <Typography.Text copyable>ipfsHash: {ipfsHash}</Typography.Text>
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
        modal.success({
          icon: null,
          title: t('Batch Created Successfully'),
          content:
            <div className="flex flex-col gap-2">
              <QRBlock id={data.id} />
              <Typography.Text copyable>ipfsHash: {ipfsHash}</Typography.Text>
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
          label={t('Retail Company ID')}
          name="retailCompanyId"
          rules={[{ required: true, message: t('Please enter retailer company ID') }]}
        >
          <Select showSearch placeholder={t('Enter retailer company ID')} options={RETAIL_COMPANY_OPTIONS} />
        </Form.Item>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            className="w-full"
            label={t('Quantity')}
            name="quantity"
            rules={[
              { required: true, message: t('Please enter quantity') },
              { type: 'number', min: 1, message: t('Quantity must be greater than 0') }
            ]}
          >
            <InputNumber className="w-full" placeholder={t('Enter quantity')} />
          </Form.Item>
          <Form.Item
            label={t('Expiry Date (estimate)')}
            name="expiryDate"
          >
            <DatePicker className="w-full" placeholder={t('Select date')} format="YYYY-MM-DD" />
          </Form.Item>
        </div>
      </Form>
      <TransactionLoading loadingIPFS={loadingIPFS} loading={loading} isPending={isPending} isConfirming={isConfirming} />
    </Modal>
  )
}