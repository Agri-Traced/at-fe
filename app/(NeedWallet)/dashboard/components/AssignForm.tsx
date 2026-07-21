'use client';

import { Button, Form, Modal, Select, Typography, App, Result } from "antd";
import { useTranslation } from "react-i18next";
import { useContract } from "@/blockchain/useContract";
import { usePostBatchAssignShip, usePostBatchAssignShipConfirm } from "@/hooks/batchs";
import { useCompaniesShip } from "@/hooks/company";
import { TransactionLoading } from "./TransactionLoading";

export const AssignForm = ({ open, onClose, id, }: { open: boolean; onClose: () => void; id: string | null }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<{ shipperCompanyId: string }>();
  const { mutate, isPending } = usePostBatchAssignShip()
  const { executeWrite, loading, } = useContract();
  const { modal, notification } = App.useApp();
  const { data: companies } = useCompaniesShip();
  const { mutate: confirm, isPending: isConfirming } = usePostBatchAssignShipConfirm();

  const SHIPPER_COMPANY_OPTIONS = companies?.map((company) => ({
    label: company.companyName,
    value: company.id,
  })) || [];

  console.log('SHIPPER_COMPANY_OPTIONS', SHIPPER_COMPANY_OPTIONS);

  const onFinish = async (values: { shipperCompanyId: string }) => {
    if (!id) return null;
    mutate({ id, data: values }, {
      onSuccess: async (data) => {
        const txHash = await executeWrite('assignShipper', [
          BigInt(data.blockchainId),
          data.shipperCompanyId!,
        ]);
        confirm({
          id: data.id,
          data: { shipTxHash: String(txHash) },
        }, {
          onSuccess: async () => {
            modal.success({
              icon: null,
              title: t('Batch Assigned Successfully'),
              content:
                <Result
                  status="success"
                  title={t('Batch Assigned Successfully')}
                  subTitle={t('The batch has been assigned successfully.')}
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
          {t('Assign Shipper')}
        </Typography.Text>}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label={t('Shipper Company')}
          name="shipperCompanyId"
          rules={[{ required: true, message: t('Please enter shipper company') }]}
        >
          <Select showSearch placeholder={t('Enter shipper company')} options={SHIPPER_COMPANY_OPTIONS} />
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