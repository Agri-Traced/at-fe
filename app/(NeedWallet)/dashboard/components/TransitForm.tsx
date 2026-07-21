'use client';

import { Button, Form, Input, InputNumber, Modal, Typography, App, Result } from "antd";
import { StepTransit } from '@/generated/zod';
import { useTranslation } from "react-i18next";
import { useContract } from "@/blockchain/useContract";
import { createIPFSHash } from "@/lib/pinata";
import { useState } from "react";
import { TransactionLoading } from "./TransactionLoading";
import { usePostTransit, usePostTransitConfirm } from "@/hooks/transits";

export const TransitForm = ({ open, onClose, id, location }: { open: boolean; onClose: () => void; id: string | null; location: string | null }) => {
  if (!id) return null;
  const { t } = useTranslation();
  const [form] = Form.useForm<StepTransit>();
  const { mutate, isPending } = usePostTransit()
  const { mutate: confirm, isPending: isConfirming } = usePostTransitConfirm()
  const { executeWrite, loading, } = useContract();
  const { modal, notification } = App.useApp();
  const [loadingIPFS, setLoadingIPFS] = useState(false);
  const onFinish = async (values: StepTransit) => {
    mutate({
      ...values,
      batchId: id,
    }, {
      onSuccess: async (data) => {
        setLoadingIPFS(true);
        const ipfsHash = await createIPFSHash(values);
        setLoadingIPFS(false);
        if (!ipfsHash) {
          notification.error({
            title: t('Error'),
            description: t('Failed to create IPFS hash for the batch. Please try again.'),
            showProgress: true,
            placement: 'bottomRight',
          });
          return;
        }
        const txHash = await executeWrite('updateTransit', [
          BigInt(data.blockchainId),
          data.temperature,
          data.humidity,
          ipfsHash,
        ]);
        confirm({
          id: data.id,
          data: { txHash: String(txHash) },
        }, {
          onSuccess: async () => {
            modal.success({
              icon: null,
              title: t('Create Transit Successfully'),
              content:
                <Result
                  status="success"
                  title={t('Create Transit Successfully')}
                  subTitle={t('The batch has been transited successfully.')}
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
          {t('Create New Batch')}
        </Typography.Text>}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          temperature: Math.floor(Math.random() * 16),
          humidity: Math.floor(Math.random() * 36) + 60,
          toLocation: location,
        }}
      >
        <Form.Item
          label={t('Transit to Location')}
          name="toLocation"
          rules={[{ required: true, message: t('Please enter transit location'), max: 200 }]}
        >
          <Input placeholder={t('Enter transit location')} />
        </Form.Item>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            className="w-full"
            label={t('Temperature')}
            name="temperature"
            rules={[
              { required: true, message: t('Please enter temperature') },
              { type: 'number', min: -100, max: 100, message: t('Temperature must be a valid value') }
            ]}
          >
            <InputNumber min={-100} max={100} className="!w-full" suffix="°C" />
          </Form.Item>
          <Form.Item
            className="w-full"
            label={t('Humidity')}
            name="humidity"
            rules={[
              { required: true, message: t('Please enter humidity') },
              { type: 'number', min: 0, max: 100, message: t('Humidity must be a valid value') }
            ]}
          >
            <InputNumber min={0} max={100} className="!w-full" suffix="%" />
          </Form.Item>
        </div>
        <Form.Item
          label={t('Vehicle number')}
          name="vehicleNumber"
          rules={[{ required: true, message: t('Please enter vehicle number'), max: 100 }]}
        >
          <Input placeholder={t('Enter vehicle number')} />
        </Form.Item>
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