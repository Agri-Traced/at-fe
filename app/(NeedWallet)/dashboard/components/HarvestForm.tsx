'use client';

import { Button, Form, InputNumber, Modal, Select, Typography, App, DatePicker, Result } from "antd"
import { useTranslation } from "react-i18next";
import { useContract } from "@/blockchain/useContract";
import { BatchHarvest, usePostBatchHarvest, usePostBatchHarvestConfirm } from "@/hooks/batchs";
import { createIPFSHash } from "@/lib/pinata";
import { useState } from "react";
import { useCompaniesRetail } from "@/hooks/company";
import { TransactionLoading } from "./TransactionLoading";

export const HarvestForm = ({ open, onClose, id, unit }: { open: boolean; onClose: () => void; id: string | null; unit: string | null }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<BatchHarvest>();
  const { mutate, isPending } = usePostBatchHarvest()
  const { executeWrite, loading, } = useContract();
  const { modal, notification } = App.useApp();
  const [loadingIPFS, setLoadingIPFS] = useState(false);
  const { data: companies } = useCompaniesRetail();
  const { mutate: confirm, isPending: isConfirming } = usePostBatchHarvestConfirm();

  const RETAIL_COMPANY_OPTIONS = companies?.map((company) => ({
    label: company.companyName,
    value: company.id,
  })) || [];

  const onFinish = async (values: BatchHarvest) => {
    if (!id) return null;
    mutate({ id, data: values }, {
      onSuccess: async (data) => {
        setLoadingIPFS(true);
        const ipfsHash = await createIPFSHash(values);
        setLoadingIPFS(false);
        if (!ipfsHash) {
          notification.error({
            title: t('Error'),
            description: `${t('Action failed. Please try again.')}`,
            showProgress: true,
            placement: 'bottomRight',
          });
          return;
        }
        const txHash = await executeWrite('harvestBatch', [
          BigInt(data.blockchainId),
          Math.floor(new Date(data.expiryDate!).getTime() / 1000),
          data.retailCompanyId!,
          ipfsHash,
        ]);
        confirm({
          id: data.id,
          data: { retailTxHash: String(txHash) },
        }, {
          onSuccess: async () => {
            modal.success({
              icon: null,
              title: t('Batch Harvested Successfully'),
              content:
                <Result
                  status="success"
                  title={t('Batch Harvested Successfully')}
                  subTitle={t('The batch has been harvested successfully.')}
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
          description: `${t('Action failed. Please try again. ')} ${error.message}`,
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
          {t('Harvest Batch')}
        </Typography.Text>}
    >

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          quantity: 1,
        }}
      >
        <Form.Item
          label={t('Retail Company')}
          name="retailCompanyId"
          rules={[{ required: true, message: t('Please enter retailer company') }]}
        >
          <Select showSearch placeholder={t('Enter retailer company ID')} options={RETAIL_COMPANY_OPTIONS} />
        </Form.Item>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label={t('Quantity')}
            name="quantity"
            rules={[
              { required: true, message: t('Please enter quantity') },
              { type: 'number', min: 1, message: t('Quantity must be greater than 0') }
            ]}
          >
            <InputNumber suffix={unit || '???'} className="!w-full" min={1} placeholder={t('Enter quantity')} />
          </Form.Item>
          <Form.Item
            label={t('Expiry Date (estimate)')}
            name="expiryDate"
            rules={[
              { required: true, message: t('Please enter expiry date') },
              { type: 'date', message: t('Please select a valid date') }]}
          >
            <DatePicker className="w-full" placeholder={t('Select date')} format="YYYY-MM-DD" />
          </Form.Item>
        </div>
        <Form.Item className="flex justify-center mt-6">
          <Button type="primary" htmlType="submit" className="px-8" loading={isPending || loading || loadingIPFS || isConfirming}>
            {t('Submit')}
          </Button>
        </Form.Item>
      </Form>
      <TransactionLoading loadingIPFS={loadingIPFS} loading={loading} isPending={isPending} isConfirming={isConfirming} />
    </Modal>
  )
}